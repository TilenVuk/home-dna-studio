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

type PdfDocument = InstanceType<(typeof import("jspdf"))["jsPDF"]>;

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
   * MVP-verzija namenoma uporablja samo vgrajeno pisavo
   * in ne nalaga zunanjih slik ali pisav.
   *
   * Tako se izognemo nedokončanim fetch zahtevkom, zaradi
   * katerih je generiranje PDF-ja prej ostalo v neskončnem stanju.
   */

  // --------------------------------------------------
  // Naslovnica
  // --------------------------------------------------

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

  const coverTitle = wrapTextSafely(doc, "Home DNA™ Report", CONTENT_WIDTH);

  doc.text(coverTitle, MARGIN, 88, {
    maxWidth: CONTENT_WIDTH,
  });

  const coverTitleHeight = coverTitle.length * 12;

  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 96 + coverTitleHeight, PAGE_WIDTH - MARGIN, 96 + coverTitleHeight);

  const customerY = 114 + coverTitleHeight;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...ink);

  const customerName = data.customerName.trim();

  if (customerName) {
    const customerLines = wrapTextSafely(doc, customerName, CONTENT_WIDTH);

    doc.text(customerLines, MARGIN, customerY, {
      maxWidth: CONTENT_WIDTH,
    });
  }

  doc.setFontSize(10);
  doc.setTextColor(...muted);

  doc.text(formatDate(new Date()), MARGIN, customerY + (customerName ? 12 : 0));

  const coverDescription = "Osebna analiza doma, življenjskega sloga in oblikovalskih prioritet.";

  const coverDescriptionLines = wrapTextSafely(doc, coverDescription, CONTENT_WIDTH);

  doc.text(coverDescriptionLines, MARGIN, 238, {
    maxWidth: CONTENT_WIDTH,
  });

  // --------------------------------------------------
  // Vsebina
  // --------------------------------------------------

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

    const titleLines = wrapTextSafely(doc, title, CONTENT_WIDTH);

    doc.text(titleLines, MARGIN, y, {
      maxWidth: CONTENT_WIDTH,
    });

    y += titleLines.length * 8 + 7;
  };

  const addParagraph = (
    text: string | undefined,
    options?: {
      color?: readonly [number, number, number];
      size?: number;
      leftIndent?: number;
    },
  ) => {
    if (!text?.trim()) return;

    const leftIndent = options?.leftIndent ?? 0;
    const x = MARGIN + leftIndent;
    const availableWidth = CONTENT_WIDTH - leftIndent;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(options?.size ?? 10.5);
    doc.setTextColor(...(options?.color ?? muted));

    const normalizedText = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const paragraphs = normalizedText
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    for (const paragraph of paragraphs) {
      const wrappedLines = wrapTextSafely(doc, paragraph, availableWidth);

      for (const currentLine of wrappedLines) {
        ensureSpace(6);

        doc.text(currentLine, x, y, {
          maxWidth: availableWidth,
        });

        y += 6;
      }

      y += 4;
    }

    y += 2;
  };

  const addDivider = () => {
    ensureSpace(14);

    y += 4;

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

    y += 10;
  };

  // --------------------------------------------------
  // 01
  // --------------------------------------------------

  addHeading("01", "Dobrodošli v vašem Home DNA™");

  addParagraph(report.intro);
  addDivider();

  // --------------------------------------------------
  // 02
  // --------------------------------------------------

  addHeading("02", "Vaš življenjski slog");

  addParagraph(report.lifestyle);
  addDivider();

  // --------------------------------------------------
  // 03
  // --------------------------------------------------

  addHeading("03", "Vaš slog");

  addParagraph(report.style);
  addDivider();

  // --------------------------------------------------
  // 04
  // --------------------------------------------------

  addHeading("04", "Zakaj bo ta dom deloval za vas");

  addParagraph(report.why);
  addDivider();

  // --------------------------------------------------
  // 05
  // --------------------------------------------------

  if (report.rooms.length > 0) {
    addHeading("05", "Priporočila za izbrane prostore");

    report.rooms.forEach((room, index) => {
      ensureSpace(34);

      if (index > 0) {
        doc.setDrawColor(...line);
        doc.setLineWidth(0.2);

        doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

        y += 9;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...ink);

      const roomTitleLines = wrapTextSafely(doc, room.label, CONTENT_WIDTH);

      doc.text(roomTitleLines, MARGIN, y, {
        maxWidth: CONTENT_WIDTH,
      });

      y += roomTitleLines.length * 7 + 3;

      addParagraph(room.text);
    });

    addDivider();
  }

  // --------------------------------------------------
  // 06
  // --------------------------------------------------

  addHeading("06", "Okvirna investicija");

  ensureSpace(30);

  const investmentColumnWidth = CONTENT_WIDTH / 2 - 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.setCharSpace(1);

  doc.text("OCENJENA INVESTICIJA", MARGIN, y, {
    maxWidth: investmentColumnWidth,
  });

  doc.text("RAVEN IZVEDBE", MARGIN + CONTENT_WIDTH / 2 + 6, y, {
    maxWidth: investmentColumnWidth,
  });

  doc.setCharSpace(0);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...ink);

  const investmentLines = wrapTextSafely(doc, data.investmentRange || "Po posvetu", investmentColumnWidth);

  const executionLevelLines = wrapTextSafely(doc, data.executionLevel || "Premium", investmentColumnWidth);

  doc.text(investmentLines, MARGIN, y, {
    maxWidth: investmentColumnWidth,
  });

  doc.text(executionLevelLines, MARGIN + CONTENT_WIDTH / 2 + 6, y, {
    maxWidth: investmentColumnWidth,
  });

  y += Math.max(investmentLines.length, executionLevelLines.length) * 7 + 7;

  addParagraph(report.investment);
  addDivider();

  // --------------------------------------------------
  // 07
  // --------------------------------------------------

  addHeading("07", "Naslednji koraki");

  report.nextSteps.forEach((step, index) => {
    ensureSpace(34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text(String(index + 1).padStart(2, "0"), MARGIN, y);

    const stepContentX = MARGIN + 13;
    const stepContentWidth = CONTENT_WIDTH - 13;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...ink);

    const stepTitleLines = wrapTextSafely(doc, step.title, stepContentWidth);

    doc.text(stepTitleLines, stepContentX, y, {
      maxWidth: stepContentWidth,
    });

    y += stepTitleLines.length * 6 + 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...muted);

    const stepTextLines = wrapTextSafely(doc, step.text, stepContentWidth);

    for (const currentLine of stepTextLines) {
      ensureSpace(6);

      doc.text(currentLine, stepContentX, y, {
        maxWidth: stepContentWidth,
      });

      y += 6;
    }

    y += 5;

    ensureSpace(4);

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);

    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

    y += 10;
  });

  addParagraph(report.closing, {
    color: ink,
  });

  // --------------------------------------------------
  // Noge strani
  // --------------------------------------------------

  addFooters(doc);

  const blob = doc.output("blob");

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("Ustvarjeni PDF je prazen.");
  }

  return blob;
}

