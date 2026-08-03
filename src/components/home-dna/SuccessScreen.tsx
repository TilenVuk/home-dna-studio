import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import { HomeDnaReport } from "./HomeDnaReport";
import type { HomeDnaState } from "./homeDnaTypes";

export function SuccessScreen({ name, state }: { name?: string; state: HomeDnaState }) {
  return (
    <>
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="order-2 lg:order-1 lg:col-span-6">
        <p className="eyebrow">Home DNA™</p>
        <h1 className="display-lg mt-6 max-w-[20ch]">
          {name ? `Hvala, ${name}.` : "Hvala."} Vaš Home DNA™ je zabeležen.
        </h1>
        <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
          Vaš osebni Home DNA™ Report je v pripravi. Naša ekipa pregleda vaše odgovore in vam v
          nekaj delovnih dneh pošlje analizo doma, oblikovalske smernice in okvirno oceno tipične
          investicije.
        </p>

        <ul className="mt-10">
          {[
            "Pregled vaših odgovorov s strani oblikovalca",
            "Osebni Home DNA™ Report po e-pošti",
            "Predlog naslednjih korakov za vaš projekt",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-4 border-t border-border py-4 text-sm last:border-b"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-oak" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-muted-foreground">
          Če želite, se lahko pogovorimo že prej.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            hash="contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Rezerviraj spletno svetovanje
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/"
            hash="contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-sm transition-colors duration-300 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Rezerviraj obisk na domu
          </Link>
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-6">
        <img
          src={heroInterior}
          alt="Miren sodoben interier z izdelano hrastovo opremo"
          width={1920}
          height={1200}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover md:aspect-[4/3] lg:aspect-[4/5]"
        />
      </div>
    </div>
  );
}
