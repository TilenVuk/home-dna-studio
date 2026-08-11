import { ArrowRight, Check } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import heroWebp768 from "@/assets/hero-interior-768.webp";
import heroWebp1280 from "@/assets/hero-interior-1280.webp";
import heroWebp1920 from "@/assets/hero-interior-1920.webp";
import { welcomeCopy } from "./homeDnaData";
import type { Locale } from "@/lib/i18n";

const localizedWelcome: Record<Exclude<Locale, "sl">, typeof welcomeCopy> = {
  hr: {
    eyebrow: "Home DNA™",
    headline: "Svaki izniman dom počinje razumijevanjem ljudi koji će u njemu živjeti.",
    body: "U nekoliko minuta upoznat ćemo vaš dom, životni stil i želje. Na kraju dobivate osobni Home DNA™ Report i okvirnu procjenu investicije za odabrani opseg projekta.",
    benefits: [
      "Analiza doma prilagođena vašem načinu života",
      "Osobne funkcionalne i oblikovne smjernice",
      "Okvirna procjena investicije i osnova za ponudu",
    ],
    time: "Približno 3–10 minuta, ovisno o opsegu projekta.",
    cta: "Pokreni Home DNA™ Discovery",
  },
  en: {
    eyebrow: "Home DNA™",
    headline: "Every exceptional home starts with understanding the people who will live in it.",
    body: "In a few minutes we will learn about your home, lifestyle and priorities. At the end you receive a personal Home DNA™ Report and an indicative investment estimate for your selected project scope.",
    benefits: [
      "A home analysis tailored to your lifestyle",
      "Personal functional and design priorities",
      "Indicative investment estimate and basis for a proposal",
    ],
    time: "About 3–10 minutes, depending on the project scope.",
    cta: "Start Home DNA™ Discovery",
  },
};

export function HomeDnaWelcome({
  onStart,
  locale = "sl",
}: {
  onStart: () => void;
  locale?: Locale;
}) {
  const copy = locale === "sl" ? welcomeCopy : localizedWelcome[locale];
  const alt =
    locale === "hr"
      ? "Suvremen interijer s namještajem po mjeri u hrastovom dekoru"
      : locale === "en"
        ? "Contemporary interior with custom oak furniture"
        : "Sodoben interjer z izdelano hrastovo opremo";

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="order-2 lg:order-1 lg:col-span-6">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="display-lg mt-6 max-w-[20ch]">{copy.headline}</h1>
        <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
          {copy.body}
        </p>

        <ul className="mt-10">
          {copy.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-4 border-t border-border py-4 text-sm last:border-b"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-oak" />
              {benefit}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">{copy.time}</p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
        >
          {copy.cta}
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-6">
        <picture className="block">
          <source
            type="image/webp"
            srcSet={`${heroWebp768} 768w, ${heroWebp1280} 1280w, ${heroWebp1920} 1920w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <img
            src={heroInterior}
            alt={alt}
            width={1920}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/5] w-full object-cover md:aspect-[4/3] lg:aspect-[4/5]"
          />
        </picture>
      </div>
    </div>
  );
}
