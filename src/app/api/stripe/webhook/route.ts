/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and processes successful checkout sessions.
 * Currently logs the event; extend to write to a database when auth + DB are added.
 *
 * WHY direct fetch for Stripe verification instead of SDK:
 * The stripe npm SDK exhibits network failures on Vercel serverless functions
 * in some regions ("An error occurred with our connection to Stripe. Request was
 * retried N times."). We use the SDK only for `constructEvent` (HMAC verification,
 * which is pure CPU — no network) and skip the SDK's HTTP stack for everything else.
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

/** Required so Next.js reads the raw request body (not a pre-parsed stream) */
export const dynamic = "force-dynamic";

/**
 * Lightweight HMAC-SHA256 signature verification without the Stripe SDK.
 * Replicates Stripe's constructEvent logic: compute HMAC over timestamp.payload
 * and compare to the signature in the Stripe-Signature header.
 * https://stripe.com/docs/webhooks/signatures#verify-manually
 */
async function verifyStripeSignature(
  rawBody: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = Object.fromEntries(
    sigHeader.split(",").map((part) => part.split("=") as [string, string])
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Timing-safe comparison: same length strings only
  if (computed.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    diff |= computed.charCodeAt(i) ^ signature.charCodeAt(i)!;
  }
  return diff === 0;
}

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

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body." }, { status: 400 });
  }

  // Verify HMAC signature using native Web Crypto API (no SDK network calls)
  const isValid = await verifyStripeSignature(rawBody, sig, webhookSecret);
  if (!isValid) {
    console.error("[webhook] Signature verification failed — possible tampered payload");
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON in webhook body." }, { status: 400 });
  }

  // Process events we care about
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const plan = (session.metadata as Record<string, string> | null)?.plan;
    const customerId = session.customer as string | null;
    const amountTotal = session.amount_total as number | null;
    const customerDetails = session.customer_details as { email?: string } | null;
    const customerEmail = customerDetails?.email;

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
