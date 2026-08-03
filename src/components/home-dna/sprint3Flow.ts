import lifestylePeople from "@/assets/lifestyle-people.jpg";
import heroInterior from "@/assets/hero-interior.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import {
  challengeOptions,
  cookingOptions,
  futureNeedsOptions,
  hobbyOptions,
  hostingOptions,
  kitchenLayoutOptions,
  noFutureChangesLabel,
  noHobbiesLabel,
  otherChallengeLabel,
  priorityOptions,
  wardrobeDoorOptions,
  wardrobeFoldedLabel,
  wardrobeHangingLabels,
  wardrobeShoesLabel,
  wardrobeStorageOptions,
  workFromHomeOptions,
  worktopOptions,
  yesNoOptions,
} from "./sprint3Data";
import type {
  DiscoveryScreen,
  HomeDnaState,
  LifestyleState,
  Priority,
  RoomKey,
  RoomsState,
  VisualOption,
} from "./homeDnaTypes";

export type ScreenDef =
  | {
      kind: "editorial";
      key: DiscoveryScreen;
      eyebrow: string;
      headline: string;
      body: string;
      cta: string;
      image: string;
    }
  | {
      kind: "choice";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      options: { value: string; label: string; description?: string }[];
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    }
  | {
      kind: "visual";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      columns?: "two" | "three";
      options: VisualOption[];
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    }
  | {
      kind: "number";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      unit: string;
      min: number;
      max: number;
      presets?: number[];
      skippable?: boolean;
      value: number | undefined;
      apply: (state: HomeDnaState, value: number) => HomeDnaState;
    }
  | {
      kind: "multi";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      options: string[];
      max?: number;
      exclusive?: string;
      limitNotice?: string;
      selected: string[];
      apply: (state: HomeDnaState, values: string[]) => HomeDnaState;
    }
  | {
      kind: "note";
      key: DiscoveryScreen;
      headline: string;
      support?: string | undefined;
      value: string | undefined;
      apply: (state: HomeDnaState, value: string) => HomeDnaState;
    };

/* ---------------- state helpers ---------------- */

function setLife(state: HomeDnaState, patch: Partial<LifestyleState>): HomeDnaState {
  return { ...state, lifestyle: { ...state.lifestyle, ...patch } };
}

function setRoom<K extends keyof RoomsState>(
  state: HomeDnaState,
  key: K,
  patch: Partial<NonNullable<RoomsState[K]>>,
): HomeDnaState {
  return {
    ...state,
    rooms: {
      ...state.rooms,
      [key]: { ...(state.rooms[key] ?? {}), ...patch },
    } as RoomsState,
  };
}

export function hasRoom(state: HomeDnaState, room: RoomKey): boolean {
  return state.selectedRooms.includes("complete-home") || state.selectedRooms.includes(room);
}

export function pruneRooms(state: HomeDnaState): HomeDnaState {
  const rooms: RoomsState = {};
  if (hasRoom(state, "kitchen") && state.rooms.kitchen) rooms.kitchen = state.rooms.kitchen;
  if (hasRoom(state, "wardrobe") && state.rooms.wardrobe) rooms.wardrobe = state.rooms.wardrobe;
  if (hasRoom(state, "living-room") && state.rooms.livingRoom)
    rooms.livingRoom = state.rooms.livingRoom;
  if (hasRoom(state, "entry-hall") && state.rooms.entryHall) rooms.entryHall = state.rooms.entryHall;
  if (hasRoom(state, "utility-room") && state.rooms.utilityRoom)
    rooms.utilityRoom = state.rooms.utilityRoom;
  if (hasRoom(state, "bathroom") && state.rooms.bathroom) rooms.bathroom = state.rooms.bathroom;
  if (hasRoom(state, "home-office") && state.rooms.homeOffice)
    rooms.homeOffice = state.rooms.homeOffice;
  return { ...state, rooms };
}

function boolChoice(
  key: DiscoveryScreen,
  headline: string,
  value: boolean | undefined,
  apply: (state: HomeDnaState, value: boolean) => HomeDnaState,
  support?: string,
): ScreenDef {
  return {
    kind: "choice",
    key,
    headline,
    ...(support ? { support } : {}),
    options: yesNoOptions,
    value: value === undefined ? undefined : value ? "yes" : "no",
    apply: (s, v) => apply(s, v === "yes"),
  };
}

