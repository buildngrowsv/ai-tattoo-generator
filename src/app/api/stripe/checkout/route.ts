/**
 * POST /api/stripe/checkout — Fleet-standard Stripe Checkout for AI Tattoo Generator
 *
 * PURPOSE:
 * Creates a Stripe Checkout Session using the fleet-standard priceId pattern.
 * The tattoo generator was originally built with /api/stripe/create-checkout
 * which accepts { plan: "pro" }. This route accepts { priceId: string } —
 * the standard across all other clone repos in the ai-* fleet — so scout smoke
 * tests and frontend components can use a unified path and interface.
 *
 * WHY TWO CHECKOUT ROUTES:
 * /api/stripe/create-checkout — legacy, used by existing frontend (plan-based)
 * /api/stripe/checkout — fleet standard (priceId-based) added here
 * Both call Stripe with native fetch; single-source-of-truth is not needed here
 * because the logic is trivial and the inputs differ fundamentally.
 *
 * WHY NATIVE FETCH INSTEAD OF STRIPE SDK:
 * Stripe SDK v17-v20 throws StripeConnectionError in Vercel serverless.
 * Direct fetch() to api.stripe.com works reliably. Pattern confirmed across
 * the entire ai-* clone fleet (Builder 8 T69, Builder 5 T44, Scout 14 2026-03-25).
 *
 * ACCEPTS: { priceId: string } — must start with "price_"
 * RETURNS: { checkoutUrl: string } — cs_live_ Stripe checkout URL
 *
 * ENV VARS:
 *   STRIPE_SECRET_KEY               — sk_live_... (server-side only)
 *   NEXT_PUBLIC_STRIPE_PRICE_ID_PRO — price ID set 56m ago (Vercel env)
 *   NEXT_PUBLIC_APP_URL             — https://tattoo.symplyai.io
 *
 * CREATED BY: Scout 14, 2026-03-25, BridgeSwarm pane1774 session
 * RELATES TO: Scout 15/Scout 14 finding — tattoo.symplyai.io returned HTML
 *             at /api/stripe/checkout (route didn't exist, only create-checkout did)
 */

import { NextRequest, NextResponse } from "next/server";
import { createPendingToken } from "@/lib/subscription-store";

export async function POST(request: NextRequest) {
  /**
   * Runtime guard — build-time env vars are undefined; guard at request time.
   * Trim trailing \n/whitespace from env var (defensive against echo-pipe artifacts).
   */
  const stripeKey = process.env.STRIPE_SECRET_KEY?.replace(/[\s\n\r\\n]+$/g, "").trim();
  if (!stripeKey) {
    return NextResponse.json(
      {
        error:
          "Payment system not configured. " +
          "Set STRIPE_SECRET_KEY in Vercel environment variables.",
      },
      { status: 503 }
    );
  }

  /* Parse fleet-standard request body: { priceId: string } */
  let priceId: string | undefined;
  try {
    const body = (await request.json()) as { priceId?: string };
    priceId = body.priceId;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  if (!priceId || !priceId.startsWith("price_")) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing priceId. " +
          "Send { priceId: 'price_...' } in the request body.",
      },
      { status: 400 }
    );
  }

  /**
   * Defensive URL cleanup — strips trailing \n and slashes from APP_URL.
   * Some Vercel env vars were set via echo pipe with trailing newline,
   * causing Stripe to reject the redirect URL as "Not a valid URL".
   */
  const appBaseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://tattoo.symplyai.io"
  )
    .replace(/\\n/g, "")
    .replace(/\n/g, "")
    .replace(/\/$/, "")
    .trim();

  // T018 Pro token (2026-03-26): generate before the Stripe call so it can be
  // passed as client_reference_id (for webhook activation) and embedded in
  // success_url (for localStorage capture by the client).
  const subscriptionToken = await createPendingToken();

  /* Call Stripe REST API with native fetch — avoids SDK serverless issues */
  try {
    const formBody = [
      `mode=subscription`,
      `line_items[0][price]=${encodeURIComponent(priceId)}`,
      `line_items[0][quantity]=1`,
      `allow_promotion_codes=true`,
      `success_url=${encodeURIComponent(`${appBaseUrl}/?checkout=success&token=${subscriptionToken}`)}`,
      `cancel_url=${encodeURIComponent(`${appBaseUrl}/?checkout=cancelled`)}`,
      // client_reference_id is echoed back in checkout.session.completed so the
      // webhook can activate the token without a user database.
      `client_reference_id=${encodeURIComponent(subscriptionToken)}`,
    ].join("&");

    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      }
    );

    const stripeData = (await stripeResponse.json()) as {
      url?: string;
      error?: { message?: string };
    };

    if (!stripeResponse.ok) {
      const errMsg =
        stripeData.error?.message || `Stripe API error ${stripeResponse.status}`;
      console.error("[/api/stripe/checkout] Stripe error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    if (!stripeData.url) {
      return NextResponse.json(
        { error: "No checkout URL returned from Stripe. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl: stripeData.url });
  } catch (fetchError) {
    const message =
      fetchError instanceof Error ? fetchError.message : "Checkout request failed.";
    console.error("[/api/stripe/checkout] Fetch error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
