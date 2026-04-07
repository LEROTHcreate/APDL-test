"use client";

import { useState } from "react";

const ACCENT = "#00C98A";
const ACCENT_DARK = "#00A574";

/* ── Audiogramme (même style que le bilan auditif) ────────────────────────── */
const LABELS = ["250", "500", "1k", "2k", "4k", "8k"];
const OD_DB  = [20, 35, 50, 65, 75, 80];
const OG_DB  = [25, 40, 55, 60, 70, 85];

function Audiogram() {
  const VW = 1200, VH = 160;
  const L = 36, R = 16, T = 10, B = 26;
  const iW = VW - L - R;
  const iH = VH - T - B;

  const x = (i: number) => L + (i / (LABELS.length - 1)) * iW;
  const y = (db: number) => T + (db / 100) * iH;

  const zones = [
    { from: 0,  to: 20,  fill: "rgba(22,163,74,0.06)"  },
    { from: 20, to: 40,  fill: "rgba(234,179,8,0.07)"  },
    { from: 40, to: 65,  fill: "rgba(249,115,22,0.07)" },
    { from: 65, to: 100, fill: "rgba(239,68,68,0.07)"  },
  ];

  const odLine = OD_DB.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ogLine = OG_DB.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const odFill = `${odLine} L${x(5).toFixed(1)},${(T + iH).toFixed(1)} L${x(0).toFixed(1)},${(T + iH).toFixed(1)} Z`;
  const ogFill = `${ogLine} L${x(5).toFixed(1)},${(T + iH).toFixed(1)} L${x(0).toFixed(1)},${(T + iH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="pGradOD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="pGradOG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D8CFF" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#2D8CFF" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {zones.map((z, i) => (
        <rect key={i} x={L} y={y(z.from)} width={iW} height={y(z.to) - y(z.from)} fill={z.fill} />
      ))}

      {[0, 20, 40, 60, 80, 100].map((db) => (
        <g key={db}>
          <line x1={L} y1={y(db)} x2={L + iW} y2={y(db)} stroke="rgba(0,0,0,0.06)" strokeWidth="1"
            strokeDasharray={db === 0 ? "none" : "4,3"} />
          <text x={L - 6} y={y(db) + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="system-ui">{db}</text>
        </g>
      ))}

      {LABELS.map((_, i) => (
        <line key={i} x1={x(i)} y1={T} x2={x(i)} y2={T + iH} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
      ))}

      <path d={odFill} fill="url(#pGradOD)" />
      <path d={ogFill} fill="url(#pGradOG)" />
      <path d={odLine} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={ogLine} fill="none" stroke="#2D8CFF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {OD_DB.map((v, i) => {
        const cx = x(i), cy = y(v), s = 5;
        return (
          <g key={`od${i}`}>
            <circle cx={cx} cy={cy} r="9" fill="rgba(239,68,68,0.08)" />
            <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <line x1={cx + s} y1={cy - s} x2={cx - s} y2={cy + s} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      })}

      {OG_DB.map((v, i) => (
        <g key={`og${i}`}>
          <circle cx={x(i)} cy={y(v)} r="9" fill="rgba(45,140,255,0.08)" />
          <circle cx={x(i)} cy={y(v)} r="4.5" fill="white" stroke="#2D8CFF" strokeWidth="2" />
        </g>
      ))}

      {LABELS.map((l, i) => (
        <text key={l} x={x(i)} y={VH - 10} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">{l}</text>
      ))}
      <text x={L + iW / 2} y={VH - 1} textAnchor="middle" fontSize="8.5" fill="#cbd5e1" fontFamily="system-ui">Hz</text>
      <text x={8} y={T + iH / 2} textAnchor="middle" fontSize="8.5" fill="#cbd5e1" fontFamily="system-ui"
        transform={`rotate(-90, 8, ${T + iH / 2})`}>dB HL</text>

      <g transform={`translate(${L + iW - 108}, ${T + 6})`}>
        <rect x="-8" y="-6" width="116" height="32" rx="6" fill="white" fillOpacity="0.90" />
        <line x1="0" y1="6" x2="14" y2="6" stroke="#ef4444" strokeWidth="1.6" />
        <line x1="4" y1="2" x2="10" y2="10" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="10" y1="2" x2="4" y2="10" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
        <text x="18" y="10" fontSize="9" fill="#475569" fontWeight="600" fontFamily="system-ui">OD — Oreille droite</text>
        <line x1="0" y1="22" x2="14" y2="22" stroke="#2D8CFF" strokeWidth="1.6" />
        <circle cx="7" cy="22" r="4" fill="white" stroke="#2D8CFF" strokeWidth="1.6" />
        <text x="18" y="26" fontSize="9" fill="#475569" fontWeight="600" fontFamily="system-ui">OG — Oreille gauche</text>
      </g>
    </svg>
  );
}

/* ── Aperçu Bilan auditif ──────────────────────────────────────────────────── */
function PreviewBilan() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-white select-none"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100"
        style={{ background: `linear-gradient(90deg,${ACCENT}10,#fff)` }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: ACCENT }}>CA</div>
          <div>
            <div className="text-[11px] font-bold text-slate-700">Clair Audition</div>
            <div className="text-[9px] text-slate-400">Audioprothésiste agréé</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-slate-500">12 novembre 2024</div>
          <div className="text-[9px] text-slate-400 mt-0.5">Réf. CA-2024-0318</div>
        </div>
      </div>

      <div className="px-5 py-3">
        <div className="text-[13px] font-bold mb-0.5" style={{ color: ACCENT }}>BILAN AUDITIF</div>
        <div className="text-[10px] text-slate-500 mb-3">Patient : Mme Martin Claire &nbsp;·&nbsp; née le 04/07/1962</div>

        {/* Audiogramme — même style que le tableau de bord */}
        <div className="rounded-lg border border-slate-100 bg-slate-50 mb-3 px-1 pt-1">
          <Audiogram />
        </div>

        {/* Diagnostic */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: "Type de perte", value: "Perceptive" },
            { label: "Degré moyen",   value: "Modéré (52 dB)" },
            { label: "Configuration", value: "Descendante" },
            { label: "OMS",           value: "Classe 2" },
          ].map((row, i) => (
            <div key={i} className="rounded-md px-2 py-1.5"
              style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff", border: "1px solid #f1f5f9" }}>
              <div className="text-[8px] text-slate-400">{row.label}</div>
              <div className="text-[10px] font-semibold text-slate-700">{row.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <div className="text-[9px] text-slate-400">Validité : 5 ans &nbsp;·&nbsp; Dr. Moreau L.</div>
          <div className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: ACCENT }}>PDF signé</div>
        </div>
      </div>
    </div>
  );
}

