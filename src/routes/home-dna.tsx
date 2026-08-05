import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaDiscovery } from "@/components/home-dna/HomeDnaDiscovery";

const title = "Home DNA™ Discovery — Nuveli Studio";
const description =
  "Spoznajte svoj Home DNA™. V nekaj minutah razumemo vaš dom, življenjski slog in želje ter pripravimo osebni Home DNA™ Report.";
const canonicalUrl = "https://nuvelistudio.com/home-dna";

export const Route = createFileRoute("/home-dna")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  }),
  component: HomeDnaPage,
});

function HomeDnaPage() {
  return <HomeDnaDiscovery />;
}
