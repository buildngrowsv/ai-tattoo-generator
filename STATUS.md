# AI Tattoo Generator (InkAI) — Status

## Current State: Monetization Path Exists, Entitlements Not Production-Ready

**Last Updated:** 2026-03-25
**Builder:** Builder 7 (pane1774 T022-20 follow-up)

## What's Built

- Landing page with marketing-polished dark theme (zinc-950/zinc-900 palette)
- Interactive tattoo generator form with 10 styles, 10 body placements, 3 sizes
- API route (`/api/generate`) with fal.ai FLUX integration
- Server-side IP rate limiting in `/api/generate` before provider spend
- Dedicated localized pricing route at `/pricing` and `/es/pricing`
- Live Pro CTA via `TattooProCheckoutButton` calling `/api/stripe/create-checkout`
- Fleet-standard checkout compatibility route at `/api/stripe/checkout`
- Stripe webhook endpoint at `/api/stripe/webhook`
- SEO FAQ section, responsive layout, sticky header, footer

## Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- fal.ai FLUX model for image generation
- Stripe checkout + webhook plumbing
- lucide-react for icons

## What Works

- Full landing page and dedicated pricing page render on disk
- Generator form collects inputs and calls `/api/generate`
- `/api/generate` is server-rate-limited before fal.ai spend
- Pricing CTA posts to `/api/stripe/create-checkout` and can create a Stripe Checkout Session when env vars are present
- `/api/stripe/checkout` also exists for fleet-standard `priceId` callers
- Stripe webhook now uses `stripe.webhooks.constructEvent` for canonical signature verification
- Checkout success redirect now returns to a real route (`/?checkout=success`) instead of a missing `/success` page

## Current Risks / Gaps

- No entitlement database exists yet, so checkout completion does not grant durable Pro access
- Webhook intentionally fails closed with `503` for `checkout.session.completed` and subscription lifecycle events until a DB-backed entitlement flow exists
- `TattooProCheckoutButton` still falls back to a static Stripe Payment Link if the server-side checkout route errors
- `STATUS.md` previously overstated missing Stripe/rate-limit work; this file now reflects the current code truth instead

## What's Needed For Launch

1. **Entitlement Backend**: Add auth + DB persistence so Stripe webhook events can grant and revoke Pro access instead of failing closed
2. **Stripe Env Wiring**: Confirm `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`/price mapping, `NEXT_PUBLIC_APP_URL`, and `STRIPE_WEBHOOK_SECRET` are set in Vercel
3. **Webhook Release**: Once entitlement persistence exists, change webhook checkout/subscription events from `503` fail-closed to real provisioning
4. **Legal Pages**: Create `/privacy`, `/terms`, and `/refund`
5. **Live Verification**: Browser-check pricing CTA, successful Stripe redirect, and webhook delivery on the deployed domain
6. **Brand/Domain**: Confirm final production domain strategy if `tattoo.symplyai.io` is the intended canonical host
7. **OG Image**: Create social sharing preview image

## Dev Server

```bash
npm run dev  # Runs on port 3847
```
