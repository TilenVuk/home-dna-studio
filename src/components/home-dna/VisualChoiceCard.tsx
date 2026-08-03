import { Check } from "lucide-react";

export function VisualChoiceCard({
  image,
  title,
  description,
  selected,
  onSelect,
  multiSelect = false,
}: {
  image: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  multiSelect?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role={multiSelect ? "checkbox" : "radio"}
      aria-checked={selected}
      aria-label={`${title} — ${description}`}
      className={`group block min-h-12 w-full border text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        selected ? "border-foreground" : "border-border hover:border-foreground/40"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
            selected ? "bg-foreground/25 opacity-100" : "opacity-0"
          }`}
        />
        {selected && (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground"
          >
            <Check size={14} />
          </span>
        )}
      </div>
      <div className="px-5 py-5">
        <p className="font-display text-base tracking-[-0.02em]">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
