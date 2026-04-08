/**
 * src/app/guide/tattoo-design-ideas/page.tsx — Tattoo Design Ideas Guide
 *
 * SEO STRATEGY:
 * Targets "tattoo design ideas", "tattoo ideas 2026", "AI tattoo ideas",
 * "best tattoo designs", and "tattoo inspiration" searches. These are
 * extremely high-volume informational queries (100k+/month combined) where
 * users are at the top of the funnel — exploring ideas before getting ink.
 * The guide provides genuine value (style breakdowns, trend context) while
 * funneling readers to the InkAI generator as their next step.
 *
 * CONTENT STRATEGY:
 * Not a thin affiliate page. Covers real tattoo styles with history, use
 * cases, and practical advice. The CTA is natural: "see what your idea
 * looks like with AI before you commit to ink."
 *
 * STRUCTURED DATA:
 * FAQPage JSON-LD for rich snippet eligibility on common tattoo questions.
 *
 * MIDDLEWARE NOTE:
 * /guide/ must be excluded from next-intl middleware — see middleware.ts matcher.
 *
 * Agent meridian-strike-6391-worker-4, pane1775 swarm — SEO landing pages, 2026-04-06
 */

import type { Metadata } from "next";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Tattoo Design Ideas 2026 — AI-Powered Inspiration Guide | InkAI",
  description:
    "Explore 50+ tattoo design ideas across 8 styles: Traditional, Japanese, Geometric, Minimalist, Watercolor, Blackwork, Neo-Traditional, and Tribal. Preview any idea with AI before you commit to ink.",
  keywords: [
    "tattoo design ideas",
    "tattoo ideas 2026",
    "AI tattoo ideas",
    "best tattoo designs",
    "tattoo inspiration",
    "tattoo styles guide",
    "geometric tattoo ideas",
    "minimalist tattoo ideas",
    "japanese tattoo designs",
    "traditional tattoo flash",
  ],
  alternates: {
    canonical: "https://tattoo.symplyai.io/guide/tattoo-design-ideas",
  },
  openGraph: {
    title: "Tattoo Design Ideas 2026 — AI-Powered Inspiration Guide",
    description:
      "50+ tattoo ideas across 8 styles. Preview any design with AI before you get inked.",
    url: "https://tattoo.symplyai.io/guide/tattoo-design-ideas",
    type: "article",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

// ---------------------------------------------------------------------------
// FAQ data
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    question: "How do I choose the right tattoo style?",
    answer:
      "Consider your aesthetic preferences, pain tolerance for the body placement, and how the design will age. Traditional and Blackwork age best due to bold lines and high contrast. Watercolor and fine-line Minimalist may fade faster. Use InkAI to preview your idea in multiple styles before deciding.",
  },
  {
    question: "Can AI help me design a custom tattoo?",
    answer:
      "Yes. AI tattoo generators like InkAI let you describe your idea in plain language and see it rendered in professional tattoo styles within seconds. This helps you refine your concept before paying a tattoo artist for custom work — saving time and money in the design process.",
  },
  {
    question: "What are the most popular tattoo styles in 2026?",
    answer:
      "Geometric and Minimalist continue to grow in popularity for their clean, modern look. Japanese (Irezumi) and Neo-Traditional are trending for their rich detail. Blackwork is popular for bold, graphic statements. Watercolor tattoos remain popular but require an experienced artist for best results.",
  },
  {
    question: "How much does a custom tattoo design cost?",
    answer:
      "A custom design from a tattoo artist typically costs $50-300+ depending on complexity and the artist's reputation. Using AI to generate initial concepts is free or very low cost (InkAI offers free daily generations), letting you arrive at your tattoo appointment with a clearer vision and saving revision cycles.",
  },
  {
    question: "Should I bring a reference image to my tattoo artist?",
    answer:
      "Absolutely. Most tattoo artists prefer working from a reference image. AI-generated tattoo designs make excellent references because they are already rendered in a tattoo-appropriate style with proper linework and shading. Your artist can then customize it to perfectly fit your body placement.",
  },
];

