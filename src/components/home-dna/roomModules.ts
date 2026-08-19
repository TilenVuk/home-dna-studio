import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectChildRoom from "@/assets/project-child-room.jpg";
import {
  kitchenFrontMaterialOptions,
  kitchenFrontPriorityOptions,
  kitchenLayoutOptions,
  wardrobeDoorOptions,
  wardrobeFoldedLabel,
  wardrobeHangingLabels,
  wardrobeShoesLabel,
  wardrobeStorageOptions,
  worktopOptions,
} from "./discoveryData";
import { hasRoom, priorityLevels, setRoom, type ScreenDef } from "./screenDef";
import type {
  HomeDnaState,
  KitchenFrontMaterial,
  KitchenFrontPriority,
  Priority,
  RoomKey,
} from "./homeDnaTypes";

const noKitchenFeatures = "Brez dodatkov";
const kitchenLedFeature = "Delovna LED osvetlitev";
const kitchenGlassFeature = "Steklene fronte";
const noKitchenAppliances = "Aparati niso del projekta";
const kitchenApplianceOptions = [
  "Hladilnik z zamrzovalnikom",
  "Pomivalni stroj",
  "Pečica",
  "Kuhalna plošča",
  "Mikrovalovna pečica",
  "Kavni aparat",
  "Vinska vitrina",
  "Napa",
  noKitchenAppliances,
];

const noWardrobeFeatures = "Brez dodatkov";
const wardrobeLedFeature = "Integrirana LED osvetlitev";
const wardrobeMirrorFeature = "Ogledalo";

const noLivingFeatures = "Brez dodatkov";
const livingCableFeature = "Skrita napeljava kablov";
const livingLedFeature = "Integrirana LED osvetlitev";

const noEntryFeatures = "Brez dodatkov";
const entryLongCoatsFeature = "Prostor za dolge plašče";
const entryUmbrellaFeature = "Mesto za dežnike";
const entryBenchFeature = "Klop za obuvanje";
const entryMirrorFeature = "Ogledalo";

const noUtilityAppliances = "Brez pralnega in sušilnega stroja";
const utilityWashingFeature = "Pralni stroj";
const utilityDryerFeature = "Sušilni stroj";
const noUtilityStorage = "Brez dodatnega shranjevanja";
const utilityCleaningFeature = "Čistila";
const utilityIroningFeature = "Likalna deska";
const utilityVacuumFeature = "Sesalnik";
const utilityPantryFeature = "Živila";

const noBathroomFeatures = "Brez dodatkov";
const bathroomTallFeature = "Visoka omara";
const bathroomLaundryFeature = "Prostor za perilo";
const bathroomMirrorFeature = "Ogledalna omarica";
const bathroomCleaningFeature = "Shranjevanje za čistila";

const bedroomWardrobe = "Vgradna garderobna omara";
const bedroomBedFrame = "Postelja z vzglavjem";
const bedroomBedsideTables = "Nočni omarici";
const bedroomDressingTable = "Toaletna mizica ali konzola";
const bedroomTvWall = "TV-stena";
const noBedroomFeatures = "Brez dodatkov";
const bedroomLedFeature = "Integrirana LED osvetlitev";
const bedroomMirrorFeature = "Ogledalo";
const bedroomUpholsteredFeature = "Tapecirano vzglavje";

const childWardrobe = "Vgradna omara";
const childBedStorage = "Postelja s shranjevanjem";
const childDesk = "Pisalna miza";
const childOpenStorage = "Odprte police ali regali";
const noChildRoomFeatures = "Brez dodatkov";
const childAdaptableFeature = "Pohištvo, prilagodljivo starosti";
const childLedFeature = "Integrirana LED osvetlitev";
const childDisplayFeature = "Magnetna ali razstavna stena";

function selectedFeatures(
  entries: Array<[label: string, value: boolean | undefined]>,
  noneLabel: string,
): string[] {
  const selected = entries.filter(([, value]) => value === true).map(([label]) => label);
  if (selected.length > 0) return selected;
  return entries.every(([, value]) => value !== undefined) ? [noneLabel] : [];
}

function selectedBooleanOptions(
  entries: Array<[label: string, value: boolean | undefined]>,
): string[] {
  return entries.filter(([, value]) => value === true).map(([label]) => label);
}

