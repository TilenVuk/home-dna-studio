import { generateText, NoObjectGeneratedError, NoOutputGeneratedError, Output } from "ai";
import { z } from "zod";
import type { HomeDnaReportData, ReportImageId, RoomKey } from "@/components/home-dna/homeDnaTypes";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ReportSchema = z.object({
  intro: z.string(),
  lifestyle: z.string(),
  style: z.string(),
  why: z.string(),
  images: z.object({
    coverImageId: z.string(),
    lifestyleImageId: z.string(),
    styleImageIds: z.array(z.string()).min(1).max(2),
  }),
  rooms: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      text: z.string(),
      imageId: z.string(),
    }),
  ),
  investment: z.string(),
  nextSteps: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
  closing: z.string(),
});

interface ImageChoice {
  id: string;
  label: string;
}

interface ReportRequest {
  summary: string;
  rooms: Array<{ key: string; label: string }>;
  investmentLine: string;
  executionLevel: string;
  imageCandidates: {
    cover: ImageChoice[];
    lifestyle: ImageChoice[];
    style: ImageChoice[];
    rooms: Array<{ key: string; label: string; images: ImageChoice[] }>;
  };
}

const SYSTEM = [
  "Pišeš osebno Home DNA™ poročilo za WOLF STUDIO.",
  "Piši samo slovensko, v prvi osebi množine, strokovno, toplo in jedrnato.",
  "Ne omenjaj AI-ja, vprašalnika, obrazca ali načina zbiranja podatkov.",
  "Ne uporabljaj praznih marketinških fraz ali tehničnega mizarskega žargona.",
  "Vsak odstavek naj poda novo, konkretno vrednost in naj ostane znotraj zahtevane omejitve besed.",
  "Za slike uporabi izključno dobesedne ID-je iz ponujenega seznama.",
].join(" ");

export async function createHomeDnaReport(data: ReportRequest, apiKey: string): Promise<HomeDnaReportData> {
  const gateway = createLovableAiGatewayProvider(apiKey, undefined, {
    structuredOutputs: true,
  });

  const prompt = [
    "PROJEKT",
    data.summary,
    `Investicija: ${data.investmentLine}`,
    `Raven izvedbe: ${data.executionLevel}`,
    "",
    "BESEDILO",
    "intro: največ 45 besed; osebni uvod in osrednja vizija.",
    "lifestyle: največ 55 besed; vsakdanje rutine, prioritete in prihodnje potrebe.",
    "style: največ 45 besed; slog, vzdušje, barve in ključni materiali.",
    "why: največ 65 besed; poveži ljudi, način življenja in prostorske odločitve brez ponavljanja.",
    `rooms: samo ${data.rooms.map((room) => `${room.key} (${room.label})`).join(", ")}; ohrani vrstni red, key in label; za vsak prostor največ 55 besed oziroma 2–3 konkretne povedi.`,
    "investment: največ 30 besed; ocena je okvirna, končna ponudba sledi po posvetu in izmerah; brez številk.",
    "nextSteps: natanko Posvet, Izmere, Končni oblikovalski predlog; opis vsakega največ 18 besed.",
    "closing: največ 16 besed.",
    "",
    "IZBOR SLIK",
    `Naslovnica: ${formatChoices(data.imageCandidates.cover)}`,
    `Življenjski slog: ${formatChoices(data.imageCandidates.lifestyle)}`,
    `Slog (izberi 1 ali 2 različni): ${formatChoices(data.imageCandidates.style)}`,
    ...data.imageCandidates.rooms.map((room) => `${room.key} (${room.label}): ${formatChoices(room.images)}`),
    "Izberi sliko, ki najbolje podpira vsebino posameznega razdelka. Ne vračaj URL-jev ali opisov namesto ID-ja.",
  ].join("\n");

  try {
    const result = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      output: Output.object({ schema: ReportSchema }),
      system: SYSTEM,
      prompt,
      maxOutputTokens: 8_000,
      maxRetries: 0,
    });

    return normalizeReport(result.output, data);
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      console.error("HomeDnaReport: model returned no structured output; using safe report fallback");
      return createFallbackReport(data);
    }

    if (!NoObjectGeneratedError.isInstance(error)) throw error;

    const recovered = recoverReport(error.text, data);
    if (recovered) return recovered;

    console.error("HomeDnaReport: invalid structured response", {
      hasText: Boolean(error.text),
      textLength: error.text?.length ?? 0,
      cause: error.cause instanceof Error ? error.cause.message : String(error.cause ?? "unknown"),
    });
    return createFallbackReport(data);
  }
}

function formatChoices(choices: ImageChoice[]): string {
  return choices.map((choice) => `${choice.id} (${choice.label})`).join(", ") || "brez izbire";
}

