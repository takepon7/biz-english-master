"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "pwa-add-to-homescreen-seen";

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function AddToHomeScreenBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!isIOS() || isStandalone()) return;
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 max-w-sm rounded-xl border border-slate-600 bg-slate-800/95 p-4 shadow-lg backdrop-blur sm:left-auto sm:right-4"
      role="dialog"
      aria-label="ホーム画面に追加のご案内"
    >
      <p className="mb-3 text-sm text-slate-200">
        アプリのように使うには、共有ボタン
        <span className="mx-1 inline-block rounded bg-slate-600 px-1 font-medium">↑</span>
        から「ホーム画面に追加」をタップしてください。
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="w-full rounded-lg bg-slate-700 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
      >
        閉じる
      </button>
    </div>
  );
}
