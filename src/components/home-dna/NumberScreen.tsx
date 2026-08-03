import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";

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
  onSkip?: () => void;
  onSubmit: (value: number) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState(value !== undefined ? String(value) : "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInput(value !== undefined ? String(value) : "");
    setError(null);
  }, [screenKey, value]);

  const handleNext = () => {
    if (!input.trim() && allowSkip) {
      onSkip?.();
      return;
    }
    const parsed = Number(input.replace(",", "."));
    if (!input.trim() || Number.isNaN(parsed)) {
      setError(`Vpišite približno mero v ${unit}.`);
      return;
    }
    if (parsed < min || parsed > max) {
      setError(`Vpišite vrednost med ${min} in ${max} ${unit}.`);
      return;
    }
    setError(null);
    onSubmit(parsed);
  };

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div className="mt-12 max-w-xl">
        <label htmlFor={`${screenKey}-input`} className="eyebrow block">
          Približna mera
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
            aria-invalid={error ? true : false}
            className="w-full min-w-0 bg-transparent font-display text-5xl tracking-[-0.04em] outline-none placeholder:text-muted-foreground/40 focus-visible:outline-none"
          />
          <span aria-hidden="true" className="font-display text-2xl text-muted-foreground">
            {unit}
          </span>
        </div>
        <p id={`${screenKey}-hint`} className="mt-3 text-sm text-muted-foreground">
          Območje {min}–{max} {unit}. Natančnost ni potrebna.
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
                className={`inline-flex min-h-12 items-center rounded-full border px-6 py-3 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none ${
                  Number(input) === preset
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                {preset} {unit}
              </button>
            ))}
          </div>
        )}
      </div>

      <DiscoveryNavigation
        onBack={onBack}
        onNext={handleNext}
        nextLabel={allowSkip && !input.trim() ? "Preskoči" : "Naprej"}
      />
    </ScreenShell>
  );
}
