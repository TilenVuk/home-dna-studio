import type { Locale } from "@/lib/i18n";
import { aiSearchArticles, articlePath } from "@/content/aiSearchArticles";

const copy = {
  sl: {
    eyebrow: "Nuveli Studio · Vsebine",
    title: "Odgovori za bolj premišljeno načrtovanje doma",
    intro:
      "Praktični vodiči o notranjem oblikovanju, pohištvu po meri, kuhinjah, materialih, shranjevanju, investiciji in Home DNA™ metodologiji.",
    cta: "Odkrijte svoj Home DNA™",
  },
  hr: {
    eyebrow: "Nuveli Studio · Sadržaj",
    title: "Odgovori za promišljenije planiranje doma",
    intro:
      "Praktični vodiči o dizajnu interijera, namještaju po mjeri, kuhinjama, materijalima, spremanju, investiciji i Home DNA™ metodologiji.",
    cta: "Otkrijte svoj Home DNA™",
  },
  en: {
    eyebrow: "Nuveli Studio · Guides",
    title: "Answers for more considered home planning",
    intro:
      "Practical guides to interior design, custom furniture, kitchens, materials, storage, investment and the Home DNA™ methodology.",
    cta: "Discover your Home DNA™",
  },
} as const;

export function AiSearchHub({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const prefix = locale === "sl" ? "" : `/${locale}`;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a href={`${prefix}/`} className="font-display text-lg font-medium tracking-[-0.04em]">
            NUVELI <span className="eyebrow ml-1">Studio</span>
          </a>
          <nav className="flex gap-2 text-xs" aria-label="Language">
            <a
              href="/vsebine"
              hrefLang="sl"
              className={`rounded-full border px-3 py-2 ${locale === "sl" ? "border-foreground" : "border-border"}`}
            >
              SL
            </a>
            <a
              href="/hr/vsebine"
              hrefLang="hr"
              className={`rounded-full border px-3 py-2 ${locale === "hr" ? "border-foreground" : "border-border"}`}
            >
              HR
            </a>
            <a
              href="/en/vsebine"
              hrefLang="en"
              className={`rounded-full border px-3 py-2 ${locale === "en" ? "border-foreground" : "border-border"}`}
            >
              EN
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display-lg mt-6 max-w-[20ch]">{t.title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">{t.intro}</p>
        <div className="mt-16 grid gap-x-12 md:grid-cols-2">
          {aiSearchArticles.map((article, index) => {
            const content = article.localized[locale];
            return (
              <article key={article.id} className="border-t border-border py-8">
                <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-display text-2xl tracking-tight">
                  <a href={articlePath(article, locale)} className="hover:underline">
                    {content.title}
                  </a>
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {content.description}
                </p>
              </article>
            );
          })}
        </div>
        <aside className="mt-16 border-t border-border pt-10">
          <a
            href={`${prefix}/home-dna`}
            className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground"
          >
            {t.cta}
          </a>
        </aside>
      </main>
    </div>
  );
}
