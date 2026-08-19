import {
  challengeOptionsForRooms,
  cookingOptions,
  executionLevelOptions,
  futureNeedsOptionsForRooms,
  hobbyOptions,
  hostingOptions,
  lifestyleOptionsForRooms,
  noHobbiesLabel,
  noFutureChangesLabel,
  otherChallengeLabel,
  workFromHomeOptions,
} from "./discoveryData";
import {
  atmosphereOptions,
  childrenCountOptions,
  childrenOptions,
  colourDirectionOptions,
  floorAreaPresets,
  householdSizeOptions,
  petOptions,
  projectStageOptions,
  propertyTypeOptions,
} from "./homeDnaData";
import { roomModuleBuilders, roomModuleOrder } from "./roomModules";
import { hasRoom, type ScreenDef } from "./screenDef";
import { calculateInvestment } from "./pricing";
import type {
  ChildrenAnswer,
  CookingFrequency,
  HostingFrequency,
  HomeDnaState,
  ExecutionLevel,
  LifestyleState,
  ProjectStage,
  PropertyType,
  RoomKey,
  WorkFromHomeFrequency,
} from "./homeDnaTypes";

const noPetsLabel = petOptions[3]?.label ?? "Brez hišnih ljubljenčkov";

function childrenCountOptionsForHousehold(
  householdSize: number | undefined,
  householdSizePlus: boolean | undefined,
): string[] {
  if (!householdSize || householdSizePlus) return childrenCountOptions;

  return Array.from({ length: Math.min(householdSize, 4) }, (_, index) => String(index + 1));
}

function setLife(state: HomeDnaState, patch: Partial<LifestyleState>): HomeDnaState {
  return { ...state, lifestyle: { ...state.lifestyle, ...patch } };
}

function scopeIncludes(selectedRooms: RoomKey[], room: RoomKey): boolean {
  return selectedRooms.includes("complete-home") || selectedRooms.includes(room);
}

function selectedIndividualRooms(selectedRooms: RoomKey[]): RoomKey[] {
  return selectedRooms.filter((room) => room !== "complete-home");
}

function shouldAskPets(selectedRooms: RoomKey[]): boolean {
  return ["living-room", "entry-hall", "bedroom", "children-room"].some((room) =>
    scopeIncludes(selectedRooms, room as RoomKey),
  );
}

function shouldAskFloorArea(selectedRooms: RoomKey[]): boolean {
  return (
    selectedRooms.includes("complete-home") || selectedIndividualRooms(selectedRooms).length > 1
  );
}

function shouldAskHobbies(selectedRooms: RoomKey[]): boolean {
  return ["wardrobe", "living-room", "entry-hall", "utility-room", "children-room"].some((room) =>
    scopeIncludes(selectedRooms, room as RoomKey),
  );
}

function applyRoomScope(state: HomeDnaState, selectedRooms: RoomKey[]): HomeDnaState {
  const priorities = lifestyleOptionsForRooms(selectedRooms);
  const challenges = challengeOptionsForRooms(selectedRooms);
  const futureNeeds = futureNeedsOptionsForRooms(selectedRooms).filter(
    (value) =>
      state.home.children !== "none" ||
      (value !== "Rast družine" && value !== "Otroci bodo potrebovali več prostora"),
  );
  const lifestyle = {
    ...state.lifestyle,
    priorities: state.lifestyle.priorities.filter((value) => priorities.includes(value)),
    currentChallenges: state.lifestyle.currentChallenges.filter((value) =>
      challenges.includes(value),
    ),
    futureNeeds: state.lifestyle.futureNeeds.filter((value) => futureNeeds.includes(value)),
  };

  if (!scopeIncludes(selectedRooms, "kitchen")) delete lifestyle.cookingFrequency;
  if (!scopeIncludes(selectedRooms, "living-room") && !scopeIncludes(selectedRooms, "bedroom")) {
    delete lifestyle.workFromHomeFrequency;
  }
  if (!scopeIncludes(selectedRooms, "kitchen") && !scopeIncludes(selectedRooms, "living-room")) {
    delete lifestyle.hostingFrequency;
  }
  if (!shouldAskHobbies(selectedRooms)) lifestyle.hobbies = [];
  if (!lifestyle.currentChallenges.includes(otherChallengeLabel)) delete lifestyle.challengeNote;

  const rooms = { ...state.rooms };
  if (scopeIncludes(selectedRooms, "wardrobe") && rooms.bedroom?.wardrobe) {
    rooms.bedroom = { ...rooms.bedroom, wardrobe: false };
  }

  return { ...state, selectedRooms, lifestyle, rooms };
}

