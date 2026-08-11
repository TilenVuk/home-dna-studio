import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { VisualChoiceCard } from "./VisualChoiceCard";
import { styleOptions } from "./homeDnaData";
import { uiText } from "./homeDnaUiI18n";
import type { Locale } from "@/lib/i18n";

export function StyleSelection({
  selected,
  locale = "sl",
  onChange,
  onNext,
  onBack,
}: {
  selected: string[];
  locale?: Locale;
  onChange: (styles: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const copy = locale === "hr"
    ? { headline: "Koji biste stil mogli zamisliti u odabranim prostorima i za 15 godina?", support: "Možete odabrati najviše dva stila. Njihovu ćemo kombinaciju povezati u osobni stilski profil.", limit: "Možete odabrati najviše dva stila." }
    : locale === "en"
      ? { headline: "Which style could you imagine in the selected spaces 15 years from now?", support: "You can choose up to two styles. We will combine them into a personal style profile.", limit: "You can select up to two styles." }
      : { headline: "Kateri slog bi si predstavljali v izbranih prostorih tudi čez 15 let?", support: "Izberete lahko največ dva sloga. Njuno kombinacijo bomo povezali v osebni slogovni profil.", limit: "Izberete lahko največ dva sloga." };

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      setNotice(null);
      onChange(selected.filter((s) => s !== value));
      return;
    }
    if (selected.length >= 2) return setNotice(copy.limit);
    setNotice(null);
    onChange([...selected, value]);
  };

  return (
    <ScreenShell screenKey="style-selection" headline={copy.headline} support={copy.support}>
      <div role="group" aria-label={copy.headline} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {styleOptions.map((option) => (
          <VisualChoiceCard key={option.value} image={option.image} title={uiText(locale, option.title) ?? option.title} description={uiText(locale, option.description) ?? option.description ?? ""} multiSelect selected={selected.includes(option.value)} onSelect={() => toggle(option.value)} />
        ))}
      </div>
      <p role="status" aria-live="polite" className="mt-6 min-h-6 text-sm text-muted-foreground">{notice}</p>
      <DiscoveryNavigation locale={locale} onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </ScreenShell>
  );
}
