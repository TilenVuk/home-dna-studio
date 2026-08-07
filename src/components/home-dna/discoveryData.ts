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
import type {
  ExecutionLevel,
  KitchenFrontMaterial,
  KitchenFrontPriority,
  KitchenState,
  RoomKey,
  VisualOption,
  WardrobeState,
} from "./homeDnaTypes";

const individualRoomKeys: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "bedroom",
  "children-room",
];

function includesScope(selectedRooms: RoomKey[], rooms: RoomKey[]): boolean {
  return (
    selectedRooms.includes("complete-home") || rooms.some((room) => selectedRooms.includes(room))
  );
}

function scopedOptions(
  options: string[],
  rules: Record<string, RoomKey[]>,
  selectedRooms: RoomKey[],
): string[] {
  if (selectedRooms.includes("complete-home")) return options;
  return options.filter((option) =>
    includesScope(selectedRooms, rules[option] ?? individualRoomKeys),
  );
}

export const priorityOptions = [
  "Družinsko življenje",
  "Kuhanje",
  "Organizacija",
  "Sprostitev",
  "Delo od doma",
  "Gostje in druženje",
  "Hobiji",
  "Čim manj vzdrževanja",
];

export const lifestyleOptions = priorityOptions;

const lifestyleScope: Record<string, RoomKey[]> = {
  "Družinsko življenje": [
    "kitchen",
    "living-room",
    "entry-hall",
    "bathroom",
    "bedroom",
    "children-room",
  ],
  Kuhanje: ["kitchen"],
  Organizacija: individualRoomKeys,
  Sprostitev: ["living-room", "bathroom", "bedroom"],
  "Delo od doma": ["living-room", "bedroom"],
  "Gostje in druženje": ["kitchen", "living-room"],
  Hobiji: ["wardrobe", "living-room", "entry-hall", "utility-room", "children-room"],
  "Čim manj vzdrževanja": individualRoomKeys,
};

export function lifestyleOptionsForRooms(selectedRooms: RoomKey[]): string[] {
  return scopedOptions(lifestyleOptions, lifestyleScope, selectedRooms);
}

export const executionLevelOptions: VisualOption<ExecutionLevel>[] = [
  {
    value: "basic",
    title: "Osnovni",
    description:
      "Kakovostna izdelava iz preverjenih materialov. Odlična izbira za večino projektov.",
    image: investmentEssential,
  },
  {
    value: "premium",
    title: "Premium",
    badge: "Priporočeno",
    description:
      "Najbolj priljubljena izbira. Izboljšani materiali, dovršeni detajli in najboljše razmerje med kakovostjo ter investicijo.",
    image: investmentConsidered,
  },
  {
    value: "signature",
    title: "Signature",
    description:
      "Individualna izvedba brez kompromisov. Vrhunski materiali, unikatni detajli in popolnoma prilagojene rešitve.",
    image: investmentSignature,
  },
];

export const challengeOptions = [
  "Premalo prostora za shranjevanje",
  "Neurejena garderoba",
  "Predsoba se hitro napolni",
  "Kuhinjski pulti so vedno polni",
  "Premalo delovne površine v kuhinji",
  "Ni dovolj prostora za shrambo",
  "Premalo prostora za delo od doma",
  "Prostor deluje vizualno preobremenjen",
  "Slaba izraba prostora",
  "Drugo",
];

const challengeScope: Record<string, RoomKey[]> = {
  "Premalo prostora za shranjevanje": individualRoomKeys,
  "Neurejena garderoba": ["wardrobe", "bedroom"],
  "Predsoba se hitro napolni": ["entry-hall"],
  "Kuhinjski pulti so vedno polni": ["kitchen"],
  "Premalo delovne površine v kuhinji": ["kitchen"],
  "Ni dovolj prostora za shrambo": ["kitchen", "utility-room"],
  "Premalo prostora za delo od doma": ["living-room", "bedroom"],
  "Prostor deluje vizualno preobremenjen": individualRoomKeys,
  "Slaba izraba prostora": individualRoomKeys,
  Drugo: individualRoomKeys,
};

