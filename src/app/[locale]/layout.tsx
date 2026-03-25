/**
 * Per-locale layout — document shell, fonts, JSON-LD, next-intl provider.
 *
 * `setRequestLocale` enables static rendering for each locale segment.
 * Metadata uses translated strings + hreflang alternates for EN/ES SEO.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://ai-tattoo-generator.vercel.app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es")) {
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
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es")) {
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
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
