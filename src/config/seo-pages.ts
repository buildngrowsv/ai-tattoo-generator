/**
 * Programmatic SEO Pages Configuration — ai-tattoo-generator
 *
 * NICHE-SPECIFIC DATA: This config was generated with competitors, audiences,
 * and use cases specific to this product's category. These are NOT generic
 * placeholders — each entry targets real long-tail keywords in this niche.
 *
 * IMPORTED BY:
 * - src/app/vs/[competitor]/page.tsx
 * - src/app/for/[audience]/page.tsx
 * - src/app/use-cases/[use-case]/page.tsx
 * - src/app/sitemap.ts
 * - src/components/SeoInternalLinks.tsx
 *
 * Generated: 2026-04-14 by fleet pSEO script
 */

import { PRODUCT_CONFIG } from "@/lib/config";

export interface SeoCompetitorConfig {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly pricing: string;
  readonly weaknesses: string[];
}

export interface SeoAudienceConfig {
  readonly slug: string;
  readonly name: string;
  readonly painPoints: string[];
  readonly howWeHelp: string;
}

export interface SeoUseCaseConfig {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly steps: string[];
}

export interface SeoBestConfig {
  /** URL-safe slug used in the route path, e.g. "free-background-remover" -> /best/free-background-remover */
  readonly slug: string;
  /** Full page title, e.g. "Best Free Background Remover in 2026" */
  readonly title: string;
  /** 1-2 sentence description of what this listicle page covers */
  readonly description: string;
  /** 5 product-specific features that justify ranking on this page */
  readonly features: string[];
}


export interface SeoPageConfig {
  readonly competitors: SeoCompetitorConfig[];
  readonly audiences: SeoAudienceConfig[];
  readonly useCases: SeoUseCaseConfig[];
  /** Best-of listicle entries — generates /best/[slug] pages */
  readonly bestPages: SeoBestConfig[];
}

