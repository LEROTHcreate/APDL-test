"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import type { CSSProperties } from "react";

/* ── Design tokens ──────────────────────────────────────────────────────── */
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

/* ── Types ──────────────────────────────────────────────────────────────── */
interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  telephone: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  mutuelle: string;
  tiersPayant?: string;
  numeroSS: string;
  notes: string;
}

interface ExamenClinique {
  id: string;
  date: string;
  praticien: string;
  type: string;
  od: { sph: string; cyl: string; axe: string; add?: string };
  og: { sph: string; cyl: string; axe: string; add?: string };
  avOD?: string;
  avOG?: string;
  notes: string;
  visiblePatient: boolean;
}

interface DevisFactureRef {
  id: string;
  date: string;
  description: string;
  montant: number;
  statut: "Facturé" | "Accepté" | "En attente" | "Refusé" | "Payé";
  type: "devis" | "facture";
}

interface DocumentRef {
  id: string;
  nom: string;
  type: "carte-vitale" | "mutuelle" | "ordonnance" | "compte-rendu" | "autre";
  date: string;
  visiblePatient: boolean;
}

interface TimelineEvent {
  id: string;
  date: string;
  titre: string;
  sousTitre: string;
  type: "rdv" | "devis" | "facture" | "examen" | "ordonnance" | "document";
}

type Tab = "overview" | "dossiers" | "ordonnances" | "devis" | "documents" | "notes" | "sav" | "garanties" | "timeline";

interface TicketSAV {
  id: string;
  date: string;
  objet: string;
  statut: "Ouvert" | "En cours" | "Chez fournisseur" | "Résolu" | "Fermé";
  priorite: "Basse" | "Normale" | "Haute" | "Urgente";
  description: string;
  notes?: string;
}

interface OrdonnancePatient {
  id: string;
  numero: string;
  dateOrdonnance: string;
  dateExpiration: string;
  prescripteur: string;
  rpps?: string;
  od: { sphere: string; cylindre: string; axe: string; addition: string };
  og: { sphere: string; cylindre: string; axe: string; addition: string };
  ecartPupillaire?: string;
  remarques?: string;
  visiblePatient: boolean;
  createdAt: string;
}

interface TLEvent {
  id: string;
  date: string;
  dateSortable: number;
  type: "Consultation" | "RDV" | "Ordonnance" | "Devis" | "Facture" | "SAV";
  titre: string;
  sousTitre: string;
}

interface GarantieItem {
  id: string;
  produit: string;
  categorie: "monture" | "verres" | "lentilles" | "accessoire";
  numeroSerie?: string;
  dateLivraison: string;
  garantieFabricant: string;
  garantieMagasin: string;
  fournisseur?: string;
  devisId?: string;
  notes?: string;
}

/* ── Mock data ordonnances ──────────────────────────────────────────────── */
const MOCK_ORDONNANCES: OrdonnancePatient[] = [
  {
    id: "ord-001", numero: "ORD-2026-024",
    dateOrdonnance: "2026-01-20", dateExpiration: "2027-01-20",
    prescripteur: "Dr. Sophie Aubert", rpps: "10004587412",
    od: { sphere: "−2.25", cylindre: "−0.50", axe: "170", addition: "" },
    og: { sphere: "−1.75", cylindre: "−0.25", axe: "10",  addition: "" },
    ecartPupillaire: "64", remarques: "Myopie stable — renouvellement standard.", visiblePatient: true,
    createdAt: "2026-01-20",
  },
  {
    id: "ord-002", numero: "ORD-2025-189",
    dateOrdonnance: "2025-03-03", dateExpiration: "2026-03-03",
    prescripteur: "Dr. Marc Lefebvre",
    od: { sphere: "−2.00", cylindre: "−0.50", axe: "165", addition: "" },
    og: { sphere: "−1.50", cylindre: "−0.25", axe: "15",  addition: "" },
    ecartPupillaire: "64", remarques: "", visiblePatient: false,
    createdAt: "2025-03-03",
  },
];

/* ── Mock data garanties ────────────────────────────────────────────────── */
const MOCK_GARANTIES: GarantieItem[] = [
  {
    id: "gar-001",
    produit: "Monture Ray-Ban RB5154 Tortoise",
    categorie: "monture",
    numeroSerie: "LX-2026-8847-T",
    dateLivraison: "2026-01-25",
    garantieFabricant: "2028-01-25",
    garantieMagasin: "2027-01-25",
    fournisseur: "Ray-Ban / Luxottica",
    devisId: "DEV-2026-003",
  },
  {
    id: "gar-002",
    produit: "Verres Varilux X — Indice 1.67 (paire)",
    categorie: "verres",
    dateLivraison: "2026-01-25",
    garantieFabricant: "2028-01-25",
    garantieMagasin: "2027-01-25",
    fournisseur: "Essilor",
    devisId: "DEV-2026-003",
    notes: "Garantie casse 1 an incluse — remplacement 1 verre gratuit",
  },
  {
    id: "gar-003",
    produit: "Lentilles Air Optix Aqua Mensuelle × 6",
    categorie: "lentilles",
    dateLivraison: "2025-09-12",
    garantieFabricant: "2027-09-12",
    garantieMagasin: "2026-09-12",
    fournisseur: "Alcon",
    devisId: "DEV-2025-118",
  },
];

/* ── Mock data ──────────────────────────────────────────────────────────── */
const MOCK_PATIENTS: Record<string, PatientDetail> = {
  "marie-leblanc": {
    id: "marie-leblanc", firstName: "Marie", lastName: "Leblanc", dob: "1985-04-05",
    telephone: "07 98 76 54 32", email: "marie.leblanc@email.com",
    adresse: "18 avenue des Fleurs", codePostal: "69001", ville: "Lyon",
    mutuelle: "MGEN", tiersPayant: "Réseau Carte Blanche", numeroSS: "2850469001234",
    notes: "Patiente myope forte suivie depuis 2019. Myopie stable depuis 2 ans. Porte des lentilles mensuelles.\n\nAntécédent : kératocône minime OD — sous surveillance.\nAllergies : rhinite allergique saisonnière (avr.–mai).",
  },
  "paul-renaud": {
    id: "paul-renaud", firstName: "Paul", lastName: "Renaud", dob: "1990-01-12",
    telephone: "06 12 34 56 78", email: "paul.renaud@email.com",
    adresse: "42 rue du Commerce", codePostal: "75015", ville: "Paris",
    mutuelle: "Harmonie Mutuelle", tiersPayant: "Réseau Santéclair", numeroSS: "1900175015123",
    notes: "Patient myope depuis l'adolescence, stabilité depuis 3 ans. Porte des lentilles journalières SiHy.\n\nÀ surveiller : légère sécheresse oculaire en fin de journée.",
  },
  "isabelle-morel": {
    id: "isabelle-morel", firstName: "Isabelle", lastName: "Morel", dob: "1978-08-22",
    telephone: "06 55 44 33 22", email: "isabelle.morel@email.com",
    adresse: "7 place du Marché", codePostal: "31000", ville: "Toulouse",
    mutuelle: "Malakoff Humanis", numeroSS: "2780831000456",
    notes: "Astigmatisme bilatéral avec presbytie évolutive. Port de progressifs depuis 3 ans.",
  },
  "thomas-girard": {
    id: "thomas-girard", firstName: "Thomas", lastName: "Girard", dob: "1997-03-03",
    telephone: "06 78 90 12 34", email: "thomas.girard@email.com",
    adresse: "23 rue des Lilas", codePostal: "44000", ville: "Nantes",
    mutuelle: "Mutuelle Générale", numeroSS: "1970344000789",
    notes: "Myopie légère, stable depuis 2 ans. Patient actif — pratique le sport.",
  },
  "sophie-renault": {
    id: "sophie-renault", firstName: "Sophie", lastName: "Renault", dob: "1995-06-14",
    telephone: "07 11 22 33 44", email: "sophie.renault@email.com",
    adresse: "5 rue Pasteur", codePostal: "13001", ville: "Marseille",
    mutuelle: "April Santé", numeroSS: "2950613001012",
    notes: "Hypermétropie modérée, port lunettes à plein temps recommandé.",
  },
  "claire-dubois": {
    id: "claire-dubois", firstName: "Claire", lastName: "Dubois", dob: "1965-10-30",
    telephone: "06 33 44 55 66", email: "claire.dubois@email.com",
    adresse: "88 boulevard Haussmann", codePostal: "75008", ville: "Paris",
    mutuelle: "MAIF Santé", numeroSS: "2651075008345",
    notes: "Presbytie avancée, progressifs premium depuis 2022. Contrôle annuel régulier.",
  },
  "lucas-martin": {
    id: "lucas-martin", firstName: "Lucas", lastName: "Martin", dob: "2005-07-22",
    telephone: "06 99 88 77 66", email: "lucas.martin@email.com",
    adresse: "14 impasse des Pins", codePostal: "67000", ville: "Strasbourg",
    mutuelle: "Mutuelle des Étudiants", numeroSS: "1050767000678",
    notes: "Jeune patient — essai lentilles progressives multifocales. Suivi rapproché prévu.",
  },
  "nicolas-bernard": {
    id: "nicolas-bernard", firstName: "Nicolas", lastName: "Bernard", dob: "1988-01-22",
    telephone: "07 00 11 22 33", email: "nicolas.bernard@email.com",
    adresse: "3 rue Victor Hugo", codePostal: "06000", ville: "Nice",
    mutuelle: "AG2R La Mondiale", numeroSS: "1880106000901",
    notes: "Myopie forte avec astigmatisme. Port de lentilles mensuelles. Bonne compliance.",
  },
};

const MOCK_SAV: TicketSAV[] = [
  { id: "SAV-2026-008", date: "18 mar. 2026", objet: "Branche cassée — Monture Ray-Ban RB5154", statut: "En cours", priorite: "Normale", description: "La branche droite s'est cassée au niveau de la charnière. Monture envoyée chez le fabricant pour réparation.", notes: "Délai estimé : 2 semaines" },
  { id: "SAV-2025-047", date: "3 nov. 2025", objet: "Revêtement anti-reflet défectueux — Varilux X", statut: "Résolu", priorite: "Haute", description: "Délaminage constaté sur le verre gauche après 8 mois. Remplacement effectué sous garantie Essilor.", notes: "Remplacement effectué le 20 nov. 2025" },
];

