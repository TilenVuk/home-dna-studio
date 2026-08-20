import { ChefHat, Shirt, Sofa, Home, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getSiteCopy } from "@/content/siteLocalized";
import { localizePath, type Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const icons = [ChefHat, Shirt, Sofa, Home];

export function Services({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).services;
  const ctaHref = localizePath(locale, "/home-dna");

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
              className="group bg-background p-8 transition-colors duration-500 hover:bg-sand md:p-10"
            >
              <Icon size={22} strokeWidth={1.4} className="text-forest" />
              <h3 className="mt-14 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <div className="mt-8 transition-all duration-300 md:mt-0 md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:pointer-events-none md:group-hover:pointer-events-auto md:group-hover:mt-8 md:group-hover:max-h-20 md:group-hover:translate-y-0 md:group-hover:overflow-visible md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:mt-8 md:group-focus-within:max-h-20 md:group-focus-within:translate-y-0 md:group-focus-within:overflow-visible md:group-focus-within:opacity-100">
                <Link
                  to={ctaHref}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span>{t.cta}</span>
                  <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
