import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaDiscovery } from "@/components/home-dna/HomeDnaDiscovery";

const title = "Home DNA™ – osebni report in okvirna ponudba | Nuveli";
const socialTitle = "Home DNA™: osebni report + okvirna ponudba";
const description =
  "Spoznajte svoj Home DNA™ in prejmite osebni report ter okvirno ponudbo za izbrani obseg projekta.";
const canonicalUrl = "https://nuvelistudio.com/home-dna";

export const Route = createFileRoute("/home-dna")({
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
      { rel: "alternate", hrefLang: "sl", href: canonicalUrl },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/home-dna" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/home-dna" },
      { rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
    ],
  }),
  component: HomeDnaPage,
});

function HomeDnaPage() {
  return <HomeDnaDiscovery locale="sl" />;
}
