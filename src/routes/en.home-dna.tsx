import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaDiscovery } from "@/components/home-dna/HomeDnaDiscovery";

const title = "Home DNA™ Discovery — Nuveli Studio";
const description = "Discover your Home DNA™. Receive a personal Home DNA™ Report and an indicative investment estimate for your project.";

export const Route = createFileRoute("/en/home-dna")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nuvelistudio.com/en/home-dna" },
    ],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/en/home-dna" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/home-dna" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/home-dna" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/home-dna" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/home-dna" },
    ],
  }),
  component: () => <HomeDnaDiscovery locale="en" />,
});
