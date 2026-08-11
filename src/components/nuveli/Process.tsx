import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Process({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).process;

  return (
    <section id="process" className="bg-secondary">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display-lg mt-6 max-w-[18ch]">{t.title}</h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
          {t.steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 90} className="group bg-secondary p-8 md:p-10">
              <span className="font-display text-sm text-oak">{s.step}</span>
              <h3 className="mt-10 text-2xl uppercase tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-foreground">{s.line}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <div className="mt-10 h-px w-10 bg-oak transition-all duration-500 group-hover:w-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
