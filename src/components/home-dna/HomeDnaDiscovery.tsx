import { useCallback, useMemo, useState } from "react";
import styleIntroImage from "@/assets/style-intro.jpg";
import { AtmosphereSelection } from "./AtmosphereSelection";
import { EditorialScreen } from "./EditorialScreen";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { HomeDnaWelcome } from "./HomeDnaWelcome";
import { HomeSizeScreen } from "./HomeSizeScreen";
import { InspirationLink } from "./InspirationLink";
import { OptionListScreen } from "./OptionListScreen";
import { PetsSelection } from "./PetsSelection";
import { RoomSelection } from "./RoomSelection";
import { ScreenDefRenderer } from "./ScreenDefRenderer";
import { SingleVisualChoiceScreen } from "./SingleVisualChoiceScreen";
import { StyleSelection } from "./StyleSelection";
import { buildSprint3Screens, pruneRooms } from "./sprint3Flow";
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

const STYLE_PHASE_CEILING = 45;
const ROOM_PHASE_CEILING = 80;

function sprint12Screens(state: HomeDnaState): DiscoveryScreen[] {
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
  ];
}

export function HomeDnaDiscovery() {
  const [state, setState] = useState<HomeDnaState>(initialHomeDnaState);

  const sprint3 = useMemo(() => buildSprint3Screens(state), [state]);
  const flow = useMemo<DiscoveryScreen[]>(
    () => [...sprint12Screens(state), ...sprint3.map((s) => s.key)],
    [state, sprint3],
  );

  const index = Math.max(flow.indexOf(state.currentScreen), 0);
  const inspirationIndex = flow.indexOf("inspiration");
  const lastRoomIndex = flow.length - 2;

  let progress: number;
  if (index <= inspirationIndex) {
    progress = (index / Math.max(inspirationIndex, 1)) * STYLE_PHASE_CEILING;
  } else {
    const span = Math.max(lastRoomIndex - inspirationIndex, 1);
    progress =
      STYLE_PHASE_CEILING +
      (Math.min(index - inspirationIndex, span) / span) *
        (ROOM_PHASE_CEILING - STYLE_PHASE_CEILING);
  }

  const step = useCallback(
    (direction: 1 | -1, mutate?: (state: HomeDnaState) => HomeDnaState) => {
      setState((prev) => {
        const next = mutate ? mutate(prev) : prev;
        const screens = [
          ...sprint12Screens(next),
          ...buildSprint3Screens(next).map((s) => s.key),
        ];
        const current = screens.indexOf(prev.currentScreen);
        const from = current >= 0 ? current : 0;
        const target = Math.min(Math.max(from + direction, 0), screens.length - 1);
        return { ...next, currentScreen: screens[target] ?? prev.currentScreen };
      });
    },
    [],
  );

  const advance = useCallback(
    (mutate?: (state: HomeDnaState) => HomeDnaState) => step(1, mutate),
    [step],
  );
  const back = useCallback(() => step(-1), [step]);
  const update = useCallback(
    (mutate: (state: HomeDnaState) => HomeDnaState) => setState((prev) => mutate(prev)),
    [],
  );

  const screen = state.currentScreen;
  const sprint3Def = sprint3.find((s) => s.key === screen);

  return (
    <HomeDnaLayout progress={progress}>
      {screen === "welcome" && <HomeDnaWelcome onStart={() => advance()} />}

      {screen === "rooms" && (
        <RoomSelection
          selectedRooms={state.selectedRooms}
          onChange={(selectedRooms: RoomKey[]) => setState((s) => ({ ...s, selectedRooms }))}
          onBack={back}
          onNext={() => advance((s) => pruneRooms(s))}
        />
      )}

      {screen === "project-stage" && (
        <SingleVisualChoiceScreen
          screenKey="project-stage"
          headline="V kateri fazi je vaš projekt?"
          support="Kontekst projekta nam pomaga pripraviti priporočila, primerna za vaš prostor in časovni okvir."
          options={projectStageOptions}
          {...(state.home.projectStage ? { value: state.home.projectStage } : {})}
          onChoose={(projectStage: ProjectStage) =>
            advance((s) => ({ ...s, home: { ...s.home, projectStage } }))
          }
          onBack={back}
        />
      )}

      {screen === "property-type" && (
        <SingleVisualChoiceScreen
          screenKey="property-type"
          headline="Kakšen dom opremljate?"
          options={propertyTypeOptions}
          {...(state.home.propertyType ? { value: state.home.propertyType } : {})}
          onChoose={(propertyType: PropertyType) =>
            advance((s) => ({ ...s, home: { ...s.home, propertyType } }))
          }
          onBack={back}
        />
      )}

      {screen === "home-size" && (
        <HomeSizeScreen
          {...(state.home.floorArea ? { value: state.home.floorArea } : {})}
          onSubmit={(floorArea) => advance((s) => ({ ...s, home: { ...s.home, floorArea } }))}
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
            advance((s) => ({
              ...s,
              home: {
                ...s.home,
                householdSize: value === "5+" ? 5 : Number(value),
                householdSizePlus: value === "5+",
              },
            }))
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
          onChoose={(value) =>
            advance((s) => ({ ...s, home: { ...s.home, children: value as ChildrenAnswer } }))
          }
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
          onChoose={(value) =>
            advance((s) => ({
              ...s,
              home: { ...s.home, childrenCount: Number(value.replace("+", "")) },
            }))
          }
          onBack={back}
        />
      )}

      {screen === "pets" && (
        <PetsSelection
          selected={state.home.pets ?? []}
          onChange={(pets: PetKey[]) => setState((s) => ({ ...s, home: { ...s.home, pets } }))}
          onNext={() => advance()}
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
          onContinue={() => advance()}
          onBack={back}
        />
      )}

      {screen === "style-selection" && (
        <StyleSelection
          selected={state.style.selectedStyles}
          onChange={(selectedStyles) =>
            setState((s) => ({ ...s, style: { ...s.style, selectedStyles } }))
          }
          onNext={() => advance()}
          onBack={back}
        />
      )}

      {screen === "atmosphere" && (
        <AtmosphereSelection
          selected={state.style.atmosphere}
          onChange={(atmosphere) => setState((s) => ({ ...s, style: { ...s.style, atmosphere } }))}
          onNext={() => advance()}
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
          onChoose={(colourDirection) =>
            advance((s) => ({ ...s, style: { ...s.style, colourDirection } }))
          }
          onBack={back}
        />
      )}

      {screen === "inspiration" && (
        <InspirationLink
          {...(state.style.inspirationUrl ? { value: state.style.inspirationUrl } : {})}
          onSubmit={(inspirationUrl) =>
            advance((s) => ({
              ...s,
              style: { ...s.style, ...(inspirationUrl ? { inspirationUrl } : {}) },
            }))
          }
          onBack={back}
        />
      )}

      {sprint3Def && (
        <ScreenDefRenderer
          key={sprint3Def.key}
          def={sprint3Def}
          onUpdate={update}
          onAdvance={advance}
          onBack={back}
        />
      )}
    </HomeDnaLayout>
  );
}
