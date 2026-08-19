import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isAllowedRequestOrigin } from "./requestSecurity";

export const analyticsEventNames = [
  "home_dna_view",
  "home_dna_start",
  "home_dna_step_view",
  "home_dna_step_complete",
  "home_dna_contact_view",
  "home_dna_report_generation_started",
  "home_dna_report_generated",
  "home_dna_pdf_generated",
  "home_dna_complete",
  "home_dna_error",
  "home_dna_pdf_download",
  "booking_view",
  "booking_slot_selected",
  "booking_submit",
  "consultation_booked",
  "booking_error",
] as const;

const AnalyticsDetails = z
  .object({
    stage: z.enum(["report", "pdf", "submission", "schedule", "booking", "download"]).optional(),
    result: z.enum(["sent", "partial", "failed", "success"]).optional(),
    errorCode: z
      .string()
      .trim()
      .regex(/^[A-Z0-9_]{1,80}$/)
      .optional(),
    consultationType: z.enum(["online", "home-visit"]).optional(),
  })
  .strict()
  .default({});

const OptionalTrackingText = (max: number) => z.string().trim().min(1).max(max).optional();

const AnalyticsEventInput = z
  .object({
    id: z.string().uuid(),
    sessionId: z.string().uuid(),
    eventName: z.enum(analyticsEventNames),
    locale: z.enum(["sl", "hr", "en"]),
    source: z.enum(["home-dna", "contact"]),
    deviceType: z.enum(["mobile", "tablet", "desktop"]),
    viewportWidth: z.number().int().min(240).max(10_000),
    screenKey: OptionalTrackingText(100),
    stepIndex: z.number().int().min(0).max(200).optional(),
    stepTotal: z.number().int().min(1).max(200).optional(),
    submissionId: z.string().uuid().optional(),
    bookingId: z.string().uuid().optional(),
    utmSource: OptionalTrackingText(120),
    utmMedium: OptionalTrackingText(120),
    utmCampaign: OptionalTrackingText(160),
    utmContent: OptionalTrackingText(160),
    utmTerm: OptionalTrackingText(160),
    referrerHost: OptionalTrackingText(255),
    landingPath: z.string().trim().min(1).max(300),
    details: AnalyticsDetails,
  })
  .strict();

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsEventInput = z.infer<typeof AnalyticsEventInput>;

export const recordAnalyticsEvent = createServerFn({ method: "POST" })
  .validator((input: unknown) => AnalyticsEventInput.parse(input))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const origin = request.headers.get("origin");
    if (origin && !isAllowedRequestOrigin(request, origin)) {
      throw new Error("ANALYTICS_INVALID_ORIGIN");
    }

    const { storeAnalyticsEvent } = await import("./analytics.server");
    return storeAnalyticsEvent(data);
  });
