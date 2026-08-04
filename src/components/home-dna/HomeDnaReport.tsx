import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { generateHomeDnaReport, type HomeDnaReport as Report } from "@/lib/homeDnaReport.functions";
import { buildReportInput } from "./reportSummary";
import { generateHomeDnaPdf, downloadBlob } from "./reportPdf";
import { resolveReportImages, type ReportImageAsset } from "./reportImages";
import { formatEuro } from "./pricing";
import type { HomeDnaState } from "./homeDnaTypes";

export function HomeDnaReport({ state }: { state: HomeDnaState }) {
  const generate = useServerFn(generateHomeDnaReport);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const input = buildReportInput(state);

    generate({ data: input })
      .then((result) => {
        setReport(result);
      })
      .catch((err) => {
        console.error(err);
        setError("Poročila trenutno ni bilo mogoče pripraviti.");
      });

    // Poročilo se ustvari samo enkrat, ko se prikaže zaključni zaslon.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state);

  if (error) return <p className="mt-16 text-sm text-destructive">{error}</p>;

  if (!report) {
    return (
      <p className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Pripravljamo vaš Home DNA™ Report …
      </p>
    );
  }

  const investmentRange = est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : "Po posvetu";
  const images = resolveReportImages(state, report);

  async function handleDownload() {
    if (pdfBusy || !report) return;

    setPdfBusy(true);
    setPdfError(null);

    try {
      const pdfPromise = generateHomeDnaPdf({
        report,
        images,
        customerName: state.contact.name ?? "",
        investmentRange,
        executionLevel,
      });

      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("PDF timeout")), 120_000);
      });

      const blob = await Promise.race([pdfPromise, timeout]);
      downloadBlob(blob, "Wolf-Studio-Home-DNA-Report.pdf");
    } catch (err) {
      console.error(err);
      setPdfError("PDF-ja trenutno ni bilo mogoče ustvariti.");
    } finally {
      setPdfBusy(false);
    }
  }

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
        <button
          type="button"
          disabled={pdfBusy}
          onClick={handleDownload}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground disabled:opacity-60"
        >
          {pdfBusy ? (
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

function ReportImage({ image, className = "" }: { image: ReportImageAsset; className?: string }) {
  return (
    <img src={image.src} alt={image.alt} loading="lazy" className={`w-full rounded-2xl object-cover ${className}`} />
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
