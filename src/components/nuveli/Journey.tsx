import { journey, benefits } from "@/content/site";
import { Reveal } from "./Reveal";

export function Journey() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">Pot</p>
            <h2 className="display-lg mt-6 max-w-[14ch]">
              Od prvega pogovora do vsakdanjega življenja
            </h2>
            <p className="mt-8 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              En studio, ena ekipa, eno razumevanje vašega doma — skozi vse faze.
            </p>
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {journey.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 60}
              as="li"
              className="border-t border-border py-7 last:border-b"
            >
              <div className="flex gap-8">
                <span className="font-display text-sm text-oak">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="mt-28 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((b, i) => (
          <Reveal key={b.title} delay={i * 80} className="bg-background py-10 pr-8">
            <h3 className="text-lg">{b.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
