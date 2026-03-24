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

const nextConfig: NextConfig = {
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

export default nextConfig;
