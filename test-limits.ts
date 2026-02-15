/**
 * 回数制限ロジックの検証スクリプト（モックのみ、DB/Clerk は叩かない）
 * 実行: npx tsx test-limits.ts
 */

import {
  DAILY_CHAT_LIMIT,
  getTodayString,
  getCurrentCount,
  isLimitReached,
  getNextMeta,
  checkDailyLimit,
  type DailyLimitMeta,
} from "./src/lib/dailyLimit";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// --- Checkpoint 1: APIレベルの防御 ---
// isPro = false のユーザーが 6 回目を送ろうとしたとき、制限エラー（429 相当）になるか
function runCheckpoint1(): void {
  const today = getTodayString();
  let meta: DailyLimitMeta = {};

  for (let i = 1; i <= 6; i++) {
    const count = getCurrentCount(meta, today);
    const rejected = isLimitReached(count, DAILY_CHAT_LIMIT);

    if (i <= 5) {
      assert(!rejected, `Checkpoint 1: リクエスト ${i} 回目は許可されるべき`);
      meta = getNextMeta(meta, today);
    } else {
      assert(rejected, `Checkpoint 1: 6 回目は 429/制限エラーになるべき`);
    }
  }

  console.log("✅ Checkpoint 1: Passed（6回目で制限エラー）");
}

// --- Checkpoint 2: 日付リセットの正確性 ---
// 保存されているカウントが「今日」でない場合、0 から再スタートするか
function runCheckpoint2(): void {
  const today = getTodayString();
  const pastDate = "2020-01-01";
  const meta: DailyLimitMeta = {
    dailyChatCount: 99,
    dailyChatCountDate: pastDate,
  };

  const count = getCurrentCount(meta, today);
  assert(count === 0, "Checkpoint 2: 過去日付の場合はカウントは 0 になるべき");

  const next = getNextMeta(meta, today);
  assert(next.dailyChatCount === 1, "Checkpoint 2: 1回送信後はカウント 1 になるべき");
  assert(next.dailyChatCountDate === today, "Checkpoint 2: 日付が今日に更新されるべき");

  console.log("✅ Checkpoint 2: Passed（日付リセットで 0 から再スタート）");
}

// --- Checkpoint 3: 特権の有効性 ---
// isPro = true のユーザーは 5 回を超えても制限がかからず成功し続けるか
function runCheckpoint3(): void {
  const today = getTodayString();
  let meta: DailyLimitMeta = {};

  for (let i = 1; i <= 6; i++) {
    const { allowed, nextMeta } = checkDailyLimit(true, meta, today, DAILY_CHAT_LIMIT);
    assert(allowed, `Checkpoint 3: isPro=true の ${i} 回目も許可されるべき`);
    // isPro のとき nextMeta は更新されない（meta のまま）
    assert(nextMeta === meta, "Checkpoint 3: isPro のときメタは更新されない");
  }

  // ADMIN_EMAIL 相当は getIsProForUser 側の責務なので、ここでは「isPro=true なら常に allowed」のみ検証
  console.log("✅ Checkpoint 3: Passed（isPro なら 5 回超えても制限なし）");
}

// --- 実行 ---
function main(): void {
  console.log("回数制限ロジックの検証を開始します（モックのみ）\n");

  runCheckpoint1();
  runCheckpoint2();
  runCheckpoint3();

  console.log("\nすべてのチェックポイントを通過しました。");
}

main();
