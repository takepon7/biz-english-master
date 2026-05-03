"use client";

import { Mic, MicOff, Send } from "lucide-react";

interface InputAreaProps {
  inputDraft: string;
  inputValue: string;
  inputDisplay: string;
  hintMode: boolean;
  isListening: boolean;
  isSupported: boolean;
  loading: boolean;
  quotaExceededCountdown: number;
  canSend: boolean;
  transcript: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onResetTranscript: () => void;
}

export function InputArea({
  inputDraft,
  inputValue,
  inputDisplay,
  hintMode,
  isListening,
  isSupported,
  loading,
  quotaExceededCountdown,
  canSend,
  transcript,
  onInputChange,
  onSubmit,
  onStartListening,
  onStopListening,
  onResetTranscript,
}: InputAreaProps) {
  return (
    <div className="shrink-0 w-full border-t border-gray-200 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
      <div className="flex w-full items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
        <div className="flex min-h-[2.5rem] flex-1 flex-col justify-center">
          {isListening ? (
            <p
              className={`min-h-[2.25rem] py-2 text-sm leading-relaxed ${
                inputValue ? "text-gray-900" : "text-gray-500 italic"
              }`}
            >
              {inputDisplay}
            </p>
          ) : (
            <textarea
              value={inputDraft}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputDraft.trim()) onSubmit();
                }
              }}
              placeholder={hintMode ? "" : "話すか、英文を入力して送信"}
              rows={1}
              className={`min-h-[2.25rem] w-full resize-none bg-transparent py-2 text-sm leading-relaxed placeholder:text-gray-500 focus:outline-none ${
                hintMode ? "text-gray-500 italic" : "text-gray-900"
              }`}
              disabled={loading || quotaExceededCountdown > 0}
            />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => (isListening ? onStopListening() : onStartListening())}
            disabled={!isSupported || loading || quotaExceededCountdown > 0}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
              isSupported && !loading
                ? isListening
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
            aria-label={isListening ? "音声認識を停止" : "音声入力"}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                onStopListening();
                if (transcript.trim()) onInputChange(transcript.trim());
                onResetTranscript();
              } else if (inputDraft.trim()) {
                onSubmit();
              }
            }}
            disabled={!canSend && !isListening}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="送信"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
      {isListening && (
        <p className="mt-1.5 text-center text-xs text-gray-500">
          認識中… 止めると入力欄に反映されます。編集してから送信できます。
        </p>
      )}
      {!isSupported && (
        <p className="mt-2 text-center text-xs text-amber-600">
          音声認識は Chrome 等でご利用ください。
        </p>
      )}
    </div>
  );
}
