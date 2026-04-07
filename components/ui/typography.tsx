import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ── Heading ───────────────────────────────────────────────────────────────────

type HeadingLevel   = "h1" | "h2" | "h3" | "h4" | "h5";
type HeadingVariant = "default" | "gradient-vision" | "gradient-audition" | "muted";
type Brand          = "vision" | "audition";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?:   HeadingLevel;
  variant?: HeadingVariant;
}

const levelStyles: Record<HeadingLevel, string> = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-light  tracking-tight leading-[1.1]",
  h2: "text-3xl md:text-4xl              font-light  tracking-tight leading-[1.15]",
  h3: "text-2xl md:text-3xl              font-normal tracking-tight leading-[1.2]",
  h4: "text-xl  md:text-2xl              font-medium tracking-tight leading-snug",
  h5: "text-lg                            font-medium                leading-snug",
};

const headingVariantStyles: Record<HeadingVariant, string> = {
  default:           "text-thor-text",
  muted:             "text-thor-muted",
  "gradient-vision": "gradient-vision-text",
  "gradient-audition": "gradient-audition-text",
};

export function Heading({
  level   = "h2",
  variant = "default",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = level;

  return (
    <Tag
      className={cn(
        "h-title",
        levelStyles[level],
        headingVariantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ── Text ──────────────────────────────────────────────────────────────────────

type TextVariant = "body" | "caption" | "label" | "muted" | "code";
type TextAs      = "p" | "span" | "div" | "strong" | "em" | "small";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?:      TextAs;
}

const textVariantStyles: Record<TextVariant, string> = {
  body:    "text-[15px] text-thor-text    leading-[1.7]",
  caption: "text-xs     text-thor-muted   leading-relaxed",
  label:   "text-sm     text-thor-text    font-medium   tracking-[0.05em] uppercase",
  muted:   "text-sm     text-thor-muted   leading-relaxed",
  code:    "text-[13px] font-mono bg-thor-surface-2 text-thor-text px-1.5 py-0.5 rounded-[var(--radius-sharp)]",
};

export function Text({
  variant  = "body",
  as: Tag  = "p",
  className,
  children,
  ...props
}: TextProps) {
  const T = Tag as React.ElementType;
  return (
    <T
      className={cn(textVariantStyles[variant], className)}
      {...props}
    >
      {children}
    </T>
  );
}
