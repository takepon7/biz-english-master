"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  MessageCircle,
  Send,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { getPreferredEnglishVoice } from "@/lib/speechVoice";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { createStreamParser } from "@/lib/streamParser";
import { ResponseSkeleton } from "@/components/ResponseSkeleton";
import {
  type SceneId,
  SCENE_OPENING,
  SCENE_OPENING_JP,
  getScenarioLabel,
} from "@/lib/scenarios";
import type { CompanyCultureId } from "@/lib/companyCulture";

export type { SceneId };

/** 1件のAI返答（添削・Next Dialogue 含む） */
export interface AssistantMessagePayload {
  nextDialogue: string;
  nextJp?: string;
  refactored?: string;
  refactoredJp?: string;
  note?: string;
  analysis?: string;
}

export interface CoachResponse extends AssistantMessagePayload {
  refactoredEnglish: string;
  coachingNote: string;
  japanese_translation?: { refactored: string; nextDialogue: string };
}

export interface PracticeRecord {
  scenario: SceneId;
  userInput: string;
  refactoredText: string;
  coachingNote: string;
}

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; payload: AssistantMessagePayload };

interface ConversationScreenProps {
  scene: SceneId;
  onBack?: () => void;
  showJapanese: boolean;
  onShowJapaneseChange?: (value: boolean) => void;
  companyCulture?: CompanyCultureId;
  userFirstName?: string | null;
  onPracticeComplete?: (record: PracticeRecord) => void;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ConversationScreen({
  scene,
  onBack,
  showJapanese,
  onShowJapaneseChange,
  companyCulture,
  userFirstName,
  onPracticeComplete,
}: ConversationScreenProps) {
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [streamingPayload, setStreamingPayload] = useState<Partial<AssistantMessagePayload> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintMode, setHintMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const didAutoTTSRef = useRef(false);

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
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.lang = "en-US";
    u.rate = 0.95;
    const preferred = getPreferredEnglishVoice();
    if (preferred) u.voice = preferred;
    speechUtteranceRef.current = u;
    u.onstart = () => setIsSpeaking(true);
    u.onend = u.onerror = () => {
      setIsSpeaking(false);
      speechUtteranceRef.current = null;
    };
    synth.speak(u);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
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
          setError(data.detail ?? data.error ?? "Request failed");
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
  const canSend = !loading && (isListening ? transcript.trim() : inputDraft.trim());

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat = (text: string) =>
      sendMessage(text);
    return () => {
      delete (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat;
    };
  }, [sendMessage]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50 text-gray-900">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            ← シーン
          </button>
        ) : (
          <div className="w-16" aria-hidden />
        )}
        <span data-testid="scene-title" className="min-w-0 truncate text-center text-sm font-medium text-gray-700">
          {getScenarioLabel(scene)}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-gray-500">日本語訳（JP）</span>
          <button
            type="button"
            role="switch"
            aria-checked={showJapanese}
            aria-label="日本語訳を表示"
            data-testid="jp-toggle"
            onClick={() => onShowJapaneseChange?.(!showJapanese)}
            className={`relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
              showJapanese ? "bg-sky-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                showJapanese ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 px-3 py-2">
        {userFirstName && (
          <p className="mb-2 text-sm text-gray-600" data-testid="welcome-message">
            Welcome, {userFirstName}!
          </p>
        )}
        <div className="space-y-2">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div
                  data-testid="user-bubble"
                  className="max-w-[85%] rounded-xl rounded-br-md bg-sky-600 px-3 py-2 text-white shadow-sm"
                >
                  <p className="text-sm leading-snug">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div className="flex max-w-[90%] gap-1.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300">
                    <MessageCircle className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  <div
                    data-testid="assistant-bubble"
                    className="min-w-0 rounded-xl rounded-bl-md bg-gray-200 px-3 py-2 text-gray-900 shadow-sm"
                  >
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      {msg.payload.nextDialogue}
                    </p>
                    {showJapanese && msg.payload.nextJp && (
                      <p className="mt-1 border-t border-gray-300 pt-1 text-xs text-gray-600 leading-snug" data-testid="assistant-translation">
                        {msg.payload.nextJp}
                      </p>
                    )}
                    {(msg.payload.refactored || msg.payload.analysis) && (
                      <details className="mt-2 group border-t border-gray-300 pt-2">
                        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">▶ 添削と解説を見る</span>
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 hidden group-open:inline-block rotate-180 transition-transform" />
                        </summary>
                        <div className="mt-1.5 space-y-1.5 text-xs text-gray-700 leading-snug">
                          {msg.payload.refactored && (
                            <p><span className="font-medium">プロの英語:</span> {msg.payload.refactored}</p>
                          )}
                          {msg.payload.note && (
                            <p className="italic">{msg.payload.note}</p>
                          )}
                          {msg.payload.analysis && (
                            <p className="whitespace-pre-wrap">{msg.payload.analysis}</p>
                          )}
                        </div>
                      </details>
                    )}
                    {msg.payload.refactored &&
                      messages.length >= 2 &&
                      messages[messages.length - 1].id === msg.id && (
                        <button
                          type="button"
                          onClick={() => handleRetryWithHint(msg.payload.refactored!)}
                          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 py-2 text-xs font-medium text-sky-700 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                          🔄 Try Again with Hints
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )
          )}

          {loading && !streamingPayload?.nextDialogue ? (
            <div className="flex justify-start">
              <ResponseSkeleton />
            </div>
          ) : streamingPayload ? (
            <div className="flex justify-start">
              <div className="flex max-w-[90%] gap-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300">
                  <MessageCircle className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="min-w-0 rounded-xl rounded-bl-md bg-gray-200 px-3 py-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {streamingPayload.nextDialogue}
                    <span className="animate-stream-cursor ml-0.5 inline-block h-4 w-0.5 bg-gray-600 align-middle" aria-hidden />
                  </p>
                  {showJapanese && streamingPayload.nextJp && (
                    <p className="mt-1 border-t border-gray-300 pt-1 text-xs text-gray-600 leading-snug" data-testid="streaming-translation">
                      {streamingPayload.nextJp}
                      <span className="animate-stream-cursor ml-0.5 inline-block h-3 w-0.5 bg-gray-500 align-middle" aria-hidden />
                    </p>
                  )}
                  <details className="mt-2 group border-t border-gray-300 pt-2">
                    <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-gray-600 [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">▶ 添削と解説を見る</span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 hidden group-open:inline-block rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-1.5 space-y-1.5 text-xs text-gray-700 leading-snug">
                      {(streamingPayload.refactored || streamingPayload.analysis) && (
                        <>
                          {streamingPayload.refactored && (
                            <p><span className="font-medium">プロの英語:</span> {streamingPayload.refactored}</p>
                          )}
                          {streamingPayload.note && <p className="italic">{streamingPayload.note}</p>}
                          {streamingPayload.analysis && (
                            <p className="whitespace-pre-wrap">{streamingPayload.analysis}</p>
                          )}
                        </>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div ref={chatEndRef} aria-hidden />
      </section>

      {error && (
        <p className="shrink-0 mx-3 mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="shrink-0 w-full border-t border-gray-200 bg-white px-3 pt-3">
        <div className="flex w-full items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
          <div className="flex min-h-[2.5rem] flex-1 flex-col justify-center">
            {isListening ? (
              <p
                className={`min-h-[2.25rem] py-2 text-sm leading-relaxed ${
                  inputValue ? "text-gray-900" : "text-gray-500 italic"
                }`}
              >
                {inputDisplay}
              </p>
            ) : (
              <textarea
                value={inputDraft}
                onChange={(e) => {
                  setInputDraft(e.target.value);
                  if (hintMode) setHintMode(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (inputDraft.trim()) sendMessage(inputDraft);
                  }
                }}
                placeholder={hintMode ? "" : "話すか、英文を入力して送信"}
                rows={1}
                className={`min-h-[2.25rem] w-full resize-none bg-transparent py-2 text-sm leading-relaxed placeholder:text-gray-500 focus:outline-none ${
                  hintMode ? "text-gray-500 italic" : "text-gray-900"
                }`}
                disabled={loading}
              />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => (isListening ? stop() : start())}
              disabled={!isSupported || loading}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                isSupported && !loading
                  ? isListening
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
              aria-label={isListening ? "音声認識を停止" : "音声入力"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stop();
                  if (transcript.trim()) setInputDraft(transcript.trim());
                  resetTranscript();
                } else if (inputDraft.trim()) {
                  sendMessage(inputDraft);
                }
              }}
              disabled={!canSend && !isListening}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              aria-label="送信"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isListening && (
          <p className="mt-1.5 text-center text-xs text-gray-500">
            認識中… 止めると入力欄に反映されます。編集してから送信できます。
          </p>
        )}
        {!isSupported && (
          <p className="mt-2 text-center text-xs text-amber-600">
            音声認識は Chrome 等でご利用ください。
          </p>
        )}
      </div>
    </div>
  );
}
