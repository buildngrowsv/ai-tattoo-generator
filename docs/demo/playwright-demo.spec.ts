/**
 * playwright-demo.spec.ts — Demo recording for AI Tattoo Generator
 *
 * URL: https://ai-tattoo-generator.vercel.app
 * Custom domain: tattoo.symplyai.io (may be live)
 *
 * USAGE:
 *   cd Github/fleet-e2e-tests
 *   DEMO_URL=https://ai-tattoo-generator.vercel.app DEMO_PRODUCT=ai-tattoo-generator \
 *   DEMO_STUDIO_PATH=/generate \
 *   npx playwright test --config demo-framework/playwright.demo.config.ts \
 *     demo-framework/demo-template.spec.ts
 *
 * Or standalone:
 *   cd Github/ai-tattoo-generator
 *   DEMO_URL=https://ai-tattoo-generator.vercel.app \
 *   npx playwright test docs/demo/playwright-demo.spec.ts --headed
 *
 * Existing screenshots in docs/demo/screenshots/:
 *   01-homepage.png — Landing page
 *   02-generate.png — Generation UI (/generate)
 *   03-pricing.png — Pricing page
 *
 * SWARM: Background Agent + Scout 4, Demo Swarm 2026-03-28
 */

export { }; // Module marker — actual spec runs via fleet-e2e-tests/demo-framework/
// Run using the demo-template.spec.ts from the fleet-e2e-tests framework
// See README.md for full run instructions
