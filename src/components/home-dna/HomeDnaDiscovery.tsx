import { useState } from "react";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { HomeDnaWelcome } from "./HomeDnaWelcome";
import { RoomSelection } from "./RoomSelection";
import { DiscoveryNavigation } from "./DiscoveryNavigation";
import { screenProgress } from "./homeDnaData";
import { initialHomeDnaState, type HomeDnaState, type RoomKey } from "./homeDnaTypes";

export function HomeDnaDiscovery() {
  const [state, setState] = useState<HomeDnaState>(initialHomeDnaState);

  const goTo = (currentScreen: HomeDnaState["currentScreen"]) =>
    setState((s) => ({ ...s, currentScreen }));

  const setRooms = (selectedRooms: RoomKey[]) => setState((s) => ({ ...s, selectedRooms }));

  return (
    <HomeDnaLayout progress={screenProgress[state.currentScreen]}>
      {state.currentScreen === "welcome" && <HomeDnaWelcome onStart={() => goTo("rooms")} />}

      {state.currentScreen === "rooms" && (
        <RoomSelection
          selectedRooms={state.selectedRooms}
          onChange={setRooms}
          onBack={() => goTo("welcome")}
          onNext={() => goTo("placeholder")}
        />
      )}

      {state.currentScreen === "placeholder" && (
        <div className="max-w-[46ch]">
          <p className="eyebrow">Home DNA™ Discovery</p>
          <h1 className="display-lg mt-6">Odlično. Vaš Discovery je pripravljen.</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            V naslednjem koraku bomo spoznali vaš dom, slog in način življenja.
          </p>
          <p className="mt-10 inline-flex min-h-12 items-center rounded-full border border-border px-7 py-3.5 text-sm text-muted-foreground">
            Nadaljujemo v naslednjem sprintu
          </p>
          <DiscoveryNavigation onBack={() => goTo("rooms")} showNext={false} />
        </div>
      )}
    </HomeDnaLayout>
  );
}
