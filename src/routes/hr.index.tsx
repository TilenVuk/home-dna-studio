import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLanding } from "@/components/nuveli/LocalizedLanding";

const title = "Nuveli Studio — interijeri po mjeri i Home DNA™";
const description =
  "Nuveli Studio projektira cjelovite interijere i namještaj po mjeri prema vašem načinu života, potrebama i investicijskom okviru.";

export const Route = createFileRoute("/hr/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nuvelistudio.com/hr/" },
    ],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/hr/" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/" },
    ],
  }),
  component: () => <LocalizedLanding locale="hr" />,
});
