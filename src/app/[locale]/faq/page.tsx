/**
 * /faq page for AI Tattoo Generator (tattoo.symplyai.io).
 *
 * Server component — uses native HTML <details>/<summary> for expand/collapse,
 * no "use client" needed. Includes FAQPage JSON-LD schema for Google rich results
 * targeting "AI tattoo generator FAQ", "AI tattoo design questions", etc.
 *
 * Created 2026-04-04 for SEO — FAQ pages with structured data rank for
 * long-tail "can I" and "what styles" queries the landing page misses.
 */

import type { Metadata } from "next";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  FAQ data — single source for both UI and JSON-LD                  */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    question: "How does AI tattoo design work?",
    answer:
      "Describe the tattoo you envision — theme, style, placement, and any specific elements — and our AI generates multiple unique designs tailored to your description. The AI draws from thousands of tattoo art references to produce original compositions that a real tattoo artist can work from.",
  },
  {
    question: "What tattoo styles are supported?",
    answer:
      "We support all major tattoo styles including traditional (American, Japanese), neo-traditional, geometric, minimalist line art, watercolor, blackwork, dotwork, realism, tribal, biomechanical, and illustrative. You can specify a style in your prompt or let the AI suggest what fits your concept best.",
  },
  {
    question: "Can I customize the generated designs?",
    answer:
      "Yes. You can refine any generated design by adjusting your prompt — add or remove elements, change the style, specify colors or black-and-grey, alter the composition, or request variations. Each generation gives you a fresh take so you can iterate until the design feels right.",
  },
  {
    question: "Is the AI Tattoo Generator free?",
    answer:
      "You receive free credits when you sign up — enough to generate several tattoo concepts at no cost. For ongoing use, affordable credit packs and subscription plans are available on our pricing page.",
  },
  {
    question: "Can I show the generated design to my tattoo artist?",
    answer:
      "Absolutely — that is one of the most common use cases. Generated designs are high-quality reference images your tattoo artist can use as a starting point, adapt to your body placement, or replicate closely. Many artists appreciate clients coming in with a clear visual reference.",
  },
  {
    question: "Are the designs high resolution enough for printing?",
    answer:
      "Yes. Designs are generated at high resolution (up to 1024x1024 or higher) which is more than sufficient for reference prints, stencil creation, and sharing with your artist. For very large prints or posters of your design, you can run the output through an AI upscaler for extra detail.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "FAQ — AI Tattoo Generator | Common Questions Answered",
  description:
    "Frequently asked questions about the AI Tattoo Generator. Learn about supported tattoo styles, customization, resolution, pricing, and how to use AI-generated designs with your tattoo artist.",
  keywords: [
    "AI tattoo generator FAQ",
    "AI tattoo design questions",
    "tattoo styles AI generator",
    "AI tattoo free",
    "AI tattoo for tattoo artist",
    "custom tattoo design AI",
  ],
};

/* ------------------------------------------------------------------ */
/*  JSON-LD FAQPage schema                                            */
/* ------------------------------------------------------------------ */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function FAQPage() {
  return (
    <>
      {/* Structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Everything you need to know about the AI Tattoo Generator.
          </p>

          {/* FAQ accordion */}
          <div className="mt-12 divide-y divide-gray-800">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white hover:text-emerald-400 transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-gray-500 group-open:rotate-45 transition-transform text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-gray-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* CTA section */}
          <div className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center">
            <h2 className="text-2xl font-semibold">
              Ready to design your next tattoo?
            </h2>
            <p className="mt-2 text-gray-400">
              Try the AI Tattoo Generator free — bring your ideas to life.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Try It Free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
