/**
 * /blog — Blog index page listing all published posts.
 *
 * WHY OWN HTML/BODY WRAPPER:
 * The root layout is a pass-through (<>{children}</>) because the [locale]
 * layout provides <html>/<body> for locale-aware pages. Blog pages sit outside
 * the [locale] route group, so they must supply their own document shell.
 *
 * SEO VALUE:
 * The blog targets mid-funnel organic keywords (comparisons, tutorials, listicles)
 * that pSEO pages do not cover. The index page acts as a hub — consolidating
 * link equity and giving crawlers an entry point into all blog content.
 *
 * CALLED BY: Direct navigation, internal links from footer/nav, sitemap.xml
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "./blog-posts";
import "@/app/globals.css";

const SITE_URL = "https://tattoo.symplyai.io";
const BRAND = "TattooAI";
const canonicalUrl = `${SITE_URL}/blog`;

export const metadata: Metadata = {
  title: `${BRAND} Blog — AI Tattoo Design Tips, Comparisons & Guides`,
  description:
    "Explore AI tattoo design guides, tool comparisons, and tips for creating your perfect tattoo with artificial intelligence. Free resources from TattooAI.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: `${BRAND} Blog — AI Tattoo Design Tips, Comparisons & Guides`,
    description:
      "Explore AI tattoo design guides, tool comparisons, and tips for creating your perfect tattoo with artificial intelligence.",
    url: canonicalUrl,
    type: "website",
    siteName: BRAND,
  },
};

/**
 * BreadcrumbList JSON-LD for the blog index.
 * Tells Google this is Home > Blog, improving SERP breadcrumb display.
 */
function BlogBreadcrumbJsonLd() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
    />
  );
}

export default function BlogIndexPage() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-primary text-text-primary antialiased">
        <BlogBreadcrumbJsonLd />

        {/* ---- Nav ---- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              {BRAND}
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

        {/* ---- Hero ---- */}
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <section className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {BRAND} Blog
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Guides, comparisons, and tips for designing your perfect tattoo
                with AI. Whether you are a first-timer or a seasoned collector,
                find the resources you need.
              </p>
            </section>

            {/* ---- Post grid ---- */}
            <section className="mb-20">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {BLOG_POSTS.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col p-6 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                  >
                    <span className="inline-block mb-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-600/20 text-brand-400 w-fit">
                      {post.category}
                    </span>
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-400 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </time>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ---- CTA ---- */}
            <section className="text-center py-16 px-6 rounded-2xl bg-gradient-to-br from-brand-600/10 to-purple-600/10 border border-white/5">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Design Your Tattoo?
              </h2>
              <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                Try {BRAND} free — generate custom tattoo designs in seconds
                with AI. No downloads, no credit card required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors text-lg"
              >
                Start Designing Free
              </Link>
            </section>
          </div>
        </main>

        {/* ---- Footer ---- */}
        <footer className="border-t border-white/5 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
            <span>&copy; {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-text-primary transition-colors">
                Terms
              </Link>
              <Link href="/pricing" className="hover:text-text-primary transition-colors">
                Pricing
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
