/**
 * LANDING PAGE — InkAI (localized EN/ES via next-intl).
 *
 * Builder 25 (2026-03-25): T13 — SEO + i18n for ai-tattoo-generator. Marketing
 * shell extracted to InkAiSiteHeader/Footer; body copy from messages/*.json.
 */
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import TattooGeneratorForm from "@/components/TattooGeneratorForm";
import PricingSectionWithTiers from "@/components/PricingSectionWithTiers";
import FrequentlyAskedQuestionsSection from "@/components/FrequentlyAskedQuestionsSection";
import InkAiSiteHeader from "@/components/InkAiSiteHeader";
import InkAiSiteFooter from "@/components/InkAiSiteFooter";
import {
import { SeoInternalLinks } from "@/components/SeoInternalLinks";
  Sparkles,
  Palette,
  Zap,
  Eye,
  PenTool,
  Users,
  Clock,
  Shield,
} from "lucide-react";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="flex flex-col min-h-screen">
      <InkAiSiteHeader />

      <main className="flex-1">
        <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 hero-dot-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-600/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6 border border-violet-500/20">
                <Sparkles className="w-4 h-4" />
                {t("trustBadge")}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                {t("heroTitleBefore")}{" "}
                <span className="gradient-text-animated">{t("heroTitleAccent")}</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </div>

            <TattooGeneratorForm />
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                {t("whyTitleBefore")}{" "}
                <span className="gradient-text-static">{t("whyTitleAccent")}</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("whySubtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-5 group-hover:bg-violet-500/20 transition-colors">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("featureAiTitle")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t("featureAiBody")}</p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors">
                  <Palette className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("featureStylesTitle")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t("featureStylesBody")}</p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                  <Eye className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("featureInstantTitle")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t("featureInstantBody")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PenTool className="w-5 h-5 text-violet-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">{t("statDesignsValue")}</span>
                </div>
                <p className="text-muted-foreground text-sm">{t("statDesigns")}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">{t("statTimeValue")}</span>
                </div>
                <p className="text-muted-foreground text-sm">{t("statTime")}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">{t("statStylesValue")}</span>
                </div>
                <p className="text-muted-foreground text-sm">{t("statStyles")}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight">{t("statPrivateValue")}</span>
                </div>
                <p className="text-muted-foreground text-sm">{t("statPrivate")}</p>
              </div>
            </div>
          </div>
        </section>

        <PricingSectionWithTiers />
        <FrequentlyAskedQuestionsSection />
      
      {/* Internal SEO links — distributes homepage PageRank to pSEO pages */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <SeoInternalLinks />
        </div>
      </section>
</main>

      <InkAiSiteFooter />
    </div>
  );
}
