import { buildDiscoveryFlow } from "./discoveryFlow";
import type { HomeDnaState } from "./homeDnaTypes";
import type { ScreenDef } from "./screenDef";
import type { Locale } from "@/lib/i18n";

const copy: Record<Exclude<Locale, "sl">, Record<string, { headline?: string; support?: string }>> = {
  hr: {
    "project-stage": {
      headline: "U kojoj je fazi vaš projekt?",
      support: "Kontekst projekta pomaže nam pripremiti preporuke primjerene vašem prostoru i vremenskom okviru.",
    },
    "property-type": { headline: "Kakav dom opremate?" },
    "household-size": {
      headline: "Koliko će odraslih živjeti u domu?",
      support: "Broj djece pitamo odvojeno kako bi struktura kućanstva bila potpuno jasna.",
    },
    children: { headline: "Hoće li u domu živjeti djeca?" },
    "children-count": { headline: "Koliko će djece živjeti u domu?" },
    pets: {
      headline: "Žive li s vama kućni ljubimci?",
      support: "Utječu na izbor materijala, održavanje i organizaciju odabranih prostora.",
    },
    "home-size": {
      headline: "Kolika je površina vašeg doma?",
      support: "Dovoljna je približna kvadratura. Preciznost nije potrebna.",
    },
    investment: {
      headline: "Koja razina izvedbe najbolje odgovara vašem projektu?",
      support: "Ovaj odabir pomaže nam pripremiti okvirnu procjenu investicije i preporučiti odgovarajuće materijale.",
    },
  },
  en: {
    "project-stage": {
      headline: "What stage is your project in?",
      support: "Project context helps us tailor recommendations to your space and timeline.",
    },
    "property-type": { headline: "What type of home are you furnishing?" },
    "household-size": {
      headline: "How many adults will live in the home?",
      support: "We ask about children separately so the household structure is completely clear.",
    },
    children: { headline: "Will children live in the home?" },
    "children-count": { headline: "How many children will live in the home?" },
    pets: {
      headline: "Do you live with pets?",
      support: "Pets affect material choices, maintenance and the organisation of selected spaces.",
    },
    "home-size": {
      headline: "How large is your home?",
      support: "An approximate floor area is enough. It does not need to be exact.",
    },
    investment: {
      headline: "Which level of execution best fits your project?",
      support: "This choice helps us prepare an indicative investment estimate and recommend suitable materials.",
    },
  },
};

export function buildLocalizedDiscoveryFlow(state: HomeDnaState, locale: Locale): ScreenDef[] {
  return buildDiscoveryFlow(state).map((screen) => {
    if (screen.key === "household-size") {
      const localized = locale === "sl" ? undefined : copy[locale][screen.key];
      return {
        ...screen,
        headline: localized?.headline ?? "Koliko odraslih bo živelo v domu?",
        support:
          localized?.support ??
          "Število otrok vprašamo ločeno, da je sestava gospodinjstva popolnoma jasna.",
      } as ScreenDef;
    }

    if (locale === "sl") return screen;
    const localized = copy[locale][screen.key];
    if (!localized) return screen;

    return {
      ...screen,
      ...(localized.headline ? { headline: localized.headline } : {}),
      ...(localized.support ? { support: localized.support } : {}),
    } as ScreenDef;
  });
}