function wrapTextSafely(doc: PdfDocument, text: string, maxWidth: number): string[] {
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalizedText) {
    return [];
  }

  const initialLines = doc.splitTextToSize(normalizedText, maxWidth) as string[];

  const result: string[] = [];

  for (const initialLine of initialLines) {
    const lineText = String(initialLine).trim();

    if (!lineText) {
      continue;
    }

    if (doc.getTextWidth(lineText) <= maxWidth) {
      result.push(lineText);
      continue;
    }

    const words = lineText.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const proposedLine = currentLine ? `${currentLine} ${word}` : word;

      if (doc.getTextWidth(proposedLine) <= maxWidth) {
        currentLine = proposedLine;
        continue;
      }

      if (currentLine) {
        result.push(currentLine);
        currentLine = "";
      }

      if (doc.getTextWidth(word) <= maxWidth) {
        currentLine = word;
        continue;
      }

      const brokenWordParts = breakLongWord(doc, word, maxWidth);

      result.push(...brokenWordParts.slice(0, -1));

      currentLine = brokenWordParts.at(-1) ?? "";
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

function breakLongWord(doc: PdfDocument, word: string, maxWidth: number): string[] {
  const parts: string[] = [];
  let remaining = word;

  while (remaining.length > 0 && doc.getTextWidth(remaining) > maxWidth) {
    let cutPosition = remaining.length;

    while (cutPosition > 1 && doc.getTextWidth(`${remaining.slice(0, cutPosition)}-`) > maxWidth) {
      cutPosition -= 1;
    }

    if (cutPosition <= 1) {
      cutPosition = 1;
    }

    const part = remaining.slice(0, cutPosition) + (cutPosition < remaining.length ? "-" : "");

    parts.push(part);

    remaining = remaining.slice(cutPosition).trimStart();
  }

  if (remaining) {
    parts.push(remaining);
  }

  return parts;
}

function addFooters(doc: PdfDocument) {
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

    doc.text("Home DNA™", PAGE_WIDTH / 2, PAGE_HEIGHT - 11, {
      align: "center",
    });

    doc.text(String(page - 1).padStart(2, "0"), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 11, {
      align: "right",
    });
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
