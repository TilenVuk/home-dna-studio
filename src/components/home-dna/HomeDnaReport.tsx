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

const PDF_FILENAME = "Nuveli-Studio-Home-DNA-Report.pdf";

export type HomeDnaDeliveryState = "processing" | "sent" | "generation-error" | "delivery-error";

export function HomeDnaReport({
  state,
  onDeliveryStateChange,
}: {
  state: HomeDnaState;
  onDeliveryStateChange?: (status: HomeDnaDeliveryState) => void;
}) {
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

  const prepareAndSubmit = useCallback(async () => {
    if (preparing) return;

    let reportReady = Boolean(report);
    let pdfReady = Boolean(pdfBlob);

    setPreparing(true);
    setGenerationError(null);
    setDeliveryError(null);
    onDeliveryStateChange?.("processing");

    try {
      const currentReport = report ?? (await generate({ data: buildReportInput(state) }));
      reportReady = true;
      if (!report) setReport(currentReport);

      const currentPdf =
        pdfBlob ?? (await withTimeout(createPdfBlob(state, currentReport), 120_000, "PDF timeout"));
      pdfReady = true;
      if (!pdfBlob) setPdfBlob(currentPdf);

      if (!submissionId.current) submissionId.current = crypto.randomUUID();

      const result = await submit({
        data: {
          submissionId: submissionId.current,
          contact: state.contact,
          answers: JSON.parse(JSON.stringify(state)),
          summary: buildReportInput(state).summary,
          report: currentReport,
          pdfBase64: await blobToBase64(currentPdf),
          pdfFilename: PDF_FILENAME,
        },
      });

      if (!result.delivered) throw new Error("EMAIL_DELIVERY_INCOMPLETE");
      onDeliveryStateChange?.("sent");
    } catch (error) {
      console.error("Home DNA preparation or delivery failed", error);
      if (!reportReady) {
        setGenerationError("Poročila trenutno ni bilo mogoče pripraviti.");
        onDeliveryStateChange?.("generation-error");
      } else if (!pdfReady) {
        setGenerationError("PDF-ja trenutno ni bilo mogoče pripraviti.");
        onDeliveryStateChange?.("generation-error");
      } else {
        setDeliveryError(
          "Poročilo je pripravljeno, vendar ga trenutno ni bilo mogoče poslati po e-pošti.",
        );
        onDeliveryStateChange?.("delivery-error");
      }
    } finally {
      setPreparing(false);
    }
  }, [generate, onDeliveryStateChange, pdfBlob, preparing, report, state, submit]);

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
        pdfBlob ?? (await withTimeout(createPdfBlob(state, report), 120_000, "PDF timeout"));
      if (!pdfBlob) setPdfBlob(blob);
      downloadBlob(blob, PDF_FILENAME);
    } catch (error) {
      console.error(error);
      setPdfError("PDF-ja trenutno ni bilo mogoče ustvariti.");
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
          disabled={preparing}
          onClick={() => void prepareAndSubmit()}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3 text-sm disabled:opacity-60"
        >
          {preparing ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
          Poskusi znova
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <p className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Pripravljamo vaš Home DNA™ Report in e-pošto …
      </p>
    );
  }

  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state);
  const investmentRange = est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : "Po posvetu";
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
            Poročilo pošiljamo na {state.contact.email} …
          </p>
        )}

        {deliveryError && (
          <div role="alert" className="mb-6 max-w-2xl border-l-2 border-destructive pl-5">
            <p className="text-sm text-destructive">{deliveryError}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              PDF lahko prenesete takoj. Ponovni poskus ne bo ustvaril podvojene oddaje ali
              podvojenih sporočil.
            </p>
            <button
              type="button"
              disabled={preparing}
              onClick={() => void prepareAndSubmit()}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3 text-sm disabled:opacity-60"
            >
              {preparing ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
              Ponovno pošlji
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
              Pripravljamo PDF ...
            </>
          ) : (
            <>
              <Download size={16} />
              Prenesi Home DNA™ Report (PDF)
            </>
          )}
        </button>

        {pdfError && <p className="mt-4 text-sm text-destructive">{pdfError}</p>}
      </div>

      <Section index="01" title="Dobrodošli v vašem Home DNA™" body={report.intro} />

      <Section index="02" title="Vaš življenjski slog" body={report.lifestyle}>
        <ReportImage image={images.lifestyle} className="mt-8 aspect-[16/7]" />
      </Section>

      <Section index="03" title="Vaš slog" body={report.style}>
        <div className={`mt-8 grid gap-4 ${images.style.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {images.style.map((image) => (
            <ReportImage key={image.id} image={image} className="aspect-[4/3]" />
          ))}
        </div>
      </Section>

      <Section index="04" title="Zakaj bo ta dom deloval za vas" body={report.why} />

      {report.rooms.length > 0 && (
        <Section index="05" title="Priporočila za izbrane prostore">
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

      <Section index="06" title="Okvirna investicija">
        <ReportImage image={images.investment} className="mt-8 aspect-[16/7]" />

        <dl className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Ocenjena investicija</dt>
            <dd className="mt-3 font-display text-2xl">{investmentRange}</dd>
          </div>
          <div>
            <dt className="eyebrow">Raven izvedbe</dt>
            <dd className="mt-3 font-display text-2xl">{executionLevel}</dd>
          </div>
        </dl>

        <p className="mt-6 whitespace-pre-line text-muted-foreground">{report.investment}</p>
      </Section>

      <Section index="07" title="Naslednji koraki">
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

async function createPdfBlob(state: HomeDnaState, report: Report): Promise<Blob> {
  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state);
  return generateHomeDnaPdf({
    report,
    images: resolveReportImages(state, report),
    customerName: state.contact.name,
    investmentRange: est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : "Po posvetu",
    executionLevel,
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const separator = result.indexOf(",");
      if (separator < 0) {
        reject(new Error("PDF encoding failed"));
        return;
      }
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
