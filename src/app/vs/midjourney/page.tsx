/**
 * src/app/vs/midjourney/page.tsx — InkAI vs Midjourney comparison page
 *
 * SEO STRATEGY:
 * Targets "midjourney tattoo design", "midjourney alternative for tattoos",
 * "AI tattoo generator vs midjourney" and related queries. Midjourney is the
 * most searched AI image generator — users trying to create tattoo designs with
 * it discover it is not purpose-built for tattoos. This page captures that
 * intent and redirects it to a tool specifically designed for tattoo art.
 *
 * STRUCTURED DATA:
 * FAQPage JSON-LD for rich results in Google SERPs. Questions target common
 * searches around using Midjourney for tattoo design vs dedicated tools.
 *
 * MIDDLEWARE NOTE:
 * /vs/ must be excluded from next-intl middleware — see middleware.ts matcher.
 * If this page 404s, add "vs|" to the middleware exclusion pattern.
 *
 * Agent meridian-strike-6391-worker-4, pane1775 swarm — SEO landing pages, 2026-04-06
 */

import type { Metadata } from "next";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Metadata — optimized for "midjourney tattoo" and "AI tattoo generator" SERPs
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "InkAI vs Midjourney for Tattoo Design — Best AI Tattoo Generator",
  description:
    "Compare InkAI with Midjourney for creating tattoo designs. Purpose-built AI tattoo generator with tattoo-specific styles, placement preview, and no Discord required. Free to try.",
  keywords: [
    "midjourney tattoo design",
    "midjourney alternative tattoo",
    "AI tattoo generator",
    "midjourney vs tattoo generator",
    "best AI for tattoo design",
    "tattoo design AI tool",
    "free AI tattoo generator",
  ],
  alternates: {
    canonical: "https://tattoo.symplyai.io/vs/midjourney",
  },
  openGraph: {
    title: "InkAI vs Midjourney — Which Is Better for Tattoo Design?",
    description:
      "Midjourney is great for general art, but InkAI is purpose-built for tattoo design with tattoo-specific styles and placement guidance.",
    url: "https://tattoo.symplyai.io/vs/midjourney",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// FAQ data — targets long-tail "midjourney tattoo" queries
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "Can I use Midjourney to design tattoos?",
    answer:
      "Yes, but Midjourney is a general-purpose AI image generator. You need to write complex prompts to get tattoo-style results, and it has no understanding of tattoo placement, skin contours, or ink-specific constraints. InkAI is purpose-built for tattoo design with pre-tuned styles like Traditional, Japanese, Geometric, Tribal, Blackwork, and Watercolor — no prompt engineering needed.",
  },
  {
    question: "Is InkAI cheaper than Midjourney for tattoo designs?",
    answer:
      "Midjourney costs $10-60/month depending on the plan and requires a Discord account. InkAI offers free tattoo design generations each day and a Pro plan at $9.90/month for unlimited designs. For someone who specifically needs tattoo designs, InkAI is more cost-effective since every feature is focused on tattoos.",
  },
  {
    question: "Do I need Discord to use InkAI?",
    answer:
      "No. InkAI works directly in your web browser at tattoo.symplyai.io. You do not need to install Discord, join a server, or learn bot commands. Just describe your tattoo idea, pick a style, and get your design in seconds.",
  },
  {
    question: "Which tool produces better tattoo-specific artwork?",
    answer:
      "For general AI art, Midjourney produces impressive results. But for tattoo-specific work — clean linework, proper shading for ink, body placement awareness, and style accuracy (Traditional, Japanese, Neo-Traditional, etc.) — InkAI is trained and optimized specifically for tattoo art. The output is designed to be taken directly to a tattoo artist as a reference.",
  },
  {
    question: "Can I use InkAI designs as tattoo references for my tattoo artist?",
    answer:
      "Absolutely. InkAI designs are created to serve as tattoo references. The output respects tattoo conventions: clean outlines, proper contrast for ink reproduction, and style-accurate details. Many users bring InkAI designs to their tattoo artist as a starting point for their custom piece.",
  },
  {
    question: "Does Midjourney have tattoo-specific styles?",
    answer:
      "No. Midjourney offers general art styles and relies on text prompts to approximate tattoo aesthetics. You need to know prompt terminology like 'traditional american tattoo flash', 'irezumi style', etc. InkAI has built-in tattoo style presets — Traditional, Japanese, Geometric, Tribal, Blackwork, Watercolor, Neo-Traditional, and Minimalist — so you just pick your style.",
  },
];

