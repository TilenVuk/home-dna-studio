import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { PillChoice } from "./PillChoice";
import { ScreenShell } from "./ScreenShell";
import { atmosphereOptions } from "./homeDnaData";

export function AtmosphereSelection({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      setNotice(null);
      onChange(selected.filter((v) => v !== value));
      return;
    }
    if (selected.length >= 3) {
      setNotice("Izberete lahko največ tri občutke.");
      return;
    }
    setNotice(null);
    onChange([...selected, value]);
  };

  return (
    <ScreenShell
      screenKey="atmosphere"
      headline="Kako želite, da se vaš dom občuti?"
      support="Izberite največ tri občutke, ki naj vodijo oblikovanje prostora."
    >
      <div role="group" aria-label="Občutek doma" className="mt-12 flex flex-wrap gap-3">
        {atmosphereOptions.map((option) => (
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
