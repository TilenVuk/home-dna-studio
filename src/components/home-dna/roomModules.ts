import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import {
  kitchenLayoutOptions,
  wardrobeDoorOptions,
  wardrobeFoldedLabel,
  wardrobeHangingLabels,
  wardrobeShoesLabel,
  wardrobeStorageOptions,
  worktopOptions,
} from "./discoveryData";
import { priorityLevels, setRoom, type ScreenDef } from "./screenDef";
import type { HomeDnaState, Priority, RoomKey } from "./homeDnaTypes";

const noKitchenFeatures = "Brez dodatkov";
const kitchenLedFeature = "Delovna LED osvetlitev";
const kitchenGlassFeature = "Steklene fronte";

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

const noOfficeFeatures = "Brez dodatkov";
const officePrinterFeature = "Mesto za tiskalnik";
const officeDocumentsFeature = "Shranjevanje za dokumente";
const officeBooksFeature = "Prostor za knjige";
const officeCablesFeature = "Skrita napeljava kablov";

function selectedFeatures(entries: Array<[label: string, value: boolean | undefined]>, noneLabel: string): string[] {
  const selected = entries.filter(([, value]) => value === true).map(([label]) => label);
  if (selected.length > 0) return selected;
  return entries.every(([, value]) => value !== undefined) ? [noneLabel] : [];
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
      value: k.tallUnits === undefined ? undefined : k.tallUnitsPlus ? "4+" : String(k.tallUnits),
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
      prominentEyebrow: true,
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
      apply: (s, v) => setRoom(s, "wardrobe", { depth: v === "60+" ? 60 : Number(v), depthPlus: v === "60+" }),
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
      options: [entryLongCoatsFeature, entryUmbrellaFeature, entryBenchFeature, entryMirrorFeature, noEntryFeatures],
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
      body: "Zanima nas stena, namenjena pohištvu, in način vsakodnevne uporabe.",
      cta: "Nadaljujmo",
      image: projectBathroom,
      prominentEyebrow: true,
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
      prominentEyebrow: true,
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
        o.deskWidth === undefined ? undefined : [120, 160, 200].includes(o.deskWidth) ? String(o.deskWidth) : "custom",
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
    {
      kind: "multi",
      key: "office-features",
      headline: "Kaj še potrebuje domača pisarna?",
      support: "Izberite vse želene rešitve ali možnost brez dodatkov.",
      options: [
        officePrinterFeature,
        officeDocumentsFeature,
        officeBooksFeature,
        officeCablesFeature,
        noOfficeFeatures,
      ],
      exclusive: noOfficeFeatures,
      selected: selectedFeatures(
        [
          [officePrinterFeature, o.printerStorage],
          [officeDocumentsFeature, o.documentStorage],
          [officeBooksFeature, o.books],
          [officeCablesFeature, o.cableManagement],
        ],
        noOfficeFeatures,
      ),
      apply: (s, features) =>
        setRoom(s, "homeOffice", {
          printerStorage: features.includes(officePrinterFeature),
          documentStorage: features.includes(officeDocumentsFeature),
          books: features.includes(officeBooksFeature),
          cableManagement: features.includes(officeCablesFeature),
        }),
    },
  );

  return screens;
}

export const roomModuleOrder: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "home-office",
];

export const roomModuleBuilders: Record<string, (state: HomeDnaState) => ScreenDef[]> = {
  kitchen: kitchenScreens,
  wardrobe: wardrobeScreens,
  "living-room": livingRoomScreens,
  "entry-hall": entryHallScreens,
  "utility-room": utilityScreens,
  bathroom: bathroomScreens,
  "home-office": officeScreens,
};

export const roomIntroImages: Record<string, string> = {
  kitchen: projectKitchen,
  wardrobe: projectCloset,
  "living-room": projectLiving,
  "entry-hall": projectHall,
  "utility-room": projectUtility,
  bathroom: projectBathroom,
  "home-office": projectOffice,
};
