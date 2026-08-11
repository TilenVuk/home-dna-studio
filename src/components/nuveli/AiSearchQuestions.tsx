import { ArrowUpRight } from "lucide-react";
import { aiSearchArticles, articlePath } from "@/content/aiSearchArticles";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";

export function AiSearchQuestions({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).content;
  const prefix = locale === "sl" ? "" : `/${locale}`;

  return (
    <section id="vsebine" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display-lg mt-6">{t.title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-x-12 md:grid-cols-2">
          {aiSearchArticles.map((article, index) => {
            const content = article.localized[locale];
            return (
              <article key={article.id} className="border-t border-border py-8">
                <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{content.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {content.description}
                </p>
                <a
                  href={articlePath(article, locale)}
                  className="mt-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
                >
                  {t.read}
                  <ArrowUpRight size={15} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <a
            href={`${prefix}/vsebine`}
            className="inline-flex min-h-12 items-center rounded-full border border-foreground px-7 py-4 text-sm transition-colors hover:bg-foreground hover:text-background"
          >
            {t.all}
          </a>
        </div>
      </div>
    </section>
  );
}
