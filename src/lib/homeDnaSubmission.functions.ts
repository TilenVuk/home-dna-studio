import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_PDF_BASE64_LENGTH = 20_000_000;
const MAX_ANSWERS_LENGTH = 120_000;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(JsonValueSchema),
  ]),
);

const ContactInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).default(""),
  consent: z.literal(true),
});

const ReportInput = z.object({
  intro: z.string().trim().max(4_000),
  lifestyle: z.string().trim().max(4_000),
  style: z.string().trim().max(4_000),
  why: z.string().trim().max(5_000),
  images: z.object({
    coverImageId: z.string().trim().max(100),
    lifestyleImageId: z.string().trim().max(100),
    styleImageIds: z.array(z.string().trim().max(100)).min(1).max(2),
  }),
  rooms: z
    .array(
      z.object({
        key: z.string().trim().max(100),
        label: z.string().trim().max(150),
        text: z.string().trim().max(5_000),
        imageId: z.string().trim().max(100),
      }),
    )
    .max(20),
  investment: z.string().trim().max(4_000),
  nextSteps: z
    .array(
      z.object({
        title: z.string().trim().max(150),
        text: z.string().trim().max(2_000),
      }),
    )
    .length(3),
  closing: z.string().trim().max(2_000),
});

const SubmissionInput = z.object({
  submissionId: z.string().uuid(),
  contact: ContactInput,
  answers: z
    .record(JsonValueSchema)
    .refine((value) => JSON.stringify(value).length <= MAX_ANSWERS_LENGTH, {
      message: "Home DNA answers are too large",
    }),
  summary: z.string().trim().min(1).max(30_000),
  report: ReportInput,
  pdfBase64: z
    .string()
    .min(100)
    .max(MAX_PDF_BASE64_LENGTH)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, "Invalid PDF encoding"),
  pdfFilename: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9._-]+\.pdf$/i)
    .max(120),
});

export type HomeDnaSubmissionResult = {
  submissionId: string;
  delivered: boolean;
  customerEmailStatus: "pending" | "sent" | "failed";
  internalEmailStatus: "pending" | "sent" | "failed";
};

export const submitHomeDna = createServerFn({ method: "POST" })
  .validator((input: unknown) => SubmissionInput.parse(input))
  .handler(async ({ data }): Promise<HomeDnaSubmissionResult> => {
    const { getRequest, getRequestIP } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const origin = request.headers.get("origin");
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || request.headers.get("host");

    if (origin && host) {
      let originHost = "";
      try {
        originHost = new URL(origin).host;
      } catch {
        throw new Error("HOME_DNA_INVALID_ORIGIN");
      }
      if (originHost !== host) throw new Error("HOME_DNA_INVALID_ORIGIN");
    }

    const requestIp = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const { processHomeDnaSubmission } = await import("./homeDnaSubmission.server");
    return processHomeDnaSubmission(data, requestIp);
  });

export type HomeDnaSubmissionInput = z.infer<typeof SubmissionInput>;
