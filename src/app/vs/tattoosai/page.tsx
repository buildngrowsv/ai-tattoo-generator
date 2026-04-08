/**
 * src/app/vs/tattoosai/page.tsx — InkAI vs Tattoos AI comparison page
 *
 * SEO STRATEGY:
 * Targets "tattoos ai alternative", "tattoosai vs", "tattoos.ai review",
 * "best AI tattoo generator", and users comparing dedicated tattoo AI tools.
 * Tattoos AI (tattoos.ai) is a direct competitor in the same niche — users
 * searching for comparisons between tattoo-specific AI tools are evaluating
 * before purchasing, making them very high-conversion.
 *
 * CONTENT APPROACH:
 * Honest comparison between two purpose-built tattoo design tools. We highlight
 * our strengths (more style variety, no account for free use, browser-first,
 * competitive pricing) while acknowledging what each tool does well.
 *
 * STRUCTURED DATA:
 * FAQPage JSON-LD targets comparison and alternative queries in "People Also Ask"
 * boxes for tattoo design AI tool searches.
 *
 * MIDDLEWARE NOTE:
 * /vs/ is excluded from next-intl middleware — see middleware.ts matcher.
 * If this page 404s, add "tattoosai|" to the middleware exclusion pattern.
 *
 * pane1775 swarm — SEO comparison page initiative, 2026-04-07
 */

