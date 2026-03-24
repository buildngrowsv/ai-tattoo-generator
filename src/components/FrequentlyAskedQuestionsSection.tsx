/**
 * FAQ SECTION — SEO-Rich Content + Objection Handling
 *
 * This component serves two critical purposes:
 *
 * 1. SEO: FAQ sections are goldmines for long-tail keyword ranking.
 *    Each Q&A targets a specific search query that potential users type
 *    into Google. For example, "Is AI tattoo design free?" targets the
 *    query "free AI tattoo generator" which has growing search volume.
 *    Google also uses FAQ content for Featured Snippets (position zero).
 *
 * 2. CONVERSION: FAQs handle objections that prevent users from trying
 *    the tool or upgrading to Pro. Common objections for AI tattoo tools:
 *    - "Is it really free?" (trust concern)
 *    - "Will my tattoo artist accept AI designs?" (utility concern)
 *    - "Is it safe / private?" (privacy concern)
 *    - "How good is the quality?" (quality concern)
 *    Each answer directly addresses one of these objections.
 *
 * IMPLEMENTATION:
 * Uses native HTML <details>/<summary> elements for the accordion behavior.
 * No JavaScript needed — these are natively interactive HTML elements.
 * This approach:
 * - Zero JS bundle impact (Server Component, no client code)
 * - Full accessibility out of the box (keyboard, screen readers)
 * - SEO-friendly (content is in the DOM, not hidden by JS)
 * - Works without JavaScript enabled
 *
 * CALLED BY: src/app/page.tsx (FAQ section near footer)
 * DEPENDS ON: Nothing — pure static HTML
 */

/**
 * FAQ_ITEMS — The questions and answers displayed in the accordion.
 *
 * Each item targets specific search queries and handles specific objections.
 * The order is intentional:
 * 1. "What is" — defines the product (for new visitors from search)
 * 2. "How does it work" — explains the process (reduces anxiety)
 * 3. "Is it free" — addresses the #1 objection
 * 4. "Can I use for real tattoo" — addresses utility concern
 * 5. "What styles" — SEO keyword stuffing (legitimate, in context)
 * 6. "How good is quality" — addresses quality concern
 * 7. "Is it private" — addresses privacy concern
 * 8. "Can I sell/commercial use" — addresses Pro tier value
 */
const FAQ_ITEMS_FOR_TATTOO_GENERATOR = [
  {
    question: "What is an AI tattoo generator?",
    answer:
      "An AI tattoo generator uses artificial intelligence to create custom tattoo designs based on your text description. You describe your tattoo idea — like 'a wolf howling at the moon with pine trees' — choose a style (Traditional, Watercolor, Japanese, etc.), and the AI creates a unique, professional-quality tattoo design in seconds. It's like having a tattoo artist sketch your ideas instantly.",
  },
  {
    question: "How does the AI tattoo design process work?",
    answer:
      "It's simple: 1) Describe your tattoo idea in plain English. 2) Select your preferred tattoo style from 10 options. 3) Choose body placement and size. 4) Click 'Generate Design' and get your custom tattoo artwork in about 10-15 seconds. The AI uses your inputs to construct an optimized prompt that produces style-authentic tattoo designs.",
  },
  {
    question: "Is the AI tattoo generator free to use?",
    answer:
      "Yes! You can generate up to 3 free tattoo designs per day with no signup required. For unlimited designs, priority generation speed, high-resolution output, and commercial use rights, upgrade to Pro for $9.90/month.",
  },
  {
    question: "Can I take AI-generated designs to a real tattoo artist?",
    answer:
      "Absolutely! Many of our users use AI-generated designs as reference material for their tattoo artists. The designs serve as a detailed starting point that your artist can refine, resize, and adapt to your body. Tattoo artists appreciate detailed references — it helps them understand exactly what you want and saves time during the consultation.",
  },
  {
    question: "What tattoo styles are available?",
    answer:
      "We support 10 popular tattoo styles: Traditional (American classic), Watercolor (painterly effects), Geometric (mathematical patterns), Japanese (irezumi), Minimalist (fine line), Blackwork (solid black), Tribal (Polynesian-inspired), Realism (photorealistic), Neo-Traditional (modern classic), and Dotwork (stipple shading). Each style uses specialized AI prompting to produce authentic results.",
  },
  {
    question: "How good is the quality of AI-generated tattoo designs?",
    answer:
      "The AI produces professional-quality tattoo designs suitable for use as reference material. The output quality depends on your description — more detailed descriptions produce better results. We use advanced AI models (FLUX) specifically tuned for artistic output. While AI designs are excellent starting points, we recommend having a professional tattoo artist review and refine the design before getting it tattooed.",
  },
  {
    question: "Are my tattoo designs private?",
    answer:
      "Yes. Your descriptions and generated designs are processed securely and are not stored permanently or shared with other users. Generated images are hosted on a temporary CDN for you to download. We do not use your designs to train AI models or share them with third parties.",
  },
  {
    question: "Can I use generated designs commercially?",
    answer:
      "Free tier designs are for personal use only. Pro subscribers ($9.90/month) receive a commercial use license that allows you to use generated designs for tattoo studio portfolios, merchandise, prints, and other commercial purposes.",
  },
] as const;

/**
 * FrequentlyAskedQuestionsSection — Renders the FAQ accordion.
 *
 * Server Component (no "use client") because the <details>/<summary>
 * elements provide native interactivity without JavaScript. This means
 * zero client-side JS for this section, which is great for performance.
 */
export default function FrequentlyAskedQuestionsSection() {
  return (
    <section className="py-16 sm:py-24 bg-card/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="gradient-text-static">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about AI tattoo design generation.
          </p>
        </div>

        {/* FAQ accordion using native <details>/<summary> elements.
            Each item is a separate <details> element so they can be
            opened/closed independently. The "group" attribute could be
            used to make them exclusive (only one open at a time) but
            we allow multiple open for better UX — users often want to
            compare answers. */}
        <div className="space-y-3">
          {FAQ_ITEMS_FOR_TATTOO_GENERATOR.map((faqItem) => (
            <details
              key={faqItem.question}
              className="group rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Question — acts as the clickable toggle.
                  The marker is hidden (list-none) and replaced with a
                  custom chevron that rotates on open (via group-open). */}
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                {faqItem.question}
                {/* Chevron indicator — rotates 180deg when the details is open.
                    Using a simple SVG instead of lucide-react to keep this
                    as a Server Component (no icon imports needed). */}
                <svg
                  className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              {/* Answer — hidden by default, shown when details is open.
                  Uses a slightly different text color for visual hierarchy. */}
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faqItem.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
