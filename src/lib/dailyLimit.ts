/**
 * 1日あたりのチャット回数制限ロジック（API とテストで共有）
 */

export const DAILY_CHAT_LIMIT = 5;

export type DailyLimitMeta = {
  dailyChatCount?: number;
  dailyChatCountDate?: string;
};

/** 今日の日付を YYYY-MM-DD で返す（JST = 日本時間基準で日付が変わる） */
export function getTodayString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
}

/** メタデータから「今日」の送信回数を取得。日付が今日でなければ 0 */
export function getCurrentCount(
  meta: DailyLimitMeta,
  today: string
): number {
  const countDate = meta.dailyChatCountDate;
  if (countDate !== today) return 0;
  return meta.dailyChatCount ?? 0;
}

/** 制限に達しているか（count >= limit で拒否） */
export function isLimitReached(count: number, limit: number): boolean {
  return count >= limit;
}

/** 1回送信した後のメタデータ（カウント+1、日付を今日に） */
export function getNextMeta(meta: DailyLimitMeta, today: string): DailyLimitMeta {
  const count = getCurrentCount(meta, today);
  return {
    ...meta,
    dailyChatCount: count + 1,
    dailyChatCountDate: today,
  };
}

/**
 * 非 Pro ユーザーが送信可能かどうかと、次のメタデータを返す。
 * isPro の判定は呼び出し元で行う想定。
 */
export function checkDailyLimit(
  isPro: boolean,
  meta: DailyLimitMeta,
  today: string,
  limit: number = DAILY_CHAT_LIMIT
): { allowed: boolean; nextMeta: DailyLimitMeta } {
  if (isPro) {
    return { allowed: true, nextMeta: meta };
  }
  const count = getCurrentCount(meta, today);
  if (isLimitReached(count, limit)) {
    return { allowed: false, nextMeta: meta };
  }
  return { allowed: true, nextMeta: getNextMeta(meta, today) };
}
