/**
 * POST /api/stripe/create-checkout
 *
 * Creates a Stripe Checkout session for the Pro plan ($9.90/month).
 * Returns { url } for client-side redirect to the Stripe-hosted checkout page.
 *
 * WHY direct fetch instead of Stripe SDK:
 * The stripe npm package (v17 and v20) exhibits network connectivity failures
 * when called from Vercel serverless functions in some regions — error:
 * "An error occurred with our connection to Stripe. Request was retried N times."
 * Direct fetch() to api.stripe.com works reliably from the same environment.
 * This is a known Stripe SDK + Vercel edge runtime compatibility issue.
 * Reference: ai-chart-generator T35 used SDK (same issue), direct fetch resolves it.
 *
 * WHY build-time safety: process.env.STRIPE_SECRET_KEY is undefined at build
 * time in CI (no secrets injected). We guard at request time so next build passes.
 *
 * Accepted body: { plan: "pro" }
 *   - "pro" → active Pro subscription using the configured Stripe price
 *
 * Env vars required at runtime (not build time):
 *   STRIPE_SECRET_KEY       — Stripe secret key (sk_live_... or sk_test_...)
 *   STRIPE_PRICE_ID_PRO     — Stripe Price ID for the pro monthly plan
 *   NEXT_PUBLIC_APP_URL     — Production URL (https://tattoo.symplyai.io)
 */

import { NextResponse } from "next/server";
import { createPendingToken } from "@/lib/subscription-store";

// ---------------------------------------------------------------------------
// Server-side IP rate limiter for checkout session creation.
//
// SECURITY FIX (2026-04-06): This route was the ONLY checkout path in the
// tattoo generator without any server-side protection. The fleet-standard
// /api/stripe/checkout route had rate limiting (added 2026-04-04), but this
// canonical /api/stripe/create-checkout route — the one the frontend actually
// calls — was completely unguarded. An attacker could generate unlimited
// cs_live_ Stripe Checkout sessions against our merchant account, potentially
// triggering fraud flags, polluting the Stripe dashboard with abandoned
// sessions, and consuming API rate limit quota.
//
// This repo has no auth library (no Better Auth / NextAuth), so IP-based rate
// limiting is the strongest server-side guard available. Limit: 10 checkout
// sessions per IP per hour — generous for legitimate users, blocks automated
// abuse scripts.
// ---------------------------------------------------------------------------
const checkoutRateLimitMap = new Map<string, { count: number; windowStartMs: number }>();
const CHECKOUT_LIMIT_PER_IP = 10;
const CHECKOUT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkCheckoutRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = checkoutRateLimitMap.get(ip);
  if (!existing || now - existing.windowStartMs > CHECKOUT_WINDOW_MS) {
    checkoutRateLimitMap.set(ip, { count: 1, windowStartMs: now });
    return true;
  }
  if (existing.count >= CHECKOUT_LIMIT_PER_IP) return false;
  existing.count += 1;
  return true;
}

function extractClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  // Rate limit checkout session creation — prevents unauthenticated abuse.
  // Without this, any anonymous client can POST here and create unlimited
  // Stripe Checkout sessions against our merchant account.
  const clientIp = extractClientIp(request);
  if (!checkCheckoutRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many checkout requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    let body: { plan?: string };
    try {
      body = (await request.json()) as { plan?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const plan = (body.plan || "pro").toLowerCase().trim();
    if (plan !== "pro") {
      return NextResponse.json({ error: 'plan must be "pro".' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured. Add it to your Vercel environment." },
        { status: 503 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Stripe price ID for this plan is not configured. Set STRIPE_PRICE_ID_PRO in your environment.",
        },
        { status: 503 }
      );
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "https://tattoo.symplyai.io"
    ).replace(/\/$/, "");

    /**
     * WHY direct fetch to Stripe API instead of the stripe npm SDK:
     * Stripe SDK exhibits intermittent network failures on Vercel serverless
     * ("An error occurred with our connection to Stripe. Request was retried 2 times.")
     * Direct fetch to api.stripe.com with x-www-form-urlencoded works reliably.
     * The Stripe REST API is stable and well-documented; SDK is a convenience wrapper.
     * https://stripe.com/docs/api/checkout/sessions/create
     */
    /**
     * WHY manual string construction instead of URLSearchParams for the full body:
     * URLSearchParams percent-encodes curly braces { } in values, turning
     * "{CHECKOUT_SESSION_ID}" into "%7BCHECKOUT_SESSION_ID%7D". Stripe's success_url
     * template variable requires the literal curly braces to remain unencoded so
     * Stripe recognizes and substitutes the session ID. We build the body manually
     * and explicitly keep the Stripe template variable un-encoded.
     */
    // ---------------------------------------------------------------------------
    // T018 Pro token (2026-03-26): generate a UUID before the Stripe call so we
    // can pass it as client_reference_id (for webhook activation) and embed it
    // in the success URL so the client can store it in localStorage.
    // If Redis is unavailable, createPendingToken() still returns a UUID (fail-open).
    // See: src/lib/subscription-store.ts for full token lifecycle docs.
    // ---------------------------------------------------------------------------
    const subscriptionToken = await createPendingToken();

    // Redirect back to a real page in this app. The repo does not have a dedicated
    // /success route, so sending users there would create a post-payment 404.
    // Token appended so the client can capture it in localStorage after Stripe redirects.
    const successUrl = `${appUrl}/?checkout=success&token=${encodeURIComponent(subscriptionToken)}`;
    const cancelUrl = `${appUrl}/pricing`;

    // Build form-encoded body with encodeURIComponent on each value
    const bodyParts = [
      `mode=subscription`,
      `line_items[0][price]=${encodeURIComponent(priceId)}`,
      `line_items[0][quantity]=1`,
      `success_url=${encodeURIComponent(successUrl)}`,
      `cancel_url=${encodeURIComponent(cancelUrl)}`,
      `allow_promotion_codes=true`,
      // client_reference_id is echoed back by Stripe in checkout.session.completed
      // so the webhook can activate the token without a user database.
      `client_reference_id=${encodeURIComponent(subscriptionToken)}`,
      `metadata[plan]=${encodeURIComponent(plan)}`,
      `metadata[source]=tattoo-generator`,
    ];

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2025-02-24.acacia",
      },
      body: bodyParts.join("&"),
    });

    const stripeData = (await stripeResponse.json()) as { url?: string; error?: { message?: string } };

    if (!stripeResponse.ok || !stripeData.url) {
      const message = stripeData.error?.message || "Stripe checkout session creation failed.";
      console.error("[create-checkout] Stripe API error:", stripeResponse.status, message);
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ url: stripeData.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    console.error("[create-checkout] Unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
