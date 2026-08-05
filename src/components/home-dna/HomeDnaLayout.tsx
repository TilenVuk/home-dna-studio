import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { HomeDnaProgress } from "./HomeDnaProgress";

export function HomeDnaLayout({ progress, children }: { progress: number; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 bg-background/90 backdrop-blur-xl">
        <HomeDnaProgress value={progress} />
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-medium tracking-[-0.04em]">NUVELI</span>
            <span className="eyebrow">Studio</span>
          </Link>
          <Link
            to="/"
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Zapri
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
        {children}
      </main>
    </div>
  );
}
