import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaDiscovery } from "@/components/home-dna/HomeDnaDiscovery";

const title = "Home DNA™ Discovery — Wolf Studio";
const description =
  "Spoznajte svoj Home DNA™. V nekaj minutah razumemo vaš dom, življenjski slog in želje ter pripravimo osebni Home DNA™ Report.";

export const Route = createFileRoute("/home-dna")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeDnaPage,
});

function HomeDnaPage() {
  return <HomeDnaDiscovery />;
}
