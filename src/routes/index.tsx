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

const title = "Nuveli Studio — metodologija interjerja Home DNA™";
const description =
  "Nuveli Studio oblikuje celovite interierje po meri. Home DNA™ prilagodi prostor vašemu življenjskemu slogu, navadam in potrebam.";
const canonicalUrl = "https://nuvelistudio.com/";

export const Route = createFileRoute("/")({
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
      { rel: "alternate", hrefLang: "hr", href: "https://nuvelistudio.com/hr/" },
      { rel: "alternate", hrefLang: "en", href: "https://nuvelistudio.com/en/" },
      { rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "InteriorDesigner",
          name: "Nuveli Studio",
          url: canonicalUrl,
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
