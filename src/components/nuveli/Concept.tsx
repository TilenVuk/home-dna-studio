import detailImage from "@/assets/detail-material.jpg";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Concept({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).concept;

  return (
    <section id="concept" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display-lg mt-6 max-w-[20ch]">
              {t.title[0]}
              <span className="block text-muted-foreground">{t.title[1]}</span>
            </h2>
            <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
              {t.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {t.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="bg-background p-7">
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="lg:col-span-5">
          <img
            src={detailImage}
            alt={t.imageAlt}
            loading="lazy"
            width={1200}
            height={900}
            className="h-full min-h-[380px] w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
