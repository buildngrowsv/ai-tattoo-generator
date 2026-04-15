/**
 * /for — Hub page listing all audience-specific landing pages.
 *
 * WHY THIS PAGE EXISTS:
 * Acts as the parent index for all /for/[audience] pages. Google and users
 * expect the parent path to render a hub. Consolidates internal link equity
 * across audience pages and provides a single entry point for the "who is
 * this for?" content cluster. Also provides breadcrumb anchor for child pages.
 *
 * ROUTE: /for
 * CHILDREN: /for/[audience] (dynamic routes from SEO_PAGES_CONFIG.audiences)
 * DATA SOURCE: src/config/seo-pages.ts
 */

import type { Metadata } from "next";
import Link from "next/link";
import { SEO_PAGES_CONFIG } from "@/config/seo-pages";
import { PRODUCT_CONFIG } from "@/lib/config";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SeoCrossLinks } from "@/components/SeoCrossLinks";

import { SeoInternalLinks } from "@/components/SeoInternalLinks";
const canonicalUrl = `${siteConfig.siteUrl}/for`;

export const metadata: Metadata = {
  title: `Who Uses ${PRODUCT_CONFIG.name}? — Built for Every Workflow`,
  description: `See how professionals, creators, and businesses use ${PRODUCT_CONFIG.name}. Find the workflow that fits your needs — from freelancers to enterprises.`,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `Who Uses ${PRODUCT_CONFIG.name}? — Built for Every Workflow`,
    description: `See how professionals, creators, and businesses use ${PRODUCT_CONFIG.name}.`,
    type: "website",
    url: canonicalUrl,
  },
};

export default function ForHubPage() {
  const audiences = SEO_PAGES_CONFIG.audiences;
  const productName = PRODUCT_CONFIG.name;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: "For", url: canonicalUrl },
        ]}
      />

      {/* ItemList JSON-LD — tells Google this is a structured collection page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${productName} for Every Workflow`,
            url: canonicalUrl,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: audiences.map((audience, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: `For ${audience.name}`,
                url: `${siteConfig.siteUrl}/for/${audience.slug}`,
              })),
            },
          }),
        }}
      />

      <main className="min-h-screen bg-surface-primary text-text-primary">
        {/* Navigation */}
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
            {/* Hero */}
            <section className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {productName} for Every Workflow
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
                Whether you&apos;re a freelancer, small business owner, or
                creative professional — {productName} fits your workflow. See how
                people in your field use AI to get results faster.
              </p>
            </section>

            {/* Audience cards */}
            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2">
                {audiences.map((audience) => (
                  <Link
                    key={audience.slug}
                    href={`/for/${audience.slug}`}
                    className="group p-6 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                  >
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-400 transition-colors">
                      For {audience.name}
                    </h2>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {audience.howWeHelp.slice(0, 160)}...
                    </p>
                    <span className="inline-block mt-4 text-sm font-medium text-brand-400">
                      Learn more &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Cross-links to other pSEO hubs */}
            <div className="text-center mb-12 flex justify-center gap-8">
              <Link
                href="/vs"
                className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
              >
                Competitor comparisons &rarr;
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
                Ready to get started?
              </h2>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Try {productName} free — no signup required. See results in
                seconds.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Try {productName} Free
              </Link>
            </section>

            {/* Cross-links component */}
            <SeoCrossLinks currentCategory="for" currentSlug="" />
            <SeoInternalLinks />
          </div>
        </div>
      </main>
    </>
  );
}
