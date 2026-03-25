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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan;
    const customerId =
      typeof session.customer === "string" ? session.customer : null;
    const amountTotal = session.amount_total;
    const customerEmail = session.customer_details?.email ?? null;

    console.error(
      `[webhook] checkout.session.completed received without entitlement backend — plan=${plan} customer=${customerId} email=${customerEmail} amount=${amountTotal}`
    );
    return NextResponse.json(
      {
        error:
          "Checkout completed but no entitlement backend is configured. " +
          "Provision a database-backed subscription flow before acknowledging this event.",
      },
      { status: 503 }
    );
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "invoice.paid" ||
    event.type === "invoice.payment_failed"
  ) {
    console.error(
      `[webhook] ${event.type} received without entitlement backend — failing closed`
    );
    return NextResponse.json(
      {
        error:
          "Subscription lifecycle event received but no entitlement backend is configured.",
      },
      { status: 503 }
    );
  }

  // Non-entitlement events can be acknowledged safely.
  return NextResponse.json({ received: true }, { status: 200 });
}