// ---------------------------------------------------------------------------
// JSON-LD structured data for FAQPage rich results
// ---------------------------------------------------------------------------
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// ---------------------------------------------------------------------------
// Comparison table data
// ---------------------------------------------------------------------------
const COMPARISON_ROWS = [
  { feature: "Purpose", ours: "Built specifically for tattoo design", theirs: "General AI image generation" },
  { feature: "Price (Free Tier)", ours: "Free daily generations", theirs: "No free tier" },
  { feature: "Price (Paid)", ours: "$9.90/month unlimited tattoo designs", theirs: "$10-60/month (general images)" },
  { feature: "Platform", ours: "Any web browser", theirs: "Discord bot + web (beta)" },
  { feature: "Tattoo Styles", ours: "8+ built-in (Trad, Japanese, Geo, etc.)", theirs: "None — manual prompt engineering" },
  { feature: "Learning Curve", ours: "Describe idea, pick style, done", theirs: "Requires prompt engineering skills" },
  { feature: "Body Placement Awareness", ours: "Yes — designs respect placement", theirs: "No — generic art output" },
  { feature: "Ink-Ready Output", ours: "Clean lines, proper contrast for tattoo", theirs: "Needs post-processing for tattoo use" },
  { feature: "Generation Speed", ours: "~10-30 seconds", theirs: "~30-60 seconds (varies by queue)" },
  { feature: "Account Required", ours: "No (free tier)", theirs: "Yes (Discord account mandatory)" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function VsMidjourneyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-gray-950 text-gray-100">
        {/* -- Navigation -- */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">&#x1F58B;&#xFE0F;</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                InkAI
              </span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
        </nav>

        {/* -- Hero -- */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              InkAI
            </span>{" "}
            vs Midjourney for Tattoo Design
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Midjourney is powerful for general AI art, but it was not built for tattoo design. InkAI
            gives you tattoo-specific styles, ink-ready output, and zero prompt engineering in your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Design Your Tattoo Free
            </Link>
            <a
              href="#comparison"
              className="inline-flex items-center justify-center rounded-full border border-gray-700 px-8 py-3 text-base font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
            >
              See Full Comparison
            </a>
          </div>
        </section>

        {/* -- Key differentiator cards -- */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "\u{1F3A8}",
                title: "Tattoo-Specific Styles",
                description:
                  "Choose from Traditional, Japanese, Geometric, Tribal, Blackwork, Watercolor, Neo-Traditional, and Minimalist. No prompt engineering needed — just pick your style and describe your idea.",
              },
              {
                icon: "\u{1F4BB}",
                title: "No Discord Required",
                description:
                  "InkAI runs in your browser. No Discord server, no bot commands, no queue. Open the site, describe your tattoo, pick a style, and get a design in seconds.",
              },
              {
                icon: "\u2712\uFE0F",
                title: "Ink-Ready Output",
                description:
                  "Designs are optimized for tattoo reproduction: clean lines, proper contrast, and style-accurate shading. Take your InkAI design directly to your tattoo artist.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- Comparison table -- */}
        <section id="comparison" className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="px-6 py-4 font-semibold text-gray-300">Feature</th>
                  <th className="px-6 py-4 font-semibold text-purple-400">InkAI</th>
                  <th className="px-6 py-4 font-semibold text-gray-400">Midjourney</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-gray-800/50 ${i % 2 === 0 ? "bg-gray-900/30" : ""}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-200">{row.feature}</td>
                    <td className="px-6 py-4 text-gray-100">{row.ours}</td>
                    <td className="px-6 py-4 text-gray-400">{row.theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* -- Why InkAI section -- */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Tattoo Enthusiasts Choose InkAI Over Midjourney
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
            Midjourney creates beautiful general art, but tattoo design has unique requirements
            that a general-purpose tool does not address.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Tattoo Conventions Matter",
                text: "Real tattoo art follows rules: Traditional uses bold outlines and limited palettes, Japanese has specific wave and cloud patterns, Geometric requires mathematical precision. InkAI understands these conventions. Midjourney does not.",
              },
              {
                title: "From Screen to Skin",
                text: "What looks good on a monitor does not always translate to skin. InkAI outputs are designed with tattoo reproduction in mind — proper line weight, contrast that survives aging, and compositions that follow body contours.",
              },
              {
                title: "No Learning Curve",
                text: "Getting good tattoo designs from Midjourney requires learning prompt syntax like '/imagine prompt: traditional american tattoo flash style, bold lines, --ar 2:3'. InkAI just asks: describe your idea, pick a style.",
              },
              {
                title: "Purpose-Built Pricing",
                text: "Midjourney's cheapest plan is $10/month for 200 general images. InkAI's free tier gives you daily tattoo designs, and Pro at $9.90/month gives unlimited. Every dollar goes toward tattoo-specific features.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- FAQ -- */}
        <section id="faq" className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
                <h3 className="text-base font-semibold text-white">{item.question}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- CTA -- */}
        <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-12">
            <h2 className="text-3xl font-bold">Ready to Design Your Next Tattoo?</h2>
            <p className="mt-3 text-gray-400">
              No Discord. No prompt engineering. Just describe your idea, pick a tattoo style, and get
              your design in seconds.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try InkAI Free
            </Link>
          </div>
        </section>

        {/* -- Footer -- */}
        <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
          <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} InkAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <a href="https://symplyai.io" target="_blank" rel="noopener" className="hover:text-gray-300 transition-colors">
                Powered by SymplyAI
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
