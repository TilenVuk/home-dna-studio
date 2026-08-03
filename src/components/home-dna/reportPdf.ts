import type { HomeDnaReport } from "@/lib/homeDnaReport.functions";
import interTight from "@/assets/fonts/InterTight-Regular.ttf.asset.json";
import schibstedRegular from "@/assets/fonts/SchibstedGrotesk-Regular.ttf.asset.json";
import schibstedMedium from "@/assets/fonts/SchibstedGrotesk-Medium.ttf.asset.json";
import heroInterior from "@/assets/hero-interior.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import type { RoomKey } from "./homeDnaTypes";

const roomImages: Partial<Record<RoomKey, string>> = {
  kitchen: projectKitchen,
  wardrobe: projectCloset,
  "living-room": projectLiving,
  "entry-hall": projectHall,
  "utility-room": projectUtility,
  bathroom: projectBathroom,
  "home-office": projectOffice,
};

/* A4 dimensions in millimetres */
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 24;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_BOTTOM = PAGE_HEIGHT - 26;

/* Wolf Studio colours */
const ink = [26, 26, 24] as const;
const muted = [110, 106, 99] as const;
const line = [223, 219, 212] as const;

const CUSTOM_DISPLAY_FONT = "SchibstedGrotesk";
const CUSTOM_BODY_FONT = "InterTight";
const FALLBACK_FONT = "helvetica";

type PdfImageFormat = "JPEG" | "PNG" | "WEBP";

interface LoadedImage {
  dataUrl: string;
  format: PdfImageFormat;
}

export interface ReportPdfData {
  report: HomeDnaReport;
  customerName: string;
  investmentRange: string;
  executionLevel: string;

  /** Room keys matching the labels returned by the AI report. */
  roomKeyByLabel: Record<string, RoomKey>;
}