const MOCK_EXAMENS: ExamenClinique[] = [
  {
    id: "ex-001", date: "20 jan. 2026", praticien: "Dr. Sophie Aubert", type: "Examen complet",
    od: { sph: "−2.25", cyl: "−0.50", axe: "170" },
    og: { sph: "−1.75", cyl: "−0.25", axe: "10" },
    avOD: "10/10", avOG: "10/10",
    notes: "Myopie stable. Pas d'évolution significative depuis le dernier contrôle. Fond d'œil normal.",
    visiblePatient: false,
  },
  {
    id: "ex-002", date: "3 mars 2025", praticien: "Dr. Marc Lefebvre", type: "Contrôle",
    od: { sph: "−2.00", cyl: "−0.50", axe: "165" },
    og: { sph: "−1.50", cyl: "−0.25", axe: "15" },
    avOD: "9/10", avOG: "10/10",
    notes: "Légère évolution OD (+0.25). Contrôle dans 6 mois recommandé.",
    visiblePatient: false,
  },
];

const MOCK_DEVIS_FACTURES_DEFAULT: DevisFactureRef[] = [
  { id: "DEV-2026-003", date: "20 jan. 2026", description: "Équipement progressifs Varilux X + Monture Ray-Ban", montant: 680, statut: "Facturé", type: "devis" },
  { id: "DEV-2025-118", date: "10 sep. 2025", description: "Pack lentilles 6 mois — Air Optix Aqua", montant: 94.80, statut: "Accepté", type: "devis" },
  { id: "DEV-2025-077", date: "2 mai 2025", description: "Monture solaire sur mesure — tarif estimatif", montant: 310, statut: "En attente", type: "devis" },
  { id: "FAC-2026-003", date: "25 jan. 2026", description: "Facture équipement optique complet", montant: 680, statut: "Payé", type: "facture" },
];

const MOCK_DOCUMENTS: DocumentRef[] = [
  { id: "doc-001", nom: "Carte vitale (scan)", type: "carte-vitale", date: "15 jan. 2026", visiblePatient: true },
  { id: "doc-002", nom: "Attestation mutuelle MGEN", type: "mutuelle", date: "10 jan. 2026", visiblePatient: true },
  { id: "doc-003", nom: "Ordonnance Dr. Aubert", type: "ordonnance", date: "15 jan. 2026", visiblePatient: true },
  { id: "doc-004", nom: "Compte-rendu optométrique complet", type: "compte-rendu", date: "20 jan. 2026", visiblePatient: false },
];

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: "t1", date: "Aujourd'hui", titre: "RDV — Contrôle annuel", sousTitre: "Dr. Paul Martin", type: "rdv" },
  { id: "t2", date: "25 jan. 2026", titre: "FAC-2026-003 réglée — 680€", sousTitre: "Paiement CB + Mutuelle", type: "facture" },
  { id: "t3", date: "20 jan. 2026", titre: "DEV-2026-003 — Équipement progressifs", sousTitre: "Devis accepté et facturé", type: "devis" },
  { id: "t4", date: "20 jan. 2026", titre: "Examen complet + prescription", sousTitre: "Dr. Sophie Aubert", type: "examen" },
  { id: "t5", date: "15 jan. 2026", titre: "Ordonnance Dr. Aubert", sousTitre: "Rx myopie − renouvellement", type: "ordonnance" },
  { id: "t6", date: "10 sep. 2025", titre: "DEV-2025-118 — Pack lentilles", sousTitre: "Devis accepté", type: "devis" },
];

/* ── Visit data (Vue d'ensemble redesign) ──────────────────────────────── */
type EquipementType = "lunettes-vue" | "lunettes-soleil" | "lentilles" | "divers";

interface VisiteRdv {
  id: string;
  date: string;       // ISO
  dateFr: string;
  typeEquipement: EquipementType;
  praticien?: string;
  corrections?: {
    od: { sph: string; cyl: string; axe: string; add?: string };
    og: { sph: string; cyl: string; axe: string; add?: string };
  };
  devis?: { id: string; montant: number; statut: string; description: string };
  pec?: { mutuelle: string; montantMutuelle: number; rac: number };
  facture?: { id: string; montant: number; statut: string };
  documents?: string[];
  notes?: string;
}

