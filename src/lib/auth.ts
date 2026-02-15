/**
 * Pro ユーザー判定の共通ロジック。
 * 以下のいずれかであれば isPro = true:
 * - 環境変数 ADMIN_EMAIL（カンマ区切り）に含まれるメールアドレス
 * - Clerk の user.publicMetadata.stripeSubscriptionStatus が 'active'
 */

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Clerk の publicMetadata に Stripe サブスク状態を保存する想定 */
export type StripePublicMetadata = {
  stripeSubscriptionStatus?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
};

type ClerkLikeUser = {
  primaryEmailAddress?: { emailAddress?: string } | null;
  publicMetadata?: Record<string, unknown>;
};

/**
 * 指定メールアドレスが ADMIN_EMAIL リストに含まれるか。
 */
export function getIsProByEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(normalized);
}

/**
 * ユーザーが Pro かどうかを判定する（共通化）。
 * - ADMIN_EMAIL に含まれるメール または
 * - publicMetadata.stripeSubscriptionStatus === 'active'
 */
export function getIsProForUser(user: ClerkLikeUser | null | undefined): boolean {
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress ?? null;
  if (getIsProByEmail(email)) return true;
  const meta = user.publicMetadata as StripePublicMetadata | undefined;
  return meta?.stripeSubscriptionStatus === "active";
}
