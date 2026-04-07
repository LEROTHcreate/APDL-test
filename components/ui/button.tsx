"use client";

import * as React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand    = "thor" | "vision" | "audition";
type Variant  = "primary" | "ghost" | "outline" | "subtle" | "danger";
type Size     = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  brand?:    Brand;
  loading?:  boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?:  boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Couleurs par brand
const brandTokens: Record<Brand, {
  primaryBg:     string;
  primaryHover:  string;
  primaryShadow: string;
  primaryRing:   string;
  outlineBorder: string;
  outlineText:   string;
  outlineHover:  string;
  subtleBg:      string;
  subtleText:    string;
  subtleHover:   string;
  focusRing:     string;
}> = {
  thor: {
    primaryBg:     "bg-thor-accent",
    primaryHover:  "hover:bg-[#1E2A3A]",
    primaryShadow: "shadow-[0_4px_16px_rgba(11,18,32,0.20)] hover:shadow-[0_6px_24px_rgba(11,18,32,0.28)]",
    primaryRing:   "ring-1 ring-black/10",
    outlineBorder: "border-thor-border",
    outlineText:   "text-thor-text",
    outlineHover:  "hover:bg-thor-surface-2",
    subtleBg:      "bg-thor-surface-2",
    subtleText:    "text-thor-text",
    subtleHover:   "hover:bg-thor-border",
    focusRing:     "focus-visible:ring-thor-accent/40",
  },
  vision: {
    primaryBg:     "bg-vision-accent",
    primaryHover:  "hover:bg-[#1A72E8]",
    primaryShadow: "shadow-[0_4px_16px_rgba(45,140,255,0.28)] hover:shadow-[0_6px_24px_rgba(45,140,255,0.38)]",
    primaryRing:   "ring-1 ring-white/20",
    outlineBorder: "border-vision-border",
    outlineText:   "text-vision-accent",
    outlineHover:  "hover:bg-vision-bg",
    subtleBg:      "bg-vision-bg",
    subtleText:    "text-vision-accent",
    subtleHover:   "hover:bg-[#DCEEFF]",
    focusRing:     "focus-visible:ring-vision-accent/40",
  },
  audition: {
    primaryBg:     "bg-audition-accent",
    primaryHover:  "hover:bg-[#00A872]",
    primaryShadow: "shadow-[0_4px_16px_rgba(0,201,138,0.28)] hover:shadow-[0_6px_24px_rgba(0,201,138,0.38)]",
    primaryRing:   "ring-1 ring-white/20",
    outlineBorder: "border-audition-border",
    outlineText:   "text-audition-accent",
    outlineHover:  "hover:bg-audition-bg",
    subtleBg:      "bg-audition-bg",
    subtleText:    "text-audition-accent",
    subtleHover:   "hover:bg-[#CCFAEB]",
    focusRing:     "focus-visible:ring-audition-accent/40",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8  px-3.5 text-xs  gap-1.5 rounded-[var(--radius-soft)]",
  md: "h-10 px-5   text-sm  gap-2   rounded-[var(--radius-soft)]",
  lg: "h-12 px-7   text-base gap-2.5 rounded-[var(--radius-large)]",
};

// ── Spinner inline ─────────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Composant ─────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      brand    = "vision",
      loading  = false,
      iconLeft,
      iconRight,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const t  = brandTokens[brand];
    const sz = sizeClasses[size];
    const isDisabled = disabled || loading;

    // Classes communes
    const base = cn(
      "inline-flex items-center justify-center font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      t.focusRing,
      "select-none cursor-pointer",
      "active:scale-[0.97]",
      sz,
      isDisabled && "opacity-50 pointer-events-none",
    );

    // Classes par variante
    const variantClass: Record<Variant, string> = {
      primary: cn(
        t.primaryBg,
        "text-white",
        t.primaryHover,
        t.primaryShadow,
        t.primaryRing,
        "hover:scale-[1.02]",
      ),
      ghost: cn(
        "bg-transparent",
        t.outlineText,
        "hover:bg-thor-surface-2",
      ),
      outline: cn(
        "bg-transparent border",
        t.outlineBorder,
        t.outlineText,
        t.outlineHover,
      ),
      subtle: cn(
        t.subtleBg,
        t.subtleText,
        t.subtleHover,
      ),
      danger: cn(
        "bg-danger text-white",
        "hover:bg-[#B91C1C]",
        "shadow-[0_4px_16px_rgba(220,38,38,0.20)]",
        "hover:scale-[1.02]",
      ),
    };

    const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(base, variantClass[variant], className)}
        {...props}
      >
        {loading ? (
          <Spinner className={iconSize} />
        ) : (
          iconLeft && <span className={iconSize}>{iconLeft}</span>
        )}

        {children}

        {!loading && iconRight && (
          <span className={iconSize}>{iconRight}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
