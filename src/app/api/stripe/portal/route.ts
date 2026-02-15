import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { StripePublicMetadata } from "@/lib/auth";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey?.trim()?.startsWith("sk_")) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as StripePublicMetadata;
  let stripeCustomerId = meta.stripeCustomerId?.trim() ?? null;

  if (!stripeCustomerId) {
    const email =
      user?.primaryEmailAddress?.emailAddress ??
      (Array.isArray(user?.emailAddresses) && user.emailAddresses[0]
        ? (user.emailAddresses[0] as { emailAddress?: string }).emailAddress
        : undefined) ??
      null;
    if (email) {
      const list = await stripe.customers.list({ email, limit: 1 });
      if (list.data.length > 0) {
        stripeCustomerId = list.data[0].id;
        try {
          const client = await clerkClient();
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              ...meta,
              stripeCustomerId,
            },
          });
        } catch {
          // メタデータ更新に失敗してもポータルは開く
        }
      }
    }
  }

  if (!stripeCustomerId) {
    return NextResponse.json(
      {
        error: "No subscription to manage",
        detail: "Stripe でサブスクリプションをお申し込みの方のみ、ここから管理できます。",
      },
      { status: 400 }
    );
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/practice`,
    });

    if (!portalSession.url) {
      return NextResponse.json(
        { error: "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Stripe portal] Error:", message);
    return NextResponse.json(
      { error: "Portal session failed", detail: message },
      { status: 502 }
    );
  }
}
