import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { VisualChoiceCard } from "./VisualChoiceCard";
import { uiText } from "./homeDnaUiI18n";
import type { VisualOption } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

export function SingleVisualChoiceScreen<T extends string>({
  screenKey,
  headline,
  support,
  options,
  value,
  locale = "sl",
  onChoose,
  onBack,
  columns = "three",
}: {
  screenKey: string;
  headline: string;
  support?: string;
  options: VisualOption<T>[];
  value?: T;
  locale?: Locale;
  onChoose: (value: T) => void;
  onBack: () => void;
  columns?: "two" | "three";
}) {
  const [pending, setPending] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => onChoose(pending), 250);
    return () => clearTimeout(t);
  }, [pending, onChoose]);

  const grid = columns === "two" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  const localizedHeadline = uiText(locale, headline) ?? headline;

  return (
    <ScreenShell
      screenKey={screenKey}
      headline={localizedHeadline}
      support={uiText(locale, support)}
    >
      <div role="radiogroup" aria-label={localizedHeadline} className={`mt-12 grid gap-5 ${grid}`}>
        {options.map((option) => (
          <VisualChoiceCard
            key={option.value}
            image={option.image}
            title={uiText(locale, option.title) ?? option.title}
            description={uiText(locale, option.description) ?? option.description ?? ""}
            {...(option.badge ? { badge: uiText(locale, option.badge) ?? option.badge } : {})}
            selected={(pending ?? value) === option.value}
            onSelect={() => setPending(option.value)}
          />
        ))}
      </div>
      <DiscoveryNavigation locale={locale} onBack={onBack} showNext={false} />
    </ScreenShell>
  );
}
