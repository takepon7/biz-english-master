"use client";

import { ChevronDown, MessageCircle } from "lucide-react";
import type { AssistantMessagePayload } from "./types";

interface StreamingMessageProps {
  payload: Partial<AssistantMessagePayload>;
  showJapanese: boolean;
}

export function StreamingMessage({ payload, showJapanese }: StreamingMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[90%] gap-1.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300">
          <MessageCircle className="h-3.5 w-3.5 text-gray-600" />
        </div>
        <div className="min-w-0 rounded-xl rounded-bl-md bg-gray-200 px-3 py-2 shadow-sm">
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {payload.nextDialogue}
            <span className="animate-stream-cursor ml-0.5 inline-block h-4 w-0.5 bg-gray-600 align-middle" aria-hidden />
          </p>
          {showJapanese && payload.nextJp && (
            <p className="mt-1 border-t border-gray-300 pt-1 text-xs text-gray-600 leading-snug" data-testid="streaming-translation">
              {payload.nextJp}
              <span className="animate-stream-cursor ml-0.5 inline-block h-3 w-0.5 bg-gray-500 align-middle" aria-hidden />
            </p>
          )}
          <details className="mt-2 group border-t border-gray-300 pt-2">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-gray-600 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">▶ 添削と解説を見る</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 hidden group-open:inline-block rotate-180 transition-transform" />
            </summary>
            <div className="mt-1.5 space-y-1.5 text-xs text-gray-700 leading-snug">
              {(payload.refactored || payload.analysis) && (
                <>
                  {payload.refactored && (
                    <p><span className="font-medium">プロの英語:</span> {payload.refactored}</p>
                  )}
                  {payload.note && <p className="italic">{payload.note}</p>}
                  {payload.analysis && (
                    <p className="whitespace-pre-wrap">{payload.analysis}</p>
                  )}
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
