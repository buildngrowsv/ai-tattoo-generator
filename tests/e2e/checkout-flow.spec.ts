/**
 * tests/e2e/checkout-flow.spec.ts — AI Tattoo Generator Stripe checkout E2E
 *
 * Operator directive 2026-03-27: background checkout E2E tests.
 * localStorage key: tattoo_pro_token | success_url: ?checkout=success&token=
 * Price: $9.90/month | CTA: "Upgrade to Pro"
 * Production: BASE_URL=https://tattoo.symplyai.io
 *
 * REQUIRED ENV VARS:
 *   BASE_URL, TEST_CHECKOUT_EMAIL, PRIVACY_CARD_NUMBER, PRIVACY_CARD_EXPIRY
 *   PRIVACY_CARD_CVC, TEST_STRIPE_COUPON_CODE
 *
 * pane1774 swarm — Scout 16, 2026-03-27
 */
import { expect, test } from "@playwright/test";

function hasEnvVars(): boolean {
  return ["PRIVACY_CARD_NUMBER","PRIVACY_CARD_EXPIRY","PRIVACY_CARD_CVC",
          "TEST_STRIPE_COUPON_CODE","TEST_CHECKOUT_EMAIL"].every((k) => Boolean(process.env[k]));
}

test.describe("Phase 1 — Homepage and free tier", () => {
  test("homepage loads", async ({ page }) => {
    expect((await page.goto("/"))?.status()).toBeLessThan(500);
  });
  test("pricing page accessible from nav", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /pricing/i }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
  });
  test("upgrade CTA present on pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(
      page.getByRole("button", { name: /upgrade to pro|get pro|upgrade|subscribe|go pro/i }).first()
    ).toBeVisible();
  });
});

test.describe("Phase 2 — Full Stripe checkout", () => {
  test.beforeEach(() => { if (!hasEnvVars()) test.skip(); });

  test("complete checkout → Pro token in URL", async ({ page }) => {
    const [email, cardNum, expiry, cvc, coupon] = [
      process.env.TEST_CHECKOUT_EMAIL!,
      process.env.PRIVACY_CARD_NUMBER!,
      process.env.PRIVACY_CARD_EXPIRY!,
      process.env.PRIVACY_CARD_CVC!,
      process.env.TEST_STRIPE_COUPON_CODE!,
    ];

    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /upgrade to pro|get pro|upgrade|subscribe|go pro/i }).first().click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });

    const emailField = page.getByRole("textbox", { name: /email/i }).first();
    if (await emailField.isVisible({ timeout: 5_000 }).catch(() => false)) await emailField.fill(email);

    const promoLink = page.getByText(/promotion code|coupon|promo/i).first();
    if (await promoLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await promoLink.click();
      const promoInput = page.getByPlaceholder(/promotion|coupon|code/i).first();
      if (await promoInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await promoInput.fill(coupon);
        const applyBtn = page.getByRole("button", { name: /apply/i }).first();
        if (await applyBtn.isVisible({ timeout: 2_000 }).catch(() => false)) await applyBtn.click();
        else await promoInput.press("Enter");
        await page.waitForTimeout(2_000);
      }
    }

    // Card entry with iframe/direct fallback
    const cardNumFrame = page.frameLocator('iframe[name*="card-number"]').getByRole("textbox").first();
    if (await cardNumFrame.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await cardNumFrame.fill(cardNum);
      await page.frameLocator('iframe[name*="card-expiry"]').getByRole("textbox").first().fill(expiry);
      await page.frameLocator('iframe[name*="card-cvc"]').getByRole("textbox").first().fill(cvc);
    } else {
      const df = page.getByPlaceholder(/card number|1234/i).first();
      if (await df.isVisible({ timeout: 3_000 }).catch(() => false)) await df.fill(cardNum);
      const de = page.getByPlaceholder(/mm.*yy|expiry/i).first();
      if (await de.isVisible({ timeout: 2_000 }).catch(() => false)) await de.fill(expiry);
      const dc = page.getByPlaceholder(/cvc|cvv/i).first();
      if (await dc.isVisible({ timeout: 2_000 }).catch(() => false)) await dc.fill(cvc);
    }

    await page.getByRole("button", { name: /pay|subscribe|complete|confirm/i }).first().click();
    await page.waitForURL(
      (url) => url.searchParams.has("token") || url.searchParams.has("checkout"),
      { timeout: 60_000 }
    );
    const token = new URL(page.url()).searchParams.get("token");
    expect(token, "No token param — entitlement broken").toBeTruthy();
    expect(token).toMatch(/^[0-9a-f-]{36}$/i);
  });
});

test.describe("Phase 3 — Entitlement verification", () => {
  test.beforeEach(() => { if (!hasEnvVars()) test.skip(); });

  test("fake Pro token is rejected by generate route", async ({ request }) => {
    const resp = await request.post("/api/generate", {
      headers: { "Content-Type": "application/json", "x-pro-token": "00000000-0000-0000-0000-000000000000" },
      data: { prompt: "" },
    });
    expect(resp.status()).not.toBe(200);
    expect(await resp.json().catch(() => null)).toHaveProperty("error");
  });
});
