import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/nuveli/SiteNav";
import { Hero } from "@/components/nuveli/Hero";
import { Concept } from "@/components/nuveli/Concept";
import { Process } from "@/components/nuveli/Process";
import { Services } from "@/components/nuveli/Services";
import { Gallery } from "@/components/nuveli/Gallery";
import { Journey } from "@/components/nuveli/Journey";
import { AiSearchQuestions } from "@/components/nuveli/AiSearchQuestions";
import { Contact } from "@/components/nuveli/Contact";
import { Footer } from "@/components/nuveli/Footer";
import { canonicalUrl, hreflangLinks } from "@/lib/i18n";

const title = "Notranje oblikovanje in pohištvo po meri | Nuveli Studio";
const description =
  "Notranje oblikovanje za novogradnje in prenove: kuhinje, garderobe in pohištvo po meri. S Home DNA™ načrt prilagodimo vašim navadam in proračunu.";
const canonical = canonicalUrl("sl");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }, ...hreflangLinks()],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "InteriorDesigner",
          name: "Nuveli Studio",
          url: canonical,
          description,
          areaServed: "Slovenija",
          address: { "@type": "PostalAddress", addressLocality: "Ljubljana", addressCountry: "SI" },
          email: "info@nuvelistudio.com",
          telephone: "+386 40 287 587",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen scroll-smooth bg-background">
      <SiteNav />
      <main>
        <Hero />
        <Concept />
        <Process />
        <Services />
        <Gallery />
        <Journey />
        <Contact />
        <AiSearchQuestions />
      </main>
      <Footer />
    </div>
  );
}
