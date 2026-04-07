"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────────────────── */
interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface AudiogrammeRow {
  hz250: string;
  hz500: string;
  hz1000: string;
  hz2000: string;
  hz4000: string;
  hz8000: string;
}

interface ConsultationData {
  id: string;
  date: string;
  praticien: string;
  patientId: string;
  patientNom: string;
  patientPrenom: string;
  motif: string;
  // Anamnèse
  genePrincipale: string;
  dureeGene: string;
  antecedentsORL: string;
  appareillageAnterieur: boolean;
  appareillageMarque: string;
  appareillageduree: string;
  // Audiogramme tonal
  audiOD: AudiogrammeRow;
  audiOG: AudiogrammeRow;
  // Audiogramme vocal
  scoreVocalOD: string;
  scoreVocalOG: string;
  intensiteTest: string;
  intelligibilite: string;
  // Recommandation
  typeAppareillage: string;
  classe: string;
  marquesProposees: string[];
  dureeEssai: string;
  notesLibres: string;
  // Tiers payant
  tiersPayantSS: boolean;
  tiersPayantMutuelle: boolean;
  estimationRAC: string;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */
const ACCENT = "#00C98A";
const FREQS: Array<keyof AudiogrammeRow> = ["hz250", "hz500", "hz1000", "hz2000", "hz4000", "hz8000"];
const FREQ_LABELS = ["250 Hz", "500 Hz", "1000 Hz", "2000 Hz", "4000 Hz", "8000 Hz"];

function calcMoyenne(row: AudiogrammeRow): number | null {
  const vals = [row.hz500, row.hz1000, row.hz2000, row.hz4000]
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v));
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function classificationPerte(moy: number | null): string {
  if (moy === null) return "—";
  if (moy < 20) return "Normal";
  if (moy < 40) return "Légère";
  if (moy < 70) return "Moyenne";
  if (moy < 90) return "Sévère";
  return "Profonde";
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function genId(): string {
  return `consult_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_ROW: AudiogrammeRow = { hz250: "", hz500: "", hz1000: "", hz2000: "", hz4000: "", hz8000: "" };

const MARQUES_LIST = ["Phonak", "Oticon", "Starkey", "Widex", "ReSound", "Signia"];

/* ── Styles partagés ───────────────────────────────────────────────────── */
const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.58)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.72)",
  borderRadius: 18,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: ACCENT,
  marginBottom: 16,
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "rgba(255,255,255,0.80)",
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
};

const selectStyle: React.CSSProperties = { ...inputStyle };

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 80,
};

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function ConsultationPage() {
  /* ── State ── */
  const [patients, setPatients] = useState<Patient[]>([]);
  const [praticienDefault, setPraticienDefault] = useState("");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);
  const [preConsultData, setPreConsultData] = useState<Record<string, unknown> | null>(null);
  const [preConsultOpen, setPreConsultOpen] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [patientNom, setPatientNom] = useState("");
  const [patientPrenom, setPatientPrenom] = useState("");
  const [praticien, setPraticien] = useState("");
  const [motif, setMotif] = useState("");

  // Anamnèse
  const [genePrincipale, setGenePrincipale] = useState("");
  const [dureeGene, setDureeGene] = useState("");
  const [antecedentsORL, setAntecedentsORL] = useState("");
  const [appareillageAnterieur, setAppareillageAnterieur] = useState(false);
  const [appareillageMarque, setAppareillageMarque] = useState("");
  const [appareillageduree, setAppareillageduree] = useState("");

  // Audiogramme tonal
  const [audiOD, setAudioOD] = useState<AudiogrammeRow>({ ...EMPTY_ROW });
  const [audiOG, setAudioOG] = useState<AudiogrammeRow>({ ...EMPTY_ROW });

  // Audiogramme vocal
  const [scoreVocalOD, setScoreVocalOD] = useState("");
  const [scoreVocalOG, setScoreVocalOG] = useState("");
  const [intensiteTest, setIntensiteTest] = useState("");
  const [intelligibilite, setIntelligibilite] = useState("");

  // Recommandation
  const [typeAppareillage, setTypeAppareillage] = useState("");
  const [classe, setClasse] = useState("");
  const [marquesProposees, setMarquesProposees] = useState<string[]>([]);
  const [dureeEssai, setDureeEssai] = useState("");
  const [notesLibres, setNotesLibres] = useState("");

  // Tiers payant
  const [tiersPayantSS, setTiersPayantSS] = useState(false);
  const [tiersPayantMutuelle, setTiersPayantMutuelle] = useState(false);
  const [estimationRAC, setEstimationRAC] = useState("");

  /* ── Load from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("thor_pro_audition_patients");
      if (raw) setPatients(JSON.parse(raw) as Patient[]);
      const user = localStorage.getItem("thor_pro_audition_current_user");
      if (user) {
        const u = JSON.parse(user) as { nom?: string; prenom?: string; name?: string };
        const name = u.prenom && u.nom ? `${u.prenom} ${u.nom}` : u.name ?? "";
        setPraticienDefault(name);
        setPraticien(name);
      }
    } catch {
      // ignore
    }
    // Load today's pre-consultation form
    try {
      const today = new Date().toISOString().split("T")[0];
      const raw = localStorage.getItem(`thor_pre_consult_audition_${today}`);
      if (raw) setPreConsultData(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  /* ── Derived ── */
  const moyOD = calcMoyenne(audiOD);
  const moyOG = calcMoyenne(audiOG);
  const classOD = classificationPerte(moyOD);
  const classOG = classificationPerte(moyOG);

  /* ── Handlers ── */
  function handlePatientChange(id: string) {
    setPatientId(id);
    const p = patients.find((x) => x.id === id);
    if (p) {
      setPatientNom(p.nom);
      setPatientPrenom(p.prenom);
    } else {
      setPatientNom("");
      setPatientPrenom("");
    }
  }

  function toggleMarque(m: string) {
    setMarquesProposees((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function handleSave() {
    const consultation: ConsultationData = {
      id: genId(),
      date: todayISO(),
      praticien,
      patientId,
      patientNom,
      patientPrenom,
      motif,
      genePrincipale,
      dureeGene,
      antecedentsORL,
      appareillageAnterieur,
      appareillageMarque,
      appareillageduree,
      audiOD,
      audiOG,
      scoreVocalOD,
      scoreVocalOG,
      intensiteTest,
      intelligibilite,
      typeAppareillage,
      classe,
      marquesProposees,
      dureeEssai,
      notesLibres,
      tiersPayantSS,
      tiersPayantMutuelle,
      estimationRAC,
    };
    try {
      const existing = localStorage.getItem("thor_pro_audition_consultations");
      const list: ConsultationData[] = existing ? JSON.parse(existing) : [];
      list.unshift(consultation);
      localStorage.setItem("thor_pro_audition_consultations", JSON.stringify(list));
    } catch {
      // ignore
    }
    setSaved(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  /* ── Render ── */
  return (
    <div style={{ padding: "28px 24px", maxWidth: 900, margin: "0 auto", position: "relative" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          background: ACCENT,
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 14,
          boxShadow: "0 4px 20px rgba(0,201,138,0.35)",
          animation: "fadeIn .2s",
        }}>
          Consultation enregistrée
        </div>
      )}

      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
        Fiche de visite — Audioprothèse
      </h1>

      {/* Pre-consultation banner */}
      {preConsultData && (
        <div style={{ marginBottom: 20, background: "linear-gradient(135deg,rgba(0,201,138,0.10),rgba(0,201,138,0.04))", border: "1.5px solid rgba(0,201,138,0.30)", borderRadius: 16, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>📋</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#065f46", marginBottom: 2 }}>Formulaire pré-consultation reçu aujourd&apos;hui</div>
                <div style={{ fontSize: 13, color: "#059669" }}>
                  {preConsultData.motif ? `Motif : ${preConsultData.motif as string}` : "Patient a rempli le formulaire avant le RDV"}
                  {(preConsultData.genesAuditives as string[] | undefined)?.length ? ` · Gênes : ${(preConsultData.genesAuditives as string[]).slice(0, 3).join(", ")}` : ""}
                </div>
              </div>
            </div>
            <button
              onClick={() => setPreConsultOpen(o => !o)}
              style={{ padding: "7px 16px", background: "rgba(0,201,138,0.12)", border: "1px solid rgba(0,201,138,0.25)", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#059669", cursor: "pointer" }}
            >
              {preConsultOpen ? "▲ Masquer" : "▼ Voir le détail"}
            </button>
          </div>
          {preConsultOpen && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,201,138,0.15)", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, fontSize: 13 }}>
              {Object.entries(preConsultData).filter(([k]) => !["submittedAt"].includes(k)).map(([k, v]) => {
                if (!v || (Array.isArray(v) && v.length === 0)) return null;
                const labels: Record<string, string> = { motif: "Motif", genesAuditives: "Gênes auditives", portActuel: "Port actuel", appareillageMarque: "Appareillage", appareillageAge: "Âge appareil", situationsDifficiles: "Situations difficiles", acouphenes: "Acouphènes", vertiges: "Vertiges", antecedents: "Antécédents", medicaments: "Médicaments", questions: "Questions" };
                return (
                  <div key={k} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "8px 12px", border: "1px solid rgba(0,201,138,0.12)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>{labels[k] ?? k}</div>
                    <div style={{ color: "#1e293b", fontWeight: 600 }}>{Array.isArray(v) ? v.join(", ") : String(v)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── En-tête ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
        <p style={sectionTitle}>Informations générales</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Patient */}
          <div>
            <label style={label}>Patient</label>
            {patients.length > 0 ? (
              <select
                style={selectStyle}
                value={patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
              >
                <option value="">— Sélectionner un patient —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Nom"
                  value={patientNom}
                  onChange={(e) => setPatientNom(e.target.value)}
                />
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Prénom"
                  value={patientPrenom}
                  onChange={(e) => setPatientPrenom(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label style={label}>Date</label>
            <input
              style={{ ...inputStyle, background: "rgba(240,253,250,0.9)", color: "#64748b" }}
              type="date"
              value={todayISO()}
              readOnly
            />
          </div>

          {/* Praticien */}
          <div>
            <label style={label}>Praticien</label>
            <input
              style={inputStyle}
              placeholder="Nom du praticien"
              value={praticien}
              onChange={(e) => setPraticien(e.target.value)}
            />
          </div>

          {/* Motif */}
          <div>
            <label style={label}>Motif de consultation</label>
            <select style={selectStyle} value={motif} onChange={(e) => setMotif(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>Bilan initial</option>
              <option>Contrôle annuel</option>
              <option>Adaptation</option>
              <option>Suivi</option>
              <option>Urgence</option>
              <option>Renouvellement</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Anamnèse ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
        <p style={sectionTitle}>Anamnèse</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          <div>
            <label style={label}>Gêne principale</label>
            <select style={selectStyle} value={genePrincipale} onChange={(e) => setGenePrincipale(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>Compréhension en groupe</option>
              <option>TV trop fort</option>
              <option>Acouphènes</option>
              <option>Difficulté téléphone</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label style={label}>Depuis combien de temps</label>
            <select style={selectStyle} value={dureeGene} onChange={(e) => setDureeGene(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>{"< 1 an"}</option>
              <option>1-3 ans</option>
              <option>3-5 ans</option>
              <option>{"> 5 ans"}</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label}>Antécédents ORL</label>
            <textarea
              style={textareaStyle}
              placeholder="Otites, chirurgies, traumatismes sonores, médicaments ototoxiques..."
              value={antecedentsORL}
              onChange={(e) => setAntecedentsORL(e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ ...label, display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={appareillageAnterieur}
                onChange={(e) => setAppareillageAnterieur(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: ACCENT }}
              />
              Appareillage antérieur
            </label>
            {appareillageAnterieur && (
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={label}>Marque</label>
                  <input
                    style={inputStyle}
                    placeholder="Ex : Phonak, Oticon..."
                    value={appareillageMarque}
                    onChange={(e) => setAppareillageMarque(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={label}>Durée d&apos;utilisation</label>
                  <input
                    style={inputStyle}
                    placeholder="Ex : 3 ans"
                    value={appareillageduree}
                    onChange={(e) => setAppareillageduree(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Audiogramme tonal ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
        <p style={sectionTitle}>Audiogramme tonal</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, paddingBottom: 10, width: 56 }}>Oreille</th>
                {FREQ_LABELS.map((f) => (
                  <th key={f} style={{ textAlign: "center", fontSize: 12, color: "#64748b", fontWeight: 600, paddingBottom: 10 }}>{f}</th>
                ))}
                <th style={{ textAlign: "center", fontSize: 12, color: "#64748b", fontWeight: 600, paddingBottom: 10 }}>Perte moy.</th>
                <th style={{ textAlign: "center", fontSize: 12, color: "#64748b", fontWeight: 600, paddingBottom: 10 }}>Classif.</th>
              </tr>
            </thead>
            <tbody>
              {/* OD */}
              <tr>
                <td style={{ paddingRight: 8, paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>OD</span>
                </td>
                {FREQS.map((freq) => (
                  <td key={freq} style={{ padding: "0 4px 8px" }}>
                    <input
                      type="number"
                      min={-10}
                      max={120}
                      step={5}
                      style={{ ...inputStyle, textAlign: "center", padding: "7px 4px" }}
                      value={audiOD[freq]}
                      onChange={(e) => setAudioOD((prev) => ({ ...prev, [freq]: e.target.value }))}
                      placeholder="—"
                    />
                  </td>
                ))}
                <td style={{ textAlign: "center", paddingBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: "#ef4444", fontSize: 14 }}>
                    {moyOD !== null ? `${moyOD} dB` : "—"}
                  </span>
                </td>
                <td style={{ textAlign: "center", paddingBottom: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: classOD === "Normal" ? "#dcfce7" : classOD === "Légère" ? "#fef9c3" : classOD === "Moyenne" ? "#fed7aa" : classOD === "Sévère" ? "#fecaca" : classOD === "Profonde" ? "#fca5a5" : "#f1f5f9",
                    color: classOD === "Normal" ? "#166534" : classOD === "Légère" ? "#854d0e" : classOD === "Moyenne" ? "#9a3412" : "#7f1d1d",
                  }}>
                    {classOD}
                  </span>
                </td>
              </tr>
              {/* OG */}
              <tr>
                <td style={{ paddingRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>OG</span>
                </td>
                {FREQS.map((freq) => (
                  <td key={freq} style={{ padding: "0 4px" }}>
                    <input
                      type="number"
                      min={-10}
                      max={120}
                      step={5}
                      style={{ ...inputStyle, textAlign: "center", padding: "7px 4px" }}
                      value={audiOG[freq]}
                      onChange={(e) => setAudioOG((prev) => ({ ...prev, [freq]: e.target.value }))}
                      placeholder="—"
                    />
                  </td>
                ))}
                <td style={{ textAlign: "center" }}>
                  <span style={{ fontWeight: 700, color: "#3b82f6", fontSize: 14 }}>
                    {moyOG !== null ? `${moyOG} dB` : "—"}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: classOG === "Normal" ? "#dcfce7" : classOG === "Légère" ? "#fef9c3" : classOG === "Moyenne" ? "#fed7aa" : classOG === "Sévère" ? "#fecaca" : classOG === "Profonde" ? "#fca5a5" : "#f1f5f9",
                    color: classOG === "Normal" ? "#166534" : classOG === "Légère" ? "#854d0e" : classOG === "Moyenne" ? "#9a3412" : "#7f1d1d",
                  }}>
                    {classOG}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>
          Valeurs en dB HL. Perte moyenne calculée sur 500, 1000, 2000 et 4000 Hz.
        </p>
      </div>

      {/* ── Audiogramme vocal ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
        <p style={sectionTitle}>Audiogramme vocal</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>

          <div>
            <label style={label}>Score vocal OD (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              style={inputStyle}
              placeholder="0-100"
              value={scoreVocalOD}
              onChange={(e) => setScoreVocalOD(e.target.value)}
            />
          </div>

          <div>
            <label style={label}>Score vocal OG (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              style={inputStyle}
              placeholder="0-100"
              value={scoreVocalOG}
              onChange={(e) => setScoreVocalOG(e.target.value)}
            />
          </div>

          <div>
            <label style={label}>Intensité de test (dBHL)</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="Ex : 65"
              value={intensiteTest}
              onChange={(e) => setIntensiteTest(e.target.value)}
            />
          </div>

          <div>
            <label style={label}>Intelligibilité</label>
            <select style={selectStyle} value={intelligibilite} onChange={(e) => setIntelligibilite(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>Bonne</option>
              <option>Moyenne</option>
              <option>Faible</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Recommandation ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
        <p style={sectionTitle}>Recommandation</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

          <div>
            <label style={label}>Type d&apos;appareillage</label>
            <select style={selectStyle} value={typeAppareillage} onChange={(e) => setTypeAppareillage(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>Contour d&apos;oreille</option>
              <option>Intra-auriculaire</option>
              <option>CROS/BiCROS</option>
              <option>Implant (ORL)</option>
              <option>Aucun pour l&apos;instant</option>
            </select>
          </div>

          <div>
            <label style={label}>Classe</label>
            <select style={selectStyle} value={classe} onChange={(e) => setClasse(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>Classe 1 — 100% Santé</option>
              <option>Classe 2 — Premium</option>
              <option>Les deux à comparer</option>
            </select>
          </div>

          <div>
            <label style={label}>Durée d&apos;essai recommandée</label>
            <select style={selectStyle} value={dureeEssai} onChange={(e) => setDureeEssai(e.target.value)}>
              <option value="">— Sélectionner —</option>
              <option>30 jours</option>
              <option>45 jours</option>
              <option>60 jours</option>
            </select>
          </div>

        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={label}>Marques proposées</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {MARQUES_LIST.map((m) => (
              <label key={m} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 14px", borderRadius: 20,
                border: `1.5px solid ${marquesProposees.includes(m) ? ACCENT : "rgba(0,0,0,0.10)"}`,
                background: marquesProposees.includes(m) ? "rgba(0,201,138,0.08)" : "rgba(255,255,255,0.70)",
                cursor: "pointer", fontSize: 13, fontWeight: 500,
                color: marquesProposees.includes(m) ? "#065f46" : "#475569",
                transition: "all .15s",
              }}>
                <input
                  type="checkbox"
                  checked={marquesProposees.includes(m)}
                  onChange={() => toggleMarque(m)}
                  style={{ accentColor: ACCENT, width: 14, height: 14 }}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={label}>Notes libres</label>
          <textarea
            style={textareaStyle}
            placeholder="Remarques, préférences patient, objectifs d'écoute..."
            value={notesLibres}
            onChange={(e) => setNotesLibres(e.target.value)}
          />
        </div>
      </div>

      {/* ── Tiers payant ── */}
      <div style={{ ...glass, padding: 24, marginBottom: 28 }}>
        <p style={sectionTitle}>Tiers payant</p>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>
            <input
              type="checkbox"
              checked={tiersPayantSS}
              onChange={(e) => setTiersPayantSS(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: ACCENT }}
            />
            Sécurité Sociale
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#1e293b" }}>
            <input
              type="checkbox"
              checked={tiersPayantMutuelle}
              onChange={(e) => setTiersPayantMutuelle(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: ACCENT }}
            />
            Mutuelle
          </label>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ ...label, display: "block" }}>Estimation RAC (€)</label>
            <input
              type="number"
              min={0}
              style={{ ...inputStyle, maxWidth: 200 }}
              placeholder="0"
              value={estimationRAC}
              onChange={(e) => setEstimationRAC(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* ── Boutons ── */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={handleSave}
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, #00a872)`,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 28px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,201,138,0.30)",
            transition: "opacity .15s",
          }}
        >
          Enregistrer la consultation
        </button>

        <Link
          href="/clair-audition/pro/essais?from=consultation"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "12px 24px",
            borderRadius: 12,
            background: saved ? "rgba(0,201,138,0.10)" : "rgba(0,0,0,0.04)",
            border: `1.5px solid ${saved ? ACCENT : "rgba(0,0,0,0.10)"}`,
            color: saved ? "#065f46" : "#94a3b8",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            pointerEvents: saved ? "auto" : "none",
            opacity: saved ? 1 : 0.5,
            transition: "all .15s",
          }}
          aria-disabled={!saved}
          tabIndex={saved ? 0 : -1}
        >
          Démarrer un essai →
        </Link>
      </div>

    </div>
  );
}