/* ---------------- about your home ---------------- */

function homeScreens(state: HomeDnaState): ScreenDef[] {
  const home = state.home;
  const screens: ScreenDef[] = [
    {
      kind: "visual",
      key: "project-stage",
      headline: "V kateri fazi je vaš projekt?",
      support:
        "Kontekst projekta nam pomaga pripraviti priporočila, primerna za vaš prostor in časovni okvir.",
      options: projectStageOptions,
      value: home.projectStage,
      apply: (s, v) => ({ ...s, home: { ...s.home, projectStage: v as ProjectStage } }),
    },
    {
      kind: "visual",
      key: "property-type",
      headline: "Kakšen dom opremljate?",
      options: propertyTypeOptions,
      value: home.propertyType,
      apply: (s, v) => ({ ...s, home: { ...s.home, propertyType: v as PropertyType } }),
    },
    {
      kind: "rooms",
      key: "rooms",
      selected: state.selectedRooms,
      apply: (s, selectedRooms) => applyRoomScope(s, selectedRooms),
    },
    {
      kind: "choice",
      key: "household-size",
      headline: "Koliko ljudi bo uporabljalo ta dom?",
      support:
        "V naslednjem koraku vprašamo, koliko je med njimi otrok; otroci so že vključeni v skupno število.",
      options: householdSizeOptions.map((o) => ({ value: o, label: o })),
      value:
        home.householdSize === undefined
          ? undefined
          : home.householdSizePlus
            ? "5+"
            : String(home.householdSize),
      apply: (s, value) => {
        const householdSize = value === "5+" ? 5 : Number(value);
        const householdSizePlus = value === "5+";
        const nextHome = { ...s.home, householdSize, householdSizePlus };

        if (
          !householdSizePlus &&
          (nextHome.childrenCountPlus || (nextHome.childrenCount ?? 0) > householdSize)
        ) {
          delete nextHome.childrenCount;
          delete nextHome.childrenCountPlus;
        }

        return { ...s, home: nextHome };
      },
    },
    {
      kind: "choice",
      key: "children",
      headline: "Ali bodo v domu živeli otroci?",
      options: childrenOptions.map((o) => ({ value: o.value, label: o.label })),
      value: home.children,
      apply: (s, value) => {
        const children = value as ChildrenAnswer;
        if (children === "yes") return { ...s, home: { ...s.home, children } };

        const nextHome = { ...s.home, children };
        delete nextHome.childrenCount;
        delete nextHome.childrenCountPlus;

        const nextRooms = { ...s.rooms };
        delete nextRooms.childrenRoom;

        const nextState = {
          ...s,
          home: nextHome,
          rooms: nextRooms,
          selectedRooms: s.selectedRooms.filter((room) => room !== "children-room"),
        };
        return applyRoomScope(nextState, nextState.selectedRooms);
      },
    },
  ];

  if (home.children === "yes") {
    screens.push({
      kind: "choice",
      key: "children-count",
      headline: "Koliko otrok bo uporabljalo dom?",
      support: "Število otrok je že vključeno v skupno število oseb.",
      options: childrenCountOptionsForHousehold(home.householdSize, home.householdSizePlus).map(
        (o) => ({ value: o, label: o }),
      ),
      value:
        home.childrenCount === undefined
          ? undefined
          : home.childrenCountPlus
            ? `${home.childrenCount}+`
            : String(home.childrenCount),
      apply: (s, value) => ({
        ...s,
        home: {
          ...s.home,
          childrenCount: Number(value.replace("+", "")),
          childrenCountPlus: value.endsWith("+"),
        },
      }),
    });
  }

  if (shouldAskPets(state.selectedRooms)) {
    screens.push({
      kind: "multi",
      key: "pets",
      headline: "Ali z vami živijo hišni ljubljenčki?",
      support: "Vplivajo na izbiro materialov, vzdrževanje in organizacijo izbranih prostorov.",
      options: petOptions.map((p) => p.label),
      exclusive: noPetsLabel,
      selected: home.pets,
      apply: (s, pets) => ({ ...s, home: { ...s.home, pets } }),
    });
  }

  if (shouldAskFloorArea(state.selectedRooms)) {
    screens.push({
      kind: "number",
      key: "home-size",
      headline: "Kako velik je vaš dom?",
      support: "Zadostuje približna kvadratura. Natančnost ni potrebna.",
      unit: "m²",
      min: 20,
      max: 600,
      presets: floorAreaPresets,
      value: home.floorArea,
      apply: (s, floorArea) => ({ ...s, home: { ...s.home, floorArea } }),
    });
  }

  return screens;
}

