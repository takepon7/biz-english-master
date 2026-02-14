"use client";

const SKELETON_BAR = "rounded animate-pulse bg-gray-200 dark:bg-slate-600";

/**
 * AI 回答待機中に表示するスケルトン。
 * Refactored English / Coaching Note / Next Dialogue の3領域に対応した形状。
 * 行の長さを意図的にバラバラにして「テキストが現れる予定」を直感的に伝える。
 */
export function ResponseSkeleton() {
  return (
    <div className="mb-4 space-y-3" aria-hidden aria-busy="true">
      {/* Refactored English 領域 */}
      <div className="rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 dark:border-slate-600/50">
        <div className={`mb-2 h-3 w-24 rounded ${SKELETON_BAR}`} />
        <div className="space-y-2">
          <div className={`h-4 ${SKELETON_BAR}`} style={{ width: "92%" }} />
          <div className={`h-4 ${SKELETON_BAR}`} style={{ width: "68%" }} />
          <div className={`h-4 ${SKELETON_BAR}`} style={{ width: "45%" }} />
          <div className={`h-4 ${SKELETON_BAR}`} style={{ width: "78%" }} />
        </div>
      </div>

      {/* Coaching Note 領域 */}
      <div className="rounded-lg bg-slate-800/60 px-3 py-2">
        <div className={`h-3 rounded ${SKELETON_BAR}`} style={{ width: "36%" }} />
        <div className="mt-2 space-y-2">
          <div className={`h-3 ${SKELETON_BAR}`} style={{ width: "88%" }} />
          <div className={`h-3 ${SKELETON_BAR}`} style={{ width: "55%" }} />
          <div className={`h-3 ${SKELETON_BAR}`} style={{ width: "72%" }} />
        </div>
      </div>

      {/* Next Dialogue（反復練習ブロック）領域 */}
      <div className="rounded-xl border-2 border-slate-600/50 bg-slate-800/40 px-4 py-3">
        <div className={`mb-2 h-3 rounded ${SKELETON_BAR}`} style={{ width: "28%" }} />
        <div className="mb-3 space-y-2">
          <div className={`h-3 ${SKELETON_BAR}`} style={{ width: "85%" }} />
          <div className={`h-3 ${SKELETON_BAR}`} style={{ width: "60%" }} />
        </div>
        <div className={`h-10 rounded-lg ${SKELETON_BAR}`} />
      </div>
    </div>
  );
}
