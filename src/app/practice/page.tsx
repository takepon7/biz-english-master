"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Briefcase,
  Award,
  Menu,
  ChevronDown,
  Volume2,
  Settings,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { ConversationScreen, type SceneId, type PracticeRecord } from "@/components/ConversationScreen";
import {
  getPracticeHistory,
  addPracticeItem,
  type PracticeHistoryItem,
} from "@/lib/practiceHistory";
import { getPreferredEnglishVoice } from "@/lib/speechVoice";
import {
  TIMELINE_CATEGORIES,
  getScenarioLabel,
  getScenarioSublabel,
} from "@/lib/scenarios";
import {
  COMPANY_CULTURE_OPTIONS,
  getStoredCompanyCulture,
  setStoredCompanyCulture,
  type CompanyCultureId,
} from "@/lib/companyCulture";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Day 1 - Week 1": <Coffee className="h-5 w-5" />,
  "Month 1": <Briefcase className="h-5 w-5" />,
  "Month 3": <Award className="h-5 w-5" />,
};

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

export default function PracticePage() {
  const { user } = useUser();
  const [selectedScene, setSelectedScene] = useState<SceneId>("coffee-break");
  const [showJapanese, setShowJapanese] = useState(false);
  const [companyCulture, setCompanyCulture] = useState<CompanyCultureId>("tech-startup");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<PracticeHistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PracticeHistoryItem | null>(null);

  useEffect(() => {
    setHistoryItems(getPracticeHistory());
  }, []);

  useEffect(() => {
    setCompanyCulture(getStoredCompanyCulture());
  }, []);

  const handlePracticeComplete = useCallback((record: PracticeRecord) => {
    addPracticeItem(record);
    setHistoryItems(getPracticeHistory());
  }, []);

  const userFirstName = user?.firstName ?? undefined;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-slate-700/50 bg-slate-900/95 backdrop-blur transition-transform duration-200 md:static md:translate-x-0 md:w-56 md:border-r md:bg-slate-900 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-700/50 px-4 py-3 md:justify-center">
          <span className="text-sm font-semibold text-slate-200">
            Biz English Master
          </span>
          <div className="flex items-center gap-1">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="メニューを閉じる"
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto py-3">
          <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            キャリア・タイムライン
          </p>
          <div className="space-y-4 px-2">
            {TIMELINE_CATEGORIES.map(({ phase, label: categoryLabel, scenarios }) => (
              <div key={phase}>
                <div className="mb-1.5 flex items-center gap-2 px-2 py-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-700/80 text-slate-400">
                    {CATEGORY_ICONS[phase] ?? <Briefcase className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-400">{phase}</p>
                    <p className="text-xs text-slate-500">{categoryLabel}</p>
                  </div>
                </div>
                <ul className="space-y-0.5">
                  {scenarios.map(({ id, label, sublabel }) => (
                    <li key={id}>
                      <button
                        type="button"
                        data-testid={`scene-${id}`}
                        onClick={() => {
                          setSelectedScene(id as SceneId);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${
                          selectedScene === id
                            ? "bg-sky-600/20 text-sky-300"
                            : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                        }`}
                      >
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
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-700/50 pt-3">
            <p className="mb-2 flex items-center gap-2 px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </p>
            <p className="mb-1.5 px-3 text-xs text-slate-500">Company Culture（企業文化）</p>
            <select
              value={companyCulture}
              onChange={(e) => {
                const v = e.target.value as CompanyCultureId;
                setCompanyCulture(v);
                setStoredCompanyCulture(v);
              }}
              className="mx-2 mb-2 w-[calc(100%-1rem)] rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              data-testid="company-culture-select"
            >
              {COMPANY_CULTURE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

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
                historyItems.map((item) => (
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
                          {getScenarioLabel(item.scenario)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatHistoryTime(item.timestamp)}
                        </span>
                      </button>
                    </li>
                ))
              )}
            </ul>
          </div>
        </nav>
      </aside>

      <main className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col">
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
            scenarioLabel={`${getScenarioLabel(selectedHistoryItem.scenario)} · ${getScenarioSublabel(selectedHistoryItem.scenario)}`}
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
              className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col"
            >
              <ConversationScreen
                scene={selectedScene}
                onBack={() => setSidebarOpen(true)}
                showJapanese={showJapanese}
                onShowJapaneseChange={setShowJapanese}
                companyCulture={companyCulture}
                userFirstName={userFirstName}
                userEmail={user?.primaryEmailAddress?.emailAddress ?? undefined}
                onPracticeComplete={handlePracticeComplete}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
