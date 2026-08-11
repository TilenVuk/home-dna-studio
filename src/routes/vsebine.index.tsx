import { createFileRoute } from "@tanstack/react-router";
import { AiSearchHub } from "@/components/content/AiSearchHub";

const title = "Vodiči za notranje oblikovanje in pohištvo po meri — Nuveli Studio";
const description = "Praktični vodiči Nuveli Studio o Home DNA™, kuhinjah po meri, materialih, shranjevanju, novogradnjah in investiciji v interier.";

export const Route = createFileRoute("/vsebine/")({
  head: () => ({
    meta: [{ title }, { name: "description", content: description }],
    links: [
      { rel: "canonical", href: "https://nuvelistudio.com/vsebine" },
      { rel: "alternate", hrefLang: "sl", href: "https://nuvelistudio.com/vsebine" },
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/vsebine" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/vsebine" },
      { rel: "alternate", hrefLang: "x-default", href: "https://nuvelistudio.com/vsebine" },
    ],
  }),
  component: () => <AiSearchHub locale="sl" />,
});
