"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechRecognitionStatus = "idle" | "listening" | "unsupported" | "error";

export interface UseSpeechRecognitionOptions {
  /** 言語（デフォルト: en-US） */
  lang?: string;
  /** 暫定結果も返す（リアルタイム表示用） */
  interimResults?: boolean;
  /** 連続認識（止まるまで複数発話を連結） */
  continuous?: boolean;
  /** 認識結果のコールバック（確定テキスト） */
  onResult?: (transcript: string, isFinal: boolean) => void;
  /** エラー時のコールバック */
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    lang = "en-US",
    interimResults = true,
    continuous = false,
    onResult,
    onError,
  } = options;

  const [status, setStatus] = useState<SpeechRecognitionStatus>("unsupported");
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const api = window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    setIsSupported(!!api);
    if (api) setStatus("idle");
  }, []);

  const start = useCallback(() => {
    const api = window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!api) {
      setStatus("unsupported");
      onError?.("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new api() as SpeechRecognition;
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setStatus("listening");
    recognition.onend = () => setStatus("idle");
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatus("error");
      const msg = event.error === "not-allowed"
        ? "マイクの使用が許可されていません"
        : event.message || event.error;
      onError?.(msg);
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
          onResult?.(text.trim(), true);
        } else {
          interimText += text;
        }
      }
      if (finalText) {
        setTranscript((prev) => (prev ? `${prev} ${finalText}` : finalText).trim());
        setInterimTranscript("");
      } else if (interimText) {
        setInterimTranscript(interimText);
      }
    };

    recognitionRef.current = recognition;
    setTranscript("");
    setInterimTranscript("");
    recognition.start();
  }, [lang, continuous, interimResults, onResult, onError]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("idle");
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    start,
    stop,
    resetTranscript,
    status,
    transcript,
    interimTranscript,
    isSupported,
  };
}
