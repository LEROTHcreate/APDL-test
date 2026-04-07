"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import DraggableWindow from "@/components/ui/DraggableWindow";

/* ── Glass style tokens ─────────────────────────────────────────────────── */
const glass: CSSProperties = {
  background: "rgba(255,255,255,0.58)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.72)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
};
const glassSubtle: CSSProperties = {
  background: "rgba(255,255,255,0.45)",
  border: "1px solid rgba(255,255,255,0.65)",
};

/* ── Types ───────────────────────────────────────────────────────────────── */
type Status = "renouvellement" | "controle" | "actif";
type Filter = "Tous" | "Myopie" | "Hypermétropie" | "Presbytie" | "Astigmatisme" | "Lentilles";

type Patient = {
  id: string;
  name: string;
  dob: string;
  diagnosis: string;
  tags: string[];
  lastRdv: string;
  nextRdv?: string;
  status: Status;
  od: string;
  og: string;
  equipement: string;
  mutuelle: string;
  devisEnAttente: boolean;
};

/** Full patient record stored in localStorage */
interface StoredPatient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  mutuelle?: string;
  numeroSS?: string;
  notes?: string;
  createdAt: string;
}

/* ── Status meta ─────────────────────────────────────────────────────────── */
const STATUS_META: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  renouvellement: { label: "Renouvellement proche", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", dot: "🟡" },
  controle:       { label: "Contrôle annuel",       color: "#8B5CF6", bg: "rgba(139,92,246,0.10)", dot: "🟣" },
  actif:          { label: "Suivi actif",            color: "#00C98A", bg: "rgba(0,201,138,0.10)",  dot: "🟢" },
};

/* ── Mock data ───────────────────────────────────────────────────────────── */
const MOCK_PATIENTS: Patient[] = [
  { id: "marie-leblanc",   name: "Marie Leblanc",    dob: "née 5 avr. 1985",  diagnosis: "Myopie forte",                  tags: ["Myopie", "Lentilles"],                   lastRdv: "Aujourd'hui",  status: "actif",          od: "−4.50 (−0.50×170°)",              og: "−4.00 (−0.25×10°)",              equipement: "Lentilles",   mutuelle: "MGEN",                 devisEnAttente: false },
  { id: "paul-renaud",     name: "Paul Renaud",      dob: "né 12 jan. 1990",  diagnosis: "Lentilles journalières SiHy",   tags: ["Myopie", "Lentilles"],                   lastRdv: "Aujourd'hui",  nextRdv: "25 mar. 2026",  status: "actif",          od: "−2.25 (−0.50×170°)",              og: "−1.75 (−0.25×10°)",              equipement: "Lentilles",   mutuelle: "Harmonie Mutuelle",    devisEnAttente: true  },
  { id: "isabelle-morel",  name: "Isabelle Morel",   dob: "née 22 août 1978", diagnosis: "Astigmatisme + Presbytie",      tags: ["Presbytie", "Astigmatisme"],             lastRdv: "Hier",         status: "controle",       od: "−0.50 (−1.25×85°) add+2.00",      og: "−0.25 (−1.00×90°) add+2.00",    equipement: "Progressifs", mutuelle: "Malakoff Humanis",     devisEnAttente: false },
  { id: "thomas-girard",   name: "Thomas Girard",    dob: "né 3 mar. 1997",   diagnosis: "Myopie légère",                 tags: ["Myopie"],                                lastRdv: "22 mar. 2026", status: "renouvellement", od: "−1.50 (−0.25×175°)",              og: "−1.25 (−0.25×5°)",               equipement: "Lunettes",    mutuelle: "Mutuelle Générale",    devisEnAttente: true  },
  { id: "sophie-renault",  name: "Sophie Renault",   dob: "née 14 juin 1995", diagnosis: "Hypermétropie modérée",         tags: ["Hypermétropie"],                         lastRdv: "20 mar. 2026", status: "renouvellement", od: "+1.75 (−0.50×90°)",               og: "+1.50 (−0.25×85°)",              equipement: "Lunettes",    mutuelle: "April Santé",          devisEnAttente: false },
  { id: "claire-dubois",   name: "Claire Dubois",    dob: "née 30 oct. 1965", diagnosis: "Presbytie avancée",             tags: ["Presbytie"],                             lastRdv: "15 jan. 2026", status: "controle",       od: "+1.25 (−0.75×80°) add+2.50",      og: "+1.00 (−0.50×95°) add+2.50",    equipement: "Progressifs", mutuelle: "MAIF Santé",           devisEnAttente: false },
  { id: "lucas-martin",    name: "Lucas Martin",     dob: "né 22 juil. 2005", diagnosis: "Myopie progressive",            tags: ["Myopie", "Lentilles"],                   lastRdv: "10 mar. 2026", status: "actif",          od: "−3.00 (−0.50×165°)",              og: "−2.75 (−0.50×170°)",             equipement: "Les deux",    mutuelle: "Mutuelle des Étudiants", devisEnAttente: false },
  { id: "nicolas-bernard", name: "Nicolas Bernard",  dob: "né 22 jan. 1988",  diagnosis: "Myopie forte + Astigmatisme",  tags: ["Myopie", "Astigmatisme", "Lentilles"], lastRdv: "5 mar. 2026",  status: "actif",          od: "−5.50 (−1.25×170°)",              og: "−5.00 (−1.00×175°)",             equipement: "Lentilles",   mutuelle: "AG2R La Mondiale",     devisEnAttente: false },
];

