"use client";

interface ConversationHeaderProps {
  onBack?: () => void;
  sceneTitle: string;
  showJapanese: boolean;
  onShowJapaneseChange?: (value: boolean) => void;
}

export function ConversationHeader({
  onBack,
  sceneTitle,
  showJapanese,
  onShowJapaneseChange,
}: ConversationHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm pt-[env(safe-area-inset-top)]">
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
        {sceneTitle}
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
  );
}
