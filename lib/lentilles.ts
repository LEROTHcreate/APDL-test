/* ═══════════════════════════════════════════════════════════════════════════
   THOR – Moteur de calcul lentilles de contact
   Expert en lentilles souples, toriques, multifocales et rigides (RPG)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────────────────── */

export type LensType =
  | "spherique"
  | "torique"
  | "multifocale"
  | "torique-multifocale"
  | "rigide";

export type Replacement =
  | "journalier"
  | "bimensuel"
  | "mensuel"
  | "trimestriel"
  | "annuel";

export type InputSource = "lunettes" | "lentilles" | "ark";
export type Environment = "bureau_clim" | "chantier" | "exterieur" | "domicile" | "salle_blanche" | "autre";
export type AdaptationType = "classique" | "personnalisee";

export interface Lens {
  id: string;
  name: string;
  brand: string;
  type: LensType;
  replacement: Replacement;
  material: string;
  siliconeHydrogel: boolean;
  waterContent: number;   // %
  dkT: number;            // transmissibilité O2
  baseCurves: number[];   // RC disponibles
  diameters: number[];    // Ø disponibles
  sphereMin: number;
  sphereMax: number;
  cylMin?: number;
  cylMax?: number;
  addMin?: number;
  addMax?: number;
  image: string;          // fichier dans /images/lentilles/
  tag?: string;           // "Premium" | "Respirant" | "RPG" etc.
  note?: string;          // note clinique courte
  ionic: boolean;         // matériau ionique (attire poussières/particules)
  waterGradient?: boolean; // surface water gradient (Dailies Total 1, Total30, Infuse)
}

export interface EyeRx {
  sph: number;
  cyl: number;
  axe: number;
  add: number;
}

export interface EyeResult {
  sphConverti: number;
  cylConverti: number;
  es: number;             // équivalent sphérique
  addValue: number;       // addition pour presbytie (0 si non presbyte)
  vertexApplique: boolean;
  cylIgnore: boolean;     // si |cyl| ≤ 0.50D → optionnel en souple
  needsTorique: boolean;  // |cyl| ≥ 0.75D
  needsMultifocal: boolean;
}

export interface Alerte {
  niveau: "info" | "warning" | "critical";
  message: string;
}

export interface ProblemeReadaptation {
  id: string;
  label: string;
  categorie: "vision" | "confort" | "ajustement" | "tolerance" | "autre";
  suggestion: string;
}

export interface PatientProfile {
  adaptationType: AdaptationType;
  environnements: Environment[];
  secheresse: boolean;
  allergie: boolean;
  sport: boolean;
  portContinu: boolean;
  heuresPort: number; // hours per day
}

export interface ScoreDetail {
  lens: Lens;
  score: number;
  raisons: string[];
  alertes: string[];
}

/* ── Catalogue complet ─────────────────────────────────────────────────── */

