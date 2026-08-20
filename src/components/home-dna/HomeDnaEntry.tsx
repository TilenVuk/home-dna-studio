import { lazy, Suspense, useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";
import { useAnalytics } from "@/lib/useAnalytics";
import { HomeDnaLayout } from "./HomeDnaLayout";
import { HomeDnaWelcome } from "./HomeDnaWelcome";

const HomeDnaDiscovery = lazy(() =>
  import("./HomeDnaDiscovery").then((module) => ({ default: module.HomeDnaDiscovery })),
);

const loadingCopy: Record<Locale, string> = {
  sl: "Pripravljamo vprašalnik …",
  hr: "Pripremamo upitnik …",
  en: "Preparing the questionnaire …",
};

export function HomeDnaEntry({ locale = "sl" }: { locale?: Locale }) {
  const [started, setStarted] = useState(false);
  const viewTracked = useRef(false);
  const track = useAnalytics(locale, "home-dna");

  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    track("home_dna_view", { screenKey: "welcome", stepIndex: 0 });
  }, [track]);

  if (started) {
    return (
      <Suspense
        fallback={
          <HomeDnaLayout progress={0}>
            <div className="flex min-h-[60vh] items-center justify-center">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {loadingCopy[locale]}
              </p>
            </div>
          </HomeDnaLayout>
        }
      >
        <HomeDnaDiscovery locale={locale} startAfterWelcome />
      </Suspense>
    );
  }

  return (
    <HomeDnaLayout progress={0}>
      <HomeDnaWelcome
        locale={locale}
        onStart={() => {
          track("home_dna_start", { screenKey: "welcome", stepIndex: 0 });
          setStarted(true);
        }}
      />
    </HomeDnaLayout>
  );
}
