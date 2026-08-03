import type { HomeDnaReport } from "@/lib/homeDnaReport.functions";
import type { RoomKey } from "./homeDnaTypes";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 24;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_BOTTOM = PAGE_HEIGHT - 25;

const ink = [26, 26, 24] as const;
const muted = [105, 102, 96] as const;
const line = [220, 216, 209] as const;

export interface ReportPdfData {
  report: HomeDnaReport;
  customerName: string;
  investmentRange: string;
  executionLevel: string;
  roomKeyByLabel: Record<string, RoomKey>;
}

export async function generateHomeDnaPdf(data: ReportPdfData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const { report } = data;

  /*
   * Za zanesljivo MVP-generiranje uporabljamo samo vgrajene
   * jsPDF pisave. Ni zunanjih fetch zahtevkov za pisave ali slike.
   */

  // Naslovnica
  doc.setFillColor(243, 240, 234);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setCharSpace(1.4);
  doc.text("WOLF STUDIO", MARGIN, 48);
  doc.setCharSpace(0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...ink);
  doc.text("Home DNA™ Report", MARGIN, 88);

  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 104, PAGE_WIDTH - MARGIN, 104);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...ink);

  const customerName = data.customerName.trim();

  if (customerName) {
    doc.text(customerName, MARGIN, 122);
  }

  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(formatDate(new Date()), MARGIN, customerName ? 132 : 122);

  doc.setFontSize(10);
  doc.text("Osebna analiza doma, življenjskega sloga in oblikovalskih prioritet.", MARGIN, 238, {
    maxWidth: CONTENT_WIDTH,
  });

  // Vsebina
  doc.addPage();

  let y = MARGIN;

  const newPage = () => {
    doc.addPage();
    y = MARGIN;
  };

  const ensureSpace = (height: number) => {
    if (y + height > CONTENT_BOTTOM) {
      newPage();
    }
  };

  const addHeading = (index: string, title: string) => {
    ensureSpace(34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.setCharSpace(1.1);
    doc.text(index, MARGIN, y);
    doc.setCharSpace(0);

    y += 9;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(...ink);

    const lines = doc.splitTextToSize(title, CONTENT_WIDTH) as string[];

    doc.text(lines, MARGIN, y);
    y += lines.length * 8 + 7;
  };

  const addParagraph = (
    text: string | undefined,
    options?: {
      color?: readonly [number, number, number];
      size?: number;
    },
  ) => {
    if (!text?.trim()) return;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(options?.size ?? 10.5);
    doc.setTextColor(...(options?.color ?? muted));

    const paragraphs = text
      .replace(/\r\n/g, "\n")
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean);

    for (const paragraph of paragraphs) {
      const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH) as string[];

      for (const currentLine of lines) {
        ensureSpace(6);
        doc.text(currentLine, MARGIN, y);
        y += 6;
      }

      y += 3;
    }

    y += 3;
  };

  const addDivider = () => {
    ensureSpace(14);

    y += 4;

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

    y += 10;
  };

  addHeading("01", "Dobrodošli v vašem Home DNA™");
  addParagraph(report.intro);
  addDivider();

  addHeading("02", "Vaš življenjski slog");
  addParagraph(report.lifestyle);
  addDivider();

  addHeading("03", "Vaš slog");
  addParagraph(report.style);
  addDivider();

  addHeading("04", "Zakaj bo ta dom deloval za vas");
  addParagraph(report.why);
  addDivider();

  if (report.rooms.length > 0) {
    addHeading("05", "Priporočila za izbrane prostore");

    report.rooms.forEach((room, index) => {
      ensureSpace(28);

      if (index > 0) {
        doc.setDrawColor(...line);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y += 9;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...ink);
      doc.text(room.label, MARGIN, y);

      y += 8;

      addParagraph(room.text);
    });

    addDivider();
  }

  addHeading("06", "Okvirna investicija");
  ensureSpace(28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.setCharSpace(1);

  doc.text("OCENJENA INVESTICIJA", MARGIN, y);
  doc.text("RAVEN IZVEDBE", MARGIN + CONTENT_WIDTH / 2, y);

  doc.setCharSpace(0);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...ink);

  doc.text(data.investmentRange || "Po posvetu", MARGIN, y);

  doc.text(data.executionLevel || "Premium", MARGIN + CONTENT_WIDTH / 2, y);

  y += 13;

  addParagraph(report.investment);
  addDivider();

  addHeading("07", "Naslednji koraki");

  report.nextSteps.forEach((step, index) => {
    ensureSpace(30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(String(index + 1).padStart(2, "0"), MARGIN, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...ink);
    doc.text(step.title, MARGIN + 13, y);

    y += 7;

    const lines = doc.splitTextToSize(step.text, CONTENT_WIDTH - 13) as string[];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...muted);

    for (const currentLine of lines) {
      ensureSpace(6);
      doc.text(currentLine, MARGIN + 13, y);
      y += 6;
    }

    y += 5;
  });

  addParagraph(report.closing, {
    color: ink,
  });

  addFooters(doc);

  const blob = doc.output("blob");

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("Ustvarjeni PDF je prazen.");
  }

  return blob;
}

function addFooters(doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>) {
  const totalPages = doc.getNumberOfPages();

  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_HEIGHT - 18, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text("Wolf Studio", MARGIN, PAGE_HEIGHT - 11);

    doc.text("Home DNA™", PAGE_WIDTH / 2, PAGE_HEIGHT - 11, { align: "center" });

    doc.text(String(page - 1).padStart(2, "0"), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 11, { align: "right" });
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function downloadBlob(blob: Blob, filename: string) {
  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("Datoteke ni mogoče prenesti, ker je prazna.");
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 2_000);
}
