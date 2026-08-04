import { jsPDF } from "jspdf";
import { PDF_FONT_REGULAR_BASE64, PDF_FONT_BOLD_BASE64 } from "./pdfFonts";
import type { HomeDnaReportData, ReportImageId } from "./homeDnaTypes";
import type { ReportImageAsset, ResolvedReportImages } from "./reportImages";

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
const BODY_FONT = "DejaVuSans";
const DISPLAY_FONT = "DejaVuSans";

const COLORS = {
  ink: [26, 26, 24] as const,
  muted: [105, 102, 96] as const,
  line: [220, 216, 209] as const,
  cover: [243, 240, 234] as const,
  white: [255, 255, 255] as const,
};

type PdfDocument = jsPDF;
type FontStyle = "normal" | "bold";

interface LoadedPdfImage {
  id: ReportImageId;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ReportPdfData {
  report: HomeDnaReportData;
  images: ResolvedReportImages;
  customerName: string;
  investmentRange: string;
  executionLevel: string;
}

export async function generateHomeDnaPdf(data: ReportPdfData): Promise<Blob> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
    putOnlyUsedFonts: true,
  });

  const [loadedImages] = await Promise.all([loadReportImages(data.images), registerPdfFonts(doc)]);

  addCoverPage(doc, data, loadedImages.get(data.images.cover.id));
  doc.addPage();

  let y = MARGIN_TOP;

  const startNewPage = () => {
    doc.addPage();
    y = MARGIN_TOP;
  };

  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > CONTENT_BOTTOM) startNewPage();
  };

  const addSectionHeading = (index: string, title: string) => {
    setFont(doc, DISPLAY_FONT, "bold", 19, COLORS.ink);
    const titleLines = wrapText(doc, title, CONTENT_WIDTH);
    ensureSpace(9 + titleLines.length * 8 + 9);

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
      gapAfter?: number;
    },
  ) => {
    if (!text?.trim()) return;

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
      y += 3;
    }

    y += options?.gapAfter ?? 3;
  };

  const addDivider = () => {
    ensureSpace(13);
    y += 3;
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);
    y += 10;
  };

  const addFullWidthImage = (asset: ReportImageAsset, height: number, gapAfter = 9) => {
    const image = loadedImages.get(asset.id);
    if (!image) return;
    ensureSpace(height + gapAfter);
    drawImageCover(doc, image, MARGIN_LEFT, y, CONTENT_WIDTH, height);
    y += height + gapAfter;
  };

  const addImagePair = (assets: ReportImageAsset[], height: number) => {
    const available = assets
      .map((asset) => loadedImages.get(asset.id))
      .filter((image): image is LoadedPdfImage => Boolean(image));
    if (!available.length) return;

    ensureSpace(height + 9);
    if (available.length === 1) {
      drawImageCover(doc, available[0]!, MARGIN_LEFT, y, CONTENT_WIDTH, height);
    } else {
      const gap = 6;
      const width = (CONTENT_WIDTH - gap) / 2;
      drawImageCover(doc, available[0]!, MARGIN_LEFT, y, width, height);
      drawImageCover(doc, available[1]!, MARGIN_LEFT + width + gap, y, width, height);
    }
    y += height + 9;
  };

  addSectionHeading("01", "Dobrodošli v vašem Home DNA™");
  addParagraph(data.report.intro, { color: COLORS.ink });
  addFullWidthImage(data.images.lifestyle, 70);

  ensureSpace(70);
  addSectionHeading("02", "Vaš življenjski slog");
  addParagraph(data.report.lifestyle);
  addDivider();

  ensureSpace(130);
  addSectionHeading("03", "Vaš slog");
  addImagePair(data.images.style, 58);
  addParagraph(data.report.style);

  ensureSpace(80);
  addSectionHeading("04", "Zakaj bo ta dom deloval za vas");
  addParagraph(data.report.why);
  addDivider();

  if (data.report.rooms.length > 0) {
    ensureSpace(140);
    addSectionHeading("05", "Priporočila za izbrane prostore");

    data.report.rooms.forEach((room, index) => {
      const roomImage = data.images.rooms[room.key];
      const loadedRoomImage = roomImage ? loadedImages.get(roomImage.id) : undefined;

      setFont(doc, BODY_FONT, "normal", 10.2, COLORS.muted);
      const roomTextLines = wrapText(doc, room.text, CONTENT_WIDTH);
      const imageHeight = loadedRoomImage ? 58 : 0;
      const requiredHeight = 10 + imageHeight + (loadedRoomImage ? 8 : 0) + roomTextLines.length * 6 + 13;
      ensureSpace(requiredHeight);

      if (index > 0) {
        doc.setDrawColor(...COLORS.line);
        doc.setLineWidth(0.2);
        doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);
        y += 9;
      }

      setFont(doc, DISPLAY_FONT, "bold", 13, COLORS.ink);
      doc.text(room.label, MARGIN_LEFT, y);
      y += 8;

      if (loadedRoomImage) {
        drawImageCover(doc, loadedRoomImage, MARGIN_LEFT, y, CONTENT_WIDTH, imageHeight);
        y += imageHeight + 8;
      }

      setFont(doc, BODY_FONT, "normal", 10.2, COLORS.muted);
      for (const line of roomTextLines) {
        doc.text(line, MARGIN_LEFT, y);
        y += 6;
      }
      y += 10;
    });
  }

  ensureSpace(130);
  addSectionHeading("06", "Okvirna investicija");
  const investmentImage = loadedImages.get(data.images.investment.id);
  const investmentImageWidth = investmentImage ? 70 : 0;
  const investmentGap = investmentImage ? 10 : 0;
  const investmentMetaX = MARGIN_LEFT + investmentImageWidth + investmentGap;
  const investmentMetaWidth = CONTENT_RIGHT - investmentMetaX;
  const investmentBlockHeight = 52;

  ensureSpace(investmentBlockHeight + 8);
  if (investmentImage) {
    drawImageCover(doc, investmentImage, MARGIN_LEFT, y, investmentImageWidth, investmentBlockHeight);
  }

  setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
  doc.text("OCENJENA INVESTICIJA", investmentMetaX, y + 4);
  setFont(doc, DISPLAY_FONT, "bold", 14, COLORS.ink);
  const investmentLines = wrapText(doc, data.investmentRange || "Po posvetu", investmentMetaWidth);
  investmentLines.slice(0, 2).forEach((line, index) => doc.text(line, investmentMetaX, y + 13 + index * 6.5));

  setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
  doc.text("RAVEN IZVEDBE", investmentMetaX, y + 34);
  setFont(doc, DISPLAY_FONT, "bold", 14, COLORS.ink);
  doc.text(wrapText(doc, data.executionLevel || "Premium", investmentMetaWidth).slice(0, 2), investmentMetaX, y + 43);

  y += investmentBlockHeight + 8;

  addParagraph(data.report.investment);
  addDivider();

  ensureSpace(145);
  addSectionHeading("07", "Naslednji koraki");
  data.report.nextSteps.forEach((step, index) => {
    const numberWidth = 13;
    const stepX = MARGIN_LEFT + numberWidth;
    const stepWidth = CONTENT_WIDTH - numberWidth;

    setFont(doc, DISPLAY_FONT, "bold", 12, COLORS.ink);
    const titleLines = wrapText(doc, step.title, stepWidth);
    setFont(doc, BODY_FONT, "normal", 10.2, COLORS.muted);
    const textLines = wrapText(doc, step.text, stepWidth);
    ensureSpace(titleLines.length * 6 + textLines.length * 6 + 18);

    setFont(doc, BODY_FONT, "normal", 8, COLORS.muted);
    doc.text(String(index + 1).padStart(2, "0"), MARGIN_LEFT, y);

    setFont(doc, DISPLAY_FONT, "bold", 12, COLORS.ink);
    for (const line of titleLines) {
      doc.text(line, stepX, y);
      y += 6;
    }
    y += 2;

    setFont(doc, BODY_FONT, "normal", 10.2, COLORS.muted);
    for (const line of textLines) {
      doc.text(line, stepX, y);
      y += 6;
    }
    y += 6;

    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_LEFT, y, CONTENT_RIGHT, y);
    y += 9;
  });

  addParagraph(data.report.closing, { color: COLORS.ink, gapAfter: 0 });
  addFooters(doc);

  const blob = doc.output("blob");
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error("Ustvarjeni PDF je prazen.");
  return blob;
}

