"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";

const cities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Nantes"];

const CENTRES = [
  {
    name: "THOR — Marseille Prado",
    address: "210A Rue Paradis",
    city: "Marseille",
    cp: "13006",
    phone: "04 91 00 00 01",
    types: ["vision", "audition"] as const,
    badge: "Siège régional",
  },
  {
    name: "THOR — Marseille Vieux-Port",
    address: "3 Quai du Port",
    city: "Marseille",
    cp: "13002",
    phone: "04 91 00 00 02",
    types: ["vision"] as const,
    badge: null,
  },
  {
    name: "THOR — Paris 8",
    address: "22 Rue du Faubourg Saint-Honoré",
    city: "Paris",
    cp: "75008",
    phone: "01 40 00 00 04",
    types: ["vision", "audition"] as const,
    badge: null,
  },
  {
    name: "THOR — Lyon Presqu'île",
    address: "14 Place Bellecour",
    city: "Lyon",
    cp: "69002",
    phone: "04 72 00 00 05",
    types: ["vision", "audition"] as const,
    badge: null,
  },
  {
    name: "THOR — Bordeaux Centre",
    address: "8 Rue Sainte-Catherine",
    city: "Bordeaux",
    cp: "33000",
    phone: "05 56 00 00 06",
    types: ["audition"] as const,
    badge: null,
  },
  {
    name: "THOR — Aix-en-Provence",
    address: "15 Cours Mirabeau",
    city: "Aix-en-Provence",
    cp: "13100",
    phone: "04 42 00 00 03",
    types: ["vision"] as const,
    badge: null,
  },
];

const TYPE_LABEL: Record<"vision" | "audition", { label: string; color: string; bg: string }> = {
  vision:   { label: "Optique",   color: "#2D8CFF", bg: "rgba(45,140,255,0.10)" },
  audition: { label: "Audition",  color: "#00C98A", bg: "rgba(0,201,138,0.10)" },
};

export function CentresPreview() {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const filtered = activeCity
    ? CENTRES.filter(c => c.city === activeCity)
    : CENTRES.slice(0, 4);

  return (
    <section id="nos-centres" className="py-20 md:py-24 scroll-mt-28 bg-white">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

          {/* LEFT */}
          <Reveal className="h-full">
            <div className="h-full flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 self-start rounded-[var(--radius-pill)] border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500">
                Réseau national
              </span>

              <h2 className="mt-5 text-2xl md:text-4xl font-light tracking-tight text-slate-800 h-title">
                Un centre <span className="font-semibold">près de chez vous</span>
              </h2>

              <p className="mt-3 max-w-md text-sm text-slate-500 leading-[1.7]">
                Avec plus de 25 centres en France, nos experts sont toujours proches
                de vous pour vous accompagner en optique et en audition.
              </p>

              {/* Filtres villes */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCity(null)}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium transition-colors duration-200 border ${
                    activeCity === null
                      ? "border-[#2D8CFF] bg-[#EFF6FF] text-[#2D8CFF]"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#BFDBFE] hover:text-[#2D8CFF] hover:bg-[#EFF6FF]"
                  }`}
                >
                  Tous
                </button>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCity(activeCity === c ? null : c)}
                    className={`inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium transition-colors duration-200 border ${
                      activeCity === c
                        ? "border-[#2D8CFF] bg-[#EFF6FF] text-[#2D8CFF]"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#BFDBFE] hover:text-[#2D8CFF] hover:bg-[#EFF6FF]"
                    }`}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {c}
                  </button>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/nos-centres"
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold text-white
                    bg-[#2D8CFF]
                    shadow-[0_4px_16px_rgba(45,140,255,0.28)]
                    transition-all duration-200
                    hover:bg-[#1A72E8] hover:shadow-[0_6px_24px_rgba(45,140,255,0.38)] hover:scale-[1.02]
                  "
                >
                  Voir tous les centres →
                </Link>

                <Link
                  href="/rendez-vous"
                  className="
                    inline-flex items-center justify-center
                    rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold
                    border border-slate-200 text-slate-800
                    bg-slate-50 hover:bg-white hover:shadow-[var(--shadow-soft)]
                    transition-all duration-200
                  "
                >
                  Prendre rendez-vous
                </Link>
              </div>

              {/* Indicateurs */}
              <div className="mt-8 flex gap-6">
                <div>
                  <div className="text-2xl font-semibold text-slate-800 h-title">25+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Centres</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-2xl font-semibold text-slate-800 h-title">2</div>
                  <div className="text-xs text-slate-500 mt-0.5">Spécialités</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                  <div className="text-2xl font-semibold text-slate-800 h-title">6j/7</div>
                  <div className="text-xs text-slate-500 mt-0.5">Ouvert</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Annuaire centres */}
          <Reveal delay={200} className="h-full">
            <div
              className="rounded-[var(--radius-large)] overflow-hidden"
              style={{
                background: "rgba(248,250,252,0.9)",
                border: "1px solid rgba(226,232,240,0.8)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Nos centres</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {activeCity ? `${CENTRES.filter(c => c.city === activeCity).length} centre(s) à ${activeCity}` : `${CENTRES.length} centres affichés`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2D8CFF]" />
                    <span className="text-[11px] text-slate-500 font-medium">Optique</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00C98A]" />
                    <span className="text-[11px] text-slate-500 font-medium">Audition</span>
                  </div>
                </div>
              </div>

              {/* Liste */}
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-400">
                    Aucun centre pour cette ville.
                  </div>
                ) : (
                  filtered.map((centre) => (
                    <div key={centre.name} className="px-5 py-4 bg-white hover:bg-slate-50 transition-colors duration-150">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800 truncate">{centre.name}</span>
                            {centre.badge && (
                              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2D8CFF]">
                                {centre.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {centre.address}, {centre.cp} {centre.city}
                          </div>
                          <a
                            href={`tel:${centre.phone.replace(/ /g, "")}`}
                            className="text-xs font-medium text-[#2D8CFF] hover:underline mt-0.5 block"
                          >
                            {centre.phone}
                          </a>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {centre.types.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                              style={{ color: TYPE_LABEL[t].color, background: TYPE_LABEL[t].bg }}
                            >
                              {TYPE_LABEL[t].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                <span className="text-xs text-slate-400">Et {25 - CENTRES.length}+ centres dans toute la France</span>
                <Link href="/nos-centres" className="text-xs font-semibold text-[#2D8CFF] hover:underline">
                  Voir la carte →
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

export default CentresPreview;
