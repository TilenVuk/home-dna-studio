import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { HomeDnaReportData } from "@/components/home-dna/homeDnaTypes";
import { isAllowedRequestOrigin } from "./requestSecurity";

const ImageChoiceInput = z.object({
  id: z.string().trim().min(1).max(100),
  label: z.string().trim().min(1).max(150),
});

const ReportInput = z
  .object({
    projectSummary: z.string().trim().min(1).max(30_000),
    turnstileToken: z.string().trim().min(10).max(2_048),
    rooms: z.array(z.object({ key: z.string().trim().max(100), label: z.string().trim().max(150) })).max(20),
    investmentLine: z.string().trim().max(250),
    executionLevel: z.string().trim().max(150),
    imageCandidates: z.object({
      cover: z.array(ImageChoiceInput).max(30),
      lifestyle: z.array(ImageChoiceInput).max(30),
      style: z.array(ImageChoiceInput).max(30),
      rooms: z
        .array(
          z.object({
            key: z.string().trim().max(100),
            label: z.string().trim().max(150),
            images: z.array(ImageChoiceInput).max(30),
          }),
        )
        .max(20),
    }),
  })
  .strict();

export type HomeDnaReport = HomeDnaReportData;

export const generateHomeDnaReport = createServerFn({ method: "POST" })
  .validator((input: unknown) => ReportInput.parse(input))
  .handler(async ({ data }) => {
    const { getRequest, getRequestIP } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const origin = request.headers.get("origin");
    if (origin && !isAllowedRequestOrigin(request, origin)) {
      throw new Error("HOME_DNA_INVALID_ORIGIN");
    }

    const requestIp = request.headers.get("cf-connecting-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown";

    const { authorizeHomeDnaReport } = await import("./homeDnaReportSecurity.server");
    await authorizeHomeDnaReport({ turnstileToken: data.turnstileToken, requestIp });

    const { turnstileToken: _turnstileToken, ...reportData } = data;
    const apiKey = process.env["GEMINI_API_KEY"]?.trim();
    const model = process.env["GEMINI_MODEL"]?.trim();

    try {
      const { createHomeDnaReport } = await import("./homeDnaReport.server");
      return await createHomeDnaReport(reportData, { apiKey, model });
    } catch (error) {
      console.error("HomeDnaReport: generation failed", error instanceof Error ? error.message : String(error));
      throw error;
    }
  });
