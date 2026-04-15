/**
 * /vs/ index — lists all competitor comparison pages for AI Tattoo Generator.
 *
 * SEO PURPOSE:
 * Hub page linking to /vs/[competitor] child pages. Targets "AI tattoo
 * generator alternative" queries. Internal links strengthen child page authority.
 *
 * DATA SOURCE: src/config/seo-pages.ts (SEO_PAGES_CONFIG.competitors)
 * Plus standalone comparison pages at /vs/midjourney and /vs/tattoosai.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { SEO_PAGES_CONFIG } from "@/config/seo-pages";
import { siteConfig } from "@/config/site";
import { PRODUCT_CONFIG } from "@/lib/config";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

const canonicalUrl = `${siteConfig.siteUrl}/vs`;

export const metadata: Metadata = {
  title: `${PRODUCT_CONFIG.name} vs Competitors — AI Tattoo Design Comparisons`,
  description:
    "Compare AI Tattoo Generator with BlackInk AI, TattooJenny, Midjourney, and other AI tattoo tools. See features, pricing, and design quality side by side.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: `${PRODUCT_CONFIG.name} vs Competitors — AI Tattoo Design Comparisons`,
    description:
      "Compare AI Tattoo Generator with BlackInk AI, TattooJenny, Midjourney, and other AI tattoo tools. See features, pricing, and design quality side by side.",
    url: canonicalUrl,
    type: "website",
  },
};

/**
 * All comparison pages — config-driven plus standalone routes.
 * Standalone pages (/vs/midjourney, /vs/tattoosai) existed before the
 * SEO_PAGES_CONFIG system so they're listed explicitly to show in the index.
 */
const STANDALONE_COMPARISONS = [
  {
    slug: "midjourney",
    name: "Midjourney",
    tagline:
      "Purpose-built tattoo AI vs general-purpose image generation — which produces better tattoo-ready designs?",
  },
  {
    slug: "tattoosai",
    name: "TattoosAI",
    tagline:
      "Compare two dedicated AI tattoo generators — style range, body placement, and output quality.",
  },
];

export default function VsIndexPage() {
  const productName = PRODUCT_CONFIG.name;
  const configCompetitors = SEO_PAGES_CONFIG.competitors;

  /**
   * Merge config-driven competitors with standalone pages, avoiding duplicates.
   * Config competitors use the seo-pages description; standalone pages have
   * their own taglines since they predate the config system.
   */
  const standaloneSlugSet = new Set(STANDALONE_COMPARISONS.map((c) => c.slug));
  const allComparisons = [
    ...configCompetitors
      .filter((c) => !standaloneSlugSet.has(c.slug))
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        tagline: c.description,
      })),
    ...STANDALONE_COMPARISONS,
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: "Comparisons", url: canonicalUrl },
        ]}
      />

      <main className="min-h-screen bg-surface-primary text-text-primary">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              {productName}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
              >
                Try Free
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <section className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {productName} vs the Competition
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
                See how {productName} compares to other AI tattoo design tools
                — features, pricing, and output quality side by side.
              </p>
            </section>

            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2">
                {allComparisons.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/vs/${c.slug}`}
                    className="group p-6 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                  >
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-400 transition-colors">
                      {productName} vs {c.name}
                    </h2>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {c.tagline}
                    </p>
                    <span className="inline-block mt-4 text-sm font-medium text-brand-400">
                      Read comparison &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Cross-links to other pSEO hubs */}
            <div className="text-center mb-12 flex justify-center gap-8">
              <Link
                href="/for"
                className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
              >
                Who it&apos;s built for &rarr;
              </Link>
              <Link
                href="/use-cases"
                className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
              >
                Use case guides &rarr;
              </Link>
            </div>

            {/* CTA */}
            <section className="text-center py-12 px-8 rounded-2xl bg-surface-secondary border border-white/5">
              <h2 className="text-3xl font-bold mb-4">
                Ready to design your tattoo?
              </h2>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Describe your idea and see AI-generated tattoo designs in
                seconds. Free to try, no signup required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Design Your Tattoo Free
              </Link>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
