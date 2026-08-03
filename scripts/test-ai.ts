import { createLovableAiGatewayProvider } from "../src/lib/ai-gateway.server";
import { generateText } from "ai";

async function main() {
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) {
    console.error("Missing LOVABLE_API_KEY");
    process.exit(1);
  }

  const gateway = createLovableAiGatewayProvider(key);
  const { text, response } = await generateText({
    model: gateway("google/gemini-3.6-flash"),
    prompt: "Say a one-sentence welcome for WOLF STUDIO, a Slovenian interior design studio.",
  });

  console.log("Tip:", text.trim());
  console.log("Run ID:", gateway.getRunId());
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
