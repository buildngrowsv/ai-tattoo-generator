/**
 * api.smoke.test.ts — API route validation tests for POST /api/generate
 *
 * WHY THIS EXISTS: The generate route has clear validation logic (400 for missing
 * fields, 400 for too-short/too-long descriptions, 503 when FAL_KEY is absent)
 * that can be exercised without calling the real fal.ai API. These tests lock
 * down the validation contract so refactors don't silently break error handling.
 *
 * APPROACH — testing without live fal.ai:
 * We delete process.env.FAL_KEY before running guard tests so the route bails
 * before it ever reaches the fal.ai import. This lets us test input validation
 * and the missing-key guard without network calls or mocking the SDK internals.
 *
 * For the FAL_KEY-present path we don't call through to fal.ai in unit tests —
 * that's covered by E2E / integration tests in a real Vercel preview deploy.
 *
 * CALLED ROUTE: src/app/api/generate/route.ts
 * FIELDS VALIDATED:
 *   - tattooDescription: required, 3–1000 chars
 *   - style: required (any non-empty string)
 *   - placement: required (any non-empty string)
 *   - size: required (any non-empty string)
 * GUARD: returns 503 when process.env.FAL_KEY is not set
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate/route'

/**
 * Helper to build a NextRequest with a JSON body — mirrors what the fetch
 * call in TattooGeneratorForm.tsx sends to the route.
 *
 * We use the standard Request constructor with URL 'http://localhost'
 * because NextRequest wraps a standard Request and needs an absolute URL.
 */
function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/generate — input validation', () => {
  /**
   * Save and restore FAL_KEY around each test so that tests that need the
   * key absent don't affect tests that need it present (and vice versa).
   */
  const originalFalKey = process.env.FAL_KEY

  beforeEach(() => {
    // Remove FAL_KEY so tests exercise the guard path without hitting fal.ai
    delete process.env.FAL_KEY
  })

  afterEach(() => {
    // Restore the original value (may be undefined, which is fine)
    if (originalFalKey !== undefined) {
      process.env.FAL_KEY = originalFalKey
    } else {
      delete process.env.FAL_KEY
    }
    vi.restoreAllMocks()
  })

  // ── Missing field tests ────────────────────────────────────────────────────

  it('returns 400 when tattooDescription is missing', async () => {
    const req = buildRequest({ style: 'Traditional', placement: 'Arm', size: 'Medium' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it('returns 400 when style is missing', async () => {
    const req = buildRequest({ tattooDescription: 'A dragon', placement: 'Arm', size: 'Medium' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when placement is missing', async () => {
    const req = buildRequest({ tattooDescription: 'A dragon', style: 'Traditional', size: 'Medium' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when size is missing', async () => {
    const req = buildRequest({ tattooDescription: 'A dragon', style: 'Traditional', placement: 'Arm' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  // ── Description length validation ──────────────────────────────────────────

  it('returns 400 when tattooDescription is fewer than 3 characters', async () => {
    /**
     * The route checks: if (tattooDescription.length < 3) → 400
     * This catches empty strings and ultra-short inputs like "ok" or "hi"
     * that the AI model wouldn't produce meaningful results for.
     */
    const req = buildRequest({
      tattooDescription: 'ab',
      style: 'Traditional',
      placement: 'Arm',
      size: 'Medium',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('short')
  })

  it('returns 400 when tattooDescription exceeds 1000 characters', async () => {
    const req = buildRequest({
      tattooDescription: 'x'.repeat(1001),
      style: 'Traditional',
      placement: 'Arm',
      size: 'Medium',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('long')
  })

  // ── FAL_KEY guard ──────────────────────────────────────────────────────────

  it('returns 503 when FAL_KEY environment variable is not set', async () => {
    /**
     * The route checks for FAL_KEY AFTER input validation passes.
     * We provide a valid body so the test reaches the key check.
     * Expected: 503 with error "FAL_KEY not configured"
     * This tells developers and CI exactly what's wrong, not a generic 500.
     */
    const req = buildRequest({
      tattooDescription: 'A fierce dragon wrapping around a sword',
      style: 'Traditional',
      placement: 'Arm',
      size: 'Medium',
    })
    const res = await POST(req)
    expect(res.status).toBe(503)
    const json = await res.json()
    expect(json.error).toContain('FAL_KEY')
  })
})
