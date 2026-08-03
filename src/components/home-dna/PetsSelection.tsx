import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { PillChoice } from "./PillChoice";
import { ScreenShell } from "./ScreenShell";
import { petOptions } from "./homeDnaData";
import type { PetKey } from "./homeDnaTypes";

export function PetsSelection({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: PetKey[];
  onChange: (pets: PetKey[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (key: PetKey) => {
    if (key === "none") {
      onChange(selected.includes("none") ? [] : ["none"]);
      return;
    }
    const base = selected.filter((p) => p !== "none");
    if (base.includes(key)) {
      onChange(base.filter((p) => p !== key));
      return;
    }
    if (base.length >= 3) return;
    onChange([...base, key]);
  };

  return (
    <ScreenShell
      screenKey="pets"
      headline="Ali bo dom prilagojen tudi hišnim ljubljenčkom?"
      support="Vključimo lahko prostor za hrano, opremo, čiščenje in vsakodnevne rutine."
    >
      <div role="group" aria-label="Hišni ljubljenčki" className="mt-12 flex flex-wrap gap-3">
        {petOptions.map((option) => (
          <PillChoice
            key={option.value}
            label={option.label}
            selected={selected.includes(option.value)}
            onSelect={() => toggle(option.value)}
          />
        ))}
      </div>

      <DiscoveryNavigation onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </ScreenShell>
  );
}
