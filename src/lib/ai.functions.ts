import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const DesignTipInput = z.object({
  style: z.enum(["minimalist", "warm", "modern", "scandinavian"]).default("scandinavian"),
  room: z.enum(["kitchen", "living-room", "bedroom", "wardrobe", "entry"]).default("living-room"),
});

export const generateDesignTip = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DesignTipInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      system:
        "You are a senior interior architect at WOLF STUDIO, a Slovenian studio that creates bespoke built-in furniture and complete interior solutions. " +
        "Write one concise, premium design tip (max 2 sentences) in a warm, architectural tone. " +
        "Never mention prices or timelines. Focus on materiality, light, and how the space is used.",
      prompt: `Give a design tip for a ${data.style} ${data.room}.`,
    });

    return { tip: text.trim() };
  });