const priorityLevels = [
  { value: "low", label: "Manjši del" },
  { value: "medium", label: "Približno polovica" },
  { value: "high", label: "Večina omare" },
];

/* ---------------- lifestyle ---------------- */

function lifestyleScreens(state: HomeDnaState): ScreenDef[] {
  const life = state.lifestyle;
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "lifestyle-intro",
      eyebrow: "Vaš način življenja",
      headline: "Dober dom podpira vsakdan, ne le videza.",
      body: "Zdaj želimo razumeti, kaj vam je pomembno, kaj vas v trenutnem domu ovira in kako naj prihodnji prostor deluje za vas.",
      cta: "Nadaljujmo",
      image: lifestylePeople,
    },
    {
      kind: "multi",
      key: "priorities",
      headline: "Kaj vam je doma najpomembnejše?",
      support: "Izberite največ tri stvari, ki naj najbolj vplivajo na zasnovo vašega doma.",
      options: priorityOptions,
      max: 3,
      limitNotice: "Izberete lahko največ tri prioritete.",
      selected: life.priorities,
      apply: (s, priorities) => setLife(s, { priorities }),
    },
    {
      kind: "multi",
      key: "challenges",
      headline: "Kaj bi radi izboljšali v svojem trenutnem domu?",
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
      value: life.additionalNotes,
      apply: (s, additionalNotes) => setLife(s, { additionalNotes }),
    });
  }

  const cookingRelevant = hasRoom(state, "kitchen") || life.priorities.includes("Kuhanje");
  if (cookingRelevant) {
    screens.push({
      kind: "choice",
      key: "cooking",
      headline: "Kako pogosto kuhate doma?",
      options: cookingOptions.map((o) => ({
        value: o.value,
        label: o.label,
        description: o.description,
      })),
      value: life.cookingFrequency,
      apply: (s, v) => setLife(s, { cookingFrequency: v as NonNullable<LifestyleState["cookingFrequency"]> }),
    });
  }

  const workRelevant = hasRoom(state, "home-office") || life.priorities.includes("Delo od doma");
  if (workRelevant) {
    screens.push({
      kind: "choice",
      key: "work-from-home",
      headline: "Kako pogosto delate od doma?",
      options: workFromHomeOptions.map((o) => ({
        value: o.value,
        label: o.label,
        ...("description" in o && o.description ? { description: o.description } : {}),
      })),
      value: life.workFromHome,
      apply: (s, v) => setLife(s, { workFromHome: v as NonNullable<LifestyleState["workFromHome"]> }),
    });
  }

  const hostingRelevant =
    life.priorities.includes("Gostje in druženje") ||
    state.selectedRooms.includes("complete-home") ||
    hasRoom(state, "kitchen") ||
    hasRoom(state, "living-room");
  if (hostingRelevant) {
    screens.push({
      kind: "choice",
      key: "hosting",
      headline: "Kako pogosto pri vas gostite družino ali prijatelje?",
      options: hostingOptions.map((o) => ({ value: o.value, label: o.label })),
      value: life.hostingFrequency,
      apply: (s, v) => setLife(s, { hostingFrequency: v as NonNullable<LifestyleState["hostingFrequency"]> }),
    });
  }

  screens.push(
    {
      kind: "multi",
      key: "hobbies",
      headline: "Kateri hobiji potrebujejo prostor v vašem domu?",
      support: "Izberite vse, kar vpliva na shranjevanje ali uporabo prostora.",
      options: hobbyOptions,
      exclusive: noHobbiesLabel,
      selected: life.hobbies,
      apply: (s, hobbies) => setLife(s, { hobbies }),
    },
    {
      kind: "multi",
      key: "future-needs",
      headline: "Kako naj se dom prilagaja prihodnosti?",
      support: "Izberite vse spremembe, ki bi jih bilo smiselno upoštevati že danes.",
      options: futureNeedsOptions,
      exclusive: noFutureChangesLabel,
      selected: life.futureNeeds,
      apply: (s, futureNeeds) => setLife(s, { futureNeeds }),
    },
  );

  return screens;
}

/* ---------------- kitchen ---------------- */