export function challengeOptionsForRooms(selectedRooms: RoomKey[]): string[] {
  return scopedOptions(challengeOptions, challengeScope, selectedRooms);
}

export const otherChallengeLabel = "Drugo";

export const hobbyOptions = [
  "Kolesarjenje",
  "Smučanje in zimski športi",
  "Pohodništvo",
  "Fitnes",
  "Glasba",
  "Knjige in branje",
  "Gaming",
  "Fotografija",
  "Ročna dela",
  "Vrtnarjenje",
  "Brez posebnih potreb",
];

export const noHobbiesLabel = "Brez posebnih potreb";

export const futureNeedsOptions = [
  "Rast družine",
  "Otroci bodo potrebovali več prostora",
  "Več dela od doma",
  "Novi hobiji ali športna oprema",
  "Več obiskov in druženja",
  "Prilagoditev za staranje",
  "Brez večjih sprememb",
];

const futureNeedsScope: Record<string, RoomKey[]> = {
  "Rast družine": [
    "kitchen",
    "wardrobe",
    "living-room",
    "entry-hall",
    "bathroom",
    "bedroom",
    "children-room",
  ],
  "Otroci bodo potrebovali več prostora": [
    "wardrobe",
    "living-room",
    "entry-hall",
    "bedroom",
    "children-room",
  ],
  "Več dela od doma": ["living-room", "bedroom"],
  "Novi hobiji ali športna oprema": [
    "wardrobe",
    "living-room",
    "entry-hall",
    "utility-room",
    "children-room",
  ],
  "Več obiskov in druženja": ["kitchen", "living-room"],
  "Prilagoditev za staranje": ["kitchen", "living-room", "entry-hall", "bathroom", "bedroom"],
  "Brez večjih sprememb": individualRoomKeys,
};

export function futureNeedsOptionsForRooms(selectedRooms: RoomKey[]): string[] {
  return scopedOptions(futureNeedsOptions, futureNeedsScope, selectedRooms);
}

export const noFutureChangesLabel = "Brez večjih sprememb";

export const cookingOptions = [
  {
    value: "rarely" as const,
    label: "Občasno",
    description: "Kuhinja naj bo preprosta, pregledna in enostavna za vzdrževanje.",
  },
  {
    value: "weekly" as const,
    label: "Večkrat na teden",
    description:
      "Potrebujete dobro organizacijo, dovolj delovne površine in intuitiven potek dela.",
  },
  {
    value: "daily" as const,
    label: "Vsak dan",
    description: "Kuhinja mora delovati kot resno, a prijetno delovno okolje.",
  },
];

export const workFromHomeOptions = [
  { value: "never" as const, label: "Nikoli" },
  {
    value: "sometimes" as const,
    label: "Občasno",
    description: "Prostor mora biti hitro pripravljen in ga je mogoče po delu umakniti.",
  },
  {
    value: "frequently" as const,
    label: "Pogosto",
    description: "Potrebujete namensko delovno mesto, shranjevanje in urejeno napeljavo.",
  },
];

export const hostingOptions = [
  { value: "rarely" as const, label: "Redko" },
  { value: "occasionally" as const, label: "Občasno" },
  { value: "often" as const, label: "Pogosto" },
];

export const kitchenLayoutOptions: VisualOption<NonNullable<KitchenState["layout"]>>[] = [
  {
    value: "linear",
    title: "Ravna kuhinja",
    description: "Vse ob eni steni — pregleden in miren potek dela.",
    image: kitchenLayoutLinear,
  },
  {
    value: "l-shape",
    title: "Kuhinja v obliki L",
    description: "Dve povezani steni z več delovne površine.",
    image: kitchenLayoutL,
  },
  {
    value: "u-shape",
    title: "Kuhinja v obliki U",
    description: "Tri stene za največ shranjevanja in kratke poti.",
    image: kitchenLayoutU,
  },
  {
    value: "with-island",
    title: "Kuhinja z otokom",
    description: "Osrednji otok za kuhanje, druženje in dodatno površino.",
    image: kitchenLayoutIsland,
  },
];

