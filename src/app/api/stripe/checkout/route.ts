import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey?.trim()) {
    console.error("[Stripe checkout] STRIPE_SECRET_KEY is not set");
    return NextResponse.json(
      { error: "Server misconfiguration", detail: "STRIPE_SECRET_KEY is not set" },
      { status: 500 }
    );
  }
  if (!priceId?.trim()) {
    console.error("[Stripe checkout] STRIPE_PRICE_ID is not set");
    return NextResponse.json(
      { error: "Server misconfiguration", detail: "STRIPE_PRICE_ID is not set" },
      { status: 500 }
    );
  }
  if (priceId.startsWith("pk_")) {
    console.error("[Stripe checkout] STRIPE_PRICE_ID must be a Price ID (price_xxx), not a Publishable Key (pk_xxx). Check .env.local.");
    return NextResponse.json(
      {
        error: "Invalid STRIPE_PRICE_ID",
        detail: "STRIPE_PRICE_ID should be a Price ID (price_xxx). You may have swapped it with NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
      },
      { status: 500 }
    );
  }
  if (!secretKey.startsWith("sk_")) {
    console.error("[Stripe checkout] STRIPE_SECRET_KEY should start with sk_. Check .env.local.");
    return NextResponse.json(
      { error: "Invalid STRIPE_SECRET_KEY", detail: "STRIPE_SECRET_KEY should start with sk_ (secret key)." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;
  const successUrl = `${baseUrl}/practice?success=1`;
  const cancelUrl = `${baseUrl}/practice`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Webhook でユーザー特定に必須。無いと checkout.session.completed で Clerk を更新できない
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          clerk_user_id: userId,
        },
      },
    });

    if (!session.url) {
      console.error("[Stripe checkout] Session created but session.url is empty");
      return NextResponse.json(
        { error: "Failed to create checkout session", detail: "No redirect URL from Stripe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[Stripe checkout] Error:", message, stack ?? "");
    return NextResponse.json(
      { error: "Checkout failed", detail: message },
      { status: 502 }
    );
  }
}