async function fetchBase64(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Datoteke ni bilo mogoče naložiti: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  if (buffer.byteLength === 0) {
    throw new Error("Naložena datoteka je prazna.");
  }

  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

export async function generateHomeDnaPdf(data: ReportPdfData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  /*
   * Custom font loading must never prevent the PDF from being created.
   * If loading fails, jsPDF continues with its built-in Helvetica font.
   */
  const customFontsLoaded = await registerFonts(doc);

  const displayFont = customFontsLoaded ? CUSTOM_DISPLAY_FONT : FALLBACK_FONT;

  const bodyFont = customFontsLoaded ? CUSTOM_BODY_FONT : FALLBACK_FONT;

  const images = await loadImages(data);

  /* Cover */
  if (images.cover) {
    addImageSafely(doc, images.cover, 0, 0, PAGE_WIDTH, 132);
  }

  let coverY = images.cover ? 168 : 72;

  doc.setFont(displayFont, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setCharSpace(1.4);
  doc.text("WOLF STUDIO", MARGIN, coverY);
  doc.setCharSpace(0);

  coverY += 22;

  doc.setFont(displayFont, "bold");
  doc.setFontSize(34);
  doc.setTextColor(...ink);
  doc.text("Home DNA™ Report", MARGIN, coverY);

  coverY += 16;

  doc.setDrawColor(...line);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, coverY, PAGE_WIDTH - MARGIN, coverY);

  coverY += 12;

  doc.setFont(bodyFont, "normal");
  doc.setFontSize(12);
  doc.setTextColor(...ink);

  const customerName = data.customerName.trim();

  if (customerName) {
    doc.text(customerName, MARGIN, coverY);
  }

  doc.setTextColor(...muted);
  doc.setFontSize(10);
  doc.text(formatDate(new Date()), MARGIN, coverY + (customerName ? 8 : 0));

  /* Content */
  const context = { y: 0 };

  doc.addPage();
  context.y = MARGIN + 8;

  const ensureSpace = (requiredHeight: number) => {
    if (context.y + requiredHeight <= CONTENT_BOTTOM) {
      return;
    }

    doc.addPage();
    context.y = MARGIN + 8;
  };

  const addHeading = (index: string, title: string) => {
    ensureSpace(40);

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.setCharSpace(1.2);
    doc.text(index, MARGIN, context.y);
    doc.setCharSpace(0);

    context.y += 9;

    doc.setFont(displayFont, "bold");
    doc.setFontSize(20);
    doc.setTextColor(...ink);

    const titleLines = doc.splitTextToSize(title, CONTENT_WIDTH) as string[];

    doc.text(titleLines, MARGIN, context.y);
    context.y += titleLines.length * 9 + 6;
  };

  const addParagraph = (
    text: string | undefined,
    options?: {
      colour?: readonly [number, number, number];
      size?: number;
    },
  ) => {
    if (!text?.trim()) {
      return;
    }

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(options?.size ?? 10.5);

    const colour = options?.colour ?? muted;
    doc.setTextColor(...colour);

    const normalizedText = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .trim();

    const lines = doc.splitTextToSize(normalizedText, CONTENT_WIDTH) as string[];

    const lineHeight = 6;

    for (const currentLine of lines) {
      ensureSpace(lineHeight);
      doc.text(currentLine, MARGIN, context.y);
      context.y += lineHeight;
    }

    context.y += 6;
  };

  const addDivider = (spacing = 10) => {
    ensureSpace(spacing + 4);

    context.y += spacing / 2;

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, context.y, PAGE_WIDTH - MARGIN, context.y);

    context.y += spacing;
  };

  const { report } = data;

  addHeading("01", "Dobrodošli v vašem Home DNA™");
  addParagraph(report.intro);
  addDivider(12);

  addHeading("02", "Vaš življenjski slog");
  addParagraph(report.lifestyle);
  addDivider(12);

  addHeading("03", "Vaš slog");
  addParagraph(report.style);
  addDivider(12);

  addHeading("04", "Zakaj bo ta dom deloval za vas");
  addParagraph(report.why);
  addDivider(12);

  if (report.rooms.length > 0) {
    addHeading("05", "Priporočila za izbrane prostore");

    report.rooms.forEach((room, index) => {
      const image = images.rooms[room.label];

      ensureSpace(image ? 62 : 34);

      if (index > 0) {
        doc.setDrawColor(...line);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, context.y - 4, PAGE_WIDTH - MARGIN, context.y - 4);
      }

      if (image) {
        addImageSafely(doc, image, MARGIN, context.y, 52, 34);

        context.y += 40;
      }

      doc.setFont(displayFont, "bold");
      doc.setFontSize(13);
      doc.setTextColor(...ink);
      doc.text(room.label, MARGIN, context.y);

      context.y += 8;

      addParagraph(room.text);
      context.y += 4;
    });

    addDivider(8);
  }

  addHeading("06", "Okvirna investicija");
  ensureSpace(26);

  doc.setFont(bodyFont, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.setCharSpace(1.1);

  doc.text("OCENJENA INVESTICIJA", MARGIN, context.y);

  doc.text("RAVEN IZVEDBE", MARGIN + CONTENT_WIDTH / 2, context.y);

  doc.setCharSpace(0);
  context.y += 9;

  doc.setFont(displayFont, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...ink);

  doc.text(data.investmentRange || "Po posvetu", MARGIN, context.y);

  doc.text(data.executionLevel || "Premium", MARGIN + CONTENT_WIDTH / 2, context.y);

  context.y += 12;

  addParagraph(report.investment);
  addDivider(12);

  addHeading("07", "Naslednji koraki");

  report.nextSteps.forEach((step, index) => {
    ensureSpace(28);

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text(String(index + 1).padStart(2, "0"), MARGIN, context.y);

    doc.setFont(displayFont, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text(step.title, MARGIN + 12, context.y);

    context.y += 7;

    const stepLines = doc.splitTextToSize(step.text, CONTENT_WIDTH - 12) as string[];

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...muted);

    for (const currentLine of stepLines) {
      ensureSpace(6);
      doc.text(currentLine, MARGIN + 12, context.y);
      context.y += 6;
    }

    context.y += 4;

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, context.y, PAGE_WIDTH - MARGIN, context.y);

    context.y += 10;
  });

  context.y += 6;
  addParagraph(report.closing, { colour: ink });

  /* Footers */
  const totalPages = doc.getNumberOfPages();

  for (let page = 2; page <= totalPages; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_HEIGHT - 18, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 18);

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);

    doc.text("Wolf Studio", MARGIN, PAGE_HEIGHT - 12);

    doc.text("Home DNA™", PAGE_WIDTH / 2, PAGE_HEIGHT - 12, { align: "center" });

    doc.text(String(page - 1).padStart(2, "0"), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 12, { align: "right" });
  }

  const pdfBlob = doc.output("blob");

  if (!(pdfBlob instanceof Blob) || pdfBlob.size === 0) {
    throw new Error("Ustvarjeni PDF je prazen.");
  }

  return pdfBlob;
}

