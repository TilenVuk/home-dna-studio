import { buildDiscoveryFlow } from "./discoveryFlow";
import type { HomeDnaState } from "./homeDnaTypes";
import type { ScreenDef } from "./screenDef";
import type { Locale } from "@/lib/i18n";

type ScreenCopy = {
  eyebrow?: string;
  headline?: string;
  support?: string;
  body?: string;
  cta?: string;
};

type CopyMap = Record<string, ScreenCopy>;

const hr: CopyMap = {
  "project-stage": {
    headline: "U kojoj je fazi vaš projekt?",
    support:
      "Kontekst projekta pomaže nam pripremiti preporuke primjerene vašem prostoru i vremenskom okviru.",
  },
  "property-type": { headline: "Kakav dom opremate?" },
  "household-size": {
    headline: "Koliko će ljudi koristiti ovaj dom?",
    support:
      "U sljedećem koraku pitamo koliko je među njima djece; djeca su već uključena u ukupan broj.",
  },
  children: { headline: "Hoće li u domu živjeti djeca?" },
  "children-count": {
    headline: "Koliko će djece živjeti u domu?",
    support: "Broj djece već je uključen u ukupan broj osoba.",
  },
  pets: {
    headline: "Žive li s vama kućni ljubimci?",
    support: "Utječu na izbor materijala, održavanje i organizaciju odabranih prostora.",
  },
  "home-size": {
    headline: "Kolika je površina vašeg doma?",
    support: "Dovoljna je približna kvadratura. Preciznost nije potrebna.",
  },
  atmosphere: {
    headline: "Kako želite da se odabrani prostori osjećaju?",
    support: "Odaberite najviše tri dojma koji trebaju voditi oblikovanje.",
  },
  "colour-direction": { headline: "Koji vam je smjer boja najbliži?" },
  lifestyle: {
    headline: "Što vam je najvažnije u odabranim prostorima?",
    support: "Odaberite najviše tri prioriteta koji trebaju najviše utjecati na projekt.",
  },
  "cooking-frequency": {
    headline: "Koliko često kuhate kod kuće?",
    support: "Učestalost kuhanja utječe na tijek rada, količinu spremanja i izbor površina.",
  },
  "hosting-frequency": {
    headline: "Koliko često primate obitelj ili prijatelje?",
    support: "To utječe na broj sjedećih mjesta, radne površine i povezivanje prostora.",
  },
  "work-from-home-frequency": {
    headline: "Koliko često radite od kuće?",
    support: "Pitanje prikazujemo samo kada odabrani prostor može uključivati radno mjesto.",
  },
  hobbies: {
    headline: "Koje hobije ili opremu trebaju podržati odabrani prostori?",
    support: "Odaberite samo ono što utječe na spremanje ili korištenje prostora.",
  },
  challenges: {
    headline: "Što vas trenutačno najviše ometa u tim prostorima?",
    support: "Prikazujemo samo probleme povezane s odabranim prostorima. Odaberite najviše tri.",
  },
  "challenges-other": {
    headline: "Što biste još željeli poboljšati?",
    support: "Napomena nije obavezna, ali nam pomaže bolje razumjeti prostor.",
  },
  "future-needs": {
    headline: "Kako se odabrani prostori trebaju prilagođavati budućnosti?",
    support: "Prikazujemo samo promjene koje mogu utjecati na odabrani opseg projekta.",
  },
  investment: {
    headline: "Koja razina izvedbe najbolje odgovara vašem projektu?",
    support:
      "Ovaj odabir pomaže nam pripremiti okvirnu procjenu investicije i preporučiti odgovarajuće materijale. Konačne materijale definiramo zajedno tijekom planiranja.",
  },

  "kitchen-intro": {
    eyebrow: "Kuhinja",
    headline: "Kuhinja treba slijediti način na koji kuhate i živite.",
    body: "Trebamo samo približan raspored, duljine i nekoliko ključnih odluka.",
    cta: "Počnimo s kuhinjom",
  },
  "kitchen-layout": { headline: "Koji je raspored najsličniji vašem prostoru?" },
  "kitchen-wall-a": {
    headline: "Koliko je dug glavni kuhinjski zid?",
    support: "Dovoljna je približna mjera.",
  },
  "kitchen-wall-b": {
    headline: "Koliko je dug drugi kuhinjski zid?",
    support: "Dovoljna je približna mjera.",
  },
  "kitchen-wall-c": {
    headline: "Koliko je dug treći kuhinjski zid?",
    support: "Dovoljna je približna mjera.",
  },
  "kitchen-island-length": {
    headline: "Koliki otok zamišljate?",
    support: "Najprije nas zanima duljina otoka.",
  },
  "kitchen-island-width": {
    headline: "Koliko širok treba biti otok?",
    support: "Širina utječe na udobnost rada i kretanje oko otoka.",
  },
  "kitchen-island-seats": {
    headline: "Koliko sjedećih mjesta želite uz otok?",
    support: "Broj mjesta utječe na duljinu, prepust radne ploče i prolaze oko otoka.",
  },
  "kitchen-appliances": {
    headline: "Koje uređaje kuhinja treba uključiti?",
    support: "Odaberite sve uređaje koji utječu na raspored elemenata i priključaka.",
  },
  "kitchen-front-material": {
    headline: "Kakve fronte želite?",
    support:
      "Odaberite najbližu opciju. Ako još niste odlučili, preporučit ćemo materijal prema uporabi i željenom izgledu.",
  },
  "kitchen-front-priorities": {
    headline: "Što vam je najvažnije kod kuhinjskih fronti?",
    support: "Odaberite najviše dvije osobine koje trebaju imati prednost u preporuci.",
  },
  "kitchen-worktop": { headline: "Koja radna ploča najbolje odgovara vašoj viziji?" },
  "kitchen-pantry": { headline: "Želite li namjensko rješenje za smočnicu?" },
  "kitchen-features": {
    headline: "Koje dodatke želite u kuhinji?",
    support: "Odaberite sve željene dodatke ili opciju bez dodataka.",
  },

  "wardrobe-intro": {
    eyebrow: "Garderoba",
    headline: "Najprije moramo razumjeti što će ormar stvarno spremati.",
    body: "Unutarnji raspored treba se prilagoditi vašoj odjeći, obući i svakodnevnim navikama.",
    cta: "Planirajmo unutrašnjost",
  },
  "wardrobe-users": {
    headline: "Koliko će osoba koristiti ovu garderobu?",
    support: "Podatak pomaže pravilno podijeliti unutrašnjost i definirati odvojene zone.",
  },
  "wardrobe-storage-types": {
    headline: "Što će ormar uglavnom spremati?",
    support: "Odaberite najviše četiri kategorije.",
  },
  "wardrobe-hanging": { headline: "Koliki dio ormara treba biti namijenjen vješanju?" },
  "wardrobe-folded": { headline: "Koliko prostora trebate za složenu odjeću?" },
  "wardrobe-shoes": { headline: "Otprilike koliko pari cipela želite spremiti?" },
  "wardrobe-width": {
    headline: "Koliko će ormar biti širok?",
    support: "Dovoljna je približna mjera raspoloživog zida.",
  },
  "wardrobe-height": {
    headline: "Koliko će ormar biti visok?",
    support: "Obično do stropa ili malo niže.",
  },
  "wardrobe-depth": { headline: "Koja će biti približna dubina?" },
  "wardrobe-doors": { headline: "Koji vam način otvaranja najviše odgovara?" },
  "wardrobe-features": {
    headline: "Koje dodatke želite u garderobi?",
    support: "Odaberite sve željene dodatke ili opciju bez dodataka.",
  },

  "living-intro": {
    eyebrow: "Dnevni boravak",
    headline: "Dnevni prostor treba povezati opuštanje, druženje i spremanje.",
    body: "Zanima nas raspoloživi zid i način na koji prostor stvarno koristite.",
    cta: "Nastavimo",
  },
  "living-wall-width": {
    headline: "Koliko je širok zid namijenjen namještaju?",
    support: "Dovoljna je približna mjera.",
  },
  "living-tv": { headline: "Koliki televizor planirate?" },
  "living-storage": { headline: "Koliko skrivenog spremanja trebate?" },
  "living-display": { headline: "Koliko otvorenih izložbenih površina želite?" },
  "living-books": { headline: "Koliko knjiga prostor treba primiti?" },
  "living-features": {
    headline: "Koje dodatke želite u dnevnom boravku?",
    support: "Odaberite sve željene dodatke ili opciju bez dodataka.",
  },

  "entry-intro": {
    eyebrow: "Predsoblje",
    headline: "Organiziran dolazak kući počinje jasnim mjestom za svakodnevne stvari.",
    body: "Zanima nas raspoloživa širina i koliko stvari predsoblje svakodnevno mora primiti.",
    cta: "Nastavimo",
  },
  "entry-width": {
    headline: "Koliko je širok raspoloživi zid u predsoblju?",
    support: "Dovoljna je približna mjera.",
  },
  "entry-shoes": { headline: "Otprilike koliko pari cipela predsoblje treba primiti?" },
  "entry-jackets": { headline: "Koliko je jakni obično u svakodnevnoj uporabi?" },
  "entry-bags": { headline: "Koliko je torbi i ruksaka svakodnevno u opticaju?" },
  "entry-features": {
    headline: "Što još treba vaše predsoblje?",
    support: "Odaberite sva željena rješenja ili opciju bez dodataka.",
  },

  "utility-intro": {
    eyebrow: "Utility",
    headline: "Gospodarski prostor treba sakriti obaveze i pojednostaviti svakodnevicu.",
    body: "Zanima nas raspoloživi zid i oprema koju prostor mora primiti.",
    cta: "Nastavimo",
  },
  "utility-width": {
    headline: "Koliko je širok raspoloživi zid?",
    support: "Dovoljna je približna mjera.",
  },
  "utility-appliances": {
    headline: "Koji će uređaji biti u prostoru?",
    support: "Odaberite sve uređaje ili opciju bez perilice i sušilice.",
  },
  "utility-stacked": {
    headline: "Trebaju li perilica i sušilica biti postavljene jedna na drugu?",
  },
  "utility-storage": {
    headline: "Što prostor još treba spremati?",
    support: "Odaberite sve željene kategorije ili opciju bez dodatnog spremanja.",
  },

  "bathroom-intro": {
    eyebrow: "Kupaonica",
    headline: "Miran prostor treba jasnu organizaciju svakodnevnih predmeta.",
    body: "Zanima nas zid namijenjen namještaju i način svakodnevne uporabe.",
    cta: "Nastavimo",
  },
  "bathroom-users": {
    headline: "Koliko osoba redovito koristi ovu kupaonicu?",
    support: "To utječe na količinu spremanja, širinu umivaoničkog elementa i organizaciju ladica.",
  },
  "bathroom-width": {
    headline: "Koliko je širok zid namijenjen kupaonskom namještaju?",
    support: "Dovoljna je približna mjera.",
  },
  "bathroom-sink": { headline: "Jedan ili dva umivaonika?" },
  "bathroom-features": {
    headline: "Koja rješenja trebate u kupaonici?",
    support: "Odaberite sva željena rješenja ili opciju bez dodataka.",
  },

  "bedroom-intro": {
    eyebrow: "Spavaća soba",
    headline: "Spavaća soba treba povezati mir, spremanje i udobnost bez vizualnog nereda.",
    body: "Zanima nas koje elemente želite izraditi po mjeri i koliko im prostora možete namijeniti.",
    cta: "Planirajmo spavaću sobu",
  },
  "bedroom-furniture": {
    headline: "Koje elemente želite uključiti u spavaću sobu?",
    support: "Odaberite sve elemente koji trebaju biti dio cjelovitog rješenja po mjeri.",
  },
  "bedroom-furniture-width": {
    headline: "Kolika je ukupna duljina namještaja po mjeri?",
    support: "Zbrojite približnu duljinu ormara, kreveta i drugih odabranih elemenata.",
  },
  "bedroom-bed-width": { headline: "Koju širinu kreveta planirate?" },
  "bedroom-features": {
    headline: "Koje dodatke želite u spavaćoj sobi?",
    support: "Odaberite sve željene dodatke ili opciju bez dodataka.",
  },

  "children-room-ages": {
    headline: "Kojim su dobnim skupinama sobe namijenjene?",
    support:
      "Odaberite sve odgovarajuće skupine kako bismo mogli predvidjeti sigurnost, visine i kasnije prilagodbe.",
  },
  "children-room-furniture": {
    headline: "Što treba uključivati svaka dječja soba?",
    support: "Odaberite sve elemente koji trebaju biti dio rješenja po mjeri.",
  },
  "children-room-furniture-width": {
    headline: "Kolika je ukupna duljina namještaja po mjeri u jednoj sobi?",
    support:
      "Unesite približnu ukupnu duljinu ormara, kreveta, stola i elemenata za spremanje u jednoj sobi.",
  },
  "children-room-features": {
    headline: "Koje dodatke želite u dječjim sobama?",
    support: "Odabir vrijedi za svaku dječju sobu.",
  },
};

