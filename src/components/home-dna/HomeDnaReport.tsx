import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { generateHomeDnaReport, type HomeDnaReport as Report } from "@/lib/homeDnaReport.functions";
import { buildReportInput } from "./reportSummary";
import { formatEuro } from "./pricing";
import type { HomeDnaState } from "./homeDnaTypes";

export function HomeDnaReport({ state }: { state: HomeDnaState }) {
  const generate = useServerFn(generateHomeDnaReport);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const input = buildReportInput(state);
    generate({ data: input })
      .then((result) => {
        if (active) setReport(result);
      })
      .catch(() => {
        if (active) setError("Poročila trenutno ni bilo mogoče pripraviti. Poslali vam ga bomo po e-pošti.");
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const est = state.investment.estimatedInvestment;
  const { executionLevel } = buildReportInput(state);

  if (error) {
    return <p className="mt-16 text-sm text-muted-foreground">{error}</p>;
  }

  if (!report) {
    return (
      <p className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
        Pripravljamo vaš Home DNA™ Report …
      </p>
    );
  }

  return (
    <article className="mt-20 border-t border-border pt-16">
      <Section index="01" title="Dobrodošli v vašem Home DNA™" body={report.intro} />
      <Section index="02" title="Vaš življenjski slog" body={report.lifestyle} />
      <Section index="03" title="Vaš slog" body={report.style} />

      {report.rooms.length > 0 && (
        <Section index="04" title="Priporočila za izbrane prostore">
          <div className="mt-8 space-y-8">
            {report.rooms.map((room) => (
              <div key={room.label} className="border-t border-border pt-6">
                <h4 className="font-display text-lg tracking-[-0.02em]">{room.label}</h4>
                <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                  {room.text}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section index="05" title="Okvirna investicija">
        <dl className="mt-8 grid gap-px border-t border-border sm:grid-cols-2">
          <div className="py-6">
            <dt className="eyebrow">Ocenjena investicija</dt>
            <dd className="mt-3 font-display text-2xl tracking-[-0.03em]">
              {est ? `${formatEuro(est.min)} – ${formatEuro(est.max)}` : "Po posvetu"}
            </dd>
          </div>
          <div className="py-6 sm:pl-10">
            <dt className="eyebrow">Raven izvedbe</dt>
            <dd className="mt-3 font-display text-2xl tracking-[-0.03em]">{executionLevel}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
          {report.investment}
        </p>
      </Section>

      <Section index="06" title="Naslednji koraki">
        <ol className="mt-8">
          {report.nextSteps.map((step, i) => (
            <li key={step.title} className="flex gap-6 border-t border-border py-6 last:border-b">
              <span className="eyebrow pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-display text-lg tracking-[-0.02em]">{step.title}</h4>
                <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[62ch] text-base leading-relaxed">{report.closing}</p>
      </Section>
    </article>
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
    <section className="mb-16 last:mb-0">
      <p className="eyebrow">{index}</p>
      <h3 className="display-sm mt-4 font-display text-2xl tracking-[-0.03em] md:text-3xl">
        {title}
      </h3>
      {body && (
        <p className="mt-6 max-w-[62ch] whitespace-pre-line text-base leading-relaxed text-muted-foreground">
          {body}
        </p>
      )}
      {children}
    </section>
  );
}
