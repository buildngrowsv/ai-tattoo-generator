/**
 * =============================================================================
 * InkAI — Robots.txt Configuration
 * =============================================================================
 *
 * PURPOSE:
 * Generates robots.txt for search engine crawlers. Allows full public crawling
 * while blocking API routes and Next.js internals.
 *
 * ADDED: 2026-03-24 as part of SEO rollout across all clone apps.
 * =============================================================================
 */

import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://tattoo.symplyai.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
