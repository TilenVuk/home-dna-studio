import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export function EditorialScreen({
  screenKey,
  eyebrow,
  headline,
  body,
  cta,
  image,
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
  onContinue?: () => void;
  onBack?: () => void;
  ctaDisabled?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [screenKey]);

  return (
    <div className="animate-[hd-enter_260ms_ease-out] motion-reduce:animate-none">
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
        <p className="eyebrow">{eyebrow}</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="display-lg mt-6 max-w-[20ch] focus:outline-none"
        >
          {headline}
        </h1>
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
              Nazaj
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
