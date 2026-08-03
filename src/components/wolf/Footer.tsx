import { brand } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl tracking-[-0.04em]">WOLF STUDIO</p>
          <p className="mt-2 max-w-[34ch] text-sm text-muted-foreground">
            Homes designed around the way you live. {brand.address}.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:items-end">
          <a href={`mailto:${brand.email}`} className="transition-colors hover:text-foreground">
            {brand.email}
          </a>
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-foreground">
            {brand.phone}
          </a>
          <p className="eyebrow mt-4">© {new Date().getFullYear()} Wolf Studio</p>
        </div>
      </div>
    </footer>
  );
}
