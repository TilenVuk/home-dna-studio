import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Reveal } from "./Reveal";

type Household = "Single person" | "Couple" | "Family" | "Family with children";
type StyleKey = "Modern minimalist" | "Classic" | "Rustic / natural" | "Luxury" | "Industrial";

const households: { key: Household; note: string }[] = [
  { key: "Single person", note: "One routine, maximum flexibility" },
  { key: "Couple", note: "Shared space, separate habits" },
  { key: "Family", note: "Multiple generations of storage" },
  { key: "Family with children", note: "Fast-changing needs" },
];

const projects = [
  "Complete home furnishing",
  "Kitchen",
  "Wardrobe",
  "Walk-in closet",
  "Bathroom furniture",
  "Living room",
];

const storageGroups: Record<string, string[]> = {
  Wardrobe: [
    "Jackets",
    "Coats",
    "Shirts",
    "Dresses",
    "Shoes",
    "Boots",
    "Bags",
    "Luggage",
    "Sports equipment",
    "Vacuum cleaner",
  ],
  Kitchen: [
    "Cook daily",
    "Pots",
    "Pans",
    "Appliances",
    "Coffee machine",
    "Wine",
    "Pantry goods",
    "Baking equipment",
  ],
  "Entry hall": ["Shoes", "Jackets", "Umbrellas", "Bags", "Children equipment"],
  Bathroom: ["Cosmetics", "Towels", "Cleaning products", "Appliances"],
};

const styles: { key: StyleKey; note: string; swatch: string[] }[] = [
  {
    key: "Modern minimalist",
    note: "Handleless, quiet, matte",
    swatch: ["var(--sand)", "var(--foreground)", "var(--oak-soft)"],
  },
  {
    key: "Classic",
    note: "Framed fronts, timeless proportion",
    swatch: ["var(--stone)", "var(--oak)", "var(--muted-foreground)"],
  },
  {
    key: "Rustic / natural",
    note: "Solid oak, visible grain",
    swatch: ["var(--oak)", "var(--oak-soft)", "var(--forest)"],
  },
  {
    key: "Luxury",
    note: "Stone, brass, deep tones",
    swatch: ["var(--forest)", "var(--oak)", "var(--foreground)"],
  },
  {
    key: "Industrial",
    note: "Steel, dark surfaces, raw edges",
    swatch: ["var(--foreground)", "var(--stone)", "var(--muted-foreground)"],
  },
];

const investments = [
  { key: "Functional", range: "8.000 – 12.000 €", lo: 8000, hi: 12000 },
  { key: "Balanced", range: "12.000 – 20.000 €", lo: 12000, hi: 20000 },
  { key: "Premium", range: "20.000 – 35.000 €", lo: 20000, hi: 35000 },
  { key: "Luxury", range: "35.000 € +", lo: 35000, hi: 60000 },
];

const STEPS = ["Household", "Project", "Storage", "Style", "Investment"];

