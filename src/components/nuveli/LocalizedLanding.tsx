import type { Locale } from "@/lib/i18n";
import { SiteNav } from "./SiteNav";
import { Hero } from "./Hero";
import { Concept } from "./Concept";
import { Process } from "./Process";
import { Services } from "./Services";
import { Gallery } from "./Gallery";
import { Journey } from "./Journey";
import { AiSearchQuestions } from "./AiSearchQuestions";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

export function LocalizedLanding({ locale }: { locale: Exclude<Locale, "sl"> }) {
  return (
    <div className="min-h-screen scroll-smooth bg-background">
      <SiteNav locale={locale} />
      <main>
        <Hero locale={locale} />
        <Concept locale={locale} />
        <Process locale={locale} />
        <Services locale={locale} />
        <Gallery locale={locale} />
        <Journey locale={locale} />
        <AiSearchQuestions locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
