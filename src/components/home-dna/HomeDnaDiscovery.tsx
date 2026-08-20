import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { ScreenDefRenderer } from "./ScreenDefRenderer";
import { buildLocalizedDiscoveryFlow } from "./localizedDiscoveryFlow";
import { initialHomeDnaState, type HomeDnaState } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";
import { useAnalytics } from "@/lib/useAnalytics";

const EARLY_FLOW_PROGRESS = 20;

export function HomeDnaDiscovery({
  locale = "sl",
  startAfterWelcome = false,
}: {
  locale?: Locale;
  startAfterWelcome?: boolean;
}) {
  const [state, setState] = useState<HomeDnaState>(() => {
    if (!startAfterWelcome) return initialHomeDnaState;

    const firstScreen = buildLocalizedDiscoveryFlow(initialHomeDnaState, locale).find(
      (screen) => screen.kind !== "welcome",
    );
    return firstScreen
      ? { ...initialHomeDnaState, currentScreen: firstScreen.key }
      : initialHomeDnaState;
  });
  const [highestProgress, setHighestProgress] = useState(0);
  const track = useAnalytics(locale, "home-dna");
  const lastTrackedScreen = useRef<string | null>(null);

  const flow = useMemo(() => buildLocalizedDiscoveryFlow(state, locale), [locale, state]);
  const index = Math.max(
    flow.findIndex((s) => s.key === state.currentScreen),
    0,
  );
  const def = flow[index] ?? flow[0];

  const roomsIndex = flow.findIndex((screen) => screen.key === "rooms");
  const remainingSteps = Math.max(flow.length - 1 - roomsIndex, 1);
  const rawProgress =
    roomsIndex > 0 && index <= roomsIndex
      ? (index / roomsIndex) * EARLY_FLOW_PROGRESS
      : EARLY_FLOW_PROGRESS + ((index - roomsIndex) / remainingSteps) * (100 - EARLY_FLOW_PROGRESS);
  const progress = Math.min(100, Math.max(highestProgress, rawProgress));

  useEffect(() => {
    setHighestProgress((current) => Math.max(current, rawProgress));
  }, [rawProgress]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [def?.key]);

  useEffect(() => {
    if (def?.kind === "contact") {
      void import("./SuccessScreen");
    }
  }, [def?.kind]);

  useEffect(() => {
    if (!def || lastTrackedScreen.current === def.key) return;
    lastTrackedScreen.current = def.key;

    if (def.kind === "welcome") {
      track("home_dna_view");
      return;
    }
    if (def.kind === "success") return;

    const stepData = { screenKey: def.key, stepIndex: index, stepTotal: flow.length };
    track("home_dna_step_view", stepData);
    if (def.kind === "contact") track("home_dna_contact_view", stepData);
  }, [def, flow.length, index, track]);

  const step = useCallback(
    (direction: 1 | -1, mutate?: (state: HomeDnaState) => HomeDnaState) => {
      if (direction === 1 && def) {
        const stepData = { screenKey: def.key, stepIndex: index, stepTotal: flow.length };
        if (def.kind === "welcome") track("home_dna_start", stepData);
        else if (def.kind !== "success") track("home_dna_step_complete", stepData);
      }

      setState((prev) => {
        const next = mutate ? mutate(prev) : prev;
        const screens = buildLocalizedDiscoveryFlow(next, locale);
        const current = screens.findIndex((s) => s.key === prev.currentScreen);
        const from = current >= 0 ? current : 0;
        const target = Math.min(Math.max(from + direction, 0), screens.length - 1);
        return { ...next, currentScreen: screens[target]?.key ?? prev.currentScreen };
      });
    },
    [def, flow.length, index, locale, track],
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

  if (!def) return null;

  return (
    <HomeDnaLayout progress={progress}>
      <ScreenDefRenderer
        key={def.key}
        def={def}
        state={state}
        locale={locale}
        onUpdate={update}
        onAdvance={advance}
        onBack={back}
      />
    </HomeDnaLayout>
  );
}
