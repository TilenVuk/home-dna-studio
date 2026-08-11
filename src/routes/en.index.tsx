import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLanding } from "@/components/nuveli/LocalizedLanding";

const title = "Nuveli Studio — bespoke interiors and Home DNA™";
const description = "Nuveli Studio designs complete interiors and custom furniture around your lifestyle, needs and investment range.";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nuvelistudio.com/en/" },
    ],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/en/" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/" },
    ],
  }),
  component: () => <LocalizedLanding locale="en" />,
});
