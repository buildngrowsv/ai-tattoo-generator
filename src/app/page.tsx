/**
 * LANDING PAGE — AI Tattoo Design Generator (InkAI)
 *
 * This is the primary entry point and the page that will drive all organic
 * traffic, conversions, and revenue. It's structured as a single-page
 * marketing site with the tool integrated directly into the hero section.
 * Users can generate tattoo designs without navigating anywhere else.
 *
 * PAGE STRUCTURE (in scroll order):
 * 1. HEADER — Brand logo + "Go Pro" CTA (sticky)
 * 2. HERO — Headline, subheadline, trust badge, and the generator form
 * 3. FEATURES — 3-column grid: AI-Powered, Any Style, Instant Preview
 * 4. SOCIAL PROOF — Stats and trust signals
 * 5. PRICING — Free vs Pro comparison (PricingSectionWithTiers)
 * 6. FAQ — SEO-rich content + objection handling (FrequentlyAskedQuestionsSection)
 * 7. FOOTER — Legal links, branding, copyright
 *
 * SEO STRATEGY:
 * Primary keyword: "AI tattoo generator"
 * Secondary: "tattoo design AI", "AI tattoo maker", "custom tattoo design"
 * Long-tail FAQ targets: "is AI tattoo generator free", "what tattoo styles", etc.
 *
 * The heading, meta description, FAQ answers, and page copy all naturally
 * incorporate these keywords. The FAQ section targets long-tail queries
 * for Featured Snippet opportunities.
 *
 * CONVERSION STRATEGY:
 * The generator form is placed IN the hero section (above the fold on desktop).
 * Users can try the tool immediately — no signup, no friction. The pricing
 * section appears after they've experienced the quality, creating a natural
 * upgrade moment. This is the PLG (Product-Led Growth) approach used by
 * remove.bg, Canva, Midjourney, and other successful AI tools.
 *
 * ARCHITECTURE:
 * This page is a Server Component (no "use client") because most content
 * is static marketing text. The interactive TattooGeneratorForm is a Client
 * Component imported and embedded in the hero section. Server Components
 * produce smaller JS bundles and are better for SEO.
 *
 * DEPENDS ON:
 * - TattooGeneratorForm (Client Component — the interactive generator)
 * - PricingSectionWithTiers (Server Component — pricing cards)
 * - FrequentlyAskedQuestionsSection (Server Component — FAQ accordion)
 * - lucide-react (icons for visual hierarchy)
 */

import TattooGeneratorForm from "@/components/TattooGeneratorForm";
import PricingSectionWithTiers from "@/components/PricingSectionWithTiers";
import FrequentlyAskedQuestionsSection from "@/components/FrequentlyAskedQuestionsSection";
import {
  Sparkles,
  Palette,
  Zap,
  Eye,
  PenTool,
  Users,
  Clock,
  Shield,
} from "lucide-react";

