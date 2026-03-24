/**
 * ROOT LAYOUT — AI Tattoo Design Generator (InkAI)
 *
 * This is the top-level layout wrapping every page in the application.
 * It provides:
 * 1. Inter font loading via next/font/google (optimized, self-hosted by Next.js)
 * 2. SEO metadata targeting "AI tattoo generator" and related keywords
 * 3. Open Graph tags for social sharing (critical for viral growth)
 * 4. Dark theme applied at the HTML level (class="dark")
 * 5. Viewport and color-scheme meta for proper dark mode rendering
 *
 * SEO STRATEGY:
 * Primary keyword: "AI tattoo generator" (medium competition, growing search volume)
 * Secondary keywords: "tattoo design AI", "AI tattoo maker", "custom tattoo design"
 * The tattoo design space is underserved by AI tools compared to general image
 * generation. Most existing tools are low-quality or require complex prompting.
 * Our differentiation is the style/placement/size selectors that construct
 * optimized prompts automatically — users just describe their idea in plain English.
 *
 * WHY INTER FONT:
 * Inter is the industry standard for SaaS products. It's highly legible at
 * all sizes, has excellent number rendering (important for pricing section),
 * and its clean aesthetic matches the modern/tech vibe we're going for.
 * Using next/font ensures zero layout shift (FOUT prevention) and optimal
 * loading performance.
 *
 * ARCHITECTURE NOTE:
 * This layout is a Server Component (no "use client"). Server Components
 * are the default in Next.js App Router and provide:
 * - Zero client-side JavaScript for this component
 * - Faster initial page load
 * - Better SEO (content available at initial render)
 * The interactive form component is imported as a Client Component within page.tsx.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter font configuration — loaded and self-hosted by Next.js.
 *
 * We use the "latin" subset to minimize font file size.
 * The CSS variable --font-inter is available globally for any component
 * that needs to reference the font family directly.
 *
 * WHY variable fonts: Inter Variable gives us access to all weight variants
 * (300-900) in a single file, reducing HTTP requests compared to loading
 * individual weight files.
 */
const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * SEO METADATA — Crafted for search engine ranking and social sharing.
 *
 * The title follows the pattern: [Tool Name] - [Benefit] | [Brand]
 * This pattern works well because:
 * - Search engines display the first ~60 chars, so the keyword is upfront
 * - The benefit phrase answers "why should I click this?"
 * - The brand name builds recognition over time
 *
 * The description targets 150-160 characters (optimal for SERP display)
 * and includes a clear value proposition + call to action.
 */
export const metadata: Metadata = {
  title: "AI Tattoo Design Generator - Free AI Tattoo Maker | InkAI",
  description:
    "Design your perfect tattoo with AI. Describe your idea, choose a style, and get a custom tattoo design in seconds. Free to try — 10+ styles including Traditional, Watercolor, Geometric, Japanese, and more.",
  keywords: [
    "AI tattoo generator",
    "tattoo design AI",
    "AI tattoo maker",
    "custom tattoo design",
    "tattoo idea generator",
    "AI tattoo art",
    "tattoo flash generator",
    "tattoo design tool",
    "free tattoo designer",
    "tattoo style generator",
  ],
  openGraph: {
    title: "AI Tattoo Design Generator - Create Custom Tattoo Art with AI",
    description:
      "Describe your dream tattoo and see it come to life with AI. Choose from 10+ styles. Free to try, instant results.",
    type: "website",
    locale: "en_US",
    /**
     * TODO: Update this URL once deployed to production domain.
     * The OG URL is used for canonical linking — important for SEO
     * to prevent duplicate content issues across different URL variants.
     */
    url: "https://inkai.app",
    siteName: "InkAI - AI Tattoo Design Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tattoo Design Generator | InkAI",
    description:
      "Design custom tattoos with AI. 10+ styles, instant results. Try free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * RootLayout — The outermost component wrapping all pages.
 *
 * Receives children from Next.js routing system and wraps them in the
 * base HTML structure with fonts, theme class, and body styling.
 *
 * The dark class is applied directly to <html> so that all Tailwind
 * dark: variants work correctly throughout the entire component tree.
 * We're dark-by-default — no theme toggle in MVP (tattoo artists prefer dark).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interFont.variable} dark`}>
      {/**
       * The body uses min-h-screen + flex col so the footer sticks
       * to the viewport bottom even when content is short. The font-sans
       * class maps to our --font-inter variable defined in globals.css @theme.
       */}
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
