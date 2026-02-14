"use client";

import { useState } from "react";
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
} from "lucide-react";
import { ConversationScreen, type SceneId } from "@/components/ConversationScreen";

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

export default function Home() {
  const [selectedScene, setSelectedScene] = useState<SceneId>("job-interview");
  const [showJapanese, setShowJapanese] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </nav>
      </aside>

      {/* メイン：会話エリア（サイドバー幅分だけ右に配置、モバイルは全幅） */}
      <main className="relative min-h-0 min-w-0 flex-1 flex flex-col">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="absolute left-3 top-3 z-10 rounded-lg bg-slate-800/90 p-2 text-slate-400 hover:bg-slate-700 hover:text-white md:hidden"
          aria-label="シーンを選択"
        >
          <Menu className="h-5 w-5" />
        </button>

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
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
