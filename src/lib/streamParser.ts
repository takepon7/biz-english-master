import { DELIMITERS } from "@/lib/chatDelimiters";

export type StreamSection = "next" | "translation" | "refactored" | "analysis";

export interface StreamParseState {
  next: string;
  nextJp: string;
  refactored: string;
  refactoredJp: string;
  analysis: string;
}

const EMPTY_STATE: StreamParseState = {
  next: "",
  nextJp: "",
  refactored: "",
  refactoredJp: "",
  analysis: "",
};

/** 4タグ形式: [NEXT] → [TRANSLATION] → [REFACTORED] → [ANALYSIS]（体感速度優先で返事を先に出力） */
const END_DELIMITERS = [DELIMITERS.TRANSLATION, DELIMITERS.REFACTORED, DELIMITERS.ANALYSIS] as const;

const SECTION_KEYS: (keyof StreamParseState)[] = [
  "next",
  "nextJp",
  "refactored",
  "analysis",
];

/**
 * ストリーム文字列から [NEXT] / [TRANSLATION] / [REFACTORED] / [ANALYSIS] を検知し、適切な変数に振り分ける。
 * 形式: [NEXT]... [TRANSLATION]... [REFACTORED]... [ANALYSIS]...（終端までが analysis）
 */
export function createStreamParser(
  onSection: (state: StreamParseState) => void
) {
  let buffer = "";
  let sectionIndex = -1;
  const state: StreamParseState = { ...EMPTY_STATE };

  function flushToCurrent(text: string) {
    if (sectionIndex < 0 || sectionIndex > 3) return;
    const key = SECTION_KEYS[sectionIndex] as keyof StreamParseState;
    const trimmed = text.trim();
    if (!trimmed) return;
    state[key] += (state[key] ? " " : "") + trimmed;
    onSection({ ...state });
  }

  function processChunk(chunk: string) {
    buffer += chunk;

    if (sectionIndex < 0) {
      const start = buffer.indexOf(DELIMITERS.NEXT);
      if (start === -1) {
        if (buffer.length > 80) buffer = buffer.slice(-80);
        return;
      }
      buffer = buffer.slice(start + DELIMITERS.NEXT.length);
      sectionIndex = 0;
    }

    while (sectionIndex < END_DELIMITERS.length) {
      const endDelim = END_DELIMITERS[sectionIndex];
      const pos = buffer.indexOf(endDelim);
      if (pos === -1) {
        flushToCurrent(buffer.slice(0, buffer.length - endDelim.length));
        buffer = buffer.slice(-endDelim.length);
        return;
      }
      flushToCurrent(buffer.slice(0, pos));
      buffer = buffer.slice(pos + endDelim.length);
      sectionIndex++;
    }

    if (sectionIndex === 3) {
      flushToCurrent(buffer);
      buffer = "";
    }
  }

  return { processChunk, getState: () => ({ ...state }) };
}
