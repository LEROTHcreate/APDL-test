/**
 * THOR — Règles de remboursement Sécurité Sociale + Mutuelle
 * Sources : ameli.fr, service-public.fr, ministère de la Santé
 * Réforme 100% Santé (2021) — Tarifs 2024-2025
 *
 * Structure :
 *  SS rembourse toujours 60% du tarif de base (sauf cas particuliers)
 *  Mutuelle couvre le ticket modérateur (40%) pour les contrats responsables
 *  Classe 1 = 100% Santé = 0€ RAC garanti
 *  Classe 2 = libre = RAC possible selon prix et contrat mutuelle
 */

/* ══════════════════════════════════════════════════════════════════
   AUDIO — Appareils auditifs
   ══════════════════════════════════════════════════════════════════ */

/** Tarif de base (plafond de remboursement) commun aux deux classes */
export const AUDIO_TARIF_BASE_SS = 1400; // € par oreille

/** Taux SS standard */
export const AUDIO_TAUX_SS_STANDARD = 0.6; // 60%

/** SS standard = 60% × 1400€ = 840€/oreille */
export const AUDIO_REMBOURSEMENT_SS_STANDARD = 840; // €/oreille

/** Classe 1 — 100% Santé */
export const AUDIO_CLASSE_1 = {
  plafondTTC: 1400,         // € TTC/oreille (prix max autorisé)
  tarifBaseSS: 1400,
  remboursementSS: 840,     // 60% × 1400
  remboursementMutuelle: 560, // 40% × 1400 (obligatoire contrat responsable)
  racGaranti: 0,
  garantieMinimale: "4 ans",
  essaiMinimal: "30 jours",
  note: "Sans reste à charge — SS 840€ + Mutuelle 560€ = 1400€ couverts",
};

/** Classe 2 — Libre */
export const AUDIO_CLASSE_2 = {
  tarifBaseSS: 1400,        // base de calcul SS (même tarif que classe 1)
  remboursementSS: 840,     // 60% × 1400 (identique à classe 1)
  note: "SS rembourse 840€/oreille. Le RAC dépend du prix réel et de la mutuelle.",
};

/** Cas particuliers audio */
export const AUDIO_CAS_PARTICULIERS = {
  ALD: {
    tauxSS: 1.0,            // 100% — exonération ticket modérateur
    remboursementSS: 1400,  // 100% × 1400
    note: "Affection Longue Durée : SS rembourse 100% du tarif de base (1400€)",
  },
  enfantMoins20ans: {
    accesPrioritaire100pSante: true,
    remboursementSS: 840,
    note: "Priorité d'accès aux offres 100% Santé. Mêmes remboursements que classe 1.",
  },
  CSS: {
    // Complémentaire Santé Solidaire (ex-CMU-C)
    plafondTTC: 800,         // € TTC/oreille
    remboursementSS: 480,    // 60% × 800
    remboursementCSS: 320,   // 40% × 800
    racGaranti: 0,
    note: "CSS : plafond 800€/oreille — zéro reste à charge",
  },
  accidentTravail: {
    tauxSS: 1.5,             // 150% du tarif de base
    remboursementSS: 1260,   // 150% × 840 (indicatif)
    note: "Accident du travail / maladie professionnelle : taux majoré 150%",
  },
  delaiEntreDeuxAppareillages: {
    anneesStandard: 4,
    renouvellementAnticipe: "Possible sur certificat médical + accord service médical AM",
    note: "4 ans minimum entre deux appareillages remboursés par la SS",
  },
};

/**
 * Calcule le RAC audio selon le prix, la classe et le profil patient
 */
export function calcRacAudio(params: {
  prixTTC: number;
  classe: 1 | 2;
  nbOreilles: 1 | 2;
  ald?: boolean;
  css?: boolean;
  remboursementMutuelle?: number; // par oreille
}): {
  remboursementSS: number;
  remboursementMutuelle: number;
  rac: number;
  total: number;
} {
  const { prixTTC, classe, nbOreilles, ald, css, remboursementMutuelle = 0 } = params;

  let ssParOreille: number;
  if (css) {
    ssParOreille = AUDIO_CAS_PARTICULIERS.CSS.remboursementSS;
  } else if (ald) {
    ssParOreille = AUDIO_CAS_PARTICULIERS.ALD.remboursementSS;
  } else {
    ssParOreille = AUDIO_REMBOURSEMENT_SS_STANDARD; // 840
  }

  let mutuParOreille = remboursementMutuelle;
  if (classe === 1 && !css && !ald) {
    // Contrat responsable obligé de couvrir jusqu'à 1400€
    mutuParOreille = Math.max(mutuParOreille, AUDIO_CLASSE_1.remboursementMutuelle);
  }

  const prixParOreille = prixTTC; // prix affiché est par oreille
  const racParOreille = Math.max(0, prixParOreille - ssParOreille - mutuParOreille);

  return {
    remboursementSS: ssParOreille * nbOreilles,
    remboursementMutuelle: mutuParOreille * nbOreilles,
    rac: racParOreille * nbOreilles,
    total: prixParOreille * nbOreilles,
  };
}

/* ══════════════════════════════════════════════════════════════════
   OPTIQUE — Lunettes, verres, montures
   ══════════════════════════════════════════════════════════════════ */

/** Taux SS standard optique : 60% */
export const OPTIQUE_TAUX_SS = 0.6;

/** Monture */
export const OPTIQUE_MONTURE = {
  classe1: {
    plafond: 30,              // € TTC (max autorisé classe 1)
    remboursementSS: 2,       // SS base : 2€ (60% × 3.33€ tarif arrondi)
    remboursementMutuMax: 28, // complémentaire jusqu'à 28€ pour atteindre 30€
    racGaranti: 0,
  },
  classe2: {
    remboursementSS: 2,       // SS fixe : 2€ (indépendant du prix réel)
    note: "Monture libre — SS ne rembourse que 2€ fixes",
  },
};