/* ---------------- kitchen ---------------- */

function kitchenScreens(state: HomeDnaState): ScreenDef[] {
  const k = state.rooms.kitchen ?? { appliances: [] };
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "kitchen-intro",
      eyebrow: "Kuhinja",
      headline: "Kuhinja naj sledi načinu, kako kuhate in živite.",
      body: "Potrebujemo le približno postavitev, dolžine in nekaj ključnih odločitev.",
      cta: "Začnimo s kuhinjo",
      image: projectKitchen,
      prominentEyebrow: true,
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
        max: 600,
        presets: [180, 240, 300, 400, 500, 600],
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
        max: 200,
        presets: [90, 100, 120, 150, 200],
        value: k.islandWidth,
        apply: (s, v) => setRoom(s, "kitchen", { islandWidth: v }),
      },
      {
        kind: "choice",
        key: "kitchen-island-seats",
        headline: "Koliko sedežev želite ob otoku?",
        support: "Število sedežev vpliva na dolžino, previs delovne plošče in prehode okoli otoka.",
        options: [
          { value: "none", label: "Brez sedišč" },
          { value: "2", label: "2 sedeža" },
          { value: "3", label: "3 sedeži" },
          { value: "4+", label: "4 ali več" },
        ],
        value: k.islandSeats,
        apply: (s, islandSeats) => setRoom(s, "kitchen", { islandSeats }),
      },
    );
  }

  screens.push(
    {
      kind: "multi",
      key: "kitchen-appliances",
      headline: "Katere aparate mora kuhinja vključiti?",
      support: "Izberite vse aparate, ki vplivajo na razporeditev omar in priključkov.",
      options: kitchenApplianceOptions,
      exclusive: noKitchenAppliances,
      selected: k.appliances ?? [],
      apply: (s, appliances) => setRoom(s, "kitchen", { appliances }),
    },
    {
      kind: "choice",
      key: "kitchen-front-material",
      headline: "Kakšne fronte si želite?",
      support:
        "Izberite najbližjo možnost. Če še niste odločeni, vam bomo material priporočili glede na uporabo in želeni videz.",
      options: kitchenFrontMaterialOptions,
      value: k.frontMaterial,
      apply: (s, v) => setRoom(s, "kitchen", { frontMaterial: v as KitchenFrontMaterial }),
    },
    {
      kind: "multi",
      key: "kitchen-front-priorities",
      headline: "Kaj vam je pri kuhinjskih frontah najpomembnejše?",
      support: "Izberite največ dve lastnosti, ki naj imata pri priporočilu prednost.",
      options: kitchenFrontPriorityOptions,
      max: 2,
      limitNotice: "Izberete lahko največ dve lastnosti.",
      selected: k.frontPriorities ?? [],
      apply: (s, frontPriorities) =>
        setRoom(s, "kitchen", { frontPriorities: frontPriorities as KitchenFrontPriority[] }),
    },
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
    {
      kind: "multi",
      key: "kitchen-features",
      headline: "Katere dodatke želite v kuhinji?",
      support: "Izberite vse želene dodatke ali možnost brez dodatkov.",
      options: [kitchenLedFeature, kitchenGlassFeature, noKitchenFeatures],
      exclusive: noKitchenFeatures,
      selected: selectedFeatures(
        [
          [kitchenLedFeature, k.hasLed],
          [kitchenGlassFeature, k.hasGlassFronts],
        ],
        noKitchenFeatures,
      ),
      apply: (s, features) => {
        const hasLed = features.includes(kitchenLedFeature);
        const hasGlassFronts = features.includes(kitchenGlassFeature);
        return setRoom(s, "kitchen", {
          hasLed,
          hasGlassFronts,
          ...(!hasLed ? { ledLength: 0 } : {}),
          ...(!hasGlassFronts ? { glassFrontLength: 0 } : {}),
        });
      },
    },
  );

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
      body: "Najprej določimo število garderob, nato opišete eno tipično garderobo, po kateri pripravimo skupno oceno.",
      cta: "Načrtujmo notranjost",
      image: projectCloset,
      prominentEyebrow: true,
    },
    {
      kind: "choice",
      key: "wardrobe-quantity",
      headline: "Koliko garderob vključuje projekt?",
      support:
        "Naslednji odgovori veljajo za eno tipično garderobo; okvirno investicijo pomnožimo s številom. Pri 4+ računamo najmanj štiri.",
      options: ["1", "2", "3", "4+"].map((value) => ({ value, label: value })),
      value:
        w.quantity === undefined
          ? undefined
          : w.quantityPlus
            ? `${w.quantity}+`
            : String(w.quantity),
      apply: (s, value) =>
        setRoom(s, "wardrobe", {
          quantity: value === "4+" ? 4 : Number(value),
          quantityPlus: value === "4+",
        }),
    },
    {
      kind: "choice",
      key: "wardrobe-users",
      headline: "Koliko oseb bo uporabljalo posamezno garderobo?",
      support: "Podatek pomaga pravilno razdeliti notranjost omare in določiti ločene cone.",
      options: [
        { value: "1", label: "1 oseba" },
        { value: "2", label: "2 osebi" },
        { value: "3+", label: "3 ali več" },
      ],
      value: w.users,
      apply: (s, users) => setRoom(s, "wardrobe", { users }),
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
    {
      kind: "multi",
      key: "wardrobe-features",
      headline: "Katere dodatke želite v garderobi?",
      support: "Izberite vse želene dodatke ali možnost brez dodatkov.",
      options: [wardrobeLedFeature, wardrobeMirrorFeature, noWardrobeFeatures],
      exclusive: noWardrobeFeatures,
      selected: selectedFeatures(
        [
          [wardrobeLedFeature, w.led],
          [wardrobeMirrorFeature, w.mirror],
        ],
        noWardrobeFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "wardrobe", {
          led: features.includes(wardrobeLedFeature),
          mirror: features.includes(wardrobeMirrorFeature),
        }),
    },
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
      prominentEyebrow: true,
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
    {
      kind: "multi",
      key: "living-features",
      headline: "Katere dodatke želite v dnevni sobi?",
      support: "Izberite vse želene dodatke ali možnost brez dodatkov.",
      options: [livingCableFeature, livingLedFeature, noLivingFeatures],
      exclusive: noLivingFeatures,
      selected: selectedFeatures(
        [
          [livingCableFeature, l.cableManagement],
          [livingLedFeature, l.led],
        ],
        noLivingFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "livingRoom", {
          cableManagement: features.includes(livingCableFeature),
          led: features.includes(livingLedFeature),
        }),
    },
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
      prominentEyebrow: true,
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
    {
      kind: "multi",
      key: "entry-features",
      headline: "Kaj še potrebuje vaša predsoba?",
      support: "Izberite vse želene rešitve ali možnost brez dodatkov.",
      options: [
        entryLongCoatsFeature,
        entryUmbrellaFeature,
        entryBenchFeature,
        entryMirrorFeature,
        noEntryFeatures,
      ],
      exclusive: noEntryFeatures,
      selected: selectedFeatures(
        [
          [entryLongCoatsFeature, e.longCoats],
          [entryUmbrellaFeature, e.umbrellaStorage],
          [entryBenchFeature, e.bench],
          [entryMirrorFeature, e.mirror],
        ],
        noEntryFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "entryHall", {
          longCoats: features.includes(entryLongCoatsFeature),
          umbrellaStorage: features.includes(entryUmbrellaFeature),
          bench: features.includes(entryBenchFeature),
          mirror: features.includes(entryMirrorFeature),
        }),
    },
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
      prominentEyebrow: true,
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
    {
      kind: "multi",
      key: "utility-appliances",
      headline: "Kateri aparati bodo v prostoru?",
      support: "Izberite vse aparate ali možnost brez pralnega in sušilnega stroja.",
      options: [utilityWashingFeature, utilityDryerFeature, noUtilityAppliances],
      exclusive: noUtilityAppliances,
      selected: selectedFeatures(
        [
          [utilityWashingFeature, u.washingMachine],
          [utilityDryerFeature, u.dryer],
        ],
        noUtilityAppliances,
      ),
      apply: (s, features) => {
        const washingMachine = features.includes(utilityWashingFeature);
        const dryer = features.includes(utilityDryerFeature);
        return setRoom(s, "utilityRoom", {
          washingMachine,
          dryer,
          ...(!(washingMachine && dryer) ? { stackedAppliances: false } : {}),
        });
      },
    },
  ];

  if (u.washingMachine && u.dryer) {
    screens.push({
      kind: "choice",
      key: "utility-stacked",
      headline: "Naj bosta stroja postavljena drug na drugega?",
      options: [
        { value: "yes", label: "Da" },
        { value: "no", label: "Ne" },
      ],
      value: u.stackedAppliances === undefined ? undefined : u.stackedAppliances ? "yes" : "no",
      apply: (s, value) => setRoom(s, "utilityRoom", { stackedAppliances: value === "yes" }),
    });
  }

  screens.push({
    kind: "multi",
    key: "utility-storage",
    headline: "Kaj mora prostor še shranjevati?",
    support: "Izberite vse želene kategorije ali možnost brez dodatnega shranjevanja.",
    options: [
      utilityCleaningFeature,
      utilityIroningFeature,
      utilityVacuumFeature,
      utilityPantryFeature,
      noUtilityStorage,
    ],
    exclusive: noUtilityStorage,
    selected: selectedFeatures(
      [
        [utilityCleaningFeature, u.cleaningStorage],
        [utilityIroningFeature, u.ironingBoard],
        [utilityVacuumFeature, u.vacuumStorage],
        [utilityPantryFeature, u.pantryStorage],
      ],
      noUtilityStorage,
    ),
    apply: (s, features) =>
      setRoom(s, "utilityRoom", {
        cleaningStorage: features.includes(utilityCleaningFeature),
        ironingBoard: features.includes(utilityIroningFeature),
        vacuumStorage: features.includes(utilityVacuumFeature),
        pantryStorage: features.includes(utilityPantryFeature),
      }),
  });

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
      body: "Najprej določimo število kopalnic, nato opišete pohištvo v eni tipični kopalnici, po kateri pripravimo skupno oceno.",
      cta: "Nadaljujmo",
      image: projectBathroom,
      prominentEyebrow: true,
    },
    {
      kind: "choice",
      key: "bathroom-quantity",
      headline: "Koliko kopalnic vključuje projekt?",
      support:
        "Naslednji odgovori opisujejo pohištvo v eni tipični kopalnici; okvirno investicijo pomnožimo s številom. Pri 4+ računamo najmanj štiri.",
      options: ["1", "2", "3", "4+"].map((value) => ({ value, label: value })),
      value:
        b.quantity === undefined
          ? undefined
          : b.quantityPlus
            ? `${b.quantity}+`
            : String(b.quantity),
      apply: (s, value) =>
        setRoom(s, "bathroom", {
          quantity: value === "4+" ? 4 : Number(value),
          quantityPlus: value === "4+",
        }),
    },
    {
      kind: "choice",
      key: "bathroom-users",
      headline: "Koliko oseb redno uporablja posamezno kopalnico?",
      support:
        "To vpliva na količino shranjevanja, širino umivalniškega sestava in organizacijo predalov.",
      options: [
        { value: "1", label: "1 oseba" },
        { value: "2", label: "2 osebi" },
        { value: "3-4", label: "3–4 osebe" },
        { value: "5+", label: "5 ali več" },
      ],
      value: b.users,
      apply: (s, users) => setRoom(s, "bathroom", { users }),
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
        setRoom(s, "bathroom", {
          singleOrDoubleSink: v as NonNullable<typeof b.singleOrDoubleSink>,
        }),
    },
    {
      kind: "multi",
      key: "bathroom-features",
      headline: "Katere rešitve potrebujete v kopalnici?",
      support: "Izberite vse želene rešitve ali možnost brez dodatkov.",
      options: [
        bathroomTallFeature,
        bathroomLaundryFeature,
        bathroomMirrorFeature,
        bathroomCleaningFeature,
        noBathroomFeatures,
      ],
      exclusive: noBathroomFeatures,
      selected: selectedFeatures(
        [
          [bathroomTallFeature, b.tallStorage],
          [bathroomLaundryFeature, b.laundryStorage],
          [bathroomMirrorFeature, b.mirrorCabinet],
          [bathroomCleaningFeature, b.cleaningStorage],
        ],
        noBathroomFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "bathroom", {
          tallStorage: features.includes(bathroomTallFeature),
          laundryStorage: features.includes(bathroomLaundryFeature),
          mirrorCabinet: features.includes(bathroomMirrorFeature),
          cleaningStorage: features.includes(bathroomCleaningFeature),
        }),
    },
  ];
}

