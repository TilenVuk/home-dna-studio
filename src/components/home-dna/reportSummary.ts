import { roomOptions, styleOptions, colourDirectionOptions } from "./homeDnaData";
import { executionLevelOptions, kitchenFrontMaterialLabels } from "./discoveryData";
import { buildReportImageCandidates } from "./reportImages";
import { getRoomQuantity, kitchenWallLengthCm } from "./pricing";
import type { HomeDnaState, ReportImageCandidates, RoomKey } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

const labels = {
  sl: {
    projectStage: {
      "new-build": "Novogradnja",
      "complete-renovation": "Celovita prenova",
      "partial-renovation": "Delna prenova",
    },
    propertyType: { house: "Hiša", apartment: "Stanovanje", "holiday-home": "Počitniški dom" },
    children: { none: "Brez otrok", planning: "Otroke načrtujejo", yes: "Otroci" },
    cooking: { rarely: "Občasno", weekly: "Večkrat na teden", daily: "Vsak dan" },
    work: { never: "Nikoli", sometimes: "Občasno", frequently: "Pogosto" },
    hosting: { rarely: "Redko", occasionally: "Občasno", often: "Pogosto" },
    fields: {
      stage: "Faza projekta",
      property: "Tip nepremičnine",
      area: "Kvadratura",
      adults: "Število članov gospodinjstva",
      children: "Otroci",
      childrenCount: "Število otrok",
      pets: "Hišni ljubljenčki",
      rooms: "Izbrani prostori",
      styles: "Slogi",
      atmosphere: "Vzdušje",
      colour: "Barvna smer",
      priorities: "Prioritete",
      cooking: "Pogostost kuhanja",
      work: "Delo od doma",
      hosting: "Pogostost gostov",
      hobbies: "Hobiji in oprema",
      challenges: "Trenutni izzivi",
      challengeNote: "Opomba o izzivih",
      future: "Prihodnje potrebe",
      fronts: "Material kuhinjskih front",
      frontPriorities: "Prioritete kuhinjskih front",
      roomDetails: "Podrobnosti prostorov:",
      estimateAfterConsultation: "Ocena bo pripravljena po posvetu",
    },
  },
  hr: {
    projectStage: {
      "new-build": "Novogradnja",
      "complete-renovation": "Cjelovita renovacija",
      "partial-renovation": "Djelomična renovacija",
    },
    propertyType: { house: "Kuća", apartment: "Stan", "holiday-home": "Kuća za odmor" },
    children: { none: "Bez djece", planning: "Planiraju djecu", yes: "Djeca" },
    cooking: { rarely: "Povremeno", weekly: "Nekoliko puta tjedno", daily: "Svaki dan" },
    work: { never: "Nikada", sometimes: "Povremeno", frequently: "Često" },
    hosting: { rarely: "Rijetko", occasionally: "Povremeno", often: "Često" },
    fields: {
      stage: "Faza projekta",
      property: "Vrsta nekretnine",
      area: "Površina",
      adults: "Broj članova kućanstva",
      children: "Djeca",
      childrenCount: "Broj djece",
      pets: "Kućni ljubimci",
      rooms: "Odabrani prostori",
      styles: "Stilovi",
      atmosphere: "Ugođaj",
      colour: "Smjer boja",
      priorities: "Prioriteti",
      cooking: "Učestalost kuhanja",
      work: "Rad od kuće",
      hosting: "Učestalost gostiju",
      hobbies: "Hobiji i oprema",
      challenges: "Trenutni izazovi",
      challengeNote: "Napomena o izazovima",
      future: "Buduće potrebe",
      fronts: "Materijal kuhinjskih fronti",
      frontPriorities: "Prioriteti kuhinjskih fronti",
      roomDetails: "Detalji prostora:",
      estimateAfterConsultation: "Procjena će biti pripremljena nakon konzultacija",
    },
  },
  en: {
    projectStage: {
      "new-build": "New build",
      "complete-renovation": "Complete renovation",
      "partial-renovation": "Partial renovation",
    },
    propertyType: { house: "House", apartment: "Apartment", "holiday-home": "Holiday home" },
    children: { none: "No children", planning: "Planning children", yes: "Children" },
    cooking: { rarely: "Occasionally", weekly: "Several times a week", daily: "Every day" },
    work: { never: "Never", sometimes: "Sometimes", frequently: "Frequently" },
    hosting: { rarely: "Rarely", occasionally: "Occasionally", often: "Often" },
    fields: {
      stage: "Project stage",
      property: "Property type",
      area: "Floor area",
      adults: "Household size",
      children: "Children",
      childrenCount: "Number of children",
      pets: "Pets",
      rooms: "Selected rooms",
      styles: "Styles",
      atmosphere: "Atmosphere",
      colour: "Colour direction",
      priorities: "Priorities",
      cooking: "Cooking frequency",
      work: "Working from home",
      hosting: "Hosting frequency",
      hobbies: "Hobbies and equipment",
      challenges: "Current challenges",
      challengeNote: "Challenge note",
      future: "Future needs",
      fronts: "Kitchen front material",
      frontPriorities: "Kitchen front priorities",
      roomDetails: "Room details:",
      estimateAfterConsultation: "Estimate will be prepared after the consultation",
    },
  },
} as const;

