import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import type { Locale } from "@/lib/i18n";

const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export function InspirationLink({
  value,
  locale = "sl",
  onSubmit,
  onBack,
}: {
  value?: string;
  locale?: Locale;
  onSubmit: (url?: string) => void;
  onBack: () => void;
}) {
  const [input, setInput] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);
  const copy =
    locale === "hr"
      ? {
          headline: "Imate li već prikupljene ideje?",
          support:
            "Možete dodati poveznicu na Pinterest ploču, Instagram kolekciju, Houzz projekt ili drugu web-stranicu.",
          label: "Poveznica na inspiraciju",
          invalid: "Unesite valjanu web-poveznicu, na primjer https://...",
          none: "Trenutačno još nemam poveznicu",
          note: "Poveznicu ćemo koristiti samo za pripremu vašeg projekta.",
        }
      : locale === "en"
        ? {
            headline: "Have you already collected ideas?",
            support:
              "You can add a link to a Pinterest board, Instagram collection, Houzz project or another website.",
            label: "Inspiration link",
            invalid: "Enter a valid web link, for example https://...",
            none: "I do not have a link yet",
            note: "We will only use the link to prepare your project.",
          }
        : {
            headline: "Imate že zbrane ideje?",
            support:
              "Dodate lahko povezavo do Pinterest table, Instagram zbirke, Houzz projekta ali druge spletne strani.",
            label: "Povezava do navdiha",
            invalid: "Vpišite veljavno spletno povezavo, na primer https://...",
            none: "Trenutno še nimam povezave",
            note: "Povezavo bomo uporabili samo za pripravo vašega projekta.",
          };

  const handleNext = () => {
    const trimmed = input.trim();
    if (!trimmed) return onSubmit(undefined);
    if (!urlPattern.test(trimmed)) return setError(copy.invalid);
    setError(null);
    onSubmit(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  };

  return (
    <ScreenShell screenKey="inspiration" headline={copy.headline} support={copy.support}>
      <div className="mt-12 max-w-xl">
        <label htmlFor="inspiration-url" className="eyebrow block">
          {copy.label}
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
          aria-invalid={Boolean(error)}
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
          {copy.none}
        </button>
        <p id="inspiration-note" className="mt-8 text-sm text-muted-foreground">
          {copy.note}
        </p>
      </div>
      <DiscoveryNavigation locale={locale} onBack={onBack} onNext={handleNext} />
    </ScreenShell>
  );
}
