import { roomOptions, styleOptions, colourDirectionOptions } from "./homeDnaData";
import { executionLevelOptions } from "./discoveryData";
import type { HomeDnaState, RoomKey } from "./homeDnaTypes";

const projectStageLabels: Record<string, string> = {
  "new-build": "Novogradnja",
  "complete-renovation": "Celovita prenova",
  "partial-renovation": "Delna prenova",
};

const propertyTypeLabels: Record<string, string> = {
  house: "Hiša",
  apartment: "Stanovanje",
  "holiday-home": "Počitniški dom",
};

const childrenLabels: Record<string, string> = {
  none: "Brez otrok",
  planning: "Otroke načrtujejo",
  yes: "Otroci",
};

export const roomLabel = (key: RoomKey) =>
  roomOptions.find((r) => r.key === key)?.title ?? key;

const styleLabel = (value: string) =>
  styleOptions.find((s) => s.value === value)?.title ?? value;

const colourLabel = (value: string) =>
  colourDirectionOptions.find((c) => c.value === value)?.title ?? value;

export const executionLevelLabel = (value: string) =>
  executionLevelOptions.find((o) => o.value === value)?.title ?? value;

/** Rooms that get their own recommendation section (never the "complete-home" meta option). */
export function reportRooms(state: HomeDnaState): RoomKey[] {
  return state.selectedRooms.filter((r) => r !== "complete-home");
}

export interface ReportInput {
  summary: string;
  rooms: { key: string; label: string }[];
  investmentLine: string;
  executionLevel: string;
}

export function buildReportInput(state: HomeDnaState): ReportInput {
  const { home, style, lifestyle, rooms } = state;
  const selected = reportRooms(state);

  const lines: string[] = [];
  const push = (label: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    lines.push(`${label}: ${value}`);
  };

  push("Ime", state.contact.name);
  push("Faza projekta", home.projectStage ? projectStageLabels[home.projectStage] : undefined);
  push("Tip nepremičnine", home.propertyType ? propertyTypeLabels[home.propertyType] : undefined);
  push("Kvadratura", home.floorArea ? `${home.floorArea} m2` : undefined);
  push(
    "Število članov gospodinjstva",
    home.householdSize ? `${home.householdSize}${home.householdSizePlus ? "+" : ""}` : undefined,
  );
  push("Otroci", home.children ? childrenLabels[home.children] : undefined);
  push("Število otrok", home.childrenCount);
  push("Hišni ljubljenčki", home.pets.join(", "));
  push("Izbrani prostori", selected.map(roomLabel).join(", "));
  push("Slogi", style.selectedStyles.map(styleLabel).join(", "));
  push("Vzdušje", style.atmosphere.join(", "));
  push("Barvna smer", style.colourDirection ? colourLabel(style.colourDirection) : undefined);
  push("Povezava z navdihom", style.inspirationUrl);
  push("Prioritete", lifestyle.priorities.join(", "));
  push("Trenutni izzivi", lifestyle.currentChallenges.join(", "));
  push("Opomba o izzivih", lifestyle.challengeNote);
  push("Prihodnje potrebe", lifestyle.futureNeeds.join(", "));

  const roomDetails = selected
    .map((key) => {
      const data =
        key === "kitchen"
          ? rooms.kitchen
          : key === "wardrobe"
            ? rooms.wardrobe
            : key === "living-room"
              ? rooms.livingRoom
              : key === "entry-hall"
                ? rooms.entryHall
                : key === "utility-room"
                  ? rooms.utilityRoom
                  : key === "bathroom"
                    ? rooms.bathroom
                    : rooms.homeOffice;
      if (!data) return null;
      const entries = Object.entries(data)
        .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== false)
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join("/") : String(v)}`);
      return entries.length ? `${roomLabel(key)}: ${entries.join(", ")}` : null;
    })
    .filter(Boolean) as string[];

  if (roomDetails.length) {
    lines.push("Podrobnosti prostorov:");
    lines.push(...roomDetails);
  }

  const est = state.investment.estimatedInvestment;
  const level = executionLevelLabel(state.investment.level);

  return {
    summary: lines.join("\n"),
    rooms: selected.map((key) => ({ key, label: roomLabel(key) })),
    investmentLine: est ? `${est.min} – ${est.max} EUR` : "Ocena bo pripravljena po posvetu",
    executionLevel: level,
  };
}
