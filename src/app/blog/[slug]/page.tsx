/**
 * /blog/[slug] — Individual blog post page with full article content.
 *
 * WHY OWN HTML/BODY WRAPPER:
 * Same rationale as the blog index — blog sits outside [locale] so it needs
 * its own document shell. See /blog/page.tsx header comment.
 *
 * SEO FEATURES:
 * - Article + FAQPage + BreadcrumbList JSON-LD for rich snippets
 * - dynamicParams = false so unknown slugs return 404 (not hang)
 * - generateStaticParams for static generation of all posts at build time
 * - generateMetadata for per-post <title>, description, and canonical URL
 *
 * DATA SOURCE: src/app/blog/blog-posts.ts
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  getRelatedPosts,
} from "../blog-posts";
import "@/app/globals.css";

const SITE_URL = "https://tattoo.symplyai.io";
const BRAND = "TattooAI";

/**
 * Prevent Next.js from attempting to SSR unknown slugs dynamically.
 * Without this, requests for /blog/nonexistent-slug cause serverless hangs
 * instead of immediate 404 responses. See clone-factory-quality-gates Gate 12.
 */
export const dynamicParams = false;

/**
 * Build-time enumeration of all blog post slugs for static generation.
 * Every slug in BLOG_POSTS gets a pre-rendered HTML page — no runtime
 * rendering or serverless function invocation needed.
 */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/**
 * Per-post metadata for <title>, <meta description>, canonical URL, and OG tags.
 * Next.js calls this at build time for each slug from generateStaticParams.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${BRAND} Blog`,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: canonicalUrl,
      type: "article",
      siteName: BRAND,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  JSON-LD components                                                 */
/* ------------------------------------------------------------------ */

function ArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbJsonLd({ postTitle, postUrl }: { postTitle: string; postUrl: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: postTitle, item: postUrl },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const relatedPosts = getRelatedPosts(post.relatedSlugs);

  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-primary text-text-primary antialiased">
        {/* JSON-LD */}
        <ArticleJsonLd
          title={post.title}
          description={post.metaDescription}
          url={postUrl}
          publishedAt={post.publishedAt}
          updatedAt={post.updatedAt}
        />
        <FAQPageJsonLd faqs={post.faqs} />
        <BreadcrumbJsonLd postTitle={post.title} postUrl={postUrl} />

        {/* ---- Nav ---- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              {BRAND}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Blog
              </Link>
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

        {/* ---- Article ---- */}
        <main className="pt-24 pb-16 px-6">
          <article className="max-w-3xl mx-auto">
            {/* Breadcrumb nav */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-text-secondary"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-text-primary truncate max-w-[200px]">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Header */}
            <header className="mb-12">
              <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-brand-600/20 text-brand-400">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span aria-hidden="true">|</span>
                <span>{post.readTime}</span>
              </div>
            </header>

            {/* Sections */}
            {post.sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="mb-10">
                <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                {section.body.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-text-secondary leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.listItems && section.listItems.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4 ml-2">
                    {section.listItems.map((item, liIndex) => (
                      <li key={liIndex} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* FAQ section */}
            {post.faqs.length > 0 && (
              <section className="mb-12 mt-16">
                <h2 className="text-2xl font-bold mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {post.faqs.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="p-6 rounded-xl bg-surface-secondary border border-white/5"
                    >
                      <h3 className="font-semibold text-lg mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-12 mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group p-5 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                    >
                      <span className="inline-block mb-2 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-600/20 text-brand-400">
                        {related.category}
                      </span>
                      <h3 className="font-semibold group-hover:text-brand-400 transition-colors leading-snug mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {related.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-brand-600/10 to-purple-600/10 border border-white/5 mt-16">
              <h2 className="text-2xl font-bold mb-4">
                Design Your Tattoo with AI
              </h2>
              <p className="text-text-secondary mb-6 max-w-lg mx-auto">
                Try {BRAND} free — choose from six tattoo styles and generate
                custom designs in seconds. No downloads required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
              >
                Start Designing Free
              </Link>
            </section>
          </article>
        </main>

        {/* ---- Footer ---- */}
        <footer className="border-t border-white/5 py-8 px-6 mt-12">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
            <span>
              &copy; {new Date().getFullYear()} {BRAND}. All rights reserved.
            </span>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/blog"
                className="hover:text-text-primary transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