/* ---------------- bedroom ---------------- */

function bedroomScreens(state: HomeDnaState): ScreenDef[] {
  const b = state.rooms.bedroom ?? {};
  const wardrobeHandledSeparately = hasRoom(state, "wardrobe");
  const furnitureEntries: Array<[string, boolean | undefined]> = [
    ...(wardrobeHandledSeparately
      ? []
      : ([[bedroomWardrobe, b.wardrobe]] as Array<[string, boolean | undefined]>)),
    [bedroomBedFrame, b.bedFrame],
    [bedroomBedsideTables, b.bedsideTables],
    [bedroomDressingTable, b.dressingTable],
    [bedroomTvWall, b.tvWall],
  ];
  const screens: ScreenDef[] = [
    {
      kind: "editorial",
      key: "bedroom-intro",
      eyebrow: "Spalnica",
      headline: "Spalnica naj združi umirjenost, shranjevanje in udobje brez vizualnega nemira.",
      body: "Zanima nas, katere elemente želite izdelati po meri in koliko prostora jim lahko namenite.",
      cta: "Načrtujmo spalnico",
      image: projectBedroom,
      prominentEyebrow: true,
    },
    {
      kind: "multi",
      key: "bedroom-furniture",
      headline: "Katere elemente želite vključiti v spalnico?",
      support: "Izberite vse elemente, ki naj bodo del celostne rešitve po meri.",
      options: furnitureEntries.map(([label]) => label),
      selected: selectedBooleanOptions(furnitureEntries),
      apply: (s, features) =>
        setRoom(s, "bedroom", {
          wardrobe: !wardrobeHandledSeparately && features.includes(bedroomWardrobe),
          bedFrame: features.includes(bedroomBedFrame),
          bedsideTables: features.includes(bedroomBedsideTables),
          dressingTable: features.includes(bedroomDressingTable),
          tvWall: features.includes(bedroomTvWall),
        }),
    },
    {
      kind: "number",
      key: "bedroom-furniture-width",
      headline: "Kolikšna je skupna dolžina pohištva po meri?",
      support: wardrobeHandledSeparately
        ? "Seštejte približno dolžino posteljnega sestava in drugih izbranih elementov brez garderob."
        : "Seštejte približno dolžino omare, posteljnega sestava in drugih izbranih elementov.",
      unit: "cm",
      min: 100,
      max: 1200,
      presets: [250, 350, 450, 600],
      value: b.furnitureWidth,
      apply: (s, furnitureWidth) => setRoom(s, "bedroom", { furnitureWidth }),
    },
  ];

  if (b.bedFrame) {
    screens.push({
      kind: "choice",
      key: "bedroom-bed-width",
      headline: "Kako široko posteljo načrtujete?",
      options: [
        { value: "140", label: "140 cm" },
        { value: "160", label: "160 cm" },
        { value: "180", label: "180 cm" },
        { value: "200", label: "200 cm" },
      ],
      value: b.bedWidth,
      apply: (s, bedWidth) =>
        setRoom(s, "bedroom", { bedWidth: bedWidth as NonNullable<typeof b.bedWidth> }),
    });
  }

  screens.push({
    kind: "multi",
    key: "bedroom-features",
    headline: "Katere dodatke želite v spalnici?",
    support: "Izberite vse želene dodatke ali možnost brez dodatkov.",
    options: [
      bedroomLedFeature,
      bedroomMirrorFeature,
      bedroomUpholsteredFeature,
      noBedroomFeatures,
    ],
    exclusive: noBedroomFeatures,
    selected: selectedFeatures(
      [
        [bedroomLedFeature, b.led],
        [bedroomMirrorFeature, b.mirror],
        [bedroomUpholsteredFeature, b.upholsteredHeadboard],
      ],
      noBedroomFeatures,
    ),
    apply: (s, features) =>
      setRoom(s, "bedroom", {
        led: features.includes(bedroomLedFeature),
        mirror: features.includes(bedroomMirrorFeature),
        upholsteredHeadboard: features.includes(bedroomUpholsteredFeature),
      }),
  });

  return screens;
}

