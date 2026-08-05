import { Link } from "@tanstack/react-router";
import { ArrowDownRight } from "lucide-react";

import heroImage from "@/assets/hero-interior.jpg";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Sodoben skandinavski interjer s hrastovim pohištvom po meri"
        width={1920}
        height={1200}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/25 to-foreground/30" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20">
        <p className="eyebrow text-background/80">Nuveli Studio — Home DNA™</p>
        <h1 className="display-xl mt-6 max-w-[16ch] text-background">{hero.headline}</h1>
        <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-background/85 md:text-lg">
          {hero.sub}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/home-dna"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 text-sm text-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            {hero.primaryCta}
            <ArrowDownRight size={16} />
          </Link>

          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-full border border-background/50 px-7 py-4 text-sm text-background transition-colors hover:bg-background/10"
          >
            {hero.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
