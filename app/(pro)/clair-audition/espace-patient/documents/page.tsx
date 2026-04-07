"use client";

import { useState } from "react";
import Link from "next/link";

const docs = [
  { id: 1, title: "Audiogramme — Novembre 2024",      type: "Bilan",     date: "18 nov. 2024", size: "156 KB", locked: false },
  { id: 2, title: "Compte-rendu bilan auditif",        type: "Bilan",     date: "18 nov. 2024", size: "210 KB", locked: false },
  { id: 3, title: "Ordonnance appareillage — Nov 2024",type: "Ordonnance",date: "18 nov. 2024", size: "88 KB",  locked: false },
  { id: 4, title: "Facture appareillage",              type: "Admin",     date: "18 nov. 2024", size: "76 KB",  locked: true  },
  { id: 5, title: "Rapport réglage — Contrôle 1 mois", type: "Suivi",    date: "12 avr. 2024", size: "134 KB", locked: false },
  { id: 6, title: "Audiogramme — Mars 2023",           type: "Bilan",     date: "20 mar. 2023", size: "148 KB", locked: true  },
  { id: 7, title: "Ordonnance appareillage — Mar 2023",type: "Ordonnance",date: "20 mar. 2023", size: "92 KB",  locked: true  },
];

const types = ["Tous", "Bilan", "Ordonnance", "Suivi", "Admin"];

export default function DocumentsAuditionPage() {
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = docs.filter((d) => {
    const matchType = filter === "Tous" || d.type === filter;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 h-title">Documents</h1>
        <p className="mt-1 text-sm text-slate-500">Tous vos fichiers médicaux et administratifs</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Rechercher un document…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-[0.75rem] border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:border-[#00C98A] focus:ring-2 focus:ring-[#00C98A/20] transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-[999px] px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                filter === t
                  ? "bg-[#00C98A] text-white shadow-[0_2px_8px_rgba(0,201,138,0.25)]"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-[#00C98A] hover:border-[#00C98A]/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-2.5">
        {filtered.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between gap-4 rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.75rem] bg-slate-50 ring-1 ring-slate-200 text-xs font-bold text-[#00C98A] flex-shrink-0">
                PDF
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">{doc.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{doc.date}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{doc.size}</span>
                  <span className="inline-flex items-center rounded-[999px] bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-[#00C98A]">
                    {doc.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {!doc.locked ? (
                <>
                  <button className="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-[#00C98A] transition-colors">Voir</button>
                  <button className="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-[#00C98A] transition-colors">↓</button>
                </>
              ) : (
                <Link href="/clair-audition/espace-patient/achats" className="rounded-[0.75rem] border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#00C98A] hover:bg-[#00C98A] hover:text-white transition-all duration-200">
                  Déverrouiller
                </Link>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">Aucun document trouvé.</p>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-[0.75rem] border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500">
        {docs.filter(d => d.locked).length} document(s) verrouillé(s). <Link href="/clair-audition/espace-patient/achats" className="text-[#00C98A] font-medium hover:underline">Accéder à la boutique →</Link>
      </div>
    </div>
  );
}