export const CATALOG: Lens[] = [
  /* ── ACUVUE ── */
  {
    id: "acuvue-moist-1day",
    name: "1-Day Acuvue Moist",
    brand: "Johnson & Johnson",
    type: "spherique",
    replacement: "journalier",
    material: "etafilcon A",
    siliconeHydrogel: false,
    waterContent: 58,
    dkT: 28,
    baseCurves: [8.5],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "assetsboxes1-day-acuvue-moist.webp",
    ionic: true,
    note: "LACREON intégré – bon confort initial",
  },
  {
    id: "acuvue-moist-1day-astig",
    name: "1-Day Acuvue Moist for Astigmatism",
    brand: "Johnson & Johnson",
    type: "torique",
    replacement: "journalier",
    material: "etafilcon A",
    siliconeHydrogel: false,
    waterContent: 58,
    dkT: 26,
    baseCurves: [8.5],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "1-day-acuvue-moist-for-astigmatism.webp",
    ionic: true,
    note: "Système BLINK STABILIZED – axe stable",
  },
  {
    id: "acuvue-moist-1day-multi",
    name: "1-Day Acuvue Moist Multifocal",
    brand: "Johnson & Johnson",
    type: "multifocale",
    replacement: "journalier",
    material: "etafilcon A",
    siliconeHydrogel: false,
    waterContent: 58,
    dkT: 28,
    baseCurves: [8.4],
    diameters: [14.3],
    sphereMin: -9.0,
    sphereMax: 5.0,
    addMin: 0.75,
    addMax: 2.50,
    image: "1-day-acuvue-moist-multifocal.webp",
    ionic: true,
    note: "Optique concentrique – 3 additions disponibles",
  },
  {
    id: "acuvue-oasys-1day",
    name: "Acuvue Oasys 1-Day",
    brand: "Johnson & Johnson",
    type: "spherique",
    replacement: "journalier",
    material: "senofilcon A",
    siliconeHydrogel: true,
    waterContent: 38,
    dkT: 121,
    baseCurves: [8.5],
    diameters: [14.3],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "acuvue-oasys-1-day.webp",
    ionic: false,
    tag: "Premium",
    note: "HydraLuxe Technology – filtre lumière bleue intégré",
  },
  {
    id: "acuvue-oasys-max-1day",
    name: "Acuvue Oasys Max 1-Day",
    brand: "Johnson & Johnson",
    type: "spherique",
    replacement: "journalier",
    material: "senofilcon C",
    siliconeHydrogel: true,
    waterContent: 38,
    dkT: 128,
    baseCurves: [8.5],
    diameters: [14.3],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "acuvue-oasys-1-day.webp",
    ionic: false,
    tag: "Premium",
    note: "TearStable Technology + filtre lumière bleue — dernière génération J&J",
  },
  {
    id: "acuvue-oasys-max-1day-multi",
    name: "Acuvue Oasys Max 1-Day Multifocal",
    brand: "Johnson & Johnson",
    type: "multifocale",
    replacement: "journalier",
    material: "senofilcon C",
    siliconeHydrogel: true,
    waterContent: 38,
    dkT: 128,
    baseCurves: [8.5],
    diameters: [14.3],
    sphereMin: -12.0,
    sphereMax: 6.0,
    addMin: 0.75,
    addMax: 2.50,
    image: "1-day-acuvue-moist-multifocal.webp",
    ionic: false,
    tag: "Premium",
  },
  {
    id: "acuvue-oasys-1day-astig",
    name: "Acuvue Oasys 1-Day for Astigmatism",
    brand: "Johnson & Johnson",
    type: "torique",
    replacement: "journalier",
    material: "senofilcon A",
    siliconeHydrogel: true,
    waterContent: 38,
    dkT: 116,
    baseCurves: [8.5],
    diameters: [14.3],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "acuvue-oasys-1-day-for-astigmatism.webp",
    ionic: false,
    tag: "Premium",
    note: "SiHy + BLINK STABILIZED – référence en torique journalière",
  },
  {
    id: "acuvue-oasys-astig",
    name: "Acuvue Oasys for Astigmatism",
    brand: "Johnson & Johnson",
    type: "torique",
    replacement: "bimensuel",
    material: "senofilcon A",
    siliconeHydrogel: true,
    waterContent: 38,
    dkT: 129,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.75,
    image: "acuvue-oasys-for-astigmatism.webp",
    ionic: false,
    note: "Large plage de cylindres – bonne option astig élevé",
  },
  {
    id: "acuvue-vita",
    name: "Acuvue Vita",
    brand: "Johnson & Johnson",
    type: "spherique",
    replacement: "mensuel",
    material: "methacryloyloxypropyl tris(trimethylsiloxy)silane",
    siliconeHydrogel: true,
    waterContent: 41,
    dkT: 147,
    baseCurves: [8.4],
    diameters: [14.0],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "acuvue-vita.webp",
    ionic: false,
    note: "HydraMax – rétention d'eau tout le mois",
  },

  /* ── AIR OPTIX ── */
  {
    id: "air-optix-hydraglyde",
    name: "Air Optix Plus HydraGlyde",
    brand: "Alcon",
    type: "spherique",
    replacement: "mensuel",
    material: "lotrafilcon B",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 138,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    image: "air-optix-plus-hydraglyde.webp",
    ionic: false,
    note: "HYDRAGLYDE – film lacrymal stable 30 jours",
  },
  {
    id: "air-optix-hydraglyde-astig",
    name: "Air Optix Plus HydraGlyde for Astigmatism",
    brand: "Alcon",
    type: "torique",
    replacement: "mensuel",
    material: "lotrafilcon B",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 129,
    baseCurves: [8.7],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.25,
    image: "air-optix-plus-hydraglyde-for-astigmatism.webp",
    ionic: false,
    note: "Precision Balance 8|4 – excellente stabilisation de l'axe",
  },
  {
    id: "air-optix-hydraglyde-multi",
    name: "Air Optix Plus HydraGlyde Multifocal",
    brand: "Alcon",
    type: "multifocale",
    replacement: "mensuel",
    material: "lotrafilcon B",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 138,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "air-optix-plus-hydraglyde-multifocal.webp",
    ionic: false,
    note: "PRECISION PROFILE – 3 profils (Low/Mid/High)",
  },

  /* ── BIOFINITY ── */
  {
    id: "biofinity",
    name: "Biofinity",
    brand: "CooperVision",
    type: "spherique",
    replacement: "mensuel",
    material: "comfilcon A",
    siliconeHydrogel: true,
    waterContent: 48,
    dkT: 160,
    baseCurves: [8.6],
    diameters: [14.0],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "biofinity-biofinity-xr.webp",
    ionic: false,
    tag: "Respirant",
    note: "Aquaform – haute teneur en eau + Dk/t 160",
  },
  {
    id: "biofinity-toric",
    name: "Biofinity Toric",
    brand: "CooperVision",
    type: "torique",
    replacement: "mensuel",
    material: "comfilcon A",
    siliconeHydrogel: true,
    waterContent: 48,
    dkT: 141,
    baseCurves: [8.7],
    diameters: [14.5],
    sphereMin: -10.0,
    sphereMax: 8.0,
    cylMin: -0.75,
    cylMax: -2.75,
    image: "biofinity-toric-biofinity-xr-toric.webp",
    ionic: false,
    note: "Optimized Toric Lens Geometry – bonne stabilisation",
  },
  {
    id: "biofinity-multi",
    name: "Biofinity Multifocal",
    brand: "CooperVision",
    type: "multifocale",
    replacement: "mensuel",
    material: "comfilcon A",
    siliconeHydrogel: true,
    waterContent: 48,
    dkT: 160,
    baseCurves: [8.6],
    diameters: [14.0],
    sphereMin: -10.0,
    sphereMax: 8.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "biofinity-multifocal.webp",
    ionic: false,
    note: "Balanced Progressive Technology (D ou N selon dominance)",
  },
  {
    id: "biofinity-toric-multi",
    name: "Biofinity Toric Multifocal",
    brand: "CooperVision",
    type: "torique-multifocale",
    replacement: "mensuel",
    material: "comfilcon A",
    siliconeHydrogel: true,
    waterContent: 48,
    dkT: 141,
    baseCurves: [8.7],
    diameters: [14.5],
    sphereMin: -10.0,
    sphereMax: 8.0,
    cylMin: -0.75,
    cylMax: -2.25,
    addMin: 1.0,
    addMax: 2.5,
    image: "biofinity-toric-multifocal.webp",
    ionic: false,
    tag: "Premium",
    note: "Torique + multifocal – complexe, adapter selon dominance oculaire",
  },

  /* ── CLARITI ── */
  {
    id: "clariti-1day",
    name: "Clariti 1 Day",
    brand: "CooperVision",
    type: "spherique",
    replacement: "journalier",
    material: "somofilcon A",
    siliconeHydrogel: true,
    waterContent: 56,
    dkT: 86,
    baseCurves: [8.6],
    diameters: [14.1],
    sphereMin: -10.0,
    sphereMax: 6.0,
    image: "clariti-1-day.webp",
    ionic: false,
    note: "SiHy journalière abordable",
  },
  {
    id: "clariti-1day-toric",
    name: "Clariti 1 Day Toric",
    brand: "CooperVision",
    type: "torique",
    replacement: "journalier",
    material: "somofilcon A",
    siliconeHydrogel: true,
    waterContent: 56,
    dkT: 86,
    baseCurves: [8.6],
    diameters: [14.3],
    sphereMin: -8.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "clariti-1-day-toric.webp",
    ionic: false,
  },
  {
    id: "clariti-1day-multi",
    name: "Clariti 1 Day Multifocal",
    brand: "CooperVision",
    type: "multifocale",
    replacement: "journalier",
    material: "somofilcon A",
    siliconeHydrogel: true,
    waterContent: 56,
    dkT: 86,
    baseCurves: [8.6],
    diameters: [14.1],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "clariti-1-day-multifocal.webp",
    ionic: false,
  },

  /* ── DAILIES ── */
  {
    id: "dailies-aquacomfort",
    name: "Dailies AquaComfort Plus",
    brand: "Alcon",
    type: "spherique",
    replacement: "journalier",
    material: "nelfilcon A",
    siliconeHydrogel: false,
    waterContent: 69,
    dkT: 26,
    baseCurves: [8.7],
    diameters: [14.0],
    sphereMin: -10.0,
    sphereMax: 6.0,
    image: "dailies-aquacomfort-plus.webp",
    ionic: false,
    note: "Haute teneur en eau – bon confort mais Dk/t modéré",
  },
  {
    id: "dailies-aquacomfort-toric",
    name: "Dailies AquaComfort Plus Toric",
    brand: "Alcon",
    type: "torique",
    replacement: "journalier",
    material: "nelfilcon A",
    siliconeHydrogel: false,
    waterContent: 69,
    dkT: 26,
    baseCurves: [8.8],
    diameters: [14.4],
    sphereMin: -8.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "dailies-aquacomfort-plus-toric.webp",
    ionic: false,
  },
  {
    id: "dailies-aquacomfort-multi",
    name: "Dailies AquaComfort Plus Multifocal",
    brand: "Alcon",
    type: "multifocale",
    replacement: "journalier",
    material: "nelfilcon A",
    siliconeHydrogel: false,
    waterContent: 69,
    dkT: 26,
    baseCurves: [8.7],
    diameters: [14.0],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "dailies-aquacomfort-plus-multifocal.webp",
    ionic: false,
  },
  {
    id: "dailies-total1",
    name: "Dailies Total 1",
    brand: "Alcon",
    type: "spherique",
    replacement: "journalier",
    material: "delefilcon A",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 156,
    baseCurves: [8.5],
    diameters: [14.1],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "dailies-total-1.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
    note: "Water gradient surface 80% – confort exceptionnel (sécheresse oculaire)",
  },
  {
    id: "dailies-total1-astig",
    name: "Dailies Total 1 for Astigmatism",
    brand: "Alcon",
    type: "torique",
    replacement: "journalier",
    material: "delefilcon A",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 156,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "dailies-total-1-for-astigmatism.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
    note: "Meilleur DkT en torique journalière",
  },
  {
    id: "dailies-total1-multi",
    name: "Dailies Total 1 Multifocal",
    brand: "Alcon",
    type: "multifocale",
    replacement: "journalier",
    material: "delefilcon A",
    siliconeHydrogel: true,
    waterContent: 33,
    dkT: 156,
    baseCurves: [8.5],
    diameters: [14.1],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "dailies-total-1-multifocal.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
  },

  /* ── OPHTALMIC ── */
  {
    id: "ophtalmic-hr-1day",
    name: "Ophtalmic HR 1-Day",
    brand: "Ophtalmic Compagnie",
    type: "spherique",
    replacement: "journalier",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 59,
    dkT: 27,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 4.0,
    image: "ophtalmic-hr-1-day.webp",
    ionic: false,
  },
  {
    id: "ophtalmic-hr-1day-toric",
    name: "Ophtalmic HR 1-Day Toric",
    brand: "Ophtalmic Compagnie",
    type: "torique",
    replacement: "journalier",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 59,
    dkT: 27,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -8.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "ophtalmic-hr-1-day-toric.webp",
    ionic: false,
  },
  {
    id: "ophtalmic-hr-1day-prog",
    name: "Ophtalmic HR 1-Day Progressive",
    brand: "Ophtalmic Compagnie",
    type: "multifocale",
    replacement: "journalier",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 59,
    dkT: 27,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -8.0,
    sphereMax: 4.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "ophtalmic-hr-1-day-progressive.webp",
    ionic: false,
  },
  {
    id: "ophtalmic-perfexion",
    name: "Ophtalmic HR Perfexion",
    brand: "Ophtalmic Compagnie",
    type: "spherique",
    replacement: "mensuel",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 62,
    dkT: 32,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "ophtalmic-hr-perfexion-spheric.webp",
    ionic: false,
  },
  {
    id: "ophtalmic-perfexion-toric",
    name: "Ophtalmic HR Perfexion Toric",
    brand: "Ophtalmic Compagnie",
    type: "torique",
    replacement: "mensuel",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 62,
    dkT: 32,
    baseCurves: [8.7],
    diameters: [14.5],
    sphereMin: -10.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.25,
    image: "ophtalmic-hr-perfexion-toric.webp",
    ionic: false,
  },

  /* ── PRECISION 1 ── */
  {
    id: "precision1",
    name: "Precision1",
    brand: "Alcon",
    type: "spherique",
    replacement: "journalier",
    material: "verofilcon A",
    siliconeHydrogel: true,
    waterContent: 51,
    dkT: 100,
    baseCurves: [8.3],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "precision-1.webp",
    ionic: false,
    note: "SMARTSURFACE – 5000 couches de PVP en surface",
  },
  {
    id: "precision1-astig",
    name: "Precision1 for Astigmatism",
    brand: "Alcon",
    type: "torique",
    replacement: "journalier",
    material: "verofilcon A",
    siliconeHydrogel: true,
    waterContent: 51,
    dkT: 100,
    baseCurves: [8.5],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "precision-1-for-astigmatism.webp",
    ionic: false,
  },
  {
    id: "precision1-multi",
    name: "Precision1 Multifocal",
    brand: "Alcon",
    type: "multifocale",
    replacement: "mensuel",
    material: "verofilcon A",
    siliconeHydrogel: true,
    waterContent: 51,
    dkT: 100,
    baseCurves: [8.3],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "precision-1.webp",
    ionic: false,
  },

  /* ── PROCLEAR ── */
  {
    id: "proclear-sphere",
    name: "Proclear Sphere",
    brand: "CooperVision",
    type: "spherique",
    replacement: "mensuel",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 62,
    dkT: 32,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -20.0,
    sphereMax: 20.0,
    image: "proclear-sphere.webp",
    ionic: false,
    note: "PC Technology – très bonne rétention eau, idéal yeux secs",
  },
  {
    id: "proclear-toric",
    name: "Proclear Toric",
    brand: "CooperVision",
    type: "torique",
    replacement: "mensuel",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 62,
    dkT: 32,
    baseCurves: [8.8],
    diameters: [14.4],
    sphereMin: -8.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -5.75,
    image: "proclear-toric-proclear-toric-xr.webp",
    ionic: false,
    note: "Large plage de cylindres disponible (XR)",
  },
  {
    id: "proclear-multi",
    name: "Proclear Multifocal",
    brand: "CooperVision",
    type: "multifocale",
    replacement: "mensuel",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 62,
    dkT: 32,
    baseCurves: [8.7],
    diameters: [14.4],
    sphereMin: -20.0,
    sphereMax: 20.0,
    addMin: 1.0,
    addMax: 4.0,
    image: "proclear-multifocal-proclear-multifocal-xr.webp",
    ionic: false,
    note: "Addition jusqu'à +4.00D – meilleure plage du marché",
  },
  {
    id: "proclear-1day",
    name: "Proclear 1-Day",
    brand: "CooperVision",
    type: "spherique",
    replacement: "journalier",
    material: "omafilcon A",
    siliconeHydrogel: false,
    waterContent: 60,
    dkT: 28,
    baseCurves: [8.7],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    image: "proclear-1-day.webp",
    ionic: false,
    note: "Journalière PC – bon choix sécheresse légère",
  },

  /* ── TOTAL 30 ── */
  {
    id: "total30",
    name: "Total30",
    brand: "Alcon",
    type: "spherique",
    replacement: "mensuel",
    material: "lehfilcon A",
    siliconeHydrogel: true,
    waterContent: 55,
    dkT: 156,
    baseCurves: [8.4],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "total-30.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
    note: "Water gradient mensuelle – confort jour 1 = jour 30",
  },
  {
    id: "total30-astig",
    name: "Total30 for Astigmatism",
    brand: "Alcon",
    type: "torique",
    replacement: "mensuel",
    material: "lehfilcon A",
    siliconeHydrogel: true,
    waterContent: 55,
    dkT: 156,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -10.0,
    sphereMax: 6.0,
    cylMin: -0.75,
    cylMax: -2.25,
    image: "total-30-for-astigmatism.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
  },
  {
    id: "total30-multi",
    name: "Total30 Multifocal",
    brand: "Alcon",
    type: "multifocale",
    replacement: "mensuel",
    material: "lehfilcon A",
    siliconeHydrogel: true,
    waterContent: 55,
    dkT: 156,
    baseCurves: [8.4],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "total-30-multifocal.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
  },

  /* ── ULTRA ── */
  {
    id: "ultra",
    name: "ULTRA",
    brand: "Bausch + Lomb",
    type: "spherique",
    replacement: "mensuel",
    material: "samfilcon A",
    siliconeHydrogel: true,
    waterContent: 46,
    dkT: 163,
    baseCurves: [8.5],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "ultra.webp",
    ionic: false,
    note: "MoistureSeal – retient 95% eau après 16h de port",
  },
  {
    id: "ultra-astig",
    name: "ULTRA for Astigmatism",
    brand: "Bausch + Lomb",
    type: "torique",
    replacement: "mensuel",
    material: "samfilcon A",
    siliconeHydrogel: true,
    waterContent: 46,
    dkT: 163,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.25,
    image: "ultra-pour-astigmates.webp",
    ionic: false,
  },
  {
    id: "ultra-multi-astig",
    name: "ULTRA Multifocal for Astigmatism",
    brand: "Bausch + Lomb",
    type: "torique-multifocale",
    replacement: "mensuel",
    material: "samfilcon A",
    siliconeHydrogel: true,
    waterContent: 46,
    dkT: 163,
    baseCurves: [8.6],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.25,
    addMin: 1.0,
    addMax: 2.5,
    image: "ultra-multifocale-pour-astigmates.webp",
    ionic: false,
    tag: "Premium",
  },
  {
    id: "ultra-oneday",
    name: "ULTRA One Day",
    brand: "Bausch + Lomb",
    type: "spherique",
    replacement: "journalier",
    material: "kalifilcon A",
    siliconeHydrogel: true,
    waterContent: 55,
    dkT: 80,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    image: "ultra-one-day.webp",
    ionic: false,
  },

  /* ── INFUSE ── */
  {
    id: "infuse-oneday",
    name: "Infuse One-Day",
    brand: "Bausch + Lomb",
    type: "spherique",
    replacement: "journalier",
    material: "fanfilcon A",
    siliconeHydrogel: true,
    waterContent: 74,
    dkT: 128,
    baseCurves: [8.6],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 6.0,
    image: "ultra-one-day.webp",
    ionic: false,
    waterGradient: true,
    tag: "Premium",
    note: "ProBalance Technology — teneur en eau la plus haute en SiHy journalière",
  },

  /* ── PUREVISION ── */
  {
    id: "purevision2",
    name: "PureVision 2 HD",
    brand: "Bausch + Lomb",
    type: "spherique",
    replacement: "mensuel",
    material: "balafilcon A",
    siliconeHydrogel: true,
    waterContent: 36,
    dkT: 130,
    baseCurves: [8.6],
    diameters: [14.0],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "purevision-2-hd.webp",
    ionic: false,
    note: "HD Optics – réduit aberrations sphériques",
  },
  {
    id: "purevision2-astig",
    name: "PureVision 2 HD for Astigmatism",
    brand: "Bausch + Lomb",
    type: "torique",
    replacement: "mensuel",
    material: "balafilcon A",
    siliconeHydrogel: true,
    waterContent: 36,
    dkT: 115,
    baseCurves: [8.9],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -2.25,
    image: "purevision-2-hd-pour-astigmates.webp",
    ionic: false,
  },
  {
    id: "purevision2-multi",
    name: "PureVision 2 for Presbyopia",
    brand: "Bausch + Lomb",
    type: "multifocale",
    replacement: "mensuel",
    material: "balafilcon A",
    siliconeHydrogel: true,
    waterContent: 36,
    dkT: 130,
    baseCurves: [8.6],
    diameters: [14.0],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "purevision-2-pour-presbytes.webp",
    ionic: false,
  },

  /* ── MYDAY ── */
  {
    id: "myday",
    name: "MyDay",
    brand: "CooperVision",
    type: "spherique",
    replacement: "journalier",
    material: "stenfilcon A",
    siliconeHydrogel: true,
    waterContent: 54,
    dkT: 100,
    baseCurves: [8.4],
    diameters: [14.2],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "clariti-1-day.webp",
    ionic: false,
    note: "Smart Silicone Technology — haute teneur en eau SiHy",
  },
  {
    id: "myday-toric",
    name: "MyDay Toric",
    brand: "CooperVision",
    type: "torique",
    replacement: "journalier",
    material: "stenfilcon A",
    siliconeHydrogel: true,
    waterContent: 54,
    dkT: 100,
    baseCurves: [8.4],
    diameters: [14.5],
    sphereMin: -9.0,
    sphereMax: 4.0,
    cylMin: -0.75,
    cylMax: -1.75,
    image: "clariti-1-day-toric.webp",
    ionic: false,
  },
  {
    id: "myday-multi",
    name: "MyDay Multifocal",
    brand: "CooperVision",
    type: "multifocale",
    replacement: "journalier",
    material: "stenfilcon A",
    siliconeHydrogel: true,
    waterContent: 54,
    dkT: 100,
    baseCurves: [8.4],
    diameters: [14.2],
    sphereMin: -10.0,
    sphereMax: 6.0,
    addMin: 1.0,
    addMax: 2.5,
    image: "clariti-1-day-multifocal.webp",
    ionic: false,
  },

  /* ── AVAIRA VITALITY ── */
  {
    id: "avaira-vitality",
    name: "Avaira Vitality",
    brand: "CooperVision",
    type: "spherique",
    replacement: "mensuel",
    material: "enfilcon A",
    siliconeHydrogel: true,
    waterContent: 46,
    dkT: 100,
    baseCurves: [8.4, 8.7],
    diameters: [14.0],
    sphereMin: -12.0,
    sphereMax: 8.0,
    image: "biofinity-biofinity-xr.webp",
    ionic: false,
    note: "Alternative mensuelle SiHy abordable",
  },

  /* ── COOPERVISION ENERGYS ── */
  {
    id: "energys",
    name: "Energys",
    brand: "CooperVision",
    type: "spherique",
    replacement: "mensuel",
    material: "comfilcon A",
    siliconeHydrogel: true,
    waterContent: 48,
    dkT: 160,
    baseCurves: [8.6],
    diameters: [14.0],
    sphereMin: -6.0,
    sphereMax: 4.0,
    image: "biofinity-biofinity-xr.webp",
    ionic: false,
    tag: "Écrans",
    note: "DigitalBoost — zone périphérique +0,5D réduisant l'effort accommodatif en travail sur écran",
  },

  /* ── MENICON (RPG) ── */
  {
    id: "menicon-z",
    name: "Menicon Z",
    brand: "Menicon",
    type: "rigide",
    replacement: "annuel",
    material: "tisilfocon A",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 163,
    baseCurves: [7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5],
    diameters: [9.5, 10.0, 10.5],
    sphereMin: -25.0,
    sphereMax: 25.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "Port continu possible (7j) – référence en RPG cornéen",
  },
  {
    id: "menicon-z-comfort",
    name: "Menicon Z Comfort",
    brand: "Menicon",
    type: "rigide",
    replacement: "annuel",
    material: "tisilfocon A",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 163,
    baseCurves: [7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4],
    diameters: [9.2, 9.6, 10.0],
    sphereMin: -20.0,
    sphereMax: 20.0,
    image: "menicon-z-comfort.webp",
    ionic: false,
    tag: "RPG",
    note: "Design asphérique – meilleure acuité en périphérie",
  },
  {
    id: "menicon-ex",
    name: "Menicon Ex / Ex-Z",
    brand: "Menicon",
    type: "rigide",
    replacement: "annuel",
    material: "fluorosilicone acrylate",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 56,
    baseCurves: [7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4],
    diameters: [9.2, 9.6, 10.0],
    sphereMin: -20.0,
    sphereMax: 20.0,
    image: "menicon-ex-ex-z.webp",
    ionic: false,
    tag: "RPG",
  },
  /* ── BOSTON (Bausch + Lomb) ── */
  {
    id: "boston-xo",
    name: "Boston XO",
    brand: "Bausch + Lomb",
    type: "rigide",
    replacement: "annuel",
    material: "hexafocon A",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 100,
    baseCurves: [7.0,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8.0,8.1,8.2,8.3,8.4,8.5],
    diameters: [9.0, 9.2, 9.5, 10.0],
    sphereMin: -20.0,
    sphereMax: 20.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "RPG premium B+L — équilibre confort/O₂. Géométrie asphérique RD series",
  },
  {
    id: "boston-xo2",
    name: "Boston XO2",
    brand: "Bausch + Lomb",
    type: "rigide",
    replacement: "annuel",
    material: "hexafocon B",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 141,
    baseCurves: [7.0,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8.0,8.1,8.2,8.3,8.4,8.5],
    diameters: [9.0, 9.2, 9.5, 10.0],
    sphereMin: -25.0,
    sphereMax: 25.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "RPG haute Dk/t B+L — pour forts astigmatismes et port prolongé",
  },
  /* ── ROSE K (Blanchard / Menicon) — kératocône ── */
  {
    id: "rose-k2",
    name: "Rose K2",
    brand: "Blanchard / Menicon",
    type: "rigide",
    replacement: "annuel",
    material: "boston equalens II",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 85,
    baseCurves: [5.0,5.2,5.4,5.6,5.8,6.0,6.2,6.4,6.6,6.8,7.0,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6],
    diameters: [7.9, 8.0, 8.7, 9.0, 9.5, 10.0],
    sphereMin: -30.0,
    sphereMax: 25.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "Référence kératocône — géométrie multi-courbes adaptée cornées irrégulières (conicité 0 à 1.4). Fit expert requis",
  },
  {
    id: "rose-k2-ic",
    name: "Rose K2 IC",
    brand: "Blanchard / Menicon",
    type: "rigide",
    replacement: "annuel",
    material: "boston equalens II",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 85,
    baseCurves: [5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0],
    diameters: [7.9, 8.7, 9.0, 10.0, 10.4, 10.8],
    sphereMin: -30.0,
    sphereMax: 25.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "Rose K2 Irregular Cornea — greffe, post-chirurgie réfractive, ectasie. Zone d'appui limbal élargie",
  },
  /* ── SCLERAL ── */
  {
    id: "onefit-med",
    name: "OneFit Med",
    brand: "Precilens",
    type: "rigide",
    replacement: "annuel",
    material: "Boston XO material",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 100,
    baseCurves: [7.0,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6],
    diameters: [15.0, 15.6, 16.0, 16.5, 17.0],
    sphereMin: -25.0,
    sphereMax: 20.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "Mini-sclérale Precilens — kératocône avancé, cornée irrégulière, sécheresse sévère. Réservoir liquide = zéro contact cornéen",
  },
  {
    id: "jupiter-16",
    name: "Jupiter 16",
    brand: "Contamac / Lentilles Optilens",
    type: "rigide",
    replacement: "annuel",
    material: "Optimum Extra (hexafocon B)",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 125,
    baseCurves: [7.0,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6,8.8],
    diameters: [15.0, 16.0, 16.5, 17.0, 18.0],
    sphereMin: -30.0,
    sphereMax: 30.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "Sclérale Dk/t 125 — très haute amétropie, kératocône sévère, sécheresse oculaire profonde. Clearance sclérale 200-300 µm",
  },
  /* ── PARAGON / HDS ── */
  {
    id: "paragon-hds100",
    name: "Paragon HDS 100",
    brand: "Paragon Vision Sciences",
    type: "rigide",
    replacement: "annuel",
    material: "paflufocon D",
    siliconeHydrogel: false,
    waterContent: 0,
    dkT: 100,
    baseCurves: [7.0,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8.0,8.1,8.2,8.3,8.4,8.5],
    diameters: [9.0, 9.2, 9.5, 10.0],
    sphereMin: -20.0,
    sphereMax: 20.0,
    image: "menicon-z.webp",
    ionic: false,
    tag: "RPG",
    note: "RPG Dk 100 — qualité optique supérieure, bonne mouillabilité. Adapté première adaptation RPG",
  },
];

