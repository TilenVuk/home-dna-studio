import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Interior design and custom furniture guides — Nuveli Studio";
const description =
  "Practical Nuveli Studio guides to Home DNA™, custom kitchens, materials, storage, new builds and interior investment planning.";

export const Route = createFileRoute("/en/vsebine/")({
  head: () => ({
    meta: [{ title }, { name: "description", content: description }],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/vsebine" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/vsebine" },
    ],
  }),
  component: () => <AiSearchHub locale="en" />,
});
