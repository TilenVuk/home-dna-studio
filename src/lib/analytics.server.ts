import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { AnalyticsEventInput } from "./analytics.functions";

const MAX_EVENTS_PER_SESSION = 250;

export async function storeAnalyticsEvent(input: AnalyticsEventInput) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1_000).toISOString();
  const { count, error: countError } = await (supabaseAdmin
    .from("home_dna_analytics_events") as any)
    .select("id", { count: "exact", head: true })
    .eq("session_id", input.sessionId)
    .gte("created_at", since);

  if (countError) {
    console.error("Analytics session limit query failed", { code: countError.code });
    return { accepted: false };
  }

  if ((count ?? 0) >= MAX_EVENTS_PER_SESSION) return { accepted: false };

  const { error } = await (supabaseAdmin.from("home_dna_analytics_events") as any).insert({
    id: input.id,
    session_id: input.sessionId,
    event_name: input.eventName,
    locale: input.locale,
    source: input.source,
    device_type: input.deviceType,
    viewport_width: input.viewportWidth,
    screen_key: input.screenKey ?? null,
    step_index: input.stepIndex ?? null,
    step_total: input.stepTotal ?? null,
    submission_id: input.submissionId ?? null,
    booking_id: input.bookingId ?? null,
    utm_source: input.utmSource ?? null,
    utm_medium: input.utmMedium ?? null,
    utm_campaign: input.utmCampaign ?? null,
    utm_content: input.utmContent ?? null,
    utm_term: input.utmTerm ?? null,
    referrer_host: input.referrerHost ?? null,
    landing_path: input.landingPath,
    details: input.details,
  });

  if (error?.code === "23505") return { accepted: true };
  if (error) {
    console.error("Analytics event insert failed", { code: error.code, event: input.eventName });
    return { accepted: false };
  }

  return { accepted: true };
}
