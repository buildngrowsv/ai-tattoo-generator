/**
 * LanguageSwitcher — EN | ES language toggle for the nav header.
 *
 * PURPOSE: Lets users toggle between English and Spanish from any page.
 * Uses next/link href to navigate to /en or /es — next-intl handles the
 * locale routing, swapping message JSON and revalidating the route segment.
 *
 * DESIGN DECISION — "EN | ES" text links, not a flag dropdown:
 * - Flags are politically sensitive (Spain vs Mexico vs LAT-AM for Spanish)
 * - Text abbreviations are unambiguous in any font or icon set
 * - Minimal visual footprint — renders as a fixed overlay without reflow
 * - No extra images, SVGs, or emoji dependencies
 *
 * PLACEMENT: Rendered inside the `<body>` of app/[locale]/layout.tsx as
 * a fixed top-right overlay (z-50). The layout passes the current `locale`
 * from its async params so the active language is highlighted with no
 * client-side hydration mismatch.
 *
 * BEHAVIOR:
 * - Active locale = white, font-bold
 * - Inactive locale = white/60 opacity, hover → white/90 with CSS transition
 * - Clicking /en or /es triggers next-intl locale switch via Next.js Link
 *
 * Builder 4, BridgeSwarm pane1774 T37 (2026-03-24).
 */

'use client';

import Link from 'next/link';

/**
 * Props: locale — currently active locale string ("en" | "es").
 * Passed from the server component layout (avoids client-side useParams()
 * which would delay hydration and cause flicker on first render).
 */
export function LanguageSwitcher({ locale }: { locale: string }) {
  return (
    <div
      className="flex items-center gap-1 text-xs font-medium"
      aria-label="Language selector"
    >
      <Link
        href="/en"
        className={
          locale === 'en'
            ? 'text-white font-bold px-1 py-0.5 rounded'
            : 'text-white/60 hover:text-white/90 px-1 py-0.5 rounded transition-colors'
        }
        aria-current={locale === 'en' ? 'page' : undefined}
      >
        EN
      </Link>
      <span className="text-white/30 select-none" aria-hidden="true">|</span>
      <Link
        href="/es"
        className={
          locale === 'es'
            ? 'text-white font-bold px-1 py-0.5 rounded'
            : 'text-white/60 hover:text-white/90 px-1 py-0.5 rounded transition-colors'
        }
        aria-current={locale === 'es' ? 'page' : undefined}
      >
        ES
      </Link>
    </div>
  );
}
