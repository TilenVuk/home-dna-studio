import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Vodiči za interijere i namještaj po mjeri | Nuveli Studio";
const description =
  "Praktični vodiči Nuveli Studija o Home DNA™, kuhinjama po mjeri, materijalima, spremanju, novogradnjama i investiciji u interijer.";
const canonicalUrl = "https://nuvelistudio.com/hr/vsebine";

export const Route = createFileRoute("/hr/vsebine/")({
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
    links: [
      { rel: "canonical", href: canonicalUrl },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/vsebine" },
      { rel: "alternate", hrefLang: "hr", href: canonicalUrl },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/vsebine" },
    ],
  }),
  component: () => <AiSearchHub locale="hr" />,
});
