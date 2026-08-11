import { brand } from "@/content/site";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";

export function Footer({ locale = "sl" }: { locale?: Locale }) {
  const t = getSiteCopy(locale).footer;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-medium tracking-[-0.04em]">NUVELI</span>
            <span className="eyebrow">Studio</span>
          </p>
          <p className="mt-2 max-w-[34ch] text-sm text-muted-foreground">
            {t.text} {t.address}.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:items-end">
          <a href={`mailto:${brand.email}`} className="transition-colors hover:text-foreground">
            {brand.email}
          </a>
          <a
            href={`tel:${brand.phone.replace(/\s/g, "")}`}
            className="transition-colors hover:text-foreground"
          >
            {brand.phone}
          </a>
          <p className="eyebrow mt-4">© {new Date().getFullYear()} Nuveli Studio</p>
        </div>
      </div>
    </footer>
  );
}