function euro(n: number) {
  return `${Math.round(n / 500) * 500}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function HomeDna() {
  const [step, setStep] = useState(0);
  const [household, setHousehold] = useState<Household | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [storage, setStorage] = useState<string[]>([]);
  const [style, setStyle] = useState<StyleKey | null>(null);
  const [investment, setInvestment] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const activeGroups = useMemo(() => {
    if (project === "Complete home furnishing" || !project) return Object.keys(storageGroups);
    if (project === "Kitchen") return ["Kitchen"];
    if (project === "Bathroom furniture") return ["Bathroom"];
    if (project === "Living room") return ["Entry hall"];
    return ["Wardrobe", "Entry hall"];
  }, [project]);

  const toggle = (item: string) =>
    setStorage((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));

  const canContinue = [!!household, !!project, storage.length > 0, !!style, !!investment][step];

  const result = useMemo(() => {
    const inv = investments.find((i) => i.key === investment) ?? investments[1]!;
    const density = Math.min(storage.length / 14, 1);
    const lo = inv.lo + (inv.hi - inv.lo) * density * 0.35;
    const hi = inv.hi * (0.82 + density * 0.18);

    const profile =
      household === "Family with children"
        ? "Modern family home"
        : household === "Family"
          ? "Multi-generation home"
          : household === "Couple"
            ? "Shared minimal home"
            : "Compact individual home";

    const recs: string[] = [];
    if (
      storage.some((s) => ["Jackets", "Coats", "Shirts", "Dresses", "Shoes", "Boots"].includes(s))
    )
      recs.push("Optimized wardrobe system with zoned hanging heights");
    if (
      storage.some((s) =>
        ["Pots", "Pans", "Appliances", "Baking equipment", "Cook daily"].includes(s),
      )
    )
      recs.push("Kitchen with high storage capacity and deep drawer logic");
    if (storage.some((s) => ["Coffee machine", "Appliances"].includes(s)))
      recs.push("Hidden appliance storage behind pocket doors");
    if (storage.some((s) => ["Shoes", "Umbrellas", "Children equipment", "Bags"].includes(s)))
      recs.push("Custom entry solution with ventilated shoe storage");
    if (storage.some((s) => ["Luggage", "Sports equipment", "Vacuum cleaner"].includes(s)))
      recs.push("Full-height utility column for bulky items");
    if (storage.some((s) => ["Cosmetics", "Towels", "Cleaning products"].includes(s)))
      recs.push("Bathroom furniture with concealed daily-use storage");
    if (recs.length === 0) recs.push("Tailored storage plan defined after laser measurement");

    return { profile, recs: recs.slice(0, 5), lo: euro(lo), hi: euro(hi), inv };
  }, [household, storage, investment]);

  const reset = () => {
    setStep(0);
    setHousehold(null);
    setProject(null);
    setStorage([]);
    setStyle(null);
    setInvestment(null);
    setDone(false);
  };

  return (
    <section id="home-dna" className="bg-forest text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <Reveal className="max-w-[52ch]">
          <p className="eyebrow text-background/60">Our methodology</p>
          <h2 className="display-lg mt-6">Why Home DNA™ exists</h2>
          <p className="mt-6 text-base leading-relaxed text-background/75">
            Most furniture companies begin with measurements. We begin with people. Before designing
            a single cabinet, we take the time to understand how you live, what you own and how your
            home should support your everyday life. We don't ask how large your wardrobe should be.
            We ask what your wardrobe needs to hold. Because great interiors aren't measured only in
            millimetres. They're measured by how naturally they fit your life.
          </p>
        </Reveal>

        <div className="mt-14 border border-background/20 bg-background/[0.04] p-6 backdrop-blur-sm md:p-12">
          {!done ? (
            <>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      i === step ? "text-background" : "text-background/40"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 h-px w-full bg-background/20">
                <div
                  className="h-px bg-oak transition-all duration-700"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>

              <div className="mt-12 min-h-[320px]">
                {step === 0 && (
                  <Block title="Who is this home for?">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {households.map((h) => (
                        <Choice
                          key={h.key}
                          selected={household === h.key}
                          onClick={() => setHousehold(h.key)}
                          title={h.key}
                          note={h.note}
                        />
                      ))}
                    </div>
                  </Block>
                )}

                {step === 1 && (
                  <Block title="What space are we transforming?">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {projects.map((p) => (
                        <Choice
                          key={p}
                          selected={project === p}
                          onClick={() => {
                            setProject(p);
                            setStorage([]);
                          }}
                          title={p}
                        />
                      ))}
                    </div>
                  </Block>
                )}

                {step === 2 && (
                  <Block title="What needs a place in your home?">
                    <p className="-mt-4 mb-8 max-w-[54ch] text-sm text-background/60">
                      Select everything that applies. This is what turns dimensions into a plan.
                    </p>
                    <div className="grid gap-10 md:grid-cols-2">
                      {activeGroups.map((g) => (
                        <div key={g}>
                          <p className="eyebrow text-background/60">{g}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {storageGroups[g]!.map((item) => {
                              const on = storage.includes(item);
                              return (
                                <button
                                  key={g + item}
                                  type="button"
                                  onClick={() => toggle(item)}
                                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                                    on
                                      ? "border-oak bg-oak text-foreground"
                                      : "border-background/25 text-background/80 hover:border-background/60"
                                  }`}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Block>
                )}

                {step === 3 && (
                  <Block title="Which atmosphere matches your life?">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                      {styles.map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setStyle(s.key)}
                          className={`border p-5 text-left transition-all ${
                            style === s.key
                              ? "border-oak bg-background/10"
                              : "border-background/20 hover:border-background/50"
                          }`}
                        >
                          <div className="flex h-16 overflow-hidden">
                            {s.swatch.map((c, idx) => (
                              <span key={idx} className="flex-1" style={{ background: c }} />
                            ))}
                          </div>
                          <p className="mt-4 text-sm">{s.key}</p>
                          <p className="mt-1 text-xs text-background/55">{s.note}</p>
                        </button>
                      ))}
                    </div>
                  </Block>
                )}

                {step === 4 && (
                  <Block title="What level of investment feels right?">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {investments.map((inv) => (
                        <Choice
                          key={inv.key}
                          selected={investment === inv.key}
                          onClick={() => setInvestment(inv.key)}
                          title={inv.key}
                          note={inv.range}
                        />
                      ))}
                    </div>
                  </Block>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-background/20 pt-8">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-sm text-background/70 transition-opacity disabled:opacity-30"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() =>
                    step === STEPS.length - 1 ? setDone(true) : setStep((s) => s + 1)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm text-foreground transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-35"
                >
                  {step === STEPS.length - 1 ? "See your Home DNA™" : "Continue"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-background/60">This is your Home DNA™</p>
                <h3 className="display-lg mt-5">{result.profile}</h3>
                <div className="mt-8 space-y-2 text-sm text-background/70">
                  <p>Household — {household}</p>
                  <p>Project — {project}</p>
                  <p>Style — {style}</p>
                  <p>Details captured — {storage.length}</p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="eyebrow text-background/60">How we would design it</p>
                <ul className="mt-5">
                  {result.recs.map((r) => (
                    <li
                      key={r}
                      className="flex gap-4 border-t border-background/20 py-4 text-base last:border-b"
                    >
                      <Check size={16} className="mt-1 shrink-0 text-oak" />
                      {r}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <p className="eyebrow text-background/60">Estimated investment</p>
                  <p className="font-display mt-3 text-4xl tracking-[-0.03em]">
                    {result.lo} – {result.hi} €
                  </p>
                  <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-background/60">
                    This estimate is just the beginning. Because Home DNA™ starts with your life,
                    the final design is always tailored — never templated.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm text-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Request personal consultation <ArrowRight size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 text-sm text-background/60 hover:text-background"
                  >
                    <RotateCcw size={15} /> Start again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-8 text-2xl">{title}</h3>
      {children}
    </div>
  );
}

function Choice({
  title,
  note,
  selected,
  onClick,
}: {
  title: string;
  note?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border p-5 text-left transition-all ${
        selected ? "border-oak bg-background/10" : "border-background/20 hover:border-background/50"
      }`}
    >
      <span className="block text-base">{title}</span>
      {note && <span className="mt-1 block text-xs text-background/55">{note}</span>}
    </button>
  );
}
