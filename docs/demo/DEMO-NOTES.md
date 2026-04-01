# AI Tattoo Generator — Demo Notes

**Captured:** 2026-03-28
**Live URL:** https://ai-tattoo-generator.vercel.app
**Brand:** InkAI (full marketing version in repo)
**Subdomain (pending):** tattoo.symplyai.io

## Screenshots Captured

| File | URL | Notes |
|------|-----|-------|
| `01-homepage.png` | https://ai-tattoo-generator.vercel.app/ | Minimal SPA — small form with Russian placeholder text |
| `02-generate.png` | https://ai-tattoo-generator.vercel.app/ | Same page, scrolled — no additional content (page height = 900px) |
| `03-pricing.png` | https://ai-tattoo-generator.vercel.app/ | Same page, scrolled — pricing section not visible at this URL |

## Site Health

- **HTTP Status:** 200 OK
- **Page is live** but is a minimal/placeholder app (not the InkAI marketing site from the repo)
- **Page height:** 900px (fits entirely in viewport — very minimal content)
- **Title:** "AI Tattoo Generator"
- **Body content:** Single form with Russian-language placeholder: "Какой скетч ты хочешь сгенерировать (на английском)" ("What sketch do you want to generate (in English)")

## Critical Issues Found

1. **Wrong app deployed at vercel.app URL** — The `ai-tattoo-generator` GitHub repo contains InkAI with a full marketing page (10 tattoo styles, pricing section, FAQ, dark theme). What's live at `ai-tattoo-generator.vercel.app` is a completely different minimal SPA with Russian-language placeholder text and no marketing content.
2. **No pricing page** — `/pricing` returns 404. The InkAI repo uses `[locale]/pricing/page.tsx` but it's not deploying correctly.
3. **Locale routing broken** — `/en/pricing`, `/es/pricing`, `/en`, `/es` all return 404. The next-intl middleware isn't functioning on this deployment.
4. **tattoo.symplyai.io subdomain** — Not configured yet (STATUS.md notes this as pending).

## Expected vs Actual

| | Expected (repo) | Actual (live) |
|---|---|---|
| Brand | InkAI | Generic "AI Tattoo Generator" |
| Content | Full marketing page with hero, features, pricing | Minimal form only |
| Pricing | Embedded on homepage + `/pricing` route | Not present |
| Styles | 10 tattoo styles, 10 body placements | Unknown |
| Language | EN/ES with next-intl | Russian placeholder text |

## Recommended Action

Re-deploy the InkAI repo content to `ai-tattoo-generator.vercel.app` or configure `tattoo.symplyai.io` to point to a correct deployment. The current live site does not represent the built InkAI product.
