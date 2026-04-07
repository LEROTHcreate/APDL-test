"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** délai en ms (ex: <Reveal delay={120} /> ) */
  delay?: number;
  /** compat si jamais tu l’utilises ailleurs */
  delayMs?: number;
};

export function Reveal({ children, className, delay, delayMs }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  const d = delay ?? delayMs ?? 0;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in={inView ? "true" : "false"}
      style={{ transitionDelay: `${d}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
