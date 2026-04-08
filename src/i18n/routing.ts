/**
 * next-intl routing configuration — InkAI (AI Tattoo Generator)
 *
 * WHY `localePrefix: "as-needed"`:
 * English is the default market and keeps URLs clean (`/` not `/en/`).
 * Spanish lives under `/es/*` for hreflang + UX without breaking existing
 * English bookmarks or marketing links.
 *
 * BUILDER 25 (2026-03-25): Added for pane1774 T13 — clone fleet EN+ES requirement.
 */
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "de", "pt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
