const pages = [
  { url: "https://nuvelistudio.com/", canonical: "https://nuvelistudio.com/" },
  { url: "https://nuvelistudio.com/home-dna", canonical: "https://nuvelistudio.com/home-dna" },
];

const errors = [];

function getMetaTags(html) {
  return html.match(/<meta\b[^>]*>/gi) ?? [];
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

function findMeta(html, name) {
  return getMetaTags(html).find((tag) => (getAttr(tag, "name") ?? "").toLowerCase() === name);
}

function findCanonical(html) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  return links.find((tag) => (getAttr(tag, "rel") ?? "").toLowerCase() === "canonical");
}

for (const page of pages) {
  const response = await fetch(page.url, { redirect: "follow" });
  if (!response.ok) {
    errors.push(`${page.url}: HTTP ${response.status}.`);
    continue;
  }

  const html = await response.text();

  const viewportTag = findMeta(html, "viewport");
  const viewportContent = viewportTag ? (getAttr(viewportTag, "content") ?? "") : "";
  if (!viewportTag || !/\bwidth\s*=\s*device-width\b/i.test(viewportContent)) {
    errors.push(`${page.url}: missing valid viewport meta tag with width=device-width.`);
  }

  const descriptionTag = findMeta(html, "description");
  const description = descriptionTag ? (getAttr(descriptionTag, "content") ?? "") : "";
  if (!description) {
    errors.push(`${page.url}: missing meta description.`);
  } else if (description.length > 160) {
    errors.push(
      `${page.url}: meta description is ${description.length} characters; maximum is 160.`,
    );
  }

  const canonicalTag = findCanonical(html);
  const canonical = canonicalTag ? getAttr(canonicalTag, "href") : null;
  if (canonical !== page.canonical) {
    errors.push(
      `${page.url}: canonical is '${canonical ?? "missing"}', expected '${page.canonical}'.`,
    );
  }

  if (!/<html\b[^>]*\blang\s*=\s*["']sl["']/i.test(html)) {
    errors.push(`${page.url}: expected <html lang="sl">.`);
  }

  console.log(`${page.url}: production SEO meta check complete.`);
}

if (errors.length > 0) {
  console.error("\nProduction SEO metadata checks failed:");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log("\nProduction SEO metadata checks passed.");