/* ── Moteur de scoring profil patient ─────────────────────────────────── */

export function scorerLentille(
  lens: Lens,
  profile: PatientProfile,
): { score: number; raisons: string[]; alertes: string[] } {
  let score = 0;
  const raisons: string[] = [];
  const alertes: string[] = [];

  // Base
  score += Math.min(lens.dkT / 2, 50);
  if (lens.siliconeHydrogel) score += 30;
  if (lens.tag === "Premium") score += 20;

  const isWaterGradient = !!lens.waterGradient;

  // Environnements
  if (profile.environnements.includes("bureau_clim")) {
    if (isWaterGradient) {
      score += 40;
      raisons.push("Water gradient — confort stable sous climatisation");
    }
    if (lens.dkT >= 150 && lens.siliconeHydrogel) {
      score += 25;
      raisons.push(`Dk/t ${lens.dkT} — idéal pour port prolongé en bureau`);
    }
    if (!lens.siliconeHydrogel && lens.waterContent >= 60) {
      score -= 25;
      alertes.push("Les hydrogels haute eau se déshydratent plus rapidement en atmosphère climatisée");
    }
    if (lens.dkT < 50) score -= 20;
  }

  if (profile.environnements.includes("chantier")) {
    if (lens.ionic) {
      score -= 60;
      alertes.push("CONTRE-INDIQUÉ : matériau ionique dans un environnement poussiéreux (attire les particules)");
    } else {
      score += 20;
      raisons.push("Matériau non-ionique — résiste aux dépôts de poussière et particules");
    }
    if (lens.replacement === "journalier") {
      score += 30;
      raisons.push("Renouvellement quotidien — hygiène optimale en environnement poussiéreux");
    }
  }

  if (profile.environnements.includes("exterieur")) {
    if (lens.ionic) score -= 20;
    if (lens.replacement === "journalier") score += 15;
    if (lens.dkT >= 100) score += 10;
  }

  if (profile.environnements.includes("salle_blanche")) {
    if (lens.ionic) {
      score -= 60;
      alertes.push("CONTRE-INDIQUÉ : matériau ionique en salle blanche ou laboratoire");
    } else {
      score += 20;
      raisons.push("Matériau non-ionique — compatible salle blanche");
    }
    if (lens.replacement === "journalier") {
      score += 30;
      raisons.push("Journalière obligatoire en salle blanche");
    }
  }

  // Sécheresse
  if (profile.secheresse) {
    if (isWaterGradient) {
      score += 50;
      raisons.push("Water gradient recommandé en cas d'œil sec");
    }
    if (lens.dkT >= 150) score += 25;
    if (lens.siliconeHydrogel && lens.waterContent >= 46) score += 15;
    if (!lens.siliconeHydrogel && lens.waterContent >= 65) {
      score -= 20;
      alertes.push("Hydrogel standard non recommandé en cas de sécheresse oculaire");
    }
  }

  // Allergie
  if (profile.allergie) {
    if (lens.replacement === "journalier") {
      score += 40;
      raisons.push("Journalière — renouvellement quotidien idéal pour les allergiques");
    }
    if (lens.ionic) score -= 15;
  }

  // Sport
  if (profile.sport) {
    if (lens.replacement === "journalier") score += 20;
    if (lens.dkT >= 100) score += 10;
  }

  // Port continu
  if (profile.portContinu) {
    if (lens.dkT >= 100 && lens.siliconeHydrogel) {
      score += 30;
      raisons.push(`SiHy Dk/t ${lens.dkT} — adapté au port prolongé`);
    } else if (lens.type === "rigide" && lens.dkT >= 100) {
      // Les RPG haute Dk/t (ex. Menicon Z Dk/t 163) sont agréés port continu 7 jours
      score += 20;
      raisons.push(`RPG Dk/t ${lens.dkT} — port continu 7 j possible (FDA approved)`);
    } else if (!lens.siliconeHydrogel && lens.type !== "rigide") {
      score -= 40;
      alertes.push("Port continu déconseillé — silicone-hydrogel ou RPG haute Dk/t obligatoire");
    }
  }

  // Heures de port >= 10
  if (profile.heuresPort >= 10) {
    if (lens.dkT >= 100) score += 20;
    if (!lens.siliconeHydrogel) score -= 15;
  }

  return { score, raisons, alertes };
}