function kitchenScreens(state: HomeDnaState): ScreenDef[] {
  const k = state.rooms.kitchen ?? {};
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "kitchen-intro",
      eyebrow: "Kuhinja",
      headline: "Kuhinja naj sledi načinu, kako kuhate in živite.",
      body: "Potrebujemo le približno postavitev, dolžine in nekaj ključnih odločitev.",
      cta: "Začnimo s kuhinjo",
      image: projectKitchen,
    },
    {
      kind: "visual",
      key: "kitchen-layout",
      headline: "Katera postavitev je najbližja vašemu prostoru?",
      options: kitchenLayoutOptions,
      columns: "two",
      value: k.layout,
      apply: (s, v) => setRoom(s, "kitchen", { layout: v as NonNullable<typeof k.layout> }),
    },
    {
      kind: "number",
      key: "kitchen-wall-a",
      headline: "Kako dolga je glavna kuhinjska stena?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 100,
      max: 1000,
      presets: [240, 300, 360, 420],
      value: k.wallA,
      apply: (s, v) => setRoom(s, "kitchen", { wallA: v }),
    },
  ];

  if (k.layout === "l-shape" || k.layout === "u-shape") {
    screens.push({
      kind: "number",
      key: "kitchen-wall-b",
      headline: "Kako dolga je druga kuhinjska stena?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 100,
      max: 1000,
      value: k.wallB,
      apply: (s, v) => setRoom(s, "kitchen", { wallB: v }),
    });
  }

  if (k.layout === "u-shape") {
    screens.push({
      kind: "number",
      key: "kitchen-wall-c",
      headline: "Kako dolga je tretja kuhinjska stena?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 100,
      max: 1000,
      value: k.wallC,
      apply: (s, v) => setRoom(s, "kitchen", { wallC: v }),
    });
  }

  if (k.layout === "with-island") {
    screens.push(
      {
        kind: "number",
        key: "kitchen-wall-b",
        headline: "Ali imate ob otoku še drugo steno?",
        support: "Če druge stene ni, korak preprosto preskočite.",
        unit: "cm",
        min: 100,
        max: 1000,
        skippable: true,
        value: k.wallB,
        apply: (s, v) => setRoom(s, "kitchen", { wallB: v }),
      },
      {
        kind: "number",
        key: "kitchen-island-length",
        headline: "Kako velik otok si predstavljate?",
        support: "Najprej nas zanima dolžina otoka.",
        unit: "cm",
        min: 100,
        max: 400,
        presets: [180, 220, 260, 300],
        value: k.islandLength,
        apply: (s, v) => setRoom(s, "kitchen", { islandLength: v }),
      },
      {
        kind: "number",
        key: "kitchen-island-width",
        headline: "Kako širok naj bo otok?",
        support: "Širina vpliva na udobje dela in gibanje okoli otoka.",
        unit: "cm",
        min: 60,
        max: 180,
        presets: [90, 100, 120],
        value: k.islandWidth,
        apply: (s, v) => setRoom(s, "kitchen", { islandWidth: v }),
      },
    );
  }

  screens.push(
    {
      kind: "visual",
      key: "kitchen-worktop",
      headline: "Katera delovna površina najbolje ustreza vaši viziji?",
      options: worktopOptions,
      columns: "two",
      value: k.worktop,
      apply: (s, v) => setRoom(s, "kitchen", { worktop: v as NonNullable<typeof k.worktop> }),
    },
    {
      kind: "choice",
      key: "kitchen-tall-units",
      headline: "Koliko visokih omar približno potrebujete?",
      options: [
        { value: "0", label: "Nobene" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4+", label: "4+" },
      ],
      value:
        k.tallUnits === undefined ? undefined : k.tallUnitsPlus ? "4+" : String(k.tallUnits),
      apply: (s, v) =>
        setRoom(s, "kitchen", {
          tallUnits: v === "4+" ? 4 : Number(v),
          tallUnitsPlus: v === "4+",
        }),
    },
    {
      kind: "choice",
      key: "kitchen-pantry",
      headline: "Želite namensko rešitev za shrambo?",
      options: [
        { value: "none", label: "Ne" },
        { value: "pull-out", label: "Da, visoko izvlečno omaro" },
        { value: "walk-in", label: "Da, večjo vgradno shrambo" },
      ],
      value: k.pantryType,
      apply: (s, v) =>
        setRoom(s, "kitchen", {
          pantryType: v as NonNullable<typeof k.pantryType>,
          pantry: v !== "none",
        }),
    },
    boolChoice(
      "kitchen-led",
      "Želite delovno osvetlitev pod zgornjimi elementi?",
      k.hasLed,
      (s, v) => setRoom(s, "kitchen", v ? { hasLed: true } : { hasLed: false, ledLength: 0 }),
    ),
  );

  if (k.hasLed) {
    screens.push({
      kind: "number",
      key: "kitchen-led-length",
      headline: "Približno koliko metrov LED osvetlitve?",
      support: "Zadostuje ocena tekočih metrov pod zgornjimi elementi.",
      unit: "m",
      min: 0.5,
      max: 20,
      value: k.ledLength ? k.ledLength / 100 : undefined,
      apply: (s, v) => setRoom(s, "kitchen", { ledLength: Math.round(v * 100) }),
    });
  }

  screens.push(
    boolChoice("kitchen-glass", "Želite del omaric s steklenimi vrati?", k.hasGlassFronts, (s, v) =>
      setRoom(
        s,
        "kitchen",
        v ? { hasGlassFronts: true } : { hasGlassFronts: false, glassFrontLength: 0 },
      ),
    ),
  );

  if (k.hasGlassFronts) {
    screens.push({
      kind: "number",
      key: "kitchen-glass-length",
      headline: "Približno koliko metrov steklenih front?",
      unit: "m",
      min: 0.5,
      max: 10,
      value: k.glassFrontLength ? k.glassFrontLength / 100 : undefined,
      apply: (s, v) => setRoom(s, "kitchen", { glassFrontLength: Math.round(v * 100) }),
    });
  }

  return screens;
}

