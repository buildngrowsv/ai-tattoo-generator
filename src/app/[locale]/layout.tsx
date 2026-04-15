/**
 * Per-locale layout — document shell, fonts, JSON-LD, next-intl provider.
 *
 * `setRequestLocale` enables static rendering for each locale segment.
 * Metadata uses translated strings + hreflang alternates for EN/ES SEO.
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "../globals.css";
import GoogleAnalyticsLoader from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://tattoo.symplyai.io";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
  ],
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es" | "fr" | "de" | "pt")) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "Meta" });
  const messageModule = (await import(`../../messages/${locale}.json`)).default as {
    Meta: { keywordList: string[] };
  };
  const title = t("title");
  const description = t("description");
  const ogLocale = locale === "es" ? "es_ES" : "en_US";
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: messageModule.Meta.keywordList,
    alternates: {
      canonical: locale === "es" ? `${siteUrl}/es` : siteUrl,
      languages: {
        en: siteUrl,
        es: `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: ogLocale,
      url: locale === "es" ? `${siteUrl}/es` : siteUrl,
      siteName: t("siteName"),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TattooAI — AI Tattoo Design Generator" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InkAI - AI Tattoo Design Generator",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description:
    "Design custom tattoos with AI. Describe your idea, choose a style, and get a unique tattoo design in seconds.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available with daily generations. Pro plans for unlimited designs.",
  },
  featureList: [
    "10+ tattoo styles including Traditional, Watercolor, Geometric, Japanese, Tribal",
    "AI-powered design generation from text descriptions",
    "Placement and size customization",
    "High-resolution downloads",
    "No signup required for free tier",
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is InkAI free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! InkAI offers free daily tattoo design generations. Pro plans are available for unlimited designs and higher resolution outputs.",
      },
    },
    {
      "@type": "Question",
      name: "What tattoo styles can I generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InkAI supports 10+ styles including Traditional, Watercolor, Geometric, Japanese, Tribal, Minimalist, Blackwork, Neo-Traditional, Dotwork, and Realism.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use these designs for a real tattoo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Many users bring InkAI designs to their tattoo artist as reference art. The high-resolution downloads are perfect for sharing with your artist.",
      },
    },
  ],
};

/**
 * Organization JSON-LD — links this product to the SymplyAI parent organization.
 * Improves E-E-A-T signals for Google search and enables Knowledge Panel eligibility.
 * Added 2026-04-15 (fleet-wide Organization schema rollout).
 */
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TattooForge AI",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  description: "AI tattoo generator — design custom tattoos with AI.",
  parentOrganization: {
    "@type": "Organization",
    name: "SymplyAI",
    url: "https://symplyai.io",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/contact`,
  },
};

/**
 * HowTo JSON-LD — enables "How to" rich results in Google SERPs.
 * Targets "how to design tattoos with AI" queries with step-by-step instructions.
 */
const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Design Custom Tattoos with AI",
  description: "Use TattooAI to create unique, personalized tattoo designs with AI in seconds.",
  totalTime: "PT30S",
  tool: { "@type": "HowToTool", name: "TattooAI (tattoo.symplyai.io)" },
  step: [
    { "@type": "HowToStep", position: 1, name: "Describe your tattoo idea", text: "Enter a description of the tattoo you want — style, subject, placement, and mood." },
    { "@type": "HowToStep", position: 2, name: "AI creates your design", text: "Our AI generates a unique tattoo design tailored to your description and preferred style." },
    { "@type": "HowToStep", position: 3, name: "Download your tattoo design", text: "Preview the design and download in high resolution to share with your tattoo artist." },
  ],
};


/**
 * BreadcrumbList JSON-LD — breadcrumb navigation in Google search results.
 * Improves click-through rate by showing site hierarchy directly in SERP.
 */
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tattoo.symplyai.io" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://tattoo.symplyai.io/pricing" },
  ],
};


/**
 * WebSite JSON-LD — establishes site identity in Google search results
 * and enables sitelinks searchbox eligibility.
 */
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TattooForge AI",
  url: "https://tattoo.symplyai.io",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://tattoo.symplyai.io/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es" | "fr" | "de" | "pt")) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${interFont.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        {/* HowTo schema — step-by-step rich results in Google SERPs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
        {/* Organization schema — E-E-A-T signals + Knowledge Panel eligibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
              <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
              <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        {/* GA4 with consent mode — GoogleAnalyticsLoader reads env var internally */}
        <GoogleAnalyticsLoader />
        <NextIntlClientProvider messages={messages}>
          {/* Language switcher — EN | ES toggle, visible on all pages */}
          <LanguageSwitcher locale={locale} />
          {children}
        </NextIntlClientProvider>
        <CookieConsentBanner />
        <CookieConsent />
      </body>
    </html>
  );
}
