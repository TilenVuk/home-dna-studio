import { readFile, writeFile } from "node:fs/promises";

const configUrl = new URL("../.output/server/wrangler.json", import.meta.url);

const rawConfig = await readFile(configUrl, "utf8");
const config = JSON.parse(rawConfig);

config.observability = {
  ...(config.observability ?? {}),
  enabled: true,
  head_sampling_rate: 1,
};

await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log("Cloudflare Workers Logs enabled in generated Wrangler config (100% sampling).");
