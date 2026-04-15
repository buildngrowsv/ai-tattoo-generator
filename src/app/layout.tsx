/**
 * Root layout pass-through for next-intl.
 *
 * WHY NO <html> HERE:
 * next-intl places `<html lang={locale}>` in `app/[locale]/layout.tsx` so each
 * locale gets correct `lang` + message provider. Next.js 16 accepts this pattern
 * when the child layout supplies the document shell (see next-intl App Router docs).
 *
 * Builder 25 (2026-03-25): T13 SEO + i18n (EN/ES) for pane1774 clone fleet.
 */
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { default as GoogleAnalyticsLoader } from "@/components/GoogleAnalytics";


/**
 * Root-level metadata — fallback for pSEO pages (/for, /vs, /best,
 * /use-cases) served outside the [locale] layout. The [locale] layout
 * generateMetadata overrides these for locale-routed pages.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://tattoo.symplyai.io"),
  title: "AI Tattoo Generator",
  description: "AI Tattoo Generator — AI-powered tool. Free to try, no sign-up required.",
  alternates: {
    canonical: "https://tattoo.symplyai.io",
  },
  openGraph: {
    title: "AI Tattoo Generator",
    description: "AI Tattoo Generator — AI-powered tool. Free to try.",
    type: "website",
    url: "https://tattoo.symplyai.io",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleAnalyticsLoader />
      {children}
    </>
  );
}
