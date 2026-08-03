import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

export function ChoiceScreen({
  screenKey,
  headline,
  support,
  options,
  value,
  onChoose,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string | undefined;
  options: ChoiceOption[];
  value?: string | undefined;
  onChoose: (value: string) => void;
  onBack: () => void;
}) {
  const [pending, setPending] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPending(undefined);
  }, [screenKey]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => onChoose(pending), 250);
    return () => clearTimeout(t);
  }, [pending, onChoose]);

  const active = pending ?? value;
  const descriptive = options.some((o) => o.description);

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div
        role="radiogroup"
        aria-label={headline}
        className={`mt-12 grid gap-4 ${descriptive ? "" : "sm:grid-cols-2 lg:grid-cols-4"}`}
      >
        {options.map((option) => {
          const selected = active === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPending(option.value)}
              className={`min-h-12 border px-7 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
                selected
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border hover:border-foreground/40"
              }`}
            >
              <span className="font-display text-base tracking-[-0.02em]">{option.label}</span>
              {option.description && (
                <span
                  className={`mt-2 block max-w-[60ch] text-sm leading-relaxed ${
                    selected ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <DiscoveryNavigation onBack={onBack} showNext={false} />
    </ScreenShell>
  );
}
