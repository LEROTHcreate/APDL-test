import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

export default function Button({
  children,
  className,
  variant = "primary",
  href,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300";
  const styles: Record<Variant, string> = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 shadow-sm shadow-sky-600/10",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const cls = cn(base, styles[variant], className);

  if (href) return <Link href={href} className={cls}>{children}</Link>;

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
