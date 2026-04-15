/**
 * SeoCrossLinks — Contextual cross-links between pSEO page categories.
 *
 * WHY THIS COMPONENT EXISTS:
 * The SeoInternalLinks footer grid links ALL pages in a flat list, but
 * Google weights contextual, in-content links higher than footer nav links.
 * This component adds 2-3 highly relevant cross-category links within the
 * page content itself, creating a topical mesh that:
 *   1. Passes more PageRank between related pages (vs footer links)
 *   2. Reduces bounce by offering a semantically relevant next click
 *   3. Signals topical depth to Google — "this site covers manga AI deeply"
 *   4. Increases crawl efficiency for the /for/, /vs/, /use-cases/, /best/ clusters
 *
 * DESIGN:
 * Rather than hardcoding every cross-link pair, this component picks the
 * top 2 pages from each OTHER category to show. With our small page counts
 * (4 competitors, 5 audiences, 3 use cases, 3 best pages), showing 2 from
 * each category keeps the section tight (6 links max) while creating a
 * complete topical mesh.
 *
 * IMPORTED BY:
 * - src/app/vs/[competitor]/page.tsx
 * - src/app/for/[audience]/page.tsx
 * - src/app/use-cases/[use-case]/page.tsx
 * - src/app/best/[slug]/page.tsx
 */

import Link from "next/link";
import { SEO_PAGES_CONFIG } from "@/config/seo-pages";
import { PRODUCT_CONFIG } from "@/lib/config";

/**
 * Page category type — used to exclude the current page's category
 * from the cross-link suggestions so we don't duplicate sibling links.
 */
type PageCategory = "vs" | "for" | "use-cases" | "best";

interface SeoCrossLinksProps {
  /** Which pSEO category the current page belongs to */
  readonly currentCategory: PageCategory;
  /** The slug of the current page (to avoid self-linking within category) */
  readonly currentSlug: string;
}

/**
 * SeoCrossLinks renders a "Related Resources" section with 2 links from
 * each pSEO category OTHER than the current page's category. Server
 * component — no client JS needed.
 *
 * @param currentCategory - "vs", "for", "use-cases", or "best"
 * @param currentSlug - the current page's slug (unused for filtering
 *   since we exclude the entire category, but available for future
 *   relevance scoring if the page count grows)
 */
export function SeoCrossLinks({
  currentCategory,
}: SeoCrossLinksProps) {
  const productName = PRODUCT_CONFIG.name;
  const { competitors, audiences, useCases, bestPages } = SEO_PAGES_CONFIG;

  /**
   * Build cross-link sections from categories OTHER than the current one.
   * Each section shows up to 2 links to keep the component compact.
   * The limit of 2 per category ensures the section stays under 8 links
   * total (3 other categories * 2 = 6, plus margin for /best/).
   */
  const crossLinkSections: Array<{
    label: string;
    links: Array<{ href: string; text: string }>;
  }> = [];

  if (currentCategory !== "vs" && competitors.length > 0) {
    crossLinkSections.push({
      label: "Compare",
      links: competitors.slice(0, 2).map((c: { slug: string; name: string }) => ({
        href: `/vs/${c.slug}`,
        text: `${productName} vs ${c.name}`,
      })),
    });
  }

  if (currentCategory !== "for" && audiences.length > 0) {
    crossLinkSections.push({
      label: "Built For",
      links: audiences.slice(0, 2).map((a: { slug: string; name: string }) => ({
        href: `/for/${a.slug}`,
        text: `${productName} for ${a.name}`,
      })),
    });
  }

  if (currentCategory !== "use-cases" && useCases.length > 0) {
    crossLinkSections.push({
      label: "How-To Guides",
      links: useCases.slice(0, 2).map((u: { slug: string; name: string }) => ({
        href: `/use-cases/${u.slug}`,
        text: u.name,
      })),
    });
  }

  if (currentCategory !== "best" && bestPages.length > 0) {
    crossLinkSections.push({
      label: "Best Of",
      links: bestPages.slice(0, 2).map((b: { slug: string; title: string }) => ({
        href: `/best/${b.slug}`,
        text: b.title,
      })),
    });
  }

  if (crossLinkSections.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-4 text-text-secondary">
        Related Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crossLinkSections.map((section) =>
          section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group p-4 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-all"
            >
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                {section.label}
              </span>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors mt-1">
                {link.text}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
