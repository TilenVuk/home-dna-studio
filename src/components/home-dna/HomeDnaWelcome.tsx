import { ArrowRight, Check } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import { welcomeCopy } from "./homeDnaData";

export function HomeDnaWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="order-2 lg:order-1 lg:col-span-6">
        <p className="eyebrow">{welcomeCopy.eyebrow}</p>
        <h1 className="display-lg mt-6 max-w-[20ch]">{welcomeCopy.headline}</h1>
        <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
          {welcomeCopy.body}
        </p>

        <ul className="mt-10">
          {welcomeCopy.benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-4 border-t border-border py-4 text-sm last:border-b"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-oak" />
              {b}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">{welcomeCopy.time}</p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
        >
          {welcomeCopy.cta}
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-6">
        <img
          src={heroInterior}
          alt="Sodoben interier z izdelano hrastovo opremo"
          width={1920}
          height={1200}
          className="aspect-[4/5] w-full object-cover md:aspect-[4/3] lg:aspect-[4/5]"
        />
      </div>
    </div>
  );
}
