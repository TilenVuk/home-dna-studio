import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/wolf/SiteNav";
import { Hero } from "@/components/wolf/Hero";
import { Concept } from "@/components/wolf/Concept";
import { Process } from "@/components/wolf/Process";
import { HomeDna } from "@/components/wolf/HomeDna";
import { Services } from "@/components/wolf/Services";
import { Gallery } from "@/components/wolf/Gallery";
import { Journey } from "@/components/wolf/Journey";
import { Contact } from "@/components/wolf/Contact";
import { Footer } from "@/components/wolf/Footer";

const title = "Wolf Studio — Custom Interiors Designed Around Your Life";
const description =
  "Wolf Studio designs custom kitchens, wardrobes and complete home interiors in Slovenia using the Home DNA™ method — furniture built around how you live.";

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
          areaServed: "Slovenia",
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
        <HomeDna />
        <Services />
        <Gallery />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
