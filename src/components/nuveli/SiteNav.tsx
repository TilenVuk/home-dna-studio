import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/content/site";
import { getSiteCopy } from "@/content/siteLocalized";
import type { Locale } from "@/lib/i18n";

export function SiteNav({ locale = "sl" }: { locale?: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = getSiteCopy(locale);
  const prefix = locale === "sl" ? "" : `/${locale}`;
  const links = [
    { label: t.nav.concept, href: "#concept" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.content, href: `${prefix}/vsebine` },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-medium tracking-[-0.04em]">NUVELI</span>
          <span className="eyebrow">Studio</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={`${l.href}-${l.label}`}
              href={l.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-1 text-[11px]" aria-label={t.nav.language}>
            {(["sl", "hr", "en"] as const).map((target) => {
              const href = target === "sl" ? "/" : `/${target}/`;
              return target === locale ? (
                <span key={target} className="rounded-full border border-foreground px-2.5 py-1.5">
                  {target.toUpperCase()}
                </span>
              ) : (
                <a
                  key={target}
                  href={href}
                  hrefLang={target}
                  className="rounded-full border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
                >
                  {target.toUpperCase()}
                </a>
              );
            })}
          </div>
          <a
            href={`${prefix}/home-dna`}
            className="rounded-full bg-primary px-5 py-2.5 text-[13px] text-primary-foreground transition-opacity hover:opacity-85"
          >
            {t.nav.cta}
          </a>
        </div>

        <button aria-label={t.nav.menu} onClick={() => setOpen((v) => !v)} className="lg:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 pb-8 pt-4 lg:hidden">
          {links.map((l) => (
            <a
              key={`${l.href}-${l.label}`}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="my-4 flex gap-2 text-xs" aria-label={t.nav.language}>
            {(["sl", "hr", "en"] as const).map((target) => {
              const href = target === "sl" ? "/" : `/${target}/`;
              return target === locale ? (
                <span key={target} className="rounded-full border border-foreground px-3 py-2">
                  {target.toUpperCase()}
                </span>
              ) : (
                <a
                  key={target}
                  href={href}
                  hrefLang={target}
                  className="rounded-full border border-border px-3 py-2"
                >
                  {target.toUpperCase()}
                </a>
              );
            })}
          </div>
          <a
            href={`${prefix}/home-dna`}
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-primary px-5 py-3 text-center text-[15px] text-primary-foreground transition-opacity hover:opacity-85"
          >
            {t.nav.cta}
          </a>
          <p className="eyebrow mt-6">{brand.email}</p>
        </div>
      )}
    </header>
  );
}
