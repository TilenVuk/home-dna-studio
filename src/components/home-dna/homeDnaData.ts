import heroInterior from "@/assets/hero-interior.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectCloset from "@/assets/project-closet.jpg";
import projectLiving from "@/assets/project-living.jpg";
import projectHall from "@/assets/project-hall.jpg";
import projectUtility from "@/assets/project-utility.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import type { DiscoveryScreen, RoomKey, RoomOption } from "./homeDnaTypes";

export const completeHomeKey: RoomKey = "complete-home";

export const individualRoomKeys: RoomKey[] = [
  "kitchen",
  "wardrobe",
  "living-room",
  "entry-hall",
  "utility-room",
  "bathroom",
  "home-office",
];

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
    key: "home-office",
    title: "Domača pisarna",
    description: "Delovno okolje, ki podpira osredotočenost in red.",
    image: projectOffice,
  },
];

export const screenProgress: Record<DiscoveryScreen, number> = {
  welcome: 0,
  rooms: 10,
  placeholder: 16,
};

export const welcomeCopy = {
  eyebrow: "Home DNA™",
  headline: "Vsak izjemen dom se začne z razumevanjem ljudi, ki bodo v njem živeli.",
  body: "V nekaj minutah bomo spoznali vaš dom, življenjski slog in želje. Na koncu boste prejeli osebni Home DNA™ Report in okvirno oceno tipične investicije.",
  benefits: [
    "Prilagojena analiza vašega doma",
    "Osebne oblikovalske in funkcionalne prioritete",
    "Okvirna ocena tipične investicije",
  ],
  time: "Približno 3–10 minut, odvisno od obsega projekta.",
  cta: "Začni Home DNA™ Discovery",
};
