import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const resultsDir = process.argv[2] ?? "lighthouse-results";
const files = (await readdir(resultsDir))
  .filter((file) => file.endsWith(".json"))
  .sort();

if (files.length === 0) {
  console.error(`No Lighthouse JSON reports found in ${resultsDir}.`);
  process.exit(1);
}

const requiredAudits = [
  "document-title",
  "meta-description",
  "canonical",
  "robots-txt",
  "is-crawlable",
  "http-status-code",
];

const thresholds = {
  seo: 0.95,
  accessibility: 0.9,
  "best-practices": 0.9,
  performance: 0.75,
};

const reports = [];

for (const file of files) {
  const report = JSON.parse(await readFile(path.join(resultsDir, file), "utf8"));
  reports.push({ file, report });
}

const byUrl = new Map();
for (const entry of reports) {
  const url = entry.report.finalDisplayedUrl ?? entry.report.finalUrl ?? entry.report.requestedUrl ?? entry.file;
  const group = byUrl.get(url) ?? [];
  group.push(entry);
  byUrl.set(url, group);
}

const errors = [];
const warnings = [];

const pct = (score) => (typeof score === "number" ? `${Math.round(score * 100)}%` : "n/a");
const median = (values) => {
  const sorted = values.filter((value) => typeof value === "number").sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

for (const [url, entries] of byUrl) {
  console.log(`\n${url}`);

  const categoryScores = {};
  for (const category of Object.keys(thresholds)) {
    categoryScores[category] = median(
      entries.map(({ report }) => report.categories?.[category]?.score ?? null),
    );
  }

  console.log(
    `  SEO ${pct(categoryScores.seo)} | Performance ${pct(categoryScores.performance)} | Accessibility ${pct(categoryScores.accessibility)} | Best Practices ${pct(categoryScores["best-practices"])}`,
  );

  if ((categoryScores.seo ?? 0) < thresholds.seo) {
    errors.push(`${url}: SEO score ${pct(categoryScores.seo)} is below 95%.`);
  }

  for (const category of ["performance", "accessibility", "best-practices"]) {
    const score = categoryScores[category];
    if ((score ?? 0) < thresholds[category]) {
      warnings.push(
        `${url}: ${category} score ${pct(score)} is below ${Math.round(thresholds[category] * 100)}%.`,
      );
    }
  }

  for (const auditId of requiredAudits) {
    for (const { report, file } of entries) {
      const audit = report.audits?.[auditId];
      if (!audit || typeof audit.score !== "number" || audit.score < 0.9) {
        const detail = audit?.title ? ` (${audit.title})` : "";
        errors.push(`${url}: required audit '${auditId}' failed in ${file}${detail}.`);
        break;
      }
    }
  }
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.warn(`  ⚠ ${warning}`);
}

if (errors.length > 0) {
  console.error("\nLighthouse SEO checks failed:");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log("\nLighthouse SEO checks passed.");
