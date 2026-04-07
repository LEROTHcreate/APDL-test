import * as React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = "actif" | "inactif" | "nouveau" | "expire" | "info" | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: Status;
  /** Affiche un petit point coloré devant le label */
  dot?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const statusStyles: Record<Status, { bg: string; text: string; dot: string; ring: string }> = {
  actif: {
    bg:   "bg-[#F0FDF4]",
    text: "text-[#15803D]",
    dot:  "bg-[#16A34A]",
    ring: "ring-[#BBF7D0]",
  },
  inactif: {
    bg:   "bg-[#F8FAFC]",
    text: "text-[#64748B]",
    dot:  "bg-[#94A3B8]",
    ring: "ring-[#E2E8F0]",
  },
  nouveau: {
    bg:   "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    dot:  "bg-[#3B82F6]",
    ring: "ring-[#BFDBFE]",
  },
  expire: {
    bg:   "bg-[#FFF7ED]",
    text: "text-[#C2410C]",
    dot:  "bg-[#EA580C]",
    ring: "ring-[#FED7AA]",
  },
  info: {
    bg:   "bg-[#F0F9FF]",
    text: "text-[#0369A1]",
    dot:  "bg-[#0284C7]",
    ring: "ring-[#BAE6FD]",
  },
  warning: {
    bg:   "bg-[#FFFBEB]",
    text: "text-[#92400E]",
    dot:  "bg-[#D97706]",
    ring: "ring-[#FDE68A]",
  },
};

const statusLabels: Record<Status, string> = {
  actif:   "Actif",
  inactif: "Inactif",
  nouveau: "Nouveau",
  expire:  "Expiré",
  info:    "Info",
  warning: "Attention",
};

// ── Composant ─────────────────────────────────────────────────────────────────

export function Badge({ status = "info", dot = true, children, className, ...props }: BadgeProps) {
  const s = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-[var(--radius-pill)]",
        "px-2.5 py-0.5",
        "text-xs font-medium",
        "ring-1",
        s.bg,
        s.text,
        s.ring,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("inline-block w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot)}
          aria-hidden="true"
        />
      )}
      {children ?? statusLabels[status]}
    </span>
  );
}
