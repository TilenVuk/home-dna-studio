import heroInterior from "@/assets/hero-interior.jpg";
import lifestyleIntro from "@/assets/lifestyle-intro.jpg";
import lifestylePeople from "@/assets/lifestyle-people.jpg";
import styleIntro from "@/assets/style-intro.jpg";
import detailMaterial from "@/assets/detail-material.jpg";
import propertyHouse from "@/assets/property-house.jpg";
import propertyApartment from "@/assets/property-apartment.jpg";
import propertyHoliday from "@/assets/property-holiday.jpg";
import stageNewBuild from "@/assets/stage-new-build.jpg";
import stageFullRenovation from "@/assets/stage-full-renovation.jpg";
import stagePartialRenovation from "@/assets/stage-partial-renovation.jpg";
import styleWarmModern from "@/assets/style-warm-modern.jpg";
import styleMinimal from "@/assets/style-minimal.jpg";
import styleScandinavian from "@/assets/style-scandinavian.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import styleNatural from "@/assets/style-natural.jpg";
import styleClassic from "@/assets/style-classic.jpg";
import styleDark from "@/assets/style-dark.jpg";
import styleRustic from "@/assets/style-rustic.jpg";
import colourLight from "@/assets/colour-light.jpg";
import colourEarthy from "@/assets/colour-earthy.jpg";
import colourNeutral from "@/assets/colour-neutral.jpg";
import colourDark from "@/assets/colour-dark.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectWardrobe from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectEntry from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import kitchenLayoutLinear from "@/assets/kitchen-layout-linear.jpg";
import kitchenLayoutL from "@/assets/kitchen-layout-l.jpg";
import kitchenLayoutU from "@/assets/kitchen-layout-u.jpg";
import kitchenLayoutIsland from "@/assets/kitchen-layout-island.jpg";
import worktopLaminate from "@/assets/worktop-laminate.jpg";
import worktopPremiumLaminate from "@/assets/worktop-premium-laminate.jpg";
import worktopQuartz from "@/assets/worktop-quartz.jpg";
import worktopStone from "@/assets/worktop-stone.jpg";
import wardrobeHinged from "@/assets/wardrobe-hinged.jpg";
import wardrobeSliding from "@/assets/wardrobe-sliding.jpg";
import wardrobeOpen from "@/assets/wardrobe-open.jpg";
import investmentEssential from "@/assets/investment-essential.jpg";
import investmentConsidered from "@/assets/investment-considered.jpg";
import investmentSignature from "@/assets/investment-signature.jpg";
import reportKitchenSocial from "@/assets/report-kitchen-social.jpg";
import reportWardrobeOrganised from "@/assets/report-wardrobe-organised.jpg";
import reportLivingFamily from "@/assets/report-living-family.jpg";
import reportEntryFamily from "@/assets/report-entry-family.jpg";
import reportUtilityOrganised from "@/assets/report-utility-organised.jpg";
import reportBathroomCalm from "@/assets/report-bathroom-calm.jpg";
import reportOfficeFocus from "@/assets/report-office-focus.jpg";
import type {
  HomeDnaReportData,
  HomeDnaState,
  ReportImageCandidates,
  ReportImageChoice,
  ReportImageId,
  RoomKey,
} from "./homeDnaTypes";

export interface ReportImageAsset {
  id: ReportImageId;
  src: string;
  label: string;
  alt: string;
}

export interface ResolvedReportImages {
  cover: ReportImageAsset;
  lifestyle: ReportImageAsset;
  style: ReportImageAsset[];
  rooms: Partial<Record<RoomKey, ReportImageAsset>>;
  investment: ReportImageAsset;
}

const asset = (id: ReportImageId, src: string, label: string, alt = label): ReportImageAsset => ({
  id,
  src,
  label,
  alt,
});

