import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import type { Locale } from "@/lib/i18n";

export function NoteScreen({
  screenKey,
  headline,
  support,
  value,
  maxLength = 300,
  locale = "sl",
  onSubmit,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  value?: string | undefined;
  maxLength?: number;
  locale?: Locale;
  onSubmit: (value: string) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState(value ?? "");
  const labels = locale === "hr"
    ? { label: "Vaša napomena", placeholder: "Ukratko opišite što biste željeli poboljšati.", next: "Dalje", skip: "Preskoči" }
    : locale === "en"
      ? { label: "Your note", placeholder: "Briefly describe what you would like to improve.", next: "Next", skip: "Skip" }
      : { label: "Vaš zapis", placeholder: "Na kratko opišite, kaj bi radi izboljšali.", next: "Naprej", skip: "Preskoči" };

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div className="mt-12 max-w-2xl">
        <label htmlFor={`${screenKey}-note`} className="eyebrow block">{labels.label}</label>
        <textarea id={`${screenKey}-note`} rows={4} maxLength={maxLength} value={text} onChange={(e) => setText(e.target.value)} className="mt-4 w-full resize-none border-b border-border bg-transparent pb-4 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/40 focus-visible:outline-none" placeholder={labels.placeholder} />
        <p className="mt-3 text-sm text-muted-foreground">{text.length} / {maxLength}</p>
      </div>
      <DiscoveryNavigation locale={locale} onBack={onBack} onNext={() => onSubmit(text.trim())} nextLabel={text.trim() ? labels.next : labels.skip} />
    </ScreenShell>
  );
}
