import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { PillChoice } from "./PillChoice";
import { ScreenShell } from "./ScreenShell";
import { uiText } from "./homeDnaUiI18n";
import type { Locale } from "@/lib/i18n";

export function MultiSelectScreen({
  screenKey,
  headline,
  support,
  options,
  selected,
  max,
  exclusive,
  limitNotice,
  locale = "sl",
  onChange,
  onNext,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  options: string[];
  selected: string[];
  max?: number;
  exclusive?: string;
  limitNotice?: string;
  locale?: Locale;
  onChange: (values: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);

  const toggle = (value: string) => {
    setNotice(null);
    if (exclusive && value === exclusive) {
      onChange(selected.includes(exclusive) ? [] : [exclusive]);
      return;
    }
    const base = exclusive ? selected.filter((v) => v !== exclusive) : selected;
    if (base.includes(value)) {
      onChange(base.filter((v) => v !== value));
      return;
    }
    if (max && base.length >= max) {
      const fallback = locale === "hr" ? `Možete odabrati najviše ${max}.` : locale === "en" ? `You can select up to ${max}.` : `Izberete lahko največ ${max}.`;
      setNotice(uiText(locale, limitNotice) ?? fallback);
      return;
    }
    onChange([...base, value]);
  };

  const localizedHeadline = uiText(locale, headline) ?? headline;
  return (
    <ScreenShell screenKey={screenKey} headline={localizedHeadline} support={uiText(locale, support)}>
      <div role="group" aria-label={localizedHeadline} className="mt-12 flex flex-wrap gap-3">
        {options.map((option) => (
          <PillChoice
            key={option}
            label={uiText(locale, option) ?? option}
            selected={selected.includes(option)}
            onSelect={() => toggle(option)}
          />
        ))}
      </div>
      <p role="status" aria-live="polite" className="mt-6 min-h-6 text-sm text-muted-foreground">{notice}</p>
      <DiscoveryNavigation locale={locale} onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </ScreenShell>
  );
}
