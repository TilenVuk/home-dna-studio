import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";

export function NoteScreen({
  screenKey,
  headline,
  support,
  value,
  maxLength = 300,
  onSubmit,
  onBack,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  value?: string | undefined;
  maxLength?: number;
  onSubmit: (value: string) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState(value ?? "");

  return (
    <ScreenShell screenKey={screenKey} headline={headline} support={support}>
      <div className="mt-12 max-w-2xl">
        <label htmlFor={`${screenKey}-note`} className="eyebrow block">
          Vaš zapis
        </label>
        <textarea
          id={`${screenKey}-note`}
          rows={4}
          maxLength={maxLength}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 w-full resize-none border-b border-border bg-transparent pb-4 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/40 focus-visible:outline-none"
          placeholder="Na kratko opišite, kaj bi radi izboljšali."
        />
        <p className="mt-3 text-sm text-muted-foreground">
          {text.length} / {maxLength}
        </p>
      </div>

      <DiscoveryNavigation
        onBack={onBack}
        onNext={() => onSubmit(text.trim())}
        nextLabel={text.trim() ? "Naprej" : "Preskoči"}
      />
    </ScreenShell>
  );
}