/* ---------------- wardrobe ---------------- */

function wardrobeScreens(state: HomeDnaState): ScreenDef[] {
  const w = state.rooms.wardrobe ?? { storageTypes: [] };
  const storage = w.storageTypes ?? [];
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "wardrobe-intro",
      eyebrow: "Garderoba",
      headline: "Najprej moramo razumeti, kaj bo omara dejansko shranjevala.",
      body: "Notranja razporeditev se mora prilagoditi vašim oblačilom, obutvi in vsakodnevnim navadam.",
      cta: "Načrtujmo notranjost",
      image: projectCloset,
    },
    {
      kind: "multi",
      key: "wardrobe-storage-types",
      headline: "Kaj bo omara večinoma shranjevala?",
      support: "Izberite največ štiri kategorije.",
      options: wardrobeStorageOptions,
      max: 4,
      limitNotice: "Izberete lahko največ štiri kategorije.",
      selected: storage,
      apply: (s, storageTypes) => setRoom(s, "wardrobe", { storageTypes }),
    },
  ];

  if (storage.some((t) => wardrobeHangingLabels.includes(t))) {
    screens.push({
      kind: "choice",
      key: "wardrobe-hanging",
      headline: "Kolikšen delež omare naj bo namenjen obešanju?",
      options: priorityLevels,
      value: w.hangingPriority,
      apply: (s, v) => setRoom(s, "wardrobe", { hangingPriority: v as Priority }),
    });
  }

  if (storage.includes(wardrobeFoldedLabel)) {
    screens.push({
      kind: "choice",
      key: "wardrobe-folded",
      headline: "Koliko prostora potrebujete za zložena oblačila?",
      options: [
        { value: "low", label: "Malo" },
        { value: "medium", label: "Srednje" },
        { value: "high", label: "Veliko" },
      ],
      value: w.foldedPriority,
      apply: (s, v) => setRoom(s, "wardrobe", { foldedPriority: v as Priority }),
    });
  }

  if (storage.includes(wardrobeShoesLabel)) {
    screens.push({
      kind: "choice",
      key: "wardrobe-shoes",
      headline: "Približno koliko parov čevljev želite shraniti?",
      options: [
        { value: "do-10", label: "Do 10" },
        { value: "11-20", label: "11–20" },
        { value: "21-40", label: "21–40" },
        { value: "40+", label: "Več kot 40" },
      ],
      value: w.shoePairs,
      apply: (s, shoePairs) => setRoom(s, "wardrobe", { shoePairs }),
    });
  }

  screens.push(
    {
      kind: "number",
      key: "wardrobe-width",
      headline: "Kako široka bo omara?",
      support: "Zadostuje približna mera razpoložljive stene.",
      unit: "cm",
      min: 60,
      max: 1000,
      presets: [150, 200, 250, 300],
      value: w.width,
      apply: (s, v) => setRoom(s, "wardrobe", { width: v }),
    },
    {
      kind: "number",
      key: "wardrobe-height",
      headline: "Kako visoka bo omara?",
      support: "Običajno do stropa ali malo nižje.",
      unit: "cm",
      min: 180,
      max: 350,
      presets: [220, 250, 270],
      value: w.height,
      apply: (s, v) => setRoom(s, "wardrobe", { height: v }),
    },
    {
      kind: "choice",
      key: "wardrobe-depth",
      headline: "Kakšna bo približna globina?",
      options: [
        { value: "40", label: "40 cm" },
        { value: "50", label: "50 cm" },
        { value: "60", label: "60 cm" },
        { value: "60+", label: "Več kot 60 cm" },
      ],
      value: w.depth === undefined ? undefined : w.depthPlus ? "60+" : String(w.depth),
      apply: (s, v) =>
        setRoom(s, "wardrobe", { depth: v === "60+" ? 60 : Number(v), depthPlus: v === "60+" }),
    },
    {
      kind: "visual",
      key: "wardrobe-doors",
      headline: "Kakšen način odpiranja vam najbolj ustreza?",
      options: wardrobeDoorOptions,
      value: w.doorType,
      apply: (s, v) => setRoom(s, "wardrobe", { doorType: v as NonNullable<typeof w.doorType> }),
    },
    boolChoice("wardrobe-led", "Želite integrirano LED osvetlitev?", w.led, (s, v) =>
      setRoom(s, "wardrobe", { led: v }),
    ),
    boolChoice("wardrobe-mirror", "Želite ogledalo kot del omare?", w.mirror, (s, v) =>
      setRoom(s, "wardrobe", { mirror: v }),
    ),
  );

  return screens;
}

