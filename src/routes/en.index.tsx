import { createFileRoute } from "@tanstack/react-router";
import { LocalizedLanding } from "@/components/nuveli/LocalizedLanding";
import { canonicalUrl, hreflangLinks } from "@/lib/i18n";

const title = "Nuveli Studio — bespoke interiors and Home DNA™";
const description =
  "Nuveli Studio designs complete interiors and custom furniture around your lifestyle, needs and investment range.";

const canonical = canonicalUrl("en");

export const Route = createFileRoute("/en/")({
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
  component: () => <LocalizedLanding locale="en" />,
});