export const REPORT_IMAGES: Record<ReportImageId, ReportImageAsset> = {
  "hero-interior": asset("hero-interior", heroInterior, "Celostno oblikovan interier"),
  "lifestyle-intro": asset("lifestyle-intro", lifestyleIntro, "Dom kot podpora vsakdanu"),
  "lifestyle-people": asset("lifestyle-people", lifestylePeople, "Življenje in druženje doma"),
  "style-intro": asset("style-intro", styleIntro, "Slogovna usmeritev doma"),
  "detail-material": asset("detail-material", detailMaterial, "Materiali in premišljeni detajli"),
  "property-house": asset("property-house", propertyHouse, "Sodobna hiša"),
  "property-apartment": asset("property-apartment", propertyApartment, "Sodobno stanovanje"),
  "property-holiday": asset("property-holiday", propertyHoliday, "Umirjen počitniški dom"),
  "stage-new-build": asset("stage-new-build", stageNewBuild, "Vizija novogradnje"),
  "stage-full-renovation": asset("stage-full-renovation", stageFullRenovation, "Celovita prenova"),
  "stage-partial-renovation": asset(
    "stage-partial-renovation",
    stagePartialRenovation,
    "Delna prenova",
  ),
  "style-warm-modern": asset("style-warm-modern", styleWarmModern, "Toplo modern slog"),
  "style-minimal": asset("style-minimal", styleMinimal, "Sodobno minimalističen slog"),
  "style-scandinavian": asset("style-scandinavian", styleScandinavian, "Skandinavski slog"),
  "style-japandi": asset("style-japandi", styleJapandi, "Japandi slog"),
  "style-natural": asset("style-natural", styleNatural, "Naravno sodoben slog"),
  "style-classic": asset("style-classic", styleClassic, "Brezčasno klasičen slog"),
  "style-dark": asset("style-dark", styleDark, "Temno eleganten slog"),
  "style-rustic": asset("style-rustic", styleRustic, "Moderno rustikalen slog"),
  "colour-light": asset("colour-light", colourLight, "Svetla in zračna barvna smer"),
  "colour-earthy": asset("colour-earthy", colourEarthy, "Topla in zemeljska barvna smer"),
  "colour-neutral": asset("colour-neutral", colourNeutral, "Nevtralna in brezčasna barvna smer"),
  "colour-dark": asset("colour-dark", colourDark, "Temna in izrazita barvna smer"),
  "project-kitchen": asset("project-kitchen", projectKitchen, "Kuhinja po meri"),
  "project-wardrobe": asset("project-wardrobe", projectWardrobe, "Garderoba po meri"),
  "project-living": asset("project-living", projectLiving, "Dnevna soba po meri"),
  "project-entry": asset("project-entry", projectEntry, "Predsoba po meri"),
  "project-utility": asset("project-utility", projectUtility, "Funkcionalen utility"),
  "project-bathroom": asset("project-bathroom", projectBathroom, "Kopalniško pohištvo po meri"),
  "project-office": asset("project-office", projectOffice, "Domača pisarna po meri"),
  "kitchen-layout-linear": asset("kitchen-layout-linear", kitchenLayoutLinear, "Ravna kuhinja"),
  "kitchen-layout-l": asset("kitchen-layout-l", kitchenLayoutL, "Kuhinja v obliki L"),
  "kitchen-layout-u": asset("kitchen-layout-u", kitchenLayoutU, "Kuhinja v obliki U"),
  "kitchen-layout-island": asset("kitchen-layout-island", kitchenLayoutIsland, "Kuhinja z otokom"),
  "worktop-laminate": asset("worktop-laminate", worktopLaminate, "Klasičen laminatni pult"),
  "worktop-premium-laminate": asset(
    "worktop-premium-laminate",
    worktopPremiumLaminate,
    "Premium laminat ali kompakt",
  ),
  "worktop-quartz": asset("worktop-quartz", worktopQuartz, "Quartz delovna površina"),
  "worktop-stone": asset("worktop-stone", worktopStone, "Delovna površina iz naravnega kamna"),
  "wardrobe-hinged": asset("wardrobe-hinged", wardrobeHinged, "Garderoba s krilnimi vrati"),
  "wardrobe-sliding": asset("wardrobe-sliding", wardrobeSliding, "Garderoba z drsnimi vrati"),
  "wardrobe-open": asset("wardrobe-open", wardrobeOpen, "Odprta garderoba"),
  "investment-essential": asset(
    "investment-essential",
    investmentEssential,
    "Osnovna raven izvedbe",
  ),
  "investment-considered": asset(
    "investment-considered",
    investmentConsidered,
    "Premium raven izvedbe",
  ),
  "investment-signature": asset(
    "investment-signature",
    investmentSignature,
    "Signature raven izvedbe",
  ),
  "report-kitchen-social": asset(
    "report-kitchen-social",
    reportKitchenSocial,
    "Družinska kuhinja z otokom in skritim shranjevanjem",
  ),
  "report-wardrobe-organised": asset(
    "report-wardrobe-organised",
    reportWardrobeOrganised,
    "Organizirana garderoba z osvetlitvijo",
  ),
  "report-living-family": asset(
    "report-living-family",
    reportLivingFamily,
    "Družinska dnevna soba z vgradnim pohištvom",
  ),
  "report-entry-family": asset(
    "report-entry-family",
    reportEntryFamily,
    "Družinska predsoba s klopjo in skritim shranjevanjem",
  ),
  "report-utility-organised": asset(
    "report-utility-organised",
    reportUtilityOrganised,
    "Organiziran utility s pralnim stolpom in omaro za čiščenje",
  ),
  "report-bathroom-calm": asset(
    "report-bathroom-calm",
    reportBathroomCalm,
    "Umirjena kopalnica z veliko shranjevanja",
  ),
  "report-office-focus": asset(
    "report-office-focus",
    reportOfficeFocus,
    "Domača pisarna za dve osebi",
  ),
};

