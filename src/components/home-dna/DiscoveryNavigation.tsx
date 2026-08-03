import { ArrowLeft, ArrowRight } from "lucide-react";

export function DiscoveryNavigation({
  onBack,
  onNext,
  nextLabel = "Naprej",
  backLabel = "Nazaj",
  nextDisabled = false,
  showNext = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showNext?: boolean;
}) {
  return (
    <div className="mt-14 flex flex-col-reverse gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-12 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>
      ) : (
        <span />
      )}

      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none sm:w-auto"
        >
          {nextLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