/* ---------------- style ---------------- */

function styleScreens(state: HomeDnaState): ScreenDef[] {
  const style = state.style;
  return [
    {
      kind: "styles",
      key: "style-selection",
      selected: style.selectedStyles,
      apply: (s, selectedStyles) => ({ ...s, style: { ...s.style, selectedStyles } }),
    },
    {
      kind: "multi",
      key: "atmosphere",
      headline: "Kako želite, da se občutijo izbrani prostori?",
      support: "Izberite največ tri občutke, ki naj vodijo njihovo oblikovanje.",
      options: atmosphereOptions,
      max: 3,
      limitNotice: "Izberete lahko največ tri občutke.",
      selected: style.atmosphere,
      apply: (s, atmosphere) => ({ ...s, style: { ...s.style, atmosphere } }),
    },
    {
      kind: "visual",
      key: "colour-direction",
      headline: "Katera barvna smer vam je najbližja?",
      columns: "two",
      options: colourDirectionOptions,
      value: style.colourDirection,
      apply: (s, colourDirection) => ({ ...s, style: { ...s.style, colourDirection } }),
    },
    {
      kind: "link",
      key: "inspiration",
      value: style.inspirationUrl,
      apply: (s, inspirationUrl) => ({
        ...s,
        style: { ...s.style, ...(inspirationUrl ? { inspirationUrl } : {}) },
      }),
    },
  ];
}

/* ---------------- lifestyle ---------------- */

