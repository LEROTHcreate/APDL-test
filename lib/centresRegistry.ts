/* ── Registre des centres THOR ─────────────────────────────────────────────
   Clé localStorage : "thor_centres_registry"
   Écrit lors du finish() de l'OnboardingWizard.
   Lu par :
     - /nos-centres (public) → centres siteVisible : true
     - /admin              → tous les centres + stats
   ─────────────────────────────────────────────────────────────────────────── */

export type StatutCentre = "actif" | "preactif" | "inactif";

export interface CentreRegistre {
  id: string;
  module: "vision" | "audition";
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
  siret?: string;
  /* Géolocalisation (remplie plus tard si geocoding) */
  lat?: number;
  lng?: number;
  /* Cycle de vie */
  statut: StatutCentre;
  siteVisible: boolean;       // apparaît sur /nos-centres
  dateInscription: string;    // ISO
  dateFinEssai: string;       // ISO  (+2 mois depuis inscription)
  /* Activité */
  derniereActivite?: string;  // ISO
  nbActivites: number;        // nombre de connexions pro enregistrées
  /* Notes internes admin */
  notes?: string;
}

const LS_KEY = "thor_centres_registry";

/* ── Helpers ── */
export function loadRegistry(): CentreRegistre[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CentreRegistre[]) : [];
  } catch { return []; }
}

export function saveRegistry(centres: CentreRegistre[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(centres));
}

/* Ajoute ou met à jour un centre lors de l'onboarding */
export function registerCentre(data: {
  module: "vision" | "audition";
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
  siret?: string;
}): string {
  const centres = loadRegistry();
  /* De-duplication par (nom + module) */
  const idx = centres.findIndex(
    c => c.nom === data.nom && c.module === data.module
  );

  const now = new Date().toISOString();
  const dateFinEssai = new Date(Date.now() + 60 * 86400000).toISOString();

  if (idx >= 0) {
    centres[idx] = {
      ...centres[idx],
      ...data,
      derniereActivite: now,
    };
    saveRegistry(centres);
    return centres[idx].id;
  }

  const id = `${data.module}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const entry: CentreRegistre = {
    id,
    ...data,
    statut: "preactif",
    siteVisible: true,
    dateInscription: now,
    dateFinEssai,
    derniereActivite: now,
    nbActivites: 1,
  };
  saveRegistry([...centres, entry]);
  return id;
}

/* Enregistre une connexion sur l'espace pro (appelé au montage du layout) */
export function logProActivity(module: "vision" | "audition", nom: string): void {
  const centres = loadRegistry();
  const idx = centres.findIndex(c => c.module === module && c.nom === nom);
  if (idx >= 0) {
    centres[idx].derniereActivite = new Date().toISOString();
    centres[idx].nbActivites = (centres[idx].nbActivites ?? 0) + 1;
    saveRegistry(centres);
  }
}

/* Met à jour le statut d'un centre (depuis l'admin) */
export function setCentreStatut(id: string, statut: StatutCentre, siteVisible: boolean): void {
  const centres = loadRegistry();
  const idx = centres.findIndex(c => c.id === id);
  if (idx >= 0) {
    centres[idx].statut = statut;
    centres[idx].siteVisible = siteVisible;
    saveRegistry(centres);
  }
}