// ---------------------------------------------------------------------------
// JSON-LD
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
// Tattoo style guide data
// ---------------------------------------------------------------------------
const TATTOO_STYLES = [
  {
    name: "Traditional (American)",
    description:
      "Bold black outlines, limited color palette (red, yellow, green, blue), and iconic imagery like anchors, eagles, roses, and skulls. Originated in the early 1900s with sailors and has become a timeless style that ages exceptionally well due to thick linework.",
    bestFor: "Arms, legs, chest. Works well at medium to large sizes.",
    ideas: ["Eagle with banner", "Rose and dagger", "Anchor with rope", "Panther head", "Swallow birds", "Heart with flames"],
    trend: "Timeless classic — never goes out of style.",
  },
  {
    name: "Japanese (Irezumi)",
    description:
      "Full-body compositions with dragons, koi fish, cherry blossoms, waves, and mythological figures. Rich in symbolism — each element carries specific meaning. Characterized by flowing compositions that follow body contours, bold backgrounds, and wind bars.",
    bestFor: "Sleeves, back pieces, large body areas. Best as large-scale compositions.",
    ideas: ["Koi fish in waves", "Dragon with clouds", "Cherry blossom branch", "Oni mask", "Tiger in bamboo", "Phoenix rising"],
    trend: "Surging in 2026 — fusion with modern techniques is especially popular.",
  },
  {
    name: "Geometric",
    description:
      "Clean lines, mathematical precision, and patterns derived from sacred geometry, mandalas, and abstract shapes. Often uses dotwork shading. Modern and visually striking. Requires a very skilled tattoo artist for precise line execution.",
    bestFor: "Forearms, shoulders, calves. Works well at any size.",
    ideas: ["Sacred geometry mandala", "Geometric animal (wolf, lion, bear)", "Honeycomb pattern", "Metatron's cube", "Fibonacci spiral", "Geometric mountain landscape"],
    trend: "Top 3 most requested style in 2026.",
  },
  {
    name: "Minimalist",
    description:
      "Fine lines, small scale, and simple compositions. Less is more — these tattoos communicate through reduction and negative space. Popular for first tattoos and visible placements like wrists and fingers. Clean, modern aesthetic.",
    bestFor: "Wrists, fingers, ankles, behind ear. Small to medium sizes.",
    ideas: ["Single-line portrait", "Small constellation", "Tiny botanical", "Fine-line wave", "Minimal mountain", "Simple arrow or compass"],
    trend: "Growing fast — especially popular with younger demographics.",
  },
  {
    name: "Watercolor",
    description:
      "Mimics watercolor painting techniques with splashes, drips, gradient washes, and soft edges. Often combined with fine linework for structure. Vibrant and artistic. Note: requires an experienced artist and may fade more than other styles over time.",
    bestFor: "Shoulders, thighs, ribs. Medium to large sizes for best effect.",
    ideas: ["Watercolor flower bouquet", "Abstract color splash with animal silhouette", "Watercolor galaxy", "Hummingbird with color trail", "Watercolor compass", "Abstract landscape"],
    trend: "Steady demand — artists are getting better at longevity techniques.",
  },
  {
    name: "Blackwork",
    description:
      "Heavy black ink, bold shapes, and graphic patterns. Ranges from geometric blackout to ornamental dotwork to illustrative black-only pieces. High contrast and dramatic visual impact. Ages exceptionally well.",
    bestFor: "Arms, legs, chest, back. Any size — small bold pieces to full sleeves.",
    ideas: ["Blackout sleeve section", "Ornamental mandala", "Dark botanical", "Skull with geometric elements", "Abstract blackwork landscape", "Dotwork animal portrait"],
    trend: "Increasingly popular — the bold aesthetic photographs well for social media.",
  },
  {
    name: "Neo-Traditional",
    description:
      "Combines Traditional tattoo conventions (bold outlines, limited palette) with modern illustration techniques — more color depth, finer detail, and broader subject matter. Think Traditional meets art nouveau.",
    bestFor: "Arms, legs, chest. Medium to large sizes for full detail.",
    ideas: ["Ornate animal portrait", "Art nouveau flower", "Detailed moth or butterfly", "Mythological creature", "Portrait with floral frame", "Dagger with ornamental details"],
    trend: "Strong growth — appeals to people who love Traditional but want more complexity.",
  },
  {
    name: "Tribal",
    description:
      "Rooted in Polynesian, Maori, Samoan, and other indigenous traditions. Bold black patterns that follow body contours. Each pattern carries cultural significance. Modern tribal blends traditional patterns with contemporary composition.",
    bestFor: "Shoulders, arms, chest, calves. Medium to large scale.",
    ideas: ["Polynesian sleeve band", "Maori-inspired shoulder piece", "Tribal sun", "Abstract tribal pattern", "Modern tribal arm band", "Tribal turtle (longevity symbol)"],
    trend: "Steady — cultural appreciation and respectful modern interpretations are valued.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function TattooDesignIdeasGuidePage() {
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
            Tattoo Design Ideas{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              2026
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore 50+ tattoo ideas across 8 major styles. From Traditional to Geometric,
            Minimalist to Japanese — find your inspiration and preview it with AI before committing
            to ink.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Preview Any Idea with AI
          </Link>
        </section>

        {/* -- Style guide sections -- */}
        {TATTOO_STYLES.map((style, idx) => (
          <section
            key={style.name}
            className={`mx-auto max-w-5xl px-6 pb-16 ${idx === 0 ? "pt-4" : ""}`}
          >
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{style.name}</h2>
                  <span className="mt-1 inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
                    {style.trend}
                  </span>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:border-purple-500 hover:text-white transition-colors whitespace-nowrap"
                >
                  Try {style.name.split(" ")[0]} Style
                </Link>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-4">{style.description}</p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Best Placement</h3>
                <p className="text-sm text-gray-500">{style.bestFor}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Popular Ideas</h3>
                <div className="flex flex-wrap gap-2">
                  {style.ideas.map((idea) => (
                    <span
                      key={idea}
                      className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300 border border-gray-700"
                    >
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* -- Pro tip section -- */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How to Use AI for Tattoo Design</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Describe Your Idea",
                text: "Start with a concept: 'geometric wolf howling at the moon' or 'minimalist mountain range for my wrist'. Be specific about elements and mood.",
              },
              {
                step: "2",
                title: "Pick a Style",
                text: "Choose from Traditional, Japanese, Geometric, Minimalist, Watercolor, Blackwork, Neo-Traditional, or Tribal. The style dramatically changes the output.",
              },
              {
                step: "3",
                title: "Refine and Bring to Your Artist",
                text: "Generate multiple variations, pick your favorite, and bring it to your tattoo artist as a reference. They can customize placement, size, and fine details.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
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
            <h2 className="text-3xl font-bold">See Your Tattoo Idea Come to Life</h2>
            <p className="mt-3 text-gray-400">
              Pick any idea from this guide, describe it to InkAI, and see it rendered in a
              professional tattoo style in seconds. Free to try.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Generate Your Design Free
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
