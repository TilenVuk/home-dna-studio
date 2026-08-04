import { jsPDF } from "jspdf";
import type { HomeDnaReport } from "@/lib/homeDnaReport.functions";
import interTightRegularAsset from "@/assets/fonts/InterTight-Regular.ttf.asset.json";
import schibstedMediumAsset from "@/assets/fonts/SchibstedGrotesk-Medium.ttf.asset.json";
import schibstedRegularAsset from "@/assets/fonts/SchibstedGrotesk-Regular.ttf.asset.json";
import type { RoomKey } from "./homeDnaTypes";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN_LEFT = 24;
const MARGIN_RIGHT = 24;
const MARGIN_TOP = 24;
const FOOTER_HEIGHT = 25;
const TEXT_SAFETY_MARGIN = 3;

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - TEXT_SAFETY_MARGIN;
const CONTENT_RIGHT = MARGIN_LEFT + CONTENT_WIDTH;
const CONTENT_BOTTOM = PAGE_HEIGHT - FOOTER_HEIGHT;

const BODY_FONT = "InterTight";
const DISPLAY_FONT = "SchibstedGrotesk";

const COLORS = {
  ink: [26, 26, 24] as const,
  muted: [105, 102, 96] as const,
  line: [220, 216, 209] as const,
  cover: [243, 240, 234] as const,
};

type PdfDocument = jsPDF;
type FontStyle = "normal" | "bold";

interface FontAsset {
  url: string;
}

export interface ReportPdfData {
  report: HomeDnaReport;
  customerName: string;
  investmentRange: string;
  executionLevel: string;
  roomKeyByLabel: Record<string, RoomKey>;
}

