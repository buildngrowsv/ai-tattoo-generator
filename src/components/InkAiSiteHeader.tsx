/**
 * Marketing header — brand, locale switcher, pricing CTA.
 *
 * Uses next-intl `Link` so `/es/...` prefixes are applied for Spanish routes.
 * Server Component: copy comes from `messages/*.json` via getTranslations.
 */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PenTool, Zap } from "lucide-react";
import InkAiLocaleSwitcher from "@/components/InkAiLocaleSwitcher";

export default async function InkAiSiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 group min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-md shadow-violet-600/25 group-hover:shadow-violet-600/40 transition-shadow shrink-0">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight truncate">
            Ink<span className="gradient-text-static">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <InkAiLocaleSwitcher />
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-blue-500 transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-500/35"
          >
            <Zap className="w-4 h-4" />
            {t("goPro")}
          </Link>
        </div>
      </div>
    </header>
  );
}
