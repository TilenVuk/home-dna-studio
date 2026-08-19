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
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectChildRoom from "@/assets/project-child-room.jpg";
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
import reportBedroomCalm from "@/assets/report-bedroom-calm.jpg";
import reportChildRoomFlexible from "@/assets/report-child-room-flexible.jpg";
import type {
  HomeDnaReportData,
  HomeDnaState,
  KitchenFrontMaterial,
  ReportImageCandidates,
  ReportImageChoice,
  ReportImageId,
  RoomKey,
} from "./homeDnaTypes";
import { getRoomQuantity, kitchenWallLengthCm } from "./pricing";

type ReportRoomKey = Exclude<RoomKey, "complete-home">;
type RoomSize = "compact" | "medium" | "generous";

export interface ReportImageTags {
  rooms?: ReportRoomKey[];
  styles?: string[];
  colours?: string[];
  propertyTypes?: string[];
  projectStages?: string[];
  sizes?: RoomSize[];
  kitchenLayouts?: string[];
  kitchenWorktops?: string[];
  kitchenFrontMaterials?: KitchenFrontMaterial[];
  wardrobeDoors?: string[];
  lifestyle?: string[];
}

export interface ReportImageAsset {
  id: ReportImageId;
  src: string;
  label: string;
  alt: string;
  tags: ReportImageTags;
}

export interface ResolvedReportImages {
  cover: ReportImageAsset;
  lifestyle: ReportImageAsset;
  style: ReportImageAsset[];
  rooms: Partial<Record<RoomKey, ReportImageAsset>>;
  investment: ReportImageAsset;
}

const asset = (
  id: ReportImageId,
  src: string,
  label: string,
  tags: ReportImageTags = {},
  alt = label,
): ReportImageAsset => ({
  id,
  src,
  label,
  alt,
  tags,
});

