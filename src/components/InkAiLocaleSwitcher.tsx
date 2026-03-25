/**
 * Locale switcher — toggles EN/ES using next-intl navigation.
 *
 * WHY CLIENT COMPONENT:
 * `useRouter` / `usePathname` from next-intl require the client runtime.
 * We keep the UI minimal (two text buttons) to avoid crowding the sticky header.
 *
 * Builder 25 (2026-03-25): T13 bilingual UX for InkAI.
 */
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function InkAiLocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-border bg-card/60 px-1.5 py-1 text-xs font-medium text-muted-foreground"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => router.replace(pathname, { locale: "en" })}
        className={`rounded px-2 py-0.5 transition-colors ${
          activeLocale === "en" ? "bg-primary/20 text-foreground" : "hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-border" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => router.replace(pathname, { locale: "es" })}
        className={`rounded px-2 py-0.5 transition-colors ${
          activeLocale === "es" ? "bg-primary/20 text-foreground" : "hover:text-foreground"
        }`}
      >
        ES
      </button>
    </div>
  );
}
