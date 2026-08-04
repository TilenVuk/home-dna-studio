import { jsPDF } from "jspdf";
import type { HomeDnaReport } from "@/lib/homeDnaReport.functions";
import type { RoomKey } from "./homeDnaTypes";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN_LEFT = 24;
const MARGIN_RIGHT = 24;
const MARGIN_TOP = 24;
const FOOTER_HEIGHT = 25;

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const CONTENT_BOTTOM = PAGE_HEIGHT - FOOTER_HEIGHT;

const COLORS = {
  ink: [26, 26, 24] as const,
  muted: [105, 102, 96] as const,
  line: [220, 216, 209] as const,
  cover: [243, 240, 234] as const,
};

type PdfDocument = InstanceType<(typeof import("jspdf"))["jsPDF"]>;

export interface ReportPdfData {
  report: HomeDnaReport;
  customerName: string;
  investmentRange: string;
  executionLevel: string;
  roomKeyByLabel: Record<string, RoomKey>;
}

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const { report } = data;

  addCoverPage(doc, data);

  doc.addPage();

  let y = MARGIN_TOP;

  const startNewPage = () => {
    doc.addPage();
    y = MARGIN_TOP;
  };

  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > CONTENT_BOTTOM) {
      startNewPage();
    }
  };

  const addSectionHeading = (index: string, title: string) => {
    ensureSpace(38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setCharSpace(1);

    doc.text(index, MARGIN_LEFT, y);

    doc.setCharSpace(0);
    y += 9;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(...COLORS.ink);

    const titleLines = wrapText(doc, title, CONTENT_WIDTH);

    doc.text(titleLines, MARGIN_LEFT, y, {
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
      width?: number;
    },
  ) => {
    if (!text?.trim()) {
      return;
    }

    const leftIndent = options?.leftIndent ?? 0;
    const x = MARGIN_LEFT + leftIndent;

    const availableWidth = options?.width ?? CONTENT_WIDTH - leftIndent;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(options?.size ?? 10.5);
    doc.setTextColor(...(options?.color ?? COLORS.muted));

    const paragraphs = normalizeText(text)
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    for (const paragraph of paragraphs) {
      const lines = wrapText(doc, paragraph, availableWidth);

      for (const line of lines) {
        ensureSpace(6);

        doc.text(line, x, y, {
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

    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);

    doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);

    y += 10;
  };

  addSectionHeading("01", "Dobrodošli v vašem Home DNA™");

  addParagraph(report.intro);
  addDivider();

  addSectionHeading("02", "Vaš življenjski slog");

  addParagraph(report.lifestyle);
  addDivider();

  addSectionHeading("03", "Vaš slog");

  addParagraph(report.style);
  addDivider();

  addSectionHeading("04", "Zakaj bo ta dom deloval za vas");

  addParagraph(report.why);
  addDivider();

  if (report.rooms.length > 0) {
    addSectionHeading("05", "Priporočila za izbrane prostore");

    report.rooms.forEach((room, index) => {
      ensureSpace(32);

      if (index > 0) {
        doc.setDrawColor(...COLORS.line);
        doc.setLineWidth(0.2);

        doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);

        y += 9;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...COLORS.ink);

      const roomTitleLines = wrapText(doc, room.label, CONTENT_WIDTH);

      doc.text(roomTitleLines, MARGIN_LEFT, y, {
        maxWidth: CONTENT_WIDTH,
      });

      y += roomTitleLines.length * 7 + 3;

      addParagraph(room.text);
    });

    addDivider();
  }

  addSectionHeading("06", "Okvirna investicija");

  ensureSpace(34);

  const columnGap = 12;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;

  const rightColumnX = MARGIN_LEFT + columnWidth + columnGap;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setCharSpace(0.8);

  doc.text("OCENJENA INVESTICIJA", MARGIN_LEFT, y, {
    maxWidth: columnWidth,
  });

  doc.text("RAVEN IZVEDBE", rightColumnX, y, {
    maxWidth: columnWidth,
  });

  doc.setCharSpace(0);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.ink);

  const investmentLines = wrapText(doc, data.investmentRange || "Po posvetu", columnWidth);

  const executionLevelLines = wrapText(doc, data.executionLevel || "Premium", columnWidth);

  doc.text(investmentLines, MARGIN_LEFT, y, {
    maxWidth: columnWidth,
  });

  doc.text(executionLevelLines, rightColumnX, y, {
    maxWidth: columnWidth,
  });

  y += Math.max(investmentLines.length, executionLevelLines.length) * 7 + 7;

  addParagraph(report.investment);
  addDivider();

  addSectionHeading("07", "Naslednji koraki");

  report.nextSteps.forEach((step, index) => {
    ensureSpace(32);

    const stepNumberWidth = 13;
    const stepX = MARGIN_LEFT + stepNumberWidth;

    const stepWidth = CONTENT_WIDTH - stepNumberWidth;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);

    doc.text(String(index + 1).padStart(2, "0"), MARGIN_LEFT, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.ink);

    const titleLines = wrapText(doc, step.title, stepWidth);

    doc.text(titleLines, stepX, y, {
      maxWidth: stepWidth,
    });

    y += titleLines.length * 6 + 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLORS.muted);

    const stepLines = wrapText(doc, step.text, stepWidth);

    for (const line of stepLines) {
      ensureSpace(6);

      doc.text(line, stepX, y, {
        maxWidth: stepWidth,
      });

      y += 6;
    }

    y += 6;

    ensureSpace(4);

    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);

    doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);

    y += 10;
  });

  addParagraph(report.closing, {
    color: COLORS.ink,
  });

  addFooters(doc);

  const blob = doc.output("blob");

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error("Ustvarjeni PDF je prazen.");
  }

  return blob;
}