/** Verres unifocaux */
export const OPTIQUE_VERRES_UNIFOCAUX = {
  classe1: {
    remboursementSS: 1.70,    // 60% × 2.84€ tarif base
    remboursementMutuMax: 1.14, // 40% × 2.84
    noteEquipementComplet: "Équipement complet classe 1 couvert à 100% via forfaits SS+mutuelle",
  },
  classe2: {
    remboursementSS: 1.70,    // idem (tarif base 2.84€ × 60%)
    note: "RAC selon prix réel et mutuelle",
  },
};

/** Verres progressifs */
export const OPTIQUE_VERRES_PROGRESSIFS = {
  classe1: {
    remboursementSSMax: 60,   // SS peut rembourser jusqu'à ~60€/verre selon correction
    racGaranti: 0,
    note: "100% Santé — plafond TTC selon degré de correction (voir tableau ci-dessous)",
  },
  classe2: {
    remboursementSSMax: 60,   // même base SS que classe 1
    note: "RAC possible selon prix réel",
  },
};

/**
 * Forfaits 100% Santé optique (équipement complet : monture + 2 verres)
 * Plafonds TTC selon correction — Source : ministère de la Santé 2024
 */
export const OPTIQUE_FORFAITS_100_SANTE: Array<{
  label: string;
  puissanceMin: number;
  puissanceMax: number;
  plafondUnifocaux: number;
  plafondProgressifs: number;
}> = [
  { label: "Correction faible",        puissanceMin: 0,   puissanceMax: 2,   plafondUnifocaux:  95, plafondProgressifs: 180 },
  { label: "Correction moyenne",       puissanceMin: 2,   puissanceMax: 4,   plafondUnifocaux: 117, plafondProgressifs: 212 },
  { label: "Forte correction",         puissanceMin: 4,   puissanceMax: 6,   plafondUnifocaux: 195, plafondProgressifs: 280 },
  { label: "Très forte correction",    puissanceMin: 6,   puissanceMax: 99,  plafondUnifocaux: 265, plafondProgressifs: 370 },
];

/** Lentilles de contact */
export const OPTIQUE_LENTILLES = {
  tarifBaseAnnuelParOeil: 39.48,   // €/œil/an (LPPR)
  remboursementSSParOeil: 23.69,   // 60% × 39.48
  conditionMedicale: true,         // ordonnance médicale obligatoire (kératocône, etc.)
  note: "Remboursement SS uniquement sur prescription médicale avec indication médicale reconnue. Renouvellement simple (myopie/astigmatisme courant) non remboursé.",
};

/** Cas particuliers optique */
export const OPTIQUE_CAS_PARTICULIERS = {
  ALD: {
    tauxSS: 1.0,
    note: "SS rembourse à 100% (ticket modérateur exonéré)",
  },
  enfantMoins18ans: {
    tauxSS: 1.0,
    racGaranti: 0,
    note: "Enfants < 18 ans : 100% Santé obligatoire, zéro RAC",
  },
  accidentTravail: {
    tauxSS: 1.5,
    note: "Taux majoré 150% du tarif de base SS",
  },
  CSS: {
    acces100pSante: true,
    racGaranti: 0,
    note: "Complémentaire Santé Solidaire : accès automatique aux offres sans RAC",
  },
};

/** Supplément 42€ classe A (2025) */
export const OPTIQUE_SUPPLEMENT_42 = {
  montant: 42,
  condition: "Distributeur ayant dépassé 65% d'équipements classe A vendus",
  priseEnCharge: "100% par l'Assurance Maladie",
  note: "Applicable depuis 2025 pour certains professionnels conventionnés",
};

/* ══════════════════════════════════════════════════════════════════
   UTILITAIRES
   ══════════════════════════════════════════════════════════════════ */

/** Calcule le RAC optique (verres + monture) */
export function calcRacOptique(params: {
  prixMonture: number;
  prixVerreOD: number;
  prixVerreOG: number;
  classe: 1 | 2;
  typeVerres: "unifocaux" | "progressifs";
  ald?: boolean;
  enfantMoins18?: boolean;
  remboursementMutuelle?: number;
}): {
  remboursementSS: number;
  remboursementMutuelle: number;
  rac: number;
  total: number;
} {
  const { prixMonture, prixVerreOD, prixVerreOG, classe, typeVerres, ald, enfantMoins18, remboursementMutuelle = 0 } = params;
  const total = prixMonture + prixVerreOD + prixVerreOG;

  if (ald || enfantMoins18) {
    // 100% remboursé (SS prend tout)
    return { remboursementSS: total, remboursementMutuelle: 0, rac: 0, total };
  }

  if (classe === 1) {
    // 100% Santé : 0€ RAC (SS 60% + mutuelle 40%)
    const ss = total * 0.6;
    const mtu = total * 0.4;
    return { remboursementSS: ss, remboursementMutuelle: mtu, rac: 0, total };
  }

  // Classe 2
  const ssMonture = OPTIQUE_MONTURE.classe2.remboursementSS;
  const ssVerreOD = typeVerres === "progressifs" ? OPTIQUE_VERRES_PROGRESSIFS.classe2.remboursementSSMax : OPTIQUE_VERRES_UNIFOCAUX.classe2.remboursementSS;
  const ssVerreOG = ssVerreOD;
  const totalSS = ssMonture + ssVerreOD + ssVerreOG;

  const rac = Math.max(0, total - totalSS - remboursementMutuelle);
  return {
    remboursementSS: totalSS,
    remboursementMutuelle: remboursementMutuelle,
    rac,
    total,
  };
}
