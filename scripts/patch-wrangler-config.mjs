import { access, readFile, writeFile } from "node:fs/promises";

const candidateConfigUrls = [
  new URL("../.output/server/wrangler.json", import.meta.url),
  new URL("../dist/server/wrangler.json", import.meta.url),
];

const existingConfigUrls = [];

for (const configUrl of candidateConfigUrls) {
  try {
    await access(configUrl);
    existingConfigUrls.push(configUrl);
  } catch {
    // Different build environments generate Wrangler config in different directories.
  }
}

if (existingConfigUrls.length === 0) {
  throw new Error(
    "Generated Wrangler config was not found in .output/server or dist/server.",
  );
}

for (const configUrl of existingConfigUrls) {
  const rawConfig = await readFile(configUrl, "utf8");
  const config = JSON.parse(rawConfig);

  config.observability = {
    ...(config.observability ?? {}),
    enabled: true,
    head_sampling_rate: 1,
  };

  await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(
    `Cloudflare Workers Logs enabled in generated Wrangler config: ${configUrl.pathname}`,
  );
}
