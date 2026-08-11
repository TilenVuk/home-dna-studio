import { useState, type FormEvent } from "react";
import { Upload, ArrowRight } from "lucide-react";
import { z } from "zod";
import { brand } from "@/content/site";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { Reveal } from "./Reveal";

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-forest";

type ContactData = {
  name: string;
  email: string;
  phone?: string | undefined;
  projectType: string;
  message?: string | undefined;
};

export function Contact({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).contact;
  const schema = z.object({
    name: z.string().trim().min(2, t.validationName).max(100),
    email: z.string().trim().email(t.validationEmail).max(255),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    projectType: z.string().trim().min(1, t.validationProject),
    message: z.string().trim().max(1500).optional().or(z.literal("")),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<string[]>([]);
  const [submittedContact, setSubmittedContact] = useState<ContactData | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
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
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display-lg mt-6 max-w-[14ch]">{t.title}</h2>
            <p className="mt-8 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              {t.intro}
            </p>
            <div className="mt-10 space-y-1 text-sm">
              <p>{brand.email}</p>
              <p>{brand.phone}</p>
              <p className="text-muted-foreground">{getSiteCopy(locale).footer.address}</p>
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
              locale={locale}
              initialConsultationType="home-visit"
              heading={t.bookingHeading}
              description={t.bookingDescription}
            />
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
              <Field label={t.name} htmlFor="contact-name" error={errors["name"]}>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  className={fieldClass}
                  placeholder={t.namePlaceholder}
                />
              </Field>
              <Field label={t.email} htmlFor="contact-email" error={errors["email"]}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={fieldClass}
                  placeholder={t.emailPlaceholder}
                />
              </Field>
              <Field label={t.phone} htmlFor="contact-phone" error={errors["phone"]}>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={fieldClass}
                  placeholder="+386"
                />
              </Field>
              <Field
                label={t.projectType}
                htmlFor="contact-project-type"
                error={errors["projectType"]}
              >
                <select
                  id="contact-project-type"
                  name="projectType"
                  defaultValue=""
                  className={fieldClass}
                >
                  <option value="" disabled>
                    {t.choose}
                  </option>
                  {t.projectTypes.map((projectType) => (
                    <option key={projectType} value={projectType}>
                      {projectType}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.inspiration} htmlFor="contact-inspiration" error={undefined}>
                <label className="flex cursor-pointer items-center gap-3 border-b border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Upload size={16} />
                  {files.length ? t.selectedFiles(files.length) : t.upload}
                  <input
                    id="contact-inspiration"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setFiles(
                        Array.from(e.target.files ?? [])
                          .map((file) => file.name)
                          .slice(0, 10),
                      )
                    }
                  />
                </label>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.message} htmlFor="contact-message" error={errors["message"]}>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    maxLength={1500}
                    className={`${fieldClass} resize-none`}
                    placeholder={t.messagePlaceholder}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  {t.submit} <ArrowRight size={16} />
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
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
