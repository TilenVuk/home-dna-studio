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

/* Page geometry (A4, mm) */
const PW = 210;
const PH = 297;
const M = 24;
const CW = PW - M * 2;
const BOTTOM = PH - 26;

/* Brand colours */
const ink = [26, 26, 24] as const;
const muted = [110, 106, 99] as const;
const line = [223, 219, 212] as const;

const DISPLAY = "SchibstedGrotesk";
const BODY = "InterTight";

async function fetchBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export interface ReportPdfData {
  report: HomeDnaReport;
  customerName: string;
  investmentRange: string;
  executionLevel: string;
  /** Ordered room keys matching report.rooms labels, used to pick a room image. */
  roomKeyByLabel: Record<string, RoomKey>;
}

export async function generateHomeDnaPdf(data: ReportPdfData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const [bodyFont, displayFont, displayMedium] = await Promise.all([
    fetchBase64(interTight.url),
    fetchBase64(schibstedRegular.url),
    fetchBase64(schibstedMedium.url),
  ]);
  doc.addFileToVFS("InterTight-Regular.ttf", bodyFont);
  doc.addFont("InterTight-Regular.ttf", BODY, "normal");
  doc.addFileToVFS("Schibsted-Regular.ttf", displayFont);
  doc.addFont("Schibsted-Regular.ttf", DISPLAY, "normal");
  doc.addFileToVFS("Schibsted-Medium.ttf", displayMedium);
  doc.addFont("Schibsted-Medium.ttf", DISPLAY, "bold");

  const images = await loadImages(data);

  /* ---------------- Cover ---------------- */
  if (images.cover) {
    doc.addImage(images.cover, "JPEG", 0, 0, PW, 132, undefined, "FAST");
  }
  let cy = images.cover ? 168 : 96;
  doc.setFont(DISPLAY, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setCharSpace(1.4);
  doc.text("WOLF STUDIO", M, cy);
  doc.setCharSpace(0);

  cy += 22;
  doc.setFont(DISPLAY, "bold");
  doc.setFontSize(34);
  doc.setTextColor(...ink);
  doc.text("Home DNA™ Report", M, cy);

  cy += 16;
  doc.setDrawColor(...line);
  doc.setLineWidth(0.2);
  doc.line(M, cy, PW - M, cy);

  cy += 12;
  doc.setFont(BODY, "normal");
  doc.setFontSize(12);
  doc.setTextColor(...ink);
  if (data.customerName) doc.text(data.customerName, M, cy);
  doc.setTextColor(...muted);
  doc.setFontSize(10);
  doc.text(formatDate(new Date()), M, cy + (data.customerName ? 8 : 0));

  /* ---------------- Sections ---------------- */
  const ctx = { y: 0 };
  doc.addPage();
  ctx.y = M + 8;

  const ensure = (needed: number) => {
    if (ctx.y + needed > BOTTOM) {
      doc.addPage();
      ctx.y = M + 8;
    }
  };

  const heading = (index: string, title: string) => {
    ensure(40);
    doc.setFont(BODY, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.setCharSpace(1.2);
    doc.text(index, M, ctx.y);
    doc.setCharSpace(0);
    ctx.y += 9;
    doc.setFont(DISPLAY, "bold");
    doc.setFontSize(20);
    doc.setTextColor(...ink);
    const lines = doc.splitTextToSize(title, CW);
    doc.text(lines, M, ctx.y);
    ctx.y += lines.length * 9 + 6;
  };

  const paragraph = (text: string, opts?: { colour?: readonly number[]; size?: number }) => {
    if (!text) return;
    doc.setFont(BODY, "normal");
    doc.setFontSize(opts?.size ?? 10.5);
    const colour = opts?.colour ?? muted;
    doc.setTextColor(colour[0]!, colour[1]!, colour[2]!);
    const lines = doc.splitTextToSize(text.replace(/\s+\n/g, "\n"), CW) as string[];
    const lh = 6;
    for (const l of lines) {
      ensure(lh);
      doc.text(l, M, ctx.y);
      ctx.y += lh;
    }
    ctx.y += 6;
  };

  const divider = (space = 10) => {
    ensure(space + 4);
    ctx.y += space / 2;
    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(M, ctx.y, PW - M, ctx.y);
    ctx.y += space;
  };

  const { report } = data;

  heading("01", "Dobrodošli v vašem Home DNA™");
  paragraph(report.intro);
  divider(12);

  heading("02", "Vaš življenjski slog");
  paragraph(report.lifestyle);
  divider(12);

  heading("03", "Vaš slog");
  paragraph(report.style);
  divider(12);

  heading("04", "Zakaj bo ta dom deloval za vas");
  paragraph(report.why);
  divider(12);

  if (report.rooms.length > 0) {
    heading("05", "Priporočila za izbrane prostore");
    report.rooms.forEach((room, i) => {
      const img = images.rooms[room.label];
      ensure(img ? 62 : 34);
      if (i > 0) {
        doc.setDrawColor(...line);
        doc.line(M, ctx.y - 4, PW - M, ctx.y - 4);
      }
      if (img) {
        doc.addImage(img, "JPEG", M, ctx.y, 52, 34, undefined, "FAST");
        ctx.y += 40;
      }
      doc.setFont(DISPLAY, "bold");
      doc.setFontSize(13);
      doc.setTextColor(...ink);
      doc.text(room.label, M, ctx.y);
      ctx.y += 8;
      paragraph(room.text);
      ctx.y += 4;
    });
    divider(8);
  }

  heading("06", "Okvirna investicija");
  ensure(26);
  doc.setFont(BODY, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.setCharSpace(1.1);
  doc.text("OCENJENA INVESTICIJA", M, ctx.y);
  doc.text("RAVEN IZVEDBE", M + CW / 2, ctx.y);
  doc.setCharSpace(0);
  ctx.y += 9;
  doc.setFont(DISPLAY, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...ink);
  doc.text(data.investmentRange, M, ctx.y);
  doc.text(data.executionLevel, M + CW / 2, ctx.y);
  ctx.y += 12;
  paragraph(report.investment);
  divider(12);

  heading("07", "Naslednji koraki");
  report.nextSteps.forEach((step, i) => {
    ensure(28);
    doc.setFont(BODY, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(String(i + 1).padStart(2, "0"), M, ctx.y);
    doc.setFont(DISPLAY, "bold");
    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text(step.title, M + 12, ctx.y);
    ctx.y += 7;
    const lines = doc.splitTextToSize(step.text, CW - 12) as string[];
    doc.setFont(BODY, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...muted);
    for (const l of lines) {
      ensure(6);
      doc.text(l, M + 12, ctx.y);
      ctx.y += 6;
    }
    ctx.y += 4;
    doc.setDrawColor(...line);
    doc.line(M, ctx.y, PW - M, ctx.y);
    ctx.y += 10;
  });

  ctx.y += 6;
  paragraph(report.closing, { colour: ink });

  /* ---------------- Footers ---------------- */
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(...line);
    doc.setLineWidth(0.2);
    doc.line(M, PH - 18, PW - M, PH - 18);
    doc.setFont(BODY, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("Wolf Studio", M, PH - 12);
    doc.text("Home DNA™", PW / 2, PH - 12, { align: "center" });
    doc.text(String(p - 1).padStart(2, "0"), PW - M, PH - 12, { align: "right" });
  }

  return doc.output("blob");
}

async function loadImages(data: ReportPdfData) {
  const toDataUrl = async (src: string): Promise<string | null> => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const cover = await toDataUrl(heroInterior);
  const rooms: Record<string, string> = {};
  for (const room of data.report.rooms) {
    const key = data.roomKeyByLabel[room.label];
    const src = key ? roomImages[key] : undefined;
    if (!src) continue;
    const url = await toDataUrl(src);
    if (url) rooms[room.label] = url;
  }
  return { cover, rooms };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
