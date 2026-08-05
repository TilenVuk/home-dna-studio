import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/nuveli/SiteNav";
import { Hero } from "@/components/nuveli/Hero";
import { Concept } from "@/components/nuveli/Concept";
import { Process } from "@/components/nuveli/Process";

import { Services } from "@/components/nuveli/Services";
import { Gallery } from "@/components/nuveli/Gallery";
import { Journey } from "@/components/nuveli/Journey";
import { Contact } from "@/components/nuveli/Contact";
import { Footer } from "@/components/nuveli/Footer";

const title = "Nuveli Studio — metodologija interjerja Home DNA™";
const description =
  "Nuveli Studio oblikuje domove okoli načina, kako ljudje živijo. Home DNA™ je naša metodologija za razumevanje življenjskega sloga, navad in stvari, preden karkoli oblikujemo.";
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
    links: [{ rel: "canonical", href: canonicalUrl }],
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
          email: "studio@nuvelistudio.com",
          telephone: "+386 41 000 000",
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
      </main>
      <Footer />
    </div>
  );
}
