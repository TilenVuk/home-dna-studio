import { useEffect, useRef, type ReactNode } from "react";

export function ScreenShell({
  screenKey,
  headline,
  support,
  eyebrow,
  children,
}: {
  screenKey: string;
  headline: string;
  support?: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [screenKey]);

  return (
    <div
      key={screenKey}
      className="animate-[hd-enter_260ms_ease-out] motion-reduce:animate-none"
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`display-lg max-w-[20ch] focus:outline-none ${eyebrow ? "mt-6" : ""}`}
      >
        {headline}
      </h1>
      {support && (
        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          {support}
        </p>
      )}
      {children}
    </div>
  );
}