function normalizeReport(raw: z.infer<typeof ReportSchema>, data: ReportRequest): HomeDnaReportData {
  const rawRooms = Array.isArray(raw.rooms) ? raw.rooms : [];
  const rooms = data.rooms.map((requestedRoom, index) => {
    const generatedRoom =
      rawRooms.find((room) => room.key === requestedRoom.key) ??
      rawRooms.find((room) => room.label === requestedRoom.label) ??
      rawRooms[index];
    const candidates = data.imageCandidates.rooms.find((room) => room.key === requestedRoom.key)?.images ?? [];

    return {
      key: requestedRoom.key as RoomKey,
      label: requestedRoom.label,
      text: limitWords(
        generatedRoom?.text ||
          "Predlagamo jasno razporeditev, dovolj prilagojenega shranjevanja in rešitve, ki poenostavijo vsakodnevno uporabo prostora.",
        55,
      ),
      imageId: pickImageId(generatedRoom?.imageId, candidates, "hero-interior"),
    };
  });

  const styleImageIds = normalizeStyleImages(raw.images?.styleImageIds, data.imageCandidates.style);

  const fallbackSteps = [
    { title: "Posvet", text: "Skupaj preverimo prioritete, slogovno smer in obseg projekta." },
    {
      title: "Izmere",
      text: "Na lokaciji natančno preverimo prostor, priključke in vse ključne mere.",
    },
    {
      title: "Končni oblikovalski predlog",
      text: "Pripravimo usklajen predlog rešitev, materialov in naslednjih odločitev.",
    },
  ];

  const nextSteps = fallbackSteps.map((fallback, index) => {
    const generated = raw.nextSteps?.[index];
    return {
      title: generated?.title?.trim() || fallback.title,
      text: limitWords(generated?.text || fallback.text, 18),
    };
  });

  return {
    intro: limitWords(raw.intro, 45),
    lifestyle: limitWords(raw.lifestyle, 55),
    style: limitWords(raw.style, 45),
    why: limitWords(raw.why, 65),
    images: {
      coverImageId: pickImageId(raw.images?.coverImageId, data.imageCandidates.cover, "hero-interior"),
      lifestyleImageId: pickImageId(raw.images?.lifestyleImageId, data.imageCandidates.lifestyle, "lifestyle-people"),
      styleImageIds,
    },
    rooms,
    investment: limitWords(raw.investment, 30),
    nextSteps,
    closing: limitWords(raw.closing, 16),
  };
}

function normalizeStyleImages(requestedIds: string[] | undefined, candidates: ImageChoice[]): ReportImageId[] {
  const allowedIds = new Set(candidates.map((choice) => choice.id));
  const selected = [...(requestedIds ?? []), ...candidates.map((choice) => choice.id)].filter(
    (id, index, ids) => allowedIds.has(id) && ids.indexOf(id) === index,
  );

  return (selected.length ? selected : ["detail-material"]).slice(0, 2) as ReportImageId[];
}

function pickImageId(requestedId: string | undefined, choices: ImageChoice[], fallback: ReportImageId): ReportImageId {
  const selected = choices.some((choice) => choice.id === requestedId) ? requestedId : choices[0]?.id;
  return (selected || fallback) as ReportImageId;
}

function limitWords(text: string | undefined, maximum: number): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const words = normalized.split(" ");
  if (words.length <= maximum) return normalized;

  return `${words
    .slice(0, maximum)
    .join(" ")
    .replace(/[,:;.!?–—-]+$/u, "")}…`;
}

function recoverReport(text: string | undefined, data: ReportRequest): HomeDnaReportData | null {
  const value = parseJsonObject(text);
  const parsed = ReportSchema.safeParse(value);
  return parsed.success ? normalizeReport(parsed.data, data) : null;
}

function parseJsonObject(text?: string): unknown {
  if (!text) return null;
  const unfenced = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  try {
    return JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    return null;
  }
}

function createFallbackReport(data: ReportRequest): HomeDnaReportData {
  const roomFallbacks = data.rooms.map((room) => {
    const candidates = data.imageCandidates.rooms.find((candidate) => candidate.key === room.key)?.images ?? [];

    return {
      key: room.key as RoomKey,
      label: room.label,
      text: "Prostor bomo zasnovali okoli vaših vsakodnevnih navad, z jasno razporeditvijo, premišljenim shranjevanjem in materiali, ki ostajajo prijetni za uporabo skozi čas.",
      imageId: pickImageId(undefined, candidates, "hero-interior"),
    };
  });

  return {
    intro:
      "Vaš dom razumemo kot celoto, ki mora podpirati ritem družine, poenostaviti vsakdan in ustvariti mirno osnovo za prihodnja leta.",
    lifestyle:
      "Pri načrtovanju bomo izhajali iz vaših rutin, prioritet in prihodnjih potreb. Vsaka rešitev bo imela jasen namen: manj vsakodnevnega nereda, več preglednosti in prostor, ki se naravno prilagaja načinu vašega življenja.",
    style:
      "Oblikovalsko smer bomo gradili z umirjenimi razmerji, trajnostnimi materiali in usklajeno barvno paleto. Rezultat bo oseben, arhitekturno čist in dovolj brezčasen, da bo ostal aktualen tudi ob spremembah vašega doma.",
    why:
      "Dom bo deloval zato, ker posameznih kosov ne bomo obravnavali ločeno. Povezali bomo gibanje skozi prostore, shranjevanje, druženje in vsakodnevne obveznosti v enoten sistem. Tako bo pohištvo sledilo vašim navadam, prostori pa bodo ostali pregledni, prijetni in pripravljeni na spremembe, ki jih prinaša življenje.",
    images: {
      coverImageId: pickImageId(undefined, data.imageCandidates.cover, "hero-interior"),
      lifestyleImageId: pickImageId(undefined, data.imageCandidates.lifestyle, "lifestyle-people"),
      styleImageIds: normalizeStyleImages(undefined, data.imageCandidates.style),
    },
    rooms: roomFallbacks,
    investment:
      "Ocena je okvirna. Končno ponudbo bomo pripravili po osebnem posvetu, natančnih izmerah in potrditvi materialov.",
    nextSteps: [
      { title: "Posvet", text: "Skupaj preverimo prioritete, slogovno smer in obseg projekta." },
      { title: "Izmere", text: "Na lokaciji natančno preverimo prostor, priključke in vse ključne mere." },
      {
        title: "Končni oblikovalski predlog",
        text: "Pripravimo usklajen predlog rešitev, materialov in naslednjih odločitev.",
      },
    ],
    closing: "Vaš dom bomo oblikovali okoli načina, kako v njem zares živite.",
  };
}
