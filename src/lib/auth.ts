/**
 * 管理者（Pro ユーザー）判定。
 * ADMIN_EMAIL（カンマ区切り）に含まれるメールのユーザーは常に isPro = true（制限バイパス）。
 * .env.local に ADMIN_EMAIL=one@example.com, two@example.com のように設定。
 */
const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * 指定メールアドレスが管理者（Pro）かどうかを返す。
 * 今後の「1日5回まで」等の機能制限では、ここが true の場合は制限をかけない。
 */
export function getIsProByEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalized);
}
