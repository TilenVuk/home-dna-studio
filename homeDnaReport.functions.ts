import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { HomeDnaReportData } from "@/components/home-dna/homeDnaTypes";

const ImageChoiceInput = z.object({
  id: z.string(),
  label: z.string(),
});

const ReportInput = z.object({
  summary: z.string(),
  rooms: z.array(z.object({ key: z.string(), label: z.string() })),
  investmentLine: z.string(),
  executionLevel: z.string(),
  imageCandidates: z.object({
    cover: z.array(ImageChoiceInput),
    lifestyle: z.array(ImageChoiceInput),
    style: z.array(ImageChoiceInput),
    rooms: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        images: z.array(ImageChoiceInput),
      }),
    ),
  }),
});

export type HomeDnaReport = HomeDnaReportData;

export const generateHomeDnaReport = createServerFn({ method: "POST" })
  .validator((input: unknown) => ReportInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    try {
      const { createHomeDnaReport } = await import("./homeDnaReport.server");
      return await createHomeDnaReport(data, key);
    } catch (error) {
      console.error("HomeDnaReport: generation failed", error instanceof Error ? error.message : String(error));
      throw error;
    }
  });