export async function generateHomeDnaPdf(data: ReportPdfData): Promise<Blob> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
    putOnlyUsedFonts: true,
  });

  await registerPdfFonts(doc);

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
    setFont(doc, DISPLAY_FONT, "bold", 19, COLORS.ink);
    const titleLines = wrapText(doc, title, CONTENT_WIDTH);
    const requiredHeight = 9 + titleLines.length * 8 + 10;

    ensureSpace(requiredHeight);

    setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
    doc.text(index, MARGIN_LEFT, y);
    y += 9;

    setFont(doc, DISPLAY_FONT, "bold", 19, COLORS.ink);

    for (const line of titleLines) {
      doc.text(line, MARGIN_LEFT, y);
      y += 8;
    }

    y += 7;
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
    const requestedWidth = options?.width ?? CONTENT_WIDTH - leftIndent;
    const availableWidth = Math.max(20, Math.min(requestedWidth, CONTENT_RIGHT - x));

    setFont(doc, BODY_FONT, "normal", options?.size ?? 10.5, options?.color ?? COLORS.muted);

    const paragraphs = normalizeText(text)
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    for (const paragraph of paragraphs) {
      const lines = wrapText(doc, paragraph, availableWidth);

      for (const line of lines) {
        ensureSpace(6);
        doc.text(line, x, y);
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
    doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);

    y += 10;
  };

  addSectionHeading("01", "DobrodoÅ¡li v vaÅ¡em Home DNAâ„¢");
  addParagraph(report.intro);
  addDivider();

  addSectionHeading("02", "VaÅ¡ Å¾ivljenjski slog");
  addParagraph(report.lifestyle);
  addDivider();

  addSectionHeading("03", "VaÅ¡ slog");
  addParagraph(report.style);
  addDivider();

  addSectionHeading("04", "Zakaj bo ta dom deloval za vas");
  addParagraph(report.why);
  addDivider();

  if (report.rooms.length > 0) {
    addSectionHeading("05", "PriporoÄila za izbrane prostore");

    report.rooms.forEach((room, index) => {
      setFont(doc, DISPLAY_FONT, "bold", 13, COLORS.ink);
      const roomTitleLines = wrapText(doc, room.label, CONTENT_WIDTH);
      const requiredHeight = roomTitleLines.length * 7 + 20;

      ensureSpace(requiredHeight);

      if (index > 0) {
        doc.setDrawColor(...COLORS.line);
        doc.setLineWidth(0.2);
        doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);
        y += 9;
      }

      setFont(doc, DISPLAY_FONT, "bold", 13, COLORS.ink);

      for (const line of roomTitleLines) {
        doc.text(line, MARGIN_LEFT, y);
        y += 7;
      }

      y += 3;
      addParagraph(room.text);
    });

    addDivider();
  }

  addSectionHeading("06", "Okvirna investicija");

  const columnGap = 12;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;
  const rightColumnX = MARGIN_LEFT + columnWidth + columnGap;

  setFont(doc, DISPLAY_FONT, "bold", 15, COLORS.ink);
  const investmentLines = wrapText(doc, data.investmentRange || "Po posvetu", columnWidth);
  const executionLevelLines = wrapText(doc, data.executionLevel || "Premium", columnWidth);
  const investmentBlockHeight = 9 + Math.max(investmentLines.length, executionLevelLines.length) * 7 + 10;

  ensureSpace(investmentBlockHeight);

  setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
  doc.text("OCENJENA INVESTICIJA", MARGIN_LEFT, y);
  doc.text("RAVEN IZVEDBE", rightColumnX, y);
  y += 9;

  setFont(doc, DISPLAY_FONT, "bold", 15, COLORS.ink);
  const investmentStartY = y;

  investmentLines.forEach((line, index) => {
    doc.text(line, MARGIN_LEFT, investmentStartY + index * 7);
  });

  executionLevelLines.forEach((line, index) => {
    doc.text(line, rightColumnX, investmentStartY + index * 7);
  });

  y += Math.max(investmentLines.length, executionLevelLines.length) * 7 + 7;

  addParagraph(report.investment);
  addDivider();

  addSectionHeading("07", "Naslednji koraki");

  report.nextSteps.forEach((step, index) => {
    const stepNumberWidth = 13;
    const stepX = MARGIN_LEFT + stepNumberWidth;
    const stepWidth = CONTENT_WIDTH - stepNumberWidth;

    setFont(doc, DISPLAY_FONT, "bold", 12, COLORS.ink);
    const titleLines = wrapText(doc, step.title, stepWidth);

    setFont(doc, BODY_FONT, "normal", 10.5, COLORS.muted);
    const stepLines = wrapText(doc, step.text, stepWidth);
    const requiredHeight = titleLines.length * 6 + stepLines.length * 6 + 22;

    ensureSpace(requiredHeight);

    setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
    doc.text(String(index + 1).padStart(2, "0"), MARGIN_LEFT, y);

    setFont(doc, DISPLAY_FONT, "bold", 12, COLORS.ink);

    for (const line of titleLines) {
      doc.text(line, stepX, y);
      y += 6;
    }

    y += 3;
    setFont(doc, BODY_FONT, "normal", 10.5, COLORS.muted);

    for (const line of stepLines) {
      doc.text(line, stepX, y);
      y += 6;
    }

    y += 6;
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);
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

async function registerPdfFonts(doc: PdfDocument) {
  const [bodyRegular, displayRegular, displayMedium] = await Promise.all([
    loadFontAsset(interTightRegularAsset),
    loadFontAsset(schibstedRegularAsset),
    loadFontAsset(schibstedMediumAsset),
  ]);

  doc.addFileToVFS("InterTight-Regular.ttf", bodyRegular);
  doc.addFont("InterTight-Regular.ttf", BODY_FONT, "normal");

  doc.addFileToVFS("SchibstedGrotesk-Regular.ttf", displayRegular);
  doc.addFont("SchibstedGrotesk-Regular.ttf", DISPLAY_FONT, "normal");

  doc.addFileToVFS("SchibstedGrotesk-Medium.ttf", displayMedium);
  doc.addFont("SchibstedGrotesk-Medium.ttf", DISPLAY_FONT, "bold");
}

async function loadFontAsset(asset: FontAsset): Promise<string> {
  const response = await fetch(asset.url);

  if (!response.ok) {
    throw new Error(`Pisave za PDF ni bilo mogoÄe naloÅ¾iti (${response.status}).`);
  }

  return arrayBufferToBase64(await response.arrayBuffer());
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

function addCoverPage(doc: PdfDocument, data: ReportPdfData) {
  doc.setFillColor(...COLORS.cover);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  setFont(doc, BODY_FONT, "normal", 9, COLORS.muted);
  doc.text("WOLF STUDIO", MARGIN_LEFT, 48);

  setFont(doc, DISPLAY_FONT, "bold", 32, COLORS.ink);
  const titleLines = wrapText(doc, "Home DNAâ„¢ Report", CONTENT_WIDTH);
  let titleY = 88;

  for (const line of titleLines) {
    doc.text(line, MARGIN_LEFT, titleY);
    titleY += 12;
  }

  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, titleY + 2, CONTENT_RIGHT, titleY + 2);

  const customerY = titleY + 20;
  const customerName = data.customerName.trim();

  setFont(doc, BODY_FONT, "normal", 12, COLORS.ink);

  if (customerName) {
    const customerLines = wrapText(doc, customerName, CONTENT_WIDTH);
    let currentY = customerY;

    for (const line of customerLines) {
      doc.text(line, MARGIN_LEFT, currentY);
      currentY += 7;
    }
  }

  setFont(doc, BODY_FONT, "normal", 10, COLORS.muted);
  doc.text(formatDate(new Date()), MARGIN_LEFT, customerY + (customerName ? 12 : 0));

  const description = "Osebna analiza doma, Å¾ivljenjskega sloga in oblikovalskih prioritet.";
  const descriptionLines = wrapText(doc, description, CONTENT_WIDTH);
  let descriptionY = 238;

  for (const line of descriptionLines) {
    doc.text(line, MARGIN_LEFT, descriptionY);
    descriptionY += 6;
  }
}

function setFont(
  doc: PdfDocument,
  family: string,
  style: FontStyle,
  size: number,
  color: readonly [number, number, number],
) {
  doc.setCharSpace(0);
  doc.setFont(family, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function wrapText(doc: PdfDocument, text: string, maxWidth: number): string[] {
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return [];
  }

  const safeWidth = Math.max(20, maxWidth - 1.5);
  const result: string[] = [];

  for (const paragraph of normalizedText.split("\n")) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;

      if (doc.getTextWidth(candidate) <= safeWidth) {
        line = candidate;
        continue;
      }

      if (line) {
        result.push(line);
        line = "";
      }

      if (doc.getTextWidth(word) <= safeWidth) {
        line = word;
        continue;
      }

      const fragments = splitLongWord(doc, word, safeWidth);
      result.push(...fragments.slice(0, -1));
      line = fragments.at(-1) ?? "";
    }

    if (line) {
      result.push(line);
    }
  }

  return result;
}

function splitLongWord(doc: PdfDocument, word: string, maxWidth: number): string[] {
  const result: string[] = [];
  let fragment = "";

  for (const character of Array.from(word)) {
    const candidate = fragment + character;

    if (fragment && doc.getTextWidth(candidate) > maxWidth) {
      result.push(fragment);
      fragment = character;
    } else {
      fragment = candidate;
    }
  }

  if (fragment) {
    result.push(fragment);
  }

  return result;
}

function addFooters(doc: PdfDocument) {
  const totalPages = doc.getNumberOfPages();

  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT, PAGE_HEIGHT - 18, CONTENT_RIGHT, PAGE_HEIGHT - 18);

    setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
    doc.text("Wolf Studio", MARGIN_LEFT, PAGE_HEIGHT - 11);
    doc.text("Home DNAâ„¢", PAGE_WIDTH / 2, PAGE_HEIGHT - 11, {
      align: "center",
    });
    doc.text(String(page - 1).padStart(2, "0"), CONTENT_RIGHT, PAGE_HEIGHT - 11, {
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
    throw new Error("Datoteke ni mogoÄe prenesti, ker je prazna.");
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
