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
import type { Metadata, Viewport} from "next";
import { default as GoogleAnalyticsLoader } from "@/components/GoogleAnalytics";


/**
 * Root-level metadata — fallback for pSEO pages (/for, /vs, /best,
 * /use-cases) served outside the [locale] layout. The [locale] layout
 * generateMetadata overrides these for locale-routed pages.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://tattoo.symplyai.io"),
  title: "AI Tattoo Design Generator - Free AI Tattoo Maker | InkAI",
  description: "Design your perfect tattoo with AI. Describe your idea, choose a style, and get a custom tattoo design in seconds. Free to try — 10+ styles including Traditional, Watercolor, Geometric, Japanese, and more.",
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

/**
 * Viewport configuration — ensures proper mobile rendering and theme-color
 * for pSEO pages served outside [locale] routing.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
  ],
};


/**
 * FAQPage JSON-LD — enables FAQ rich results in Google SERPs.
 * Product-specific questions about AI tattoo design.
 */
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does AI Tattoo Generator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Describe your tattoo idea in words, choose a style (Traditional, Watercolor, Geometric, Japanese, Minimalist, and more), and our AI generates a custom tattoo design in seconds. Use it as inspiration or take the design directly to your tattoo artist.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI Tattoo Generator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, InkAI offers a free tier with 3 tattoo designs per day. Paid plans start at $9.99/month for unlimited designs, all 10+ styles, and high-resolution downloads.",
      },
    },
    {
      "@type": "Question",
      name: "What tattoo styles are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InkAI offers 10+ styles including Traditional American, Japanese Irezumi, Watercolor, Geometric, Minimalist, Blackwork, Neo-Traditional, Tribal, Dotwork, and Realistic. Each style produces authentic results matching real tattoo aesthetics.",
      },
    },
    {
      "@type": "Question",
      name: "Can I take the AI design to a tattoo artist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Many users generate designs with InkAI and bring them to their tattoo artist as a reference or starting point. The high-resolution output makes it easy for artists to work from the design.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleAnalyticsLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      {children}
    </>
  );
}
