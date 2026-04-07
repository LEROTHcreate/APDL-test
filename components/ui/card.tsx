import * as React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand   = "thor" | "vision" | "audition";
type Variant = "default" | "elevated" | "interactive" | "highlight";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  brand?:   Brand;
  /** Retire le padding par défaut (ex: pour les cartes avec image pleine largeur) */
  noPadding?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const brandBorder: Record<Brand, string> = {
  thor:     "border-thor-border",
  vision:   "border-vision-border",
  audition: "border-audition-border",
};

const brandHighlight: Record<Brand, string> = {
  thor:     "border-thor-accent/30  shadow-[0_0_0_1px_rgba(11,18,32,0.12),0_8px_32px_rgba(11,18,32,0.10)]",
  vision:   "border-vision-accent/40 shadow-[0_0_0_1px_rgba(45,140,255,0.20),0_8px_32px_rgba(45,140,255,0.12)]",
  audition: "border-audition-accent/40 shadow-[0_0_0_1px_rgba(0,201,138,0.20),0_8px_32px_rgba(0,201,138,0.12)]",
};

const brandInteractiveHover: Record<Brand, string> = {
  thor:     "hover:border-thor-accent/20 hover:shadow-[0_8px_32px_rgba(11,18,32,0.12)]",
  vision:   "hover:border-vision-accent/30 hover:shadow-[0_8px_32px_rgba(45,140,255,0.14)]",
  audition: "hover:border-audition-accent/30 hover:shadow-[0_8px_32px_rgba(0,201,138,0.14)]",
};

// ── Composant principal ───────────────────────────────────────────────────────

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant   = "default",
      brand     = "thor",
      noPadding = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const base = cn(
      "rounded-[var(--radius-large)] bg-thor-surface border",
      !noPadding && "p-6",
    );

    const variantClass: Record<Variant, string> = {
      default: cn(
        brandBorder[brand],
        "shadow-[var(--shadow-soft)]",
      ),
      elevated: cn(
        brandBorder[brand],
        "shadow-[var(--shadow-card)]",
      ),
      interactive: cn(
        brandBorder[brand],
        "shadow-[var(--shadow-soft)]",
        "transition-all duration-200 ease-out cursor-pointer",
        "hover:-translate-y-0.5 hover:scale-[1.005]",
        brandInteractiveHover[brand],
      ),
      highlight: cn(
        brandHighlight[brand],
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(base, variantClass[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// ── Sous-composants ───────────────────────────────────────────────────────────

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-semibold text-thor-text leading-snug", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-thor-muted leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 pt-4 border-t border-thor-border mt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
