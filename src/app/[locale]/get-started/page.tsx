/**
 * /get-started — Onboarding landing page for InkAI.
 *
 * Created 2026-04-15 — W5-05 pSEO expansion.
 */

import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://tattoo.symplyai.io";
const PRODUCT_NAME = "InkAI";

export const metadata: Metadata = {
  title: `Get Started — ${PRODUCT_NAME}`,
  description:
    "Design custom tattoos in 3 easy steps. Describe your idea, choose a style, and preview it on your body — free, no tattoo artist consultation needed.",
  alternates: { canonical: `${SITE_URL}/get-started` },
  openGraph: {
    title: `Get Started with ${PRODUCT_NAME}`,
    description: "Design custom tattoos with AI before visiting the parlor.",
    url: `${SITE_URL}/get-started`,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: PRODUCT_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Get Started with ${PRODUCT_NAME}`,
    description: "AI tattoo generator — custom tattoo designs in seconds.",
    images: ["/opengraph-image"],
  },
};

const STEPS = [
  {
    number: "1",
    title: "Describe Your Tattoo",
    description: "Enter your tattoo idea — a dragon, floral sleeve, memorial text, geometric pattern, or any concept. Add size and placement preferences.",
  },
  {
    number: "2",
    title: "Choose a Style",
    description: "Select from traditional, neo-traditional, realism, watercolor, blackwork, minimalist, Japanese, tribal, or dotwork. Each style creates authentic designs.",
  },
  {
    number: "3",
    title: "Preview and Download",
    description: "See your custom tattoo design rendered in high detail. Save it, share with your tattoo artist, or try different styles and placements.",
  },
];

const FEATURES = [
  { title: "Risk-Free Design", description: "Visualize your tattoo before it's permanent. Try different styles, sizes, and placements without commitment." },
  { title: "Free to Try", description: "Generate up to 3 tattoo designs per day for free. Pro plans unlock unlimited designs and body placement previews." },
  { title: "Authentic Art Styles", description: "Traditional, neo-traditional, realism, watercolor, blackwork, minimalist, Japanese, tribal — designs a real artist would create." },
  { title: "Share with Your Artist", description: "Download high-resolution designs to bring to your tattoo parlor. Give your artist a clear reference for exactly what you want." },
];

export default function GetStartedPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Get Started", item: `${SITE_URL}/get-started` },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {PRODUCT_NAME}
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Design Custom Tattoos in{" "}
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            3 Simple Steps
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          No artist consultation needed. Describe your idea, pick a style, and
          preview your custom tattoo design in seconds.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <span className="absolute top-4 left-4 text-xs font-bold text-violet-400">STEP {step.number}</span>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 text-2xl">
                {["\u270f\ufe0f", "\ud83c\udfa8", "\u2b07\ufe0f"][i]}
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose {PRODUCT_NAME}?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-purple-950/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Ready? Design Your First Tattoo Now.</h2>
          <p className="mt-2 text-gray-400">Free to try — no account needed.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity">
              Design Tattoo &rarr;
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-gray-700 px-8 py-3.5 text-base font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-all">
              View Pro Plans
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {PRODUCT_NAME}. All rights reserved.</p>
      </footer>
    </main>
  );
}
