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
import investmentBespoke from "@/assets/investment-bespoke.jpg";
import type {
  InvestmentRange,
  KitchenState,
  VisualOption,
  WardrobeState,
} from "./homeDnaTypes";

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

export const investmentOptions: VisualOption<InvestmentRange>[] = [
  {
    value: "30-50",
    title: "30.000 – 50.000 €",
    description: "Osredotočen projekt z jasnimi prioritetami in premišljenimi materiali.",
    image: investmentEssential,
  },
  {
    value: "50-70",
    title: "50.000 – 70.000 €",
    description: "Več prostorov, usklajena zasnova in kakovostnejše površine.",
    image: investmentConsidered,
  },
  {
    value: "70-100",
    title: "70.000 – 100.000 €",
    description: "Celovita ureditev doma z izbranimi materiali in detajli po meri.",
    image: investmentSignature,
  },
  {
    value: "100-plus",
    title: "Nad 100.000 €",
    description: "Popolnoma avtorski projekt brez kompromisov pri materialih in izvedbi.",
    image: investmentBespoke,
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
    description: "Potrebujete dobro organizacijo, dovolj delovne površine in intuitiven potek dela.",
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
