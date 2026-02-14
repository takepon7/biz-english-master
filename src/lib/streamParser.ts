import { DELIMITERS } from "@/lib/chatDelimiters";

export type StreamSection = "refactored" | "note" | "next";

export interface StreamParseState {
  refactored: string;
  note: string;
  next: string;
  refactoredJp: string;
  nextJp: string;
}

const EMPTY_STATE: StreamParseState = {
  refactored: "",
  note: "",
  next: "",
  refactoredJp: "",
  nextJp: "",
};

/** 3タグ形式: [REFACTORED] → [NOTE] → [NEXT]（以降は next で終端まで） */
const END_DELIMITERS = [DELIMITERS.NOTE, DELIMITERS.NEXT] as const;

const SECTION_KEYS: (keyof StreamParseState)[] = [
  "refactored",
  "note",
  "next",
  "refactoredJp",
  "nextJp",
];

/**
 * ストリーム文字列から [REFACTORED] / [NOTE] / [NEXT] を検知し、適切な変数に振り分ける。
 * 単純な文字列検索（indexOf）でタグを区切り、onSection で都度 state を渡す。
 * 形式: [REFACTORED]... [NOTE]... [NEXT]...（終端までが next）
 */
export function createStreamParser(
  onSection: (state: StreamParseState) => void
) {
  let buffer = "";
  let sectionIndex = -1;
  const state: StreamParseState = { ...EMPTY_STATE };

  function flushToCurrent(text: string) {
    if (sectionIndex < 0 || sectionIndex > 2) return;
    const key = SECTION_KEYS[sectionIndex] as "refactored" | "note" | "next";
    const trimmed = text.trim();
    if (!trimmed) return;
    state[key] += (state[key] ? " " : "") + trimmed;
    onSection({ ...state });
  }

  function processChunk(chunk: string) {
    buffer += chunk;

    if (sectionIndex < 0) {
      const start = buffer.indexOf(DELIMITERS.REFACTORED);
      if (start === -1) {
        if (buffer.length > 80) buffer = buffer.slice(-80);
        return;
      }
      buffer = buffer.slice(start + DELIMITERS.REFACTORED.length);
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

    if (sectionIndex === 2) {
      flushToCurrent(buffer);
      buffer = "";
    }
  }

  return { processChunk, getState: () => ({ ...state }) };
}
