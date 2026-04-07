"use client";

import { useState } from "react";
import Link from "next/link";

const dossiers = [
  { id: "1", name: "Marie Leblanc",  dob: "12/03/1985", type: "Examen complet",       date: "Aujourd'hui",   status: "Terminé",    praticien: "Dr. Martin" },
  { id: "2", name: "Paul Renaud",    dob: "05/07/1972", type: "Adaptation lentilles",  date: "Aujourd'hui",   status: "En cours",   praticien: "Dr. Martin" },
  { id: "3", name: "Isabelle Morel", dob: "22/11/1990", type: "Contrôle annuel",       date: "Hier",          status: "À compléter",praticien: "Dr. Martin" },
  { id: "4", name: "Lucas Bernard",  dob: "08/01/2010", type: "Bilan enfant",           date: "22 mar. 2026",  status: "Terminé",    praticien: "Dr. Martin" },
  { id: "5", name: "Sophie Duval",   dob: "17/09/1968", type: "Renouvellement",        date: "20 mar. 2026",  status: "Terminé",    praticien: "Dr. Martin" },
];

const statusColor: Record<string, string> = {
  "Terminé":      "bg-[#F0FDF4] text-[#15803D] ring-[#BBF7D0]",
  "En cours":     "bg-vision-bg text-vision-accent ring-vision-border",
  "À compléter":  "bg-warning-bg text-warning ring-[#FDE68A]",
};

const types = ["Tous", "Examen complet", "Lentilles", "Contrôle", "Renouvellement", "Bilan"];

export default function DossiersOptiquePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");

  const filtered = dossiers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || d.type.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-vision-text h-title">Dossiers Optique</h1>
          <p className="mt-1 text-sm text-vision-muted">Bilans, renouvellements, devis et suivis</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-vision-accent text-white px-5 py-2.5 text-sm font-semibold shadow-[0_4px_12px_rgba(45,140,255,0.28)] hover:bg-[#1A72E8] transition-all duration-200">
          + Nouveau dossier
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher un patient ou un dossier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-[var(--radius-soft)] border border-vision-border bg-white px-4 py-2.5 text-sm text-vision-text placeholder:text-vision-muted outline-none focus:border-vision-accent focus:ring-2 focus:ring-vision-accent/20 transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-[var(--radius-pill)] px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                filter === t
                  ? "bg-vision-accent text-white shadow-[0_2px_8px_rgba(45,140,255,0.25)]"
                  : "bg-white border border-vision-border text-vision-muted hover:text-vision-accent hover:border-vision-accent/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-large)] border border-vision-border bg-white shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_160px_120px_100px_80px] gap-4 px-6 py-3 border-b border-vision-border bg-vision-bg text-xs font-semibold uppercase tracking-wide text-vision-muted">
          <span>Patient</span>
          <span>Type</span>
          <span>Prestation</span>
          <span>Date</span>
          <span>Statut</span>
          <span></span>
        </div>

        <div className="divide-y divide-vision-border">
          {filtered.map((d) => (
            <div key={d.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_160px_120px_100px_80px] gap-2 sm:gap-4 px-6 py-4 hover:bg-vision-bg/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-vision-bg border border-vision-border flex items-center justify-center text-xs font-semibold text-vision-accent flex-shrink-0">
                  {d.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-vision-text">{d.name}</div>
                  <div className="text-xs text-vision-muted">Né·e le {d.dob}</div>
                </div>
              </div>
              <div className="text-xs text-vision-muted flex items-center">{d.praticien}</div>
              <div className="text-sm text-vision-text flex items-center">{d.type}</div>
              <div className="text-xs text-vision-muted flex items-center">{d.date}</div>
              <div className="flex items-center">
                <span className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${statusColor[d.status]}`}>
                  {d.status}
                </span>
              </div>
              <div className="flex items-center">
                <Link href={`/clair-vision/pro/optique/dossiers/${d.id}`} className="text-xs font-medium text-vision-accent hover:underline">
                  Ouvrir →
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-vision-muted">Aucun dossier trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