/* ---------------- living room ---------------- */

function livingRoomScreens(state: HomeDnaState): ScreenDef[] {
  const l = state.rooms.livingRoom ?? {};
  return [
    {
      kind: "editorial",
      key: "living-intro",
      eyebrow: "Dnevna soba",
      headline: "Dnevni prostor naj poveže sprostitev, druženje in shranjevanje.",
      body: "Zanima nas razpoložljiva stena in način, kako prostor dejansko uporabljate.",
      cta: "Nadaljujmo",
      image: projectLiving,
    },
    {
      kind: "number",
      key: "living-wall-width",
      headline: "Kako široka je stena, namenjena pohištvu?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 100,
      max: 1200,
      presets: [250, 320, 400, 480],
      value: l.wallWidth,
      apply: (s, v) => setRoom(s, "livingRoom", { wallWidth: v }),
    },
    {
      kind: "choice",
      key: "living-tv",
      headline: "Kako velik televizor načrtujete?",
      options: [
        { value: "do-55", label: 'Do 55"' },
        { value: "65", label: '65"' },
        { value: "75", label: '75"' },
        { value: "85+", label: '85"+' },
        { value: "none", label: "Brez televizije" },
      ],
      value: l.tvSize,
      apply: (s, tvSize) => setRoom(s, "livingRoom", { tvSize }),
    },
    {
      kind: "choice",
      key: "living-storage",
      headline: "Koliko skritega shranjevanja potrebujete?",
      options: [
        { value: "low", label: "Minimalno" },
        { value: "medium", label: "Uravnoteženo" },
        { value: "high", label: "Veliko skritega shranjevanja" },
      ],
      value: l.storagePriority,
      apply: (s, v) => setRoom(s, "livingRoom", { storagePriority: v as Priority }),
    },
    {
      kind: "choice",
      key: "living-display",
      headline: "Koliko odprtih razstavnih površin želite?",
      options: [
        { value: "low", label: "Skoraj nič odprtih polic" },
        { value: "medium", label: "Nekaj razstavnih površin" },
        { value: "high", label: "Veliko odprtih polic ali vitrin" },
      ],
      value: l.displayPriority,
      apply: (s, v) => setRoom(s, "livingRoom", { displayPriority: v as Priority }),
    },
    {
      kind: "choice",
      key: "living-books",
      headline: "Koliko knjig naj prostor sprejme?",
      options: [
        { value: "do-20", label: "Do 20" },
        { value: "20-100", label: "20–100" },
        { value: "100+", label: "100+" },
        { value: "none", label: "Brez knjig" },
      ],
      value: l.books,
      apply: (s, books) => setRoom(s, "livingRoom", { books }),
    },
    boolChoice(
      "living-cables",
      "Želite skrito napeljavo kablov?",
      l.cableManagement,
      (s, v) => setRoom(s, "livingRoom", { cableManagement: v }),
    ),
    boolChoice("living-led", "Želite integrirano LED osvetlitev?", l.led, (s, v) =>
      setRoom(s, "livingRoom", { led: v }),
    ),
  ];
}