function lifestyleScreens(state: HomeDnaState): ScreenDef[] {
  const life = state.lifestyle;
  const priorities = lifestyleOptionsForRooms(state.selectedRooms);
  const challenges = challengeOptionsForRooms(state.selectedRooms);
  const futureNeeds = futureNeedsOptionsForRooms(state.selectedRooms).filter(
    (value) =>
      state.home.children !== "none" ||
      (value !== "Rast družine" && value !== "Otroci bodo potrebovali več prostora"),
  );
  const screens: ScreenDef[] = [
    {
      kind: "multi",
      key: "lifestyle",
      headline: "Kaj vam je pri izbranih prostorih najpomembnejše?",
      support: "Izberite največ tri prioritete, ki naj najbolj vplivajo na zasnovo.",
      options: priorities,
      max: 3,
      limitNotice: "Izberete lahko največ tri prioritete.",
      selected: life.priorities.filter((value) => priorities.includes(value)),
      apply: (s, priorities) => setLife(s, { priorities }),
    },
  ];

  if (scopeIncludes(state.selectedRooms, "kitchen")) {
    screens.push({
      kind: "choice",
      key: "cooking-frequency",
      headline: "Kako pogosto kuhate doma?",
      support: "Pogostost kuhanja vpliva na delovni tok, količino shranjevanja in izbiro površin.",
      options: cookingOptions.map((option) => ({
        value: option.value,
        label: option.label,
        description: option.description,
      })),
      value: life.cookingFrequency,
      apply: (s, cookingFrequency) =>
        setLife(s, { cookingFrequency: cookingFrequency as CookingFrequency }),
    });
  }

  if (
    scopeIncludes(state.selectedRooms, "kitchen") ||
    scopeIncludes(state.selectedRooms, "living-room")
  ) {
    screens.push({
      kind: "choice",
      key: "hosting-frequency",
      headline: "Kako pogosto gostite družino ali prijatelje?",
      support: "To vpliva na količino sedišč, delovne površine in način povezovanja prostorov.",
      options: hostingOptions.map((option) => ({
        value: option.value,
        label: option.label,
      })),
      value: life.hostingFrequency,
      apply: (s, hostingFrequency) =>
        setLife(s, { hostingFrequency: hostingFrequency as HostingFrequency }),
    });
  }

  if (
    scopeIncludes(state.selectedRooms, "living-room") ||
    scopeIncludes(state.selectedRooms, "bedroom")
  ) {
    screens.push({
      kind: "choice",
      key: "work-from-home-frequency",
      headline: "Kako pogosto delate od doma?",
      support: "Vprašanje prikažemo le tam, kjer lahko izbrani prostor vključuje delovno mesto.",
      options: workFromHomeOptions.map((option) => ({
        value: option.value,
        label: option.label,
        ...(option.description ? { description: option.description } : {}),
      })),
      value: life.workFromHomeFrequency,
      apply: (s, workFromHomeFrequency) =>
        setLife(s, { workFromHomeFrequency: workFromHomeFrequency as WorkFromHomeFrequency }),
    });
  }

  if (shouldAskHobbies(state.selectedRooms)) {
    screens.push({
      kind: "multi",
      key: "hobbies",
      headline: "Katere hobije ali opremo morajo izbrani prostori upoštevati?",
      support: "Izberite le tisto, kar vpliva na shranjevanje ali uporabo prostora.",
      options: hobbyOptions,
      exclusive: noHobbiesLabel,
      selected: life.hobbies,
      apply: (s, hobbies) => setLife(s, { hobbies }),
    });
  }

  screens.push({
    kind: "multi",
    key: "challenges",
    headline: "Kaj vas pri teh prostorih trenutno najbolj ovira?",
    support: "Prikazane so samo težave, povezane z izbranimi prostori. Izberite največ tri.",
    options: challenges,
    max: 3,
    limitNotice: "Izberete lahko največ tri izzive.",
    selected: life.currentChallenges.filter((value) => challenges.includes(value)),
    apply: (s, currentChallenges) => setLife(s, { currentChallenges }),
  });

  if (life.currentChallenges.includes(otherChallengeLabel)) {
    screens.push({
      kind: "note",
      key: "challenges-other",
      headline: "Kaj bi še želeli izboljšati?",
      support: "Zapis je neobvezen, a nam pomaga bolje razumeti vaš prostor.",
      value: life.challengeNote,
      apply: (s, challengeNote) => setLife(s, { challengeNote }),
    });
  }

  screens.push({
    kind: "multi",
    key: "future-needs",
    headline: "Kako naj se izbrani prostori prilagajajo prihodnosti?",
    support: "Prikazane so samo spremembe, ki lahko vplivajo na izbrani obseg projekta.",
    options: futureNeeds,
    exclusive: noFutureChangesLabel,
    selected: life.futureNeeds.filter((value) => futureNeeds.includes(value)),
    apply: (s, futureNeeds) => setLife(s, { futureNeeds }),
  });

  return screens;
}

/* ---------------- closing ---------------- */

function closingScreens(state: HomeDnaState): ScreenDef[] {
  return [
    {
      kind: "visual",
      key: "investment",
      headline: "Kateri nivo izvedbe najbolj ustreza vašemu projektu?",
      support:
        "Ta izbira nam pomaga pripraviti okvirno oceno investicije in priporočiti primerne materiale. Končne materiale bomo določili skupaj med načrtovanjem.",
      columns: "three",
      options: executionLevelOptions,
      value: state.investment.level,
      apply: (s, level) => ({
        ...s,
        investment: { ...s.investment, level: level as ExecutionLevel },
      }),
    },
    {
      kind: "contact",
      key: "contact",
      value: state.contact,
      apply: (s, contact) => {
        const next = { ...s, contact };
        const { estimatedInvestment, roomBreakdown } = calculateInvestment(next);
        return {
          ...next,
          investment: { ...next.investment, estimatedInvestment, roomBreakdown },
        };
      },
    },
    { kind: "success", key: "success" },
  ];
}

/* ---------------- assembly ---------------- */

export function buildDiscoveryFlow(state: HomeDnaState): ScreenDef[] {
  const activeRooms = roomModuleOrder.filter((room) => hasRoom(state, room));

  return [
    { kind: "welcome", key: "welcome" },
    ...homeScreens(state),
    ...styleScreens(state),
    ...lifestyleScreens(state),
    ...activeRooms.flatMap((room) => roomModuleBuilders[room]?.(state) ?? []),
    ...closingScreens(state),
  ];
}
