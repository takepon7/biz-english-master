"use client";

import { Info, Sparkles } from "lucide-react";

interface ErrorBannerProps {
  error: string | null;
  dailyLimitReached: boolean;
  quotaExceededCountdown: number;
  onUpgradeClick?: () => void;
}

export function ErrorBanner({
  error,
  dailyLimitReached,
  quotaExceededCountdown,
  onUpgradeClick,
}: ErrorBannerProps) {
  return (
    <>
      {quotaExceededCountdown > 0 && (
        <div className="shrink-0 mx-3 mb-2 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-sm text-amber-900">
          <p className="flex items-center gap-2 font-medium">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            本日の利用制限に達しました。あと {quotaExceededCountdown} 秒後に再試行できます。
          </p>
          <p className="text-amber-800">
            Proプランなら、制限なしでさらに英語を上達させることができます！
          </p>
          {onUpgradeClick && (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="self-start inline-flex items-center gap-1.5 rounded-lg bg-amber-500/25 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-500/35 transition"
            >
              <Sparkles className="h-4 w-4" />
              Pro プランへアップグレード
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="shrink-0 mx-3 mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{error}</p>
          {dailyLimitReached && onUpgradeClick && (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-500/30"
            >
              <Sparkles className="h-4 w-4" />
              Pro プランへアップグレード
            </button>
          )}
        </div>
      )}
    </>
  );
}
