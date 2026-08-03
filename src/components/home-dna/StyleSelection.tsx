import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { VisualChoiceCard } from "./VisualChoiceCard";
import { styleOptions } from "./homeDnaData";

export function StyleSelection({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: string[];
  onChange: (styles: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      setNotice(null);
      onChange(selected.filter((s) => s !== value));
      return;
    }
    if (selected.length >= 2) {
      setNotice("Izberete lahko največ dva sloga.");
      return;
    }
    setNotice(null);
    onChange([...selected, value]);
  };

  return (
    <ScreenShell
      screenKey="style-selection"
      headline="V katerem od teh domov bi si predstavljali živeti tudi čez 15 let?"
      support="Izberete lahko največ dva sloga. Njuno kombinacijo bomo povezali v osebni slogovni profil."
    >
      <div
        role="group"
        aria-label="Izbira sloga"
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {styleOptions.map((option) => (
          <VisualChoiceCard
            key={option.value}
            image={option.image}
            title={option.title}
            description={option.description ?? ""}
            multiSelect
            selected={selected.includes(option.value)}
            onSelect={() => toggle(option.value)}
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
