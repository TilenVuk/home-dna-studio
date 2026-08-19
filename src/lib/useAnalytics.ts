import { useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  recordAnalyticsEvent,
  type AnalyticsEventInput,
  type AnalyticsEventName,
} from "./analytics.functions";
import type { Locale } from "./i18n";

type AnalyticsSource = AnalyticsEventInput["source"];
type AnalyticsDetails = AnalyticsEventInput["details"];

type TrackOptions = {
  screenKey?: string;
  stepIndex?: number;
  stepTotal?: number;
  submissionId?: string;
  bookingId?: string;
  details?: AnalyticsDetails;
};

type MarketingWindow = Window & {
  __NUVELI_MARKETING_CONSENT__?: boolean;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

let pageSessionId: string | null = null;
let acquisition: ReturnType<typeof readAcquisition> | null = null;

export function useAnalytics(locale: Locale, source: AnalyticsSource) {
  const send = useServerFn(recordAnalyticsEvent);

  return useCallback(
    (eventName: AnalyticsEventName, options: TrackOptions = {}) => {
      if (typeof window === "undefined") return;
      const context = acquisition ?? (acquisition = readAcquisition());
      const sessionId = pageSessionId ?? (pageSessionId = crypto.randomUUID());
      const payload: AnalyticsEventInput = {
        id: crypto.randomUUID(),
        sessionId,
        eventName,
        locale,
        source,
        deviceType: deviceType(window.innerWidth),
        viewportWidth: Math.min(Math.max(Math.round(window.innerWidth), 240), 10_000),
        landingPath: context.landingPath,
        details: options.details ?? {},
        ...(context.utmSource ? { utmSource: context.utmSource } : {}),
        ...(context.utmMedium ? { utmMedium: context.utmMedium } : {}),
        ...(context.utmCampaign ? { utmCampaign: context.utmCampaign } : {}),
        ...(context.utmContent ? { utmContent: context.utmContent } : {}),
        ...(context.utmTerm ? { utmTerm: context.utmTerm } : {}),
        ...(context.referrerHost ? { referrerHost: context.referrerHost } : {}),
        ...(options.screenKey ? { screenKey: options.screenKey } : {}),
        ...(options.stepIndex !== undefined ? { stepIndex: options.stepIndex } : {}),
        ...(options.stepTotal !== undefined ? { stepTotal: options.stepTotal } : {}),
        ...(options.submissionId ? { submissionId: options.submissionId } : {}),
        ...(options.bookingId ? { bookingId: options.bookingId } : {}),
      };

      void send({ data: payload }).catch(() => {
        // Analytics must never interrupt the questionnaire or booking flow.
      });
      forwardConsentGatedMarketingEvent(eventName, options.details);
    },
    [locale, send, source],
  );
}

function deviceType(viewportWidth: number): AnalyticsEventInput["deviceType"] {
  if (viewportWidth < 768) return "mobile";
  if (viewportWidth < 1_024) return "tablet";
  return "desktop";
}

function readAcquisition() {
  const params = new URLSearchParams(window.location.search);
  let referrerHost: string | undefined;
  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) referrerHost = host.slice(0, 255);
    } catch {
      // Ignore malformed referrer values.
    }
  }

  return {
    landingPath: window.location.pathname.slice(0, 300) || "/",
    utmSource: trackingParam(params, "utm_source", 120),
    utmMedium: trackingParam(params, "utm_medium", 120),
    utmCampaign: trackingParam(params, "utm_campaign", 160),
    utmContent: trackingParam(params, "utm_content", 160),
    utmTerm: trackingParam(params, "utm_term", 160),
    referrerHost,
  };
}

function trackingParam(params: URLSearchParams, key: string, max: number): string | undefined {
  const value = params.get(key)?.trim();
  return value ? value.slice(0, max) : undefined;
}

function forwardConsentGatedMarketingEvent(
  eventName: AnalyticsEventName,
  details: AnalyticsDetails | undefined,
) {
  const marketingWindow = window as MarketingWindow;
  if (marketingWindow.__NUVELI_MARKETING_CONSENT__ !== true) return;

  marketingWindow.gtag?.("event", eventName, details ?? {});

  if (eventName === "home_dna_complete") {
    marketingWindow.fbq?.("track", "Lead");
  } else if (eventName === "consultation_booked") {
    marketingWindow.fbq?.("track", "Schedule");
  } else if (eventName === "home_dna_start") {
    marketingWindow.fbq?.("trackCustom", "HomeDnaStart");
  }
}
