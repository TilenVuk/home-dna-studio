import { useEffect, useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { VisualChoiceCard } from "./VisualChoiceCard";
import type { VisualOption } from "./homeDnaTypes";

export function SingleVisualChoiceScreen<T extends string>({
  screenKey,
  headline,
  support,
  options,
  value,
  onChoose,
  onBack,
  columns = "three",
}: {
  screenKey: string;
  headline: string;
  support?: string;
  options: VisualOption<T>[];
  value?: T;
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

  const grid =
    columns === "two"
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div role="radiogroup" aria-label={headline} className={`mt-12 grid gap-5 ${grid}`}>
        {options.map((option) => (
          <VisualChoiceCard
            key={option.value}
            image={option.image}
            title={option.title}
            description={option.description ?? ""}
            selected={(pending ?? value) === option.value}
            onSelect={() => setPending(option.value)}
          />
        ))}
      </div>
      <DiscoveryNavigation onBack={onBack} showNext={false} />
    </ScreenShell>
  );
}
