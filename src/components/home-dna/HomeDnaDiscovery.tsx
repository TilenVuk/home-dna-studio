import { useCallback, useMemo, useState } from "react";
import styleIntroImage from "@/assets/style-intro.jpg";
import lifestyleIntroImage from "@/assets/lifestyle-intro.jpg";
import { AtmosphereSelection } from "./AtmosphereSelection";
import { EditorialScreen } from "./EditorialScreen";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { HomeDnaWelcome } from "./HomeDnaWelcome";
import { HomeSizeScreen } from "./HomeSizeScreen";
import { InspirationLink } from "./InspirationLink";
import { OptionListScreen } from "./OptionListScreen";
import { PetsSelection } from "./PetsSelection";
import { RoomSelection } from "./RoomSelection";
import { SingleVisualChoiceScreen } from "./SingleVisualChoiceScreen";
import { StyleSelection } from "./StyleSelection";
import {
  childrenCountOptions,
  childrenOptions,
  colourDirectionOptions,
  completeHomeKey,
  householdSizeOptions,
  projectStageOptions,
  propertyTypeOptions,
} from "./homeDnaData";
import {
  initialHomeDnaState,
  type ChildrenAnswer,
  type DiscoveryScreen,
  type HomeDnaState,
  type PetKey,
  type ProjectStage,
  type PropertyType,
  type RoomKey,
} from "./homeDnaTypes";

const SPRINT_2_PROGRESS_CEILING = 45;

function visibleScreens(state: HomeDnaState): DiscoveryScreen[] {
  const showHomeSize =
    state.selectedRooms.includes(completeHomeKey) ||
    state.selectedRooms.filter((r) => r !== completeHomeKey).length >= 3;

  return [
    "welcome",
    "rooms",
    "project-stage",
    "property-type",
    ...((showHomeSize ? ["home-size"] : []) as DiscoveryScreen[]),
    "household-size",
    "children",
    ...((state.home.children === "yes" ? ["children-count"] : []) as DiscoveryScreen[]),
    "pets",
    "style-intro",
    "style-selection",
    "atmosphere",
    "colour-direction",
    "inspiration",
    "placeholder",
  ];
}

