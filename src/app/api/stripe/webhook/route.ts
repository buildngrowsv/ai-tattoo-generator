/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and processes successful checkout sessions.
 * Currently logs the event; extend to write to a database when auth + DB are added.
 *
 * WHY raw body: Stripe signature verification requires the raw request bytes —
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
 * STRIPE_WEBHOOK_SECRET must match the signing secret shown in the dashboard
 * after you register the endpoint. Get it via:
 *   Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret
 * Or via CLI: stripe listen --forward-to localhost:5982/api/stripe/webhook
 *
 * Reference: ai-chart-generator commit 48daace (T35, Builder 10).
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";

/** Lazy Stripe init — same pattern as create-checkout to avoid build-time crash */
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeClass = require("stripe") as typeof import("stripe").default;
    _stripe = new StripeClass(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

/** Required so Next.js reads the raw request body (not a pre-parsed stream) */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error(
      "[webhook] Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var"
    );
    return NextResponse.json(
      { error: "Missing signature or webhook secret." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    const stripe = getStripe();
    // constructEvent verifies the HMAC signature — rejects tampered payloads
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed.";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Process events we care about
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan;
    const customerId = session.customer;
    const amountTotal = session.amount_total;
    const customerEmail = session.customer_details?.email;

    console.log(
      `[webhook] checkout.session.completed — plan=${plan} customer=${customerId} email=${customerEmail} amount=${amountTotal}`
    );

    /**
     * EXTEND HERE: When you add a database (Neon/Supabase/Convex):
     *   1. Look up user by session.customer_email or session.customer
     *   2. If plan === "pro" → set subscription_active = true, record period_end
     *   3. Send welcome email via Resend/Postmark
     *   4. Return 200 to acknowledge receipt to Stripe
     *
     * For current MVP (no auth/DB): the success page can show a confirmation
     * and collect email for a manual onboarding flow.
     */
  }

  // Acknowledge receipt — Stripe retries if we return non-2xx
  return NextResponse.json({ received: true }, { status: 200 });
}
