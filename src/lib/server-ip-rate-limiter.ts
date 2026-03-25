/**
 * server-ip-rate-limiter.ts — In-memory IP-based rate limiter for serverless API routes
 *
 * PURPOSE: Prevent anonymous abuse of our fal.ai API key (FAL_KEY) by limiting
 * free-tier generations per IP address per 24-hour rolling window.
 *
 * SECURITY CONTEXT (P0 — 2026-03-25, pane1774 Reviewer 18 fleet audit):
 * Without this module, any user who knew the /api/generate endpoint URL could call
 * it directly (curl, DevTools, scripts) and bypass the client-side localStorage gate
 * entirely, generating unlimited images at our fal.ai expense. This module closes
 * that gap by enforcing the free-tier limit on the server, where it cannot be bypassed.
 *
 * IMPLEMENTATION:
 * - In-memory Map<string, { count, windowStartMs }> keyed by client IP
 * - Module-level singleton: persists across requests within one warm Vercel instance
 * - Resets on cold starts (expected; stops casual abuse, not sophisticated attackers)
 * - 5 free generations per IP per 24-hour rolling window (matches client-side UX gate)
 *
 * FUTURE HARDENING:
 * Swap the Map for Upstash Redis to get persistent cross-instance rate limiting.
 * The interface of checkIpRateLimit() is stable — only the storage backend changes.
 *
 * ADDED: 2026-03-25 (pane1774 P0 hardening sweep — Builder 4, batch hardening)
 */

/** Tracks { count, windowStartMs } per IP for this lambda instance's lifetime */
const _ipRateLimitMap = new Map<string, { count: number; windowStartMs: number }>();

/** Free generations allowed per IP per 24h rolling window — matches client-side UX */
const FREE_GENERATIONS_PER_IP_PER_DAY = 5;

/** 24 hours in milliseconds */
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * checkIpRateLimit — returns true if the request is within quota, false if over limit.
 *
 * Increments the counter as a side effect on each ALLOWED call. Requests that hit
 * the limit do NOT increment (counter stops at FREE_GENERATIONS_PER_IP_PER_DAY).
 *
 * WHY increment-on-allow (not decrement-on-deny):
 * Prevents error-flooding attacks — if a request makes it past the rate limit but
 * fal.ai errors, the attempt still counts against the user's quota.
 *
 * @param ip - Client IP string (from x-forwarded-for or x-real-ip header)
 * @returns true if this request is allowed, false if the IP is over quota
 */
export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = _ipRateLimitMap.get(ip);

  if (!existing || now - existing.windowStartMs > RATE_LIMIT_WINDOW_MS) {
    // First request from this IP, or their 24h window has expired — start fresh
    _ipRateLimitMap.set(ip, { count: 1, windowStartMs: now });
    return true;
  }

  if (existing.count >= FREE_GENERATIONS_PER_IP_PER_DAY) {
    // Daily quota exhausted for this IP — deny
    return false;
  }

  // Within quota — increment and allow
  existing.count += 1;
  return true;
}