async function registerPdfFonts(doc: PdfDocument) {
  doc.addFileToVFS("DejaVuSans.ttf", PDF_FONT_REGULAR_BASE64);
  doc.addFont("DejaVuSans.ttf", BODY_FONT, "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", PDF_FONT_BOLD_BASE64);
  doc.addFont("DejaVuSans-Bold.ttf", DISPLAY_FONT, "bold");
}

async function loadReportImages(images: ResolvedReportImages): Promise<Map<ReportImageId, LoadedPdfImage>> {
  const assets = [
    images.cover,
    images.lifestyle,
    ...images.style,
    ...Object.values(images.rooms),
    images.investment,
  ].filter((asset): asset is ReportImageAsset => Boolean(asset));
  const uniqueAssets = Array.from(new Map(assets.map((asset) => [asset.id, asset])).values());

  const loaded = await Promise.all(
    uniqueAssets.map(async (asset) => {
      try {
        return await loadPdfImage(asset);
      } catch (error) {
        console.warn(`Home DNA PDF: slike ${asset.id} ni bilo mogoče naložiti.`, error);
        return null;
      }
    }),
  );

  return new Map(
    loaded.filter((image): image is LoadedPdfImage => Boolean(image)).map((image) => [image.id, image] as const),
  );
}

async function loadPdfImage(asset: ReportImageAsset): Promise<LoadedPdfImage> {
  const response = await fetch(asset.src);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const dataUrl = await blobToDataUrl(await response.blob());
  const dimensions = await readImageDimensions(dataUrl);
  return { id: asset.id, dataUrl, ...dimensions };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Slike ni bilo mogoče prebrati."));
    reader.readAsDataURL(blob);
  });
}

function readImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Dimenzij slike ni bilo mogoče prebrati."));
    image.src = src;
  });
}

async function loadAssetAsBase64(assetUrl: string, message: string): Promise<string> {
  const response = await fetch(assetUrl);
  if (!response.ok) throw new Error(`${message} (${response.status}).`);
  return arrayBufferToBase64(await response.arrayBuffer());
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
}

function drawImageCover(doc: PdfDocument, image: LoadedPdfImage, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  doc.saveGraphicsState();
  doc.rect(x, y, width, height, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(image.dataUrl, "JPEG", drawX, drawY, drawWidth, drawHeight, image.id, "FAST");
  doc.restoreGraphicsState();
}

function addCoverPage(doc: PdfDocument, data: ReportPdfData, coverImage?: LoadedPdfImage) {
  doc.setFillColor(...COLORS.cover);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  if (coverImage) drawImageCover(doc, coverImage, 0, 0, PAGE_WIDTH, 184);

  doc.setFillColor(...COLORS.cover);
  doc.rect(0, 184, PAGE_WIDTH, PAGE_HEIGHT - 184, "F");

  setFont(doc, BODY_FONT, "normal", 8.5, COLORS.muted);
  doc.text("WOLF STUDIO  ·  HOME DNA™", MARGIN_LEFT, 204);

  setFont(doc, DISPLAY_FONT, "bold", 27, COLORS.ink);
  const titleLines = wrapText(doc, "Vaš osebni Home DNA™ Report", CONTENT_WIDTH);
  let titleY = 222;
  for (const line of titleLines) {
    doc.text(line, MARGIN_LEFT, titleY);
    titleY += 10;
  }

  doc.setDrawColor(...COLORS.line);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, titleY + 1, CONTENT_RIGHT, titleY + 1);

  const customerName = data.customerName.trim();
  setFont(doc, BODY_FONT, "normal", 10.5, COLORS.ink);
  if (customerName) doc.text(wrapText(doc, customerName, CONTENT_WIDTH), MARGIN_LEFT, titleY + 13);

  setFont(doc, BODY_FONT, "normal", 9, COLORS.muted);
  doc.text(formatDate(new Date()), MARGIN_LEFT, titleY + (customerName ? 25 : 14));
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
  if (!normalizedText) return [];

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

    if (line) result.push(line);
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

  if (fragment) result.push(fragment);
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
    doc.text("Home DNA™", PAGE_WIDTH / 2, PAGE_HEIGHT - 11, { align: "center" });
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

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000);
}
