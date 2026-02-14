"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Sun,
  Coffee,
  BarChart3,
  LogOut,
  Menu,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { ConversationScreen, type SceneId, type PracticeRecord } from "@/components/ConversationScreen";
import {
  getPracticeHistory,
  addPracticeItem,
  type PracticeHistoryItem,
} from "@/lib/practiceHistory";
import { getPreferredEnglishVoice } from "@/lib/speechVoice";

const SCENES: {
  id: SceneId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "job-interview",
    label: "Job Interview",
    sublabel: "採用面接",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: "first-team-intro",
    label: "First Team Intro",
    sublabel: "入社時の自己紹介",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "morning-sync",
    label: "Morning Sync",
    sublabel: "朝のミーティング",
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: "lunch-small-talk",
    label: "Lunch Small Talk",
    sublabel: "同僚とのランチ",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    id: "exec-report",
    label: "Exec Report",
    sublabel: "役員への進捗報告",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: "signing-off",
    label: "Signing Off",
    sublabel: "退社時の挨拶",
    icon: <LogOut className="h-5 w-5" />,
  },
];

function formatHistoryTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryDetailPanel({
  item,
  scenarioLabel,
  onClose,
}: {
  item: PracticeHistoryItem;
  scenarioLabel: string;
  onClose: () => void;
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !text.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.lang = "en-US";
    u.rate = 0.95;
    const preferred = getPreferredEnglishVoice();
    if (preferred) u.voice = preferred;
    u.onstart = () => setIsSpeaking(true);
    u.onend = u.onerror = () => setIsSpeaking(false);
    synth.speak(u);
  }, []);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const text = item.refactoredText ?? (item as unknown as { refactoredEnglish?: string }).refactoredEnglish;
  const userText = item.userInput ?? (item as unknown as { userMessage?: string }).userMessage;

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-4">
      <button
        type="button"
        onClick={onClose}
        className="mb-4 self-start rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        ← 一覧に戻る
      </button>
      <div className="space-y-4 text-sm">
        <p className="text-xs text-slate-500">
          {scenarioLabel} · {formatHistoryTime(item.timestamp)}
        </p>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">発話内容</p>
          <p className="rounded-lg bg-slate-800/80 px-3 py-2 text-slate-200">{userText || "—"}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">プロの英語（修正案）</p>
            {text && (
              <button
                type="button"
                onClick={() => speak(text)}
                aria-label="読み上げる"
                className={`shrink-0 rounded p-1.5 text-emerald-400 hover:bg-emerald-800/50 ${isSpeaking ? "animate-pulse text-sky-300" : ""}`}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-emerald-100">
            {text || "—"}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">コーチングノート</p>
          <p className="rounded-lg bg-slate-800/80 px-3 py-2 italic text-slate-300">{item.coachingNote || "—"}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedScene, setSelectedScene] = useState<SceneId>("job-interview");
  const [showJapanese, setShowJapanese] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<PracticeHistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PracticeHistoryItem | null>(null);

  // localStorage はクライアントのみのため、useEffect で読み込みハイドレーションエラーを防ぐ
  useEffect(() => {
    setHistoryItems(getPracticeHistory());
  }, []);

  const handlePracticeComplete = useCallback((record: PracticeRecord) => {
    addPracticeItem(record);
    setHistoryItems(getPracticeHistory());
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* モバイル：サイドバー表示時の背面オーバーレイ */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* サイドバー：シーン選択（md以上で常時表示、モバイルはオーバーレイ） */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/95 backdrop-blur transition-transform duration-200 md:static md:translate-x-0 md:w-56 md:border-r md:bg-slate-900 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 px-4 py-3 md:justify-center">
          <span className="text-sm font-semibold text-slate-200">
            Biz English Master
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="メニューを閉じる"
          >
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto py-3">
          <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            シーン
          </p>
          <ul className="space-y-0.5 px-2">
            {SCENES.map(({ id, label, sublabel, icon }) => (
              <li key={id}>
                <button
                  type="button"
                  data-testid={`scene-${id}`}
                  onClick={() => {
                    setSelectedScene(id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    selectedScene === id
                      ? "bg-sky-600/20 text-sky-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/80 text-slate-300">
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {label}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {sublabel}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-slate-700/50 pt-3">
            <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
              Practice History
            </p>
            <ul className="space-y-0.5 px-2">
              {historyItems.length === 0 ? (
                <li className="px-3 py-2 text-xs text-slate-500">
                  まだ履歴はありません
                </li>
              ) : (
                historyItems.map((item) => {
                  const sceneInfo = SCENES.find((s) => s.id === item.scenario);
                  const scenarioLabel = sceneInfo?.sublabel ?? sceneInfo?.label ?? item.scenario;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-testid={`history-${item.id}`}
                        onClick={() => {
                          setSelectedHistoryItem(item);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-slate-100 ${
                          selectedHistoryItem?.id === item.id ? "bg-slate-800 text-slate-100" : ""
                        }`}
                      >
                        <span className="truncate text-sm font-medium">
                          {scenarioLabel}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatHistoryTime(item.timestamp)}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </nav>
      </aside>

      {/* メイン：会話エリア または 履歴詳細（クリック時はメイン画面に表示） */}
      <main className="relative min-h-0 min-w-0 flex-1 flex flex-col">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-3 top-3 z-10 rounded-lg bg-slate-800/90 p-2 text-slate-400 hover:bg-slate-700 hover:text-white md:hidden"
          aria-label="シーンを選択"
        >
          <Menu className="h-5 w-5" />
        </button>

        {selectedHistoryItem ? (
          <HistoryDetailPanel
            item={selectedHistoryItem}
            scenarioLabel={
              SCENES.find((s) => s.id === selectedHistoryItem.scenario)?.sublabel ??
              SCENES.find((s) => s.id === selectedHistoryItem.scenario)?.label ??
              selectedHistoryItem.scenario
            }
            onClose={() => setSelectedHistoryItem(null)}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative min-h-full min-w-full flex-1"
            >
              <ConversationScreen
                scene={selectedScene}
                onBack={() => setSidebarOpen(true)}
                showJapanese={showJapanese}
                onShowJapaneseChange={setShowJapanese}
                onPracticeComplete={handlePracticeComplete}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
