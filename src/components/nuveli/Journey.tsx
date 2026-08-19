import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Journey({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).journey;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display-lg mt-6 max-w-[14ch]">{t.title}</h2>
            <p className="mt-8 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              {t.intro}
            </p>
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {t.steps.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 60}
              as="li"
              className="border-t border-border py-7 last:border-b"
            >
              <div className="flex gap-8">
                <span className="font-display text-sm text-oak">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
