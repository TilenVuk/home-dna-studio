import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import type { ContactState } from "./homeDnaTypes";

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const fieldClass =
  "mt-3 w-full border-b border-border bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground/50 focus:border-foreground";

export function ContactScreen({
  value,
  onSubmit,
  onBack,
}: {
  value: ContactState;
  onSubmit: (contact: ContactState) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<ContactState>(value);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<ContactState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const handleNext = () => {
    if (!form.name.trim()) {
      setError("Vpišite svoje ime.");
      return;
    }
    if (!emailPattern.test(form.email.trim())) {
      setError("Vpišite veljaven e-naslov.");
      return;
    }
    if (!form.consent) {
      setError("Za pripravo poročila potrebujemo vaše soglasje.");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      consent: true,
    });
  };

  return (
    <ScreenShell
      screenKey="contact"
      eyebrow="Zadnji korak"
      headline="Kam naj pošljemo vaš Home DNA™ Report?"
      support="Poročilo bomo pripravili na podlagi vaših odgovorov in ga poslali na navedeni e-naslov."
    >
      <div className="mt-12 max-w-xl">
        <label htmlFor="contact-name" className="eyebrow block">
          Ime in priimek
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          className={fieldClass}
        />

        <label htmlFor="contact-email" className="eyebrow mt-10 block">
          E-naslov
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ime@primer.si"
          value={form.email}
          onChange={(e) => set({ email: e.target.value })}
          className={fieldClass}
        />

        <label htmlFor="contact-phone" className="eyebrow mt-10 block">
          Telefon (neobvezno)
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+386"
          value={form.phone}
          onChange={(e) => set({ phone: e.target.value })}
          className={fieldClass}
        />

        <label className="mt-10 flex cursor-pointer items-start gap-4 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={(e) => set({ consent: e.target.checked })}
            className="mt-1 size-4 shrink-0 accent-[currentColor]"
          />
          <span>
            Strinjam se, da Nuveli Studio moje podatke uporabi za pripravo in dostavo Home DNA™
            Reporta ter stik v zvezi z mojim projektom.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-6 text-sm text-foreground">
            {error}
          </p>
        )}
      </div>

      <DiscoveryNavigation onBack={onBack} onNext={handleNext} nextLabel="Pripravi in pošlji" />
    </ScreenShell>
  );
}
