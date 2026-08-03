import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/wolf/SiteNav";
import { Hero } from "@/components/wolf/Hero";
import { Concept } from "@/components/wolf/Concept";
import { Process } from "@/components/wolf/Process";

import { Services } from "@/components/wolf/Services";
import { Gallery } from "@/components/wolf/Gallery";
import { Journey } from "@/components/wolf/Journey";
import { Contact } from "@/components/wolf/Contact";
import { Footer } from "@/components/wolf/Footer";

const title = "Wolf Studio — metodologija interjerja Home DNA™";
const description =
  "Wolf Studio oblikuje domove okoli načina, kako ljudje živijo. Home DNA™ je naša metodologija za razumevanje življenjskega sloga, navad in stvari, preden karkoli oblikujemo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "InteriorDesigner",
          name: "Wolf Studio",
          description,
          areaServed: "Slovenija",
          address: { "@type": "PostalAddress", addressLocality: "Ljubljana", addressCountry: "SI" },
          email: "studio@wolfstudio.si",
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
