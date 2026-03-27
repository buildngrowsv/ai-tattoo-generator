/**
 * tests/smoke/smoke.spec.ts — ai-tattoo-generator smoke tests
 * No external dependencies. < 30 seconds.
 * RUN: npx playwright test tests/smoke
 * pane1774 swarm — Scout 16, 2026-03-27
 */
import { expect, test } from "@playwright/test";

test.describe("EN homepage", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/"); });

  test("page title contains product name", async ({ page }) => {
    expect((await page.title()).toLowerCase()).toMatch(/tattoo|ink|ai tattoo/i);
  });

  test("main heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("pricing link navigates to /pricing", async ({ page }) => {
    await page.getByRole("link", { name: /pricing/i }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
  });
});

test.describe("Pricing page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/pricing"); });

  test("pricing page renders without error", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/application error|this page crashed/i)).toBeHidden();
  });

  test("Pro price is visible", async ({ page }) => {
    await expect(page.getByText(/\$9/).first()).toBeVisible();
  });

  test("upgrade CTA is present", async ({ page }) => {
    const cta = page
      .getByRole("button", { name: /upgrade to pro|get pro|upgrade|subscribe|go pro/i })
      .first();
    await expect(cta).toBeVisible();
  });
});

test.describe("ES locale routes", () => {
  test("/es renders without 404", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/page not found|404/i)).toBeHidden();
  });

  test("/es/pricing renders without 404", async ({ page }) => {
    await page.goto("/es/pricing");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/page not found|404/i)).toBeHidden();
  });
});

test.describe("API route sanity", () => {
  test("POST /api/generate returns structured error on empty body", async ({ request }) => {
    const resp = await request.post("/api/generate", {
      headers: { "Content-Type": "application/json" },
      data: {},
    });
    expect([400, 401, 422, 429]).toContain(resp.status());
    const body = await resp.json().catch(() => null);
    expect(body).toHaveProperty("error");
  });
});