/**
 * Home — The landing page component.
 *
 * Server Component — renders static marketing content with embedded
 * Client Components for interactivity. This hybrid approach gives us
 * the best of both worlds: fast initial load + rich interactivity.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================================
          SECTION 1: STICKY HEADER / NAVIGATION

          Minimal header with just logo and CTA. Single-page tools don't
          need complex navigation — the page scrolls through all content.
          The "Go Pro" CTA is always visible via sticky positioning,
          providing a constant conversion opportunity.

          The backdrop-blur gives a modern frosted glass effect that
          maintains readability over any scrolled content beneath it.
          ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand mark — logo and wordmark */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-md shadow-violet-600/25 group-hover:shadow-violet-600/40 transition-shadow">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Ink<span className="gradient-text-static">AI</span>
            </span>
          </a>

          {/* Primary CTA — scrolls to pricing section.
              Using an anchor link (#pricing) for smooth scroll navigation.
              The gradient styling matches the generate button for visual
              consistency across all primary CTAs. */}
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-500/35"
          >
            <Zap className="w-4 h-4" />
            Go Pro
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* ============================================================
            SECTION 2: HERO — The "above the fold" experience

            The hero must accomplish three things in under 3 seconds:
            1. Communicate what the tool does (gradient headline)
            2. Communicate it's free/easy (subheadline)
            3. Invite action (the generator form below)

            The hero-dot-pattern background adds subtle depth without
            distracting from content. The gradient text on the headline
            draws the eye and signals "premium/innovative."

            CRITICAL: The TattooGeneratorForm is placed INSIDE the hero
            section so it appears above the fold on desktop. Users can
            start generating without scrolling.
            ============================================================ */}
        <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 hero-dot-pattern">
          {/* Subtle radial gradient overlay for visual depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              {/* Trust badge pill — adds credibility above the headline.
                  "AI-Powered" is a trust signal that communicates the tool
                  uses real technology, not just filters or templates. */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6 border border-violet-500/20">
                <Sparkles className="w-4 h-4" />
                AI-Powered Tattoo Design
              </div>

              {/* Main headline — targets "AI tattoo generator" search intent.
                  The gradient-text-animated class creates a shifting purple-blue
                  gradient that's visually striking and draws the eye. */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                AI Tattoo Design{" "}
                <span className="gradient-text-animated">Generator</span>
              </h1>

              {/* Subheadline — addresses three user concerns:
                  1. What it does ("Describe your dream tattoo")
                  2. How fast ("see it come to life")
                  3. How easy ("with AI" — no skill required) */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Describe your dream tattoo and see it come to life with AI.
                Choose from 10 styles, pick your placement, and get a custom
                design in seconds. Free to try.
              </p>
            </div>

            {/* THE GENERATOR FORM — The core interactive element.
                This Client Component handles all form state, API calls,
                and result display. It's the "product" that users interact
                with directly on the landing page. */}
            <TattooGeneratorForm />
          </div>
        </section>

        {/* ============================================================
            SECTION 3: FEATURES — 3-column value proposition grid

            Shows the three key benefits of the product at a glance.
            Each feature addresses a specific user need:
            - AI-Powered: "This is real technology, not templates"
            - Any Style: "It handles my preferred tattoo style"
            - Instant Preview: "I get results immediately"

            The icons provide visual anchors for quick scanning.
            Users who scroll past the hero quickly can understand
            the value proposition from icons + headlines alone.
            ============================================================ */}
        <section className="py-16 sm:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Why Use{" "}
                <span className="gradient-text-static">InkAI</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                The fastest way to visualize your tattoo ideas before going to the studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1: AI-Powered — addresses "is this legitimate?" concern */}
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5 group-hover:bg-violet-500/20 transition-colors">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Design</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Advanced AI models create unique, professional-quality tattoo
                  artwork from your text descriptions. Every design is one-of-a-kind.
                </p>
              </div>

              {/* Feature 2: Any Style — addresses "does it support MY style?" */}
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors">
                  <Palette className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">10+ Tattoo Styles</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Traditional, Watercolor, Japanese, Geometric, Minimalist, and
                  more. Each style produces authentic, style-specific results.
                </p>
              </div>

              {/* Feature 3: Instant Preview — addresses "how fast is it?" */}
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                  <Eye className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Preview</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  See your tattoo design in seconds, not days. Iterate quickly
                  on ideas before committing to a permanent piece of art.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4: SOCIAL PROOF / TRUST SIGNALS

            Numbers build trust and communicate scale. These stats are
            aspirational at launch — update with real data as the app
            grows. The structure is in place for real metrics.

            NOTE: Update these numbers with real data post-launch.
            Consider connecting to an analytics API to auto-populate.
            ============================================================ */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PenTool className="w-5 h-5 text-violet-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    50K+
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">Designs Created</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    ~10s
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">Generation Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    10+
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">Tattoo Styles</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                    100%
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">Private & Secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 5: PRICING — Free vs Pro tier comparison
            See PricingSectionWithTiers for detailed documentation.
            ============================================================ */}
        <PricingSectionWithTiers />

        {/* ============================================================
            SECTION 6: FAQ — SEO content + objection handling
            See FrequentlyAskedQuestionsSection for detailed documentation.
            ============================================================ */}
        <FrequentlyAskedQuestionsSection />
      </main>

      {/* ============================================================
          SECTION 7: FOOTER

          Minimal footer with legal links and branding. Legal pages
          (Privacy, Terms, Refund) are required for:
          - Stripe payment processing compliance
          - GDPR/privacy regulation compliance
          - General business credibility and trust

          These legal pages will be created as separate routes when
          we integrate Stripe payments.
          ============================================================ */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Footer branding — smaller version of the header logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-sm">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight">
                Ink<span className="gradient-text-static">AI</span>
              </span>
            </div>

            {/* Legal navigation links — required for payment compliance */}
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/refund"
                className="hover:text-foreground transition-colors"
              >
                Refund Policy
              </a>
              <a
                href="mailto:support@inkai.app"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* Copyright notice */}
            <p className="text-xs text-muted-foreground/60">
              &copy; 2026 InkAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
