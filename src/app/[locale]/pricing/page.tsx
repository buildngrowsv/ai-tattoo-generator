/**
 * Dedicated /pricing route — fixes 404 on /pricing (Scout 13 report).
 *
 * Reuses the same pricing + FAQ components as the home page for consistent
 * monetization story. Metadata is localized for EN/ES SEO.
 */
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PricingSectionWithTiers from "@/components/PricingSectionWithTiers";
import FrequentlyAskedQuestionsSection from "@/components/FrequentlyAskedQuestionsSection";
import InkAiSiteHeader from "@/components/InkAiSiteHeader";
import InkAiSiteFooter from "@/components/InkAiSiteFooter";

const siteUrl = "https://ai-tattoo-generator.vercel.app";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es")) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "PricingPage" });
  return {
    metadataBase: new URL(siteUrl),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "es" ? `${siteUrl}/es/pricing` : `${siteUrl}/pricing`,
      languages: {
        en: `${siteUrl}/pricing`,
        es: `${siteUrl}/es/pricing`,
        "x-default": `${siteUrl}/pricing`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PricingPage");

  return (
    <div className="flex flex-col min-h-screen">
      <InkAiSiteHeader />
      <main className="flex-1 pt-12 pb-8">
        <div className="max-w-3xl mx-auto px-4 text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("heroTitle")}</h1>
          <p className="text-muted-foreground text-lg">{t("heroSubtitle")}</p>
        </div>
        <PricingSectionWithTiers />
        <FrequentlyAskedQuestionsSection />
      </main>
      <InkAiSiteFooter />
    </div>
  );
}
