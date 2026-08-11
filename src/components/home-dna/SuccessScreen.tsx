import { useState } from "react";
import { Check, Loader2, MailWarning } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { HomeDnaReport, type HomeDnaDeliveryState } from "./HomeDnaReport";
import type { HomeDnaState } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

const copy = {
  sl: {
    thanks: "Hvala",
    sent: "Vaš Home DNA™ je poslan.",
    deliveryError: "Poročilo je pripravljeno, pošiljanje pa ni uspelo.",
    generationError: "Poročila trenutno ni bilo mogoče pripraviti.",
    processing: "Pripravljamo vaš Home DNA™ Report.",
    sentBody: (email: string) =>
      `Poročilo in okvirno oceno investicije smo poslali na ${email}. PDF lahko prenesete tudi neposredno na tej strani.`,
    deliveryBody:
      "Vaši odgovori so ostali na tej strani. Spodaj lahko prenesete PDF in ponovno poskusite s pošiljanjem.",
    generationBody:
      "Vaši odgovori so ohranjeni. Vrnite se samo na zadnji korak in ponovno opravite varnostno preverjanje.",
    processingBody:
      "Na podlagi vaših odgovorov pripravljamo osebno analizo doma, oblikovalske smernice in okvirno oceno investicije.",
    wait: "Pripravljamo PDF in e-pošto.",
    noRepeat: "Obrazca ni treba izpolniti ponovno.",
    items: [
      "Home DNA™ oddaja je varno zabeležena",
      "Osebni PDF in ocena investicije sta poslana na vaš e-naslov",
      "Nuveli Studio je prejel povzetek projekta",
    ],
    booking: "Če želite, lahko termin za pogovor izberete takoj.",
    alt: "Miren sodoben interier z izdelano hrastovo opremo",
  },
  hr: {
    thanks: "Hvala",
    sent: "Vaš Home DNA™ je poslan.",
    deliveryError: "Izvještaj je pripremljen, ali slanje nije uspjelo.",
    generationError: "Izvještaj trenutačno nije moguće pripremiti.",
    processing: "Pripremamo vaš Home DNA™ Report.",
    sentBody: (email: string) =>
      `Izvještaj i okvirnu procjenu investicije poslali smo na ${email}. PDF možete preuzeti i izravno na ovoj stranici.`,
    deliveryBody:
      "Vaši su odgovori sačuvani. PDF možete preuzeti ispod i ponovno pokušati poslati poruku.",
    generationBody:
      "Vaši su odgovori sačuvani. Vratite se samo na posljednji korak i ponovite sigurnosnu provjeru.",
    processingBody:
      "Na temelju vaših odgovora pripremamo osobnu analizu doma, smjernice za dizajn i okvirnu procjenu investicije.",
    wait: "Pripremamo PDF i e-mail.",
    noRepeat: "Obrazac nije potrebno ponovno ispunjavati.",
    items: [
      "Home DNA™ prijava je sigurno zabilježena",
      "Osobni PDF i procjena investicije poslani su na vaš e-mail",
      "Nuveli Studio je primio sažetak projekta",
    ],
    booking: "Ako želite, možete odmah odabrati termin za razgovor.",
    alt: "Miran suvremen interijer s namještajem po mjeri",
  },
  en: {
    thanks: "Thank you",
    sent: "Your Home DNA™ has been sent.",
    deliveryError: "Your report is ready, but email delivery failed.",
    generationError: "We could not prepare the report right now.",
    processing: "We are preparing your Home DNA™ Report.",
    sentBody: (email: string) =>
      `We sent the report and indicative investment estimate to ${email}. You can also download the PDF directly from this page.`,
    deliveryBody:
      "Your answers are preserved on this page. You can download the PDF below and retry email delivery.",
    generationBody:
      "Your answers are preserved. Return only to the final step and complete the security check again.",
    processingBody:
      "Based on your answers, we are preparing a personal home analysis, design guidance and an indicative investment estimate.",
    wait: "Preparing the PDF and email.",
    noRepeat: "You do not need to complete the form again.",
    items: [
      "Your Home DNA™ submission is securely recorded",
      "Your personal PDF and investment estimate have been sent by email",
      "Nuveli Studio has received the project summary",
    ],
    booking: "You can choose a consultation time now if you wish.",
    alt: "Calm contemporary interior with bespoke furniture",
  },
} as const;

export function SuccessScreen({
  name,
  state,
  locale = "sl",
  onBack,
}: {
  name?: string;
  state: HomeDnaState;
  locale?: Locale;
  onBack: () => void;
}) {
  const [deliveryState, setDeliveryState] = useState<HomeDnaDeliveryState>("processing");
  const t = copy[locale];
  const heading =
    deliveryState === "sent"
      ? `${name ? `${t.thanks}, ${name}.` : `${t.thanks}.`} ${t.sent}`
      : deliveryState === "delivery-error"
        ? t.deliveryError
        : deliveryState === "generation-error"
          ? t.generationError
          : t.processing;
  const body =
    deliveryState === "sent"
      ? t.sentBody(state.contact.email)
      : deliveryState === "delivery-error"
        ? t.deliveryBody
        : deliveryState === "generation-error"
          ? t.generationBody
          : t.processingBody;

  return (
    <>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <p className="eyebrow">Home DNA™</p>
          <h1 className="display-lg mt-6 max-w-[20ch]">{heading}</h1>
          <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            {body}
          </p>
          {deliveryState === "processing" && (
            <p className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 size={17} className="animate-spin" />
              {t.wait}
            </p>
          )}
          {(deliveryState === "delivery-error" || deliveryState === "generation-error") && (
            <p className="mt-10 flex items-start gap-3 text-sm text-muted-foreground">
              <MailWarning size={17} className="mt-0.5 shrink-0" />
              {t.noRepeat}
            </p>
          )}
          {deliveryState === "sent" && (
            <>
              <ul className="mt-10">
                {t.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-border py-4 text-sm last:border-b"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-oak" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-sm text-muted-foreground">{t.booking}</p>
            </>
          )}
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <img
            src={heroInterior}
            alt={t.alt}
            width={1920}
            height={1200}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover md:aspect-[4/3] lg:aspect-[4/5]"
          />
        </div>
      </div>
      {deliveryState === "sent" && (
        <BookingCalendar
          className="mt-20"
          contact={{
            name: state.contact.name,
            email: state.contact.email,
            phone: state.contact.phone,
            projectType: "Home DNA™ Discovery",
          }}
          source="home-dna"
        />
      )}
      <HomeDnaReport
        state={state}
        locale={locale}
        onDeliveryStateChange={setDeliveryState}
        onRequireNewVerification={onBack}
      />
    </>
  );
}
