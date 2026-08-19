import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { generateHomeDnaReport, type HomeDnaReport as Report } from "@/lib/homeDnaReport.functions";
import { submitHomeDna } from "@/lib/homeDnaSubmission.functions";
import { buildReportInput } from "./reportSummary";
import { generateHomeDnaPdf, downloadBlob } from "./reportPdf";
import { resolveReportImages, type ReportImageAsset } from "./reportImages";
import { formatEuro } from "./pricing";
import type { HomeDnaState } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";
import { useAnalytics } from "@/lib/useAnalytics";

export type HomeDnaDeliveryState = "processing" | "sent" | "generation-error" | "delivery-error";

const copy = {
  sl: {
    studioDelivery:
      "Poročilo smo poslali na vaš e-naslov, obvestila studiu pa trenutno ni bilo mogoče dostaviti.",
    delivery: "Poročilo je pripravljeno, vendar ga trenutno ni bilo mogoče poslati po e-pošti.",
    generation: "Poročila trenutno ni bilo mogoče pripraviti.",
    pdfGeneration: "PDF-ja trenutno ni bilo mogoče pripraviti.",
    pdfCreate: "PDF-ja trenutno ni bilo mogoče ustvariti.",
    verify: "Nazaj na varnostno preverjanje",
    preparing: "Pripravljamo vaš Home DNA™ Report in e-pošto …",
    sending: (email: string) => `Poročilo pošiljamo na ${email} …`,
    retryInfo: "PDF lahko prenesete takoj, pošiljanje pa lahko varno poskusite ponovno.",
    retry: "Ponovno pošlji",
    preparingPdf: "Pripravljamo PDF ...",
    download: "Prenesi Home DNA™ Report (PDF)",
    consultation: "Po posvetu",
    sections: [
      "Dobrodošli v vašem Home DNA™",
      "Vaš življenjski slog",
      "Vaš slog",
      "Zakaj bo ta dom deloval za vas",
      "Priporočila za izbrane prostore",
      "Okvirna investicija",
      "Naslednji koraki",
    ],
    estimated: "Ocenjena investicija",
    level: "Raven izvedbe",
  },
  hr: {
    studioDelivery:
      "Izvještaj smo poslali na vaš e-mail, ali obavijest studiju trenutačno nije bilo moguće dostaviti.",
    delivery: "Izvještaj je pripremljen, ali ga trenutačno nije moguće poslati e-mailom.",
    generation: "Izvještaj trenutačno nije moguće pripremiti.",
    pdfGeneration: "PDF trenutačno nije moguće pripremiti.",
    pdfCreate: "PDF trenutačno nije moguće izraditi.",
    verify: "Natrag na sigurnosnu provjeru",
    preparing: "Pripremamo vaš Home DNA™ Report i e-mail …",
    sending: (email: string) => `Izvještaj šaljemo na ${email} …`,
    retryInfo: "PDF možete odmah preuzeti, a slanje možete sigurno pokušati ponovno.",
    retry: "Pošalji ponovno",
    preparingPdf: "Pripremamo PDF ...",
    download: "Preuzmi Home DNA™ Report (PDF)",
    consultation: "Nakon konzultacija",
    sections: [
      "Dobro došli u vaš Home DNA™",
      "Vaš životni stil",
      "Vaš stil",
      "Zašto će ovaj dom funkcionirati za vas",
      "Preporuke za odabrane prostore",
      "Okvirna investicija",
      "Sljedeći koraci",
    ],
    estimated: "Procijenjena investicija",
    level: "Razina izvedbe",
  },
  en: {
    studioDelivery:
      "We sent the report to your email, but the studio notification could not be delivered right now.",
    delivery: "Your report is ready, but it could not be sent by email right now.",
    generation: "We could not prepare the report right now.",
    pdfGeneration: "We could not prepare the PDF right now.",
    pdfCreate: "We could not create the PDF right now.",
    verify: "Back to security verification",
    preparing: "Preparing your Home DNA™ Report and email …",
    sending: (email: string) => `Sending the report to ${email} …`,
    retryInfo: "You can download the PDF immediately and safely retry sending it.",
    retry: "Send again",
    preparingPdf: "Preparing PDF ...",
    download: "Download Home DNA™ Report (PDF)",
    consultation: "After consultation",
    sections: [
      "Welcome to your Home DNA™",
      "Your lifestyle",
      "Your style",
      "Why this home will work for you",
      "Recommendations for selected spaces",
      "Indicative investment",
      "Next steps",
    ],
    estimated: "Estimated investment",
    level: "Execution level",
  },
} as const;

