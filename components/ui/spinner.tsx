import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Brand = "thor" | "vision" | "audition";
type SpinnerSize = "xs" | "sm" | "md" | "lg";

const brandColor: Record<Brand, string> = {
  thor:     "text-thor-accent",
  vision:   "text-vision-accent",
  audition: "text-audition-accent",
};

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export interface SpinnerProps {
  brand?:     Brand;
  size?:      SpinnerSize;
  className?: string;
  label?:     string;
}

export function Spinner({
  brand     = "vision",
  size      = "md",
  className,
  label     = "Chargement…",
}: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <svg
        className={cn("animate-spin", brandColor[brand], spinnerSizes[size], className)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hauteur explicite (ex: "h-4", "h-10") — sinon utiliser className */
  h?: string;
  /** Largeur explicite (ex: "w-full", "w-32") */
  w?: string;
  rounded?: "soft" | "large" | "pill" | "none";
}

const roundedMap = {
  soft:  "rounded-[var(--radius-soft)]",
  large: "rounded-[var(--radius-large)]",
  pill:  "rounded-[var(--radius-pill)]",
  none:  "rounded-none",
};

export function Skeleton({ h, w, rounded = "soft", className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        roundedMap[rounded],
        h ?? "h-4",
        w ?? "w-full",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

export interface DividerProps {
  label?:     string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return (
      <hr className={cn("border-0 border-t border-thor-border my-6", className)} />
    );
  }

  return (
    <div className={cn("flex items-center gap-3 my-6", className)}>
      <span className="flex-1 border-t border-thor-border" />
      <span className="text-xs text-thor-muted font-medium whitespace-nowrap px-1">
        {label}
      </span>
      <span className="flex-1 border-t border-thor-border" />
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?:       string;
  alt?:       string;
  initials?:  string;
  brand?:     Brand;
  size?:      AvatarSize;
  className?: string;
}

const avatarSizes: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6  h-6",  text: "text-[9px]"  },
  sm: { container: "w-8  h-8",  text: "text-xs"     },
  md: { container: "w-10 h-10", text: "text-sm"     },
  lg: { container: "w-12 h-12", text: "text-base"   },
  xl: { container: "w-16 h-16", text: "text-lg"     },
};

const avatarBrandRing: Record<Brand, string> = {
  thor:     "ring-thor-accent/30",
  vision:   "ring-vision-accent/40",
  audition: "ring-audition-accent/40",
};

const avatarBrandBg: Record<Brand, string> = {
  thor:     "bg-thor-surface-2 text-thor-text",
  vision:   "bg-vision-bg text-vision-accent",
  audition: "bg-audition-bg text-audition-accent",
};

export function Avatar({
  src,
  alt       = "",
  initials,
  brand     = "vision",
  size      = "md",
  className,
}: AvatarProps) {
  const sz = avatarSizes[size];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        "rounded-full ring-2 overflow-hidden flex-shrink-0",
        sz.container,
        avatarBrandRing[brand],
        !src && avatarBrandBg[brand],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className={cn("font-semibold select-none", sz.text)}>
          {initials ?? "?"}
        </span>
      )}
    </div>
  );
}
