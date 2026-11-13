import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLanding } from "@/components/nuveli/LocalizedLanding";
import { canonicalUrl, hreflangLinks } from "@/lib/i18n";

const title = "Nuveli Studio — interijeri po mjeri i Home DNA™";
const description =
  "Nuveli Studio projektira cjelovite interijere i namještaj po mjeri prema vašem načinu života, potrebama i investicijskom okviru.";

const canonical = canonicalUrl("hr");

export const Route = createFileRoute("/hr/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
    ],
    links: [{ rel: "canonical", href: canonical }, ...hreflangLinks()],
  }),
  component: () => <LocalizedLanding locale="hr" />,
});