export const SEO_PAGES_CONFIG: SeoPageConfig = {
  competitors: [
    {
      slug: "blackink-ai",
      name: "BlackInk AI",
      description: "BlackInk AI is an AI tattoo design generator that creates custom tattoo artwork from text descriptions and style preferences.",
      pricing: "Free limited, $9.99/mo for Pro",
      weaknesses: [
        "Limited to black and gray designs on the free tier",
        "Generated designs sometimes lack the detail resolution needed for small tattoos",
        "Style variety is narrower than general AI image tools",
        "No body placement visualization feature",
      ],
    },
    {
      slug: "tattoojenny",
      name: "TattooJenny",
      description: "TattooJenny is an AI tattoo generator that creates custom tattoo designs in various styles from text prompts.",
      pricing: "$7.99/mo for Basic, $19.99/mo for Pro",
      weaknesses: [
        "Output quality is inconsistent across different tattoo styles",
        "No option to upload reference images for style matching",
        "Generated designs need significant refinement before they're tattoo-ready",
        "Limited export resolution for detailed designs",
      ],
    },
    {
      slug: "tattoo-ai-design",
      name: "Tattoo AI Design",
      description: "Tattoo AI Design uses AI to generate tattoo concepts from descriptions, offering multiple style categories and customization options.",
      pricing: "Free limited trials, premium plans from $5.99/mo",
      weaknesses: [
        "Many generated designs look generic or template-based",
        "Limited color tattoo generation capability",
        "No body placement preview or sizing tools",
        "Free tier is very restrictive — essentially a demo",
      ],
    }
  ],

  audiences: [
    {
      slug: "tattoo-enthusiasts",
      name: "Tattoo Enthusiasts & First-Timers",
      painPoints: [
        "Hard to explain a tattoo vision to an artist using only words",
        "Custom designs from tattoo artists cost $100-$500+ and take days to receive",
        "Fear of committing to a permanent design without seeing it first",
        "Pinterest tattoo boards are inspirational but not personalized to their vision",
      ],
      howWeHelp: `${PRODUCT_CONFIG.name} turns your tattoo idea into a visual design instantly. Describe what you want — a phoenix in watercolor style, a geometric wolf, a Japanese sleeve concept — and see it rendered in seconds. Generate dozens of variations to find your perfect design before committing to ink.`,
    },
    {
      slug: "tattoo-artists",
      name: "Tattoo Artists & Studios",
      painPoints: [
        "Clients often have vague ideas that are hard to translate into drawings",
        "Custom design consultations eat into tattooing time",
        "Need to produce multiple concept sketches before clients approve",
        "Walk-in clients want immediate design options",
      ],
      howWeHelp: `${PRODUCT_CONFIG.name} helps tattoo artists speed up the design consultation. Generate concept sketches from client descriptions in seconds, show multiple variations, and refine together. Spend less time sketching and more time inking. Perfect for walk-ins who need inspiration on the spot.`,
    },
    {
      slug: "couples-groups",
      name: "Couples & Group Tattoo Planners",
      painPoints: [
        "Matching or complementary tattoo designs are hard to conceptualize",
        "Coordinating group tattoos requires everyone to agree on a style",
        "Finding designs that work individually and as a set is challenging",
        "Professional design for matching sets multiplies the cost",
      ],
      howWeHelp: `${PRODUCT_CONFIG.name} generates matching and complementary tattoo sets instantly. Create coordinated designs for couples, siblings, or friend groups. Explore variations until everyone agrees — iterate faster than any design consultation. Each person sees exactly what their piece looks like.`,
    }
  ],

  useCases: [
    {
      slug: "custom-tattoo-design",
      name: "Custom Tattoo Design",
      description: "Generate unique, personalized tattoo artwork from a text description of your vision — any style, any placement, any size.",
      steps: [
        "Describe your tattoo concept — subject, style, size, and placement",
        "Choose your preferred art style (traditional, watercolor, geometric, tribal, etc.)",
        "AI generates multiple unique design variations to explore",
        "Download your favorite design to bring to your tattoo artist",
      ],
    },
    {
      slug: "flash-sheet-creation",
      name: "Flash Sheet Creation",
      description: "Generate flash sheet designs for tattoo studios — themed collections of ready-to-ink designs for walk-in clients.",
      steps: [
        "Choose a theme for your flash sheet (floral, skulls, nautical, animals, etc.)",
        "Set the style and complexity level for walk-in pricing tiers",
        "AI generates a collection of cohesive, tattoo-ready designs",
        "Download the sheet for printing or digital display in your studio",
      ],
    },
    {
      slug: "cover-up-concepts",
      name: "Cover-Up & Rework Concepts",
      description: "Generate design ideas for covering or reworking an existing tattoo — see possibilities before committing to a cover-up.",
      steps: [
        "Upload a photo of the existing tattoo you want to cover or rework",
        "Describe what you'd like the final result to look like",
        "AI generates cover-up concepts that work with the existing ink",
        "Download concepts to discuss with your tattoo artist for feasibility",
      ],
    }
  ],

  bestPages: [
    {
      slug: "free-tattoo",
      title: "Best Free Tattoo in 2026",
      description:
        "Compare the best free AI tattoo tools available in 2026. Find tools that work without watermarks, signups, or hidden costs.",
      features: [
        "Free daily AI tattoo design generation with no credit card required",
        "Multiple styles including traditional, neo-traditional, blackwork, and fine-line",
        "High-contrast outputs optimized for skin transfer and stencil use",
        "High-resolution downloads suitable for printing at actual tattoo size",
        "No watermarks on free-tier tattoo design outputs",
      ],
    },
    {
      slug: "tattoo-for-tattoo-enthusiasts",
      title: "Best Tattoo for Tattoo Enthusiasts in 2026",
      description:
        "The best AI tattoo tools for tattoo enthusiasts. Compare features, pricing, and output quality for your specific workflow needs.",
      features: [
        "Virtual placement preview on body area photos for realistic size reference",
        "Artist-shareable reference sheets with multiple angle views",
        "Custom text integration with hand-lettering and script style options",
        "Symbol combination tools for building meaningful personal designs",
        "Style transfer from a reference photo to match your tattoo artist's portfolio",
      ],
    },
    {
      slug: "tattoo-no-signup",
      title: "Best Tattoo with No Signup in 2026",
      description:
        "AI tattoo tools that work instantly without creating an account, entering email, or providing payment information.",
      features: [
        "No account required — design tattoos without registering",
        "No email or age verification required to access free designs",
        "No credit card needed for free tattoo design generation",
        "No watermarks on free tattoo outputs",
        "No app download — browser-based AI tattoo design tool",
      ],
    },
  ],
};
