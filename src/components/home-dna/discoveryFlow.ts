import heroInterior from "@/assets/hero-interior.jpg";
import styleIntroImage from "@/assets/style-intro.jpg";
import lifestylePeople from "@/assets/lifestyle-people.jpg";
import {
  challengeOptions,
  futureNeedsOptions,
  executionLevelOptions,
  lifestyleOptions,
  noFutureChangesLabel,
  otherChallengeLabel,
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
import { roomIntroImages, roomModuleBuilders, roomModuleOrder } from "./roomModules";
import { hasRoom, type ScreenDef } from "./screenDef";
import { calculateInvestment } from "./pricing";
import type {
  ChildrenAnswer,
  HomeDnaState,
  ExecutionLevel,
  LifestyleState,
  ProjectStage,
  PropertyType,
} from "./homeDnaTypes";

const noPetsLabel = petOptions[3]?.label ?? "Brez hišnih ljubljenčkov";

function setLife(state: HomeDnaState, patch: Partial<LifestyleState>): HomeDnaState {
  return { ...state, lifestyle: { ...state.lifestyle, ...patch } };
}

/* ---------------- about your home ---------------- */

function homeScreens(state: HomeDnaState): ScreenDef[] {
  const home = state.home;
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "about-intro",
      eyebrow: "O vašem domu",
      headline: "Najprej spoznajmo ljudi, ki bodo v domu živeli.",
      body: "Nekaj kratkih vprašanj o vašem gospodinjstvu nam pove, koliko prostora, shranjevanja in vzdržljivosti mora dom prenesti.",
      cta: "Začnimo",
      image: heroInterior,
    },
    {
      kind: "choice",
      key: "household-size",
      headline: "Koliko ljudi bo uporabljalo ta dom?",
      support: "Dom mora delovati za vsakogar, ki v njem živi.",
      options: householdSizeOptions.map((o) => ({ value: o, label: o })),
      value:
        home.householdSize === undefined
          ? undefined
          : home.householdSizePlus
            ? "5+"
            : String(home.householdSize),
      apply: (s, value) => ({
        ...s,
        home: {
          ...s.home,
          householdSize: value === "5+" ? 5 : Number(value),
          householdSizePlus: value === "5+",
        },
      }),
    },
    {
      kind: "choice",
      key: "children",
      headline: "Ali bodo v domu živeli otroci?",
      options: childrenOptions.map((o) => ({ value: o.value, label: o.label })),
      value: home.children,
      apply: (s, value) => ({
        ...s,
        home: { ...s.home, children: value as ChildrenAnswer },
      }),
    },
  ];

  if (home.children === "yes") {
    screens.push({
      kind: "choice",
      key: "children-count",
      headline: "Koliko otrok bo uporabljalo dom?",
      options: childrenCountOptions.map((o) => ({ value: o, label: o })),
      value: home.childrenCount === undefined ? undefined : String(home.childrenCount),
      apply: (s, value) => ({
        ...s,
        home: { ...s.home, childrenCount: Number(value.replace("+", "")) },
      }),
    });
  }

  screens.push(
    {
      kind: "multi",
      key: "pets",
      headline: "Ali z vami živijo hišni ljubljenčki?",
      support: "Vplivajo na materiale, vzdrževanje in organizacijo predsobe.",
      options: petOptions.map((p) => p.label),
      exclusive: noPetsLabel,
      selected: home.pets,
      apply: (s, pets) => ({ ...s, home: { ...s.home, pets } }),
    },
    {
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
    },
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
      apply: (s, selectedRooms) => ({ ...s, selectedRooms }),
    },
  );

  return screens;
}

/* ---------------- style ---------------- */

function styleScreens(state: HomeDnaState): ScreenDef[] {
  const style = state.style;
  return [
    {
      kind: "editorial",
      key: "style-intro",
      eyebrow: "Vaš slog",
      headline: "Dom naj odraža ljudi, ki bodo v njem živeli.",
      body: "Ne iščemo kratkotrajnega trenda. Iščemo oblikovalski jezik, v katerem si lahko predstavljate živeti še vrsto let.",
      cta: "Odkrijmo vaš slog",
      image: styleIntroImage,
    },
    {
      kind: "styles",
      key: "style-selection",
      selected: style.selectedStyles,
      apply: (s, selectedStyles) => ({ ...s, style: { ...s.style, selectedStyles } }),
    },
    {
      kind: "multi",
      key: "atmosphere",
      headline: "Kako želite, da se vaš dom občuti?",
      support: "Izberite največ tri občutke, ki naj vodijo oblikovanje prostora.",
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
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "lifestyle-intro",
      eyebrow: "Vaš način življenja",
      headline: "Dober dom podpira vsakdan, ne le videza.",
      body: "Zdaj želimo razumeti, kaj vam je pomembno, kaj vas v trenutnem domu ovira in kako naj prostor deluje v prihodnje.",
      cta: "Nadaljujmo",
      image: lifestylePeople,
    },
    {
      kind: "multi",
      key: "lifestyle",
      headline: "Kaj vam je doma najpomembnejše?",
      support: "Izberite največ tri stvari, ki naj najbolj vplivajo na zasnovo vašega doma.",
      options: lifestyleOptions,
      max: 3,
      limitNotice: "Izberete lahko največ tri prioritete.",
      selected: life.priorities,
      apply: (s, priorities) => setLife(s, { priorities }),
    },
    {
      kind: "multi",
      key: "challenges",
      headline: "Kaj vas v trenutnem domu najbolj ovira?",
      support: "Izberite največ tri konkretne težave, ki jih mora novi projekt rešiti.",
      options: challengeOptions,
      max: 3,
      limitNotice: "Izberete lahko največ tri izzive.",
      selected: life.currentChallenges,
      apply: (s, currentChallenges) => setLife(s, { currentChallenges }),
    },
  ];

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
    headline: "Kako naj se dom prilagaja prihodnosti?",
    support: "Izberite vse spremembe, ki bi jih bilo smiselno upoštevati že danes.",
    options: futureNeedsOptions,
    exclusive: noFutureChangesLabel,
    selected: life.futureNeeds,
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
  const firstRoom = activeRooms[0];

  const roomIntro: ScreenDef[] = activeRooms.length
    ? [
        {
          kind: "editorial",
          key: "rooms-intro",
          eyebrow: "Vaši prostori",
          headline: "Zdaj bomo vsak izbrani prostor prilagodili vašim dejanskim potrebam.",
          body: "Zanimajo nas približne mere in način uporabe. Natančne meritve bomo izvedli kasneje.",
          cta: "Začnimo",
          image: (firstRoom && roomIntroImages[firstRoom]) ?? heroInterior,
        },
      ]
    : [];

  return [
    { kind: "welcome", key: "welcome" },
    ...homeScreens(state),
    ...styleScreens(state),
    ...lifestyleScreens(state),
    ...roomIntro,
    ...activeRooms.flatMap((room) => roomModuleBuilders[room]?.(state) ?? []),
    ...closingScreens(state),
  ];
}
