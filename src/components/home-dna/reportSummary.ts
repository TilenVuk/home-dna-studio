import { roomOptions, styleOptions, colourDirectionOptions } from "./homeDnaData";
import { executionLevelOptions, kitchenFrontMaterialLabels } from "./discoveryData";
import { buildReportImageCandidates } from "./reportImages";
import { kitchenWallLengthCm } from "./pricing";
import type { HomeDnaState, ReportImageCandidates, RoomKey } from "./homeDnaTypes";

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

const cookingFrequencyLabels: Record<string, string> = {
  rarely: "Občasno",
  weekly: "Večkrat na teden",
  daily: "Vsak dan",
};

const workFromHomeFrequencyLabels: Record<string, string> = {
  never: "Nikoli",
  sometimes: "Občasno",
  frequently: "Pogosto",
};

const hostingFrequencyLabels: Record<string, string> = {
  rarely: "Redko",
  occasionally: "Občasno",
  often: "Pogosto",
};

export const roomLabel = (key: RoomKey) => roomOptions.find((r) => r.key === key)?.title ?? key;

export function roomLabelForState(key: RoomKey, state: HomeDnaState): string {
  if (key !== "children-room") return roomLabel(key);
  const count = state.home.childrenCount ?? 1;
  return `${roomLabel(key)} (${count}${state.home.childrenCountPlus ? "+" : ""})`;
}

const styleLabel = (value: string) => styleOptions.find((s) => s.value === value)?.title ?? value;

const colourLabel = (value: string) =>
  colourDirectionOptions.find((c) => c.value === value)?.title ?? value;

export const executionLevelLabel = (value: string) =>
  executionLevelOptions.find((o) => o.value === value)?.title ?? value;

/** Rooms that get their own recommendation section (never the "complete-home" meta option). */
export function reportRooms(state: HomeDnaState): RoomKey[] {
  return state.selectedRooms.filter((r) => r !== "complete-home");
}

export interface ReportInput {
  projectSummary: string;
  turnstileToken: string;
  rooms: { key: string; label: string }[];
  investmentLine: string;
  executionLevel: string;
  imageCandidates: ReportImageCandidates;
}

export function buildReportInput(state: HomeDnaState): ReportInput {
  const { home, style, lifestyle, rooms } = state;
  const selected = reportRooms(state);

  const lines: string[] = [];
  const push = (label: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    lines.push(`${label}: ${value}`);
  };

  push("Faza projekta", home.projectStage ? projectStageLabels[home.projectStage] : undefined);
  push("Tip nepremičnine", home.propertyType ? propertyTypeLabels[home.propertyType] : undefined);
  push("Kvadratura", home.floorArea ? `${home.floorArea} m2` : undefined);
  push(
    "Število članov gospodinjstva",
    home.householdSize ? `${home.householdSize}${home.householdSizePlus ? "+" : ""}` : undefined,
  );
  push("Otroci", home.children ? childrenLabels[home.children] : undefined);
  push(
    "Število otrok",
    home.childrenCount ? `${home.childrenCount}${home.childrenCountPlus ? "+" : ""}` : undefined,
  );
  push("Hišni ljubljenčki", home.pets.join(", "));
  push("Izbrani prostori", selected.map((key) => roomLabelForState(key, state)).join(", "));
  push("Slogi", style.selectedStyles.map(styleLabel).join(", "));
  push("Vzdušje", style.atmosphere.join(", "));
  push("Barvna smer", style.colourDirection ? colourLabel(style.colourDirection) : undefined);
  push("Prioritete", lifestyle.priorities.join(", "));
  push(
    "Pogostost kuhanja",
    lifestyle.cookingFrequency ? cookingFrequencyLabels[lifestyle.cookingFrequency] : undefined,
  );
  push(
    "Delo od doma",
    lifestyle.workFromHomeFrequency
      ? workFromHomeFrequencyLabels[lifestyle.workFromHomeFrequency]
      : undefined,
  );
  push(
    "Pogostost gostov",
    lifestyle.hostingFrequency ? hostingFrequencyLabels[lifestyle.hostingFrequency] : undefined,
  );
  push("Hobiji in oprema", lifestyle.hobbies.join(", "));
  push("Trenutni izzivi", lifestyle.currentChallenges.join(", "));
  push("Opomba o izzivih", lifestyle.challengeNote);
  push("Prihodnje potrebe", lifestyle.futureNeeds.join(", "));
  push(
    "Material kuhinjskih front",
    rooms.kitchen?.frontMaterial
      ? kitchenFrontMaterialLabels[rooms.kitchen.frontMaterial]
      : undefined,
  );
  push("Prioritete kuhinjskih front", rooms.kitchen?.frontPriorities?.join(", "));

  const roomDetails = selected
    .map((key) => {
      const kitchenData = key === "kitchen" ? rooms.kitchen : undefined;
      const data =
        key === "kitchen"
          ? kitchenData
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
                    : key === "bedroom"
                      ? rooms.bedroom
                      : rooms.childrenRoom;
      if (!data) return null;
      const reportData = kitchenData
        ? {
            ...kitchenData,
            ...(kitchenData.frontMaterial
              ? { frontMaterial: kitchenFrontMaterialLabels[kitchenData.frontMaterial] }
              : {}),
            ...(kitchenData.hasLed ? { ledLength: kitchenWallLengthCm(kitchenData) } : {}),
            ...(kitchenData.hasGlassFronts
              ? { glassFrontLength: kitchenWallLengthCm(kitchenData) }
              : {}),
          }
        : data;
      const entries = Object.entries(reportData)
        .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== false)
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join("/") : String(v)}`);
      return entries.length ? `${roomLabelForState(key, state)}: ${entries.join(", ")}` : null;
    })
    .filter(Boolean) as string[];

  if (roomDetails.length) {
    lines.push("Podrobnosti prostorov:");
    lines.push(...roomDetails);
  }

  const est = state.investment.estimatedInvestment;
  const level = executionLevelLabel(state.investment.level);

  return {
    projectSummary: lines.join("\n"),
    turnstileToken: state.contact.turnstileToken,
    rooms: selected.map((key) => ({ key, label: roomLabelForState(key, state) })),
    investmentLine: est ? `${est.min} – ${est.max} EUR` : "Ocena bo pripravljena po posvetu",
    executionLevel: level,
    imageCandidates: buildReportImageCandidates(state),
  };
}