export function HomeDnaDiscovery() {
  const [state, setState] = useState<HomeDnaState>(initialHomeDnaState);

  const flow = useMemo(() => visibleScreens(state), [state]);
  const index = Math.max(flow.indexOf(state.currentScreen), 0);
  const progress = (index / (flow.length - 1)) * SPRINT_2_PROGRESS_CEILING;

  const step = useCallback((direction: 1 | -1, patch?: Partial<HomeDnaState>) => {
    setState((prev) => {
      const next: HomeDnaState = {
        ...prev,
        ...patch,
        home: { ...prev.home, ...(patch?.home ?? {}) },
        style: { ...prev.style, ...(patch?.style ?? {}) },
      };
      const screens = visibleScreens(next);
      const current = screens.indexOf(prev.currentScreen);
      const target = Math.min(Math.max(current + direction, 0), screens.length - 1);
      return { ...next, currentScreen: screens[target] ?? prev.currentScreen };
    });
  }, []);

  const next = useCallback(
    (patch?: Partial<HomeDnaState>) => step(1, patch),
    [step],
  );
  const back = useCallback(() => step(-1), [step]);

  const screen = state.currentScreen;

  return (
    <HomeDnaLayout progress={progress}>
      {screen === "welcome" && <HomeDnaWelcome onStart={() => next()} />}

      {screen === "rooms" && (
        <RoomSelection
          selectedRooms={state.selectedRooms}
          onChange={(selectedRooms: RoomKey[]) => setState((s) => ({ ...s, selectedRooms }))}
          onBack={back}
          onNext={() => next()}
        />
      )}

      {screen === "project-stage" && (
        <SingleVisualChoiceScreen
          screenKey="project-stage"
          headline="V kateri fazi je vaš projekt?"
          support="Kontekst projekta nam pomaga pripraviti priporočila, primerna za vaš prostor in časovni okvir."
          options={projectStageOptions}
          {...(state.home.projectStage ? { value: state.home.projectStage } : {})}
          onChoose={(projectStage: ProjectStage) => next({ home: { projectStage } })}
          onBack={back}
        />
      )}

      {screen === "property-type" && (
        <SingleVisualChoiceScreen
          screenKey="property-type"
          headline="Kakšen dom opremljate?"
          options={propertyTypeOptions}
          {...(state.home.propertyType ? { value: state.home.propertyType } : {})}
          onChoose={(propertyType: PropertyType) => next({ home: { propertyType } })}
          onBack={back}
        />
      )}

      {screen === "home-size" && (
        <HomeSizeScreen
          {...(state.home.floorArea ? { value: state.home.floorArea } : {})}
          onSubmit={(floorArea) => next({ home: { floorArea } })}
          onBack={back}
        />
      )}

      {screen === "household-size" && (
        <OptionListScreen
          screenKey="household-size"
          headline="Koliko ljudi bo uporabljalo ta dom?"
          support="Dom mora delovati za vsakogar, ki v njem živi."
          large
          options={householdSizeOptions.map((o) => ({ value: o, label: o }))}
          {...(state.home.householdSize
            ? { value: state.home.householdSizePlus ? "5+" : String(state.home.householdSize) }
            : {})}
          onChoose={(value) =>
            next({
              home: { householdSize: value === "5+" ? 5 : Number(value), householdSizePlus: value === "5+" },
            })
          }
          onBack={back}
        />
      )}

      {screen === "children" && (
        <OptionListScreen
          screenKey="children"
          headline="Ali bodo v domu živeli otroci?"
          options={childrenOptions.map((o) => ({ value: o.value, label: o.label }))}
          {...(state.home.children ? { value: state.home.children } : {})}
          onChoose={(value) => next({ home: { children: value as ChildrenAnswer } })}
          onBack={back}
        />
      )}

      {screen === "children-count" && (
        <OptionListScreen
          screenKey="children-count"
          headline="Koliko otrok bo uporabljalo dom?"
          large
          options={childrenCountOptions.map((o) => ({ value: o, label: o }))}
          {...(state.home.childrenCount ? { value: String(state.home.childrenCount) } : {})}
          onChoose={(value) => next({ home: { childrenCount: Number(value.replace("+", "")) } })}
          onBack={back}
        />
      )}

      {screen === "pets" && (
        <PetsSelection
          selected={state.home.pets ?? []}
          onChange={(pets: PetKey[]) => setState((s) => ({ ...s, home: { ...s.home, pets } }))}
          onNext={() => next()}
          onBack={back}
        />
      )}

      {screen === "style-intro" && (
        <EditorialScreen
          screenKey="style-intro"
          eyebrow="Vaš slog"
          headline="Dom naj odraža ljudi, ki bodo v njem živeli."
          body="Ne iščemo kratkotrajnega trenda. Iščemo oblikovalski jezik, v katerem si lahko predstavljate živeti še vrsto let."
          cta="Odkrijmo vaš slog"
          image={styleIntroImage}
          onContinue={() => next()}
          onBack={back}
        />
      )}

      {screen === "style-selection" && (
        <StyleSelection
          selected={state.style.selectedStyles}
          onChange={(selectedStyles) =>
            setState((s) => ({ ...s, style: { ...s.style, selectedStyles } }))
          }
          onNext={() => next()}
          onBack={back}
        />
      )}

      {screen === "atmosphere" && (
        <AtmosphereSelection
          selected={state.style.atmosphere}
          onChange={(atmosphere) => setState((s) => ({ ...s, style: { ...s.style, atmosphere } }))}
          onNext={() => next()}
          onBack={back}
        />
      )}

      {screen === "colour-direction" && (
        <SingleVisualChoiceScreen
          screenKey="colour-direction"
          headline="Katera barvna smer vam je najbližja?"
          options={colourDirectionOptions}
          columns="two"
          {...(state.style.colourDirection ? { value: state.style.colourDirection } : {})}
          onChoose={(colourDirection) => next({ style: { ...state.style, colourDirection } })}
          onBack={back}
        />
      )}

      {screen === "inspiration" && (
        <InspirationLink
          {...(state.style.inspirationUrl ? { value: state.style.inspirationUrl } : {})}
          onSubmit={(inspirationUrl) =>
            next({ style: { ...state.style, ...(inspirationUrl ? { inspirationUrl } : {}) } })
          }
          onBack={back}
        />
      )}

      {screen === "placeholder" && (
        <EditorialScreen
          screenKey="placeholder"
          eyebrow="Vaš način življenja"
          headline="Slog smo spoznali. Zdaj želimo razumeti, kako živite."
          body="V naslednjem koraku bomo spoznali vaše vsakodnevne navade, prioritete in izzive, ki jih mora prihodnji dom reševati."
          cta="Nadaljujemo v naslednjem sprintu"
          image={lifestyleIntroImage}
          onBack={back}
        />
      )}
    </HomeDnaLayout>
  );
}
