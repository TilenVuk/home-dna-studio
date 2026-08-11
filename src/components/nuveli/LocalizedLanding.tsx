import type { Locale } from "@/lib/i18n";
import { aiSearchArticles, articlePath } from "@/content/aiSearchArticles";

const copy = {
  hr: {
    eyebrow: "Interijeri po mjeri · Home DNA™",
    title: "Dom oblikovan prema načinu na koji stvarno živite.",
    body: "Nuveli Studio projektira cjelovite interijere i namještaj po mjeri. Home DNA™ povezuje vaše navike, potrebe, stil i investicijski okvir u jasnu osnovu za projekt.",
    cta: "Otkrijte svoj Home DNA™",
    ctaNote: "Osobni report + okvirna procjena investicije",
    guides: "Vodiči i odgovori",
    language: "Jezik",
  },
  en: {
    eyebrow: "Bespoke interiors · Home DNA™",
    title: "A home designed around the way you actually live.",
    body: "Nuveli Studio designs complete interiors and custom furniture. Home DNA™ connects your routines, needs, style and investment range into a clear starting point for the project.",
    cta: "Discover your Home DNA™",
    ctaNote: "Personal report + indicative investment estimate",
    guides: "Guides and answers",
    language: "Language",
  },
} as const;

export function LocalizedLanding({ locale }: { locale: Exclude<Locale, "sl"> }) {
  const t = copy[locale];
  const prefix = `/${locale}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a href={`${prefix}/`} className="font-display text-lg font-medium tracking-[-0.04em]">
            NUVELI <span className="eyebrow ml-1">Studio</span>
          </a>
          <nav aria-label={t.language} className="flex gap-2 text-xs">
            <a href="/" hrefLang="sl" className="rounded-full border border-border px-3 py-2">
              SL
            </a>
            <a
              href="/hr/"
              hrefLang="hr"
              className={`rounded-full border px-3 py-2 ${locale === "hr" ? "border-foreground" : "border-border"}`}
            >
              HR
            </a>
            <a
              href="/en/"
              hrefLang="en"
              className={`rounded-full border px-3 py-2 ${locale === "en" ? "border-foreground" : "border-border"}`}
            >
              EN
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display-lg mt-6 max-w-[19ch]">{t.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">{t.body}</p>
          <div className="mt-10 flex flex-col items-start gap-3">
            <a
              href={`${prefix}/home-dna`}
              className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground"
            >
              {t.cta}
            </a>
            <span className="text-sm text-muted-foreground">{t.ctaNote}</span>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
            <p className="eyebrow">AI Search · Nuveli Studio</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight">{t.guides}</h2>
            <div className="mt-10 grid gap-x-10 gap-y-0 md:grid-cols-2">
              {aiSearchArticles.map((article, index) => {
                const content = article.localized[locale];
                return (
                  <a
                    key={article.id}
                    href={articlePath(article, locale)}
                    className="group border-t border-border py-6"
                  >
                    <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-display text-xl group-hover:underline">
                      {content.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {content.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