const EQUIPEMENT_META: Record<EquipementType, { label: string; icon: string; color: string; bg: string }> = {
  "lunettes-vue":    { label: "Lunettes de vue",    icon: "👓", color: "#2D8CFF", bg: "rgba(45,140,255,0.10)" },
  "lunettes-soleil": { label: "Lunettes de soleil",  icon: "😎", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  "lentilles":       { label: "Lentilles",           icon: "👁", color: "#00C98A", bg: "rgba(0,201,138,0.10)" },
  "divers":          { label: "Divers",              icon: "📎", color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
};

const MOCK_VISITES: VisiteRdv[] = [
  {
    id: "v1", date: "2026-01-20", dateFr: "20 jan. 2026",
    typeEquipement: "lunettes-vue", praticien: "Dr. Sophie Aubert",
    corrections: {
      od: { sph: "−2.25", cyl: "−0.50", axe: "170" },
      og: { sph: "−1.75", cyl: "−0.25", axe: "10" },
    },
    devis: { id: "DEV-2026-003", montant: 680, statut: "Facturé", description: "Progressifs Varilux X + Monture Ray-Ban" },
    pec: { mutuelle: "MGEN", montantMutuelle: 200, rac: 480 },
    facture: { id: "FAC-2026-003", montant: 680, statut: "Payé" },
    documents: ["Ordonnance Dr. Aubert", "Attestation mutuelle MGEN"],
    notes: "Myopie stable. Pas d'évolution depuis le dernier contrôle.",
  },
  {
    id: "v2", date: "2025-09-10", dateFr: "10 sept. 2025",
    typeEquipement: "lentilles", praticien: "Dr. Sophie Aubert",
    corrections: {
      od: { sph: "−2.00", cyl: "−0.50", axe: "165" },
      og: { sph: "−1.50", cyl: "−0.25", axe: "15" },
    },
    devis: { id: "DEV-2025-118", montant: 94.80, statut: "Accepté", description: "Pack lentilles 6 mois — Air Optix Aqua" },
    pec: { mutuelle: "MGEN", montantMutuelle: 30, rac: 64.80 },
    documents: ["Fiche de suivi lentilles"],
    notes: "Renouvellement lentilles Air Optix Aqua mensuelle.",
  },
  {
    id: "v3", date: "2025-05-02", dateFr: "2 mai 2025",
    typeEquipement: "lunettes-soleil",
    devis: { id: "DEV-2025-077", montant: 310, statut: "En attente", description: "Monture solaire sur mesure" },
  },
];

/* ── Helpers garanties ──────────────────────────────────────────────────── */
function joursAvantExpiration(dateISO: string): number {
  return Math.ceil((new Date(dateISO).getTime() - Date.now()) / 86400000);
}

function couleurGarantie(jours: number): { color: string; bg: string; label: string } {
  if (jours < 0)  return { color: "#EF4444", bg: "rgba(239,68,68,0.10)",   label: "Expirée" };
  if (jours < 30) return { color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: `Expire dans ${jours}j` };
  if (jours < 90) return { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  label: `Expire dans ${Math.ceil(jours / 30)}m` };
  return { color: "#10b981", bg: "rgba(16,185,129,0.10)", label: `Valide (${Math.ceil(jours / 30)}m)` };
}

const GARANTIE_ICONS: Record<GarantieItem["categorie"], string> = {
  monture:    "👓",
  verres:     "🔬",
  lentilles:  "👁",
  accessoire: "🔧",
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
function calcAge(dob: string): number {
  const b = new Date(dob);
  const n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) age--;
  return age;
}

function maskSS(ss: string): string {
  return ss.slice(0, 4) + " •••• •••• ••••";
}

function avatarColor(name: string): string {
  const colors = ["#6366f1","#2D8CFF","#00C98A","#F59E0B","#EC4899","#8B5CF6","#14B8A6","#EF4444"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

function formatEur(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

/* ── Statut meta ────────────────────────────────────────────────────────── */
const STATUT_META: Record<string, { color: string; bg: string; label: string }> = {
  "Facturé":    { color: "#15803D", bg: "rgba(21,128,61,0.10)",   label: "Facturé" },
  "Accepté":    { color: "#2D8CFF", bg: "rgba(45,140,255,0.10)", label: "Accepté" },
  "En attente": { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", label: "En attente" },
  "Refusé":     { color: "#EF4444", bg: "rgba(239,68,68,0.10)",  label: "Refusé" },
  "Payé":       { color: "#15803D", bg: "rgba(21,128,61,0.10)",  label: "Payé ✓" },
};

const DOC_ICONS: Record<DocumentRef["type"], string> = {
  "carte-vitale":  "🪪",
  "mutuelle":      "🏥",
  "ordonnance":    "📋",
  "compte-rendu":  "📄",
  "autre":         "📎",
};

const TIMELINE_META: Record<TimelineEvent["type"], { dot: string; icon: string }> = {
  rdv:        { dot: "#2D8CFF", icon: "📅" },
  devis:      { dot: "#6366f1", icon: "📄" },
  facture:    { dot: "#00C98A", icon: "🧾" },
  examen:     { dot: "#F59E0B", icon: "👁" },
  ordonnance: { dot: "#8B5CF6", icon: "📋" },
  document:   { dot: "#64748b", icon: "📎" },
};

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
function IconLock({ locked }: { locked: boolean }) {
  return locked ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ── Modal wrapper ──────────────────────────────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={glass}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <IconX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
      style={{ background: "rgba(30,30,40,0.92)", backdropFilter: "blur(12px)" }}>
      {msg}
    </div>
  );
}

/* ── Field helper ───────────────────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text", textarea }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean;
}) {
  const cls = "w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20 transition-all";
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={cls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
/* ── StoredPatient (from thor_pro_patients) ──────────────────────────── */
interface StoredPatient {
  id: string; nom: string; prenom: string; dateNaissance?: string;
  telephone?: string; email?: string; adresse?: string; codePostal?: string;
  ville?: string; mutuelle?: string; numeroSS?: string; notes?: string;
}

export default function PatientFichePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mockP = MOCK_PATIENTS[id] ?? null;
  const [patient, setPatient] = useState<PatientDetail | null>(mockP);
  const [loadingP, setLoadingP] = useState(!mockP);

  const [tab, setTab] = useState<Tab>("overview");
  const [examens, setExamens] = useState<ExamenClinique[]>(MOCK_EXAMENS);
  const [documents, setDocuments] = useState<DocumentRef[]>(MOCK_DOCUMENTS);
  const [notes, setNotes] = useState(mockP?.notes ?? "");
  const [toast, setToast] = useState<string | null>(null);
  const [visitOpen, setVisitOpen] = useState<Set<string>>(new Set());
  const [docDropModal, setDocDropModal] = useState<{ file: File; type: string; scanning: boolean; extracted: Record<string, string> } | null>(null);

  /* Modals */
  const [showExamenModal, setShowExamenModal] = useState(false);
  const [showRdvModal, setShowRdvModal]       = useState(false);
  const [showReglModal, setShowReglModal]     = useState(false);

  /* Nouvel examen */
  const [exForm, setExForm] = useState({
    date: "", type: "Examen complet", praticien: "Dr. Paul Martin",
    odSph: "", odCyl: "", odAxe: "", odAdd: "",
    ogSph: "", ogCyl: "", ogAxe: "", ogAdd: "",
    avOD: "", avOG: "", notes: "",
  });

  /* Règlement */
  const [reglForm, setReglForm] = useState({ montant: "", mode: "CB" });

  /* SAV */
  const [ticketsSAV, setTicketsSAV] = useState<TicketSAV[]>(MOCK_SAV);
  const [showSAVModal, setShowSAVModal] = useState(false);
  const [savForm, setSavForm] = useState({ objet: "", priorite: "Normale", description: "" });

  /* Ordonnances */
  const [ordonnances, setOrdonnances] = useState<OrdonnancePatient[]>(MOCK_ORDONNANCES);
  const [showOrdoModal, setShowOrdoModal] = useState(false);
  const EMPTY_ORDO = { dateOrdonnance: "", prescripteur: "", rpps: "", odSph: "", odCyl: "", odAxe: "", odAdd: "", ogSph: "", ogCyl: "", ogAxe: "", ogAdd: "", ep: "", remarques: "" };
  const [ordoForm, setOrdoForm] = useState(EMPTY_ORDO);
  function toggleOrdoVis(ordoId: string) {
    setOrdonnances(prev => prev.map(o => o.id === ordoId ? { ...o, visiblePatient: !o.visiblePatient } : o));
  }
  function handleAddOrdo() {
    if (!ordoForm.dateOrdonnance || !ordoForm.prescripteur || !ordoForm.odSph || !ordoForm.ogSph) {
      setToast("Veuillez remplir au minimum la date, le prescripteur et les sphères OD/OG."); return;
    }
    const dateExp = new Date(ordoForm.dateOrdonnance);
    dateExp.setFullYear(dateExp.getFullYear() + 1);
    const newOrdo: OrdonnancePatient = {
      id: `ord-${Date.now()}`,
      numero: `ORD-${new Date().getFullYear()}-${String(ordonnances.length + 1).padStart(3, "0")}`,
      dateOrdonnance: ordoForm.dateOrdonnance,
      dateExpiration: dateExp.toISOString().split("T")[0],
      prescripteur: ordoForm.prescripteur,
      rpps: ordoForm.rpps || undefined,
      od: { sphere: ordoForm.odSph, cylindre: ordoForm.odCyl, axe: ordoForm.odAxe, addition: ordoForm.odAdd },
      og: { sphere: ordoForm.ogSph, cylindre: ordoForm.ogCyl, axe: ordoForm.ogAxe, addition: ordoForm.ogAdd },
      ecartPupillaire: ordoForm.ep || undefined,
      remarques: ordoForm.remarques || undefined,
      visiblePatient: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setOrdonnances(prev => [newOrdo, ...prev]);
    setShowOrdoModal(false);
    setOrdoForm(EMPTY_ORDO);
    setToast("Ordonnance enregistrée.");
  }

  /* Garanties */
  const [garanties, setGaranties] = useState<GarantieItem[]>(MOCK_GARANTIES);
  const [showGarantieModal, setShowGarantieModal] = useState(false);
  const [garantieForm, setGarantieForm] = useState({
    produit: "", categorie: "monture" as GarantieItem["categorie"],
    numeroSerie: "", dateLivraison: "", garantieFabricant: "", garantieMagasin: "",
    fournisseur: "", devisId: "", notes: "",
  });

  // Load stored patient from localStorage if not a mock patient
  useEffect(() => {
    if (mockP) { setLoadingP(false); return; }
    try {
      const raw = localStorage.getItem("thor_pro_patients");
      if (raw) {
        const pats = JSON.parse(raw) as StoredPatient[];
        const found = pats.find(p => p.id === id);
        if (found) {
          const pd: PatientDetail = {
            id: found.id,
            firstName: found.prenom,
            lastName: found.nom,
            dob: found.dateNaissance || "",
            telephone: found.telephone || "",
            email: found.email || "",
            adresse: found.adresse || "",
            codePostal: found.codePostal || "",
            ville: found.ville || "",
            mutuelle: found.mutuelle || "",
            tiersPayant: undefined,
            numeroSS: found.numeroSS || "",
            notes: found.notes || "",
          };
          setPatient(pd);
          setNotes(pd.notes);
          setDevisFactures([]); // will be loaded in second useEffect
        }
      }
    } catch {}
    setLoadingP(false);
  }, [id, mockP]);

  /* RDV history depuis localStorage (patients réels uniquement) */
  type RdvItem = { id: string; date?: string; heure?: string; type?: string; statut?: string };
  const [rdvHistory, setRdvHistory] = useState<RdvItem[]>([]);

  useEffect(() => {
    if (!patient || mockP) return;
    try {
      const raw = localStorage.getItem("thor_pro_rdv");
      if (!raw) return;
      const all: Array<RdvItem & { patientNom?: string }> = JSON.parse(raw);
      const filtered = all.filter(r => r.patientNom?.toLowerCase() === patient.lastName.toLowerCase());
      setRdvHistory(filtered.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")));
    } catch {}
  }, [patient, mockP]);

  /* Devis & Factures depuis localStorage */
  const [devisFactures, setDevisFactures] = useState<DevisFactureRef[]>(MOCK_DEVIS_FACTURES_DEFAULT);

  useEffect(() => {
    if (!patient) return;
    try {
      const raw = localStorage.getItem("thor_pro_devis");
      if (!raw) return;
      const allDevis = JSON.parse(raw) as Array<{
        id: string; date: string; patientNom: string; patientPrenom: string;
        totalTTC: number; status: string; factureId: string;
      }>;
      const filtered = allDevis.filter(d =>
        d.patientNom.toLowerCase() === patient.lastName.toLowerCase()
      );
      if (filtered.length === 0) return;
      const mapped: DevisFactureRef[] = filtered.map(d => ({
        id: d.id,
        date: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
        description: `Devis ${d.id}`,
        montant: d.totalTTC,
        statut: (d.status === "Livré" || d.status === "Facturé") ? "Facturé" : d.status === "Brouillon" ? "En attente" : "Accepté",
        type: "devis" as const,
      }));
      const factures: DevisFactureRef[] = filtered
        .filter(d => d.factureId)
        .map(d => ({
          id: d.factureId,
          date: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
          description: `Facture ${d.factureId}`,
          montant: d.totalTTC,
          statut: "Payé" as const,
          type: "facture" as const,
        }));
      setDevisFactures([...mapped, ...factures]);
    } catch { /* garder les mock */ }
  }, [patient]);

  /* ── Timeline events depuis localStorage ──────────────────────────────── */
  const [timelineEvents, setTimelineEvents] = useState<TLEvent[]>([]);

  useEffect(() => {
    if (!patient) return;
    const firstName = patient.firstName.toLowerCase().trim();
    const lastName  = patient.lastName.toLowerCase().trim();
    const patId     = patient.id;

    function matchNomPrenom(item: Record<string, string>): boolean {
      const nom    = (item.patientNom    ?? item.nom    ?? "").toLowerCase().trim();
      const prenom = (item.patientPrenom ?? item.prenom ?? "").toLowerCase().trim();
      return nom === lastName && prenom === firstName;
    }

    function toTs(dateStr: string): number {
      if (!dateStr) return 0;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }

    function fmtDate(dateStr: string): string {
      if (!dateStr) return "—";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    }

    const events: TLEvent[] = [];

    // 1. Consultations (thor_pro_vision_consultations)
    try {
      const raw = localStorage.getItem("thor_pro_vision_consultations");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(c => c.patientId === patId || matchNomPrenom(c))
          .forEach(c => {
            const dateStr = c.date ?? c.createdAt ?? "";
            events.push({
              id:           `consult-${c.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "Consultation",
              titre:        c.motif ?? c.type ?? "Consultation",
              sousTitre:    [c.praticien, c.statut, c.notes].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // 2. RDV (thor_pro_rdv) — filtre par nom/prénom
    try {
      const raw = localStorage.getItem("thor_pro_rdv");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(r => matchNomPrenom(r))
          .forEach(r => {
            const dateStr = r.date ?? r.dateRdv ?? "";
            events.push({
              id:           `rdv-${r.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "RDV",
              titre:        r.motif ?? r.type ?? r.typeRdv ?? "RDV",
              sousTitre:    [r.heure, r.praticien, r.statut].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // 3. Ordonnances (thor_pro_vision_ordonnances)
    try {
      const raw = localStorage.getItem("thor_pro_vision_ordonnances");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(o => o.patientId === patId || matchNomPrenom(o))
          .forEach(o => {
            const dateStr = o.dateOrdonnance ?? o.date ?? o.createdAt ?? "";
            events.push({
              id:           `ordo-${o.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "Ordonnance",
              titre:        o.numero ?? o.id ?? "Ordonnance",
              sousTitre:    [o.prescripteur, o.remarques].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // 4. Devis (thor_pro_vision_devis)
    try {
      const raw = localStorage.getItem("thor_pro_vision_devis");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(d => d.patientId === patId || matchNomPrenom(d))
          .forEach(d => {
            const dateStr = d.date ?? d.createdAt ?? "";
            events.push({
              id:           `devis-${d.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "Devis",
              titre:        d.id ?? d.numero ?? "Devis",
              sousTitre:    [d.description, d.statut ?? d.status, d.totalTTC ? `${d.totalTTC} €` : ""].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // 5. Factures (thor_pro_vision_factures)
    try {
      const raw = localStorage.getItem("thor_pro_vision_factures");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(f => f.patientId === patId || matchNomPrenom(f))
          .forEach(f => {
            const dateStr = f.date ?? f.createdAt ?? "";
            events.push({
              id:           `facture-${f.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "Facture",
              titre:        f.id ?? f.numero ?? "Facture",
              sousTitre:    [f.description, f.statut ?? f.status, f.montantTTC ? `${f.montantTTC} €` : ""].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // 6. SAV (thor_pro_vision_sav)
    try {
      const raw = localStorage.getItem("thor_pro_vision_sav");
      if (raw) {
        const items = JSON.parse(raw) as Array<Record<string, string>>;
        items
          .filter(s => s.patientId === patId || matchNomPrenom(s))
          .forEach(s => {
            const dateStr = s.date ?? s.createdAt ?? "";
            events.push({
              id:           `sav-${s.id ?? Math.random()}`,
              date:         fmtDate(dateStr),
              dateSortable: toTs(dateStr),
              type:         "SAV",
              titre:        s.objet ?? s.id ?? "Ticket SAV",
              sousTitre:    [s.statut, s.priorite, s.notes].filter(Boolean).join(" · ").slice(0, 80),
            });
          });
      }
    } catch { /* ignore */ }

    // Tri du plus récent au plus ancien
    events.sort((a, b) => b.dateSortable - a.dateSortable);
    setTimelineEvents(events);
  }, [patient]);

  /* Patient introuvable / chargement */
  if (loadingP) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400 text-sm">Chargement…</div></div>;
  }
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-4xl">🔍</div>
        <p className="text-slate-500 text-sm">Patient introuvable.</p>
        <Link href="/clair-vision/pro/patients" className="text-sm font-medium text-[#2D8CFF] hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const age       = calcAge(patient.dob);
  const initiales = (patient.firstName[0] + patient.lastName[0]).toUpperCase();
  const couleur   = avatarColor(patient.firstName + patient.lastName);
  const totalCA   = devisFactures.filter(d => d.type === "facture").reduce((s, d) => s + d.montant, 0);
  const reglEnAttente = devisFactures.filter(d => d.statut === "En attente");

  function toggleExamenVis(exId: string) {
    setExamens(prev => prev.map(e => e.id === exId ? { ...e, visiblePatient: !e.visiblePatient } : e));
  }
  function toggleDocVis(docId: string) {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, visiblePatient: !d.visiblePatient } : d));
  }
  function handleAddExamen() {
    if (!exForm.date || !exForm.odSph || !exForm.ogSph) {
      setToast("Veuillez remplir au minimum la date et les sphères OD/OG."); return;
    }
    setExamens(prev => [{
      id: `ex-${Date.now()}`, date: exForm.date, praticien: exForm.praticien, type: exForm.type,
      od: { sph: exForm.odSph, cyl: exForm.odCyl, axe: exForm.odAxe, add: exForm.odAdd || undefined },
      og: { sph: exForm.ogSph, cyl: exForm.ogCyl, axe: exForm.ogAxe, add: exForm.ogAdd || undefined },
      avOD: exForm.avOD || undefined, avOG: exForm.avOG || undefined,
      notes: exForm.notes, visiblePatient: false,
    }, ...prev]);
    setShowExamenModal(false);
    setToast("Examen clinique ajouté.");
  }

  const garantiesProchesExpiration = garanties.filter(g => { const j = joursAvantExpiration(g.garantieFabricant); return j >= 0 && j < 90; }).length;
  const ordoExpirantBientot = ordonnances.filter(o => { const j = joursAvantExpiration(o.dateExpiration); return j >= 0 && j <= 60; }).length;

  function ordoExpirationMeta(dateISO: string): { color: string; bg: string; label: string } {
    const j = joursAvantExpiration(dateISO);
    if (j < 0)   return { color: "#EF4444", bg: "rgba(239,68,68,0.10)",   label: "Expirée" };
    if (j <= 30) return { color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  label: `Expire dans ${j}j` };
    if (j <= 90) return { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  label: `Expire dans ${Math.ceil(j / 30)}m` };
    return { color: "#10b981", bg: "rgba(16,185,129,0.10)", label: `Valide (${Math.ceil(j / 30)}m)` };
  }

  const TABS: { key: Tab; label: string; badge?: number; icon?: React.ReactNode }[] = [
    { key: "overview",     label: "Vue d'ensemble" },
    { key: "dossiers",     label: "Dossiers cliniques 🔒" },
    { key: "ordonnances",  label: "Ordonnances 📋", badge: ordoExpirantBientot },
    { key: "devis",        label: "Devis & Factures", badge: reglEnAttente.length },
    { key: "documents", label: "Documents" },
    { key: "notes",     label: "Notes 🔒" },
    { key: "sav",       label: "SAV & Suivi", badge: ticketsSAV.filter(t => t.statut === "Ouvert" || t.statut === "En cours").length },
    { key: "garanties", label: "Garanties 🔖", badge: garantiesProchesExpiration },
    {
      key: "timeline", label: "Timeline",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div className="space-y-5">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-5" style={glass}>
          <div className="flex flex-wrap items-start gap-4">
            <Link href="/clair-vision/pro/patients"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#2D8CFF] transition-colors mt-0.5 flex-shrink-0">
              <IconArrowLeft /> Patients
            </Link>
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="grid h-16 w-16 place-items-center rounded-2xl text-white text-xl font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${couleur}, ${couleur}bb)`, boxShadow: `0 4px 16px ${couleur}44` }}>
                {initiales}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-slate-800">{patient.firstName} {patient.lastName}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{age} ans · {patient.ville} · N°SS {maskSS(patient.numeroSS)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-600">
                  <span>📞 {patient.telephone}</span>
                  <span>✉ {patient.email}</span>
                  <span>🏥 {patient.mutuelle}{patient.tiersPayant ? ` · ${patient.tiersPayant}` : ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <Link href={`/clair-vision/pro/devis?patient=${patient.id}`}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 2px 8px rgba(99,102,241,0.30)" }}>
              + Nouveau devis
            </Link>
            <button onClick={() => setShowExamenModal(true)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.25)" }}>
              👁 Examen de vue
            </button>
            <button onClick={() => { setTab("ordonnances"); setShowOrdoModal(true); }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-white/60"
              style={{ ...glassSubtle, color: "#374151" }}>
              📋 Ordonnance
            </button>
            <Link href="/clair-vision/pro/facturation"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-white/60"
              style={{ ...glassSubtle, color: "#374151" }}>
              🧾 Facturer
            </Link>
            <button onClick={() => setShowRdvModal(true)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-white/60"
              style={{ ...glassSubtle, color: "#374151" }}>
              📅 Poser RDV
            </button>
            <button onClick={() => setToast("Télétransmission bientôt disponible.")}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-white/60"
              style={{ ...glassSubtle, color: "#374151" }}>
              📤 Télétransmettre
            </button>
          </div>
        </div>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div className="flex gap-5 items-start">

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Tab bar */}
            <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={glassSubtle}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    tab === t.key ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                  style={tab === t.key ? { background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" } : undefined}>
                  {t.icon && t.icon}
                  {t.label}
                  {t.badge != null && t.badge > 0 && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">{t.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Vue d'ensemble ──────────────────────────────────────── */}
            {tab === "overview" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-slate-700">Historique des visites</h2>
                  <span className="text-xs text-slate-400">{mockP ? MOCK_VISITES.length : rdvHistory.length} visite{(mockP ? MOCK_VISITES.length : rdvHistory.length) !== 1 ? "s" : ""}</span>
                </div>

                {/* Real patient: show RDV history from localStorage */}
                {!mockP && rdvHistory.length === 0 && (
                  <div className="rounded-2xl p-5 text-center text-sm text-slate-400" style={glassSubtle}>
                    Aucun rendez-vous enregistré pour ce patient.
                  </div>
                )}
                {!mockP && rdvHistory.map(rdv => {
                  const rdvMeta: Record<string, { label: string; icon: string; color: string; bg: string }> = {
                    examen:        { label: "Examen de vue",        icon: "👁",  color: "#2D8CFF", bg: "rgba(45,140,255,0.10)" },
                    controle:      { label: "Contrôle annuel",      icon: "✓",  color: "#00C98A", bg: "rgba(0,201,138,0.10)" },
                    adaptation:    { label: "Adaptation lentilles", icon: "🔬", color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
                    renouvellement:{ label: "Renouvellement",       icon: "🔄", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
                    livraison:     { label: "Livraison",            icon: "📦", color: "#64748b", bg: "rgba(100,116,139,0.10)" },
                    urgence:       { label: "Urgence",              icon: "🚨", color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
                  };
                  const m = rdvMeta[rdv.type ?? ""] ?? { label: rdv.type ?? "RDV", icon: "📅", color: "#2D8CFF", bg: "rgba(45,140,255,0.10)" };
                  const dateStr = rdv.date ? new Date(rdv.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";
                  const statutColor = rdv.statut === "confirme" ? "#00C98A" : rdv.statut === "arrive" ? "#2D8CFF" : "#94a3b8";
                  return (
                    <div key={rdv.id} className="rounded-2xl flex items-center gap-4 p-4" style={glass}>
                      <div className="grid h-10 w-10 place-items-center rounded-xl text-lg flex-shrink-0" style={{ background: m.bg }}>{m.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-400 mb-0.5">{dateStr}{rdv.heure ? ` · ${rdv.heure}` : ""}</div>
                        <div className="text-sm font-semibold text-slate-800">{m.label}</div>
                      </div>
                      {rdv.statut && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: `${statutColor}18`, color: statutColor }}>
                          {rdv.statut === "confirme" ? "Confirmé" : rdv.statut === "arrive" ? "Arrivé" : rdv.statut}
                        </span>
                      )}
                    </div>
                  );
                })}

                {mockP && MOCK_VISITES.map(visite => {
                  const meta = EQUIPEMENT_META[visite.typeEquipement];
                  const isOpen = visitOpen.has(visite.id);
                  return (
                    <div key={visite.id} className="rounded-2xl overflow-hidden" style={glass}>
                      {/* Visit header — always visible, clickable */}
                      <button
                        onClick={() => setVisitOpen(prev => { const next = new Set(prev); if (next.has(visite.id)) next.delete(visite.id); else next.add(visite.id); return next; })}
                        className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-white/30"
                      >
                        {/* Equipment icon */}
                        <div className="grid h-11 w-11 place-items-center rounded-xl text-xl flex-shrink-0"
                          style={{ background: meta.bg }}>
                          {meta.icon}
                        </div>
                        {/* Date + label */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-400 mb-0.5">{visite.dateFr}</div>
                          <div className="text-sm font-semibold text-slate-800">{meta.label}</div>
                          {visite.praticien && <div className="text-xs text-slate-500 mt-0.5">{visite.praticien}</div>}
                        </div>
                        {/* Status chips */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {visite.corrections && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(45,140,255,0.08)", color: "#2D8CFF" }}>Rx</span>
                          )}
                          {visite.facture && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(0,201,138,0.10)", color: "#00C98A" }}>Facturé</span>
                          )}
                          {visite.devis && !visite.facture && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                              style={visite.devis.statut === "En attente"
                                ? { background: "rgba(245,158,11,0.10)", color: "#F59E0B" }
                                : { background: "rgba(99,102,241,0.10)", color: "#6366f1" }}>
                              {visite.devis.statut}
                            </span>
                          )}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
                            style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div className="border-t border-slate-100 p-4 grid gap-4"
                          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>

                          {/* Corrections */}
                          {visite.corrections && (
                            <div className="rounded-xl p-3" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Corrections</div>
                              <div className="grid grid-cols-2 gap-2">
                                {(["OD", "OG"] as const).map(eye => {
                                  const rx = eye === "OD" ? visite.corrections!.od : visite.corrections!.og;
                                  return (
                                    <div key={eye}>
                                      <div className="text-[10px] font-semibold text-[#2D8CFF] mb-1">{eye}</div>
                                      <div className="text-xs text-slate-600 space-y-0.5">
                                        <div>Sph : <span className="font-medium text-slate-800">{rx.sph}</span></div>
                                        <div>Cyl : <span className="font-medium text-slate-800">{rx.cyl}</span></div>
                                        <div>Axe : <span className="font-medium text-slate-800">{rx.axe}</span></div>
                                        {rx.add && <div>Add : <span className="font-medium text-slate-800">{rx.add}</span></div>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Devis */}
                          {visite.devis && (
                            <div className="rounded-xl p-3" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Devis</div>
                              <div className="text-sm font-semibold text-slate-800">{formatEur(visite.devis.montant)}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{visite.devis.description}</div>
                              <div className="text-[11px] font-medium mt-2 px-2 py-0.5 rounded-full inline-block"
                                style={STATUT_META[visite.devis.statut] ? { background: STATUT_META[visite.devis.statut].bg, color: STATUT_META[visite.devis.statut].color } : {}}>
                                {visite.devis.statut}
                              </div>
                            </div>
                          )}

                          {/* PEC mutuelle */}
                          {visite.pec && (
                            <div className="rounded-xl p-3" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Prise en charge</div>
                              <div className="text-xs text-slate-600 space-y-1">
                                <div className="flex justify-between"><span>Mutuelle</span><span className="font-semibold text-slate-800">{visite.pec.mutuelle}</span></div>
                                <div className="flex justify-between"><span>Prise en charge</span><span className="font-semibold text-[#00C98A]">{formatEur(visite.pec.montantMutuelle)}</span></div>
                                <div className="flex justify-between border-t border-slate-100 pt-1"><span className="font-medium">RAC patient</span><span className="font-bold text-slate-800">{formatEur(visite.pec.rac)}</span></div>
                              </div>
                            </div>
                          )}

                          {/* Facture */}
                          {visite.facture && (
                            <div className="rounded-xl p-3" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Facture</div>
                              <div className="text-sm font-semibold text-slate-800">{formatEur(visite.facture.montant)}</div>
                              <div className="text-[11px] font-semibold mt-1" style={{ color: "#00C98A" }}>✓ {visite.facture.statut}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{visite.facture.id}</div>
                            </div>
                          )}

                          {/* Documents */}
                          {visite.documents && visite.documents.length > 0 && (
                            <div className="rounded-xl p-3" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Documents</div>
                              <div className="space-y-1.5">
                                {visite.documents.map((doc, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                    <span>📄</span> {doc}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {visite.notes && (
                            <div className="rounded-xl p-3 col-span-full" style={glassSubtle}>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Notes cliniques</div>
                              <p className="text-xs text-slate-600 italic leading-relaxed">{visite.notes}</p>
                            </div>
                          )}

                          {/* Lien dossier complet */}
                          <div className="col-span-full flex justify-end pt-1">
                            <Link
                              href={`/clair-vision/pro/patients/${id}/visites/${visite.id}`}
                              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.28)" }}
                            >
                              Ouvrir le dossier complet
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Dossiers cliniques ──────────────────────────────────── */}
            {tab === "dossiers" && (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    🔒 Les dossiers cliniques sont <strong>privés par défaut</strong>. Cliquez sur le cadenas pour les rendre visibles dans l&apos;espace patient.
                  </p>
                  <button onClick={() => setShowExamenModal(true)}
                    className="flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.20)" }}>
                    + Nouvel examen
                  </button>
                </div>

                {examens.map(ex => (
                  <div key={ex.id} className="rounded-2xl p-4" style={glass}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-sm font-semibold text-slate-800">{ex.type}</span>
                        <span className="ml-2 text-xs text-slate-400">{ex.date} · {ex.praticien}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleExamenVis(ex.id)}
                          title={ex.visiblePatient ? "Visible patient" : "Privé — non partagé"}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
                          style={ex.visiblePatient
                            ? { background: "rgba(0,201,138,0.10)", color: "#00C98A" }
                            : { background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                          <IconLock locked={!ex.visiblePatient} />
                          {ex.visiblePatient ? "🌐 Partagé" : "🔒 Privé"}
                        </button>
                        <button onClick={() => setToast("Impression…")}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                          🖨 Imprimer
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {(["OD", "OG"] as const).map(eye => {
                        const rx = eye === "OD" ? ex.od : ex.og;
                        const av = eye === "OD" ? ex.avOD : ex.avOG;
                        return (
                          <div key={eye} className="rounded-xl p-3" style={glassSubtle}>
                            <p className="text-xs font-semibold text-[#2D8CFF] mb-2">{eye}</p>
                            <div className="grid grid-cols-4 gap-1 text-xs text-slate-600 text-center">
                              {(["Sph","Cyl","Axe","Add"] as const).map(k => (
                                <div key={k}>
                                  <div className="text-[10px] text-slate-400 mb-0.5">{k}</div>
                                  <div className="font-medium">{k === "Sph" ? rx.sph : k === "Cyl" ? rx.cyl : k === "Axe" ? rx.axe : (rx.add ?? "—")}</div>
                                </div>
                              ))}
                            </div>
                            {av && <p className="mt-2 text-[11px] text-slate-500">AV : {av}</p>}
                          </div>
                        );
                      })}
                    </div>

                    {ex.notes && (
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed border-l-2 border-[#2D8CFF]/30 pl-3 italic">{ex.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Ordonnances ──────────────────────────────────────────── */}
            {tab === "ordonnances" && (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Les ordonnances marquées 🌐 sont visibles dans l&apos;espace patient.
                    L&apos;expiration est calculée à 1 an par défaut.
                  </p>
                  <button onClick={() => setShowOrdoModal(true)}
                    className="flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.20)" }}>
                    + Nouvelle ordonnance
                  </button>
                </div>

                {ordonnances.length === 0 && (
                  <p className="text-sm text-slate-400 italic text-center py-8">Aucune ordonnance enregistrée</p>
                )}

                {ordonnances.map(ord => {
                  const expMeta = ordoExpirationMeta(ord.dateExpiration);
                  const dateOrdFr = new Date(ord.dateOrdonnance).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                  const dateExpFr = new Date(ord.dateExpiration).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={ord.id} className="rounded-2xl p-4 space-y-3" style={glass}>
                      {/* Header ordonnance */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{ord.numero}</span>
                          <span className="ml-2 text-xs text-slate-400">{dateOrdFr} · {ord.prescripteur}</span>
                          {ord.rpps && <span className="ml-2 text-xs text-slate-400">RPPS {ord.rpps}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                            style={{ background: expMeta.bg, color: expMeta.color }}>
                            {expMeta.label}
                          </span>
                          <button onClick={() => toggleOrdoVis(ord.id)}
                            title={ord.visiblePatient ? "Visible patient" : "Privé"}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
                            style={ord.visiblePatient
                              ? { background: "rgba(0,201,138,0.10)", color: "#00C98A" }
                              : { background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                            <IconLock locked={!ord.visiblePatient} />
                            {ord.visiblePatient ? "🌐 Partagé" : "🔒 Privé"}
                          </button>
                          <button onClick={() => setToast(`Impression ${ord.numero}…`)}
                            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                            🖨 Imprimer
                          </button>
                        </div>
                      </div>

                      {/* Rx grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {(["OD", "OG"] as const).map(eye => {
                          const rx = eye === "OD" ? ord.od : ord.og;
                          return (
                            <div key={eye} className="rounded-xl p-3" style={glassSubtle}>
                              <p className="text-xs font-semibold text-[#2D8CFF] mb-2">{eye}</p>
                              <div className="grid grid-cols-4 gap-1 text-xs text-slate-600 text-center">
                                {(["Sph","Cyl","Axe","Add"] as const).map(k => (
                                  <div key={k}>
                                    <div className="text-[10px] text-slate-400 mb-0.5">{k}</div>
                                    <div className="font-medium">
                                      {k === "Sph" ? (rx.sphere || "—")
                                        : k === "Cyl" ? (rx.cylindre || "—")
                                        : k === "Axe" ? (rx.axe || "—")
                                        : (rx.addition || "—")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* EP + expiration + remarques */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {ord.ecartPupillaire && <span>EP : <strong className="text-slate-700">{ord.ecartPupillaire} mm</strong></span>}
                        <span>Valable jusqu&apos;au <strong className="text-slate-700">{dateExpFr}</strong></span>
                      </div>
                      {ord.remarques && (
                        <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-[#2D8CFF]/30 pl-3 italic">{ord.remarques}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Devis & Factures ────────────────────────────────────── */}
            {tab === "devis" && (
              <div className="rounded-2xl overflow-hidden" style={glass}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-700">Devis & Factures</h2>
                  <Link href={`/clair-vision/pro/devis?patient=${patient.id}`}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                    + Nouveau devis
                  </Link>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400">
                      <th className="text-left px-4 py-2.5 font-medium">N°</th>
                      <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Date</th>
                      <th className="text-left px-4 py-2.5 font-medium">Description</th>
                      <th className="text-right px-4 py-2.5 font-medium">Montant</th>
                      <th className="text-center px-4 py-2.5 font-medium">Statut</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {devisFactures.map(d => {
                      const meta = STATUT_META[d.statut] ?? STATUT_META["En attente"];
                      return (
                        <tr key={d.id} className="border-b border-slate-50 hover:bg-white/40 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{d.id}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap hidden sm:table-cell">{d.date}</td>
                          <td className="px-4 py-3 text-slate-700 max-w-[160px]">
                            <span className="truncate block text-xs">{d.description}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap text-xs">{formatEur(d.montant)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
                              style={{ background: meta.bg, color: meta.color }}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button onClick={() => setToast(`Aperçu ${d.id}`)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-[#2D8CFF] hover:bg-[#2D8CFF]/10 transition-colors">
                              Voir
                            </button>
                            {d.statut === "Accepté" && (
                              <Link href="/clair-vision/pro/facturation"
                                className="ml-1 rounded-lg px-2 py-1 text-xs font-medium text-[#6366f1] hover:bg-[#6366f1]/10 transition-colors">
                                Facturer
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Documents ────────────────────────────────────────────── */}
            {tab === "documents" && (
              <div className="space-y-3">
                {/* Drop zone */}
                <div
                  className="rounded-2xl p-6 border-2 border-dashed text-center cursor-pointer transition-colors"
                  style={{ borderColor: "rgba(45,140,255,0.3)", background: "rgba(45,140,255,0.03)" }}
                  onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.background = "rgba(45,140,255,0.07)"; }}
                  onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(45,140,255,0.03)"; }}
                  onDrop={e => {
                    e.preventDefault();
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(45,140,255,0.03)";
                    const file = e.dataTransfer.files[0];
                    if (file) setDocDropModal({ file, type: "", scanning: false, extracted: {} });
                  }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.jpg,.jpeg,.png";
                    input.onchange = () => {
                      const file = input.files?.[0];
                      if (file) setDocDropModal({ file, type: "", scanning: false, extracted: {} });
                    };
                    input.click();
                  }}
                >
                  <div className="text-3xl mb-2">📂</div>
                  <p className="text-sm font-semibold text-slate-600">Glissez un document ici</p>
                  <p className="text-xs text-slate-400 mt-1">ou cliquez pour parcourir · PDF, JPG, PNG</p>
                </div>

                {/* Doc type modal */}
                {docDropModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
                    <div className="w-full max-w-md rounded-2xl p-6" style={glass}>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-semibold text-slate-800">Quel type de document ?</h3>
                        <button onClick={() => setDocDropModal(null)} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                          <IconX />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">📎 {docDropModal.file.name}</p>

                      {!docDropModal.scanning && Object.keys(docDropModal.extracted).length === 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            ["ordonnance", "📋", "Ordonnance"],
                            ["mutuelle", "🏥", "Attestation mutuelle"],
                            ["carte-vitale", "🪪", "Carte vitale"],
                            ["compte-rendu", "📄", "Compte-rendu"],
                            ["autre", "📎", "Autre document"],
                          ] as const).map(([type, icon, label]) => (
                            <button key={type}
                              onClick={() => {
                                setDocDropModal(m => m ? { ...m, type, scanning: true } : null);
                                // Mock OCR: after 1.5s, pre-fill extracted data
                                setTimeout(() => {
                                  const extracted: Record<string, string> = type === "ordonnance"
                                    ? { prescripteur: "Dr. Sophie Aubert", rpps: "10004587412", date: "2026-03-20", typeOrdo: "Lunettes de vue", odSph: "−2.25", odCyl: "−0.50", odAxe: "170", ogSph: "−1.75", ogCyl: "−0.25", ogAxe: "10", ep: "64" }
                                    : type === "mutuelle"
                                    ? { mutuelle: "MGEN", reseau: "Réseau Carte Blanche", adherent: "2850469001234", dateDebut: "2026-01-01", dateFin: "2026-12-31" }
                                    : {};
                                  setDocDropModal(m => m ? { ...m, scanning: false, extracted } : null);
                                }, 1500);
                              }}
                              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-[#2D8CFF] transition-all"
                              style={glassSubtle}>
                              <span className="text-2xl">{icon}</span>
                              <span className="text-xs font-semibold text-slate-700 text-center">{label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {docDropModal.scanning && (
                        <div className="text-center py-8">
                          <div className="text-3xl mb-3 animate-pulse">🔍</div>
                          <p className="text-sm font-semibold text-slate-700">Analyse du document en cours…</p>
                          <p className="text-xs text-slate-400 mt-1">Extraction des informations</p>
                        </div>
                      )}

                      {!docDropModal.scanning && Object.keys(docDropModal.extracted).length > 0 && (
                        <div>
                          <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(0,201,138,0.08)", border: "1px solid rgba(0,201,138,0.25)" }}>
                            <p className="text-xs font-semibold text-[#00C98A] mb-2">✓ Données extraites automatiquement</p>
                            <div className="space-y-1">
                              {Object.entries(docDropModal.extracted).map(([k, v]) => (
                                <div key={k} className="flex justify-between text-xs">
                                  <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                                  <span className="font-medium text-slate-800">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setDocDropModal(null)} className="flex-1 rounded-xl py-2 text-sm font-medium text-slate-500 transition-colors" style={glassSubtle}>
                              Annuler
                            </button>
                            <button
                              onClick={() => {
                                const nom = docDropModal.type === "ordonnance" ? `Ordonnance ${docDropModal.extracted.prescripteur ?? ""}`.trim()
                                  : docDropModal.type === "mutuelle" ? `Attestation ${docDropModal.extracted.mutuelle ?? ""}`.trim()
                                  : docDropModal.file.name;
                                setDocuments(prev => [{ id: `doc-${Date.now()}`, nom, type: docDropModal.type as DocumentRef["type"], date: new Date().toISOString().split("T")[0], visiblePatient: false }, ...prev]);
                                setToast("Document enregistré.");
                                setDocDropModal(null);
                              }}
                              className="flex-1 rounded-xl py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Existing documents list */}
                {documents.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-6">Aucun document enregistré</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center gap-3 rounded-xl p-3" style={glass}>
                        <span className="text-xl flex-shrink-0">{DOC_ICONS[doc.type]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{doc.nom}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{doc.date}</div>
                        </div>
                        <button onClick={() => toggleDocVis(doc.id)}
                          title={doc.visiblePatient ? "Visible patient" : "Privé"}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors flex-shrink-0"
                          style={doc.visiblePatient ? { background: "rgba(0,201,138,0.10)", color: "#00C98A" } : { background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                          <IconLock locked={!doc.visiblePatient} />
                          {doc.visiblePatient ? "🌐" : "🔒"}
                        </button>
                        <button onClick={() => setToast("Téléchargement…")} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0">
                          ⬇
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Notes ───────────────────────────────────────────────── */}
            {tab === "notes" && (
              <div className="rounded-2xl p-5 space-y-4" style={glass}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Notes internes</h2>
                  <span className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                    🔒 Jamais partagé avec le patient
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={10}
                  placeholder="Notes internes sur ce patient…"
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 leading-relaxed outline-none focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20 transition-all resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Dernière modification : 15 jan. 2026 · Dr. Paul Martin</p>
                  <button onClick={() => setToast("Notes enregistrées.")}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.15)" }}>
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
            {/* ── Garanties ───────────────────────────────────────────── */}
            {tab === "garanties" && (
              <div className="space-y-3">
                <div className="flex items-center justify-end">
                  <button onClick={() => setShowGarantieModal(true)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.20)" }}>
                    + Ajouter une garantie
                  </button>
                </div>
                {garanties.map(g => {
                  const joursF = joursAvantExpiration(g.garantieFabricant);
                  const joursM = joursAvantExpiration(g.garantieMagasin);
                  const metaF  = couleurGarantie(joursF);
                  const metaM  = couleurGarantie(joursM);
                  const livreDate = new Date(g.dateLivraison).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                  // Barre de progression fabricant (durée totale = dateLivraison → garantieFabricant)
                  const totalFMs = new Date(g.garantieFabricant).getTime() - new Date(g.dateLivraison).getTime();
                  const passeFMs = Date.now() - new Date(g.dateLivraison).getTime();
                  const pctF = Math.min(100, Math.max(0, Math.round((passeFMs / totalFMs) * 100)));
                  const totalMMs = new Date(g.garantieMagasin).getTime() - new Date(g.dateLivraison).getTime();
                  const passeMMs = Date.now() - new Date(g.dateLivraison).getTime();
                  const pctM = Math.min(100, Math.max(0, Math.round((passeMMs / totalMMs) * 100)));
                  return (
                    <div key={g.id} className="rounded-2xl p-4 space-y-3" style={glass}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-2">
                          <span className="text-2xl flex-shrink-0">{GARANTIE_ICONS[g.categorie]}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{g.produit}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {g.numeroSerie && <span>N° série : {g.numeroSerie} · </span>}
                              {g.fournisseur && <span>Fournisseur : {g.fournisseur}</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Livré le {livreDate}
                              {g.devisId && <span> · Lié à {g.devisId}</span>}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setTab("sav"); setSavForm(f => ({ ...f, objet: g.produit })); }}
                          className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-[#2D8CFF] hover:bg-[#2D8CFF]/10 transition-colors"
                          style={glassSubtle}>
                          SAV →
                        </button>
                      </div>
                      {/* Barre garantie fabricant */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Garantie fabricant</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: metaF.bg, color: metaF.color }}>{metaF.label}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pctF}%`, background: metaF.color }} />
                        </div>
                      </div>
                      {/* Barre garantie magasin */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Garantie magasin</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: metaM.bg, color: metaM.color }}>{metaM.label}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pctM}%`, background: metaM.color }} />
                        </div>
                      </div>
                      {g.notes && (
                        <p className="text-xs text-slate-500 italic border-l-2 border-[#2D8CFF]/30 pl-3">{g.notes}</p>
                      )}
                    </div>
                  );
                })}
                {garanties.length === 0 && (
                  <p className="text-sm text-slate-400 italic text-center py-8">Aucune garantie enregistrée</p>
                )}
              </div>
            )}

            {/* ── SAV & Suivi ─────────────────────────────────────────── */}
            {tab === "sav" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{ticketsSAV.length} ticket(s) — {ticketsSAV.filter(t => t.statut === "Ouvert" || t.statut === "En cours").length} en cours</p>
                  <button onClick={() => setShowSAVModal(true)} className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 2px 8px rgba(45,140,255,0.20)" }}>
                    + Nouveau ticket SAV
                  </button>
                </div>
                {ticketsSAV.map(ticket => {
                  const statutColor = { "Ouvert": "#EF4444", "En cours": "#F59E0B", "Chez fournisseur": "#8B5CF6", "Résolu": "#10b981", "Fermé": "#64748b" }[ticket.statut];
                  const prioriteColor = { "Basse": "#64748b", "Normale": "#2D8CFF", "Haute": "#F59E0B", "Urgente": "#EF4444" }[ticket.priorite];
                  return (
                    <div key={ticket.id} className="rounded-2xl p-4" style={glass}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-slate-400">{ticket.id}</span>
                            <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: `${statutColor}18`, color: statutColor }}>{ticket.statut}</span>
                            <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: `${prioriteColor}18`, color: prioriteColor }}>⚡ {ticket.priorite}</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{ticket.objet}</p>
                          <p className="mt-1 text-xs text-slate-500">{ticket.date}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed">{ticket.description}</p>
                      {ticket.notes && (
                        <p className="mt-2 text-xs italic text-slate-400 border-l-2 border-slate-200 pl-3">{ticket.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Timeline ─────────────────────────────────────────────── */}
            {tab === "timeline" && (() => {
              const TL_BADGE: Record<string, { color: string; bg: string }> = {
                "Consultation": { color: "#2D8CFF", bg: "rgba(45,140,255,0.12)" },
                "RDV":          { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
                "Ordonnance":   { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
                "Devis":        { color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
                "Facture":      { color: "#059669", bg: "rgba(5,150,105,0.12)"   },
                "SAV":          { color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
              };
              return (
                <div className="rounded-2xl p-5" style={glass}>
                  <div className="flex items-center gap-2 mb-5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <h2 className="text-sm font-semibold text-slate-700">Chronologie du patient</h2>
                    <span className="ml-auto text-xs text-slate-400">{timelineEvents.length} événement{timelineEvents.length !== 1 ? "s" : ""}</span>
                  </div>

                  {timelineEvents.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: "10px" }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>Aucun événement enregistré pour ce patient.</p>
                    </div>
                  ) : (
                    <div style={{ position: "relative", paddingLeft: "28px" }}>
                      {/* Ligne verticale */}
                      <div style={{
                        position: "absolute",
                        left: "7px",
                        top: "8px",
                        bottom: "8px",
                        width: "2px",
                        background: "linear-gradient(to bottom, #e2e8f0 0%, rgba(226,232,240,0) 100%)",
                        borderRadius: "2px",
                      }} />

                      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                        {timelineEvents.map((ev, idx) => {
                          const bm = TL_BADGE[ev.type] ?? { color: "#64748b", bg: "rgba(100,116,139,0.12)" };
                          const isLast = idx === timelineEvents.length - 1;
                          return (
                            <div key={ev.id} style={{ position: "relative", paddingBottom: isLast ? "0" : "20px" }}>
                              {/* Dot */}
                              <div style={{
                                position: "absolute",
                                left: "-24px",
                                top: "12px",
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: bm.color,
                                border: "2px solid white",
                                boxShadow: `0 0 0 2px ${bm.color}40`,
                                flexShrink: 0,
                              }} />
                              {/* Card */}
                              <div style={{
                                background: "rgba(255,255,255,0.55)",
                                border: "1px solid rgba(255,255,255,0.72)",
                                borderRadius: "14px",
                                padding: "12px 14px",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                              }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                                  {/* Badge type */}
                                  <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "2px 10px",
                                    borderRadius: "999px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    background: bm.bg,
                                    color: bm.color,
                                    flexShrink: 0,
                                    lineHeight: "1.6",
                                  }}>
                                    {ev.type}
                                  </span>
                                  {/* Date */}
                                  <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto", flexShrink: 0, paddingTop: "2px" }}>
                                    {ev.date}
                                  </span>
                                </div>
                                {/* Titre */}
                                <p style={{ marginTop: "6px", fontSize: "13px", fontWeight: 600, color: "#1e293b", lineHeight: "1.4" }}>
                                  {ev.titre}
                                </p>
                                {/* Sous-titre */}
                                {ev.sousTitre && (
                                  <p style={{ marginTop: "3px", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                                    {ev.sousTitre}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ── PANNEAU DROIT ─────────────────────────────────────────── */}
          <div className="w-72 flex-shrink-0 space-y-4 hidden lg:block">

            {/* Règlements en attente */}
            <div className="rounded-2xl p-4 space-y-3" style={glass}>
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">⏳ Règlements en attente</h3>
              {reglEnAttente.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucun règlement en attente</p>
              ) : reglEnAttente.map(d => (
                <div key={d.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-slate-700">{d.id}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{d.description}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ background: "#EF4444" }}>
                      {formatEur(d.montant)}
                    </span>
                  </div>
                  <button onClick={() => setShowReglModal(true)}
                    className="w-full rounded-xl py-2 text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}>
                    Encaisser le règlement
                  </button>
                </div>
              ))}
            </div>

            {/* Prochain RDV */}
            <div className="rounded-2xl p-4 space-y-2" style={glass}>
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">📅 Prochain RDV</h3>
              <div className="rounded-xl p-3 space-y-1" style={glassSubtle}>
                <p className="text-sm font-semibold text-slate-800">Jeu. 26 mar. 2026 · 10h30</p>
                <p className="text-xs text-slate-500">Contrôle annuel</p>
                <p className="text-xs text-slate-400">Dr. Paul Martin</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowRdvModal(true)}
                  className="flex-1 rounded-xl py-1.5 text-xs font-medium text-[#2D8CFF] hover:bg-[#2D8CFF]/10 transition-colors"
                  style={glassSubtle}>
                  Modifier
                </button>
                <button onClick={() => setToast("RDV annulé.")}
                  className="flex-1 rounded-xl py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  style={glassSubtle}>
                  Annuler
                </button>
              </div>
            </div>

            {/* Garanties actives */}
            <div className="rounded-2xl p-4 space-y-2" style={glass}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">🔖 Garanties</h3>
              {garanties.slice(0, 3).map(g => {
                const joursF = joursAvantExpiration(g.garantieFabricant);
                const meta = couleurGarantie(joursF);
                return (
                  <div key={g.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate flex-1 mr-2">{g.produit.slice(0, 28)}…</span>
                    <span className="rounded-full px-2 py-0.5 font-medium flex-shrink-0 text-[10px]"
                      style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                  </div>
                );
              })}
              {garanties.length === 0 && <p className="text-xs text-slate-400 italic">Aucune garantie enregistrée</p>}
            </div>

            {/* Résumé */}
            <div className="rounded-2xl p-4 space-y-2" style={glass}>
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">📊 Résumé</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                {[
                  ["Ordonnances",   ordonnances.length.toString()],
                  ["Devis",         devisFactures.filter(d => d.type === "devis").length.toString()],
                  ["Factures",      devisFactures.filter(d => d.type === "facture").length.toString()],
                  ["CA total",      formatEur(totalCA)],
                  ["Dernière visite","20 jan. 2026"],
                  ["Prochain renouv.","Jan. 2027"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-400">{label}</span>
                    <span className={`font-medium ${label === "CA total" ? "text-slate-800 font-semibold" : ""}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MODAL : Nouvel examen ────────────────────────────────────────── */}
      {showExamenModal && (
        <Modal title="Nouvel examen clinique" onClose={() => setShowExamenModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" value={exForm.date} onChange={v => setExForm(f => ({ ...f, date: v }))} type="date" />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Type d&apos;examen</label>
                <select value={exForm.type} onChange={e => setExForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2D8CFF] transition-all">
                  {["Examen complet","Contrôle","Renouvellement","Adaptation lentilles"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <Field label="Praticien" value={exForm.praticien} onChange={v => setExForm(f => ({ ...f, praticien: v }))} />
            <div className="grid grid-cols-2 gap-4">
              {(["OD","OG"] as const).map(eye => {
                const isOD = eye === "OD";
                return (
                  <div key={eye} className="space-y-2">
                    <p className="text-xs font-semibold text-[#2D8CFF]">Œil {isOD ? "droit" : "gauche"} ({eye})</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Sph" value={isOD ? exForm.odSph : exForm.ogSph} onChange={v => setExForm(f => isOD ? ({ ...f, odSph: v }) : ({ ...f, ogSph: v }))} />
                      <Field label="Cyl" value={isOD ? exForm.odCyl : exForm.ogCyl} onChange={v => setExForm(f => isOD ? ({ ...f, odCyl: v }) : ({ ...f, ogCyl: v }))} />
                      <Field label="Axe" value={isOD ? exForm.odAxe : exForm.ogAxe} onChange={v => setExForm(f => isOD ? ({ ...f, odAxe: v }) : ({ ...f, ogAxe: v }))} />
                      <Field label="Add" value={isOD ? exForm.odAdd : exForm.ogAdd} onChange={v => setExForm(f => isOD ? ({ ...f, odAdd: v }) : ({ ...f, ogAdd: v }))} />
                    </div>
                    <Field label="Acuité visuelle" value={isOD ? exForm.avOD : exForm.avOG} onChange={v => setExForm(f => isOD ? ({ ...f, avOD: v }) : ({ ...f, avOG: v }))} />
                  </div>
                );
              })}
            </div>
            <Field label="Notes cliniques" value={exForm.notes} onChange={v => setExForm(f => ({ ...f, notes: v }))} textarea />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowExamenModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Annuler</button>
              <button onClick={handleAddExamen} className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                Enregistrer l&apos;examen
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL : RDV ─────────────────────────────────────────────────── */}
      {showRdvModal && (
        <Modal title="Poser un rendez-vous" onClose={() => setShowRdvModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" value="" onChange={() => {}} type="date" />
              <Field label="Heure" value="" onChange={() => {}} type="time" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Type de RDV</label>
              <select className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2D8CFF] transition-all">
                {["Contrôle annuel","Examen complet","Adaptation lentilles","Renouvellement","Première consultation"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Notes (optionnel)" value="" onChange={() => {}} textarea />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowRdvModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Annuler</button>
              <button onClick={() => { setShowRdvModal(false); setToast("RDV planifié."); }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                Confirmer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL : Règlement ───────────────────────────────────────────── */}
      {showReglModal && (
        <Modal title="Enregistrer un règlement" onClose={() => setShowReglModal(false)}>
          <div className="space-y-4">
            <Field label="Montant (€)" value={reglForm.montant} onChange={v => setReglForm(f => ({ ...f, montant: v }))} type="number" />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Mode de règlement</label>
              <div className="grid grid-cols-3 gap-2">
                {["CB","Espèces","Chèque","Mutuelle","Sécurité Sociale","Virement"].map(m => (
                  <button key={m} onClick={() => setReglForm(f => ({ ...f, mode: m }))}
                    className="rounded-xl py-2 text-xs font-medium transition-all"
                    style={reglForm.mode === m
                      ? { background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", color: "white" }
                      : { ...glassSubtle, color: "#374151" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowReglModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Annuler</button>
              <button onClick={() => { setShowReglModal(false); setToast(`Règlement de ${reglForm.montant}€ enregistré (${reglForm.mode}).`); }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #00C98A, #00A87A)" }}>
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL : Ajouter une garantie ────────────────────────────────── */}
      {showGarantieModal && (
        <Modal title="Ajouter une garantie" onClose={() => setShowGarantieModal(false)}>
          <div className="space-y-4">
            <Field label="Produit" value={garantieForm.produit} onChange={v => setGarantieForm(f => ({ ...f, produit: v }))} />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Catégorie</label>
              <select
                value={garantieForm.categorie}
                onChange={e => setGarantieForm(f => ({ ...f, categorie: e.target.value as GarantieItem["categorie"] }))}
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#2D8CFF] transition-all">
                <option value="monture">👓 Monture</option>
                <option value="verres">🔬 Verres</option>
                <option value="lentilles">👁 Lentilles</option>
                <option value="accessoire">🔧 Accessoire</option>
              </select>
            </div>
            <Field label="N° de série (optionnel)" value={garantieForm.numeroSerie} onChange={v => setGarantieForm(f => ({ ...f, numeroSerie: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de livraison" value={garantieForm.dateLivraison} onChange={v => setGarantieForm(f => ({ ...f, dateLivraison: v }))} type="date" />
              <Field label="Fin garantie fabricant" value={garantieForm.garantieFabricant} onChange={v => setGarantieForm(f => ({ ...f, garantieFabricant: v }))} type="date" />
            </div>
            <Field label="Fin garantie magasin" value={garantieForm.garantieMagasin} onChange={v => setGarantieForm(f => ({ ...f, garantieMagasin: v }))} type="date" />
            <Field label="Fournisseur (optionnel)" value={garantieForm.fournisseur} onChange={v => setGarantieForm(f => ({ ...f, fournisseur: v }))} />
            <Field label="Lié au devis (optionnel)" value={garantieForm.devisId} onChange={v => setGarantieForm(f => ({ ...f, devisId: v }))} />
            <Field label="Notes (optionnel)" value={garantieForm.notes} onChange={v => setGarantieForm(f => ({ ...f, notes: v }))} textarea />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowGarantieModal(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                Annuler
              </button>
              <button onClick={() => {
                if (!garantieForm.produit || !garantieForm.dateLivraison || !garantieForm.garantieFabricant || !garantieForm.garantieMagasin) {
                  setToast("Veuillez remplir au minimum le produit, la date de livraison et les fins de garantie.");
                  return;
                }
                const newGar: GarantieItem = {
                  id: `gar-${Date.now()}`,
                  produit: garantieForm.produit,
                  categorie: garantieForm.categorie,
                  numeroSerie: garantieForm.numeroSerie || undefined,
                  dateLivraison: garantieForm.dateLivraison,
                  garantieFabricant: garantieForm.garantieFabricant,
                  garantieMagasin: garantieForm.garantieMagasin,
                  fournisseur: garantieForm.fournisseur || undefined,
                  devisId: garantieForm.devisId || undefined,
                  notes: garantieForm.notes || undefined,
                };
                setGaranties(prev => [newGar, ...prev]);
                setShowGarantieModal(false);
                setGarantieForm({ produit: "", categorie: "monture", numeroSerie: "", dateLivraison: "", garantieFabricant: "", garantieMagasin: "", fournisseur: "", devisId: "", notes: "" });
                setToast("Garantie enregistrée.");
              }} className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL : Nouvelle ordonnance ─────────────────────────────────── */}
      {showOrdoModal && (
        <Modal title="Nouvelle ordonnance" onClose={() => { setShowOrdoModal(false); setOrdoForm(EMPTY_ORDO); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de l'ordonnance" value={ordoForm.dateOrdonnance} onChange={v => setOrdoForm(f => ({ ...f, dateOrdonnance: v }))} type="date" />
              <Field label="EP (mm)" value={ordoForm.ep} onChange={v => setOrdoForm(f => ({ ...f, ep: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prescripteur" value={ordoForm.prescripteur} onChange={v => setOrdoForm(f => ({ ...f, prescripteur: v }))} />
              <Field label="N° RPPS (optionnel)" value={ordoForm.rpps} onChange={v => setOrdoForm(f => ({ ...f, rpps: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(["OD","OG"] as const).map(eye => {
                const isOD = eye === "OD";
                return (
                  <div key={eye} className="space-y-2">
                    <p className="text-xs font-semibold text-[#2D8CFF]">Œil {isOD ? "droit" : "gauche"} ({eye})</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Sph" value={isOD ? ordoForm.odSph : ordoForm.ogSph} onChange={v => setOrdoForm(f => isOD ? ({ ...f, odSph: v }) : ({ ...f, ogSph: v }))} />
                      <Field label="Cyl" value={isOD ? ordoForm.odCyl : ordoForm.ogCyl} onChange={v => setOrdoForm(f => isOD ? ({ ...f, odCyl: v }) : ({ ...f, ogCyl: v }))} />
                      <Field label="Axe" value={isOD ? ordoForm.odAxe : ordoForm.ogAxe} onChange={v => setOrdoForm(f => isOD ? ({ ...f, odAxe: v }) : ({ ...f, ogAxe: v }))} />
                      <Field label="Add" value={isOD ? ordoForm.odAdd : ordoForm.ogAdd} onChange={v => setOrdoForm(f => isOD ? ({ ...f, odAdd: v }) : ({ ...f, ogAdd: v }))} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Field label="Remarques (optionnel)" value={ordoForm.remarques} onChange={v => setOrdoForm(f => ({ ...f, remarques: v }))} textarea />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowOrdoModal(false); setOrdoForm(EMPTY_ORDO); }}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                Annuler
              </button>
              <button onClick={handleAddOrdo}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                Enregistrer l&apos;ordonnance
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL : Nouveau ticket SAV ───────────────────────────────────── */}
      {showSAVModal && (
        <Modal title="Nouveau ticket SAV" onClose={() => setShowSAVModal(false)}>
          <div className="space-y-4">
            <Field label="Objet" value={savForm.objet} onChange={v => setSavForm(f => ({ ...f, objet: v }))} />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Priorité</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Basse","Normale","Haute","Urgente"] as const).map(p => (
                  <button key={p} onClick={() => setSavForm(f => ({ ...f, priorite: p }))}
                    className="rounded-xl py-1.5 text-xs font-medium transition-all"
                    style={savForm.priorite === p
                      ? { background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", color: "white" }
                      : { ...glassSubtle, color: "#374151" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Description" value={savForm.description} onChange={v => setSavForm(f => ({ ...f, description: v }))} textarea />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowSAVModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">Annuler</button>
              <button onClick={() => {
                if (!savForm.objet) { setToast("Veuillez remplir l'objet."); return; }
                const newTicket: TicketSAV = { id: `SAV-${new Date().getFullYear()}-${Math.floor(Math.random()*900)+100}`, date: new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" }), objet: savForm.objet, statut: "Ouvert", priorite: savForm.priorite as TicketSAV["priorite"], description: savForm.description };
                setTicketsSAV(prev => [newTicket, ...prev]);
                setShowSAVModal(false);
                setToast("Ticket SAV créé.");
              }} className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)" }}>
                Créer le ticket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
