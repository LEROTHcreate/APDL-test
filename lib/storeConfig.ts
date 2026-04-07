/* ═══════════════════════════════════════════════════════════════
   THOR – Configuration du cabinet / enseigne praticien
   Stockée en localStorage (pas de backend).
   ═══════════════════════════════════════════════════════════════ */

export interface StoreConfig {
  /** Nom affiché dans la sidebar (remplace "Clair Vision") */
  nom: string;
  /** Logo en Base64 (data:image/…;base64,…) ou URL — remplace l'icône œil */
  logo?: string;
  /** Adresse */
  adresse?: string;
  codePostal?: string;
  ville?: string;
  /** Coordonnées */
  telephone?: string;
  email?: string;
  /** Identifiants réglementaires (utilisés dans devis normalisés) */
  siret?: string;
  adeli?: string;
  rpps?: string;
  /** Couleur d'accentuation du thème (hex) — défaut #2D8CFF pour vision */
  accentColor?: string;
  /** Coefficients de tarification par catégorie */
  coefficients?: {
    "verres-progressifs"?: number;
    "verres-simples"?: number;
    "montures-optiques"?: number;
    "montures-solaires"?: number;
    "lentilles-souples"?: number;
    "lentilles-rigides"?: number;
    "accessoires"?: number;
  };
  /** Mentions légales personnalisées pour les devis */
  mentionsDevis?: string;
  /** Signature numérique du responsable (base64 image ou SVG) */
  signatureBase64?: string;
  /** Cachet / tampon du cabinet (base64 image) */
  cachetBase64?: string;
  /** Nom et titre du signataire (ex: "Nicolas Garnier — Gérant") */
  signataire?: string;
  /** Numéro RPPS du signataire */
  signataireRPPS?: string;
  /** Numéro FINESS de l'établissement */
  finess?: string;
  /** TVA par défaut */
  tauxTVA?: 5.5 | 20;
  /** Horaires (déjà géré dans page, migrer ici) */
  horaires?: Record<string, { ouvert: boolean; ouverture: string; fermeture: string }>;
  /** Pause déjeuner */
  pauseMidi?: { active: boolean; debut: string; fin: string };
  /** Verriers (fournisseurs de verres) sélectionnés par le gérant */
  verriers?: string[];
}

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  nom:        "Clair Vision",
  adresse:    "12 rue de la Paix",
  codePostal: "75001",
  ville:      "Paris",
  telephone:  "01 23 45 67 89",
  email:      "contact@clair-vision.fr",
  siret:      "123 456 789 00012",
  adeli:      "75-0123456",
  accentColor: "#2D8CFF",
  coefficients: {
    "verres-progressifs": 3.2,
    "verres-simples": 3.0,
    "montures-optiques": 3.2,
    "montures-solaires": 3.0,
    "lentilles-souples": 2.2,
    "lentilles-rigides": 3.0,
    "accessoires": 2.8,
  },
  mentionsDevis: "Devis valable 30 jours. Prix TTC. Tiers payant selon conditions mutuelle.",
  tauxTVA: 20,
};

const STORAGE_KEY = "thor_pro_store_config";

export function loadStoreConfig(): StoreConfig {
  if (typeof window === "undefined") return DEFAULT_STORE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STORE_CONFIG, ...(JSON.parse(raw) as Partial<StoreConfig>) } : DEFAULT_STORE_CONFIG;
  } catch {
    return DEFAULT_STORE_CONFIG;
  }
}

export function saveStoreConfig(config: StoreConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/* ─── Audition (clé séparée) ───────────────────────────────────────────────── */
const AUDITION_STORAGE_KEY = "thor_pro_audition_store_config";

export const DEFAULT_AUDITION_STORE_CONFIG: StoreConfig = {
  nom:        "Clair Audition",
  adresse:    "8 avenue du Général Leclerc",
  codePostal: "75014",
  ville:      "Paris",
  telephone:  "01 45 67 89 10",
  email:      "contact@clair-audition.fr",
  siret:      "987 654 321 00012",
  adeli:      "75-9876543",
  accentColor: "#00C98A",
};

export function loadAuditionStoreConfig(): StoreConfig {
  if (typeof window === "undefined") return DEFAULT_AUDITION_STORE_CONFIG;
  try {
    const raw = localStorage.getItem(AUDITION_STORAGE_KEY);
    return raw
      ? { ...DEFAULT_AUDITION_STORE_CONFIG, ...(JSON.parse(raw) as Partial<StoreConfig>) }
      : DEFAULT_AUDITION_STORE_CONFIG;
  } catch {
    return DEFAULT_AUDITION_STORE_CONFIG;
  }
}

export function saveAuditionStoreConfig(config: StoreConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUDITION_STORAGE_KEY, JSON.stringify(config));
}
