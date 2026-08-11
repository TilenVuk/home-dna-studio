import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function EditorialScreen({
  screenKey,
  eyebrow,
  headline,
  body,
  cta,
  image,
  locale = "sl",
  prominentEyebrow = false,
  onContinue,
  onBack,
  ctaDisabled = false,
}: {
  screenKey: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  image: string;
  locale?: Locale;
  prominentEyebrow?: boolean | undefined;
  onContinue?: () => void;
  onBack?: () => void;
  ctaDisabled?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRoom =
    locale === "hr" ? "Sljedeći prostor" : locale === "en" ? "Next room" : "Naslednji prostor";
  const back = locale === "hr" ? "Natrag" : locale === "en" ? "Back" : "Nazaj";

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [screenKey]);

  return (
    <div className="animate-[hd-enter_260ms_ease-out] motion-reduce:animate-none">
      {prominentEyebrow && (
        <div className="mb-10 max-w-[70ch] md:mb-12">
          <p className="eyebrow">{nextRoom}</p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 max-w-[16ch] font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.88] tracking-[-0.065em] focus:outline-none"
          >
            {eyebrow}
          </h1>
          <h2 className="mt-7 max-w-[28ch] font-display text-2xl leading-tight tracking-[-0.035em] md:text-4xl">
            {headline}
          </h2>
        </div>
      )}
      <div className="overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          width={1600}
          height={750}
          className="h-[38vh] w-full object-cover md:h-[46vh]"
        />
      </div>
      <div className="mt-12 max-w-[52ch]">
        {!prominentEyebrow && (
          <>
            <p className="eyebrow">{eyebrow}</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="display-lg mt-6 max-w-[20ch] focus:outline-none"
            >
              {headline}
            </h1>
          </>
        )}
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">{body}</p>
        {onContinue ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={ctaDisabled}
            className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            {cta} <ArrowRight size={16} />
          </button>
        ) : (
          <p className="mt-10 inline-flex min-h-12 items-center rounded-full border border-border px-7 py-3.5 text-sm text-muted-foreground">
            {cta}
          </p>
        )}
        {onBack && (
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mt-10 inline-flex min-h-12 items-center text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              {back}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
