/**
 * POST /api/stripe/create-checkout
 *
 * Creates a Stripe Checkout session for the Pro plan ($9.90/month).
 * Returns { url } for client-side redirect to the Stripe-hosted checkout page.
 *
 * WHY lazy Stripe init: process.env.STRIPE_SECRET_KEY is undefined at build
 * time in CI (no secrets injected), so `new Stripe(undefined!)` would throw
 * during next build. Lazy init defers the error to request time, which is the
 * standard pattern for env-dependent service clients in Next.js App Router.
 * Reference: ai-chart-generator commit 48daace (T35, Builder 10).
 *
 * WHY a server-side API route instead of buy.stripe.com payment link:
 * Server-side checkout sessions let us pass metadata (userId, plan), configure
 * dynamic success/cancel URLs per environment (preview vs prod), and handle
 * webhook events that update user state (credits, subscription status). Payment
 * links are fine for MVP but give less control. This route coexists with the
 * existing payment link — same Stripe product, better developer surface.
 *
 * Accepted body: { plan: "pro" }
 *   - "pro" → $9.90/month recurring subscription
 *
 * Env vars required at runtime (not build time):
 *   STRIPE_SECRET_KEY           — Stripe secret key (sk_live_... or sk_test_...)
 *   STRIPE_PRICE_ID_PRO         — Stripe Price ID for the pro monthly plan
 *   NEXT_PUBLIC_APP_URL         — Production URL (https://tattoo.symplyai.io)
 */

import { NextResponse } from "next/server";
import type Stripe from "stripe";

/** Lazy singleton — avoids build-time crash when env vars are absent */
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Add it to your Vercel environment."
      );
    }
    // Dynamic require so the module resolves the correct Stripe class at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeClass = require("stripe") as typeof import("stripe").default;
    _stripe = new StripeClass(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

/** Map plan name → Stripe Price ID from env. Non-NEXT_PUBLIC_ so key stays server-side. */
const PRICE_ID_MAP: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRICE_ID_PRO,
};

/** Stripe Checkout mode per plan — pro is a recurring subscription */
const PLAN_MODE_MAP: Record<string, Stripe.Checkout.SessionCreateParams.Mode> = {
  pro: "subscription",
};

export async function POST(request: Request) {
  try {
    let body: { plan?: string };
    try {
      body = (await request.json()) as { plan?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const plan = (body.plan || "pro").toLowerCase().trim();
    if (!PRICE_ID_MAP[plan] && plan !== "pro") {
      return NextResponse.json(
        { error: 'plan must be "pro".' },
        { status: 400 }
      );
    }

    const priceId = PRICE_ID_MAP[plan] || PRICE_ID_MAP["pro"];
    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Stripe price ID for this plan is not configured. Set STRIPE_PRICE_ID_PRO in your environment.",
        },
        { status: 500 }
      );
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5982"
    ).replace(/\/$/, "");

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: PLAN_MODE_MAP[plan] || "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${appUrl}/pricing`,
      // Allow promo codes so we can run marketing campaigns
      allow_promotion_codes: true,
      metadata: { plan, source: "tattoo-generator" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    const isConfig =
      message.includes("STRIPE_SECRET_KEY") ||
      message.includes("price ID") ||
      message.includes("not configured");
    return NextResponse.json({ error: message }, { status: isConfig ? 500 : 502 });
  }
}