const roomTranslations: Record<Locale, Partial<Record<RoomKey, string>>> = {
  sl: {},
  hr: {
    kitchen: "Kuhinja",
    wardrobe: "Garderoba",
    "living-room": "Dnevni boravak",
    "entry-hall": "Predsoblje",
    "utility-room": "Gospodarska prostorija",
    bathroom: "Kupaonica",
    bedroom: "Spavaća soba",
    "children-room": "Dječje sobe",
  },
  en: {
    kitchen: "Kitchen",
    wardrobe: "Wardrobe",
    "living-room": "Living room",
    "entry-hall": "Entry hall",
    "utility-room": "Utility room",
    bathroom: "Bathroom",
    bedroom: "Bedroom",
    "children-room": "Children's rooms",
  },
};

export const roomLabel = (key: RoomKey, locale: Locale = "sl") =>
  roomTranslations[locale][key] ?? roomOptions.find((r) => r.key === key)?.title ?? key;

export function roomLabelForState(
  key: RoomKey,
  state: HomeDnaState,
  locale: Locale = "sl",
): string {
  if (!["wardrobe", "bathroom", "children-room"].includes(key)) return roomLabel(key, locale);
  const quantity = getRoomQuantity(state, key);
  return `${roomLabel(key, locale)} (${quantity.value}${quantity.plus ? "+" : ""})`;
}

const styleLabel = (value: string) => styleOptions.find((s) => s.value === value)?.title ?? value;
const colourLabel = (value: string) =>
  colourDirectionOptions.find((c) => c.value === value)?.title ?? value;
export const executionLevelLabel = (value: string) =>
  executionLevelOptions.find((o) => o.value === value)?.title ?? value;

export function reportRooms(state: HomeDnaState): RoomKey[] {
  return state.selectedRooms.filter((r) => r !== "complete-home");
}

export interface ReportInput {
  locale: Locale;
  projectSummary: string;
  turnstileToken: string;
  rooms: { key: string; label: string }[];
  investmentLine: string;
  executionLevel: string;
  imageCandidates: ReportImageCandidates;
}

export function buildReportInput(state: HomeDnaState, locale: Locale = "sl"): ReportInput {
  const { home, style, lifestyle, rooms } = state;
  const selected = reportRooms(state);
  const t = labels[locale];

  const lines: string[] = [];
  const push = (label: string, value?: string | number | boolean | null) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    lines.push(`${label}: ${value}`);
  };

  push(t.fields.stage, home.projectStage ? t.projectStage[home.projectStage] : undefined);
  push(t.fields.property, home.propertyType ? t.propertyType[home.propertyType] : undefined);
  push(t.fields.area, home.floorArea ? `${home.floorArea} m2` : undefined);
  push(
    t.fields.adults,
    home.householdSize ? `${home.householdSize}${home.householdSizePlus ? "+" : ""}` : undefined,
  );
  push(t.fields.children, home.children ? t.children[home.children] : undefined);
  push(
    t.fields.childrenCount,
    home.childrenCount ? `${home.childrenCount}${home.childrenCountPlus ? "+" : ""}` : undefined,
  );
  push(t.fields.pets, home.pets.join(", "));
  push(t.fields.rooms, selected.map((key) => roomLabelForState(key, state, locale)).join(", "));
  push(t.fields.styles, style.selectedStyles.map(styleLabel).join(", "));
  push(t.fields.atmosphere, style.atmosphere.join(", "));
  push(t.fields.colour, style.colourDirection ? colourLabel(style.colourDirection) : undefined);
  push(t.fields.priorities, lifestyle.priorities.join(", "));
  push(
    t.fields.cooking,
    lifestyle.cookingFrequency ? t.cooking[lifestyle.cookingFrequency] : undefined,
  );
  push(
    t.fields.work,
    lifestyle.workFromHomeFrequency ? t.work[lifestyle.workFromHomeFrequency] : undefined,
  );
  push(
    t.fields.hosting,
    lifestyle.hostingFrequency ? t.hosting[lifestyle.hostingFrequency] : undefined,
  );
  push(t.fields.hobbies, lifestyle.hobbies.join(", "));
  push(t.fields.challenges, lifestyle.currentChallenges.join(", "));
  push(t.fields.challengeNote, lifestyle.challengeNote);
  push(t.fields.future, lifestyle.futureNeeds.join(", "));
  push(
    t.fields.fronts,
    rooms.kitchen?.frontMaterial
      ? kitchenFrontMaterialLabels[rooms.kitchen.frontMaterial]
      : undefined,
  );
  push(t.fields.frontPriorities, rooms.kitchen?.frontPriorities?.join(", "));

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
      return entries.length
        ? `${roomLabelForState(key, state, locale)}: ${entries.join(", ")}`
        : null;
    })
    .filter(Boolean) as string[];

  if (roomDetails.length) {
    lines.push(t.fields.roomDetails);
    lines.push(...roomDetails);
  }

  const est = state.investment.estimatedInvestment;
  const level = executionLevelLabel(state.investment.level);

  return {
    locale,
    projectSummary: lines.join("\n"),
    turnstileToken: state.contact.turnstileToken,
    rooms: selected.map((key) => ({ key, label: roomLabelForState(key, state, locale) })),
    investmentLine: est ? `${est.min} – ${est.max} EUR` : t.fields.estimateAfterConsultation,
    executionLevel: level,
    imageCandidates: buildReportImageCandidates(state),
  };
}
