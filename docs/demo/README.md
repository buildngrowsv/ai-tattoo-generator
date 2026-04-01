# AI Tattoo Generator — Product Demo

Recorded by Scout 4, T5 BridgeSwarm, 2026-03-28.

## Files

| File | Description |
|------|-------------|
| `index.html` | Gallery viewer — open in Chrome to review |
| `screenshots/` | 9 PNG screenshots (01-landing → 09-feature-reuse) |
| `videos/ai-tattoo-generator-demo/video.webm` | Full session recording |

## Re-run

```bash
cd Github/fleet-e2e-tests
DEMO_HEADLESS=1 DEMO_SLOWMO=0 \
  DEMO_URL=https://ai-tattoo-generator.vercel.app \
  DEMO_PRODUCT=ai-tattoo-generator \
  DEMO_STUDIO_PATH=/generate \
  npx playwright test --config demo-framework/playwright.demo.config.ts demo-framework/demo-template.spec.ts

cp fleet-e2e-tests/demo-framework/test-results/demo-ai-tattoo-generator/**/*.png Github/ai-tattoo-generator/docs/demo/screenshots/
```

View gallery:
```bash
open Github/ai-tattoo-generator/docs/demo/index.html
```

## Target URL
- **Production:** https://ai-tattoo-generator.vercel.app (HTTP 200 ✅)
- **Branded subdomain:** https://tattoo.symplyai.io (Vercel alias pending ⚠️)

## Findings
- Landing page loads with product branding ✅
- Core generation UI at /generate accessible anonymously ✅
- Auth gate redirects work correctly (dashboard/account → login) ✅
- Google OAuth sign-in button visible ✅
- No custom branded domain yet (using vercel.app subdomain) ⚠️
