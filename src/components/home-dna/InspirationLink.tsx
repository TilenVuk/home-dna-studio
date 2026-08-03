import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";

const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export function InspirationLink({
  value,
  onSubmit,
  onBack,
}: {
  value?: string;
  onSubmit: (url?: string) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      onSubmit(undefined);
      return;
    }
    if (!urlPattern.test(trimmed)) {
      setError("Vpišite veljavno spletno povezavo, na primer https://...");
      return;
    }
    setError(null);
    onSubmit(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  };

  return (
    <ScreenShell
      screenKey="inspiration"
      headline="Imate že zbrane ideje?"
      support="Dodate lahko povezavo do Pinterest table, Instagram zbirke, Houzz projekta ali druge spletne strani."
    >
      <div className="mt-12 max-w-xl">
        <label htmlFor="inspiration-url" className="eyebrow block">
          Povezava do navdiha
        </label>
        <input
          id="inspiration-url"
          name="inspirationUrl"
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          aria-invalid={error ? true : false}
          aria-describedby={error ? "inspiration-error" : "inspiration-note"}
          className="mt-4 w-full border-b border-border bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
        />
        {error && (
          <p id="inspiration-error" role="alert" className="mt-3 text-sm text-foreground">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setInput("");
            setError(null);
            onSubmit(undefined);
          }}
          className="mt-6 inline-flex min-h-12 items-center text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          Trenutno še nimam povezave
        </button>

        <p id="inspiration-note" className="mt-8 text-sm text-muted-foreground">
          Povezavo bomo uporabili samo za pripravo vašega projekta.
        </p>
      </div>

      <DiscoveryNavigation onBack={onBack} onNext={handleNext} />
    </ScreenShell>
  );
}
