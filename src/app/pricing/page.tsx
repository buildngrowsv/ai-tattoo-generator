/**
 * /pricing route — Redirect to the landing page pricing section.
 *
 * WHY THIS PAGE EXISTS:
 * The tattoo generator landing page embeds pricing inline (PricingSectionWithTiers
 * at the `#pricing` anchor). External links and nav items pointing to /pricing
 * were returning 404, breaking the monetization funnel.
 *
 * APPROACH — Server-side redirect (308 Permanent):
 * Uses Next.js `redirect()` so search engines see a proper permanent redirect
 * rather than a 404. Preserves SEO juice from any inbound /pricing links.
 * Users land directly on the pricing section embedded in the full landing page
 * with all surrounding context (demo, social proof, FAQ) that aids conversion.
 *
 * ALTERNATIVE CONSIDERED — Standalone page:
 * Rejected — the embedded pricing section converts better in context. The
 * generated tattoo examples shown above it build the "I want this" desire
 * before the user sees the price.
 *
 * Scout 13 identified this as a revenue-blocking 404 during the 2026-03-25
 * clone fleet audit. Fixed in the same session.
 */
import { redirect } from "next/navigation";

/**
 * PricingRedirectPage — Immediately redirects to /#pricing.
 *
 * Server Component — redirect() runs server-side, no JS required on client.
 * Next.js returns HTTP 308 Permanent Redirect to the browser.
 */
export default function PricingRedirectPage() {
  redirect("/#pricing");
}
