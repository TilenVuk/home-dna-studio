import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { uiText } from "./homeDnaUiI18n";
import type { Locale } from "@/lib/i18n";

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
  locale = "sl",
  onChoose,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string | undefined;
  options: ChoiceOption[];
  value?: string | undefined;
  locale?: Locale;
  onChoose: (value: string) => void;
  onBack: () => void;
}) {
  const [pending, setPending] = useState<string | undefined>(undefined);

  useEffect(() => setPending(undefined), [screenKey]);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => onChoose(pending), 250);
    return () => clearTimeout(t);
  }, [pending, onChoose]);

  const active = pending ?? value;
  const descriptive = options.some((o) => o.description);
  const localizedHeadline = uiText(locale, headline) ?? headline;
  const localizedSupport = uiText(locale, support);

  return (
    <ScreenShell screenKey={screenKey} headline={localizedHeadline} support={localizedSupport}>
      <div
        role="radiogroup"
        aria-label={localizedHeadline}
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
              className={`min-h-12 border px-7 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${selected ? "border-foreground bg-primary text-primary-foreground" : "border-border hover:border-foreground/40"}`}
            >
              <span className="font-display text-base tracking-[-0.02em]">
                {uiText(locale, option.label) ?? option.label}
              </span>
              {option.description && (
                <span
                  className={`mt-2 block max-w-[60ch] text-sm leading-relaxed ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                >
                  {uiText(locale, option.description) ?? option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <DiscoveryNavigation locale={locale} onBack={onBack} showNext={false} />
    </ScreenShell>
  );
}
