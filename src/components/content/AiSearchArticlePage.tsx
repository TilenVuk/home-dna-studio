import type { Locale } from "@/lib/i18n";
import { articlePath, type AiSearchArticle } from "@/content/aiSearchArticles";

const ui = {
  sl: { back: "Nuveli Studio", label: "Vsebine", cta: "Odkrijte svoj Home DNA™", estimate: "Osebni report + okvirna ocena investicije", faq: "Pogosta vprašanja", languages: "Jezik" },
  hr: { back: "Nuveli Studio", label: "Sadržaj", cta: "Otkrijte svoj Home DNA™", estimate: "Osobni izvještaj + okvirna procjena investicije", faq: "Česta pitanja", languages: "Jezik" },
  en: { back: "Nuveli Studio", label: "Guides", cta: "Discover your Home DNA™", estimate: "Personal report + indicative investment estimate", faq: "Frequently asked questions", languages: "Language" },
} as const;

export function AiSearchArticlePage({ article, locale }: { article: AiSearchArticle; locale: Locale }) {
  const content = article.localized[locale];
  const prefix = locale === "sl" ? "" : `/${locale}`;
  const homeDnaPath = `${prefix}/home-dna`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.description,
    inLanguage: locale,
    author: { "@type": "Organization", name: "Nuveli Studio" },
    publisher: { "@type": "Organization", name: "Nuveli Studio" },
    mainEntityOfPage: `https://nuvelistudio.com${articlePath(article, locale)}`,
  };
  const faqSchema = content.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5 md:px-10">
          <a href={`${prefix}/`} className="font-display text-lg font-medium tracking-[-0.04em]">NUVELI <span className="eyebrow ml-1">Studio</span></a>
          <nav aria-label={ui[locale].languages} className="flex items-center gap-2 text-xs">
            {(["sl", "hr", "en"] as const).map((target) => (
              <a
                key={target}
                href={articlePath(article, target)}
                hrefLang={target}
                className={`rounded-full border px-3 py-2 ${target === locale ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}
              >
                {target.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <p className="eyebrow">{ui[locale].label} · Home DNA™</p>
        <h1 className="display-lg mt-6 max-w-[22ch]">{content.title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">{content.intro}</p>

        <div className="mt-16 space-y-14">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-3xl tracking-tight">{section.heading}</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        {content.faqs?.length ? (
          <section className="mt-20 border-t border-border pt-14">
            <h2 className="font-display text-3xl tracking-tight">{ui[locale].faq}</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {content.faqs.map((faq) => (
                <div key={faq.question} className="py-7">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <aside className="mt-20 rounded-2xl border border-border bg-muted/40 p-8 md:p-10">
          <p className="eyebrow">Home DNA™ Discovery</p>
          <h2 className="mt-4 font-display text-3xl">{ui[locale].estimate}</h2>
          <a href={homeDnaPath} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground">
            {ui[locale].cta}
          </a>
        </aside>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </div>
  );
}