/* ---------------- children's rooms ---------------- */

function childrenRoomScreens(state: HomeDnaState): ScreenDef[] {
  const c = state.rooms.childrenRoom ?? { ageGroups: [] };
  const quantity = state.home.childrenCount ?? 1;
  const quantityLabel = `${quantity}${state.home.childrenCountPlus ? "+" : ""}`;

  return [
    {
      kind: "editorial",
      key: "children-room-intro",
      eyebrow: `Otroške sobe · ${quantityLabel}`,
      headline: `En skupen koncept bomo prilagodili za ${quantityLabel} ${quantity === 1 ? "otroško sobo" : "otroške sobe"}.`,
      body: "Odgovori veljajo za posamezno sobo, okvirna investicija pa se samodejno pomnoži s številom otrok.",
      cta: "Načrtujmo otroške sobe",
      image: projectChildRoom,
      prominentEyebrow: true,
    },
    {
      kind: "multi",
      key: "children-room-ages",
      headline: "Katerim starostnim skupinam so sobe namenjene?",
      support:
        "Izberite vse ustrezne skupine. Tako lahko predvidimo varnost, višine in kasnejše prilagoditve.",
      options: ["0–3 leta", "4–6 let", "7–12 let", "13 let ali več"],
      selected: c.ageGroups ?? [],
      apply: (s, ageGroups) => setRoom(s, "childrenRoom", { ageGroups }),
    },
    {
      kind: "multi",
      key: "children-room-furniture",
      headline: "Kaj naj vključuje posamezna otroška soba?",
      support: "Izberite vse elemente, ki naj bodo del rešitve po meri.",
      options: [childWardrobe, childBedStorage, childDesk, childOpenStorage],
      selected: selectedBooleanOptions([
        [childWardrobe, c.wardrobe],
        [childBedStorage, c.bedWithStorage],
        [childDesk, c.desk],
        [childOpenStorage, c.openStorage],
      ]),
      apply: (s, features) =>
        setRoom(s, "childrenRoom", {
          wardrobe: features.includes(childWardrobe),
          bedWithStorage: features.includes(childBedStorage),
          desk: features.includes(childDesk),
          openStorage: features.includes(childOpenStorage),
        }),
    },
    {
      kind: "number",
      key: "children-room-furniture-width",
      headline: "Kolikšna je skupna dolžina pohištva po meri v eni sobi?",
      support:
        "Vnesite približno skupno dolžino omare, postelje, mize in shranjevalnih elementov v posamezni sobi.",
      unit: "cm",
      min: 100,
      max: 1000,
      presets: [250, 300, 400, 500],
      value: c.furnitureWidth,
      apply: (s, furnitureWidth) => setRoom(s, "childrenRoom", { furnitureWidth }),
    },
    {
      kind: "multi",
      key: "children-room-features",
      headline: "Katere dodatke želite v otroških sobah?",
      support: "Izbor velja za vsako otroško sobo.",
      options: [childAdaptableFeature, childLedFeature, childDisplayFeature, noChildRoomFeatures],
      exclusive: noChildRoomFeatures,
      selected: selectedFeatures(
        [
          [childAdaptableFeature, c.adaptableFurniture],
          [childLedFeature, c.led],
          [childDisplayFeature, c.displayBoard],
        ],
        noChildRoomFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "childrenRoom", {
          adaptableFurniture: features.includes(childAdaptableFeature),
          led: features.includes(childLedFeature),
          displayBoard: features.includes(childDisplayFeature),
        }),
    },
  ];
}

export const roomModuleOrder: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "bedroom",
  "children-room",
];

export const roomModuleBuilders: Record<string, (state: HomeDnaState) => ScreenDef[]> = {
  kitchen: kitchenScreens,
  wardrobe: wardrobeScreens,
  "living-room": livingRoomScreens,
  "entry-hall": entryHallScreens,
  "utility-room": utilityScreens,
  bathroom: bathroomScreens,
  bedroom: bedroomScreens,
  "children-room": childrenRoomScreens,
};

export const roomIntroImages: Record<string, string> = {
  kitchen: projectKitchen,
  wardrobe: projectCloset,
  "living-room": projectLiving,
  "entry-hall": projectHall,
  "utility-room": projectUtility,
  bathroom: projectBathroom,
  bedroom: projectBedroom,
  "children-room": projectChildRoom,
};