const en: CopyMap = {
  "project-stage": {
    headline: "What stage is your project in?",
    support: "Project context helps us tailor recommendations to your space and timeline.",
  },
  "property-type": { headline: "What type of home are you furnishing?" },
  "household-size": {
    headline: "How many people will use this home?",
    support:
      "In the next step we ask how many of them are children; children are already included in the total.",
  },
  children: { headline: "Will children live in the home?" },
  "children-count": {
    headline: "How many children will live in the home?",
    support: "The number of children is already included in the total household size.",
  },
  pets: {
    headline: "Do you live with pets?",
    support: "Pets affect material choices, maintenance and the organisation of selected spaces.",
  },
  "home-size": {
    headline: "How large is your home?",
    support: "An approximate floor area is enough. It does not need to be exact.",
  },
  atmosphere: {
    headline: "How would you like the selected spaces to feel?",
    support: "Choose up to three qualities that should guide the design.",
  },
  "colour-direction": { headline: "Which colour direction feels closest to you?" },
  lifestyle: {
    headline: "What matters most to you in the selected spaces?",
    support: "Choose up to three priorities that should influence the design most.",
  },
  "cooking-frequency": {
    headline: "How often do you cook at home?",
    support: "Cooking frequency affects workflow, storage needs and surface choices.",
  },
  "hosting-frequency": {
    headline: "How often do you host family or friends?",
    support: "This affects seating, work surfaces and how spaces connect.",
  },
  "work-from-home-frequency": {
    headline: "How often do you work from home?",
    support: "We only ask this where the selected space can reasonably include a workstation.",
  },
  hobbies: {
    headline: "Which hobbies or equipment should the selected spaces accommodate?",
    support: "Choose only items that affect storage or how the space is used.",
  },
  challenges: {
    headline: "What currently gets in the way most in these spaces?",
    support: "Only challenges relevant to the selected spaces are shown. Choose up to three.",
  },
  "challenges-other": {
    headline: "What else would you like to improve?",
    support: "This note is optional, but it helps us understand your space better.",
  },
  "future-needs": {
    headline: "How should the selected spaces adapt to the future?",
    support: "Only changes that can affect the selected project scope are shown.",
  },
  investment: {
    headline: "Which level of execution best fits your project?",
    support:
      "This choice helps us prepare an indicative investment estimate and recommend suitable materials. Final materials are defined together during planning.",
  },

  "kitchen-intro": {
    eyebrow: "Kitchen",
    headline: "Your kitchen should follow the way you cook and live.",
    body: "We only need an approximate layout, wall lengths and a few key decisions.",
    cta: "Start with the kitchen",
  },
  "kitchen-layout": { headline: "Which layout is closest to your space?" },
  "kitchen-wall-a": {
    headline: "How long is the main kitchen wall?",
    support: "An approximate measurement is enough.",
  },
  "kitchen-wall-b": {
    headline: "How long is the second kitchen wall?",
    support: "An approximate measurement is enough.",
  },
  "kitchen-wall-c": {
    headline: "How long is the third kitchen wall?",
    support: "An approximate measurement is enough.",
  },
  "kitchen-island-length": {
    headline: "How large an island do you have in mind?",
    support: "First, we need the approximate island length.",
  },
  "kitchen-island-width": {
    headline: "How wide should the island be?",
    support: "Width affects working comfort and circulation around the island.",
  },
  "kitchen-island-seats": {
    headline: "How many seats would you like at the island?",
    support: "The number of seats affects island length, worktop overhang and circulation.",
  },
  "kitchen-appliances": {
    headline: "Which appliances should the kitchen include?",
    support: "Select all appliances that affect cabinetry layout and connections.",
  },
  "kitchen-front-material": {
    headline: "Which cabinet fronts would you prefer?",
    support:
      "Choose the closest option. If you are unsure, we will recommend a material based on use and the desired appearance.",
  },
  "kitchen-front-priorities": {
    headline: "What matters most to you about kitchen fronts?",
    support: "Choose up to two qualities that should take priority in our recommendation.",
  },
  "kitchen-worktop": { headline: "Which worktop best fits your vision?" },
  "kitchen-pantry": { headline: "Would you like a dedicated pantry solution?" },
  "kitchen-features": {
    headline: "Which extras would you like in the kitchen?",
    support: "Select all desired extras or choose no extras.",
  },

  "wardrobe-intro": {
    eyebrow: "Wardrobe",
    headline: "First we need to understand what the wardrobe will actually store.",
    body: "The internal layout should adapt to your clothes, shoes and everyday habits.",
    cta: "Plan the interior",
  },
  "wardrobe-users": {
    headline: "How many people will use this wardrobe?",
    support: "This helps divide the interior correctly and define separate zones.",
  },
  "wardrobe-storage-types": {
    headline: "What will the wardrobe mainly store?",
    support: "Choose up to four categories.",
  },
  "wardrobe-hanging": { headline: "How much of the wardrobe should be dedicated to hanging?" },
  "wardrobe-folded": { headline: "How much space do you need for folded clothes?" },
  "wardrobe-shoes": { headline: "Approximately how many pairs of shoes would you like to store?" },
  "wardrobe-width": {
    headline: "How wide will the wardrobe be?",
    support: "An approximate available wall width is enough.",
  },
  "wardrobe-height": {
    headline: "How tall will the wardrobe be?",
    support: "Usually up to the ceiling or slightly lower.",
  },
  "wardrobe-depth": { headline: "What will the approximate depth be?" },
  "wardrobe-doors": { headline: "Which opening style suits you best?" },
  "wardrobe-features": {
    headline: "Which extras would you like in the wardrobe?",
    support: "Select all desired extras or choose no extras.",
  },

  "living-intro": {
    eyebrow: "Living room",
    headline: "The living space should connect relaxation, socialising and storage.",
    body: "We need the available wall width and how you actually use the room.",
    cta: "Continue",
  },
  "living-wall-width": {
    headline: "How wide is the wall intended for furniture?",
    support: "An approximate measurement is enough.",
  },
  "living-tv": { headline: "What size television are you planning?" },
  "living-storage": { headline: "How much concealed storage do you need?" },
  "living-display": { headline: "How much open display space would you like?" },
  "living-books": { headline: "How many books should the space accommodate?" },
  "living-features": {
    headline: "Which extras would you like in the living room?",
    support: "Select all desired extras or choose no extras.",
  },

  "entry-intro": {
    eyebrow: "Entry hall",
    headline: "An organised arrival home starts with a clear place for everyday items.",
    body: "We need the available width and how much the entry hall needs to hold each day.",
    cta: "Continue",
  },
  "entry-width": {
    headline: "How wide is the available wall in the entry hall?",
    support: "An approximate measurement is enough.",
  },
  "entry-shoes": { headline: "Approximately how many pairs of shoes should the entry hall hold?" },
  "entry-jackets": { headline: "How many jackets are usually in daily use?" },
  "entry-bags": { headline: "How many bags and backpacks are in daily rotation?" },
  "entry-features": {
    headline: "What else does your entry hall need?",
    support: "Select all desired solutions or choose no extras.",
  },

  "utility-intro": {
    eyebrow: "Utility room",
    headline: "A utility room should hide chores and simplify everyday life.",
    body: "We need the available wall width and the equipment the room must accommodate.",
    cta: "Continue",
  },
  "utility-width": {
    headline: "How wide is the available wall?",
    support: "An approximate measurement is enough.",
  },
  "utility-appliances": {
    headline: "Which appliances will be in the room?",
    support: "Select all appliances or choose no washer or dryer.",
  },
  "utility-stacked": { headline: "Should the washer and dryer be stacked?" },
  "utility-storage": {
    headline: "What else should the room store?",
    support: "Select all relevant categories or choose no additional storage.",
  },

  "bathroom-intro": {
    eyebrow: "Bathroom",
    headline: "A calm space needs clear organisation for everyday items.",
    body: "We need the wall intended for furniture and how the bathroom is used each day.",
    cta: "Continue",
  },
  "bathroom-users": {
    headline: "How many people regularly use this bathroom?",
    support: "This affects storage volume, vanity width and drawer organisation.",
  },
  "bathroom-width": {
    headline: "How wide is the wall intended for bathroom furniture?",
    support: "An approximate measurement is enough.",
  },
  "bathroom-sink": { headline: "Single or double basin?" },
  "bathroom-features": {
    headline: "Which solutions do you need in the bathroom?",
    support: "Select all desired solutions or choose no extras.",
  },

  "bedroom-intro": {
    eyebrow: "Bedroom",
    headline: "The bedroom should combine calm, storage and comfort without visual clutter.",
    body: "We need to know which elements you want made to measure and how much space they can use.",
    cta: "Plan the bedroom",
  },
  "bedroom-furniture": {
    headline: "Which elements would you like to include in the bedroom?",
    support: "Select all elements that should form part of the complete made-to-measure solution.",
  },
  "bedroom-furniture-width": {
    headline: "What is the total length of the made-to-measure furniture?",
    support:
      "Add the approximate lengths of the wardrobe, bed composition and other selected elements.",
  },
  "bedroom-bed-width": { headline: "What bed width are you planning?" },
  "bedroom-features": {
    headline: "Which extras would you like in the bedroom?",
    support: "Select all desired extras or choose no extras.",
  },

  "children-room-ages": {
    headline: "Which age groups are the rooms intended for?",
    support:
      "Select all relevant groups so we can account for safety, heights and future adaptations.",
  },
  "children-room-furniture": {
    headline: "What should each children's room include?",
    support: "Select all elements that should be part of the made-to-measure solution.",
  },
  "children-room-furniture-width": {
    headline: "What is the total length of made-to-measure furniture in one room?",
    support:
      "Enter the approximate combined length of wardrobe, bed, desk and storage elements in one room.",
  },
  "children-room-features": {
    headline: "Which extras would you like in the children's rooms?",
    support: "The selection applies to every children's room.",
  },
};

