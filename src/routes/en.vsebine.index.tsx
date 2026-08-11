import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Interior & Custom Furniture Guides | Nuveli Studio";
const description =
  "Practical Nuveli Studio guides to Home DNA™, custom kitchens, materials, storage, new builds and interior investment planning.";
const canonicalUrl = "https://nuvelistudio.com/en/vsebine";

export const Route = createFileRoute("/en/vsebine/")({
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
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "en", href: canonicalUrl },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/vsebine" },
    ],
  }),
  component: () => <AiSearchHub locale="en" />,
});
