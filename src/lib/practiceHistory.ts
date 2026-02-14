const STORAGE_KEY = "biz-english-practice-history";
const MAX_ITEMS = 20;

/**
 * 1 つの履歴アイテム（LocalStorage に保存する形）
 */
export interface PracticeHistoryItem {
  id: string;
  timestamp: number;
  scenario: string;
  userInput: string;
  refactoredText: string;
  coachingNote: string;
}

/** 旧形式（マイグレーション用） */
interface LegacyItem {
  id?: string;
  userMessage?: string;
  refactoredEnglish?: string;
  coachingNote?: string;
  createdAt?: number;
}

function loadHistory(): PracticeHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const arr = Array.isArray(parsed) ? parsed : [];
    return arr.map((row: LegacyItem & PracticeHistoryItem) => {
      if ("timestamp" in row && typeof row.scenario === "string") {
        return row as PracticeHistoryItem;
      }
      return migrateLegacy(row as LegacyItem);
    });
  } catch {
    return [];
  }
}

function migrateLegacy(row: LegacyItem): PracticeHistoryItem {
  return {
    id: row.id ?? `practice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: row.createdAt ?? Date.now(),
    scenario: "job-interview",
    userInput: row.userMessage ?? "",
    refactoredText: row.refactoredEnglish ?? "",
    coachingNote: row.coachingNote ?? "",
  };
}

function saveHistory(items: PracticeHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

/** 履歴一覧を取得（クライアントのみ。useEffect 内で呼ぶこと） */
export function getPracticeHistory(): PracticeHistoryItem[] {
  return loadHistory();
}

/** ストリーミング完了時に 1 件追加。古いものは MAX_ITEMS を超えた分を削除 */
export function addPracticeItem(
  item: Omit<PracticeHistoryItem, "id" | "timestamp">
): void {
  const list = loadHistory();
  const newItem: PracticeHistoryItem = {
    ...item,
    id: `practice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  saveHistory([newItem, ...list]);
}

export function clearPracticeHistory(): void {
  saveHistory([]);
}
