/**
 * Marketing footer — legal links + copyright with year interpolation.
 *
 * Paths stay relative; next-intl Link is not required for mailto:/# if we only
 * use anchors here (external + hash). Internal routes could use i18n Link later.
 */
import { getTranslations } from "next-intl/server";
import { PenTool } from "lucide-react";

export default async function InkAiSiteFooter() {
  const t = await getTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-sm">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Ink<span className="gradient-text-static">AI</span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              {t("terms")}
            </a>
            <a href="/refund" className="hover:text-foreground transition-colors">
              {t("refund")}
            </a>
            <a href="mailto:support@inkai.app" className="hover:text-foreground transition-colors">
              {t("contact")}
            </a>
          </nav>

          <p className="text-xs text-muted-foreground/60 text-center sm:text-right">
            {t("copyright", { year: String(currentYear) })}
          </p>
        </div>
      </div>
    </footer>
  );
}