export function HomeDnaReport({
  state,
  locale = "sl",
  onDeliveryStateChange,
  onRequireNewVerification,
}: {
  state: HomeDnaState;
  locale?: Locale;
  onDeliveryStateChange?: (status: HomeDnaDeliveryState) => void;
  onRequireNewVerification: () => void;
}) {
  const t = copy[locale];
  const track = useAnalytics(locale, "home-dna");
  const generate = useServerFn(generateHomeDnaReport);
  const submit = useServerFn(submitHomeDna);
  const [report, setReport] = useState<Report | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const started = useRef(false);
  const submissionId = useRef<string | null>(null);
  const pdfFilename = `Nuveli-Studio-Home-DNA-Report-${locale}.pdf`;

  const prepareAndSubmit = useCallback(async () => {
    if (preparing) return;
    let reportReady = Boolean(report);
    let pdfReady = Boolean(pdfBlob);
    setPreparing(true);
    setGenerationError(null);
    setDeliveryError(null);
    onDeliveryStateChange?.("processing");
    track("home_dna_report_generation_started", { details: { stage: "report" } });

    try {
      const reportInput = buildReportInput(state, locale);
      const currentReport = report ?? (await generate({ data: reportInput }));
      reportReady = true;
      if (!report) {
        setReport(currentReport);
        track("home_dna_report_generated", { details: { stage: "report", result: "success" } });
      }

      const currentPdf =
        pdfBlob ??
        (await withTimeout(createPdfBlob(state, currentReport, locale), 120_000, "PDF timeout"));
      pdfReady = true;
      if (!pdfBlob) {
        setPdfBlob(currentPdf);
        track("home_dna_pdf_generated", { details: { stage: "pdf", result: "success" } });
      }
      if (!submissionId.current) submissionId.current = crypto.randomUUID();

      const result = await submit({
        data: {
          submissionId: submissionId.current,
          locale,
          contact: {
            name: state.contact.name,
            email: state.contact.email,
            phone: state.contact.phone,
            consent: state.contact.consent,
          },
          answers: buildStoredAnswers(state),
          summary: reportInput.projectSummary,
          report: currentReport,
          pdfBase64: await blobToBase64(currentPdf),
          pdfFilename,
        },
      });

      const deliveryResult = result.delivered
        ? "sent"
        : result.customerEmailStatus === "sent" || result.internalEmailStatus === "sent"
          ? "partial"
          : "failed";
      track("home_dna_complete", {
        submissionId: result.submissionId,
        details: { stage: "submission", result: deliveryResult },
      });

      if (!result.delivered) {
        setDeliveryError(result.customerEmailStatus === "sent" ? t.studioDelivery : t.delivery);
        onDeliveryStateChange?.("delivery-error");
        return;
      }
      onDeliveryStateChange?.("sent");
    } catch (error) {
      console.error("Home DNA preparation or delivery failed", error);
      const stage = !reportReady ? "report" : !pdfReady ? "pdf" : "submission";
      track("home_dna_error", {
        details: { stage, result: "failed", errorCode: analyticsErrorCode(error) },
      });
      if (!reportReady) {
        setGenerationError(t.generation);
        onDeliveryStateChange?.("generation-error");
      } else if (!pdfReady) {
        setGenerationError(t.pdfGeneration);
        onDeliveryStateChange?.("generation-error");
      } else {
        setDeliveryError(t.delivery);
        onDeliveryStateChange?.("delivery-error");
      }
    } finally {
      setPreparing(false);
    }
  }, [
    generate,
    locale,
    onDeliveryStateChange,
    pdfBlob,
    pdfFilename,
    preparing,
    report,
    state,
    submit,
    t,
    track,
  ]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void prepareAndSubmit();
  }, [prepareAndSubmit]);

  const handleDownload = async () => {
    if (downloadBusy || !report) return;
    setDownloadBusy(true);
    setPdfError(null);
    try {
      const blob =
        pdfBlob ??
        (await withTimeout(createPdfBlob(state, report, locale), 120_000, "PDF timeout"));
      if (!pdfBlob) setPdfBlob(blob);
      downloadBlob(blob, pdfFilename);
      track("home_dna_pdf_download", { details: { stage: "download", result: "success" } });
    } catch (error) {
      console.error(error);
      setPdfError(t.pdfCreate);
      track("home_dna_error", {
        details: { stage: "download", result: "failed", errorCode: analyticsErrorCode(error) },
      });
    } finally {
      setDownloadBusy(false);
    }
  };

  if (generationError) {
    return (
      <div className="mt-16">
        <p role="alert" className="text-sm text-destructive">
          {generationError}
        </p>
        <button
          type="button"
          onClick={onRequireNewVerification}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3 text-sm"
        >
          <RotateCcw size={16} />
          {t.verify}
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <p className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        {t.preparing}
      </p>
    );
  }

  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state, locale);
  const investmentRange = est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : t.consultation;
  const images = resolveReportImages(state, report);

  return (
    <article className="mt-20 border-t border-border pt-16">
      <div className="mb-12 overflow-hidden rounded-2xl bg-muted">
        <img
          src={images.cover.src}
          alt={images.cover.alt}
          className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
        />
      </div>
      <div className="mb-16">
        {preparing && (
          <p className="mb-5 flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            {t.sending(state.contact.email)}
          </p>
        )}
        {deliveryError && (
          <div role="alert" className="mb-6 max-w-2xl border-l-2 border-destructive pl-5">
            <p className="text-sm text-destructive">{deliveryError}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t.retryInfo}</p>
            <button
              type="button"
              disabled={preparing}
              onClick={() => void prepareAndSubmit()}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3 text-sm disabled:opacity-60"
            >
              {preparing ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
              {t.retry}
            </button>
          </div>
        )}
        <button
          type="button"
          disabled={downloadBusy}
          onClick={() => void handleDownload()}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground disabled:opacity-60"
        >
          {downloadBusy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t.preparingPdf}
            </>
          ) : (
            <>
              <Download size={16} />
              {t.download}
            </>
          )}
        </button>
        {pdfError && <p className="mt-4 text-sm text-destructive">{pdfError}</p>}
      </div>

      <Section index="01" title={t.sections[0]} body={report.intro} />
      <Section index="02" title={t.sections[1]} body={report.lifestyle}>
        <ReportImage image={images.lifestyle} className="mt-8 aspect-[16/7]" />
      </Section>
      <Section index="03" title={t.sections[2]} body={report.style}>
        <div className={`mt-8 grid gap-4 ${images.style.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {images.style.map((image) => (
            <ReportImage key={image.id} image={image} className="aspect-[4/3]" />
          ))}
        </div>
      </Section>
      <Section index="04" title={t.sections[3]} body={report.why} />
      {report.rooms.length > 0 && (
        <Section index="05" title={t.sections[4]}>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {report.rooms.map((room) => {
              const image = images.rooms[room.key];
              return (
                <div key={room.key} className="overflow-hidden rounded-2xl border border-border">
                  {image && <ReportImage image={image} className="aspect-[4/3] rounded-none" />}
                  <div className="p-6">
                    <h4 className="font-display text-lg">{room.label}</h4>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {room.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}
      <Section index="06" title={t.sections[5]}>
        <ReportImage image={images.investment} className="mt-8 aspect-[16/7]" />
        <dl className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">{t.estimated}</dt>
            <dd className="mt-3 font-display text-2xl">{investmentRange}</dd>
          </div>
          <div>
            <dt className="eyebrow">{t.level}</dt>
            <dd className="mt-3 font-display text-2xl">{executionLevel}</dd>
          </div>
        </dl>
        <p className="mt-6 whitespace-pre-line text-muted-foreground">{report.investment}</p>
      </Section>
      <Section index="07" title={t.sections[6]}>
        <ol className="mt-8">
          {report.nextSteps.map((step, index) => (
            <li key={`${step.title}-${index}`} className="flex gap-6 border-t py-6">
              <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-display text-lg">{step.title}</h4>
                <p className="mt-2 whitespace-pre-line text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 whitespace-pre-line">{report.closing}</p>
      </Section>
    </article>
  );
}

function analyticsErrorCode(error: unknown): string {
  const message = error instanceof Error ? error.message.toUpperCase() : "UNKNOWN_ERROR";
  return message.match(/[A-Z][A-Z0-9_]{2,79}/)?.[0] ?? "UNKNOWN_ERROR";
}

async function createPdfBlob(state: HomeDnaState, report: Report, locale: Locale): Promise<Blob> {
  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state, locale);
  const fallback =
    locale === "hr" ? "Nakon konzultacija" : locale === "en" ? "After consultation" : "Po posvetu";
  return generateHomeDnaPdf({
    report,
    images: resolveReportImages(state, report),
    customerName: state.contact.name,
    investmentRange: est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : fallback,
    executionLevel,
    locale,
  });
}

function buildStoredAnswers(state: HomeDnaState): Record<string, unknown> {
  const { contact: _contact, ...answers } = state;
  return JSON.parse(JSON.stringify(answers)) as Record<string, unknown>;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const separator = result.indexOf(",");
      if (separator < 0) return reject(new Error("PDF encoding failed"));
      resolve(result.slice(separator + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("PDF encoding failed"));
    reader.readAsDataURL(blob);
  });
}

async function withTimeout<T>(
  promise: Promise<T>,
  milliseconds: number,
  message: string,
): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), milliseconds);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}

function ReportImage({ image, className = "" }: { image: ReportImageAsset; className?: string }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      className={`w-full rounded-2xl object-cover ${className}`}
    />
  );
}

function Section({
  index,
  title,
  body,
  children,
}: {
  index: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <p className="eyebrow">{index}</p>
      <h3 className="display-sm mt-4 font-display text-3xl">{title}</h3>
      {body && <p className="mt-6 whitespace-pre-line text-muted-foreground">{body}</p>}
      {children}
    </section>
  );
}