const styleImageByValue: Record<string, ReportImageId> = {
  "warm-modern": "style-warm-modern",
  "contemporary-minimal": "style-minimal",
  scandinavian: "style-scandinavian",
  japandi: "style-japandi",
  "natural-contemporary": "style-natural",
  "timeless-classic": "style-classic",
  "dark-elegant": "style-dark",
  "modern-rustic": "style-rustic",
};

const colourImageByValue: Record<string, ReportImageId> = {
  "light-airy": "colour-light",
  "warm-earthy": "colour-earthy",
  "neutral-timeless": "colour-neutral",
  "dark-expressive": "colour-dark",
};

const propertyImageByValue: Record<string, ReportImageId> = {
  house: "property-house",
  apartment: "property-apartment",
  "holiday-home": "property-holiday",
};

const stageImageByValue: Record<string, ReportImageId> = {
  "new-build": "stage-new-build",
  "complete-renovation": "stage-full-renovation",
  "partial-renovation": "stage-partial-renovation",
};

const kitchenLayoutImageByValue: Record<string, ReportImageId> = {
  linear: "kitchen-layout-linear",
  "l-shape": "kitchen-layout-l",
  "u-shape": "kitchen-layout-u",
  "with-island": "kitchen-layout-island",
};

const worktopImageByValue: Record<string, ReportImageId> = {
  "classic-laminate": "worktop-laminate",
  "premium-laminate": "worktop-premium-laminate",
  quartz: "worktop-quartz",
  "natural-stone": "worktop-stone",
};

const wardrobeImageByValue: Record<string, ReportImageId> = {
  hinged: "wardrobe-hinged",
  sliding: "wardrobe-sliding",
  open: "wardrobe-open",
};

const roomLabels: Record<Exclude<RoomKey, "complete-home">, string> = {
  kitchen: "Kuhinja",
  wardrobe: "Garderoba",
  "living-room": "Dnevna soba",
  "entry-hall": "Predsoba",
  "utility-room": "Utility",
  bathroom: "Kopalnica",
  "home-office": "Domača pisarna",
};

function uniqueIds(ids: Array<ReportImageId | undefined>): ReportImageId[] {
  return Array.from(new Set(ids.filter((id): id is ReportImageId => Boolean(id))));
}

function choices(ids: Array<ReportImageId | undefined>): ReportImageChoice[] {
  return uniqueIds(ids).map((id) => ({ id, label: REPORT_IMAGES[id].label }));
}

