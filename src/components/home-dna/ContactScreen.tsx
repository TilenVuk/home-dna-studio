import { useState } from "react";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { ScreenShell } from "./ScreenShell";
import { TurnstileWidget } from "./TurnstileWidget";
import type { ContactState } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const fieldClass =
  "mt-3 w-full border-b border-border bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground/50 focus:border-foreground";
const turnstileSiteKey = import.meta.env["VITE_TURNSTILE_SITE_KEY"] ?? "";

const copy = {
  sl: {
    eyebrow: "Zadnji korak",
    headline: "Kam naj pošljemo vaš Home DNA™ Report?",
    support:
      "Po oddaji prejmete osebni Home DNA™ Report in okvirno ponudbo glede na izbrane prostore, obseg, materiale in nivo izvedbe. Okvirna ponudba je informativna; končna ponudba sledi po posvetu, izmerah in potrditvi specifikacije.",
    what: "Kaj prejmete:",
    whatBody:
      "osebni PDF z vašimi priporočili, okvirno ponudbo in jasno osnovo za nadaljnji posvet z Nuveli Studio.",
    name: "Ime in priimek",
    email: "E-naslov",
    phone: "Telefon (neobvezno)",
    consent:
      "Strinjam se, da Nuveli Studio moje podatke uporabi za pripravo in dostavo Home DNA™ Reporta ter stik v zvezi z mojim projektom.",
    next: "Pripravi report in okvirno ponudbo",
    errors: {
      name: "Vpišite svoje ime.",
      email: "Vpišite veljaven e-naslov.",
      consent: "Za pripravo poročila potrebujemo vaše soglasje.",
      config: "Varnostna zaščita obrazca ni konfigurirana.",
      verify: "Počakajte, da se varnostno preverjanje zaključi.",
      widget: "Varnostnega preverjanja ni bilo mogoče naložiti.",
    },
  },
  hr: {
    eyebrow: "Posljednji korak",
    headline: "Gdje da pošaljemo vaš Home DNA™ Report?",
    support:
      "Nakon slanja dobivate osobni Home DNA™ Report i okvirnu ponudu prema odabranim prostorima, opsegu, materijalima i razini izvedbe. Okvirna ponuda je informativna; konačna ponuda slijedi nakon konzultacija, izmjera i potvrde specifikacije.",
    what: "Što dobivate:",
    whatBody:
      "osobni PDF s preporukama, okvirnu ponudu i jasnu osnovu za daljnje konzultacije s Nuveli Studio.",
    name: "Ime i prezime",
    email: "E-mail",
    phone: "Telefon (neobavezno)",
    consent:
      "Slažem se da Nuveli Studio koristi moje podatke za pripremu i dostavu Home DNA™ Reporta te kontakt vezan uz moj projekt.",
    next: "Pripremi report i okvirnu ponudu",
    errors: {
      name: "Unesite svoje ime.",
      email: "Unesite valjanu e-mail adresu.",
      consent: "Za pripremu izvještaja potrebna je vaša suglasnost.",
      config: "Sigurnosna zaštita obrasca nije konfigurirana.",
      verify: "Pričekajte da sigurnosna provjera završi.",
      widget: "Sigurnosnu provjeru nije bilo moguće učitati.",
    },
  },
  en: {
    eyebrow: "Final step",
    headline: "Where should we send your Home DNA™ Report?",
    support:
      "After submitting, you receive a personal Home DNA™ Report and an indicative proposal based on the selected rooms, scope, materials and execution level. The indicative proposal is informative; the final quotation follows consultation, measurements and confirmed specifications.",
    what: "What you receive:",
    whatBody:
      "a personal PDF with recommendations, an indicative proposal and a clear basis for the next consultation with Nuveli Studio.",
    name: "Full name",
    email: "Email",
    phone: "Phone (optional)",
    consent:
      "I agree that Nuveli Studio may use my data to prepare and deliver the Home DNA™ Report and contact me about my project.",
    next: "Prepare report and indicative proposal",
    errors: {
      name: "Enter your name.",
      email: "Enter a valid email address.",
      consent: "We need your consent to prepare the report.",
      config: "Form security is not configured.",
      verify: "Wait for the security check to finish.",
      widget: "The security check could not be loaded.",
    },
  },
} as const;

export function ContactScreen({
  value,
  locale = "sl",
  onSubmit,
  onBack,
}: {
  value: ContactState;
  locale?: Locale;
  onSubmit: (contact: ContactState) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<ContactState>({ ...value, turnstileToken: "" });
  const [error, setError] = useState<string | null>(null);
  const t = copy[locale];
  const set = (patch: Partial<ContactState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  };
  const handleNext = () => {
    if (!form.name.trim()) return setError(t.errors.name);
    if (!emailPattern.test(form.email.trim())) return setError(t.errors.email);
    if (!form.consent) return setError(t.errors.consent);
    if (!turnstileSiteKey) return setError(t.errors.config);
    if (!form.turnstileToken) return setError(t.errors.verify);
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      consent: true,
      turnstileToken: form.turnstileToken,
    });
  };

  return (
    <ScreenShell screenKey="contact" eyebrow={t.eyebrow} headline={t.headline} support={t.support}>
      <div className="mt-12 max-w-xl">
        <div className="mb-10 border-y border-border py-5 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">{t.what}</strong> {t.whatBody}
        </div>
        <label htmlFor="contact-name" className="eyebrow block">
          {t.name}
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
          {t.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={(e) => set({ email: e.target.value })}
          className={fieldClass}
        />
        <label htmlFor="contact-phone" className="eyebrow mt-10 block">
          {t.phone}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
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
          <span>{t.consent}</span>
        </label>
        <div className="mt-8">
          {turnstileSiteKey ? (
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onVerify={(turnstileToken) => set({ turnstileToken })}
              onError={() => setError(t.errors.widget)}
            />
          ) : (
            <p className="text-sm text-foreground">{t.errors.config}</p>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-6 text-sm text-foreground">
            {error}
          </p>
        )}
      </div>
      <DiscoveryNavigation locale={locale} onBack={onBack} onNext={handleNext} nextLabel={t.next} />
    </ScreenShell>
  );
}