export const kitchenFrontMaterialOptions: Array<{
  value: KitchenFrontMaterial;
  label: string;
  description: string;
}> = [
  {
    value: "decorative-board",
    label: "Iveral oziroma dekorativna plošča",
    description:
      "Trpežna, preprosta za vzdrževanje in cenovno uravnotežena rešitev z veliko izbiro dekorjev.",
  },
  {
    value: "lacquered-mdf-matt",
    label: "Lakiran MDF – mat",
    description:
      "Umirjena enobarvna površina, prijeten otip in možnost natančnega usklajevanja barve.",
  },
  {
    value: "lacquered-mdf-gloss",
    label: "Lakiran MDF – visoki sijaj",
    description: "Gladka odsevna površina za izrazitejši, bolj eleganten videz kuhinje.",
  },
  {
    value: "supermatt-antifingerprint",
    label: "Supermat površina – anti-fingerprint",
    description:
      "Zelo mat površina z manj vidnimi prstnimi odtisi, primerna za pogosto uporabljeno kuhinjo.",
  },
  {
    value: "wood-veneer",
    label: "Furnir oziroma naravni les",
    description:
      "Naravna struktura in topel videz; vsaka fronta ima nekoliko drugačen značaj lesa.",
  },
  {
    value: "recommend",
    label: "Ne vem – želim priporočilo",
    description:
      "Material bomo predlagali glede na vaš način uporabe, videz, vzdrževanje in raven investicije.",
  },
];

export const kitchenFrontMaterialLabels: Record<KitchenFrontMaterial, string> = Object.fromEntries(
  kitchenFrontMaterialOptions.map((option) => [option.value, option.label]),
) as Record<KitchenFrontMaterial, string>;

export const kitchenFrontPriorityOptions: KitchenFrontPriority[] = [
  "Enostavno čiščenje",
  "Čim manj prstnih odtisov",
  "Odpornost na vsakodnevno uporabo",
  "Naraven videz in otip",
  "Čim večja izbira barv",
  "Cenovno uravnotežena rešitev",
];

export const worktopOptions: VisualOption<NonNullable<KitchenState["worktop"]>>[] = [
  {
    value: "classic-laminate",
    title: "Klasični laminat",
    description: "Praktična in cenovno uravnotežena rešitev.",
    image: worktopLaminate,
  },
  {
    value: "premium-laminate",
    title: "Premium laminat ali kompakt",
    description: "Tanjši, sodobnejši videz in bolj izrazit občutek.",
    image: worktopPremiumLaminate,
  },
  {
    value: "quartz",
    title: "Quartz",
    description: "Trpežna mineralna površina z zelo čistim videzom.",
    image: worktopQuartz,
  },
  {
    value: "natural-stone",
    title: "Naravni kamen",
    description: "Unikatna površina z naravno strukturo.",
    image: worktopStone,
  },
];

export const wardrobeDoorOptions: VisualOption<NonNullable<WardrobeState["doorType"]>>[] = [
  {
    value: "hinged",
    title: "Krilna vrata",
    description: "Največja preglednost notranjosti in prilagodljivost razporeditve.",
    image: wardrobeHinged,
  },
  {
    value: "sliding",
    title: "Drsna vrata",
    description: "Primerna tam, kjer je pred omaro manj prostora.",
    image: wardrobeSliding,
  },
  {
    value: "open",
    title: "Odprta garderoba",
    description: "Brez vrat, z neposrednim dostopom.",
    image: wardrobeOpen,
  },
];

export const wardrobeStorageOptions = [
  "Srajce in krajša obešena oblačila",
  "Dolge obleke in plašči",
  "Zložena oblačila",
  "Čevlji",
  "Torbice in dodatki",
  "Kovčki",
  "Športna oprema",
  "Otroška oblačila",
  "Sezonske stvari",
];

export const wardrobeHangingLabels = [
  "Srajce in krajša obešena oblačila",
  "Dolge obleke in plašči",
];
export const wardrobeFoldedLabel = "Zložena oblačila";
export const wardrobeShoesLabel = "Čevlji";

export const yesNoOptions = [
  { value: "no", label: "Ne" },
  { value: "yes", label: "Da" },
];
