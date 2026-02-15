import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  const rawBody = await request.text();
  const signature = (await headers()).get("stripe-signature");

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  console.log("Webhook received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Session details:", JSON.stringify({
          id: session.id,
          client_reference_id: session.client_reference_id,
          subscription: session.subscription,
        }));

        const userId = session.client_reference_id;
        console.log("[Stripe webhook] client_reference_id:", {
          value: userId,
          type: typeof userId,
          present: userId != null && String(userId).trim() !== "",
        });
        if (!userId) {
          console.error(
            "[Stripe webhook] client_reference_id is missing. Possible reasons: " +
              "checkout session was created without client_reference_id (Clerk userId), or " +
              "session was created by a different app/version. Session id:",
            session.id
          );
          break;
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as { id?: string } | null)?.id ?? null;

        console.log("Attempting to update Clerk user:", userId);
        try {
          const client = await clerkClient();
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              stripeSubscriptionStatus: "active",
              ...(subscriptionId && { stripeSubscriptionId: subscriptionId }),
              ...(stripeCustomerId && { stripeCustomerId: stripeCustomerId as string }),
            },
          });
          console.log("Clerk update done");
          console.log("[Stripe webhook] Clerk metadata updated successfully for userId:", userId);
        } catch (clerkErr) {
          console.error("[Stripe webhook] Clerk update failed for userId:", userId, {
            error: clerkErr,
            message: clerkErr instanceof Error ? clerkErr.message : String(clerkErr),
            stack: clerkErr instanceof Error ? clerkErr.stack : undefined,
          });
          // 500 を返さず 200 で返して Stripe のリトライを止める
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerk_user_id;
        if (!clerkUserId) {
          console.error("[Stripe webhook] customer.subscription.deleted: no clerk_user_id in metadata");
          break;
        }

        console.log("Attempting to update Clerk user (cancelled):", clerkUserId);
        try {
          const client = await clerkClient();
          const user = await client.users.getUser(clerkUserId);
          const existing = (user.publicMetadata ?? {}) as Record<string, unknown>;
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              ...existing,
              stripeSubscriptionStatus: "cancelled",
              stripeSubscriptionId: null,
            },
          });
          console.log("Clerk update done (cancelled)");
          console.log("[Stripe webhook] Clerk metadata (cancelled) updated successfully for userId:", clerkUserId);
        } catch (clerkErr) {
          console.error("[Stripe webhook] Clerk update failed for userId:", clerkUserId, {
            error: clerkErr,
            message: clerkErr instanceof Error ? clerkErr.message : String(clerkErr),
            stack: clerkErr instanceof Error ? clerkErr.stack : undefined,
          });
        }
        break;
      }

      default:
        // 未処理のイベントは無視
        break;
    }
  } catch (err) {
    console.error("[Stripe webhook] handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
