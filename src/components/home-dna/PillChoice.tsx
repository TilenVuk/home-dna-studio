import { Check } from "lucide-react";

export function PillChoice({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onSelect}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-6 py-3 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        selected
          ? "border-foreground bg-primary text-primary-foreground"
          : "border-border bg-transparent text-foreground hover:border-foreground/40"
      }`}
    >
      {selected && <Check size={14} aria-hidden="true" />}
      {label}
    </button>
  );
}