export const REPORT_IMAGES: Record<ReportImageId, ReportImageAsset> = {
  "hero-interior": asset("hero-interior", heroInterior, "Celostno oblikovan interier"),
  "lifestyle-intro": asset("lifestyle-intro", lifestyleIntro, "Dom kot podpora vsakdanu", {
    lifestyle: ["future-ready", "organisation"],
  }),
  "lifestyle-people": asset("lifestyle-people", lifestylePeople, "Življenje in druženje doma", {
    lifestyle: ["family", "hosting"],
  }),
  "style-intro": asset("style-intro", styleIntro, "Slogovna usmeritev doma"),
  "detail-material": asset("detail-material", detailMaterial, "Materiali in premišljeni detajli"),
  "property-house": asset("property-house", propertyHouse, "Sodobna hiša", {
    propertyTypes: ["house"],
  }),
  "property-apartment": asset("property-apartment", propertyApartment, "Sodobno stanovanje", {
    propertyTypes: ["apartment"],
  }),
  "property-holiday": asset("property-holiday", propertyHoliday, "Umirjen počitniški dom", {
    propertyTypes: ["holiday-home"],
  }),
  "stage-new-build": asset("stage-new-build", stageNewBuild, "Vizija novogradnje", {
    projectStages: ["new-build"],
  }),
  "stage-full-renovation": asset("stage-full-renovation", stageFullRenovation, "Celovita prenova", {
    projectStages: ["complete-renovation"],
  }),
  "stage-partial-renovation": asset(
    "stage-partial-renovation",
    stagePartialRenovation,
    "Delna prenova",
    {
      projectStages: ["partial-renovation"],
    },
  ),
  "style-warm-modern": asset("style-warm-modern", styleWarmModern, "Toplo modern slog", {
    styles: ["warm-modern"],
  }),
  "style-minimal": asset("style-minimal", styleMinimal, "Sodobno minimalističen slog", {
    styles: ["contemporary-minimal"],
  }),
  "style-scandinavian": asset("style-scandinavian", styleScandinavian, "Skandinavski slog", {
    styles: ["scandinavian"],
  }),
  "style-japandi": asset("style-japandi", styleJapandi, "Japandi slog", { styles: ["japandi"] }),
  "style-natural": asset("style-natural", styleNatural, "Naravno sodoben slog", {
    styles: ["natural-contemporary"],
  }),
  "style-classic": asset("style-classic", styleClassic, "Brezčasno klasičen slog", {
    styles: ["timeless-classic"],
  }),
  "style-dark": asset("style-dark", styleDark, "Temno eleganten slog", {
    styles: ["dark-elegant"],
  }),
  "style-rustic": asset("style-rustic", styleRustic, "Moderno rustikalen slog", {
    styles: ["modern-rustic"],
  }),
  "colour-light": asset("colour-light", colourLight, "Svetla in zračna barvna smer", {
    colours: ["light-airy"],
  }),
  "colour-earthy": asset("colour-earthy", colourEarthy, "Topla in zemeljska barvna smer", {
    colours: ["warm-earthy"],
  }),
  "colour-neutral": asset("colour-neutral", colourNeutral, "Nevtralna in brezčasna barvna smer", {
    colours: ["neutral-timeless"],
  }),
  "colour-dark": asset("colour-dark", colourDark, "Temna in izrazita barvna smer", {
    colours: ["dark-expressive"],
  }),
  "project-kitchen": asset("project-kitchen", projectKitchen, "Kuhinja po meri", {
    rooms: ["kitchen"],
  }),
  "project-wardrobe": asset("project-wardrobe", projectWardrobe, "Garderoba po meri", {
    rooms: ["wardrobe"],
  }),
  "project-living": asset("project-living", projectLiving, "Dnevna soba po meri", {
    rooms: ["living-room"],
  }),
  "project-entry": asset("project-entry", projectEntry, "Predsoba po meri", {
    rooms: ["entry-hall"],
  }),
  "project-utility": asset("project-utility", projectUtility, "Funkcionalen utility", {
    rooms: ["utility-room"],
  }),
  "project-bathroom": asset("project-bathroom", projectBathroom, "Kopalniško pohištvo po meri", {
    rooms: ["bathroom"],
  }),
  "project-bedroom": asset("project-bedroom", projectBedroom, "Spalnica po meri", {
    rooms: ["bedroom"],
  }),
  "project-child-room": asset("project-child-room", projectChildRoom, "Otroška soba po meri", {
    rooms: ["children-room"],
  }),
  "kitchen-layout-linear": asset("kitchen-layout-linear", kitchenLayoutLinear, "Ravna kuhinja", {
    rooms: ["kitchen"],
    kitchenLayouts: ["linear"],
  }),
  "kitchen-layout-l": asset("kitchen-layout-l", kitchenLayoutL, "Kuhinja v obliki L", {
    rooms: ["kitchen"],
    kitchenLayouts: ["l-shape"],
  }),
  "kitchen-layout-u": asset("kitchen-layout-u", kitchenLayoutU, "Kuhinja v obliki U", {
    rooms: ["kitchen"],
    kitchenLayouts: ["u-shape"],
  }),
  "kitchen-layout-island": asset("kitchen-layout-island", kitchenLayoutIsland, "Kuhinja z otokom", {
    rooms: ["kitchen"],
    kitchenLayouts: ["with-island"],
    sizes: ["medium", "generous"],
  }),
  "worktop-laminate": asset("worktop-laminate", worktopLaminate, "Klasičen laminatni pult", {
    rooms: ["kitchen"],
    kitchenWorktops: ["classic-laminate"],
  }),
  "worktop-premium-laminate": asset(
    "worktop-premium-laminate",
    worktopPremiumLaminate,
    "Premium laminat ali kompakt",
    { rooms: ["kitchen"], kitchenWorktops: ["premium-laminate"] },
  ),
  "worktop-quartz": asset("worktop-quartz", worktopQuartz, "Quartz delovna površina", {
    rooms: ["kitchen"],
    kitchenWorktops: ["quartz"],
  }),
  "worktop-stone": asset("worktop-stone", worktopStone, "Delovna površina iz naravnega kamna", {
    rooms: ["kitchen"],
    kitchenWorktops: ["natural-stone"],
  }),
  "wardrobe-hinged": asset("wardrobe-hinged", wardrobeHinged, "Garderoba s krilnimi vrati", {
    rooms: ["wardrobe"],
    wardrobeDoors: ["hinged"],
  }),
  "wardrobe-sliding": asset("wardrobe-sliding", wardrobeSliding, "Garderoba z drsnimi vrati", {
    rooms: ["wardrobe"],
    wardrobeDoors: ["sliding"],
  }),
  "wardrobe-open": asset("wardrobe-open", wardrobeOpen, "Odprta garderoba", {
    rooms: ["wardrobe"],
    wardrobeDoors: ["open"],
  }),
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
    {
      rooms: ["kitchen"],
      kitchenLayouts: ["with-island"],
      sizes: ["medium", "generous"],
      lifestyle: ["family", "hosting", "daily-cooking", "organisation"],
    },
  ),
  "report-wardrobe-organised": asset(
    "report-wardrobe-organised",
    reportWardrobeOrganised,
    "Organizirana garderoba z osvetlitvijo",
    { rooms: ["wardrobe"], lifestyle: ["organisation"] },
  ),
  "report-living-family": asset(
    "report-living-family",
    reportLivingFamily,
    "Družinska dnevna soba z vgradnim pohištvom",
    { rooms: ["living-room"], lifestyle: ["family", "hosting", "organisation"] },
  ),
  "report-entry-family": asset(
    "report-entry-family",
    reportEntryFamily,
    "Družinska predsoba s klopjo in skritim shranjevanjem",
    { rooms: ["entry-hall"], lifestyle: ["family", "organisation"] },
  ),
  "report-utility-organised": asset(
    "report-utility-organised",
    reportUtilityOrganised,
    "Organiziran utility s pralnim stolpom in omaro za čiščenje",
    { rooms: ["utility-room"], lifestyle: ["organisation"] },
  ),
  "report-bathroom-calm": asset(
    "report-bathroom-calm",
    reportBathroomCalm,
    "Umirjena kopalnica z veliko shranjevanja",
    {
      rooms: ["bathroom"],
      lifestyle: ["calm", "organisation"],
    },
  ),
  "report-bedroom-calm": asset(
    "report-bedroom-calm",
    reportBedroomCalm,
    "Umirjena spalnica z vgradnim pohištvom",
    {
      rooms: ["bedroom"],
      lifestyle: ["calm", "organisation"],
    },
  ),
  "report-child-room-flexible": asset(
    "report-child-room-flexible",
    reportChildRoomFlexible,
    "Prilagodljiva otroška soba z delovnim kotičkom",
    { rooms: ["children-room"], lifestyle: ["family", "future-ready", "organisation"] },
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
  bedroom: "Spalnica",
  "children-room": "Otroške sobe",
};

