/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and verifies that they really came from Stripe.
 * This repo still has no account database, so entitlement-bearing events must
 * fail closed instead of returning a false-success 200 that implies Pro access
 * was granted when nothing was actually persisted.
 *
 * WHY Stripe SDK is safe here:
 * The checkout routes use raw fetch because the Stripe SDK's network client has
 * been flaky in Vercel serverless. Webhook verification is different: Stripe's
 * `constructEvent` helper is pure local HMAC verification and does not depend on
 * Stripe network calls, so it is the most reliable way to verify signatures.
 *
 * WHY raw body: Stripe signature verification requires the exact raw request bytes —
 * not parsed JSON. Next.js App Router provides `request.text()` for this.
 *
 * WHY export dynamic = "force-dynamic": Prevents Next.js from trying to
 * statically optimize this route. Webhook handlers must read the live request
 * body on every call; static generation would break signature verification.
 *
 * Setup in Stripe dashboard:
 *   Endpoint URL: https://tattoo.symplyai.io/api/stripe/webhook
 *   Events to send: checkout.session.completed
 *
 * STRIPE_WEBHOOK_SECRET must match the signing secret shown in the Stripe dashboard
 * after you register the endpoint. Get it via:
 *   Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { activateToken } from "@/lib/subscription-store";

/** Required so Next.js reads the raw request body (not a pre-parsed stream) */
export const dynamic = "force-dynamic";

let lazyStripeClient: Stripe | null = null;

function getStripeClient(): Stripe | null {
  if (lazyStripeClient) {
    return lazyStripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error("[webhook] STRIPE_SECRET_KEY is not configured.");
    return null;
  }

  lazyStripeClient = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  });

  return lazyStripeClient;
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 }
    );
  }

  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error(
      "[webhook] Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var"
    );
    return NextResponse.json(
      { error: "Missing signature or webhook secret." },
      { status: 503 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (verificationError) {
    const message =
      verificationError instanceof Error
        ? verificationError.message
        : "Webhook signature verification failed.";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  // ---------------------------------------------------------------------------
  // T018 EVENT HANDLERS (2026-03-26): replaced fail-closed 503 stubs with real
  // Upstash Redis token activation. All events return 200 so Stripe stops retrying.
  // See: src/lib/subscription-store.ts for token lifecycle details.
  // ---------------------------------------------------------------------------

  switch (event.type) {
    case "checkout.session.completed": {
      // client_reference_id was set by create-checkout and checkout routes at
      // session creation time. It is the UUID stored in Redis as "pending".
      // activateToken() upgrades it to "active" (13-month TTL).
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const subscriptionToken = checkoutSession.client_reference_id;
      if (subscriptionToken) {
        await activateToken(subscriptionToken);
        console.log(
          `[webhook] checkout.session.completed — activated token`,
          { sessionId: checkoutSession.id, tokenFragment: subscriptionToken.slice(0, 8) }
        );
      } else {
        console.warn(
          "[webhook] checkout.session.completed — no client_reference_id; token not activated",
          { sessionId: checkoutSession.id }
        );
      }
      break;
    }

    case "customer.subscription.updated":
      // Log for observability; no token action needed for plan updates in MVP.
      console.log("[webhook] customer.subscription.updated — logged, no token action");
      break;

    case "customer.subscription.deleted":
      // No client_reference_id on this event type — token cancellation via
      // cancelToken() requires a lookup we don't have yet. Log and 200 for now.
      console.log("[webhook] customer.subscription.deleted — logged, no token action");
      break;

    case "invoice.paid":
      console.log("[webhook] invoice.paid — logged");
      break;

    case "invoice.payment_failed":
      console.log("[webhook] invoice.payment_failed — logged");
      break;

    default:
      // All other events acknowledged with 200 to avoid Stripe retry loops.
      console.log(`[webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
