import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";

export function OptionListScreen({
  screenKey,
  headline,
  support,
  options,
  value,
  onChoose,
  onBack,
  large = false,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChoose: (value: string) => void;
  onBack: () => void;
  large?: boolean;
}) {
  const [pending, setPending] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => onChoose(pending), 250);
    return () => clearTimeout(t);
  }, [pending, onChoose]);

  const active = pending ?? value;

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div
        role="radiogroup"
        aria-label={headline}
        className={`mt-12 grid gap-4 ${
          large ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-3"
        }`}
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
              className={`flex min-h-12 items-center justify-center border px-6 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
                large ? "aspect-square" : "py-6"
              } ${
                selected
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border hover:border-foreground/40"
              }`}
            >
              <span
                className={
                  large
                    ? "font-display text-3xl tracking-[-0.03em]"
                    : "font-display text-base tracking-[-0.02em]"
                }
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      <DiscoveryNavigation onBack={onBack} showNext={false} />
    </ScreenShell>
  );
}
