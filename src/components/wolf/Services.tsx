import { services } from "@/content/site";
import { Reveal } from "./Reveal";
import { ChefHat, Shirt, Sofa, Home } from "lucide-react";

const icons = [ChefHat, Shirt, Sofa, Home];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <Reveal>
        <p className="eyebrow">What we make</p>
        <h2 className="display-lg mt-6 max-w-[20ch]">Complete interior solutions</h2>
      </Reveal>

      <div className="mt-16 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal
              key={s.title}
              delay={i * 80}
              className="bg-background p-8 transition-colors duration-500 hover:bg-sand md:p-10"
            >
              <Icon size={22} strokeWidth={1.4} className="text-forest" />
              <h3 className="mt-14 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
