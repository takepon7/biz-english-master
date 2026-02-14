"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  User,
  MessageCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { createStreamParser } from "@/lib/streamParser";

export type SceneId =
  | "job-interview"
  | "first-team-intro"
  | "morning-sync"
  | "lunch-small-talk"
  | "exec-report"
  | "signing-off";

const SCENE_LABELS: Record<SceneId, string> = {
  "job-interview": "Job Interview",
  "first-team-intro": "First Team Intro",
  "morning-sync": "Morning Sync",
  "lunch-small-talk": "Lunch Small Talk",
  "exec-report": "Exec Report",
  "signing-off": "Signing Off",
};

const SCENE_OPENING: Record<SceneId, string> = {
  "job-interview":
    "Thanks for coming in. To start, could you walk me through your background and why you're interested in this role?",
  "first-team-intro":
    "Hey, welcome to the team! We do a quick round of intros—tell us a bit about yourself and what you'll be working on.",
  "morning-sync":
    "Good morning. Let's do a quick sync—what's on your plate today and any blockers?",
  "lunch-small-talk":
    "Hey, want to grab lunch? How's your week going so far?",
  "exec-report":
    "We have a few minutes. Can you give us a quick update on the project and what you need from leadership?",
  "signing-off":
    "Heading out soon? Anything we should know before you go?",
};

const SCENE_OPENING_JP: Record<SceneId, string> = {
  "job-interview": "お越しくださいましてありがとうございます。まず、ご経歴とこのポジションに興味を持った理由を聞かせてください。",
  "first-team-intro": "ようこそ！簡単に自己紹介をお願いします。あなたについてと、どんな仕事を担当するか教えてください。",
  "morning-sync": "おはよう。さっと同期しよう。今日の予定と、ブロッカーはある？",
  "lunch-small-talk": "ランチ行く？今週どう？",
  "exec-report": "数分ある。プロジェクトの進捗と、リーダーシップに必要なことを簡潔に教えて。",
  "signing-off": "もう帰る？こっちで把握しておくことはある？",
};

export interface CoachResponse {
  refactoredEnglish: string;
  coachingNote: string;
  nextDialogue: string;
  japanese_translation?: { refactored: string; nextDialogue: string };
}

interface ConversationScreenProps {
  scene: SceneId;
  onBack?: () => void;
  showJapanese: boolean;
  onShowJapaneseChange?: (value: boolean) => void;
}