/* ── Aperçu Dossier complet audition ──────────────────────────────────────── */
function PreviewDossier() {
  const docs = [
    { label: "Bilan auditif complet",  date: "12 nov. 2024",  color: ACCENT,    icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" },
    { label: "Ordonnance appareillage", date: "14 nov. 2024",  color: "#2D8CFF", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" },
    { label: "Compte-rendu praticien",  date: "14 nov. 2024",  color: "#f59e0b", icon: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { label: "Historique suivi",        date: "2022 – 2024",   color: "#8b5cf6", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" },
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-white select-none"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

      {/* Cover */}
      <div className="px-5 py-4 border-b border-slate-100"
        style={{ background: "linear-gradient(135deg,#f0fdf9,#f8fafc)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: ACCENT }}>CA</div>
          <div className="text-[11px] font-bold text-slate-700">Clair Audition</div>
        </div>
        <div className="text-[13px] font-bold text-slate-800">Dossier Médical Complet</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Mme Martin Claire &nbsp;·&nbsp; Suivi depuis janvier 2022</div>
      </div>

      {/* Liste documents */}
      <div className="px-5 py-3 space-y-2">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contenu du dossier</div>
        {docs.map((d, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ background: d.color + "15" }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2" strokeLinecap="round">
                <path d={d.icon} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-slate-700 truncate">{d.label}</div>
            </div>
            <div className="text-[9px] text-slate-400 shrink-0">{d.date}</div>
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-3 flex items-center gap-2">
        <div className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: "#8b5cf6" }}>4 documents</div>
        <div className="text-[9px] text-slate-400">PDF professionnel · Accès permanent</div>
      </div>
    </div>
  );
}

/* ── Modal paiement ────────────────────────────────────────────────────────── */
function PayModal({ product, onClose, onSuccess }: {
  product: { name: string; price: string };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  function handlePay() {
    setStep("success");
    setTimeout(() => { onSuccess(); onClose(); }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {step === "success" ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: ACCENT + "15" }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">Paiement confirmé</div>
            <div className="text-sm text-slate-400">Document déverrouillé avec succès</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <div className="text-sm font-bold text-slate-800">{product.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Paiement sécurisé · Accès permanent</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold" style={{ color: ACCENT }}>{product.price}</div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Numéro de carte</label>
                <input value={num} onChange={e => setNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                  style={{ fontFamily: "monospace" }}
                  onFocus={e => e.target.style.borderColor = ACCENT}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Expiration</label>
                  <input value={exp} onChange={e => setExp(e.target.value)} placeholder="MM / AA"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                    onFocus={e => e.target.style.borderColor = ACCENT}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">CVC</label>
                  <input value={cvc} onChange={e => setCvc(e.target.value.slice(0,3))} placeholder="123"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                    onFocus={e => e.target.style.borderColor = ACCENT}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>
              <button onClick={handlePay}
                className="w-full rounded-xl py-3 text-sm font-bold text-white mt-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, boxShadow: `0 4px 16px ${ACCENT}40` }}>
                Payer {product.price}
              </button>
              <div className="flex items-center justify-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Chiffré SSL
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  Simulation uniquement
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Date d'éligibilité (appareils auditifs 100% Santé : 4 ans) ───────────── */
// Appareillage : nov. 2022 → éligible : nov. 2026
// Alerte J-14 : 29 oct. 2026  |  Alerte J0 : 12 nov. 2026
const ELIGIBLE_DATE  = new Date("2026-11-12");
const ALERT_DATE     = new Date("2026-10-29");  // 2 semaines avant
const ALERT_DATE_J0  = new Date("2026-11-12");  // le jour même

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
function daysUntil(d: Date) {
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

/* ── Modal alerte renouvellement ───────────────────────────────────────────── */
function AlerteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "pay" | "success">("form");
  const [cardNum, setCardNum] = useState("");

  function handleNext() { if (!email.includes("@")) return; setStep("pay"); }
  function handlePay() {
    setStep("success");
    setTimeout(() => { onSuccess(email); onClose(); }, 2200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {step === "success" ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: ACCENT + "15" }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="text-base font-bold text-slate-800 mb-1">Alerte activée !</div>
            <div className="text-sm text-slate-400">Vous serez prévenu par email le {formatDate(ALERT_DATE)}</div>
          </div>
        ) : step === "form" ? (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <div className="text-sm font-bold text-slate-800">Alerte renouvellement</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Abonnement annuel · résiliable à tout moment</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold" style={{ color: ACCENT }}>0,99 €/an</div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed space-y-1"
                style={{ background: ACCENT + "0d", border: `1px solid ${ACCENT}25` }}>
                <div>Vous recevrez <strong>2 emails</strong> :</div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                  <strong>{formatDate(ALERT_DATE)}</strong> — 2 semaines avant votre renouvellement
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                  <strong>{formatDate(ALERT_DATE_J0)}</strong> — le jour même
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Adresse email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="claire.martin@email.com" type="email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                  onFocus={e => e.target.style.borderColor = ACCENT}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <button onClick={handleNext} disabled={!email.includes("@")}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, boxShadow: `0 4px 16px ${ACCENT}40` }}>
                Continuer vers le paiement →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <div className="text-sm font-bold text-slate-800">Alerte renouvellement</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Paiement sécurisé · 0,99 €/an</div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Numéro de carte</label>
                <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                  style={{ fontFamily: "monospace" }}
                  onFocus={e => e.target.style.borderColor = ACCENT}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Expiration</label>
                  <input placeholder="MM / AA"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                    onFocus={e => e.target.style.borderColor = ACCENT}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">CVC</label>
                  <input placeholder="123"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all"
                    onFocus={e => e.target.style.borderColor = ACCENT}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              </div>
              <button onClick={handlePay}
                className="w-full rounded-xl py-3 text-sm font-bold text-white mt-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, boxShadow: `0 4px 16px ${ACCENT}40` }}>
                Payer 0,99 € / an
              </button>
              <div className="text-center text-[10px] text-slate-400 pt-1">
                Résiliable à tout moment depuis votre espace patient
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function AchatsAuditionPage() {
  const [modal, setModal] = useState<null | { name: string; price: string; key: string }>(null);
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [alerte, setAlerte] = useState<{ active: boolean; email: string } | null>(null);
  const [alerteModal, setAlerteModal] = useState(false);

  if (typeof window !== "undefined" && alerte === null) {
    try {
      const raw = localStorage.getItem("ca_alerte");
      if (raw) setAlerte(JSON.parse(raw));
    } catch { /* ignore */ }
  }

  function handleAlerteSuccess(email: string) {
    const data = { active: true, email, since: new Date().toISOString(), eligibleDate: ELIGIBLE_DATE.toISOString(), alertDate: ALERT_DATE.toISOString() };
    setAlerte({ active: true, email });
    try { localStorage.setItem("ca_alerte", JSON.stringify(data)); } catch { /* ignore */ }
  }

  function handleAlerteCancel() {
    setAlerte(null);
    try { localStorage.removeItem("ca_alerte"); } catch { /* ignore */ }
  }

  function handleSuccess(key: string) {
    setUnlocked(prev => ({ ...prev, [key]: true }));
    try {
      const raw = localStorage.getItem("ca_unlocked") ?? "{}";
      const data = JSON.parse(raw) as Record<string, boolean>;
      data[key] = true;
      localStorage.setItem("ca_unlocked", JSON.stringify(data));
    } catch { /* ignore */ }
  }

  const products = [
    {
      key: "doc",
      name: "Document unitaire",
      price: "1,90 €",
      tag: "Bilan, ordonnance, compte-rendu…",
      description: "Téléchargez un document de votre choix en PDF professionnel signé. Accès permanent.",
      perks: ["1 document déverrouillé", "PDF téléchargeable immédiatement", "Accès permanent, sans abonnement"],
      preview: <PreviewBilan />,
      accent: ACCENT,
      cta: "Déverrouiller ce document",
    },
    {
      key: "dossier",
      name: "Dossier médical complet",
      price: "4,90 €",
      tag: "Bilans + ordonnances + compte-rendus + historique",
      description: "Exportez l'intégralité de votre suivi auditif en un PDF mis en page — idéal pour un second avis.",
      perks: ["4 documents inclus", "PDF professionnel complet", "Historique depuis 2022", "Partage sécurisé praticien"],
      preview: <PreviewDossier />,
      accent: "#8b5cf6",
      cta: "Obtenir mon dossier",
    },
  ];

  return (
    <div className="w-full space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Mes documents</h1>
        <p className="mt-1 text-sm text-slate-500">
          Consultez vos documents en ligne gratuitement. Téléchargez-les en PDF à la carte.
        </p>
      </div>

      {/* Bannière */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-sm text-slate-500 leading-relaxed">
          Données hébergées en France (HDS certifié). La consultation en ligne est toujours gratuite.
          Le paiement couvre uniquement le téléchargement PDF.
        </p>
      </div>

      {/* Produits */}
      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div key={p.key} className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {/* Label */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-2">
              <div className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: p.accent }}>
                APERÇU
              </div>
              <div className="text-[10px] text-slate-400">{p.tag}</div>
            </div>

            {/* Aperçu document */}
            <div className="px-5 pb-4">
              {p.preview}
            </div>

            <div className="mx-5 border-t border-slate-100" />

            {/* Infos + CTA */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-base font-bold text-slate-800">{p.name}</div>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{p.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-bold" style={{ color: p.accent }}>{p.price}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">accès permanent</div>
                </div>
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: p.accent + "15" }}>
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    {perk}
                  </li>
                ))}
              </ul>

              {unlocked[p.key] ? (
                <div className="w-full rounded-xl py-3 text-sm font-bold text-center"
                  style={{ background: p.accent + "15", color: p.accent }}>
                  <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Déverrouillé — Télécharger
                </div>
              ) : (
                <button
                  onClick={() => setModal({ name: p.name, price: p.price, key: p.key })}
                  className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                  style={{ background: `linear-gradient(135deg,${p.accent},${p.accent}cc)`, boxShadow: `0 4px 16px ${p.accent}35` }}>
                  {p.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Alerte renouvellement */}
      <div className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: alerte?.active ? ACCENT + "40" : "#e2e8f0",
          boxShadow: alerte?.active ? `0 4px 24px ${ACCENT}18` : "0 4px 24px rgba(0,0,0,0.06)",
          background: alerte?.active ? `linear-gradient(135deg,${ACCENT}08,#fff)` : "#fff",
        }}>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">

          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: alerte?.active ? ACCENT + "18" : "#f1f5f9" }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
                stroke={alerte?.active ? ACCENT : "#94a3b8"} strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="text-sm font-bold text-slate-800">Alerte renouvellement</div>
                {alerte?.active ? (
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: ACCENT }}>ACTIF</div>
                ) : (
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-500 bg-slate-100">0,99 € / an</div>
                )}
              </div>

              {alerte?.active ? (
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    Alerte envoyée à <span className="font-semibold text-slate-700">{alerte.email}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    1re alerte : <span className="font-semibold" style={{ color: ACCENT }}>{formatDate(ALERT_DATE)}</span>
                    <span className="text-slate-400 ml-1">({daysUntil(ALERT_DATE)} jours)</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    2e alerte : <span className="font-semibold text-slate-700">{formatDate(ALERT_DATE_J0)}</span> — jour du renouvellement
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    Recevez un email 2 semaines avant votre renouvellement, puis un rappel le jour même.
                  </p>
                  <p className="text-xs text-slate-400">
                    Renouvellement estimé : <strong className="text-slate-600">{formatDate(ELIGIBLE_DATE)}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {alerte?.active ? (
              <button onClick={handleAlerteCancel}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2">
                Résilier
              </button>
            ) : (
              <button onClick={() => setAlerteModal(true)}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] whitespace-nowrap"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, boxShadow: `0 4px 16px ${ACCENT}35` }}>
                M'alerter
              </button>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <PayModal
          product={modal}
          onClose={() => setModal(null)}
          onSuccess={() => handleSuccess(modal.key)}
        />
      )}
      {alerteModal && (
        <AlerteModal
          onClose={() => setAlerteModal(false)}
          onSuccess={handleAlerteSuccess}
        />
      )}
    </div>
  );
}
