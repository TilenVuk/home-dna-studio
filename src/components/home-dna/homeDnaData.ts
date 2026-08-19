import heroInterior from "@/assets/hero-interior.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectChildRoom from "@/assets/project-child-room.jpg";
import stageNewBuild from "@/assets/stage-new-build.jpg";
import stageFullRenovation from "@/assets/stage-full-renovation.jpg";
import stagePartialRenovation from "@/assets/stage-partial-renovation.jpg";
import propertyHouse from "@/assets/property-house.jpg";
import propertyApartment from "@/assets/property-apartment.jpg";
import propertyHoliday from "@/assets/property-holiday.jpg";
import styleMinimal from "@/assets/style-minimal.jpg";
import styleScandinavian from "@/assets/style-scandinavian.jpg";
import styleJapandi from "@/assets/style-japandi.jpg";
import styleNatural from "@/assets/style-natural.jpg";
import styleClassic from "@/assets/style-classic.jpg";
import styleDark from "@/assets/style-dark.jpg";
import colourLight from "@/assets/colour-light.jpg";
import colourEarthy from "@/assets/colour-earthy.jpg";
import colourNeutral from "@/assets/colour-neutral.jpg";
import colourDark from "@/assets/colour-dark.jpg";
import type {
  PetKey,
  ProjectStage,
  PropertyType,
  RoomKey,
  RoomOption,
  VisualOption,
} from "./homeDnaTypes";

export const completeHomeKey: RoomKey = "complete-home";
export const childrenRoomKey: RoomKey = "children-room";

export const individualRoomKeys: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "bedroom",
  "children-room",
];

export function availableIndividualRoomKeys(_childrenCount?: number): RoomKey[] {
  return individualRoomKeys;
}

export const roomOptions: RoomOption[] = [
  {
    key: "complete-home",
    title: "Celoten dom",
    description: "Enotna vizija od praznega prostora do popolnoma opremljenega doma.",
    image: heroInterior,
  },
  {
    key: "kitchen",
    title: "Kuhinja",
    description: "Prostor, oblikovan okoli načina, kako kuhate in živite.",
    image: projectKitchen,
  },
  {
    key: "wardrobe",
    title: "Garderoba",
    description: "Shranjevanje, prilagojeno temu, kar dejansko imate.",
    image: projectCloset,
  },
  {
    key: "living-room",
    title: "Dnevna soba",
    description: "Prostor za sprostitev, druženje in vsakodnevno življenje.",
    image: projectLiving,
  },
  {
    key: "entry-hall",
    title: "Predsoba",
    description: "Organiziran prihod domov za vso družino.",
    image: projectHall,
  },
  {
    key: "utility-room",
    title: "Utility",
    description: "Premišljena rešitev za perilo, čiščenje in gospodinjske potrebščine.",
    image: projectUtility,
  },
  {
    key: "bathroom",
    title: "Kopalnica",
    description: "Umirjen in funkcionalen prostor z inteligentnim shranjevanjem.",
    image: projectBathroom,
  },
  {
    key: "bedroom",
    title: "Spalnica",
    description: "Umirjena spalnica s pohištvom, prilagojenim vašim navadam in prostoru.",
    image: projectBedroom,
  },
  {
    key: "children-room",
    title: "Otroške sobe",
    description: "Prilagodljive sobe, ki rastejo skupaj z otroki.",
    image: projectChildRoom,
  },
];

export function availableRoomOptions(_childrenCount?: number): RoomOption[] {
  return roomOptions;
}

export const welcomeCopy = {
  eyebrow: "Home DNA™",
  headline: "Vsak izjemen dom se začne z razumevanjem ljudi, ki bodo v njem živeli.",
  body: "V nekaj minutah bomo spoznali vaš dom, življenjski slog in želje. Na koncu boste prejeli osebni Home DNA™ Report in okvirno oceno tipične investicije.",
  benefits: [
    "Prilagojena analiza vašega doma",
    "Osebne oblikovalske in funkcionalne prioritete",
    "Okvirna ocena tipične investicije",
  ],
  time: "Približno 5–15 minut, odvisno od obsega projekta.",
  cta: "Začni Home DNA™ Discovery",
};

