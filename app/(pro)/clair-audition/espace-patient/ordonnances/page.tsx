import Link from "next/link";

const ordonnances = [
  {
    type: "Appareils auditifs",
    date: "18 novembre 2024",
    validUntil: "Novembre 2028",
    praticien: "M. Rami Benali",
    role: "Audioprothésiste",
    centre: "Clair Audition – Marseille Prado",
    od: { perte: "40–60 dB", appareil: "Phonak Audéo Lumity L90-R", classe: "Classe II" },
    og: { perte: "38–55 dB", appareil: "Phonak Audéo Lumity L90-L", classe: "Classe II" },
    notes: "Appareillage binaural recommandé. Contrôle à 1 mois, 3 mois puis annuel.",
    locked: false,
  },
  {
    type: "Appareils auditifs",
    date: "20 mars 2023",
    validUntil: "Mars 2027",
    praticien: "Mme Fatima Kaddour",
    role: "Audioprothésiste",
    centre: "Clair Audition – Aix Centre",
    od: { perte: "30–55 dB", appareil: "Appareillage recommandé", classe: "Classe II" },
    og: { perte: "28–52 dB", appareil: "Appareillage recommandé", classe: "Classe II" },
    notes: "Première prescription. Essai de 30 jours préconisé avant validation définitive.",
    locked: true,
  },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-200 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default function OrdonnancesAuditionPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 h-title">Ordonnances</h1>
        <p className="mt-1 text-sm text-slate-500">Vos prescriptions d'appareillage auditif</p>
      </div>

      <div className="space-y-5">
        {ordonnances.map((o, i) => (
          <div key={i} className="rounded-[1.25rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 p-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-slate-800">{o.type}</span>
                  <span className="inline-flex items-center rounded-[999px] bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-[#00C98A]">
                    Valide jusqu'en {o.validUntil}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500">{o.date} · {o.centre}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-sm text-slate-500">{o.praticien}</span>
                  <span className="inline-flex items-center rounded-[999px] bg-slate-50 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">{o.role}</span>
                </div>
              </div>
            </div>

            {!o.locked ? (
              <div className="p-6 grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#00C98A] uppercase tracking-wide mb-2">Oreille droite (OD)</div>
                  <div className="rounded-[0.75rem] bg-slate-50 border border-slate-200 p-3">
                    <Row label="Perte auditive" value={o.od.perte} />
                    <Row label="Appareil prescrit" value={o.od.appareil} />
                    <Row label="Classe" value={o.od.classe} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00C98A] uppercase tracking-wide mb-2">Oreille gauche (OG)</div>
                  <div className="rounded-[0.75rem] bg-slate-50 border border-slate-200 p-3">
                    <Row label="Perte auditive" value={o.og.perte} />
                    <Row label="Appareil prescrit" value={o.og.appareil} />
                    <Row label="Classe" value={o.og.classe} />
                  </div>
                </div>
                <div className="md:col-span-2 rounded-[0.75rem] bg-slate-50 border border-slate-200 p-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes · </span>
                  <span className="text-xs text-slate-500">{o.notes}</span>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="relative rounded-[0.75rem] border border-slate-200 overflow-hidden">
                  <div className="blur-sm pointer-events-none select-none p-4 grid grid-cols-2 gap-3">
                    <div className="h-20 bg-slate-50 rounded-[0.75rem]" />
                    <div className="h-20 bg-slate-50 rounded-[0.75rem]" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                    <svg className="w-7 h-7 text-slate-500 mb-2" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <p className="text-sm font-medium text-slate-800">Document verrouillé</p>
                    <Link href="/clair-audition/espace-patient/achats" className="mt-2 rounded-[999px] bg-[#00C98A] text-white px-4 py-1.5 text-xs font-semibold hover:bg-[#00A872] transition-colors">
                      Déverrouiller
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-3">
              <button className="text-sm font-medium text-[#00C98A] hover:text-[#00C98A]-alt transition-colors">Voir le PDF</button>
              <span className="text-slate-300">·</span>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Télécharger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
