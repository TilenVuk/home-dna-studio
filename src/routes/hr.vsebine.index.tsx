import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Vodiči za dizajn interijera i namještaj po mjeri — Nuveli Studio";
const description =
  "Praktični vodiči Nuveli Studija o Home DNA™, kuhinjama po mjeri, materijalima, spremanju, novogradnjama i investiciji u interijer.";

export const Route = createFileRoute("/hr/vsebine/")({
  head: () => ({
    meta: [{ title }, { name: "description", content: description }],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/vsebine" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/vsebine" },
    ],
  }),
  component: () => <AiSearchHub locale="hr" />,
});
