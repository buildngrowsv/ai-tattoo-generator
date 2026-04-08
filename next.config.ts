/**
 * NEXT.JS CONFIGURATION — AI Tattoo Design Generator (InkAI)
 *
 * This configuration is intentionally minimal for MVP. As the product grows,
 * we will add:
 * - Image domains for fal.ai CDN (to allow next/image optimization)
 * - Rewrites for custom domain routing
 * - Headers for security (CSP, HSTS)
 * - Redirects for SEO (trailing slashes, www normalization)
 *
 * The app uses Next.js 15+ with App Router because:
 * 1. Server Components reduce client JS bundle (better Core Web Vitals / SEO)
 * 2. Route Handlers (app/api/) are simpler than Pages Router API routes
 * 3. Streaming and Suspense support for future loading states
 * 4. This is the standard stack across all our saas-clone-template projects
 */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * next-intl plugin wires `src/i18n/request.ts` into the Next.js build so
 * `getMessages` / `getTranslations` resolve per request (Builder 25, T13).
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Prevent Vercel's CDN from caching locale routes (/ and /es/*).
   *
   * WHY THIS EXISTS:
   * After deploying i18n (next-intl with localePrefix "as-needed"), Vercel's
   * edge CDN had a stale 404 cached for /es from a pre-i18n deployment. Even
   * after promoting the new build, Vercel did not invalidate the /es cache entry.
   * Root cause: Vercel's Data Cache treats dynamic locale routes as cacheable
   * if no explicit Cache-Control header is present.
   *
   * FIX: Set Cache-Control: no-store on all non-api routes so the CDN always
   * fetches fresh from Next.js. This is acceptable for this app because:
   * - Pages are server-rendered per request anyway (Server Components)
   * - The slight performance cost of no edge caching is worth correct i18n routing
   * - Once middleware handles /es correctly, the CDN can be re-enabled if needed
   * Scout 13, 2026-03-25.
   */
  headers: async () => [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    {
      source: "/((?!api|_next|_vercel|.*\\..*).*)",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
  ],

  /**
   * Allow fal.ai CDN images to be served through next/image optimization.
   * fal.ai returns image URLs from their CDN — we need to whitelist these
   * domains so Next.js Image component can optimize them (resize, format
   * conversion to WebP/AVIF, lazy loading). Without this, next/image would
   * block external images for security reasons.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fal.media",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v3.fal.media",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
