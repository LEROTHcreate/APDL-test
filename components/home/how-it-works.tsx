import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    n: "01",
    title: "Prenez rendez-vous",
    desc: "En ligne, en 2 minutes. Choisissez votre centre, votre spécialité et le créneau qui vous convient.",
    cta: { label: "Réserver maintenant", href: "/rendez-vous" },
    accent: "#2D8CFF",
    accentBg: "#EFF6FF",
    accentBorder: "rgba(45,140,255,0.18)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
  },
  {
    n: "02",
    title: "Consultez un expert",
    desc: "Optométriste ou audioprothésiste dédié, équipements de dernière génération, bilan détaillé.",
    cta: null,
    accent: "#8B5CF6",
    accentBg: "#F5F3FF",
    accentBorder: "rgba(139,92,246,0.18)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"/>
        <path d="M17 11l1.5 1.5L21 10"/>
      </svg>
    ),
  },
  {
    n: "03",
    title: "Suivez votre santé",
    desc: "Accédez à votre espace patient : ordonnances, bilans, appareils, prochains RDV — tout à portée de main.",
    cta: { label: "Créer mon espace", href: "/connexion" },
    accent: "#00C98A",
    accentBg: "#ECFDF5",
    accentBorder: "rgba(0,201,138,0.18)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12s4-8 9-8 9 8 9 8-4 8-9 8-9-8-9-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-[1240px] px-6">

        <Reveal>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500 mb-4">
              Simple &amp; rapide
            </span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-800 h-title">
              Votre parcours de soin,{" "}
              <span className="font-semibold">en 3 étapes</span>
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm leading-[1.75]">
              De la prise de rendez-vous au suivi dans votre espace personnel — tout est pensé pour être simple.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, idx) => (
            <Reveal key={step.n} delay={80 + idx * 80}>
              <div
                className="relative flex flex-col h-full rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  border: `1px solid ${step.accentBorder}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                }}
              >
                {/* Number */}
                <div
                  className="absolute -top-3 left-7 text-[11px] font-black tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: step.accentBg, color: step.accent, border: `1px solid ${step.accentBorder}` }}
                >
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: step.accentBg, color: step.accent }}
                  aria-hidden="true"
                >
                  {step.icon}
                </div>

                <h3 className="text-base font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-[1.75] flex-1">{step.desc}</p>

                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                    style={{ color: step.accent }}
                  >
                    {step.cta.label}
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Connector line — desktop */}
        <div className="hidden md:flex items-center justify-center mt-8 gap-0">
          <div className="flex-1 max-w-[220px] h-px" style={{ background: "linear-gradient(to right, transparent, rgba(45,140,255,0.25))" }} />
          <div className="mx-4 text-xs text-slate-400 font-medium">puis</div>
          <div className="flex-1 max-w-[220px] h-px" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.25), rgba(0,201,138,0.25))" }} />
          <div className="mx-4 text-xs text-slate-400 font-medium">et enfin</div>
          <div className="flex-1 max-w-[220px] h-px" style={{ background: "linear-gradient(to right, rgba(0,201,138,0.25), transparent)" }} />
        </div>

      </div>
    </section>
  );
}
