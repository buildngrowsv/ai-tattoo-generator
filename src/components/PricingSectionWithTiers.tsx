/**
 * PRICING SECTION — Free vs Pro Tier Comparison
 *
 * This component displays the pricing options for the AI Tattoo Generator.
 * It follows the "freemium" model that's proven in AI tool SaaS:
 * - Free tier: Limited usage (3 generations/day) to let users experience value
 * - Pro tier: Unlimited usage at $9.90/mo for power users and tattoo artists
 *
 * WHY $9.90/mo (not $9.99 or $14.99):
 * $9.90 is a psychological pricing sweet spot for AI tools:
 * 1. Below $10 feels "cheap" — reduces purchase anxiety
 * 2. The ".90" ending feels more intentional/honest than ".99"
 * 3. Competitive with similar AI image tools (most charge $10-20/mo)
 * 4. At this price point, we only need ~200 subscribers for $2K MRR
 * 5. Cost of goods (~$0.03/generation * ~50 avg/user) = ~$1.50/user, so ~84% margin
 *
 * CONVERSION STRATEGY:
 * The pricing section appears AFTER the user has already tried the free tool
 * (it's below the generator in the page scroll). This means they've already
 * experienced the quality and have a natural "I want more" desire. The Pro
 * card is visually highlighted with a gradient border to draw attention.
 *
 * CALLED BY: src/app/page.tsx (pricing section)
 * DEPENDS ON: lucide-react for icons
 */

import { Check, Zap, Crown } from "lucide-react";

/**
 * PricingSectionWithTiers — Renders the Free vs Pro pricing comparison.
 *
 * Server Component (no "use client") because pricing is static content.
 * In the future, the "Go Pro" button will integrate with Stripe Checkout,
 * which would require making this (or a child component) a Client Component.
 * For MVP, the button shows the price and could link to a Stripe Payment Link.
 */
export default function PricingSectionWithTiers() {
  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — targets "AI tattoo generator pricing" search intent */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple,{" "}
            <span className="gradient-text-static">Transparent Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need unlimited designs.
          </p>
        </div>

        {/* Pricing cards grid — two cards side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ============================================================
              FREE TIER CARD

              The free tier is intentionally generous enough to be useful
              (3 designs/day) but limited enough that regular users will
              want more. 3/day was chosen because:
              - One generation to explore an idea
              - One to refine it
              - One to try a different style
              That's a complete "session" — but users who want to explore
              multiple ideas need Pro.
              ============================================================ */}
          <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="text-sm text-muted-foreground">
                  Try it out
                </p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "3 designs per day",
                "10 tattoo styles",
                "All body placements",
                "Standard resolution",
                "Download as PNG",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border"
            >
              Current Plan
            </button>
          </div>

          {/* ============================================================
              PRO TIER CARD — Highlighted with gradient border

              The Pro card uses a gradient border and "POPULAR" badge to
              draw visual attention. The price is displayed prominently
              with monthly billing emphasized. Annual billing with discount
              can be added later to improve LTV.

              Feature list includes everything in Free plus premium features
              that justify the price. "Priority generation" means Pro users
              get faster API response times (higher queue priority).
              ============================================================ */}
          <div className="rounded-2xl bg-card border-2 border-primary/50 p-6 sm:p-8 flex flex-col relative shadow-lg shadow-primary/10">
            {/* Popular badge — social proof element */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                MOST POPULAR
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pro</h3>
                <p className="text-sm text-muted-foreground">
                  For artists & enthusiasts
                </p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$9.90</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Unlimited designs",
                "10 tattoo styles",
                "All body placements",
                "High resolution output",
                "Download as PNG",
                "Priority generation speed",
                "Commercial use license",
                "Early access to new styles",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* STRIPE PAYMENT LINK — Direct link to Stripe-hosted checkout page.
             *
             * WHY A PAYMENT LINK (not embedded Checkout Session):
             * 1. Zero backend code needed — Stripe hosts the entire checkout flow
             * 2. No server-side session creation = no auth dependency for payments
             * 3. Works immediately once the Stripe Payment Link is created in dashboard
             * 4. Mobile-optimized by default (Stripe handles responsive checkout)
             * 5. PCI compliance handled entirely by Stripe — no card data touches our server
             *
             * HOW TO SET UP:
             * 1. Go to https://dashboard.stripe.com/payment-links
             * 2. Create a Payment Link for "AI Tattoo Generator Pro" at $9.90/month recurring
             * 3. Copy the link URL (e.g., https://buy.stripe.com/xxxxxxxxxxxx)
             * 4. Replace the placeholder href below with the real Stripe Payment Link URL
             *
             * The placeholder URL links to the Stripe payment links creation page
             * so the coordinator/BC1 can create it via BCL when ready.
             */}
            <a
              href="https://buy.stripe.com/eVq14ngEhbUYgDN1CVfMA05"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-500/30 text-center block"
            >
              Upgrade to Pro — $9.90/mo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
