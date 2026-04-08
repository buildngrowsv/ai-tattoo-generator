# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke/smoke.spec.ts >> EN homepage >> main heading is visible
- Location: tests/smoke/smoke.spec.ts:16:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3847/
Call log:
  - navigating to "http://localhost:3847/", waiting until "load"

```

# Test source

```ts
  1  | /**
  2  |  * tests/smoke/smoke.spec.ts — ai-tattoo-generator smoke tests
  3  |  * No external dependencies. < 30 seconds.
  4  |  * RUN: npx playwright test tests/smoke
  5  |  * pane1774 swarm — Scout 16, 2026-03-27
  6  |  */
  7  | import { expect, test } from "@playwright/test";
  8  | 
  9  | test.describe("EN homepage", () => {
> 10 |   test.beforeEach(async ({ page }) => { await page.goto("/"); });
     |                                                    ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3847/
  11 | 
  12 |   test("page title contains product name", async ({ page }) => {
  13 |     expect((await page.title()).toLowerCase()).toMatch(/tattoo|ink|ai tattoo/i);
  14 |   });
  15 | 
  16 |   test("main heading is visible", async ({ page }) => {
  17 |     await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  18 |   });
  19 | 
  20 |   test("pricing link navigates to /pricing", async ({ page }) => {
  21 |     await page.getByRole("link", { name: /pricing/i }).first().click();
  22 |     await expect(page).toHaveURL(/\/pricing/);
  23 |   });
  24 | });
  25 | 
  26 | test.describe("Pricing page", () => {
  27 |   test.beforeEach(async ({ page }) => { await page.goto("/pricing"); });
  28 | 
  29 |   test("pricing page renders without error", async ({ page }) => {
  30 |     await expect(page.locator("body")).toBeVisible();
  31 |     await expect(page.getByText(/application error|this page crashed/i)).toBeHidden();
  32 |   });
  33 | 
  34 |   test("Pro price is visible", async ({ page }) => {
  35 |     await expect(page.getByText(/\$9/).first()).toBeVisible();
  36 |   });
  37 | 
  38 |   test("upgrade CTA is present", async ({ page }) => {
  39 |     const cta = page
  40 |       .getByRole("button", { name: /upgrade to pro|get pro|upgrade|subscribe|go pro/i })
  41 |       .first();
  42 |     await expect(cta).toBeVisible();
  43 |   });
  44 | });
  45 | 
  46 | test.describe("ES locale routes", () => {
  47 |   test("/es renders without 404", async ({ page }) => {
  48 |     await page.goto("/es");
  49 |     await expect(page.locator("body")).toBeVisible();
  50 |     await expect(page.getByText(/page not found|404/i)).toBeHidden();
  51 |   });
  52 | 
  53 |   test("/es/pricing renders without 404", async ({ page }) => {
  54 |     await page.goto("/es/pricing");
  55 |     await expect(page.locator("body")).toBeVisible();
  56 |     await expect(page.getByText(/page not found|404/i)).toBeHidden();
  57 |   });
  58 | });
  59 | 
  60 | test.describe("API route sanity", () => {
  61 |   test("POST /api/generate returns structured error on empty body", async ({ request }) => {
  62 |     const resp = await request.post("/api/generate", {
  63 |       headers: { "Content-Type": "application/json" },
  64 |       data: {},
  65 |     });
  66 |     expect([400, 401, 422, 429]).toContain(resp.status());
  67 |     const body = await resp.json().catch(() => null);
  68 |     expect(body).toHaveProperty("error");
  69 |   });
  70 | });
  71 | 
```