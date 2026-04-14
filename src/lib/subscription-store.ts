/**
 * src/lib/subscription-store.ts — ai-tattoo-generator subscription persistence layer
 *
 * PURPOSE:
 * Provides durable per-token Pro subscription state backed by Upstash Redis.
 * Used by three routes:
 *   - /api/stripe/create-checkout  → generates a token, stores "pending" state
 *   - /api/stripe/checkout         → fleet-standard route, also generates token
 *   - /api/stripe/webhook          → activates the token on checkout.session.completed
 *   - /api/generate                → checks if the request's token is "active"
 *
 * TOKEN LIFECYCLE:
 *   pending  → checkout session created but not yet paid
 *   active   → payment confirmed via Stripe webhook
 *   cancelled → subscription cancelled (future: subscription.deleted event)
 *
 * WHY TOKEN-BASED INSTEAD OF USER AUTH:
 * ai-tattoo-generator is a lightweight clone with no user database.
 * The subscription token pattern gives us durable Pro gating quickly:
 *   1. Server generates UUID at checkout creation
 *   2. Token stored as client_reference_id in Stripe session
 *   3. Success URL includes ?token= so client can capture it in localStorage
 *   4. Webhook activates the token when payment succeeds
 *   5. Client includes token in generate requests via x-pro-token header
 *   6. Generate route checks Redis before applying IP rate limit
 *
 * This is the fleet-standard T018 pattern. The key namespace is prefixed with
 * "tattoo:" to avoid collisions if multiple apps ever share a Redis database.
 *
 * TOKEN EXPIRY:
 * Active tokens expire after 13 months (covers annual billing cycle + buffer).
 * Pending tokens expire after 1 hour (abandoned checkouts should not linger).
 *
 * GRACEFUL DEGRADATION:
 * If UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are not configured,
 * all calls fail open with console warnings:
 *   - Pending tokens are not stored (checkout still works)
 *   - Webhook acknowledges but does not persist Pro status
 *   - Generate route treats ALL requests as free tier (conservative, correct)
 *
 * This allows the code to build and deploy before Upstash is provisioned.
 * BC1 note: after provisioning at https://console.upstash.com/:
 *   vercel env add UPSTASH_REDIS_REST_URL production
 *   vercel env add UPSTASH_REDIS_REST_TOKEN production
 *
 * REQUIRED ENV VARS (Vercel dashboard):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * CALLED BY:
 *   src/app/api/stripe/create-checkout/route.ts
 *   src/app/api/stripe/checkout/route.ts
 *   src/app/api/stripe/webhook/route.ts
 *   src/app/api/generate/route.ts
 *
 * pane1774 swarm — Builder 7, 2026-03-26 (T018 Upstash token lifecycle)
 * Pattern from: ai-hairstyle-generator/src/lib/subscription-store.ts
 * Key namespace changed from "hairforge:" to "tattoo:"
 */

import { Redis } from "@upstash/redis";

// -------------------------------------------------------------------------
// Redis client — lazy singleton, fails gracefully if env vars are missing
// -------------------------------------------------------------------------

let _redisClient: Redis | null = null;
let _redisInitAttempted = false;

/**
 * getRedisClient — returns a shared Redis instance, or null if not configured.
 *
 * Lazy init prevents build-time crashes when UPSTASH env vars are absent.
 * The null check at each call site ensures operations skip gracefully.
 */
function getRedisClient(): Redis | null {
  if (_redisInitAttempted) {
    return _redisClient;
  }

  _redisInitAttempted = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[subscription-store] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. " +
        "Pro subscription persistence is DISABLED. " +
        "All generate requests will use free-tier IP rate limiting. " +
        "Set these Vercel env vars to enable durable Pro entitlement."
    );
    return null;
  }

  try {
    _redisClient = new Redis({ url, token });
    return _redisClient;
  } catch (err) {
    console.error("[subscription-store] Failed to initialize Redis client:", err);
    return null;
  }
}

