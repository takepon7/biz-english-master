"use client";

import { ChevronDown, MessageCircle, RotateCcw } from "lucide-react";
import type { AssistantMessagePayload } from "./types";

interface AssistantMessageProps {
  payload: AssistantMessagePayload;
  showJapanese: boolean;
  showRetryButton: boolean;
  onRetry: (refactoredText: string) => void;
}

export function AssistantMessage({
  payload,
  showJapanese,
  showRetryButton,
  onRetry,
}: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[90%] gap-1.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300">
          <MessageCircle className="h-3.5 w-3.5 text-gray-600" />
        </div>
        <div
          data-testid="assistant-bubble"
          className="min-w-0 rounded-xl rounded-bl-md bg-gray-200 px-3 py-2 text-gray-900 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {payload.nextDialogue}
          </p>
          {showJapanese && payload.nextJp && (
            <p className="mt-1 border-t border-gray-300 pt-1 text-xs text-gray-600 leading-snug" data-testid="assistant-translation">
              {payload.nextJp}
            </p>
          )}
          {(payload.refactored || payload.analysis) && (
            <details className="mt-2 group border-t border-gray-300 pt-2">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">▶ 添削と解説を見る</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 hidden group-open:inline-block rotate-180 transition-transform" />
              </summary>
              <div className="mt-1.5 space-y-1.5 text-xs text-gray-700 leading-snug">
                {payload.refactored && (
                  <p><span className="font-medium">プロの英語:</span> {payload.refactored}</p>
                )}
                {payload.note && (
                  <p className="italic">{payload.note}</p>
                )}
                {payload.analysis && (
                  <p className="whitespace-pre-wrap">{payload.analysis}</p>
                )}
              </div>
            </details>
          )}
          {payload.refactored && showRetryButton && (
            <button
              type="button"
              onClick={() => onRetry(payload.refactored!)}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 py-2 text-xs font-medium text-sky-700 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              🔄 Try Again with Hints
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