export function ConversationScreen({
  scene,
  onBack,
  showJapanese,
  onShowJapaneseChange,
}: ConversationScreenProps) {
  const [partnerLine, setPartnerLine] = useState(SCENE_OPENING[scene]);
  const [partnerLineJapanese, setPartnerLineJapanese] = useState(
    () => SCENE_OPENING_JP[scene] ?? ""
  );
  const [history, setHistory] = useState<
    { role: "user" | "partner"; text: string }[]
  >([]);
  const [lastCoach, setLastCoach] = useState<CoachResponse | null>(null);
  const [streamingState, setStreamingState] = useState<{
    refactored: string;
    note: string;
    next: string;
    refactoredJp: string;
    nextJp: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCoaching, setShowCoaching] = useState(true);
  const resultBlockRef = useRef<HTMLDivElement>(null);

  const handleFinalTranscript = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setError(null);
      setStreamingState(null);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scene,
            userMessage: text.trim(),
            history,
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
          setStreamingState({
            refactored: state.refactored,
            note: state.note,
            next: state.next,
            refactoredJp: state.refactoredJp,
            nextJp: state.nextJp,
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
        setLastCoach({
          refactoredEnglish: final.refactored,
          coachingNote: final.note,
          nextDialogue: final.next,
          japanese_translation: {
            refactored: final.refactoredJp,
            nextDialogue: final.nextJp,
          },
        });
        if (final.next) {
          setPartnerLine(final.next);
          setPartnerLineJapanese(final.nextJp);
          setHistory((prev) => [
            ...prev,
            { role: "user", text: text.trim() },
            { role: "partner", text: final.next },
          ]);
        }
        setStreamingState(null);
        setShowCoaching(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed");
      } finally {
        setLoading(false);
      }
    },
    [scene, history]
  );

  useEffect(() => {
    if (!streamingState && !lastCoach) return;
    resultBlockRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [streamingState?.refactored, streamingState?.note, streamingState?.next, lastCoach]);

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
    onResult(transcript, isFinal) {
      if (isFinal && transcript.trim()) handleFinalTranscript(transcript.trim());
    },
  });

  const isListening = status === "listening";
  const displayUserText =
    transcript || interimTranscript || "Tap the mic and speak in English.";
  const displayRefactored = streamingState?.refactored ?? lastCoach?.refactoredEnglish ?? "";
  const displayNote = streamingState?.note ?? lastCoach?.coachingNote ?? "";
  const displayNext = streamingState?.next ?? "";
  const displayRefactoredJp = streamingState?.refactoredJp ?? lastCoach?.japanese_translation?.refactored ?? "";
  const displayNextJp = streamingState?.nextJp ?? "";
  const hasResult = !!displayRefactored || !!lastCoach?.refactoredEnglish;
  const isStreaming = !!streamingState;

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat = (text: string) => handleFinalTranscript(text);
    return () => {
      delete (window as unknown as { __e2eTriggerChat?: (text: string) => Promise<void> }).__e2eTriggerChat;
    };
  }, [handleFinalTranscript]);

  const handlePracticeClick = () => {
    if (!lastCoach?.refactoredEnglish) return;
    resetTranscript();
    setError(null);
    start();
  };

  const handleClearAndNext = () => {
    resetTranscript();
    setLastCoach(null);
    setError(null);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-900 text-white">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700/50 px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            ← シーン
          </button>
        ) : (
          <div className="w-16" aria-hidden />
        )}
        <span data-testid="scene-title" className="min-w-0 truncate text-center text-sm font-medium text-slate-400">
          {SCENE_LABELS[scene]}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-slate-500">日本語訳（JP）</span>
          <button
            type="button"
            role="switch"
            aria-checked={showJapanese}
            aria-label="日本語訳を表示"
            data-testid="jp-toggle"
            onClick={() => onShowJapaneseChange?.(!showJapanese)}
            className={`relative inline-flex h-6 w-10 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              showJapanese ? "bg-sky-600" : "bg-slate-600"
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

      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4">
        {/* 相手のセリフ */}
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
            <MessageCircle className="h-4 w-4 text-slate-300" />
          </div>
          <div data-testid="partner-line" className="min-w-0 flex-1 rounded-2xl bg-slate-800/90 px-4 py-3">
            <p className="text-slate-100 leading-relaxed">{partnerLine}</p>
            {showJapanese && partnerLineJapanese && (
              <p data-testid="partner-line-jp" className="mt-2 border-t border-slate-700/50 pt-2 text-xs text-slate-400">
                {partnerLineJapanese}
              </p>
            )}
          </div>
        </div>

        {/* プロの英語・コーチング・反復練習（ストリーミング中はリアルタイム表示＋震え・カーソル） */}
        {hasResult && (
          <div
            ref={resultBlockRef}
            className={`mb-4 space-y-3 ${isStreaming ? "animate-stream-shake" : ""}`}
            style={isStreaming ? { animationIterationCount: "infinite", animationDuration: "0.6s" } : undefined}
          >
            <div data-testid="refactored-block" className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-400">
                プロの英語
              </p>
              <p className="text-emerald-100 leading-relaxed">
                {displayRefactored}
                {isStreaming && (
                  <span className="animate-stream-cursor ml-0.5 inline-block h-4 w-0.5 bg-emerald-400 align-middle" aria-hidden />
                )}
              </p>
              {showJapanese && displayRefactoredJp && (
                <p data-testid="refactored-jp" className="mt-2 border-t border-emerald-800/50 pt-2 text-xs text-emerald-300/90">
                  {displayRefactoredJp}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowCoaching((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-700"
            >
              <span>コーチングメモ</span>
              {showCoaching ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showCoaching && displayNote && (
              <p className="rounded-lg bg-slate-800/80 px-3 py-2 text-sm italic text-slate-300">
                {displayNote}
              </p>
            )}
            <div className="rounded-xl border-2 border-sky-500/60 bg-sky-950/40 px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-sky-300">
                反復練習
              </p>
              <p className="mb-3 text-sm text-slate-200">
                上の「プロの英語」をマイクで言い直して練習しましょう。
              </p>
              <button
                type="button"
                onClick={handlePracticeClick}
                disabled={!isSupported || isListening || isStreaming}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                もう一度話して練習する
              </button>
              <button
                type="button"
                onClick={handleClearAndNext}
                className="mt-2 w-full rounded-lg py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                次へ進む
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mb-2 rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        {loading && (
          <p className="mb-2 text-sm text-slate-400">コーチングを生成しています…</p>
        )}

        <div className="mt-auto flex items-start gap-3 rounded-xl bg-slate-800 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
            <User className="h-4 w-4 text-slate-400" />
          </div>
          <p
            className={`min-h-[2.25rem] flex-1 pt-1.5 text-sm leading-relaxed ${
              transcript || interimTranscript ? "text-slate-100" : "text-slate-500"
            } ${interimTranscript ? "italic" : ""}`}
          >
            {displayUserText}
          </p>
        </div>
      </section>

      <section className="shrink-0 border-t border-slate-700/50 bg-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          {(transcript || interimTranscript) && !isListening && !loading && (
            <button
              type="button"
              onClick={handleClearAndNext}
              className="rounded-full px-4 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              クリア
            </button>
          )}
          <button
            type="button"
            onClick={() => (isListening ? stop() : start())}
            disabled={!isSupported || loading}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isSupported && !loading
                ? isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-sky-600 hover:bg-sky-500"
                : "cursor-not-allowed bg-slate-600"
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-7 w-7 text-white" />
            ) : (
              <Mic className="h-7 w-7 text-white" />
            )}
          </button>
        </div>
        {!isSupported && (
          <p className="mt-2 text-center text-xs text-amber-400">
            音声認識は Chrome 等でご利用ください。
          </p>
        )}
      </section>
    </div>
  );
}
