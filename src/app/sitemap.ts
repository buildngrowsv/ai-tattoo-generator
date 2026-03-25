/**
 * =============================================================================
 * InkAI — Sitemap Configuration
 * =============================================================================
 *
 * PURPOSE:
 * Generates sitemap.xml for search engine discovery. The tattoo design AI space
 * is underserved — a sitemap accelerates Google indexing so we can capture
 * searches for "AI tattoo generator" and "tattoo design AI" early.
 *
 * BASE URL: Vercel deployment URL. Update when custom domain (inkai.app) is live.
 *
 * ADDED: 2026-03-24 as part of SEO rollout across all clone apps.
 * =============================================================================
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://ai-tattoo-generator.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: { en: BASE_URL, es: `${BASE_URL}/es` } },
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: { en: `${BASE_URL}/pricing`, es: `${BASE_URL}/es/pricing` },
      },
    },
    {
      url: `${BASE_URL}/es`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/es/pricing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];
}
