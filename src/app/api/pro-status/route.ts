import { currentUser } from "@clerk/nextjs/server";
import { getIsProForUser } from "@/lib/auth";
import type { StripePublicMetadata } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * 現在のユーザーが Pro かどうかと、Stripe ポータル利用可否を返す。
 */
export async function GET() {
  const user = await currentUser();
  const isPro = getIsProForUser(user);
  const meta = (user?.publicMetadata ?? {}) as StripePublicMetadata;
  const stripeCustomerId = meta.stripeCustomerId ?? null;
  return Response.json({
    isPro,
    canManageSubscription: Boolean(stripeCustomerId?.trim()),
  });
}