/* ---------------- entry hall ---------------- */

function entryHallScreens(state: HomeDnaState): ScreenDef[] {
  const e = state.rooms.entryHall ?? {};
  return [
    {
      kind: "editorial",
      key: "entry-intro",
      eyebrow: "Predsoba",
      headline: "Organiziran prihod domov se začne z jasnim mestom za vsakodnevne stvari.",
      body: "Zanima nas razpoložljiva širina in koliko stvari mora predsoba dnevno sprejeti.",
      cta: "Nadaljujmo",
      image: projectHall,
    },
    {
      kind: "number",
      key: "entry-width",
      headline: "Kako široka je razpoložljiva stena v predsobi?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 60,
      max: 800,
      presets: [120, 180, 240, 300],
      value: e.width,
      apply: (s, v) => setRoom(s, "entryHall", { width: v }),
    },
    {
      kind: "choice",
      key: "entry-shoes",
      headline: "Približno koliko parov čevljev mora predsoba sprejeti?",
      options: [
        { value: "do-10", label: "Do 10" },
        { value: "11-20", label: "11–20" },
        { value: "21-40", label: "21–40" },
        { value: "40+", label: "40+" },
      ],
      value: e.shoePairs,
      apply: (s, shoePairs) => setRoom(s, "entryHall", { shoePairs }),
    },
    {
      kind: "choice",
      key: "entry-jackets",
      headline: "Koliko jaken je običajno v uporabi?",
      options: [
        { value: "do-5", label: "Do 5" },
        { value: "6-10", label: "6–10" },
        { value: "11-20", label: "11–20" },
        { value: "20+", label: "20+" },
      ],
      value: e.jackets,
      apply: (s, jackets) => setRoom(s, "entryHall", { jackets }),
    },
    boolChoice("entry-long-coats", "Ali potrebujete prostor za dolge plašče?", e.longCoats, (s, v) =>
      setRoom(s, "entryHall", { longCoats: v }),
    ),
    {
      kind: "choice",
      key: "entry-bags",
      headline: "Koliko torb in nahrbtnikov je vsakodnevno v obtoku?",
      options: [
        { value: "do-3", label: "Do 3" },
        { value: "4-8", label: "4–8" },
        { value: "9+", label: "9+" },
      ],
      value: e.bags,
      apply: (s, bags) => setRoom(s, "entryHall", { bags }),
    },
    boolChoice("entry-umbrella", "Želite mesto za dežnike?", e.umbrellaStorage, (s, v) =>
      setRoom(s, "entryHall", { umbrellaStorage: v }),
    ),
    boolChoice("entry-bench", "Želite klop za obuvanje?", e.bench, (s, v) =>
      setRoom(s, "entryHall", { bench: v }),
    ),
    boolChoice("entry-mirror", "Želite ogledalo v predsobi?", e.mirror, (s, v) =>
      setRoom(s, "entryHall", { mirror: v }),
    ),
  ];
}

/* ---------------- utility ---------------- */