async function registerFonts(doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>): Promise<boolean> {
  try {
    const [bodyFont, displayFont, displayMedium] = await Promise.all([
      fetchBase64(interTight.url),
      fetchBase64(schibstedRegular.url),
      fetchBase64(schibstedMedium.url),
    ]);

    doc.addFileToVFS("InterTight-Regular.ttf", bodyFont);
    doc.addFont("InterTight-Regular.ttf", CUSTOM_BODY_FONT, "normal");

    doc.addFileToVFS("Schibsted-Regular.ttf", displayFont);
    doc.addFont("Schibsted-Regular.ttf", CUSTOM_DISPLAY_FONT, "normal");

    doc.addFileToVFS("Schibsted-Medium.ttf", displayMedium);
    doc.addFont("Schibsted-Medium.ttf", CUSTOM_DISPLAY_FONT, "bold");

    return true;
  } catch (fontError: unknown) {
    console.warn("Wolf Studio PDF fonts could not be loaded. Using Helvetica fallback.", fontError);

    return false;
  }
}

async function loadImages(data: ReportPdfData): Promise<{
  cover: LoadedImage | null;
  rooms: Record<string, LoadedImage>;
}> {
  const cover = await loadImage(heroInterior);
  const rooms: Record<string, LoadedImage> = {};

  await Promise.all(
    data.report.rooms.map(async (room) => {
      const roomKey = data.roomKeyByLabel[room.label];
      const source = roomKey ? roomImages[roomKey] : undefined;

      if (!source) {
        return;
      }

      const loadedImage = await loadImage(source);

      if (loadedImage) {
        rooms[room.label] = loadedImage;
      }
    }),
  );

  return { cover, rooms };
}

async function loadImage(source: string): Promise<LoadedImage | null> {
  try {
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`Slike ni bilo mogoče naložiti: ${response.status}`);
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error("Naložena slika je prazna.");
    }

    const dataUrl = await blobToDataUrl(blob);

    return {
      dataUrl,
      format: detectImageFormat(blob.type, dataUrl),
    };
  } catch (imageError: unknown) {
    console.warn(`PDF image could not be loaded: ${source}`, imageError);

    return null;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Slike ni bilo mogoče pretvoriti v podatkovni URL."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Slike ni bilo mogoče prebrati."));
    };

    reader.readAsDataURL(blob);
  });
}

function detectImageFormat(mimeType: string, dataUrl: string): PdfImageFormat {
  const source = `${mimeType} ${dataUrl}`.toLowerCase();

  if (source.includes("png")) {
    return "PNG";
  }

  if (source.includes("webp")) {
    return "WEBP";
  }

  return "JPEG";
}

function addImageSafely(
  doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>,
  image: LoadedImage,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  try {
    doc.addImage(image.dataUrl, image.format, x, y, width, height, undefined, "FAST");
  } catch (imageError: unknown) {
    console.warn("Image was omitted from the PDF because jsPDF could not process it.", imageError);
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

  /*
   * URL-ja ne sprostimo takoj, ker nekateri brskalniki sicer
   * prekinejo začeti prenos.
   */
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1_000);
}
