import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Vodiči za interier in pohištvo po meri | Nuveli Studio";
const description =
  "Praktični vodiči Nuveli Studio o Home DNA™, kuhinjah po meri, materialih, shranjevanju, novogradnjah in investiciji v interier.";
const canonicalUrl = "https://nuvelistudio.com/vsebine";

export const Route = createFileRoute("/vsebine/")({
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
      { rel: "alternate", hrefLang: "sl", href: canonicalUrl },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
    ],
  }),
  component: () => <AiSearchHub locale="sl" />,
});
