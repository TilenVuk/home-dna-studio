import kitchen from "@/assets/project-kitchen.jpg";
import closet from "@/assets/project-closet.jpg";
import living from "@/assets/project-living.jpg";
import hall from "@/assets/project-hall.jpg";
import { Reveal } from "./Reveal";

const projects = [
  {
    src: kitchen,
    w: 1200,
    h: 1500,
    title: "Villa Šmarna",
    meta: "Kuhinja, oblikovana za petčlansko družino",
    span: "lg:col-span-5 lg:row-span-2",
    ratio: "aspect-[4/5]",
  },
  {
    src: living,
    w: 1200,
    h: 900,
    title: "Stanovanje Vič",
    meta: "Dnevni prostor, oblikovan za družinsko življenje",
    span: "lg:col-span-7",
    ratio: "aspect-[4/3]",
  },
  {
    src: closet,
    w: 1200,
    h: 900,
    title: "Hiša Bled",
    meta: "Garderoba, optimizirana za sezonska oblačila",
    span: "lg:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: hall,
    w: 1200,
    h: 1500,
    title: "Penthouse Center",
    meta: "Skrito shranjevanje v vhodu za vsakodnevni red",
    span: "lg:col-span-3",
    ratio: "aspect-[4/3]",
  },
];

export function Gallery() {
  return (
    <section id="projects" className="bg-secondary">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Domovi, ki smo jih razumeli</p>
            <h2 className="display-lg mt-6 max-w-[18ch]">Življenja, prevedena v prostor</h2>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Vsak projekt se je začel enako: pri ljudeh, ki v njem živijo.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className={p.span}>
              <figure className="group">
                <div className={`overflow-hidden ${p.ratio}`}>
                  <img
                    src={p.src}
                    alt={`${p.title} — ${p.meta}`}
                    loading="lazy"
                    width={p.w}
                    height={p.h}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="text-base">{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.meta}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