export function getTop3(lenses: Lens[], profile: PatientProfile): ScoreDetail[] {
  let filtered = lenses;
  if (profile.environnements.includes("chantier")) {
    filtered = lenses.filter(l => !l.ionic);
  }
  const scored = filtered.map(lens => {
    const { score, raisons, alertes } = scorerLentille(lens, profile);
    return { lens, score, raisons, alertes } as ScoreDetail;
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

/* ── Moteur de calcul optique ──────────────────────────────────────────── */

/** Arrondir à 0.25 D */
function round025(v: number): number {
  return Math.round(v * 4) / 4;
}

/**
 * Convertir la puissance de la monture vers la puissance lentille
 * en appliquant la correction de distance vertex (d = 12 mm)
 * Nécessaire si |Sph| ≥ 4.00 D
 */
export function correctionVertex(sph: number): number {
  if (Math.abs(sph) < 4) return sph;
  return round025(sph / (1 - 0.012 * sph));
}

/** Équivalent sphérique */
export function equivalentSpherique(sph: number, cyl: number): number {
  return round025(sph + cyl / 2);
}

/** Calculer la correction lentille à partir de l'Rx lunettes */
export function calculerCorrectionCL(rx: EyeRx): EyeResult {
  const sphConverti = correctionVertex(rx.sph);
  const cylConverti = Math.abs(rx.cyl) >= 4 ? correctionVertex(rx.cyl) : rx.cyl;
  const es = equivalentSpherique(sphConverti, cylConverti);
  const cylAbs = Math.abs(cylConverti);

  return {
    sphConverti,
    cylConverti,
    es,
    addValue: rx.add,
    vertexApplique: Math.abs(rx.sph) >= 4,
    cylIgnore: cylAbs > 0 && cylAbs <= 0.50,
    needsTorique: cylAbs >= 0.75,
    needsMultifocal: rx.add > 0,
  };
}

/** Générer les alertes cliniques */
export function genererAlertes(od: EyeRx, og: EyeRx): Alerte[] {
  const alertes: Alerte[] = [];
  const odR = calculerCorrectionCL(od);
  const ogR = calculerCorrectionCL(og);

  if (odR.vertexApplique || ogR.vertexApplique)
    alertes.push({ niveau: "info", message: "Correction de distance vertex appliquée (≥ ±4,00 D)." });

  const maxSph = Math.max(Math.abs(odR.sphConverti), Math.abs(ogR.sphConverti));
  if (maxSph >= 8)
    alertes.push({ niveau: "critical", message: `Forte amétropie (${maxSph > 0 ? "+" : ""}${maxSph.toFixed(2)} D) — les lentilles rigides perméables (RPG) offrent souvent une acuité supérieure.` });
  else if (maxSph >= 6)
    alertes.push({ niveau: "warning", message: `Myopie/hypermétropie élevée (${maxSph.toFixed(2)} D) — privilégier silicone-hydrogel haute Dk/t (≥ 100) pour limiter l'hypoxie.` });

  const maxCyl = Math.max(Math.abs(od.cyl), Math.abs(og.cyl));
  if (maxCyl >= 3.0)
    alertes.push({ niveau: "critical", message: `Astigmatisme très élevé (${maxCyl.toFixed(2)} D) — kératocône ou astigmatisme irrégulier à exclure par topographie cornéenne. Les RPG sont souvent la seule solution adaptée.` });
  else if (maxCyl >= 2.5)
    alertes.push({ niveau: "warning", message: `Astigmatisme élevé (${maxCyl.toFixed(2)} D) — les RPG corrigent tout astigmatisme via le ménisque lacrymal. Les toriques souples peuvent être insuffisantes.` });
  else if (maxCyl >= 0.75 && maxCyl < 2.5)
    alertes.push({ niveau: "info", message: `Astigmatisme modéré (${maxCyl.toFixed(2)} D) — lentille torique recommandée pour une acuité optimale.` });

  if (maxCyl > 0 && maxCyl < 0.75)
    alertes.push({ niveau: "info", message: `Astigmatisme faible (${maxCyl.toFixed(2)} D) — une lentille sphérique à l'équivalent sphérique peut suffire.` });

  // Kératocône suspect : cylindre très élevé ou forte asymétrie inter-oculaire
  const cylAsymmetry = Math.abs(Math.abs(od.cyl) - Math.abs(og.cyl));
  if (cylAsymmetry >= 1.5 && maxCyl >= 2.0)
    alertes.push({ niveau: "warning", message: `Asymétrie astigmate importante OD/OG (${cylAsymmetry.toFixed(2)} D d'écart) — kératocône ou ectasie à écarter. Topographie recommandée.` });

  const aniso = Math.abs(od.sph - og.sph);
  if (aniso >= 2.5)
    alertes.push({ niveau: "warning", message: `Anisométropie importante (${aniso.toFixed(2)} D) — surveiller la tolérance binoculaire et le confort après quelques heures de port.` });

  const maxAdd = Math.max(od.add, og.add);
  if (maxAdd > 0) {
    if (maxAdd <= 2.0)
      alertes.push({ niveau: "info", message: `Monovision envisageable (Add +${maxAdd.toFixed(2)} D) — œil directeur corrigé pour loin, non-directeur pour près. Taux de succès ≈ 75-80 %. Proposer en alternative aux multifocales.` });
    else
      alertes.push({ niveau: "info", message: "Presbytie — discuter du choix entre lentilles multifocales et monovision selon le mode de vie du patient." });
    if (maxAdd >= 2.5)
      alertes.push({ niveau: "warning", message: `Addition élevée (+${maxAdd.toFixed(2)} D) — la vision intermédiaire peut être compromise en souple multifocal ; envisager les RPG ou la monovision modifiée.` });
  }

  return alertes;
}

/** Déterminer les types de lentilles indiqués */
export function determinerTypesRecommandes(
  od: EyeResult,
  og: EyeResult,
  prefereRigide = false,
): LensType[] {
  if (prefereRigide) return ["rigide"];

  const needsTori = od.needsTorique || og.needsTorique;
  const needsMult = od.needsMultifocal || og.needsMultifocal;
  const cylMax    = Math.max(Math.abs(od.cylConverti), Math.abs(og.cylConverti));

  if (needsTori && needsMult) {
    return cylMax >= 2.0
      ? ["rigide", "torique-multifocale"]
      : ["torique-multifocale", "rigide"];
  }
  if (needsTori) {
    return cylMax >= 2.5
      ? ["rigide", "torique"]
      : ["torique", "rigide"];
  }
  if (needsMult) return ["multifocale", "rigide"];
  return ["spherique", "rigide"];
}

/** Filtrer le catalogue selon le profil calculé */
export function filtrerLentilles(params: {
  odResult: EyeResult;
  ogResult: EyeResult;
  types: LensType[];
  replacement?: Replacement | "indifferent";
  siliconHydrogelOnly?: boolean;
}): Lens[] {
  const { odResult, ogResult, types, replacement, siliconHydrogelOnly } = params;

  return CATALOG.filter((lens) => {
    if (!types.includes(lens.type)) return false;

    if (siliconHydrogelOnly && !lens.siliconeHydrogel && lens.type !== "rigide") return false;

    if (replacement && replacement !== "indifferent" && lens.replacement !== replacement) return false;

    // Sphere range — both eyes must be within the lens's available powers
    const sphInRange =
      odResult.sphConverti >= lens.sphereMin && odResult.sphConverti <= lens.sphereMax &&
      ogResult.sphConverti >= lens.sphereMin && ogResult.sphConverti <= lens.sphereMax;
    if (!sphInRange) return false;

    // Cylinder range — for torique lenses, the patient's max cyl must not exceed the lens max cyl
    if (lens.type === "torique" || lens.type === "torique-multifocale") {
      if (lens.cylMax !== undefined) {
        const maxPatientCyl = Math.max(Math.abs(odResult.cylConverti), Math.abs(ogResult.cylConverti));
        if (maxPatientCyl > Math.abs(lens.cylMax)) return false;
      }
    }

    // Add range — for multifocale lenses, the patient's addition must be within range
    if (lens.type === "multifocale" || lens.type === "torique-multifocale") {
      const maxAdd = Math.max(odResult.addValue, ogResult.addValue);
      if (maxAdd > 0) {
        if (lens.addMax !== undefined && maxAdd > lens.addMax) return false;
        if (lens.addMin !== undefined && maxAdd < lens.addMin) return false;
      }
    }

    return true;
  });
}

/* ── Dossiers de réadaptation ──────────────────────────────────────────── */

export interface EssaiPrecedent {
  lentille: string;
  brand: string;
  date: string;
  odPuissance: string;
  ogPuissance: string;
  bcOD: string;
  bcOG: string;
  problemes: string[];
  notes: string;
}

export interface DossierReadaptation {
  dossierId: string;
  patientName: string;
  odRx: EyeRx;
  ogRx: EyeRx;
  essais: EssaiPrecedent[];
}

export const MOCK_DOSSIERS_READAPTATION: DossierReadaptation[] = [
  {
    dossierId: "patient-001",
    patientName: "Paul Renaud",
    odRx: { sph: -2.25, cyl: -0.75, axe: 170, add: 0 },
    ogRx: { sph: -1.75, cyl: -0.50, axe: 10, add: 0 },
    essais: [
      {
        lentille: "1-Day Acuvue Moist for Astigmatism",
        brand: "Johnson & Johnson",
        date: "Nov 2024",
        odPuissance: "-2.25 Cyl -0.75 Axe 170°",
        ogPuissance: "-1.75",
        bcOD: "8.50",
        bcOG: "8.50",
        problemes: ["rotation", "secheresse"],
        notes: "Rotation 10° en OD, sécheresse en fin de journée (bureau climatisé)",
      },
    ],
  },
  {
    dossierId: "patient-002",
    patientName: "Marie Leblanc",
    odRx: { sph: -4.50, cyl: 0, axe: 0, add: 1.50 },
    ogRx: { sph: -4.25, cyl: 0, axe: 0, add: 1.50 },
    essais: [
      {
        lentille: "Air Optix Plus HydraGlyde Multifocal",
        brand: "Alcon",
        date: "Jan 2025",
        odPuissance: "-4.25",
        ogPuissance: "-4.00",
        bcOD: "8.60",
        bcOG: "8.60",
        problemes: ["flou_pres", "fin_journee"],
        notes: "Addition insuffisante pour le travail de près, essayer profil N (Near dominant)",
      },
    ],
  },
  {
    dossierId: "patient-003",
    patientName: "Thomas Girard",
    odRx: { sph: -3.00, cyl: -1.25, axe: 45, add: 0 },
    ogRx: { sph: -2.75, cyl: -1.00, axe: 135, add: 0 },
    essais: [
      {
        lentille: "Biofinity Toric",
        brand: "CooperVision",
        date: "Oct 2024",
        odPuissance: "-3.00 Cyl -1.25 Axe 45°",
        ogPuissance: "-2.75 Cyl -1.00 Axe 135°",
        bcOD: "8.70",
        bcOG: "8.70",
        problemes: ["decentrement", "corps_etranger"],
        notes: "Travaille sur chantier - poussière. Décentrement fréquent, sensation corps étranger",
      },
    ],
  },
];

/* ── Problèmes de réadaptation ─────────────────────────────────────────── */

export const PROBLEMES_READAPTATION: ProblemeReadaptation[] = [
  { id: "flou_loin",      categorie: "vision",      label: "Vision floue de loin",                  suggestion: "Vérifier la puissance sphérique en lentille, refaire une réfraction sur lentilles en place. Contrôler la stabilité de l'axe (torique)." },
  { id: "flou_pres",      categorie: "vision",      label: "Vision floue de près (presbyte)",        suggestion: "Augmenter l'addition ou tester un profil « Near » / « N » dominant. Envisager la monovision sur l'œil non directeur." },
  { id: "fluctuation",    categorie: "vision",      label: "Vision fluctuante",                      suggestion: "Suspecter une rotation torique ou un larmoiement excessif. Tester une lentille à module de rigidité supérieur ou une conception de stabilisation différente." },
  { id: "secheresse",     categorie: "confort",     label: "Sécheresse oculaire / inconfort",        suggestion: "Passer en silicone-hydrogel water gradient (Dailies Total 1, Total30) ou journalières. Revoir le temps de port et l'hydratation." },
  { id: "corps_etranger", categorie: "confort",     label: "Sensation de corps étranger",            suggestion: "Essayer un diamètre ou un RC différent. Vérifier l'état de surface de la lentille et la qualité du film lacrymal." },
  { id: "brulures",       categorie: "confort",     label: "Brûlures / picotements",                 suggestion: "Suspecter une réaction à la solution d'entretien → passer en journalières. Ou allergie aux dépôts → réduire la fréquence de remplacement." },
  { id: "rotation",       categorie: "ajustement",  label: "Rotation excessive (torique)",           suggestion: "Ajuster l'axe de ±5° à ±10° selon la règle LARS (Gauche + / Droite −). Tester une marque avec meilleur système de stabilisation (BLINK STABILIZED, 4-point)." },
  { id: "decentrement",   categorie: "ajustement",  label: "Décentrement / lentille tombante",       suggestion: "Modifier le rayon de courbure (RC plus serré) ou augmenter le diamètre de +0.5 mm. Vérifier la kératométrie." },
  { id: "allergie",       categorie: "tolerance",   label: "Allergie / réaction au matériau",        suggestion: "Changer de polymère. Passer en journalières (zéro dépôt). Orienter vers bilan allergologique si persistance." },
  { id: "neovasc",        categorie: "tolerance",   label: "Néovascularisation cornéenne",           suggestion: "Arrêt immédiat. Passer obligatoirement en silicone-hydrogel haute Dk/t (> 100). Surveiller 3 mois." },
  { id: "infiltrats",     categorie: "tolerance",   label: "Infiltrats / CLPU",                      suggestion: "Arrêt temporaire. Réduire le temps de port. Après résolution : RPG ou SiHy haute Dk/t, jamais de port prolongé." },
  { id: "fin_journee",    categorie: "autre",       label: "Inconfort en fin de journée",            suggestion: "Réduire le temps de port. Tester les water gradient (Dailies Total 1) ou ajouter des larmes artificielles compatibles. Envisager les RPG pour les porteurs longue durée." },
  { id: "lumiere",        categorie: "autre",       label: "Sensibilité à la lumière / halos",       suggestion: "Vérifier le centrage et la taille de la zone optique. Les RPG offrent généralement moins de halos nocturnes que les multifocaux souples." },
];

/* ── Labels ────────────────────────────────────────────────────────────── */

export const TYPE_LABELS: Record<LensType, string> = {
  spherique:             "Sphérique",
  torique:               "Torique (astigmate)",
  multifocale:           "Multifocale (presbyte)",
  "torique-multifocale": "Torique-Multifocale",
  rigide:                "Rigide perméable (RPG)",
};

export const REPLACEMENT_LABELS: Record<Replacement, string> = {
  journalier:  "Journalière",
  bimensuel:   "Bimensuelle (2 semaines)",
  mensuel:     "Mensuelle",
  trimestriel: "Trimestrielle",
  annuel:      "Annuelle / RPG",
};
