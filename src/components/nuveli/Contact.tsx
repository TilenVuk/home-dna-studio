import { useState, type FormEvent } from "react";
import { Upload, ArrowRight } from "lucide-react";
import { z } from "zod";
import { brand } from "@/content/site";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { Reveal } from "./Reveal";

const schema = z.object({
  name: z.string().trim().min(2, "Vnesite svoje ime").max(100),
  email: z.string().trim().email("Vnesite veljaven e-naslov").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.string().trim().min(1, "Izberite vrsto projekta"),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

const projectTypes = [
  "Opremljanje celotnega doma",
  "Kuhinja",
  "Garderobna omara",
  "Pohodna garderoba",
  "Kopalniško pohištvo",
  "Dnevni prostor",
];

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-forest";

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<string[]>([]);
  const [submittedContact, setSubmittedContact] = useState<z.infer<typeof schema> | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmittedContact(parsed.data);
  };

  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow">Kontakt</p>
            <h2 className="display-lg mt-6 max-w-[14ch]">Začnimo pri vašem življenju</h2>
            <p className="mt-8 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              Povejte nam, kako živite. Odgovorimo v dveh delovnih dneh in se dogovorimo za osebni
              pogovor.
            </p>
            <div className="mt-10 space-y-1 text-sm">
              <p>{brand.email}</p>
              <p>{brand.phone}</p>
              <p className="text-muted-foreground">{brand.address}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100} className="lg:col-span-8">
          {submittedContact ? (
            <BookingCalendar
              contact={{
                name: submittedContact.name,
                email: submittedContact.email,
                phone: submittedContact.phone ?? "",
                projectType: submittedContact.projectType,
                message: submittedContact.message ?? "",
              }}
              source="contact"
              initialConsultationType="home-visit"
              heading="Izberite termin za osebni pogovor"
              description="Vaši kontaktni podatki so pripravljeni. Za dokončanje rezervacije izberite način srečanja, datum in uro."
            />
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
              <Field label="Ime" error={errors["name"]}>
                <input name="name" className={fieldClass} placeholder="Vaše ime in priimek" />
              </Field>
              <Field label="E-pošta" error={errors["email"]}>
                <input
                  name="email"
                  type="email"
                  className={fieldClass}
                  placeholder="vi@epošta.si"
                />
              </Field>
              <Field label="Telefon" error={errors["phone"]}>
                <input name="phone" className={fieldClass} placeholder="+386" />
              </Field>
              <Field label="Vrsta projekta" error={errors["projectType"]}>
                <select name="projectType" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Izberite
                  </option>
                  {projectTypes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Slike za navdih" error={undefined}>
                <label className="flex cursor-pointer items-center gap-3 border-b border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Upload size={16} />
                  {files.length ? `Izbranih datotek: ${files.length}` : "Naložite slike"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setFiles(
                        Array.from(e.target.files ?? [])
                          .map((f) => f.name)
                          .slice(0, 10),
                      )
                    }
                  />
                </label>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Sporočilo" error={errors["message"]}>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1500}
                    className={`${fieldClass} resize-none`}
                    placeholder="Povejte nam o svojem domu, časovnici in kaj želite rešiti."
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Nadaljujte na izbiro termina <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="eyebrow">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