import type { Metadata } from "next";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Metadata — optimized for "tattoos ai" and "tattoosai alternative" SERPs
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "InkAI vs Tattoos AI — Best AI Tattoo Generator Comparison 2026",
  description:
    "Compare InkAI with Tattoos AI (tattoos.ai) for generating tattoo designs. See pricing, styles, quality, and features side-by-side. Find the best AI tattoo design tool for your next ink.",
  keywords: [
    "tattoos ai alternative",
    "tattoosai vs inkai",
    "best AI tattoo generator",
    "tattoos.ai review",
    "AI tattoo design comparison",
    "tattoo generator no account",
    "free AI tattoo design tool",
    "inkai vs tattoosai",
  ],
  alternates: {
    canonical: "https://tattoo.symplyai.io/vs/tattoosai",
  },
  openGraph: {
    title: "InkAI vs Tattoos AI — Which AI Tattoo Generator is Better?",
    description:
      "Purpose-built tattoo AI tools compared side-by-side. Styles, pricing, quality, and ease of use — find the right tool for your tattoo design.",
    url: "https://tattoo.symplyai.io/vs/tattoosai",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

// ---------------------------------------------------------------------------
// FAQ data — targets "tattoos ai vs" and comparison queries
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "Is InkAI better than Tattoos AI?",
    answer:
      "Both InkAI and Tattoos AI are purpose-built for tattoo design, but they differ in approach. InkAI offers 8+ built-in tattoo style presets (Traditional, Japanese, Geometric, Tribal, Blackwork, Watercolor, Neo-Traditional, Minimalist), works without an account for free use, and is browser-based with no download required. Tattoos AI also produces quality designs but with a different style selection and workflow.",
  },
  {
    question: "Does InkAI require an account to use?",
    answer:
      "No. InkAI offers free daily tattoo design generations without creating an account. You can try the tool, see results, and only sign up when you want to save designs or access Pro features. Tattoos AI requires account creation before using the tool.",
  },
  {
    question: "How much does InkAI cost compared to Tattoos AI?",
    answer:
      "InkAI offers free daily generations with no account required, and Pro at $9.90/month for unlimited designs. Tattoos AI pricing varies — check their current pricing page for up-to-date rates. InkAI's free tier is designed to let you evaluate the quality before committing to a subscription.",
  },
  {
    question: "What tattoo styles does InkAI support?",
    answer:
      "InkAI supports 8+ dedicated tattoo style presets: Traditional (American), Japanese (Irezumi), Geometric, Tribal, Blackwork, Watercolor, Neo-Traditional, and Minimalist. Each preset is tuned to produce style-accurate results without manual prompt engineering — describe your idea, pick a style, and get a design.",
  },
  {
    question: "Can I use InkAI designs as a reference for my tattoo artist?",
    answer:
      "Yes. InkAI designs are optimized to serve as tattoo references. The output prioritizes clean linework, proper contrast for ink reproduction, and style-accurate details. Many users bring InkAI designs to their tattoo artist as a starting point for their custom piece — both tools are designed for this use case.",
  },
  {
    question: "Which AI tattoo generator has better output quality?",
    answer:
      "Both InkAI and Tattoos AI use advanced AI models trained for tattoo aesthetics. Quality comparison depends on the specific style you need. InkAI's style-specific presets are tuned to produce convention-accurate results for each style category. We recommend trying both tools' free tiers before purchasing a subscription.",
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
// Comparison table data — both tools are tattoo-specific
// ---------------------------------------------------------------------------
const COMPARISON_ROWS = [
  { feature: "Purpose", ours: "Purpose-built tattoo design tool", theirs: "Purpose-built tattoo design tool" },
  { feature: "Price (Free Tier)", ours: "Free daily designs, no account needed", theirs: "Account required before use" },
  { feature: "Price (Pro)", ours: "$9.90/month unlimited designs", theirs: "Varies — check tattoos.ai pricing" },
  { feature: "Platform", ours: "Any web browser (no download)", theirs: "Web browser" },
  { feature: "Account Required", ours: "No (free tier — try first)", theirs: "Yes (required before first use)" },
  { feature: "Built-in Style Presets", ours: "8+ (Traditional, Japanese, Geo, etc.)", theirs: "Style selection available" },
  { feature: "Learning Curve", ours: "Describe idea, pick style, generate", theirs: "Account setup required first" },
  { feature: "Ink-Ready Output", ours: "Clean lines, proper contrast for tattoo", theirs: "Tattoo-focused output" },
  { feature: "Body Placement Guidance", ours: "Designs respect tattoo placement conventions", theirs: "Varies by design type" },
  { feature: "Generation Speed", ours: "~10-30 seconds", theirs: "Varies" },
  { feature: "Desktop + Mobile", ours: "Full support on any device", theirs: "Web-based" },
  { feature: "Privacy", ours: "No account needed, minimal data collection", theirs: "Account required (data collected)" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function VsTattoosAiPage() {
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
          <p className="text-sm font-medium uppercase tracking-widest text-purple-400 mb-3">
            Comparison
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              InkAI
            </span>{" "}
            vs Tattoos AI
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Both InkAI and Tattoos AI are built for tattoo design. We compare styles, pricing,
            quality, and workflow to help you choose the right AI tattoo generator.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try InkAI Free — No Account
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
                icon: "🔓",
                title: "Try Before You Sign Up",
                description:
                  "InkAI lets you generate tattoo designs without creating an account. See the quality for yourself before committing to a subscription. Tattoos AI requires account creation before your first design.",
              },
              {
                icon: "🎨",
                title: "8+ Style Presets",
                description:
                  "Choose from Traditional, Japanese, Geometric, Tribal, Blackwork, Watercolor, Neo-Traditional, and Minimalist. Each preset is specifically tuned for accurate style reproduction — not generic image generation.",
              },
              {
                icon: "⚡",
                title: "Fast Results",
                description:
                  "InkAI generates tattoo designs in 10-30 seconds. Describe your concept, pick your style, and iterate quickly until you find the design you want to bring to your tattoo artist.",
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
                  <th className="px-6 py-4 font-semibold text-gray-400">Tattoos AI</th>
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
            Why Choose InkAI for Your Tattoo Design?
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8">
            Both tools are built for tattoo design, but InkAI was designed with a few core
            principles: try before you pay, style accuracy over quantity, and ink-ready output.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "No Account Required to Start",
                text: "The biggest difference for new users: InkAI gives you free designs before asking for your email. This lets you evaluate real output quality — not screenshots from a marketing page — before deciding.",
              },
              {
                title: "Style-Accurate Presets",
                text: "Traditional American tattoos have specific rules: bold outlines, limited palettes, specific motifs. Japanese has its own conventions. InkAI's presets encode these rules, producing style-accurate output that tattoo artists recognize and can work with.",
              },
              {
                title: "Ink-Ready by Default",
                text: "InkAI designs prioritize linework clarity, contrast that survives skin aging, and compositions that follow body contours. The goal is output you can hand to a tattoo artist as a reference, not just pretty AI art.",
              },
              {
                title: "Competitive Pricing",
                text: "Free daily designs to try. $9.90/month Pro for unlimited designs and commercial use. No surprise charges or complex credit systems — a simple, predictable pricing model.",
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
            <h2 className="text-3xl font-bold">Design Your Next Tattoo with InkAI</h2>
            <p className="mt-3 text-gray-400">
              No account needed. Pick a style, describe your idea, and get a tattoo design in seconds.
              Take it to your tattoo artist as a reference.
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
