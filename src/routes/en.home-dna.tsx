import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaDiscovery } from "@/components/home-dna/HomeDnaDiscovery";

const title = "Home DNA™ – Personal Report & Indicative Quote | Nuveli";
const socialTitle = "Home DNA™: Personal Report + Indicative Quote";
const description =
  "Discover your Home DNA™ and receive a personal report plus an indicative quote for your selected project scope.";
const canonicalUrl = "https://nuvelistudio.com/en/home-dna";

export const Route = createFileRoute("/en/home-dna")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/home-dna" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/home-dna" },
      { rel: "alternate", hrefLang: "en", href: canonicalUrl },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/home-dna" },
    ],
  }),
  component: () => <HomeDnaDiscovery locale="en" />,
});