function uniqueIds(ids: Array<ReportImageId | undefined>): ReportImageId[] {
  return Array.from(new Set(ids.filter((id): id is ReportImageId => Boolean(id))));
}

interface ImageMatchContext {
  room?: ReportRoomKey | undefined;
  styles: string[];
  colour?: string | undefined;
  propertyType?: string | undefined;
  projectStage?: string | undefined;
  size?: RoomSize | undefined;
  kitchenLayout?: string | undefined;
  kitchenWorktop?: string | undefined;
  kitchenFrontMaterial?: KitchenFrontMaterial | undefined;
  wardrobeDoor?: string | undefined;
  lifestyle: string[];
}

function inferWidthSize(width?: number): RoomSize | undefined {
  if (!width) return undefined;
  if (width < 240) return "compact";
  if (width > 500) return "generous";
  return "medium";
}

function inferRoomSize(room: ReportRoomKey | undefined, state: HomeDnaState): RoomSize | undefined {
  if (!room) {
    if (!state.home.floorArea) return undefined;
    if (state.home.floorArea < 80) return "compact";
    if (state.home.floorArea > 160) return "generous";
    return "medium";
  }

  switch (room) {
    case "kitchen": {
      if (!state.rooms.kitchen) return undefined;
      const length = kitchenWallLengthCm(state.rooms.kitchen);
      if (length < 320) return "compact";
      if (length > 550) return "generous";
      return "medium";
    }
    case "wardrobe":
      return inferWidthSize(state.rooms.wardrobe?.width);
    case "living-room":
      return inferWidthSize(state.rooms.livingRoom?.wallWidth);
    case "entry-hall":
      return inferWidthSize(state.rooms.entryHall?.width);
    case "utility-room":
      return inferWidthSize(state.rooms.utilityRoom?.width);
    case "bathroom":
      return inferWidthSize(state.rooms.bathroom?.width);
    case "bedroom":
      return inferWidthSize(state.rooms.bedroom?.furnitureWidth);
    case "children-room":
      return inferWidthSize(state.rooms.childrenRoom?.furnitureWidth);
  }
}

function lifestyleTags(state: HomeDnaState): string[] {
  const values: string[] = [];
  if ((state.home.householdSize ?? 0) >= 3 || state.home.children === "yes") values.push("family");
  if (
    state.lifestyle.hostingFrequency === "often" ||
    state.lifestyle.hostingFrequency === "occasionally"
  ) {
    values.push("hosting");
  }
  if (state.lifestyle.cookingFrequency === "daily") values.push("daily-cooking");
  if (state.lifestyle.priorities.includes("Organizacija")) values.push("organisation");
  if (state.lifestyle.futureNeeds.length > 0) values.push("future-ready");
  if (state.style.atmosphere.some((value) => value.toLocaleLowerCase("sl").includes("mir")))
    values.push("calm");
  return values;
}

