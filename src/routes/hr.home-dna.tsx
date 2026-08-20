import { createFileRoute } from "@tanstack/react-router";
import { HomeDnaEntry } from "@/components/home-dna/HomeDnaEntry";

const title = "Home DNA™ – osobni izvještaj i okvirna ponuda | Nuveli";
const socialTitle = "Home DNA™: osobni izvještaj + okvirna ponuda";
const description =
  "Otkrijte svoj Home DNA™ i primite osobni izvještaj te okvirnu ponudu za odabrani opseg projekta.";
const canonicalUrl = "https://nuvelistudio.com/hr/home-dna";

export const Route = createFileRoute("/hr/home-dna")({
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
      { rel: "alternate", hrefLang: "hr", href: canonicalUrl },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/home-dna" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/home-dna" },
    ],
  }),
  component: () => <HomeDnaEntry locale="hr" />,
});