const dictionaries: Record<Exclude<Locale, "sl">, CopyMap> = { hr, en };

export function buildLocalizedDiscoveryFlow(state: HomeDnaState, locale: Locale): ScreenDef[] {
  return buildDiscoveryFlow(state).map((screen) => {
    if (screen.key === "children-room-intro" && screen.kind === "editorial" && locale !== "sl") {
      const quantity = state.home.childrenCount ?? 1;
      const quantityLabel = `${quantity}${state.home.childrenCountPlus ? "+" : ""}`;
      if (locale === "hr") {
        return {
          ...screen,
          eyebrow: `Dječje sobe · ${quantityLabel}`,
          headline: `Jedan zajednički koncept prilagodit ćemo za ${quantityLabel} ${quantity === 1 ? "dječju sobu" : "dječje sobe"}.`,
          body: "Odgovori vrijede za pojedinačnu sobu, a okvirna investicija automatski se množi brojem djece.",
          cta: "Planirajmo dječje sobe",
        };
      }
      return {
        ...screen,
        eyebrow: `Children's rooms · ${quantityLabel}`,
        headline: `We will adapt one shared concept for ${quantityLabel} ${quantity === 1 ? "children's room" : "children's rooms"}.`,
        body: "Answers apply to one room; the indicative investment estimate is automatically multiplied by the number of children.",
        cta: "Plan the children's rooms",
      };
    }

    if (locale === "sl") return screen;
    const localized = dictionaries[locale][screen.key];
    if (!localized) return screen;

    return {
      ...screen,
      ...(localized.eyebrow ? { eyebrow: localized.eyebrow } : {}),
      ...(localized.headline ? { headline: localized.headline } : {}),
      ...(localized.support ? { support: localized.support } : {}),
      ...(localized.body ? { body: localized.body } : {}),
      ...(localized.cta ? { cta: localized.cta } : {}),
    } as ScreenDef;
  });
}
