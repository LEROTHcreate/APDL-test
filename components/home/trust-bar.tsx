import { Reveal } from "@/components/ui/reveal";

const BADGES = [
  {
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <path d="M10 2L3 5v5c0 4.418 3.134 8.55 7 9.95C16.866 18.55 20 14.418 20 10V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Hébergement certifié HDS",
    sub: "Données de santé sécurisées",
    accent: "#2D8CFF",
    bg: "#EFF6FF",
    border: "rgba(45,140,255,0.20)",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 7h8M6 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="13" r="2.5" fill="currentColor" opacity="0.25"/>
        <circle cx="15" cy="13" r="1" fill="currentColor"/>
      </svg>
    ),
    label: "Partenaire GIE SESAM-Vitale",
    sub: "Tiers payant intégré",
    accent: "#00C98A",
    bg: "#ECFDF5",
    border: "rgba(0,201,138,0.20)",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "100% Santé",
    sub: "Classe A · Reste à charge nul",
    accent: "#059669",
    bg: "#F0FDF4",
    border: "rgba(5,150,105,0.20)",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.4l-4.33 2.1.83-4.82L3 7.27l4.91-.71L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    label: "4,9 / 5 — 2 000+ avis",
    sub: "Patients satisfaits",
    accent: "#D97706",
    bg: "#FFFBEB",
    border: "rgba(217,119,6,0.20)",
  },
];

export function TrustBar() {
  return (
    <section className="bg-white border-b border-slate-100 py-6">
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: b.bg,
                  border: `1px solid ${b.border}`,
                }}
              >
                <div className="shrink-0" style={{ color: b.accent }} aria-hidden="true">
                  {b.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{b.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
