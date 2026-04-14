import { defineConfig, devices } from "@playwright/test";

/**
 * playwright.config.ts — ai-tattoo-generator E2E config
 * BASE_URL=https://tattoo.symplyai.io npx playwright test
 * pane1774 swarm — Scout 16, 2026-03-27
 */
export default defineConfig({
  testDir: ".",
  testMatch: ["tests/**/*.spec.ts", "e2e/**/*.spec.ts"],
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "line",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3847",
    headless: !process.env.PWDEBUG,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
