/**
 * FAQ SECTION — localized accordion (next-intl).
 *
 * Content is loaded from JSON so Spanish SEO long-tail queries are served
 * from the same DOM structure as English (Builder 25, T13).
 */
import { getTranslations } from "next-intl/server";

type FaqItem = { q: string; a: string };

export default async function FrequentlyAskedQuestionsSection() {
  const t = await getTranslations("Faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section className="py-16 sm:py-24 bg-card/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("headingBefore")}{" "}
            <span className="gradient-text-static">{t("headingAccent")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <div className="space-y-3">
          {items.map((faqItem, index) => (
            <details
              key={`${index}-${faqItem.q.slice(0, 24)}`}
              className="group rounded-xl border border-border bg-card overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                {faqItem.q}
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

              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faqItem.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
