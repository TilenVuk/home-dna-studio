import { ChefHat, Shirt, Sofa, Home } from "lucide-react";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const icons = [ChefHat, Shirt, Sofa, Home];

export function Services({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).services;

  return (
    <section id="services" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="display-lg mt-6 max-w-[20ch]">{t.title}</h2>
      </Reveal>

      <div className="mt-16 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        {t.items.map((s, i) => {
          const Icon = icons[i % icons.length]!;
          return (
            <Reveal
              key={s.title}
              delay={i * 80}
              className="bg-background p-8 transition-colors duration-500 hover:bg-sand md:p-10"
            >
              <Icon size={22} strokeWidth={1.4} className="text-forest" />
              <h3 className="mt-14 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