function utilityScreens(state: HomeDnaState): ScreenDef[] {
  const u = state.rooms.utilityRoom ?? {};
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "utility-intro",
      eyebrow: "Utility",
      headline: "Gospodinjski prostor naj skrije opravila in poenostavi vsakdan.",
      body: "Zanima nas razpoložljiva stena in oprema, ki jo mora prostor sprejeti.",
      cta: "Nadaljujmo",
      image: projectUtility,
    },
    {
      kind: "number",
      key: "utility-width",
      headline: "Kako široka je razpoložljiva stena?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 60,
      max: 800,
      presets: [120, 180, 240],
      value: u.width,
      apply: (s, v) => setRoom(s, "utilityRoom", { width: v }),
    },
    boolChoice("utility-washing", "Bo v prostoru pralni stroj?", u.washingMachine, (s, v) =>
      setRoom(
        s,
        "utilityRoom",
        v ? { washingMachine: true } : { washingMachine: false, stackedAppliances: false },
      ),
    ),
    boolChoice("utility-dryer", "Bo v prostoru sušilni stroj?", u.dryer, (s, v) =>
      setRoom(s, "utilityRoom", v ? { dryer: true } : { dryer: false, stackedAppliances: false }),
    ),
  ];

  if (u.washingMachine && u.dryer) {
    screens.push(
      boolChoice(
        "utility-stacked",
        "Naj bosta stroja postavljena drug na drugega?",
        u.stackedAppliances,
        (s, v) => setRoom(s, "utilityRoom", { stackedAppliances: v }),
      ),
    );
  }

  screens.push(
    boolChoice(
      "utility-cleaning",
      "Želite shranjevanje za čistila?",
      u.cleaningStorage,
      (s, v) => setRoom(s, "utilityRoom", { cleaningStorage: v }),
    ),
    boolChoice("utility-ironing", "Želite mesto za likalno desko?", u.ironingBoard, (s, v) =>
      setRoom(s, "utilityRoom", { ironingBoard: v }),
    ),
    boolChoice("utility-vacuum", "Želite mesto za sesalnik?", u.vacuumStorage, (s, v) =>
      setRoom(s, "utilityRoom", { vacuumStorage: v }),
    ),
    boolChoice("utility-pantry", "Želite dodatno shrambo za živila?", u.pantryStorage, (s, v) =>
      setRoom(s, "utilityRoom", { pantryStorage: v }),
    ),
  );

  return screens;
}

/* ---------------- bathroom ---------------- */

function bathroomScreens(state: HomeDnaState): ScreenDef[] {
  const b = state.rooms.bathroom ?? {};
  return [
    {
      kind: "editorial",
      key: "bathroom-intro",
      eyebrow: "Kopalnica",
      headline: "Umirjen prostor potrebuje jasno organizacijo vsakodnevnih predmetov.",
      body: "Zanima nas stena, namenjena pohištvu, in način vsakodnevne uporabe.",
      cta: "Nadaljujmo",
      image: projectBathroom,
    },
    {
      kind: "number",
      key: "bathroom-width",
      headline: "Kako široka je stena, namenjena kopalniškemu pohištvu?",
      support: "Zadostuje približna mera.",
      unit: "cm",
      min: 60,
      max: 600,
      presets: [90, 120, 160, 200],
      value: b.width,
      apply: (s, v) => setRoom(s, "bathroom", { width: v }),
    },
    {
      kind: "choice",
      key: "bathroom-sink",
      headline: "Enojni ali dvojni umivalnik?",
      options: [
        { value: "single", label: "Enojni" },
        { value: "double", label: "Dvojni" },
      ],
      value: b.singleOrDoubleSink,
      apply: (s, v) =>
        setRoom(s, "bathroom", { singleOrDoubleSink: v as NonNullable<typeof b.singleOrDoubleSink> }),
    },
    boolChoice("bathroom-tall", "Želite visoko omaro za shranjevanje?", b.tallStorage, (s, v) =>
      setRoom(s, "bathroom", { tallStorage: v }),
    ),
    boolChoice("bathroom-laundry", "Želite prostor za perilo?", b.laundryStorage, (s, v) =>
      setRoom(s, "bathroom", { laundryStorage: v }),
    ),
    boolChoice("bathroom-mirror-cabinet", "Želite ogledalno omarico?", b.mirrorCabinet, (s, v) =>
      setRoom(s, "bathroom", { mirrorCabinet: v }),
    ),
    boolChoice("bathroom-cleaning", "Želite shranjevanje za čistila?", b.cleaningStorage, (s, v) =>
      setRoom(s, "bathroom", { cleaningStorage: v }),
    ),
  ];
}

/* ---------------- home office ---------------- */

