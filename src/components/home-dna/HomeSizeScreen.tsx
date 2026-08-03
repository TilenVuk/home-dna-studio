import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { floorAreaPresets } from "./homeDnaData";

export function HomeSizeScreen({
  value,
  onSubmit,
  onBack,
}: {
  value?: number;
  onSubmit: (area: number) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState(value ? String(value) : "");
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const parsed = Number(input.replace(",", "."));
    if (!input.trim() || Number.isNaN(parsed)) {
      setError("Vpišite približno površino v m².");
      return;
    }
    if (parsed < 20 || parsed > 600) {
      setError("Vpišite površino med 20 in 600 m².");
      return;
    }
    setError(null);
    onSubmit(Math.round(parsed));
  };

  return (
    <ScreenShell
      screenKey="home-size"
      headline="Kako velik je vaš dom?"
      support="Zadostuje približna površina. Natančne meritve opravimo kasneje."
    >
      <div className="mt-12 max-w-xl">
        <label htmlFor="floor-area" className="eyebrow block">
          Površina doma
        </label>
        <div className="mt-4 flex items-baseline gap-3 border-b border-border pb-4">
          <input
            id="floor-area"
            name="floorArea"
            type="number"
            inputMode="numeric"
            min={20}
            max={600}
            placeholder="120"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            aria-describedby={error ? "floor-area-error" : "floor-area-hint"}
            aria-invalid={error ? true : false}
            className="w-full min-w-0 bg-transparent font-display text-5xl tracking-[-0.04em] outline-none placeholder:text-muted-foreground/40 focus-visible:outline-none"
          />
          <span aria-hidden="true" className="font-display text-2xl text-muted-foreground">
            m²
          </span>
        </div>
        <p id="floor-area-hint" className="mt-3 text-sm text-muted-foreground">
          Priporočeno območje 40–350+ m². Natančnost ni potrebna.
        </p>
        {error && (
          <p id="floor-area-error" role="alert" className="mt-3 text-sm text-foreground">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {floorAreaPresets.map((preset, index) => {
            const isLast = index === floorAreaPresets.length - 1;
            const label = isLast ? `${preset}+ m²` : `${preset} m²`;
            const selected = Number(input) === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setInput(String(preset));
                  setError(null);
                }}
                aria-pressed={selected}
                className={`inline-flex min-h-12 items-center rounded-full border px-6 py-3 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none ${
                  selected
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <DiscoveryNavigation onBack={onBack} onNext={handleNext} />
    </ScreenShell>
  );
}
