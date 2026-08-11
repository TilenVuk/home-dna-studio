import type { HomeDnaReportData } from "@/components/home-dna/homeDnaTypes";
import type { Locale } from "./i18n";
import { createHomeDnaReport } from "./homeDnaReport.server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";
const TIMEOUT_MS = 35_000;

type BaseRequest = Parameters<typeof createHomeDnaReport>[0];
type LocalizedRequest = BaseRequest & { locale: Locale };

export async function createLocalizedHomeDnaReport(
  data: LocalizedRequest,
  options: { apiKey?: string | undefined; model?: string | undefined },
): Promise<HomeDnaReportData> {
  const { locale, ...baseRequest } = data;
  const baseReport = await createHomeDnaReport(baseRequest, options);
  if (locale === "sl") return baseReport;

  const apiKey = options.apiKey?.trim();
  if (!apiKey) return baseReport;

  try {
    return await translateReport(baseReport, locale, apiKey, normalizeModelName(options.model));
  } catch (error) {
    console.error("HomeDnaReport: localization failed; returning base report", {
      locale,
      reason: error instanceof Error ? error.message : String(error),
    });
    return baseReport;
  }
}

async function translateReport(
  report: HomeDnaReportData,
  locale: Exclude<Locale, "sl">,
  apiKey: string,
  model: string,
): Promise<HomeDnaReportData> {
  const language = locale === "hr" ? "Croatian" : "English";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_API_URL}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `Translate the provided Home DNA report into ${language}. Preserve the JSON structure exactly. Preserve room key values and all image ID values exactly. Translate all human-readable prose, room labels and next-step titles. Do not add, remove or reorder fields. Keep Home DNA™ and Nuveli Studio unchanged.`,
            },
          ],
        },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(report) }] }],
        generationConfig: {
          candidateCount: 1,
          temperature: 0.1,
          maxOutputTokens: 8_000,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Gemini translation failed with status ${response.status}`);
    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) throw new Error("Gemini translation returned an empty response");
    const translated = JSON.parse(text) as HomeDnaReportData;
    return preserveStableIds(report, translated);
  } finally {
    clearTimeout(timeoutId);
  }
}

function preserveStableIds(source: HomeDnaReportData, translated: HomeDnaReportData): HomeDnaReportData {
  return {
    ...translated,
    images: source.images,
    rooms: source.rooms.map((room, index) => ({
      ...(translated.rooms[index] ?? room),
      key: room.key,
      imageId: room.imageId,
    })),
  };
}

function normalizeModelName(value: string | undefined): string {
  const model = value?.trim() || DEFAULT_GEMINI_MODEL;
  return /^[a-zA-Z0-9._-]+$/.test(model) ? model : DEFAULT_GEMINI_MODEL;
}