function roomImageIds(key: Exclude<RoomKey, "complete-home">, state: HomeDnaState) {
  switch (key) {
    case "kitchen":
      return uniqueIds([
        state.rooms.kitchen?.layout
          ? kitchenLayoutImageByValue[state.rooms.kitchen.layout]
          : undefined,
        state.rooms.kitchen?.worktop ? worktopImageByValue[state.rooms.kitchen.worktop] : undefined,
        "report-kitchen-social",
        "project-kitchen",
      ]);
    case "wardrobe":
      return uniqueIds([
        state.rooms.wardrobe?.doorType
          ? wardrobeImageByValue[state.rooms.wardrobe.doorType]
          : undefined,
        "report-wardrobe-organised",
        "project-wardrobe",
      ]);
    case "living-room":
      return ["report-living-family", "project-living"] as ReportImageId[];
    case "entry-hall":
      return ["report-entry-family", "project-entry"] as ReportImageId[];
    case "utility-room":
      return ["report-utility-organised", "project-utility"] as ReportImageId[];
    case "bathroom":
      return ["report-bathroom-calm", "project-bathroom"] as ReportImageId[];
    case "home-office":
      return ["report-office-focus", "project-office"] as ReportImageId[];
  }
}

export function buildReportImageCandidates(state: HomeDnaState): ReportImageCandidates {
  const selectedStyles = state.style.selectedStyles.map((value) => styleImageByValue[value]);
  const colourImage = state.style.colourDirection
    ? colourImageByValue[state.style.colourDirection]
    : undefined;
  const propertyImage = state.home.propertyType
    ? propertyImageByValue[state.home.propertyType]
    : undefined;
  const stageImage = state.home.projectStage
    ? stageImageByValue[state.home.projectStage]
    : undefined;

  const selectedRooms = state.selectedRooms.filter(
    (key): key is Exclude<RoomKey, "complete-home"> => key !== "complete-home",
  );

  return {
    cover: choices([...selectedStyles, propertyImage, stageImage, "hero-interior"]),
    lifestyle: choices(["lifestyle-people", "lifestyle-intro", propertyImage]),
    style: choices([...selectedStyles, colourImage, "detail-material", "style-intro"]),
    rooms: selectedRooms.map((key) => ({
      key,
      label: roomLabels[key],
      images: choices(roomImageIds(key, state)),
    })),
  };
}

function pickAllowed(
  requestedId: ReportImageId | undefined,
  allowed: ReportImageChoice[],
): ReportImageAsset {
  const allowedIds = new Set(allowed.map((item) => item.id));
  const selectedId = requestedId && allowedIds.has(requestedId) ? requestedId : allowed[0]?.id;
  return REPORT_IMAGES[selectedId ?? "hero-interior"];
}

export function resolveReportImages(
  state: HomeDnaState,
  report: HomeDnaReportData,
): ResolvedReportImages {
  const candidates = buildReportImageCandidates(state);
  const requestedStyleIds = report.images?.styleImageIds ?? [];
  const allowedStyleIds = new Set(candidates.style.map((item) => item.id));
  const selectedStyleIds = uniqueIds([
    ...requestedStyleIds.filter((id) => allowedStyleIds.has(id)),
    ...candidates.style.map((item) => item.id),
  ]).slice(0, 2);

  const roomImages: Partial<Record<RoomKey, ReportImageAsset>> = {};
  for (const room of report.rooms) {
    const roomCandidates = candidates.rooms.find((item) => item.key === room.key)?.images ?? [];
    roomImages[room.key] = pickAllowed(room.imageId, roomCandidates);
  }

  const investmentImageId: Record<HomeDnaState["investment"]["level"], ReportImageId> = {
    basic: "investment-essential",
    premium: "investment-considered",
    signature: "investment-signature",
  };

  return {
    cover: pickAllowed(report.images?.coverImageId, candidates.cover),
    lifestyle: pickAllowed(report.images?.lifestyleImageId, candidates.lifestyle),
    style: selectedStyleIds.map((id) => REPORT_IMAGES[id]),
    rooms: roomImages,
    investment: REPORT_IMAGES[investmentImageId[state.investment.level]],
  };
}