function imageContext(state: HomeDnaState, room?: ReportRoomKey): ImageMatchContext {
  return {
    ...(room ? { room } : {}),
    styles: state.style.selectedStyles,
    ...(state.style.colourDirection ? { colour: state.style.colourDirection } : {}),
    ...(state.home.propertyType ? { propertyType: state.home.propertyType } : {}),
    ...(state.home.projectStage ? { projectStage: state.home.projectStage } : {}),
    ...(inferRoomSize(room, state) ? { size: inferRoomSize(room, state) } : {}),
    ...(room === "kitchen" && state.rooms.kitchen?.layout
      ? { kitchenLayout: state.rooms.kitchen.layout }
      : {}),
    ...(room === "kitchen" && state.rooms.kitchen?.worktop
      ? { kitchenWorktop: state.rooms.kitchen.worktop }
      : {}),
    ...(room === "kitchen" && state.rooms.kitchen?.frontMaterial
      ? { kitchenFrontMaterial: state.rooms.kitchen.frontMaterial }
      : {}),
    ...(room === "wardrobe" && state.rooms.wardrobe?.doorType
      ? { wardrobeDoor: state.rooms.wardrobe.doorType }
      : {}),
    lifestyle: lifestyleTags(state),
  };
}

function rankChoices(
  ids: Array<ReportImageId | undefined>,
  context: ImageMatchContext,
): ReportImageChoice[] {
  return uniqueIds(ids)
    .map((id, index) => {
      const image = REPORT_IMAGES[id];
      const reasons: string[] = [];
      let score = 0;
      const add = (matches: boolean, weight: number, reason: string) => {
        if (!matches) return;
        score += weight;
        reasons.push(reason);
      };

      add(Boolean(context.room && image.tags.rooms?.includes(context.room)), 12, "izbrani prostor");
      add(
        Boolean(image.tags.styles?.some((value) => context.styles.includes(value))),
        5,
        "izbrani slog",
      );
      add(
        Boolean(context.colour && image.tags.colours?.includes(context.colour)),
        5,
        "barvna smer",
      );
      add(
        Boolean(context.propertyType && image.tags.propertyTypes?.includes(context.propertyType)),
        3,
        "tip doma",
      );
      add(
        Boolean(context.projectStage && image.tags.projectStages?.includes(context.projectStage)),
        3,
        "faza projekta",
      );
      add(
        Boolean(context.size && image.tags.sizes?.includes(context.size)),
        3,
        "velikost prostora",
      );
      add(
        Boolean(
          context.kitchenLayout && image.tags.kitchenLayouts?.includes(context.kitchenLayout),
        ),
        8,
        "postavitev kuhinje",
      );
      add(
        Boolean(
          context.kitchenWorktop && image.tags.kitchenWorktops?.includes(context.kitchenWorktop),
        ),
        6,
        "delovna površina",
      );
      add(
        Boolean(
          context.kitchenFrontMaterial &&
          image.tags.kitchenFrontMaterials?.includes(context.kitchenFrontMaterial),
        ),
        6,
        "material front",
      );
      add(
        Boolean(context.wardrobeDoor && image.tags.wardrobeDoors?.includes(context.wardrobeDoor)),
        6,
        "tip vrat",
      );
      add(
        Boolean(image.tags.lifestyle?.some((value) => context.lifestyle.includes(value))),
        4,
        "način uporabe",
      );

      return {
        id,
        label: image.label,
        ...(reasons.length ? { matchReasons: reasons.slice(0, 4) } : {}),
        score,
        index,
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 8)
    .map(({ id, label, matchReasons }) => ({
      id,
      label,
      ...(matchReasons ? { matchReasons } : {}),
    }));
}

function taggedRoomImageIds(key: ReportRoomKey): ReportImageId[] {
  return Object.values(REPORT_IMAGES)
    .filter((image) => image.tags.rooms?.includes(key))
    .map((image) => image.id);
}

function roomImageIds(key: ReportRoomKey, state: HomeDnaState) {
  switch (key) {
    case "kitchen":
      return uniqueIds([
        state.rooms.kitchen?.layout
          ? kitchenLayoutImageByValue[state.rooms.kitchen.layout]
          : undefined,
        state.rooms.kitchen?.worktop ? worktopImageByValue[state.rooms.kitchen.worktop] : undefined,
        "report-kitchen-social",
        "project-kitchen",
        ...taggedRoomImageIds(key),
      ]);
    case "wardrobe":
      return uniqueIds([
        state.rooms.wardrobe?.doorType
          ? wardrobeImageByValue[state.rooms.wardrobe.doorType]
          : undefined,
        "report-wardrobe-organised",
        "project-wardrobe",
        ...taggedRoomImageIds(key),
      ]);
    case "living-room":
      return uniqueIds(["report-living-family", "project-living", ...taggedRoomImageIds(key)]);
    case "entry-hall":
      return uniqueIds(["report-entry-family", "project-entry", ...taggedRoomImageIds(key)]);
    case "utility-room":
      return uniqueIds(["report-utility-organised", "project-utility", ...taggedRoomImageIds(key)]);
    case "bathroom":
      return uniqueIds(["report-bathroom-calm", "project-bathroom", ...taggedRoomImageIds(key)]);
    case "bedroom":
      return uniqueIds(["report-bedroom-calm", "project-bedroom", ...taggedRoomImageIds(key)]);
    case "children-room":
      return uniqueIds([
        "report-child-room-flexible",
        "project-child-room",
        ...taggedRoomImageIds(key),
      ]);
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
    cover: rankChoices(
      [...selectedStyles, propertyImage, stageImage, "hero-interior"],
      imageContext(state),
    ),
    lifestyle: rankChoices(
      ["lifestyle-people", "lifestyle-intro", propertyImage],
      imageContext(state),
    ),
    style: rankChoices(
      [...selectedStyles, colourImage, "detail-material", "style-intro"],
      imageContext(state),
    ),
    rooms: selectedRooms.map((key) => {
      const quantity = getRoomQuantity(state, key);
      const showQuantity = ["wardrobe", "bathroom", "children-room"].includes(key);
      return {
        key,
        label: showQuantity
          ? `${roomLabels[key]} (${quantity.value}${quantity.plus ? "+" : ""})`
          : roomLabels[key],
        images: rankChoices(roomImageIds(key, state), imageContext(state, key)),
      };
    }),
  };
}

function pickAllowed(
  requestedId: ReportImageId | undefined,
  allowed: ReportImageChoice[],
  excluded: Set<ReportImageId> = new Set(),
): ReportImageAsset {
  const allowedIds = new Set(allowed.map((item) => item.id));
  const orderedIds = uniqueIds([
    requestedId && allowedIds.has(requestedId) ? requestedId : undefined,
    ...allowed.map((item) => item.id),
  ]);
  const selectedId = orderedIds.find((id) => !excluded.has(id)) ?? orderedIds[0];
  return REPORT_IMAGES[selectedId ?? "hero-interior"];
}

export function resolveReportImages(
  state: HomeDnaState,
  report: HomeDnaReportData,
): ResolvedReportImages {
  const candidates = buildReportImageCandidates(state);
  const usedImageIds = new Set<ReportImageId>();
  const cover = pickAllowed(report.images?.coverImageId, candidates.cover);
  usedImageIds.add(cover.id);
  const lifestyle = pickAllowed(
    report.images?.lifestyleImageId,
    candidates.lifestyle,
    usedImageIds,
  );
  usedImageIds.add(lifestyle.id);
  const requestedStyleIds = report.images?.styleImageIds ?? [];
  const allowedStyleIds = new Set(candidates.style.map((item) => item.id));
  const orderedStyleIds = uniqueIds([
    ...requestedStyleIds.filter((id) => allowedStyleIds.has(id)),
    ...candidates.style.map((item) => item.id),
  ]);
  const selectedStyleIds = [
    ...orderedStyleIds.filter((id) => !usedImageIds.has(id)),
    ...orderedStyleIds.filter((id) => usedImageIds.has(id)),
  ].slice(0, 2);
  selectedStyleIds.forEach((id) => usedImageIds.add(id));

  const roomImages: Partial<Record<RoomKey, ReportImageAsset>> = {};
  for (const room of report.rooms) {
    const roomCandidates = candidates.rooms.find((item) => item.key === room.key)?.images ?? [];
    const roomImage = pickAllowed(room.imageId, roomCandidates, usedImageIds);
    roomImages[room.key] = roomImage;
    usedImageIds.add(roomImage.id);
  }

  const investmentImageId: Record<HomeDnaState["investment"]["level"], ReportImageId> = {
    basic: "investment-essential",
    premium: "investment-considered",
    signature: "investment-signature",
  };

  return {
    cover,
    lifestyle,
    style: selectedStyleIds.map((id) => REPORT_IMAGES[id]),
    rooms: roomImages,
    investment: REPORT_IMAGES[investmentImageId[state.investment.level]],
  };
}
