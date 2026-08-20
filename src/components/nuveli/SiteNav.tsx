import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
    { label: t.nav.contact, href: "#contact" },
    { label: t.nav.content, href: `${prefix}/vsebine` },
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
          ? "border-b border-border bg-background/85 text-foreground backdrop-blur-xl"
          : "border-b border-transparent text-background"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-medium tracking-[-0.04em]">NUVELI</span>
          <span className={`eyebrow ${scrolled ? "text-muted-foreground" : "text-background/80"}`}>
            Studio
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={`${l.href}-${l.label}`}
              href={l.href}
              className={`text-[13px] transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-background/80 hover:text-background"
              }`}
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-1 text-[11px]" aria-label={t.nav.language}>
            {(["sl", "hr", "en"] as const).map((target) => {
              const href = target === "sl" ? "/" : `/${target}/`;
              return target === locale ? (
                <span
                  key={target}
                  aria-current="page"
                  className={`rounded-full border px-2.5 py-1.5 font-medium shadow-sm transition-colors ${
                    scrolled
                      ? "border-foreground bg-foreground text-background"
                      : "border-background/90 bg-background/95 text-foreground"
                  }`}
                >
                  {target.toUpperCase()}
                </span>
              ) : (
                <a
                  key={target}
                  href={href}
                  hrefLang={target}
                  className={`rounded-full border px-2.5 py-1.5 font-medium shadow-sm backdrop-blur-md transition-colors ${
                    scrolled
                      ? "border-border text-foreground hover:border-foreground"
                      : "border-background/80 bg-foreground/70 text-background hover:bg-background hover:text-foreground"
                  }`}
                >
                  {target.toUpperCase()}
                </a>
              );
            })}
          </div>
          <a
            href={`${prefix}/home-dna`}
            className={`rounded-full bg-primary px-5 py-2.5 text-[13px] text-primary-foreground transition-all duration-300 hover:opacity-85 ${
              scrolled ? "invisible opacity-0" : "opacity-100"
            }`}
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

      <a
        href={`${prefix}/home-dna`}
        className={`fixed bottom-5 left-4 right-4 z-[60] inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground shadow-[0_12px_35px_rgba(20,25,21,0.24)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,25,21,0.3)] sm:bottom-8 sm:left-auto sm:right-8 sm:min-h-14 sm:px-7 sm:text-base ${
          scrolled && !open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {t.nav.cta}
        <ArrowUpRight className="shrink-0" size={18} />
      </a>
    </header>
  );
}
