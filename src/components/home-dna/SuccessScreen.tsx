import { useState } from "react";
import { Check, Loader2, MailWarning } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { HomeDnaReport, type HomeDnaDeliveryState } from "./HomeDnaReport";
import type { HomeDnaState } from "./homeDnaTypes";

export function SuccessScreen({ name, state }: { name?: string; state: HomeDnaState }) {
  const [deliveryState, setDeliveryState] = useState<HomeDnaDeliveryState>("processing");

  const heading =
    deliveryState === "sent"
      ? `${name ? `Hvala, ${name}.` : "Hvala."} Vaš Home DNA™ je poslan.`
      : deliveryState === "delivery-error"
        ? "Poročilo je pripravljeno, pošiljanje pa ni uspelo."
        : deliveryState === "generation-error"
          ? "Poročila trenutno ni bilo mogoče pripraviti."
          : "Pripravljamo vaš Home DNA™ Report.";

  const body =
    deliveryState === "sent"
      ? `Poročilo smo poslali na ${state.contact.email}. PDF lahko prenesete tudi neposredno na tej strani.`
      : deliveryState === "delivery-error"
        ? "Vaši odgovori so ostali na tej strani. Spodaj lahko prenesete PDF in ponovno poskusite s pošiljanjem."
        : deliveryState === "generation-error"
          ? "Vaši odgovori so ostali na tej strani. Spodaj lahko ponovno poskusite brez ponovnega izpolnjevanja obrazca."
          : "Na podlagi vaših odgovorov pripravljamo osebno analizo doma, oblikovalske smernice in okvirno oceno investicije.";

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
              Priprava PDF-ja in pošiljanje e-pošte lahko trajata do dve minuti.
            </p>
          )}

          {(deliveryState === "delivery-error" || deliveryState === "generation-error") && (
            <p className="mt-10 flex items-start gap-3 text-sm text-muted-foreground">
              <MailWarning size={17} className="mt-0.5 shrink-0" />
              Obrazca ni treba izpolniti ponovno.
            </p>
          )}

          {deliveryState === "sent" && (
            <>
              <ul className="mt-10">
                {[
                  "Home DNA™ oddaja je varno zabeležena",
                  "Osebni PDF je poslan na vaš e-naslov",
                  "Nuveli Studio je prejel povzetek projekta",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-border py-4 text-sm last:border-b"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-oak" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-sm text-muted-foreground">
                Če želite, lahko termin za pogovor izberete takoj.
              </p>
            </>
          )}
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <img
            src={heroInterior}
            alt="Miren sodoben interier z izdelano hrastovo opremo"
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

      <HomeDnaReport state={state} onDeliveryStateChange={setDeliveryState} />
    </>
  );
}