// -------------------------------------------------------------------------
// Token key helpers
// -------------------------------------------------------------------------

/**
 * Redis key for a subscription token.
 * Namespaced with "tattoo:" prefix to avoid collisions with other fleet apps
 * (hairstyle uses "hairforge:", meme uses "meme:", etc.).
 */
function subTokenKey(token: string): string {
  return `tattoo:sub:token:${token}`;
}

// -------------------------------------------------------------------------
// TTLs
// -------------------------------------------------------------------------

/** Pending checkout session expires after 1 hour */
const PENDING_TTL_SECONDS = 60 * 60;

/** Active Pro subscription is valid for 13 months (annual + 1-month buffer) */
const ACTIVE_TTL_SECONDS = 13 * 30 * 24 * 60 * 60;

// -------------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------------

export type SubscriptionStatus = "pending" | "active" | "cancelled";

/**
 * createPendingToken — called by checkout routes when creating a Stripe session.
 *
 * Generates a UUID, stores it as "pending" in Redis (1h TTL), and returns
 * the token. The token is passed as client_reference_id in Stripe and
 * included in the success_url so the client can store it in localStorage.
 *
 * If Redis is unavailable, the token is still returned — checkout works,
 * but Pro entitlement won't persist when the webhook fires.
 */
export async function createPendingToken(): Promise<string> {
  const token = crypto.randomUUID();

  const redis = getRedisClient();
  if (!redis) {
    console.warn(
      "[subscription-store] createPendingToken: Redis unavailable — token not stored.",
      { token }
    );
    return token;
  }

  try {
    await redis.setex(subTokenKey(token), PENDING_TTL_SECONDS, "pending");
  } catch (err) {
    console.error("[subscription-store] createPendingToken: Redis write failed:", err);
    // Still return the token so checkout does not break
  }

  return token;
}

/**
 * activateToken — called by /api/stripe/webhook on checkout.session.completed.
 *
 * Upgrades the token from "pending" to "active" (13-month TTL).
 * If the token was never stored (no Redis at checkout time), creates it as
 * "active" directly. Idempotent — safe to call multiple times.
 */
export async function activateToken(token: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    console.warn(
      "[subscription-store] activateToken: Redis unavailable — cannot persist Pro status.",
      { token }
    );
    return;
  }

  try {
    await redis.setex(subTokenKey(token), ACTIVE_TTL_SECONDS, "active");
    console.log("[subscription-store] activateToken: token activated in Redis", { token });
  } catch (err) {
    console.error("[subscription-store] activateToken: Redis write failed:", err);
    // Fail silently — Stripe will retry; don't 500 back to Stripe
  }
}

/**
 * cancelToken — for future use with customer.subscription.deleted.
 * Marks the token as cancelled with a 30-day TTL so clients get a clear error.
 */
export async function cancelToken(token: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.setex(subTokenKey(token), 30 * 24 * 60 * 60, "cancelled");
  } catch (err) {
    console.error("[subscription-store] cancelToken: Redis write failed:", err);
  }
}

/**
 * checkTokenStatus — returns the subscription status or null if not found/Redis down.
 */
export async function checkTokenStatus(
  token: string
): Promise<SubscriptionStatus | null> {
  if (!token || typeof token !== "string" || token.length < 10) {
    return null;
  }

  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const storedStatus = await redis.get<string>(subTokenKey(token));
    if (!storedStatus) return null;

    if (
      storedStatus === "active" ||
      storedStatus === "pending" ||
      storedStatus === "cancelled"
    ) {
      return storedStatus as SubscriptionStatus;
    }

    return null;
  } catch (err) {
    console.error("[subscription-store] checkTokenStatus: Redis read failed:", err);
    return null; // Fail conservatively — don't grant Pro access on error
  }
}

/**
 * isProActive — returns true only if the token is in "active" state.
 * Primary entitlement check used by /api/generate.
 */
export async function isProActive(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const status = await checkTokenStatus(token);
  return status === "active";
}
