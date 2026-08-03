export function HomeDnaProgress({ value }: { value: number }) {
  return (
    <div
      className="h-px w-full bg-border"
      role="progressbar"
      aria-label="Napredek Home DNA™ Discovery"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-valuetext="Napredek raziskave"
    >
      <div
        className="h-px bg-foreground transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
