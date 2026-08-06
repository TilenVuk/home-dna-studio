import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light" | "dark" | "auto";
      language: string;
      size: "normal" | "compact" | "flexible";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
}: {
  siteKey: string;
  onVerify: (token: string) => void;
  onError: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const verifyRef = useRef(onVerify);
  const errorRef = useRef(onError);

  verifyRef.current = onVerify;
  errorRef.current = onError;

  useEffect(() => {
    if (!siteKey) return;

    let active = true;
    let widgetId: string | undefined;

    void loadTurnstile()
      .then((turnstile) => {
        if (!active || !containerRef.current) return;

        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "home_dna_report",
          theme: "light",
          language: "sl",
          size: "flexible",
          callback: (token) => verifyRef.current(token),
          "error-callback": () => {
            verifyRef.current("");
            errorRef.current();
          },
          "expired-callback": () => verifyRef.current(""),
          "timeout-callback": () => verifyRef.current(""),
        });
      })
      .catch(() => {
        if (active) errorRef.current();
      });

    return () => {
      active = false;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey]);

  return (
    <div ref={containerRef} className="min-h-[65px] w-full" aria-label="Varnostno preverjanje" />
  );
}

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const waitForApi = (attempt = 0) => {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      if (attempt >= 100) {
        reject(new Error("Turnstile API did not load"));
        return;
      }
      window.setTimeout(() => waitForApi(attempt + 1), 50);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error("Turnstile script failed to load"));
      document.head.appendChild(script);
    }

    waitForApi();
  });

  return scriptPromise;
}
