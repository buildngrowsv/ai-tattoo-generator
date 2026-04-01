/**
 * tattoo-demo.spec.ts — Full product demo recording for AI Tattoo Generator
 *
 * PURPOSE: Records a complete user flow walkthrough of ai-tattoo-generator.vercel.app
 * for operator review, investor demos, and product documentation. Generates a .webm
 * video recording plus screenshots at each major step.
 *
 * TARGET: https://ai-tattoo-generator.vercel.app (HTTP 200 verified 2026-03-28)
 *   Alias: https://tattoo.symplyai.io (CNAME live in Cloudflare, Vercel alias pending)
 *
 * DEMO FLOW (9 steps):
 * 1. Landing page — hero, headline, example tattoo designs
 * 2. Pricing/features — pricing section or /pricing page
 * 3. Sign up flow — /login page (Google OAuth overlay)
 * 4. Signed in state — /generate with auth gate shown
 * 5. Core feature — /generate tattoo prompt input + style selector
 * 6. Account page — /account credits and settings
 * 7. Logout — signed-out state
 * 8. Login — return to /login
 * 9. Feature reuse — back to /generate for returning users
 *
 * USAGE:
 *   cd Github/ai-tattoo-generator
 *   DEMO_URL=https://ai-tattoo-generator.vercel.app \
 *   npx playwright test docs/demo/tattoo-demo.spec.ts \
 *     --config docs/demo/playwright.demo.config.ts
 *
 * OR via fleet-e2e-tests framework (recommended):
 *   cd Github/fleet-e2e-tests
 *   DEMO_URL=https://ai-tattoo-generator.vercel.app DEMO_PRODUCT=ai-tattoo-generator \
 *   DEMO_STUDIO_PATH=/generate DEMO_HEADLESS=1 \
 *   npx playwright test --config demo-framework/playwright.demo.config.ts \
 *     demo-framework/demo-template.spec.ts
 *
 * OUTPUT: docs/demo/screenshots/ + docs/demo/videos/
 *
 * SWARM: Scout 4, T5, pane1774, 2026-03-28
 */

import { test, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

// ─── Config ─────────────────────────────────────────────────────────────────
const DEMO_BASE_URL =
  process.env.DEMO_URL || "https://ai-tattoo-generator.vercel.app";

const SCREENSHOTS_DIR = path.join(__dirname, "screenshots");

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function step(
  page: Page,
  number: string,
  label: string,
  waitMs = 1500
): Promise<void> {
  await page.waitForTimeout(waitMs);

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const filename = path.join(SCREENSHOTS_DIR, `${number}-${label}.png`);
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`📸 Screenshot saved: ${number}-${label}.png`);
}

// ─── Test Suite ──────────────────────────────────────────────────────────────

test.describe("AI Tattoo Generator — Full Product Demo", () => {
  test("complete user flow walkthrough", async ({ page }) => {
    // ── Step 1: Landing Page ─────────────────────────────────────────────────
    console.log("▶ Step 1: Landing Page");
    await page.goto(DEMO_BASE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);
    const pageTitle = await page.title();
    console.log(`  Page title: ${pageTitle}`);
    await step(page, "01", "landing");

    // ── Step 2: Pricing ───────────────────────────────────────────────────────
    console.log("▶ Step 2: Pricing");
    const pricingLink = page.locator('a[href*="pric"], a:has-text("Pricing"), a:has-text("Plans")').first();
    if ((await pricingLink.count()) > 0) {
      await pricingLink.click();
      await page.waitForTimeout(1500);
    } else {
      await page.goto(`${DEMO_BASE_URL}/pricing`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(1500);
    }
    await step(page, "02", "pricing");

    // ── Step 3: Sign Up Flow ──────────────────────────────────────────────────
    console.log("▶ Step 3: Sign Up Flow");
    await page.goto(`${DEMO_BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    await step(page, "03", "signup");

    // ── Step 4: Authenticated State (auth gate) ───────────────────────────────
    console.log("▶ Step 4: Auth Gate / Studio");
    await page.goto(`${DEMO_BASE_URL}/generate`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    await step(page, "04", "signed-in");

    // ── Step 5: Core Feature — Tattoo Generation ──────────────────────────────
    console.log("▶ Step 5: Core Feature — Tattoo Generation");
    // Already at /generate from step 4
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: "smooth" }));
    await page.waitForTimeout(1000);
    await step(page, "05", "core-feature");

    // ── Step 6: Account Page ──────────────────────────────────────────────────
    console.log("▶ Step 6: Account Page");
    await page.goto(`${DEMO_BASE_URL}/account`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    await step(page, "06", "account");

    // ── Step 7: Logout ────────────────────────────────────────────────────────
    console.log("▶ Step 7: Logout / Sign Out");
    await page.goto(DEMO_BASE_URL, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);
    const logoutBtn = page.locator('a[href*="sign-out"], a[href*="logout"], button:has-text("Sign Out"), button:has-text("Log Out")').first();
    if ((await logoutBtn.count()) > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(1500);
    }
    await step(page, "07", "logged-out");

    // ── Step 8: Login Page ────────────────────────────────────────────────────
    console.log("▶ Step 8: Login Page");
    await page.goto(`${DEMO_BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    await step(page, "08", "login");

    // ── Step 9: Feature Reuse ─────────────────────────────────────────────────
    console.log("▶ Step 9: Feature Reuse");
    await page.goto(`${DEMO_BASE_URL}/generate`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    await step(page, "09", "feature-reuse");

    console.log("✅ AI Tattoo Generator demo recording complete!");
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log("🎬 Video recording saved by Playwright (docs/demo/videos/)");
  });
});
