/**
 * build.smoke.test.ts — Smoke test verifying the app environment loads correctly.
 *
 * WHY THIS EXISTS: During the pane1774 swarm (2026-03-24), multiple clone apps were
 * pushed without tests. This test ensures vitest is correctly configured and
 * catches environment-level issues before they reach Vercel CI.
 *
 * This is an intentionally simple test: it doesn't call any real services or
 * require env vars to be set. Its only job is to confirm that:
 * 1. The vitest + jsdom environment initializes correctly
 * 2. Node.js process.env is accessible (important for server-side env var guards
 *    like the FAL_KEY check in the generate route)
 *
 * More substantive API route tests are in api.smoke.test.ts.
 */
import { describe, it, expect } from 'vitest'

describe('AI Tattoo Generator — build smoke test', () => {
  it('vitest environment initializes correctly', () => {
    expect(true).toBe(true)
  })

  it('process.env is accessible for server-side env var checks', () => {
    expect(typeof process.env).toBe('object')
  })
})
