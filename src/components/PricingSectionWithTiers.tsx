/**
 * PRICING SECTION — Free vs Pro Tier Comparison (localized via next-intl)
 *
 * Builder 25 (2026-03-25): Converted to async Server Component so copy lives in
 * `messages/en.json` + `messages/es.json` for T13 EN+ES requirement.
 *
 * Builder 9 (2026-03-25 T45): Replaced static buy.stripe.com payment link with
 * TattooProCheckoutButton client component → POST /api/stripe/create-checkout.
 * This gives us webhook support, session metadata, and dynamic success/cancel
 * URLs. The server component passes the CTA label (from translations) to the
 * client button so i18n still works across EN/ES.
 */
import { getTranslations } from "next-intl/server";
import { Check, Zap, Crown } from "lucide-react";
import { TattooProCheckoutButton } from "@/components/TattooProCheckoutButton";

export default async function PricingSectionWithTiers() {
  const t = await getTranslations("Pricing");
  const freeFeatures = t.raw("freeFeatures") as string[];
  const proFeatures = t.raw("proFeatures") as string[];

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("sectionTitleBefore")}{" "}
            <span className="gradient-text-static">{t("sectionTitleAccent")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("sectionSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("freeTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("freeSubtitle")}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">{t("freePer")}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border"
            >
              {t("freeCta")}
            </button>
          </div>

          <div className="rounded-2xl bg-card border-2 border-primary/50 p-6 sm:p-8 flex flex-col relative shadow-lg shadow-primary/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                {t("proBadge")}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t("proTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("proSubtitle")}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">$9.90</span>
              <span className="text-muted-foreground ml-2">{t("proPer")}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/*
              WHY TattooProCheckoutButton instead of the static buy.stripe.com link:
              The API route approach enables webhook processing (checkout.session.completed),
              metadata per session, and works correctly across Vercel preview + production
              without hardcoding a domain. The static link still works as fallback but this
              is the proper checkout path for tracking conversions server-side.
            */}
            <TattooProCheckoutButton label={t("proCta")} />
          </div>
        </div>
      </div>
    </section>
  );
}
