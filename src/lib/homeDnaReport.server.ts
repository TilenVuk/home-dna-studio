import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ReportSchema = z.object({
  intro: z.string(),
  lifestyle: z.string(),
  style: z.string(),
  why: z.string(),
  rooms: z.array(z.object({ label: z.string(), text: z.string() })),
  investment: z.string(),
  nextSteps: z.array(z.object({ title: z.string(), text: z.string() })),
  closing: z.string(),
});

export interface HomeDnaReportData {
  intro: string;
  lifestyle: string;
  style: string;
  why: string;
  rooms: Array<{ label: string; text: string }>;
  investment: string;
  nextSteps: Array<{ title: string; text: string }>;
  closing: string;
}

interface ReportRequest {
  summary: string;
  rooms: Array<{ key: string; label: string }>;
  investmentLine: string;
  executionLevel: string;
}

const SYSTEM = [
  "Ti si izkušen notranji oblikovalec studia WOLF STUDIO in pišeš osebno pripravljeno poročilo Home DNA™ za stranko.",
  "Pišeš izključno v slovenščini, v prvi osebi množine (mi, vaša ekipa Wolf Studio).",
  "Ton: premijski, strokoven, topel, oseben in jasen.",
  "Izogibaj se marketinškim frazam, pretiranemu razkošnemu besedišču in tehničnemu mizarskemu izrazoslovju.",
  "Nikoli ne omenjaj umetne inteligence, modelov, vprašalnika, obrazca ali podatkov iz obrazca.",
  "Piši tekoče odstavke brez naštevanja s pomišljaji. Poročilo naj bo jedrnato, berljivo in navdihujoče.",
].join(" ");

export async function createHomeDnaReport(
  data: ReportRequest,
  apiKey: string,
): Promise<HomeDnaReportData> {
  const gateway = createLovableAiGatewayProvider(apiKey, undefined, {
    structuredOutputs: true,
  });

  const prompt = [
    "Podatki o projektu stranke:",
    data.summary,
    "",
    `Okvirna investicija: ${data.investmentLine}`,
    `Raven izvedbe: ${data.executionLevel}`,
    "",
    "Napiši poročilo z naslednjimi deli:",
    "intro: 3–5 stavkov osebnega uvoda (za koga je projekt, celotna vizija, kaj ta dom dela poseben).",
    "lifestyle: povzetek življenjskega sloga (vsakodnevne rutine, prioritete, trenutni izzivi, prihodnje potrebe) in kako naj dom podpira njihov vsakdan. 1–2 odstavka.",
    "style: opis izbranih slogov, vzdušja in barvne smeri. Če je stranka dodala povezavo z navdihom, omeni, da jo bomo upoštevali pri oblikovanju.",
    "why: naslov razdelka je 'Zakaj bo ta dom deloval za vas'. Med 80 in 120 besedami poveži življenjski slog, gospodinjstvo, izbrani slog, trenutne izzive, prihodnje potrebe in izbrane prostore v eno osebno zgodbo ter pojasni, kako se te odločitve povezujejo v dom, ki podpira njihov vsakdan. Ne ponavljaj že napisanega iz prejšnjih razdelkov in ne naštevaj odgovorov; piši tekoče in naravno.",
    `rooms: priporočila SAMO za te prostore, v tem vrstnem redu: ${data.rooms.map((room) => room.label).join(", ")}. Za vsak prostor uporabi točno ta zapis oznake (label) in v 3–5 stavkih pojasni, čemu dati prednost, ključna funkcionalna priporočila in ideje za organizacijo. Ne dodajaj drugih prostorov.`,
    "investment: kratko pojasnilo, da gre za okvirno oceno in da bo končna ponudba pripravljena po posvetu in izmerah. Ne pojasnjuj izračuna in ne navajaj številk.",
    "nextSteps: točno trije koraki (Posvet, Izmere, Končni oblikovalski predlog), vsak z naslovom in 1–2 stavkoma.",
    "closing: en topel zaključni stavek s povabilom, da projekt nadaljujemo skupaj.",
  ].join("\n");

  try {
    const { output } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      output: Output.object({ schema: ReportSchema }),
      system: SYSTEM,
      prompt,
      maxOutputTokens: 8000,
    });
    return output;
  } catch (error) {
    if (!NoObjectGeneratedError.isInstance(error)) throw error;

    const recovered = recoverReport(error.text, data.rooms);
    if (recovered) return recovered;

    console.error("HomeDnaReport: invalid structured response", {
      hasText: Boolean(error.text),
      textLength: error.text?.length ?? 0,
      cause: error.cause instanceof Error ? error.cause.message : String(error.cause ?? "unknown"),
    });
    throw new Error("Poročila trenutno ni bilo mogoče pripraviti.");
  }
}

function recoverReport(
  text: string | undefined,
  requestedRooms: Array<{ label: string }>,
): HomeDnaReportData | null {
  const value = parseJsonObject(text);
  if (!value) return null;

  const source = asRecord(value);
  if (!source) return null;

  const rooms = normalizeRooms(source.rooms, requestedRooms);
  const nextSteps = normalizeSteps(source.nextSteps ?? source.next_steps);
  const candidate = {
    intro: asText(source.intro),
    lifestyle: asText(source.lifestyle),
    style: asText(source.style),
    why: asText(source.why),
    rooms,
    investment: asText(source.investment),
    nextSteps,
    closing: asText(source.closing),
  };

  const parsed = ReportSchema.safeParse(candidate);
  return parsed.success && Object.values(candidate).every((item) =>
    Array.isArray(item) ? item.length > 0 : item.length > 0,
  )
    ? parsed.data
    : null;
}

function parseJsonObject(text?: string): unknown {
  if (!text) return null;
  const unfenced = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string").join("\n").trim();
  return "";
}

function normalizeRooms(
  value: unknown,
  requestedRooms: Array<{ label: string }>,
): Array<{ label: string; text: string }> {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const room = asRecord(item);
      if (!room) return [];
      const label = asText(room.label) || requestedRooms[index]?.label || "";
      const text = asText(room.text ?? room.description ?? room.recommendation);
      return label && text ? [{ label, text }] : [];
    });
  }
  const rooms = asRecord(value);
  return rooms
    ? Object.entries(rooms).flatMap(([label, room]) => {
        const text = asText(room);
        return text ? [{ label, text }] : [];
      })
    : [];
}

function normalizeSteps(value: unknown): Array<{ title: string; text: string }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const step = asRecord(item);
    if (!step) return [];
    const title = asText(step.title);
    const text = asText(step.text ?? step.description);
    return title && text ? [{ title, text }] : [];
  });
}