export const projectStageOptions: VisualOption<ProjectStage>[] = [
  {
    value: "new-build",
    title: "Novogradnja",
    description: "Dom oblikujemo celostno, še preden se začne vsakdanje življenje.",
    image: stageNewBuild,
  },
  {
    value: "complete-renovation",
    title: "Celovita prenova",
    description: "Obstoječi prostor na novo prilagodimo vašim potrebam.",
    image: stageFullRenovation,
  },
  {
    value: "partial-renovation",
    title: "Delna prenova",
    description: "Osredotočimo se na izbrane prostore in izboljšave.",
    image: stagePartialRenovation,
  },
];

export const propertyTypeOptions: VisualOption<PropertyType>[] = [
  {
    value: "house",
    title: "Hiša",
    description: "Več prostora, več povezav med prostori in ena skupna vizija.",
    image: propertyHouse,
  },
  {
    value: "apartment",
    title: "Stanovanje",
    description: "Premišljena izraba prostora brez kompromisov pri udobju.",
    image: propertyApartment,
  },
  {
    value: "holiday-home",
    title: "Počitniški dom",
    description: "Funkcionalen in umirjen prostor za oddih.",
    image: propertyHoliday,
  },
];

export const floorAreaPresets = [60, 90, 120, 160, 200, 250];

export const householdSizeOptions = ["1", "2", "3", "4", "5+"];

export const childrenOptions = [
  { value: "none", label: "Ne" },
  { value: "planning", label: "V prihodnosti" },
  { value: "yes", label: "Da" },
] as const;

export const childrenCountOptions = ["1", "2", "3", "4+"];

export const petOptions: { value: PetKey; label: string }[] = [
  { value: "dog", label: "Pes" },
  { value: "cat", label: "Mačka" },
  { value: "other", label: "Drugo" },
  { value: "none", label: "Brez hišnih ljubljenčkov" },
];

export const styleOptions: VisualOption[] = [
  {
    value: "contemporary-minimal",
    title: "Sodobno minimalistično",
    description: "Mirne površine, skrito shranjevanje in minimalen vizualni šum.",
    image: styleMinimal,
  },
  {
    value: "scandinavian",
    title: "Skandinavsko",
    description: "Svetloba, funkcionalnost in preprosta domačnost.",
    image: styleScandinavian,
  },
  {
    value: "japandi",
    title: "Japandi",
    description: "Umirjena kombinacija nordijske funkcionalnosti in japonske preprostosti.",
    image: styleJapandi,
  },
  {
    value: "natural-contemporary",
    title: "Naravno sodobno",
    description: "Topel lesni videz, zemeljski odtenki in mehkejše oblike.",
    image: styleNatural,
  },
  {
    value: "timeless-classic",
    title: "Brezčasno klasično",
    description: "Elegantni detajli in videz, ki ni odvisen od kratkotrajnih trendov.",
    image: styleClassic,
  },
  {
    value: "dark-elegant",
    title: "Temno elegantno",
    description: "Globoki kontrasti, steklo in diskretna osvetlitev.",
    image: styleDark,
  },
];

export const atmosphereOptions = [
  "Topel",
  "Miren",
  "Svetel",
  "Eleganten",
  "Naraven",
  "Minimalističen",
  "Prijeten",
  "Funkcionalen",
];

export const colourDirectionOptions: VisualOption[] = [
  {
    value: "light-airy",
    title: "Svetla in zračna",
    description: "Svetli nevtralni toni in mehki lesni dekorji.",
    image: colourLight,
  },
  {
    value: "warm-earthy",
    title: "Topla in zemeljska",
    description: "Bež, peščeni, glineni in naravni odtenki.",
    image: colourEarthy,
  },
  {
    value: "neutral-timeless",
    title: "Nevtralna in brezčasna",
    description: "Umirjena siva, bež in uravnoteženi kontrasti.",
    image: colourNeutral,
  },
  {
    value: "dark-expressive",
    title: "Temna in izrazita",
    description: "Temnejše površine, globoki toni in močni kontrasti.",
    image: colourDark,
  },
];