const FILTERS: Filter[] = ["Tous", "Myopie", "Hypermétropie", "Presbytie", "Astigmatisme", "Lentilles"];
const LS_KEY = "thor_pro_patients";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function calcAge(dob: string): number | null {
  // Try to parse "né 22 jan. 1988" or "née 5 avr. 1985" → extract year
  const m = dob.match(/(\d{4})/);
  if (!m) return null;
  return new Date().getFullYear() - parseInt(m[1]);
}

const AVATAR_COLORS = [
  "#2D8CFF", "#6366f1", "#00C98A", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#06B6D4",
];
function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
function IconSearch({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}
function IconDevis({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h4" />
    </svg>
  );
}
function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function IconUsers({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

/* ── Modal Nouveau Patient ───────────────────────────────────────────────── */
interface NewPatientModalProps {
  onClose: () => void;
  onSave: (p: StoredPatient) => void;
}

function NewPatientModal({ onClose, onSave }: NewPatientModalProps) {
  const [form, setForm] = useState({
    prenom: "", nom: "", dateNaissance: "", telephone: "",
    email: "", adresse: "", codePostal: "", ville: "",
    mutuelle: "", numeroSS: "", notes: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${form.prenom.toLowerCase()}-${form.nom.toLowerCase()}`.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const patient: StoredPatient = {
      id: `${id}-${Date.now()}`,
      ...form,
      createdAt: new Date().toISOString(),
    };
    onSave(patient);
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(203,213,225,0.8)",
    background: "rgba(248,250,252,0.9)",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const fields: { label: string; key: string; type?: string; span?: boolean }[] = [
    { label: "Prénom *", key: "prenom" },
    { label: "Nom *", key: "nom" },
    { label: "Date de naissance *", key: "dateNaissance", type: "date" },
    { label: "Téléphone *", key: "telephone", type: "tel" },
    { label: "Email", key: "email", type: "email" },
    { label: "Adresse", key: "adresse", span: true },
    { label: "Code postal", key: "codePostal" },
    { label: "Ville", key: "ville" },
    { label: "Mutuelle", key: "mutuelle" },
    { label: "N° Sécurité sociale", key: "numeroSS" },
  ];

  return (
    <DraggableWindow
      title="Nouveau patient"
      onClose={onClose}
      defaultWidth={540}
      defaultHeight={580}
    >
      <div style={{ padding: 24, background: "rgba(255,255,255,0.97)" }}>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 0, marginBottom: 20 }}>Remplissez les informations du patient</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            {fields.map(({ label, key, type, span }) => (
              <div key={key} style={{ gridColumn: span ? "1 / -1" : undefined }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {label}
                </label>
                <input
                  type={type ?? "text"}
                  value={(form as Record<string, string>)[key]}
                  onChange={set(key)}
                  required={["prenom", "nom", "dateNaissance", "telephone"].includes(key)}
                  style={inputStyle}
                  placeholder={label.replace(" *", "")}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                placeholder="Observations, allergies, remarques..."
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(226,232,240,0.8)" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...glassSubtle,
                borderRadius: 10,
                padding: "9px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #2D8CFF, #1A72E8)",
                boxShadow: "0 2px 8px rgba(45,140,255,0.30)",
                border: "none",
                borderRadius: 10,
                padding: "9px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                cursor: "pointer",
              }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </DraggableWindow>
  );
}

/* ── Patient Card ────────────────────────────────────────────────────────── */
function PatientCard({ patient, devisEnAttenteIds }: { patient: Patient; devisEnAttenteIds: Set<string> }) {
  const statusMeta = STATUS_META[patient.status];
  const age = calcAge(patient.dob);
  const color = avatarColor(patient.name);
  const ini = initials(patient.name);
  const hasDevisEnAttente = patient.devisEnAttente || devisEnAttenteIds.has(patient.name.split(" ")[1]?.toLowerCase() ?? "");

  return (
    <div
      style={{
        ...glass,
        borderRadius: 18,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = glass.boxShadow as string;
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}
    >
      {/* Badge règlement en attente */}
      {hasDevisEnAttente && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.30)",
          borderRadius: 8,
          padding: "3px 9px",
          fontSize: 11,
          fontWeight: 700,
          color: "#DC2626",
          letterSpacing: "0.02em",
        }}>
          Règlement en attente
        </div>
      )}

      {/* Top: avatar + nom + statut */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        {/* Avatar */}
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          boxShadow: `0 2px 8px ${color}44`,
        }}>
          {ini}
        </div>

        {/* Name + age + status */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: hasDevisEnAttente ? 110 : 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {patient.name}
          </div>
          {age !== null && (
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
              {patient.dob} · {age} ans
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 600,
              color: statusMeta.color,
              background: statusMeta.bg,
              borderRadius: 8,
              padding: "3px 8px",
            }}>
              {statusMeta.dot} {statusMeta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnosis + equipement */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{patient.diagnosis}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{patient.equipement}</div>
      </div>

      {/* Correction OD/OG */}
      <div style={{
        ...glassSubtle,
        borderRadius: 10,
        padding: "8px 12px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4px 12px",
        marginBottom: 12,
      }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>OD</span>
          <div style={{ fontSize: 11.5, color: "#334155", fontWeight: 500, marginTop: 1 }}>{patient.od}</div>
        </div>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>OG</span>
          <div style={{ fontSize: 11.5, color: "#334155", fontWeight: 500, marginTop: 1 }}>{patient.og}</div>
        </div>
      </div>

      {/* Prochain RDV */}
      {patient.nextRdv && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "#2D8CFF",
          marginBottom: 10,
        }}>
          <IconCalendar className="w-3.5 h-3.5" />
          <span>Prochain RDV : <strong>{patient.nextRdv}</strong></span>
        </div>
      )}

      {/* KPIs */}
      <div style={{
        display: "flex", gap: 12,
        fontSize: 11.5, color: "#64748b",
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: "1px solid rgba(226,232,240,0.7)",
      }}>
        <span>Dernière visite : <strong style={{ color: "#475569" }}>{patient.lastRdv}</strong></span>
        <span style={{ color: "#cbd5e1" }}>·</span>
        <span>Mutuelle : <strong style={{ color: "#475569" }}>{patient.mutuelle}</strong></span>
      </div>

      {/* Actions rapides */}
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href={`/clair-vision/pro/patients/${patient.id}`}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 12px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #2D8CFF, #1A72E8)",
            color: "white",
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(45,140,255,0.25)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <IconClipboard className="w-3.5 h-3.5" />
          Voir fiche
        </Link>
        <Link
          href={`/clair-vision/pro/devis?patient=${encodeURIComponent(patient.name)}`}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 12px",
            borderRadius: 10,
            ...glassSubtle,
            color: "#6366f1",
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = glassSubtle.background as string)}
        >
          <IconDevis className="w-3.5 h-3.5" />
          + Devis
        </Link>
      </div>
    </div>
  );
}

/* ── Patient Row (list view) ─────────────────────────────────────────────── */
function PatientRow({ patient, devisEnAttenteIds }: { patient: Patient; devisEnAttenteIds: Set<string> }) {
  const statusMeta = STATUS_META[patient.status];
  const age = calcAge(patient.dob);
  const color = avatarColor(patient.name);
  const ini = initials(patient.name);
  const hasDevisEnAttente = patient.devisEnAttente || devisEnAttenteIds.has(patient.name.split(" ")[1]?.toLowerCase() ?? "");

  return (
    <div
      style={{
        ...glass,
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = glass.boxShadow as string; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
    >
      {/* Avatar */}
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white", fontWeight: 700, fontSize: 13, boxShadow: `0 2px 8px ${color}44` }}>
        {ini}
      </div>

      {/* Nom + âge + statut */}
      <div style={{ flex: "0 0 200px", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.name}</span>
          {hasDevisEnAttente && <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "1px 6px" }}>💶 Règlement</span>}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{age !== null ? `${age} ans` : ""} · {patient.dob.replace(/^(né|née) /, "")}</div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: statusMeta.color, background: statusMeta.bg, borderRadius: 6, padding: "2px 7px", marginTop: 4 }}>
          {statusMeta.dot} {statusMeta.label}
        </span>
      </div>

      {/* Diagnostic */}
      <div style={{ flex: "0 0 170px", minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.diagnosis}</div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{patient.equipement}</div>
      </div>

      {/* Corrections OD / OG */}
      <div style={{ flex: "0 0 220px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 8px", background: "rgba(241,245,249,0.7)", borderRadius: 8, padding: "6px 10px" }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>OD</div>
          <div style={{ fontSize: 11, color: "#334155", fontWeight: 500, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.od}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>OG</div>
          <div style={{ fontSize: 11, color: "#334155", fontWeight: 500, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.og}</div>
        </div>
      </div>

      {/* Mutuelle */}
      <div style={{ flex: "0 0 140px", minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 1 }}>Mutuelle</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.mutuelle}</div>
      </div>

      {/* Dernière visite + prochain RDV */}
      <div style={{ flex: "0 0 130px", minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 1 }}>Dernière visite</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{patient.lastRdv}</div>
        {patient.nextRdv && (
          <div style={{ fontSize: 11, color: "#2D8CFF", marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {patient.nextRdv}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexShrink: 0 }}>
        <Link href={`/clair-vision/pro/patients/${patient.id}`}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", color: "white", fontSize: 12, fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 8px rgba(45,140,255,0.22)", whiteSpace: "nowrap" }}>
          Voir fiche
        </Link>
        <Link href={`/clair-vision/pro/devis?patient=${encodeURIComponent(patient.name)}`}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, ...glassSubtle, color: "#6366f1", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
          + Devis
        </Link>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function PatientsPage() {
  const [filter, setFilter] = useState<Filter>("Tous");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [storedPatients, setStoredPatients] = useState<StoredPatient[]>([]);
  const [devisEnAttenteIds, setDevisEnAttenteIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Load stored patients
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setStoredPatients(JSON.parse(raw) as StoredPatient[]);
    } catch { /* ignore */ }
  }, []);

  // Load devis en attente from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("thor_pro_devis");
      if (!raw) return;
      const allDevis = JSON.parse(raw) as Array<{ patientNom: string; status: string }>;
      const noms = new Set(
        allDevis
          .filter(d => d.status !== "Livré" && d.status !== "Facturé")
          .map(d => d.patientNom.toLowerCase())
      );
      setDevisEnAttenteIds(noms);
    } catch { /* ignore */ }
  }, []);

  const handleSave = (p: StoredPatient) => {
    const updated = [...storedPatients, p];
    setStoredPatients(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    setModalOpen(false);
  };

  // Convertit StoredPatient → Patient pour l'affichage
  const mockNames = new Set(MOCK_PATIENTS.map(p => p.name.toLowerCase()));
  const storedAsPatients: Patient[] = storedPatients
    .filter(sp => !mockNames.has(`${sp.prenom} ${sp.nom}`.trim().toLowerCase()))
    .map(sp => ({
      id: sp.id,
      name: `${sp.prenom} ${sp.nom}`.trim(),
      dob: sp.dateNaissance ? sp.dateNaissance : "—",
      diagnosis: sp.notes?.trim() || "Nouveau patient",
      tags: [] as string[],
      lastRdv: "—",
      status: "actif" as Status,
      od: "—",
      og: "—",
      equipement: "—",
      mutuelle: sp.mutuelle || "—",
      devisEnAttente: false,
    }));

  // Filtered list
  const allPatients = [...MOCK_PATIENTS, ...storedAsPatients];
  const filtered = allPatients.filter(p => {
    const matchFilter = filter === "Tous" || p.tags.includes(filter);
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.name.toLowerCase().includes(q)
      || p.diagnosis.toLowerCase().includes(q)
      || p.mutuelle.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const renewalCount = allPatients.filter(p => p.status === "renouvellement").length;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            Patients
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4, marginBottom: 0 }}>
            <span style={{ fontWeight: 600, color: "#2D8CFF" }}>{allPatients.length} patients</span>
            {" · "}
            <span style={{ fontWeight: 600, color: "#F59E0B" }}>{renewalCount} renouvellements proches</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* View toggle */}
          <div style={{ display: "flex", gap: 0, ...glassSubtle, borderRadius: 10, padding: 3 }}>
            {([["grid", "⊞"], ["list", "☰"]] as const).map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                  background: viewMode === mode ? "#2D8CFF" : "transparent",
                  color: viewMode === mode ? "white" : "#94a3b8",
                }}>
                {icon}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "linear-gradient(135deg, #2D8CFF, #1A72E8)",
              boxShadow: "0 2px 12px rgba(45,140,255,0.30)",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <IconPlus className="w-4 h-4" />
            Nouveau patient
          </button>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        {/* Search bar */}
        <div style={{ position: "relative", flex: 1 }}>
          <IconSearch className="w-4 h-4" style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "#94a3b8", pointerEvents: "none",
          } as CSSProperties} />
          <input
            type="text"
            placeholder="Rechercher un patient, diagnostic, mutuelle…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              borderRadius: 12,
              border: "1px solid rgba(203,213,225,0.8)",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              fontSize: 14,
              color: "#1e293b",
              outline: "none",
              boxSizing: "border-box",
            } as CSSProperties}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: active ? "none" : "1px solid rgba(203,213,225,0.8)",
                  background: active
                    ? "linear-gradient(135deg, #2D8CFF, #1A72E8)"
                    : "rgba(255,255,255,0.70)",
                  color: active ? "white" : "#64748b",
                  boxShadow: active ? "0 2px 8px rgba(45,140,255,0.25)" : "none",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Stats summary bar ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {(["actif", "controle", "renouvellement"] as Status[]).map(s => {
          const meta = STATUS_META[s];
          const count = allPatients.filter(p => p.status === s).length;
          return (
            <div key={s} style={{
              ...glassSubtle,
              borderRadius: 12,
              padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: meta.color,
                display: "inline-block",
                boxShadow: `0 0 0 2px ${meta.bg}`,
              }} />
              <span style={{ fontWeight: 600, color: "#475569" }}>{meta.label}</span>
              <span style={{
                background: meta.bg,
                color: meta.color,
                borderRadius: 6,
                padding: "1px 7px",
                fontSize: 12,
                fontWeight: 700,
              }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* ── Patient grid ── */}
      {filtered.length === 0 ? (
        <div style={{
          ...glass,
          borderRadius: 18,
          padding: "52px 24px",
          textAlign: "center",
          color: "#94a3b8",
        }}>
          <IconUsers className="w-10 h-10" style={{ margin: "0 auto 12px", opacity: 0.4 } as CSSProperties} />
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Aucun patient trouvé</p>
          <p style={{ fontSize: 13 }}>Modifiez votre recherche ou vos filtres.</p>
        </div>
      ) : viewMode === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Table header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "4px 20px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <div style={{ flex: "0 0 40px" }} />
            <div style={{ flex: "0 0 200px" }}>Patient</div>
            <div style={{ flex: "0 0 170px" }}>Diagnostic</div>
            <div style={{ flex: "0 0 220px" }}>Corrections</div>
            <div style={{ flex: "0 0 140px" }}>Mutuelle</div>
            <div style={{ flex: "0 0 130px" }}>Visites</div>
            <div style={{ marginLeft: "auto" }}>Actions</div>
          </div>
          {filtered.map(p => <PatientRow key={p.id} patient={p} devisEnAttenteIds={devisEnAttenteIds} />)}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 18,
        }}>
          {filtered.map(p => <PatientCard key={p.id} patient={p} devisEnAttenteIds={devisEnAttenteIds} />)}
        </div>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <NewPatientModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
