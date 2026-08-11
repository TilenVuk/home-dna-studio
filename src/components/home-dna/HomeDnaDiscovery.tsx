import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { ScreenDefRenderer } from "./ScreenDefRenderer";
import { buildLocalizedDiscoveryFlow } from "./localizedDiscoveryFlow";
import { initialHomeDnaState, type HomeDnaState } from "./homeDnaTypes";
import type { Locale } from "@/lib/i18n";

export function HomeDnaDiscovery({ locale = "sl" }: { locale?: Locale }) {
  const [state, setState] = useState<HomeDnaState>(initialHomeDnaState);

  const flow = useMemo(() => buildLocalizedDiscoveryFlow(state, locale), [locale, state]);
  const index = Math.max(
    flow.findIndex((s) => s.key === state.currentScreen),
    0,
  );
  const def = flow[index] ?? flow[0];

  const progress = flow.length > 1 ? (index / (flow.length - 1)) * 100 : 0;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [def?.key]);

  useEffect(() => {
    if (def?.kind === "contact") {
      void import("./SuccessScreen");
    }
  }, [def?.kind]);

  const step = useCallback(
    (direction: 1 | -1, mutate?: (state: HomeDnaState) => HomeDnaState) => {
      setState((prev) => {
        const next = mutate ? mutate(prev) : prev;
        const screens = buildLocalizedDiscoveryFlow(next, locale);
        const current = screens.findIndex((s) => s.key === prev.currentScreen);
        const from = current >= 0 ? current : 0;
        const target = Math.min(Math.max(from + direction, 0), screens.length - 1);
        return { ...next, currentScreen: screens[target]?.key ?? prev.currentScreen };
      });
    },
    [locale],
  );

  const advance = useCallback((mutate?: (state: HomeDnaState) => HomeDnaState) => step(1, mutate), [step]);
  const back = useCallback(() => step(-1), [step]);
  const update = useCallback((mutate: (state: HomeDnaState) => HomeDnaState) => setState((prev) => mutate(prev)), []);

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
