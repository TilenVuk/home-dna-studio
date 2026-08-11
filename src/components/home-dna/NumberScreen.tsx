import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import type { Locale } from "@/lib/i18n";

export function NumberScreen({
  screenKey,
  headline,
  support,
  unit,
  min,
  max,
  value,
  presets,
  allowSkip = false,
  locale = "sl",
  onSkip,
  onSubmit,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  unit: string;
  min: number;
  max: number;
  value?: number | undefined;
  presets?: number[];
  allowSkip?: boolean;
  locale?: Locale;
  onSkip?: () => void;
  onSubmit: (value: number) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState(value !== undefined ? String(value) : "");
  const [error, setError] = useState<string | null>(null);
  const labels =
    locale === "hr"
      ? {
          measure: "Približna mjera",
          hint: `Raspon ${min}–${max} ${unit}. Preciznost nije potrebna.`,
          invalid: `Unesite približnu mjeru u ${unit}.`,
          range: `Unesite vrijednost između ${min} i ${max} ${unit}.`,
          skip: "Preskoči",
          next: "Dalje",
        }
      : locale === "en"
        ? {
            measure: "Approximate measurement",
            hint: `Range ${min}–${max} ${unit}. It does not need to be exact.`,
            invalid: `Enter an approximate measurement in ${unit}.`,
            range: `Enter a value between ${min} and ${max} ${unit}.`,
            skip: "Skip",
            next: "Next",
          }
        : {
            measure: "Približna mera",
            hint: `Območje ${min}–${max} ${unit}. Natančnost ni potrebna.`,
            invalid: `Vpišite približno mero v ${unit}.`,
            range: `Vpišite vrednost med ${min} in ${max} ${unit}.`,
            skip: "Preskoči",
            next: "Naprej",
          };

  useEffect(() => {
    setInput(value !== undefined ? String(value) : "");
    setError(null);
  }, [screenKey, value]);

  const handleNext = () => {
    if (!input.trim() && allowSkip) return onSkip?.();
    const parsed = Number(input.replace(",", "."));
    if (!input.trim() || Number.isNaN(parsed)) return setError(labels.invalid);
    if (parsed < min || parsed > max) return setError(labels.range);
    setError(null);
    onSubmit(parsed);
  };

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div className="mt-12 max-w-xl">
        <label htmlFor={`${screenKey}-input`} className="eyebrow block">
          {labels.measure}
        </label>
        <div className="mt-4 flex items-baseline gap-3 border-b border-border pb-4">
          <input
            id={`${screenKey}-input`}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            aria-describedby={error ? `${screenKey}-error` : `${screenKey}-hint`}
            aria-invalid={Boolean(error)}
            className="w-full min-w-0 bg-transparent font-display text-5xl tracking-[-0.04em] outline-none placeholder:text-muted-foreground/40 focus-visible:outline-none"
          />
          <span aria-hidden="true" className="font-display text-2xl text-muted-foreground">
            {unit}
          </span>
        </div>
        <p id={`${screenKey}-hint`} className="mt-3 text-sm text-muted-foreground">
          {labels.hint}
        </p>
        {error && (
          <p id={`${screenKey}-error`} role="alert" className="mt-3 text-sm text-foreground">
            {error}
          </p>
        )}
        {presets && presets.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setInput(String(preset));
                  setError(null);
                }}
                aria-pressed={Number(input) === preset}
                className={`inline-flex min-h-12 items-center rounded-full border px-6 py-3 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none ${Number(input) === preset ? "border-foreground bg-primary text-primary-foreground" : "border-border hover:border-foreground/40"}`}
              >
                {preset} {unit}
              </button>
            ))}
          </div>
        )}
      </div>
      <DiscoveryNavigation
        locale={locale}
        onBack={onBack}
        onNext={handleNext}
        nextLabel={allowSkip && !input.trim() ? labels.skip : labels.next}
      />
    </ScreenShell>
  );
}
