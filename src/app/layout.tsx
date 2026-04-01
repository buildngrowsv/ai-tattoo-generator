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
import { default as GoogleAnalyticsLoader } from "@/components/GoogleAnalytics";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleAnalyticsLoader />
      {children}
    </>
  );
}