function addCoverPage(doc: PdfDocument, data: ReportPdfData) {
  doc.setFillColor(...COLORS.cover);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.setCharSpace(1.4);

  doc.text("WOLF STUDIO", MARGIN_LEFT, 48);

  doc.setCharSpace(0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...COLORS.ink);

  const titleLines = wrapText(doc, "Home DNA™ Report", CONTENT_WIDTH);

  doc.text(titleLines, MARGIN_LEFT, 88, {
    maxWidth: CONTENT_WIDTH,
  });

  const titleBottom = 88 + titleLines.length * 12;

  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.3);

  doc.line(MARGIN_LEFT, titleBottom + 8, PAGE_WIDTH - MARGIN_RIGHT, titleBottom + 8);

  const customerY = titleBottom + 26;
  const customerName = data.customerName.trim();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.ink);

  if (customerName) {
    const customerLines = wrapText(doc, customerName, CONTENT_WIDTH);

    doc.text(customerLines, MARGIN_LEFT, customerY, {
      maxWidth: CONTENT_WIDTH,
    });
  }

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);

  doc.text(formatDate(new Date()), MARGIN_LEFT, customerY + (customerName ? 12 : 0));

  const description = "Osebna analiza doma, življenjskega sloga in oblikovalskih prioritet.";

  const descriptionLines = wrapText(doc, description, CONTENT_WIDTH);

  doc.text(descriptionLines, MARGIN_LEFT, 238, {
    maxWidth: CONTENT_WIDTH,
  });
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/(\S{30})(?=\S)/g, "$1 ")
    .trim();
}

function wrapText(doc: PdfDocument, text: string, maxWidth: number): string[] {
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return [];
  }

  const safeWidth = Math.max(20, maxWidth);

  const lines = doc.splitTextToSize(normalizedText, safeWidth) as unknown;

  if (Array.isArray(lines)) {
    return lines.map((line) => String(line));
  }

  return [String(lines)];
}

function addFooters(doc: PdfDocument) {
  const totalPages = doc.getNumberOfPages();

  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);

    doc.line(MARGIN_LEFT, PAGE_HEIGHT - 18, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);

    doc.text("Wolf Studio", MARGIN_LEFT, PAGE_HEIGHT - 11);

    doc.text("Home DNA™", PAGE_WIDTH / 2, PAGE_HEIGHT - 11, {
      align: "center",
    });

    doc.text(String(page - 1).padStart(2, "0"), PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 11, {
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