function officeScreens(state: HomeDnaState): ScreenDef[] {
  const o = state.rooms.homeOffice ?? {};
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "office-intro",
      eyebrow: "Domača pisarna",
      headline: "Delovno okolje mora podpirati osredotočenost in ostati urejeno po koncu dneva.",
      body: "Zanima nas, kdo prostor uporablja in kaj mora sprejeti.",
      cta: "Nadaljujmo",
      image: projectOffice,
    },
    {
      kind: "choice",
      key: "office-users",
      headline: "Koliko ljudi bo uporabljalo delovni prostor?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
      ],
      value: o.users === undefined ? undefined : String(o.users),
      apply: (s, v) => setRoom(s, "homeOffice", { users: Number(v) as 1 | 2 }),
    },
    {
      kind: "choice",
      key: "office-desk-width",
      headline: "Kako široko delovno mizo želite?",
      options: [
        { value: "120", label: "120 cm" },
        { value: "160", label: "160 cm" },
        { value: "200", label: "200 cm" },
        { value: "custom", label: "Po meri" },
      ],
      value:
        o.deskWidth === undefined
          ? undefined
          : [120, 160, 200].includes(o.deskWidth)
            ? String(o.deskWidth)
            : "custom",
      apply: (s, v) =>
        v === "custom"
          ? setRoom(s, "homeOffice", { deskWidth: 0 })
          : setRoom(s, "homeOffice", { deskWidth: Number(v) }),
    },
  ];

  const custom = o.deskWidth !== undefined && ![120, 160, 200].includes(o.deskWidth);
  if (custom) {
    screens.push({
      kind: "number",
      key: "office-desk-custom",
      headline: "Kako široka naj bo miza po meri?",
      unit: "cm",
      min: 80,
      max: 400,
      value: o.deskWidth ? o.deskWidth : undefined,
      apply: (s, v) => setRoom(s, "homeOffice", { deskWidth: v }),
    });
  }

  screens.push(
    {
      kind: "choice",
      key: "office-monitors",
      headline: "Koliko zaslonov uporabljate?",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3+", label: "3+" },
      ],
      value: o.monitors,
      apply: (s, monitors) => setRoom(s, "homeOffice", { monitors }),
    },
    boolChoice("office-printer", "Želite mesto za tiskalnik?", o.printerStorage, (s, v) =>
      setRoom(s, "homeOffice", { printerStorage: v }),
    ),
    boolChoice("office-documents", "Želite shranjevanje za dokumente?", o.documentStorage, (s, v) =>
      setRoom(s, "homeOffice", { documentStorage: v }),
    ),
    boolChoice("office-books", "Želite prostor za knjige?", o.books, (s, v) =>
      setRoom(s, "homeOffice", { books: v }),
    ),
    boolChoice("office-cables", "Želite skrito napeljavo kablov?", o.cableManagement, (s, v) =>
      setRoom(s, "homeOffice", { cableManagement: v }),
    ),
  );

  return screens;
}

/* ---------------- assembly ---------------- */

const roomIntroImages: Record<string, string> = {
  kitchen: projectKitchen,
  wardrobe: projectCloset,
  "living-room": projectLiving,
  "entry-hall": projectHall,
  "utility-room": projectUtility,
  bathroom: projectBathroom,
  "home-office": projectOffice,
};

const moduleOrder: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "home-office",
];

const moduleBuilders: Record<string, (state: HomeDnaState) => ScreenDef[]> = {
  kitchen: kitchenScreens,
  wardrobe: wardrobeScreens,
  "living-room": livingRoomScreens,
  "entry-hall": entryHallScreens,
  "utility-room": utilityScreens,
  bathroom: bathroomScreens,
  "home-office": officeScreens,
};

export function buildSprint3Screens(state: HomeDnaState): ScreenDef[] {
  const activeRooms = moduleOrder.filter((room) => hasRoom(state, room));
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

  const modules = activeRooms.flatMap((room) => moduleBuilders[room]?.(state) ?? []);

  return [
    ...lifestyleScreens(state),
    ...roomIntro,
    ...modules,
    {
      kind: "editorial",
      key: "sprint4-placeholder",
      eyebrow: "Skoraj končano",
      headline: "Vaš dom smo spoznali. Zdaj bomo določili raven izvedbe in okvirno investicijo.",
      body: "V naslednjem koraku bomo povezali obseg projekta, izbrane rešitve in želeni nivo izvedbe.",
      cta: "Nadaljujemo v naslednjem sprintu",
      image: heroInterior,
    },
  ];
}
