import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { PillChoice } from "./PillChoice";
import { ScreenShell } from "./ScreenShell";

export function MultiSelectScreen({
  screenKey,
  headline,
  support,
  options,
  selected,
  max,
  exclusive,
  limitNotice,
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
      setNotice(limitNotice ?? `Izberete lahko največ ${max}.`);
      return;
    }
    onChange([...base, value]);
  };

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div role="group" aria-label={headline} className="mt-12 flex flex-wrap gap-3">
        {options.map((option) => (
          <PillChoice
            key={option}
            label={option}
            selected={selected.includes(option)}
            onSelect={() => toggle(option)}
          />
        ))}
      </div>

      <p role="status" aria-live="polite" className="mt-6 min-h-6 text-sm text-muted-foreground">
        {notice}
      </p>

      <DiscoveryNavigation onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </ScreenShell>
  );
}
