"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPreferredEnglishVoice, speakWithWarmup } from "@/lib/speechVoice";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { createStreamParser } from "@/lib/streamParser";
import {
  type SceneId,
  SCENE_OPENING,
  SCENE_OPENING_JP,
} from "@/lib/scenarios";
import type { CompanyCultureId } from "@/lib/companyCulture";
import type {
  AssistantMessagePayload,
  ChatMessage,
  PracticeRecord,
} from "@/components/conversation/types";
import { createId } from "@/components/conversation/helpers";

interface UseConversationOptions {
  scene: SceneId;
  companyCulture?: CompanyCultureId;
  onPracticeComplete?: (record: PracticeRecord) => void;
}

export function useConversation({
  scene,
  companyCulture,
  onPracticeComplete,
}: UseConversationOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "opening",
      role: "assistant",
      payload: {
        nextDialogue: SCENE_OPENING[scene],
        nextJp: SCENE_OPENING_JP[scene],
      },
    },
  ]);
  const [inputDraft, setInputDraft] = useState("");
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [streamingPayload, setStreamingPayload] = useState<Partial<AssistantMessagePayload> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [quotaExceededCountdown, setQuotaExceededCountdown] = useState(0);
  const [hintMode, setHintMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const didAutoTTSRef = useRef(false);

  useEffect(() => {
    if (quotaExceededCountdown <= 0) return;
    const t = setInterval(() => {
      setQuotaExceededCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [quotaExceededCountdown]);

  const handleRetryWithHint = useCallback((refactoredText: string) => {
    setMessages((prev) => {
      if (prev.length >= 2 && prev[prev.length - 2].role === "user" && prev[prev.length - 1].role === "assistant") {
        return prev.slice(0, -2);
      }
      return prev;
    });
    setInputDraft(refactoredText);
    setHintMode(true);
    setError(null);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !text.trim()) return;
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text.trim());
    u.lang = "en-US";
    u.rate = 0.95;
    const preferred = getPreferredEnglishVoice();
    if (preferred) u.voice = preferred;
    speechUtteranceRef.current = u;
    u.onend = u.onerror = () => {
      speechUtteranceRef.current = null;
    };
    speakWithWarmup(synth, u);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
      setDailyLimitReached(false);
      setQuotaExceededCountdown(0);
      setInputDraft("");
      setHintMode(false);
      setStreamingPayload(null);
      didAutoTTSRef.current = false;

      const userMsg: ChatMessage = { id: createId(), role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const history = messages.flatMap((m): { role: "user" | "partner"; text: string }[] =>
        m.role === "user"
          ? [{ role: "user", text: m.text }]
          : m.role === "assistant"
            ? [{ role: "partner", text: m.payload.nextDialogue }]
            : []
      );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scene,
            userMessage: trimmed,
            history: history.length ? history : undefined,
            companyCulture: companyCulture ?? undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.errorType === "QUOTA_EXCEEDED") {
            const sec = typeof data.retryAfter === "number" ? Math.max(1, data.retryAfter) : 10;
            setQuotaExceededCountdown(sec);
            setError(null);
            setDailyLimitReached(false);
            return;
          }
          setError(data.detail ?? data.error ?? "Request failed");
          setDailyLimitReached(res.status === 429);
          setQuotaExceededCountdown(0);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          setError("No response body");
          return;
        }

        const parser = createStreamParser((state) => {
          setStreamingPayload({
            nextDialogue: state.next,
            nextJp: state.nextJp,
            refactored: state.refactored,
            refactoredJp: state.refactoredJp,
            analysis: state.analysis,
          });
        });

        const readChunk = async (): Promise<void> => {
          const { done, value } = await reader.read();
          if (done) return;
          const chunk = value ? decoder.decode(value, { stream: true }) : "";
          if (chunk) parser.processChunk(chunk);
          return readChunk();
        };
        await readChunk();

        const final = parser.getState();
        const payload: AssistantMessagePayload = {
          nextDialogue: final.next,
          nextJp: final.nextJp,
          refactored: final.refactored,
          refactoredJp: final.refactoredJp,
          analysis: final.analysis,
        };
        setMessages((prev) => [...prev, { id: createId(), role: "assistant", payload }]);
        setStreamingPayload(null);

        onPracticeComplete?.({
          scenario: scene,
          userInput: trimmed,
          refactoredText: final.refactored,
          coachingNote: final.analysis ?? "",
        });

        if (final.next && !didAutoTTSRef.current) {
          didAutoTTSRef.current = true;
          speak(final.next);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed");
        setDailyLimitReached(false);
      } finally {
        setLoading(false);
      }
    },
    [scene, messages, companyCulture, onPracticeComplete, speak]
  );

  const {
    start,
    stop,
    resetTranscript,
    status,
    transcript,
    interimTranscript,
    isSupported,
  } = useSpeechRecognition({
    lang: "en-US",
    interimResults: true,
    continuous: false,
    onResult(fullTranscript, isFinal) {
      if (isFinal && fullTranscript.trim()) setInputDraft(fullTranscript.trim());
    },
  });

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      speechUtteranceRef.current = null;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingPayload]);

  const isListening = status === "listening";
  const inputValue = isListening ? (transcript + (interimTranscript ? ` ${interimTranscript}` : "")).trim() : inputDraft;
  const inputDisplay = inputValue || (isListening ? "Listening…" : "話すか、英文を入力して送信");
  const canSend =
    !loading &&
    quotaExceededCountdown <= 0 &&
    (isListening ? transcript.trim() : inputDraft.trim());

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat = (text: string) =>
      sendMessage(text);
    return () => {
      delete (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat;
    };
  }, [sendMessage]);

  return {
    messages,
    inputDraft,
    streamingPayload,
    loading,
    error,
    dailyLimitReached,
    quotaExceededCountdown,
    hintMode,
    isListening,
    isSupported,
    inputValue,
    inputDisplay,
    canSend,
    transcript,
    chatEndRef,
    setInputDraft,
    setHintMode,
    sendMessage,
    handleRetryWithHint,
    startListening: start,
    stopListening: stop,
    resetTranscript,
  };
}
