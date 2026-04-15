/**
 * /use-cases — Hub page listing all step-by-step use case guide pages.
 *
 * WHY THIS PAGE EXISTS:
 * Google rewards hub-and-spoke site architecture. This page links to every
 * use-case slug defined in SEO_PAGES_CONFIG.useCases, giving Google a single
 * crawl entry point for the entire /use-cases/ cluster. Without it, child
 * pages are orphaned and may not be discovered efficiently by crawlers.
 *
 * ROUTE: /use-cases
 * CHILDREN: /use-cases/[use-case] (dynamic routes from SEO_PAGES_CONFIG.useCases)
 * DATA SOURCE: src/config/seo-pages.ts
 */

import type { Metadata } from "next";
import Link from "next/link";
import { SEO_PAGES_CONFIG } from "@/config/seo-pages";
import { PRODUCT_CONFIG } from "@/lib/config";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SeoCrossLinks } from "@/components/SeoCrossLinks";

const canonicalUrl = `${siteConfig.siteUrl}/use-cases`;

export const metadata: Metadata = {
  title: `Use Cases & Step-by-Step Guides — ${PRODUCT_CONFIG.name}`,
  description: `Step-by-step guides for using ${PRODUCT_CONFIG.name}. Learn how to get the best results for your specific use case — from beginners to professionals.`,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `Use Cases & Step-by-Step Guides — ${PRODUCT_CONFIG.name}`,
    description: `Step-by-step guides for using ${PRODUCT_CONFIG.name}. Learn how to get the best results for your specific use case.`,
    type: "website",
    url: canonicalUrl,
  },
};

export default function UseCasesIndexPage() {
  const useCases = SEO_PAGES_CONFIG.useCases;
  const productName = PRODUCT_CONFIG.name;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: "Use Cases", url: canonicalUrl },
        ]}
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
                Use Cases &amp; Step-by-Step Guides
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
                Learn how to get the best results from {productName} for your
                specific workflow. Each guide walks you through the process
                step by step.
              </p>
            </section>

            {/* Use case cards */}
            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2">
                {useCases.map((uc) => (
                  <Link
                    key={uc.slug}
                    href={`/use-cases/${uc.slug}`}
                    className="group p-6 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                  >
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-400 transition-colors">
                      {uc.name}
                    </h2>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {uc.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {uc.steps.slice(0, 3).map((step: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-text-secondary"
                        >
                          <span className="text-brand-400 font-bold">
                            {i + 1}
                          </span>{" "}
                          {step.length > 50 ? `${step.slice(0, 47)}...` : step}
                        </span>
                      ))}
                    </div>
                    <span className="inline-block mt-4 text-sm font-medium text-brand-400">
                      Read full guide &rarr;
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
                href="/vs"
                className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
              >
                Competitor comparisons &rarr;
              </Link>
            </div>

            {/* CTA */}
            <section className="text-center py-12 px-8 rounded-2xl bg-surface-secondary border border-white/5">
              <h2 className="text-3xl font-bold mb-4">
                Ready to try it yourself?
              </h2>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Get started with {productName} free — no signup required. See
                results in seconds.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Try {productName} Free
              </Link>
            </section>

            {/* Cross-links component */}
            <SeoCrossLinks currentCategory="use-cases" currentSlug="" />
          </div>
        </div>
      </main>
    </>
  );
}
