/* ═══════════════════════════════════════════════════════════════
   THOR – Base de données stock optique
   ═══════════════════════════════════════════════════════════════ */

export type StockCategorie =
  | "verres-progressifs"
  | "verres-simples"
  | "montures-optiques"
  | "montures-solaires"
  | "lentilles-souples"
  | "lentilles-rigides"
  | "accessoires";

export interface StockItem {
  id: string;
  categorie: StockCategorie;
  marque: string;
  reference: string;        // nom du produit / référence
  description: string;      // courte description
  quantite: number;         // unités en stock
  quantiteMin: number;      // seuil d'alerte stock bas
  prixAchat: number;        // PA HT €
  prixVente: number;        // PV TTC €
  pru: number;              // Prix de Revient Unitaire moyen pondéré
  coeff: number;            // PV_TTC / (PA_HT × 1.20)
  margeEuros: number;       // PV - PA×1.20
  margePct: number;         // (margeEuros / PV) × 100
  fournisseur: string;
  delaiReappro: number;     // jours
  actif: boolean;
}

/* ── Helper de calcul ──────────────────────────────────────────── */
function mkItem(
  id: string,
  categorie: StockCategorie,
  marque: string,
  reference: string,
  description: string,
  quantite: number,
  quantiteMin: number,
  prixAchat: number,
  prixVente: number,
  fournisseur: string,
  delaiReappro: number,
): StockItem {
  const paHT120 = prixAchat * 1.2;
  const margeEuros = parseFloat((prixVente - paHT120).toFixed(2));
  const margePct = parseFloat(((margeEuros / prixVente) * 100).toFixed(1));
  const coeff = parseFloat((prixVente / paHT120).toFixed(2));
  return {
    id, categorie, marque, reference, description,
    quantite, quantiteMin, prixAchat, prixVente,
    pru: prixAchat,
    coeff, margeEuros, margePct,
    fournisseur, delaiReappro, actif: true,
  };
}

/* ════════════════════════════════════════════════════════════════
   VERRES PROGRESSIFS
   ════════════════════════════════════════════════════════════════ */
const VERRES_PROGRESSIFS: StockItem[] = [
  // ── Essilor ─────────────────────────────────────────────────
  mkItem("vp-ess-01", "verres-progressifs", "Essilor", "Varilux X Series",
    "Progressif haut de gamme — paire 1.67",
    6, 3, 170, 571, "Essilor France", 5),
  mkItem("vp-ess-02", "verres-progressifs", "Essilor", "Varilux Comfort Max",
    "Progressif confort — paire 1.6",
    10, 4, 110, 308, "Essilor France", 5),
  mkItem("vp-ess-03", "verres-progressifs", "Essilor", "Varilux Digitime",
    "Progressif digital / écrans — paire 1.6",
    8, 3, 130, 436, "Essilor France", 5),
  mkItem("vp-ess-04", "verres-progressifs", "Essilor", "Crizal Sapphire UV",
    "Traitement anti-reflet premium (par verre)",
    25, 8, 25, 80, "Essilor France", 5),
  mkItem("vp-ess-05", "verres-progressifs", "Essilor", "Transitions Gen 8",
    "Verre photochromique add-on (par verre)",
    20, 8, 30, 96, "Essilor France", 7),

  // ── Zeiss ────────────────────────────────────────────────────
  mkItem("vp-zei-01", "verres-progressifs", "Zeiss", "SmartLife Progressive Individual",
    "Progressif sur mesure — paire 1.67",
    5, 2, 184, 636, "Zeiss Vision Care", 7),
  mkItem("vp-zei-02", "verres-progressifs", "Zeiss", "SmartLife Progressive Standard",
    "Progressif standard — paire 1.6",
    9, 3, 136, 470, "Zeiss Vision Care", 7),
  mkItem("vp-zei-03", "verres-progressifs", "Zeiss", "DriveSafe",
    "Progressif conduite & extérieur — paire 1.6",
    6, 2, 116, 335, "Zeiss Vision Care", 7),
  mkItem("vp-zei-04", "verres-progressifs", "Zeiss", "BlueGuard",
    "Anti-lumière bleue intégré — paire 1.6",
    8, 3, 90, 260, "Zeiss Vision Care", 7),

  // ── Hoya ─────────────────────────────────────────────────────
  mkItem("vp-hoy-01", "verres-progressifs", "Hoya", "iD MyStyle V+",
    "Progressif personnalisé — paire 1.67",
    5, 2, 156, 440, "Hoya Lens France", 8),
  mkItem("vp-hoy-02", "verres-progressifs", "Hoya", "Hoya Sync III",
    "Progressif digital 18-40 ans — paire 1.6",
    7, 3, 104, 292, "Hoya Lens France", 8),
  mkItem("vp-hoy-03", "verres-progressifs", "Hoya", "Hoya Lifestyle 3",
    "Progressif polyvalent — paire 1.6",
    8, 3, 124, 348, "Hoya Lens France", 8),
  mkItem("vp-hoy-04", "verres-progressifs", "Hoya", "Nulux Active 1.74",
    "Progressif indice 1.74 ultra-mince — paire",
    4, 2, 190, 532, "Hoya Lens France", 8),

  // ── Nikon ────────────────────────────────────────────────────
  mkItem("vp-nik-01", "verres-progressifs", "Nikon", "SeeMax One",
    "Progressif sur mesure — paire 1.6",
    6, 2, 140, 392, "Nikon Optical Europe", 10),
  mkItem("vp-nik-02", "verres-progressifs", "Nikon", "Presio Power",
    "Progressif haute puissance — paire 1.67",
    4, 2, 170, 476, "Nikon Optical Europe", 10),

  // ── Novacel ──────────────────────────────────────────────────
  mkItem("vp-nov-01", "verres-progressifs", "Novacel", "Attitude 4D",
    "Progressif 4 distances — paire 1.6",
    8, 3, 96, 268, "Novacel", 6),
  mkItem("vp-nov-02", "verres-progressifs", "Novacel", "Attitude Hi 1.67",
    "Progressif haute correction — paire 1.67",
    5, 2, 116, 325, "Novacel", 6),

  // ── BBGR ─────────────────────────────────────────────────────
  mkItem("vp-bbg-01", "verres-progressifs", "BBGR", "Stylis 1.67",
    "Progressif indice 1.67 — paire",
    7, 3, 84, 235, "BBGR", 6),
  mkItem("vp-bbg-02", "verres-progressifs", "BBGR", "Neva Max",
    "Progressif large plage — paire 1.6",
    6, 3, 110, 308, "BBGR", 6),

  // ── Shamir ───────────────────────────────────────────────────
  mkItem("vp-sha-01", "verres-progressifs", "Shamir", "Autograph Intelligence",
    "Progressif IA — paire 1.67",
    4, 2, 176, 493, "Shamir Optical Industry", 10),
  mkItem("vp-sha-02", "verres-progressifs", "Shamir", "Shamir Relax",
    "Prébyopie débutante, anti-fatigue — paire",
    8, 3, 90, 252, "Shamir Optical Industry", 10),

  // ── Rodenstock ───────────────────────────────────────────────
  mkItem("vp-rod-01", "verres-progressifs", "Rodenstock", "Impression FreeSign 3",
    "Progressif individualisé — paire 1.67",
    4, 2, 164, 459, "Rodenstock GmbH", 10),
  mkItem("vp-rod-02", "verres-progressifs", "Rodenstock", "Multigressiv MyLife",
    "Progressif polyvalent — paire 1.6",
    6, 2, 136, 381, "Rodenstock GmbH", 10),
];

/* ════════════════════════════════════════════════════════════════
   VERRES SIMPLES (unifocaux)
   ════════════════════════════════════════════════════════════════ */
const VERRES_SIMPLES: StockItem[] = [
  mkItem("vs-ess-01", "verres-simples", "Essilor", "Stylis 1.5 base",
    "Unifocal 1.5 traitement AR — paire",
    20, 6, 36, 151, "Essilor France", 4),
  mkItem("vs-ess-02", "verres-simples", "Essilor", "Orma 1.5 AR",
    "Unifocal organique anti-reflet — paire",
    18, 5, 44, 185, "Essilor France", 4),
  mkItem("vs-zei-01", "verres-simples", "Zeiss", "Single Vision ClearView",
    "Unifocal clarté maximale — paire",
    14, 4, 56, 235, "Zeiss Vision Care", 6),
  mkItem("vs-hoy-01", "verres-simples", "Hoya", "Hilux 1.67",
    "Unifocal indice 1.67 mince & léger — paire",
    10, 3, 76, 319, "Hoya Lens France", 7),
];

/* ════════════════════════════════════════════════════════════════
   MONTURES OPTIQUES
   ════════════════════════════════════════════════════════════════ */
const MONTURES_OPTIQUES: StockItem[] = [
  // ── Ray-Ban ──────────────────────────────────────────────────
  mkItem("mo-rb-01", "montures-optiques", "Ray-Ban", "RB5154 Clubmaster",
    "Monture acetate browline classique",
    8, 3, 45, 150, "Luxottica Group", 14),
  mkItem("mo-rb-02", "montures-optiques", "Ray-Ban", "RB2132 New Wayfarer",
    "Monture acetate carrée iconique",
    12, 4, 42, 140, "Luxottica Group", 14),
  mkItem("mo-rb-03", "montures-optiques", "Ray-Ban", "RB5228",
    "Monture acetate rectangulaire",
    6, 2, 38, 125, "Luxottica Group", 14),
  mkItem("mo-rb-04", "montures-optiques", "Ray-Ban", "RB5387 Oval",
    "Monture acetate ronde fifties",
    5, 2, 40, 133, "Luxottica Group", 14),
  mkItem("mo-rb-05", "montures-optiques", "Ray-Ban", "RB6489 Titanium",
    "Monture titane full rim légère",
    4, 2, 68, 225, "Luxottica Group", 14),

  // ── Silhouette ───────────────────────────────────────────────
  mkItem("mo-sil-01", "montures-optiques", "Silhouette", "Momentum Full Rim",
    "Monture titane ultra-légère full rim",
    4, 2, 120, 390, "Silhouette International", 21),
  mkItem("mo-sil-02", "montures-optiques", "Silhouette", "Titan Minimal Art",
    "Monture titane sans visserie emblématique",
    3, 1, 145, 470, "Silhouette International", 21),
  mkItem("mo-sil-03", "montures-optiques", "Silhouette", "Urban Fusion",
    "Monture titane/acétate mixte contemporaine",
    3, 1, 135, 438, "Silhouette International", 21),
  mkItem("mo-sil-04", "montures-optiques", "Silhouette", "Purist",
    "Monture titane rimless ultraplate",
    2, 1, 158, 512, "Silhouette International", 21),

  // ── Lindberg ─────────────────────────────────────────────────
  mkItem("mo-lin-01", "montures-optiques", "Lindberg", "Air Titanium Rim 9540",
    "Monture titane minimaliste sans visserie",
    2, 1, 185, 600, "Lindberg A/S", 21),
  mkItem("mo-lin-02", "montures-optiques", "Lindberg", "Strip Titanium 9504",
    "Monture titane strip ultra-fine",
    2, 1, 195, 630, "Lindberg A/S", 21),
  mkItem("mo-lin-03", "montures-optiques", "Lindberg", "Acetate 1047",
    "Monture acétate premium collection Lindberg",
    2, 1, 178, 578, "Lindberg A/S", 21),

  // ── Chanel ───────────────────────────────────────────────────
  mkItem("mo-cha-01", "montures-optiques", "Chanel", "CH3282",
    "Monture acetate prestige avec chaîne",
    3, 1, 195, 630, "Chanel SAS", 28),
  mkItem("mo-cha-02", "montures-optiques", "Chanel", "CH3391",
    "Monture acetate avec logo CC",
    2, 1, 210, 680, "Chanel SAS", 28),
  mkItem("mo-cha-03", "montures-optiques", "Chanel", "CH3445",
    "Monture acier dorée bijou CC",
    2, 1, 220, 712, "Chanel SAS", 28),

  // ── Persol ───────────────────────────────────────────────────
  mkItem("mo-per-01", "montures-optiques", "Persol", "PO3007V",
    "Monture acetate meflecto élégante",
    5, 2, 75, 245, "Luxottica Group", 14),
  mkItem("mo-per-02", "montures-optiques", "Persol", "PO3012V",
    "Monture acetate rectangulaire premium",
    4, 2, 80, 260, "Luxottica Group", 14),
  mkItem("mo-per-03", "montures-optiques", "Persol", "PO3152V Tailoring Edition",
    "Monture acier demi-cerclée collection Tailoring",
    4, 2, 88, 285, "Luxottica Group", 14),
  mkItem("mo-per-04", "montures-optiques", "Persol", "PO2457V",
    "Monture acier ronde meflecto",
    4, 2, 72, 234, "Luxottica Group", 14),

  // ── Mykita ───────────────────────────────────────────────────
  mkItem("mo-myk-01", "montures-optiques", "Mykita", "Mylon Series",
    "Monture nylon haute performance légère",
    2, 1, 160, 520, "Mykita GmbH", 21),
  mkItem("mo-myk-02", "montures-optiques", "Mykita", "Acetate Collection",
    "Monture acetate artisanale berlinoise",
    3, 1, 140, 455, "Mykita GmbH", 21),

  // ── Tom Ford ─────────────────────────────────────────────────
  mkItem("mo-tf-01", "montures-optiques", "Tom Ford", "TF5178",
    "Monture acetate luxe à charnière ressort",
    4, 2, 95, 310, "Marcolin Group", 14),
  mkItem("mo-tf-02", "montures-optiques", "Tom Ford", "TF5506",
    "Monture acetate carrée prestige",
    3, 1, 105, 340, "Marcolin Group", 14),
  mkItem("mo-tf-03", "montures-optiques", "Tom Ford", "TF5663-B Blue Block",
    "Monture acetate filtre lumière bleue intégré",
    4, 2, 98, 318, "Marcolin Group", 14),
  mkItem("mo-tf-04", "montures-optiques", "Tom Ford", "TF5866",
    "Monture acétate ronde luxe dorée",
    3, 1, 112, 363, "Marcolin Group", 14),

  // ── Lafont ───────────────────────────────────────────────────
  mkItem("mo-laf-01", "montures-optiques", "Lafont", "Apero",
    "Monture acetate français design parisien",
    5, 2, 88, 285, "Lafont Paris", 10),
  mkItem("mo-laf-02", "montures-optiques", "Lafont", "Clafoutis",
    "Monture acetate colorée collection Paris",
    4, 2, 82, 265, "Lafont Paris", 10),

  // ── Vuarnet ──────────────────────────────────────────────────
  mkItem("mo-vua-01", "montures-optiques", "Vuarnet", "VL1622",
    "Monture acetate style alpin français",
    3, 1, 72, 235, "Vuarnet SAS", 14),

  // ── Alain Mikli ──────────────────────────────────────────────
  mkItem("mo-ami-01", "montures-optiques", "Alain Mikli", "A03036",
    "Monture acetate créateur parisien",
    3, 1, 125, 405, "Luxottica Group", 14),

  // ── Vincent Kaes ─────────────────────────────────────────────
  mkItem("mo-vk-01", "montures-optiques", "Vincent Kaes", "VK2024-01",
    "Monture artisanale française — collection 2024",
    2, 1, 95, 310, "Vincent Kaes", 21),
  mkItem("mo-vk-02", "montures-optiques", "Vincent Kaes", "VK2024-02",
    "Monture artisanale acétate — édition limitée",
    3, 1, 105, 340, "Vincent Kaes", 21),

  // ── Steve McQueen Eyewear ────────────────────────────────────
  mkItem("mo-smq-01", "montures-optiques", "Steve McQueen Eyewear", "Steve/06",
    "Monture vintage inspirée Steve McQueen",
    2, 1, 110, 355, "Steve McQueen Eyewear SAS", 21),
  mkItem("mo-smq-02", "montures-optiques", "Steve McQueen Eyewear", "Steve/12",
    "Monture ronde acetate collection cinéma",
    2, 1, 120, 390, "Steve McQueen Eyewear SAS", 21),

  // ── La Brique et la Violette ─────────────────────────────────
  mkItem("mo-bv-01", "montures-optiques", "La Brique et la Violette", "Briq.01 Havane",
    "Monture acetate artisanale havane brun",
    3, 1, 130, 420, "La Brique et la Violette", 21),
  mkItem("mo-bv-02", "montures-optiques", "La Brique et la Violette", "Viol.03 Noir",
    "Monture acetate artisanale noir profond",
    2, 1, 135, 435, "La Brique et la Violette", 21),

  // ── ic! berlin ───────────────────────────────────────────────
  mkItem("mo-icb-01", "montures-optiques", "ic! berlin", "model J",
    "Monture acier sans vis berlino-minimaliste",
    3, 1, 98, 318, "ic! berlin GmbH", 21),
  mkItem("mo-icb-02", "montures-optiques", "ic! berlin", "model K",
    "Monture acier screwless articulée",
    2, 1, 102, 330, "ic! berlin GmbH", 21),

  // ── Gucci ────────────────────────────────────────────────────
  mkItem("mo-gcc-01", "montures-optiques", "Gucci", "GG0545O",
    "Monture acetate maison Gucci — web stripe",
    2, 1, 155, 502, "Kering Eyewear", 28),

  // ── Prada ────────────────────────────────────────────────────
  mkItem("mo-pra-01", "montures-optiques", "Prada", "PR 05WV",
    "Monture acétate Prada symbole",
    2, 1, 145, 470, "Luxottica Group", 28),

  // ── Face à Face ──────────────────────────────────────────────
  mkItem("mo-faf-01", "montures-optiques", "Face à Face", "Jolly 1",
    "Monture acetate colorée brand français",
    4, 2, 85, 275, "Face à Face", 14),

  // ── Theo ─────────────────────────────────────────────────────
  mkItem("mo-the-01", "montures-optiques", "Theo", "Stockholm",
    "Monture acetate belge design audacieux",
    3, 1, 92, 298, "Theo eyewear", 21),

  // ── Carrera ──────────────────────────────────────────────────
  mkItem("mo-car-01", "montures-optiques", "Carrera", "CARRERA 8835",
    "Monture acier sport tendance",
    7, 3, 48, 156, "Safilo Group", 14),

  // ── Vogue Eyewear ────────────────────────────────────────────
  mkItem("mo-vog-01", "montures-optiques", "Vogue Eyewear", "VO5008",
    "Monture acetate tendance accessible",
    10, 4, 32, 104, "Luxottica Group", 10),

  // ── Oliver Peoples ───────────────────────────────────────────
  mkItem("mo-op-01", "montures-optiques", "Oliver Peoples", "OV5184 Gregory Peck",
    "Monture acetate vintage californienne",
    3, 1, 115, 375, "Safilo Group", 21),
  mkItem("mo-op-02", "montures-optiques", "Oliver Peoples", "OV1104 Sheldrake",
    "Monture acier fine browline",
    4, 2, 105, 340, "Safilo Group", 21),
  mkItem("mo-op-03", "montures-optiques", "Oliver Peoples", "OV5393U Romare",
    "Monture acetate rectangulaire ronde",
    3, 1, 118, 385, "Safilo Group", 21),

  // ── Dior ─────────────────────────────────────────────────────
  mkItem("mo-dio-01", "montures-optiques", "Dior", "DiorBlackSuit R3I",
    "Monture acetate Dior prestige",
    2, 1, 162, 525, "LVMH Fashion Group", 28),
  mkItem("mo-dio-02", "montures-optiques", "Dior", "DiorEssential AU",
    "Monture acier doré emblème CD",
    2, 1, 175, 568, "LVMH Fashion Group", 28),

  // ── Hugo Boss ────────────────────────────────────────────────
  mkItem("mo-hb-01", "montures-optiques", "Hugo Boss", "BOSS 1426",
    "Monture acier élégante semi-cerclée",
    6, 2, 58, 188, "Safilo Group", 14),
  mkItem("mo-hb-02", "montures-optiques", "Hugo Boss", "BOSS 1582",
    "Monture acetate carrée business",
    5, 2, 55, 178, "Safilo Group", 14),
  mkItem("mo-hb-03", "montures-optiques", "Hugo Boss", "BOSS 1433",
    "Monture acier rectangulaire double pont",
    5, 2, 62, 200, "Safilo Group", 14),

  // ── Morel ────────────────────────────────────────────────────
  mkItem("mo-mor-01", "montures-optiques", "Morel", "Lightec 30261L",
    "Monture titane ultra-légère française",
    4, 2, 88, 285, "Morel", 14),
  mkItem("mo-mor-02", "montures-optiques", "Morel", "Koali 8260 K",
    "Monture acetate design parisien",
    5, 2, 78, 253, "Morel", 14),

  // ── Koali (Morel) ────────────────────────────────────────────
  mkItem("mo-koa-01", "montures-optiques", "Koali", "20097 O",
    "Monture acetate colorée collection Koali",
    5, 2, 72, 234, "Morel", 14),
  mkItem("mo-koa-02", "montures-optiques", "Koali", "20112 O",
    "Monture acetate ronde bohème",
    4, 2, 76, 246, "Morel", 14),

  // ── Etnia Barcelona ──────────────────────────────────────────
  mkItem("mo-etnia-01", "montures-optiques", "Etnia Barcelona", "Havana",
    "Monture acetate colorée made in Barcelona",
    5, 2, 82, 265, "Etnia Barcelona", 21),
  mkItem("mo-etnia-02", "montures-optiques", "Etnia Barcelona", "Notting Hill",
    "Monture acetate vintage multicolore",
    4, 2, 86, 278, "Etnia Barcelona", 21),
  mkItem("mo-etnia-03", "montures-optiques", "Etnia Barcelona", "Brooklyn",
    "Monture acétate rectangulaire graphique",
    4, 2, 80, 260, "Etnia Barcelona", 21),
  mkItem("mo-etnia-04", "montures-optiques", "Etnia Barcelona", "Tribeca",
    "Monture acétate oversize tendance",
    4, 2, 84, 272, "Etnia Barcelona", 21),

  // ── Celine ───────────────────────────────────────────────────
  mkItem("mo-cel-01", "montures-optiques", "Celine", "CL50096I Thin",
    "Monture acétate fin minimaliste Celine",
    2, 1, 168, 545, "Kering Eyewear", 28),
  mkItem("mo-cel-02", "montures-optiques", "Celine", "CL50077I",
    "Monture acier dorée logo CL",
    2, 1, 175, 568, "Kering Eyewear", 28),

  // ── Bottega Veneta ───────────────────────────────────────────
  mkItem("mo-bv2-01", "montures-optiques", "Bottega Veneta", "BV1085O",
    "Monture acétate intreccio graphique",
    2, 1, 158, 512, "Kering Eyewear", 28),

  // ── Saint Laurent ────────────────────────────────────────────
  mkItem("mo-sl-01", "montures-optiques", "Saint Laurent", "SL M97",
    "Monture acétate rectangulaire SL Paris",
    3, 1, 148, 480, "Kering Eyewear", 28),
  mkItem("mo-sl-02", "montures-optiques", "Saint Laurent", "SL 576",
    "Monture acier fine structure élégante",
    3, 1, 155, 502, "Kering Eyewear", 28),

  // ── Oakley (optique) ─────────────────────────────────────────
  mkItem("mo-oak-01", "montures-optiques", "Oakley", "OX8156 Latch Panel",
    "Monture acétate sport lifestyle",
    5, 2, 68, 220, "Luxottica Group", 14),
  mkItem("mo-oak-02", "montures-optiques", "Oakley", "OX3006 Crosslink",
    "Monture nylon sport échangeable",
    5, 2, 62, 200, "Luxottica Group", 14),

  // ── Starck Biotech Paris ──────────────────────────────────────
  mkItem("mo-sta-01", "montures-optiques", "Starck Biotech Paris", "SH3036",
    "Monture biotech bimatière souple française",
    4, 2, 82, 265, "Starck Biotech Paris", 21),
  mkItem("mo-sta-02", "montures-optiques", "Starck Biotech Paris", "SH3069",
    "Monture titane biomatière ultime confort",
    3, 1, 98, 318, "Starck Biotech Paris", 21),

  // ── Fendi ────────────────────────────────────────────────────
  mkItem("mo-fen-01", "montures-optiques", "Fendi", "FE50070I",
    "Monture acetate baguette FF logo",
    2, 1, 165, 535, "Safilo Group", 28),

  // ── Versace ──────────────────────────────────────────────────
  mkItem("mo-ver-01", "montures-optiques", "Versace", "VE3329B",
    "Monture acier Medusa dorée",
    3, 1, 112, 363, "Luxottica Group", 21),
  mkItem("mo-ver-02", "montures-optiques", "Versace", "VE3303",
    "Monture acétate greca pattern",
    3, 1, 118, 383, "Luxottica Group", 21),

  // ── Emporio Armani ───────────────────────────────────────────
  mkItem("mo-ea-01", "montures-optiques", "Emporio Armani", "EA3220",
    "Monture acier fine semi-cerclée",
    6, 2, 52, 168, "Luxottica Group", 14),
  mkItem("mo-ea-02", "montures-optiques", "Emporio Armani", "EA1149",
    "Monture acétate rectangulaire logo",
    5, 2, 55, 178, "Luxottica Group", 14),

  // ── Giorgio Armani ───────────────────────────────────────────
  mkItem("mo-ga-01", "montures-optiques", "Giorgio Armani", "AR7184",
    "Monture acier luxe cerclée fine",
    3, 1, 118, 383, "Luxottica Group", 21),

  // ── Michael Kors ─────────────────────────────────────────────
  mkItem("mo-mk-01", "montures-optiques", "Michael Kors", "MK3065 Procida",
    "Monture acier doré féminine",
    5, 2, 48, 155, "Safilo Group", 14),

  // ── Lozza ────────────────────────────────────────────────────
  mkItem("mo-loz-01", "montures-optiques", "Lozza", "VL4206 Grandi",
    "Monture acétate rétro italienne",
    4, 2, 55, 178, "Safilo Group", 14),

  // ── Eschenbach ───────────────────────────────────────────────
  mkItem("mo-esc-01", "montures-optiques", "Eschenbach", "2935 lightOne",
    "Monture titane ultra-légère 1,9g",
    3, 1, 108, 350, "Eschenbach Optik", 21),
  mkItem("mo-esc-02", "montures-optiques", "Eschenbach", "2937 airOne",
    "Monture rimless titane poids plume",
    3, 1, 115, 373, "Eschenbach Optik", 21),

  // ── Ray-Ban — modèles iconiques complémentaires ───────────────
  mkItem("mo-rb-06", "montures-optiques", "Ray-Ban", "RB5383 Hexagonal",
    "Monture acétate hexagonale tendance",
    6, 2, 40, 133, "Luxottica Group", 14),
  mkItem("mo-rb-07", "montures-optiques", "Ray-Ban", "RB5356 Clubround",
    "Monture acétate demi-cerclée ronde",
    5, 2, 42, 140, "Luxottica Group", 14),
  mkItem("mo-rb-08", "montures-optiques", "Ray-Ban", "RB6434 Titanium",
    "Monture titane cerclée élégante",
    4, 2, 72, 240, "Luxottica Group", 14),
  mkItem("mo-rb-09", "montures-optiques", "Ray-Ban", "RB7140 Oval",
    "Monture acier ronde demi-cerclée",
    5, 2, 38, 126, "Luxottica Group", 14),

  // ── Persol — modèles iconiques complémentaires ────────────────
  mkItem("mo-per-05", "montures-optiques", "Persol", "PO3292V",
    "Monture acétate fine rectangle meflecto",
    4, 2, 82, 266, "Luxottica Group", 14),
  mkItem("mo-per-06", "montures-optiques", "Persol", "PO3225V",
    "Monture acétate ronde meflecto",
    4, 2, 78, 253, "Luxottica Group", 14),
  mkItem("mo-per-07", "montures-optiques", "Persol", "PO3143V",
    "Monture titane demi-cerclée ultra-fine",
    3, 1, 95, 308, "Luxottica Group", 14),

  // ── Alain Mikli — complémentaires ────────────────────────────
  mkItem("mo-ami-02", "montures-optiques", "Alain Mikli", "A03048",
    "Monture acétate audacieuse créateur",
    3, 1, 128, 415, "Luxottica Group", 14),
  mkItem("mo-ami-03", "montures-optiques", "Alain Mikli", "A03060",
    "Monture acétate oversize parisienne",
    2, 1, 132, 428, "Luxottica Group", 14),

  // ── Lafont — complémentaires ──────────────────────────────────
  mkItem("mo-laf-03", "montures-optiques", "Lafont", "Flore",
    "Monture acétate fleurie collection Paris",
    4, 2, 88, 285, "Lafont Paris", 10),
  mkItem("mo-laf-04", "montures-optiques", "Lafont", "Riviera",
    "Monture acétate ovale rétro-chic",
    4, 2, 85, 276, "Lafont Paris", 10),
  mkItem("mo-laf-05", "montures-optiques", "Lafont", "Tub",
    "Monture acétate rectangulaire graphique",
    4, 2, 82, 265, "Lafont Paris", 10),

  // ── Face à Face — complémentaires ────────────────────────────
  mkItem("mo-faf-02", "montures-optiques", "Face à Face", "Jazz 2",
    "Monture acétate colorée sport-chic",
    4, 2, 88, 285, "Face à Face", 14),
  mkItem("mo-faf-03", "montures-optiques", "Face à Face", "Bocca 2",
    "Monture acétate grand cadre tendance",
    3, 2, 92, 298, "Face à Face", 14),
  mkItem("mo-faf-04", "montures-optiques", "Face à Face", "Fraise",
    "Monture acétate asymétrique créative",
    3, 1, 95, 308, "Face à Face", 14),

  // ── Theo — complémentaires ────────────────────────────────────
  mkItem("mo-the-02", "montures-optiques", "Theo", "Ziggy",
    "Monture acétate géométrique belge",
    3, 1, 98, 318, "Theo eyewear", 21),
  mkItem("mo-the-03", "montures-optiques", "Theo", "Piton",
    "Monture titane cerclée minimaliste",
    3, 1, 95, 308, "Theo eyewear", 21),
  mkItem("mo-the-04", "montures-optiques", "Theo", "Halve Maan",
    "Monture acétate demi-lune audacieuse",
    2, 1, 102, 330, "Theo eyewear", 21),

  // ── Carrera — complémentaires ─────────────────────────────────
  mkItem("mo-car-02", "montures-optiques", "Carrera", "CARRERA 8863",
    "Monture acétate sport-fashion",
    6, 3, 52, 169, "Safilo Group", 14),
  mkItem("mo-car-03", "montures-optiques", "Carrera", "CARRERA 2025T",
    "Monture fine acier sportive",
    7, 3, 45, 146, "Safilo Group", 14),
  mkItem("mo-car-04", "montures-optiques", "Carrera", "CARRERA 1131",
    "Monture acier demi-cerclée pilote",
    5, 2, 50, 162, "Safilo Group", 14),

  // ── Vogue Eyewear — complémentaires ──────────────────────────
  mkItem("mo-vog-02", "montures-optiques", "Vogue Eyewear", "VO2787",
    "Monture acier féminine tendance",
    8, 3, 30, 97, "Luxottica Group", 10),
  mkItem("mo-vog-03", "montures-optiques", "Vogue Eyewear", "VO5051",
    "Monture acétate papillon féminin",
    8, 3, 35, 114, "Luxottica Group", 10),
  mkItem("mo-vog-04", "montures-optiques", "Vogue Eyewear", "VO4205",
    "Monture acétate cat-eye moderne",
    7, 3, 32, 104, "Luxottica Group", 10),

  // ── Mykita — complémentaires ──────────────────────────────────
  mkItem("mo-myk-03", "montures-optiques", "Mykita", "Talbot",
    "Monture acier screwless arrondie",
    3, 1, 148, 480, "Mykita GmbH", 21),
  mkItem("mo-myk-04", "montures-optiques", "Mykita", "Mitsuki",
    "Monture acier octogonale design Berlin",
    2, 1, 155, 502, "Mykita GmbH", 21),
  mkItem("mo-myk-05", "montures-optiques", "Mykita", "Cavan",
    "Monture acier fine rectangulaire",
    3, 1, 140, 455, "Mykita GmbH", 21),

  // ── ic! berlin — complémentaires ─────────────────────────────
  mkItem("mo-icb-03", "montures-optiques", "ic! berlin", "model M",
    "Monture acier sans vis ovale",
    2, 1, 105, 340, "ic! berlin GmbH", 21),
  mkItem("mo-icb-04", "montures-optiques", "ic! berlin", "Altona",
    "Monture acier screwless rectangulaire",
    3, 1, 108, 350, "ic! berlin GmbH", 21),
  mkItem("mo-icb-05", "montures-optiques", "ic! berlin", "Kreuzberg",
    "Monture acier vintage inspirée Kreuzberg",
    2, 1, 112, 363, "ic! berlin GmbH", 21),

  // ── Starck Biotech Paris — complémentaires ────────────────────
  mkItem("mo-sta-03", "montures-optiques", "Starck Biotech Paris", "SH3081",
    "Monture biomatière flexible confort extrême",
    4, 2, 88, 285, "Starck Biotech Paris", 21),
  mkItem("mo-sta-04", "montures-optiques", "Starck Biotech Paris", "SH3087",
    "Monture titane biomatière collection 2025",
    3, 1, 95, 308, "Starck Biotech Paris", 21),

  // ── Oakley optique — complémentaires ─────────────────────────
  mkItem("mo-oak-03", "montures-optiques", "Oakley", "OX8048 Pitchman",
    "Monture acier rectangulaire sport-lifestyle",
    5, 2, 65, 210, "Luxottica Group", 14),
  mkItem("mo-oak-04", "montures-optiques", "Oakley", "OX8153 Sway",
    "Monture nylon sport ultra-légère femme",
    4, 2, 60, 194, "Luxottica Group", 14),
  mkItem("mo-oak-05", "montures-optiques", "Oakley", "OX5145 DDA",
    "Monture acétate épaisse iconique lifestyle",
    4, 2, 68, 220, "Luxottica Group", 14),

  // ── Gucci — complémentaires ───────────────────────────────────
  mkItem("mo-gcc-02", "montures-optiques", "Gucci", "GG0209O",
    "Monture acétate ronde logo GG",
    2, 1, 148, 480, "Kering Eyewear", 28),
  mkItem("mo-gcc-03", "montures-optiques", "Gucci", "GG0673O",
    "Monture acétate cat-eye maison Gucci",
    2, 1, 152, 493, "Kering Eyewear", 28),
  mkItem("mo-gcc-04", "montures-optiques", "Gucci", "GG1318O",
    "Monture acier oversize logo entrelacé",
    2, 1, 158, 512, "Kering Eyewear", 28),

  // ── Prada — complémentaires ───────────────────────────────────
  mkItem("mo-pra-02", "montures-optiques", "Prada", "PR 10WV",
    "Monture acétate Prada Catwalk",
    2, 1, 148, 480, "Luxottica Group", 28),
  mkItem("mo-pra-03", "montures-optiques", "Prada", "PR 17WV",
    "Monture acétate Prada large cadre",
    2, 1, 155, 502, "Luxottica Group", 28),

  // ── Fendi — complémentaires ───────────────────────────────────
  mkItem("mo-fen-02", "montures-optiques", "Fendi", "FE50072I",
    "Monture acétate Fendigraphy FF",
    2, 1, 162, 525, "Safilo Group", 28),
  mkItem("mo-fen-03", "montures-optiques", "Fendi", "FE50038I",
    "Monture acier fine logo FF doré",
    2, 1, 158, 512, "Safilo Group", 28),

  // ── Versace — complémentaires ─────────────────────────────────
  mkItem("mo-ver-03", "montures-optiques", "Versace", "VE1288B",
    "Monture acier Medusa dorée fine",
    3, 1, 115, 373, "Luxottica Group", 21),
  mkItem("mo-ver-04", "montures-optiques", "Versace", "VE1292",
    "Monture acier large greca homme",
    3, 1, 112, 363, "Luxottica Group", 21),

  // ── Emporio Armani — complémentaires ─────────────────────────
  mkItem("mo-ea-03", "montures-optiques", "Emporio Armani", "EA3192",
    "Monture acier élégante homme fine",
    5, 2, 50, 162, "Luxottica Group", 14),
  mkItem("mo-ea-04", "montures-optiques", "Emporio Armani", "EA1158",
    "Monture acétate ronde femme",
    5, 2, 52, 168, "Luxottica Group", 14),

  // ── Giorgio Armani — complémentaires ─────────────────────────
  mkItem("mo-ga-02", "montures-optiques", "Giorgio Armani", "AR5089",
    "Monture acier titanisé ultra-fine",
    3, 1, 122, 395, "Luxottica Group", 21),
  mkItem("mo-ga-03", "montures-optiques", "Giorgio Armani", "AR7209",
    "Monture acétate signature rectangulaire",
    3, 1, 118, 383, "Luxottica Group", 21),

  // ── Michael Kors — complémentaires ───────────────────────────
  mkItem("mo-mk-02", "montures-optiques", "Michael Kors", "MK3048 Rodinara",
    "Monture acier cerclée dorée",
    5, 2, 52, 168, "Safilo Group", 14),
  mkItem("mo-mk-03", "montures-optiques", "Michael Kors", "MK3067",
    "Monture acier demi-cerclée tendance",
    5, 2, 50, 162, "Safilo Group", 14),

  // ── Celine — complémentaires ──────────────────────────────────
  mkItem("mo-cel-03", "montures-optiques", "Celine", "CL50009I Bold 3 Dots",
    "Monture acétate 3 points dorés Celine",
    2, 1, 168, 545, "Kering Eyewear", 28),
  mkItem("mo-cel-04", "montures-optiques", "Celine", "CL50128I",
    "Monture acier fine rectangulaire Celine",
    2, 1, 172, 558, "Kering Eyewear", 28),

  // ── Saint Laurent — complémentaires ──────────────────────────
  mkItem("mo-sl-03", "montures-optiques", "Saint Laurent", "SL 469 Metal",
    "Monture acier oversized galbée",
    3, 1, 152, 493, "Kering Eyewear", 28),
  mkItem("mo-sl-04", "montures-optiques", "Saint Laurent", "SL M117",
    "Monture acétate carrée Saint Laurent Paris",
    3, 1, 158, 512, "Kering Eyewear", 28),

  // ── Bottega Veneta — complémentaires ─────────────────────────
  mkItem("mo-bv2-02", "montures-optiques", "Bottega Veneta", "BV1248O",
    "Monture acétate intreccio carrée",
    2, 1, 162, 525, "Kering Eyewear", 28),

  // ── Vuarnet — complémentaires ─────────────────────────────────
  mkItem("mo-vua-02", "montures-optiques", "Vuarnet", "VL1625",
    "Monture acétate rectangulaire français",
    3, 1, 75, 243, "Vuarnet SAS", 14),

  // ── Lozza — complémentaires ───────────────────────────────────
  mkItem("mo-loz-02", "montures-optiques", "Lozza", "VL4255 Falconetto",
    "Monture acier doublé or rétro italienne",
    4, 2, 58, 188, "Safilo Group", 14),

  // ── Burberry ─────────────────────────────────────────────────
  mkItem("mo-bur-01", "montures-optiques", "Burberry", "BE2328",
    "Monture acétate check signature Burberry",
    4, 2, 88, 285, "Safilo Group", 14),
  mkItem("mo-bur-02", "montures-optiques", "Burberry", "BE2354",
    "Monture acétate rectangulaire oversize femme",
    4, 2, 92, 298, "Safilo Group", 14),
  mkItem("mo-bur-03", "montures-optiques", "Burberry", "BE1364",
    "Monture acier semi-cerclée homme",
    4, 2, 85, 275, "Safilo Group", 14),
  mkItem("mo-bur-04", "montures-optiques", "Burberry", "BE2375",
    "Monture acétate cat-eye avec détail doré",
    3, 2, 95, 308, "Safilo Group", 14),

  // ── Ralph Lauren ─────────────────────────────────────────────
  mkItem("mo-rl-01", "montures-optiques", "Ralph Lauren", "RL5099",
    "Monture acétate classique club-style",
    5, 2, 72, 234, "Luxottica Group", 14),
  mkItem("mo-rl-02", "montures-optiques", "Ralph Lauren", "RL5117",
    "Monture acétate rectangulaire homme",
    5, 2, 68, 220, "Luxottica Group", 14),
  mkItem("mo-rl-03", "montures-optiques", "Ralph Lauren", "RL6133",
    "Monture acier fine cerclée sportive",
    5, 2, 62, 200, "Luxottica Group", 14),
  mkItem("mo-rl-04", "montures-optiques", "Ralph Lauren", "RL5096",
    "Monture acétate ronde classique heritage",
    4, 2, 70, 228, "Luxottica Group", 14),

  // ── Polo Ralph Lauren ────────────────────────────────────────
  mkItem("mo-polo-01", "montures-optiques", "Polo Ralph Lauren", "PH2212",
    "Monture acétate sport-prep logo brodé",
    6, 2, 58, 188, "Luxottica Group", 14),
  mkItem("mo-polo-02", "montures-optiques", "Polo Ralph Lauren", "PH2241",
    "Monture acétate rectangulaire homme",
    6, 2, 55, 178, "Luxottica Group", 14),

  // ── Calvin Klein ─────────────────────────────────────────────
  mkItem("mo-ck-01", "montures-optiques", "Calvin Klein", "CK21519",
    "Monture acétate minimaliste CK",
    6, 2, 55, 178, "Safilo Group", 14),
  mkItem("mo-ck-02", "montures-optiques", "Calvin Klein", "CK5418",
    "Monture acier fine rectangulaire",
    6, 2, 50, 162, "Safilo Group", 14),
  mkItem("mo-ck-03", "montures-optiques", "Calvin Klein", "CK21521",
    "Monture acétate carrée tendance",
    5, 2, 58, 188, "Safilo Group", 14),

  // ── Tommy Hilfiger ───────────────────────────────────────────
  mkItem("mo-th-01", "montures-optiques", "Tommy Hilfiger", "TH1786/F",
    "Monture acétate sport-chic logo TH",
    6, 2, 52, 168, "Safilo Group", 14),
  mkItem("mo-th-02", "montures-optiques", "Tommy Hilfiger", "TH1952",
    "Monture acier doublée or fine",
    6, 2, 48, 155, "Safilo Group", 14),
  mkItem("mo-th-03", "montures-optiques", "Tommy Hilfiger", "TH1824",
    "Monture acétate wayfarer sport",
    5, 2, 50, 162, "Safilo Group", 14),

  // ── Lacoste ──────────────────────────────────────────────────
  mkItem("mo-lac-01", "montures-optiques", "Lacoste", "L2910",
    "Monture acétate sport crocodile",
    6, 2, 52, 168, "Safilo Group", 14),
  mkItem("mo-lac-02", "montures-optiques", "Lacoste", "L2878",
    "Monture acier sport lifestyle cerclée",
    6, 2, 48, 155, "Safilo Group", 14),
  mkItem("mo-lac-03", "montures-optiques", "Lacoste", "L2774",
    "Monture acétate semi-cerclée homme",
    5, 2, 50, 162, "Safilo Group", 14),
  mkItem("mo-lac-04", "montures-optiques", "Lacoste", "L2946",
    "Monture acier titane sport légère",
    4, 2, 62, 200, "Safilo Group", 14),

  // ── Kenzo ────────────────────────────────────────────────────
  mkItem("mo-kenz-01", "montures-optiques", "Kenzo", "KZ50022U",
    "Monture acétate graphique Kenzo Paris",
    4, 2, 75, 243, "Kering Eyewear", 21),
  mkItem("mo-kenz-02", "montures-optiques", "Kenzo", "KZ50004U",
    "Monture acétate floral tigre Kenzo",
    4, 2, 78, 253, "Kering Eyewear", 21),
  mkItem("mo-kenz-03", "montures-optiques", "Kenzo", "KZ50049U",
    "Monture acétate ronde artiste",
    3, 2, 80, 260, "Kering Eyewear", 21),

  // ── Givenchy ─────────────────────────────────────────────────
  mkItem("mo-giv-01", "montures-optiques", "Givenchy", "GV50038I",
    "Monture acétate 4G logo Givenchy",
    3, 1, 135, 438, "Kering Eyewear", 28),
  mkItem("mo-giv-02", "montures-optiques", "Givenchy", "GV50006U",
    "Monture acier chaîne logo 4G",
    2, 1, 142, 460, "Kering Eyewear", 28),

  // ── Valentino ────────────────────────────────────────────────
  mkItem("mo-val-01", "montures-optiques", "Valentino", "VA3061",
    "Monture acétate rockstud Valentino",
    2, 1, 152, 493, "Luxottica Group", 28),
  mkItem("mo-val-02", "montures-optiques", "Valentino", "VA3064",
    "Monture acier V-logo doré",
    2, 1, 148, 480, "Luxottica Group", 28),

  // ── Miu Miu ──────────────────────────────────────────────────
  mkItem("mo-miu-01", "montures-optiques", "Miu Miu", "MU 06VV",
    "Monture acétate logo plaque Miu Miu",
    2, 1, 158, 512, "Luxottica Group", 28),
  mkItem("mo-miu-02", "montures-optiques", "Miu Miu", "MU 01VV",
    "Monture acétate oversize cat-eye Miu Miu",
    2, 1, 162, 525, "Luxottica Group", 28),
  mkItem("mo-miu-03", "montures-optiques", "Miu Miu", "MU 04VV",
    "Monture acier logo plaque rectangulaire",
    2, 1, 155, 502, "Luxottica Group", 28),

  // ── Balenciaga ───────────────────────────────────────────────
  mkItem("mo-bal-01", "montures-optiques", "Balenciaga", "BB0238O",
    "Monture acétate logo BB Balenciaga",
    2, 1, 175, 568, "Kering Eyewear", 28),
  mkItem("mo-bal-02", "montures-optiques", "Balenciaga", "BB0012O",
    "Monture acier rectangle logo BB",
    2, 1, 168, 545, "Kering Eyewear", 28),

  // ── Bvlgari ──────────────────────────────────────────────────
  mkItem("mo-bvl-01", "montures-optiques", "Bvlgari", "BV4198",
    "Monture acétate serpenti Bvlgari",
    2, 1, 155, 502, "Luxottica Group", 28),
  mkItem("mo-bvl-02", "montures-optiques", "Bvlgari", "BV4206",
    "Monture acier logo B.zero1 dorée",
    2, 1, 162, 525, "Luxottica Group", 28),

  // ── Tiffany & Co. ────────────────────────────────────────────
  mkItem("mo-tif-01", "montures-optiques", "Tiffany & Co.", "TF2175",
    "Monture acier Tiffany T logo bleu",
    3, 1, 138, 448, "Luxottica Group", 21),
  mkItem("mo-tif-02", "montures-optiques", "Tiffany & Co.", "TF2186",
    "Monture acétate rectangulaire Tiffany blue",
    3, 1, 142, 460, "Luxottica Group", 21),

  // ── Coach ────────────────────────────────────────────────────
  mkItem("mo-coa-01", "montures-optiques", "Coach", "HC6137",
    "Monture acétate cheval signature Coach",
    4, 2, 72, 234, "Luxottica Group", 14),
  mkItem("mo-coa-02", "montures-optiques", "Coach", "HC5122",
    "Monture acier fine cerclée logo",
    5, 2, 68, 220, "Luxottica Group", 14),

  // ── Marc Jacobs ──────────────────────────────────────────────
  mkItem("mo-mj2-01", "montures-optiques", "Marc Jacobs", "MJ 1081",
    "Monture acétate rectangle logo J",
    4, 2, 78, 253, "Safilo Group", 14),
  mkItem("mo-mj2-02", "montures-optiques", "Marc Jacobs", "MJ 1027",
    "Monture acétate oversize tendance",
    4, 2, 82, 265, "Safilo Group", 14),

  // ── DKNY ─────────────────────────────────────────────────────
  mkItem("mo-dkny-01", "montures-optiques", "DKNY", "DY4694",
    "Monture acier cerclée feminine DKNY",
    5, 2, 52, 168, "Safilo Group", 14),
  mkItem("mo-dkny-02", "montures-optiques", "DKNY", "DY5652",
    "Monture acétate rectangulaire urbaine",
    5, 2, 55, 178, "Safilo Group", 14),

  // ── Fossil ───────────────────────────────────────────────────
  mkItem("mo-fos-01", "montures-optiques", "Fossil", "FO7071",
    "Monture acier vintage lifestyle",
    5, 2, 42, 136, "Safilo Group", 14),
  mkItem("mo-fos-02", "montures-optiques", "Fossil", "FO7138",
    "Monture acétate ronde rétro",
    5, 2, 45, 146, "Safilo Group", 14),

  // ── Guess ────────────────────────────────────────────────────
  mkItem("mo-gue-01", "montures-optiques", "Guess", "GU2770",
    "Monture acier semi-cerclée tendance",
    6, 3, 38, 123, "Safilo Group", 14),
  mkItem("mo-gue-02", "montures-optiques", "Guess", "GU2888",
    "Monture acétate femme cat-eye",
    6, 3, 40, 130, "Safilo Group", 14),
  mkItem("mo-gue-03", "montures-optiques", "Guess", "GU2945",
    "Monture acier homme sport-lifestyle",
    5, 2, 35, 114, "Safilo Group", 14),

  // ── Police ───────────────────────────────────────────────────
  mkItem("mo-pol2-01", "montures-optiques", "Police", "VPLD28",
    "Monture acier semi-rimless Police",
    5, 2, 42, 136, "De Rigo Group", 14),
  mkItem("mo-pol2-02", "montures-optiques", "Police", "VPL631",
    "Monture acétate sport masculin",
    5, 2, 45, 146, "De Rigo Group", 14),

  // ── Hackett London ───────────────────────────────────────────
  mkItem("mo-hac-01", "montures-optiques", "Hackett London", "HEB095",
    "Monture acétate British heritage",
    4, 2, 78, 253, "Marcolin Group", 14),
  mkItem("mo-hac-02", "montures-optiques", "Hackett London", "HEB199",
    "Monture acier fine homme classique",
    4, 2, 72, 234, "Marcolin Group", 14),

  // ── Porsche Design ───────────────────────────────────────────
  mkItem("mo-pd-01", "montures-optiques", "Porsche Design", "P8351",
    "Monture titane ingénierie de précision",
    2, 1, 188, 610, "Porsche Design", 21),
  mkItem("mo-pd-02", "montures-optiques", "Porsche Design", "P8370",
    "Monture titane cerclée sport design",
    2, 1, 195, 632, "Porsche Design", 21),

  // ── ProDesign Denmark ────────────────────────────────────────
  mkItem("mo-pro-01", "montures-optiques", "ProDesign", "4808",
    "Monture acétate danoise design épuré",
    3, 1, 88, 285, "ProDesign Denmark", 21),
  mkItem("mo-pro-02", "montures-optiques", "ProDesign", "6926",
    "Monture titane minimaliste danoise",
    3, 1, 95, 308, "ProDesign Denmark", 21),

  // ── Anglo American Optical ───────────────────────────────────
  mkItem("mo-aao-01", "montures-optiques", "Anglo American", "Parliament",
    "Monture acier cerclée style parlementaire",
    2, 1, 108, 350, "Anglo American Optical", 21),
  mkItem("mo-aao-02", "montures-optiques", "Anglo American", "Consul",
    "Monture acier ronde vintage anglaise",
    2, 1, 112, 363, "Anglo American Optical", 21),

  // ── Flexon ───────────────────────────────────────────────────
  mkItem("mo-flx-01", "montures-optiques", "Flexon", "FL907",
    "Monture mémoire de forme flexible",
    4, 2, 72, 234, "Marchon Eyewear", 14),
  mkItem("mo-flx-02", "montures-optiques", "Flexon", "FL3010",
    "Monture titane Flexon ultra-résistante",
    4, 2, 78, 253, "Marchon Eyewear", 14),

  // ── Rodenstock (montures) ────────────────────────────────────
  mkItem("mo-rod-01", "montures-optiques", "Rodenstock", "R5345",
    "Monture acier lifestyle Rodenstock",
    4, 2, 82, 265, "Rodenstock GmbH", 14),
  mkItem("mo-rod-02", "montures-optiques", "Rodenstock", "R1554",
    "Monture titane fine cerclée premium",
    3, 1, 105, 340, "Rodenstock GmbH", 14),

  // ── Seiko Lifestyle ──────────────────────────────────────────
  mkItem("mo-sei-01", "montures-optiques", "Seiko", "SJ5002",
    "Monture titane soudé ultra-légère",
    3, 1, 92, 298, "Seiko Optical", 14),
  mkItem("mo-sei-02", "montures-optiques", "Seiko", "SJ7003",
    "Monture titane semi-cerclée sport",
    3, 1, 88, 285, "Seiko Optical", 14),

  // ── Marchon (Nike Vision) ────────────────────────────────────
  mkItem("mo-nik2-01", "montures-optiques", "Nike Vision", "7286",
    "Monture sport flexible Nike Vision",
    5, 2, 58, 188, "Marchon Eyewear", 14),
  mkItem("mo-nik2-02", "montures-optiques", "Nike Vision", "7161",
    "Monture semi-cerclée sport légère",
    5, 2, 55, 178, "Marchon Eyewear", 14),

  // ── Adidas Eyewear ───────────────────────────────────────────
  mkItem("mo-adi-01", "montures-optiques", "Adidas", "ADIDAS SP5008",
    "Monture sport 3 bandes lifestyle",
    5, 2, 52, 168, "Silhouette International", 14),
  mkItem("mo-adi-02", "montures-optiques", "Adidas", "ADIDAS SP5007",
    "Monture acétate sport-fashion",
    5, 2, 48, 155, "Silhouette International", 14),

  // ── Cutler & Gross ───────────────────────────────────────────
  mkItem("mo-cg-01", "montures-optiques", "Cutler & Gross", "1387",
    "Monture acétate artisanale London",
    2, 1, 175, 568, "Cutler & Gross", 28),
  mkItem("mo-cg-02", "montures-optiques", "Cutler & Gross", "1305",
    "Monture acétate oversize emblématique",
    2, 1, 180, 584, "Cutler & Gross", 28),

  // ── Moscot ───────────────────────────────────────────────────
  mkItem("mo-mos-01", "montures-optiques", "Moscot", "Lemtosh",
    "Monture acétate ronde vintage New York",
    3, 1, 148, 480, "Moscot", 21),
  mkItem("mo-mos-02", "montures-optiques", "Moscot", "Miltzen",
    "Monture acétate ronde classique optician",
    3, 1, 142, 460, "Moscot", 21),
  mkItem("mo-mos-03", "montures-optiques", "Moscot", "Zolman",
    "Monture acétate keyhole browline",
    3, 1, 138, 448, "Moscot", 21),

  // ── Barton Perreira ──────────────────────────────────────────
  mkItem("mo-bp-01", "montures-optiques", "Barton Perreira", "Joe",
    "Monture acétate ronde classique californienne",
    2, 1, 165, 535, "Barton Perreira", 21),
  mkItem("mo-bp-02", "montures-optiques", "Barton Perreira", "Banks",
    "Monture acétate carrée heritage",
    2, 1, 170, 551, "Barton Perreira", 21),

  // ── Garrett Leight ───────────────────────────────────────────
  mkItem("mo-gl-01", "montures-optiques", "Garrett Leight", "Wilson",
    "Monture acétate ronde Venice Beach",
    3, 1, 155, 502, "Garrett Leight", 21),
  mkItem("mo-gl-02", "montures-optiques", "Garrett Leight", "Kinney",
    "Monture acétate rectangulaire lifestyle",
    3, 1, 148, 480, "Garrett Leight", 21),

  // ── Thierry Lasry ────────────────────────────────────────────
  mkItem("mo-tl-01", "montures-optiques", "Thierry Lasry", "Sexxxy",
    "Monture acétate cat-eye créateur parisien",
    2, 1, 195, 632, "Thierry Lasry", 28),
  mkItem("mo-tl-02", "montures-optiques", "Thierry Lasry", "Autocracy",
    "Monture acétate rectangulaire art parisien",
    2, 1, 188, 610, "Thierry Lasry", 28),

  // ── Menrad ───────────────────────────────────────────────────
  mkItem("mo-men-01", "montures-optiques", "Menrad", "M 11075",
    "Monture acier titane allemande premium",
    3, 1, 82, 265, "Menrad GmbH", 14),
  mkItem("mo-men-02", "montures-optiques", "Menrad", "M 11095",
    "Monture acétate élégante collection Menrad",
    3, 1, 78, 253, "Menrad GmbH", 14),

  // ── Pierre Cardin ────────────────────────────────────────────
  mkItem("mo-pc-01", "montures-optiques", "Pierre Cardin", "PC6852",
    "Monture acier doublée or classique",
    5, 2, 35, 114, "Pierre Cardin SAS", 14),
  mkItem("mo-pc-02", "montures-optiques", "Pierre Cardin", "PC6911",
    "Monture acétate bordeaux homme",
    5, 2, 38, 123, "Pierre Cardin SAS", 14),

  // ── Humphrey's ───────────────────────────────────────────────
  mkItem("mo-hum-01", "montures-optiques", "Humphrey's", "580275",
    "Monture acétate lifestyle accessible",
    5, 2, 35, 114, "Humphrey's by Silhouette", 14),
  mkItem("mo-hum-02", "montures-optiques", "Humphrey's", "581091",
    "Monture acier légère homme",
    5, 2, 32, 104, "Humphrey's by Silhouette", 14),

  // ── Davidoff ─────────────────────────────────────────────────
  mkItem("mo-dav-01", "montures-optiques", "Davidoff", "95202",
    "Monture acier premium homme classique",
    4, 2, 55, 178, "Safilo Group", 14),
  mkItem("mo-dav-02", "montures-optiques", "Davidoff", "95222",
    "Monture acétate élégante collection",
    4, 2, 58, 188, "Safilo Group", 14),

  // ── Cazal ────────────────────────────────────────────────────
  mkItem("mo-caz-01", "montures-optiques", "Cazal", "6026",
    "Monture acétate vintage iconique Cazal",
    2, 1, 145, 470, "Cazal Eyewear", 21),
  mkItem("mo-caz-02", "montures-optiques", "Cazal", "6032",
    "Monture acier épaisse style héritage",
    2, 1, 152, 493, "Cazal Eyewear", 21),

  // ── Jaguar ───────────────────────────────────────────────────
  mkItem("mo-jag-01", "montures-optiques", "Jaguar", "33040",
    "Monture acier fine homme Jaguar",
    4, 2, 62, 200, "Jaguar Eyewear", 14),
  mkItem("mo-jag-02", "montures-optiques", "Jaguar", "33805",
    "Monture titane ultra-légère cercle",
    3, 1, 82, 265, "Jaguar Eyewear", 14),

  // ── Salvatore Ferragamo ───────────────────────────────────────
  mkItem("mo-sf-01", "montures-optiques", "Salvatore Ferragamo", "SF2905",
    "Monture acétate Gancini Ferragamo femme",
    3, 1, 128, 415, "Marchon Eyewear", 21),
  mkItem("mo-sf-02", "montures-optiques", "Salvatore Ferragamo", "SF2979",
    "Monture acier homme Gancini logo",
    3, 1, 118, 383, "Marchon Eyewear", 21),

  // ── Longines ─────────────────────────────────────────────────
  mkItem("mo-lng-01", "montures-optiques", "Longines", "LG5019-H",
    "Monture acier élégance horlogère",
    3, 1, 92, 298, "Marchon Eyewear", 21),

  // ── Converse ─────────────────────────────────────────────────
  mkItem("mo-con-01", "montures-optiques", "Converse", "CV5089",
    "Monture acétate lifestyle All Star",
    6, 2, 38, 123, "Safilo Group", 14),
  mkItem("mo-con-02", "montures-optiques", "Converse", "CV3017",
    "Monture acier semi-cerclée urbaine",
    5, 2, 35, 114, "Safilo Group", 14),

  // ── Anne & Valentin ──────────────────────────────────────────
  mkItem("mo-av-01", "montures-optiques", "Anne & Valentin", "Harpe",
    "Monture acétate créateur français avant-garde",
    3, 1, 118, 383, "Anne & Valentin", 21),
  mkItem("mo-av-02", "montures-optiques", "Anne & Valentin", "Bao",
    "Monture acétate architecturale française",
    3, 1, 122, 395, "Anne & Valentin", 21),
  mkItem("mo-av-03", "montures-optiques", "Anne & Valentin", "Siam",
    "Monture acétate sculpturale collection",
    3, 1, 115, 373, "Anne & Valentin", 21),

  // ── l.a. Eyeworks ────────────────────────────────────────────
  mkItem("mo-lae-01", "montures-optiques", "l.a. Eyeworks", "Cheers",
    "Monture acétate audacieuse Los Angeles",
    2, 1, 145, 470, "l.a. Eyeworks", 21),
  mkItem("mo-lae-02", "montures-optiques", "l.a. Eyeworks", "Zig",
    "Monture acétate géométrique créateur",
    2, 1, 152, 493, "l.a. Eyeworks", 21),

  // ── Res/Rei ──────────────────────────────────────────────────
  mkItem("mo-rr-01", "montures-optiques", "Res/Rei", "Tora",
    "Monture acétate japonaise artisanale",
    2, 1, 168, 545, "Res/Rei", 28),

  // ── Masunaga ─────────────────────────────────────────────────
  mkItem("mo-mas-01", "montures-optiques", "Masunaga", "GMS-825",
    "Monture acétate artisanale Sabae Japon",
    2, 1, 175, 568, "Masunaga Optical", 28),
  mkItem("mo-mas-02", "montures-optiques", "Masunaga", "GMS-847S",
    "Monture titane façonnée Sabae haut de gamme",
    2, 1, 185, 600, "Masunaga Optical", 28),

  // ── Kaneko Optical ───────────────────────────────────────────
  mkItem("mo-kan-01", "montures-optiques", "Kaneko Optical", "KO-26",
    "Monture acétate japonaise full rim",
    2, 1, 158, 512, "Kaneko Optical", 28),

  // ── Gold & Wood ──────────────────────────────────────────────
  mkItem("mo-gw-01", "montures-optiques", "Gold & Wood", "107.04",
    "Monture bois & cornes de buffle artisanale",
    1, 1, 355, 1150, "Gold & Wood", 28),

  // ── Hoffmann Natural Eyewear ─────────────────────────────────
  mkItem("mo-hne-01", "montures-optiques", "Hoffmann Natural Eyewear", "H 2314",
    "Monture bois certifié artisanat allemand",
    2, 1, 195, 632, "Hoffmann Natural Eyewear", 28),

  // ── Stepper ──────────────────────────────────────────────────
  mkItem("mo-stp-01", "montures-optiques", "Stepper", "SI-20080",
    "Monture acier légère sport homme",
    4, 2, 55, 178, "Stepper Eyewear", 14),
  mkItem("mo-stp-02", "montures-optiques", "Stepper", "SL-20095",
    "Monture acétate femme semi-cerclée",
    4, 2, 52, 168, "Stepper Eyewear", 14),

  // ── OGA (Morel) ──────────────────────────────────────────────
  mkItem("mo-oga-01", "montures-optiques", "OGA", "7898O",
    "Monture acétate French design OGA",
    4, 2, 72, 234, "Morel", 14),
  mkItem("mo-oga-02", "montures-optiques", "OGA", "7867O",
    "Monture acier légère collection OGA",
    4, 2, 68, 220, "Morel", 14),

  // ── Dilem (Morel) ────────────────────────────────────────────
  mkItem("mo-dil-01", "montures-optiques", "Dilem", "TJ012A",
    "Monture bimatière titane/acétate Dilem",
    4, 2, 75, 243, "Morel", 14),

  // ── Tura ─────────────────────────────────────────────────────
  mkItem("mo-tur-01", "montures-optiques", "Tura", "798",
    "Monture acier légère bicolore",
    4, 2, 48, 155, "Tura Inc.", 14),

  // ── Silhouette — pure titane complémentaires ──────────────────
  mkItem("mo-sil-05", "montures-optiques", "Silhouette", "Illusion Nylor 5497",
    "Monture nylor fil classique Silhouette",
    3, 1, 128, 415, "Silhouette International", 21),

  // ── Lindberg — complémentaires ────────────────────────────────
  mkItem("mo-lin-04", "montures-optiques", "Lindberg", "Buffalo Titanium",
    "Monture corne de buffle & titane artisanale",
    1, 1, 385, 1248, "Lindberg A/S", 28),
  mkItem("mo-lin-05", "montures-optiques", "Lindberg", "Spirit Titanium 2419",
    "Monture titane rimless screwless",
    2, 1, 205, 665, "Lindberg A/S", 21),

  // ── Smith Optics ─────────────────────────────────────────────
  mkItem("mo-smi-01", "montures-optiques", "Smith", "Pathway",
    "Monture nylon sport lifestyle",
    4, 2, 58, 188, "Safilo Group", 14),
  mkItem("mo-smi-02", "montures-optiques", "Smith", "Shift",
    "Monture sport semi-cerclée légère",
    4, 2, 55, 178, "Safilo Group", 14),

  // ── Sting ────────────────────────────────────────────────────
  mkItem("mo-sti-01", "montures-optiques", "Sting", "VST435",
    "Monture acétate italienne tendance",
    4, 2, 52, 168, "De Rigo Group", 14),
  mkItem("mo-sti-02", "montures-optiques", "Sting", "VST410",
    "Monture acier fine semi-cerclée",
    4, 2, 48, 155, "De Rigo Group", 14),

  // ── David Beckham ─────────────────────────────────────────────
  mkItem("mo-db-01", "montures-optiques", "David Beckham", "DB 1107",
    "Monture acétate DB Eyewear homme",
    4, 2, 62, 200, "Safilo Group", 14),
  mkItem("mo-db-02", "montures-optiques", "David Beckham", "DB 1095",
    "Monture acier sport-luxe",
    4, 2, 58, 188, "Safilo Group", 14),

  // ── Swarovski ────────────────────────────────────────────────
  mkItem("mo-swa-01", "montures-optiques", "Swarovski", "SK5474",
    "Monture acétate cristaux Swarovski",
    3, 1, 85, 275, "Marcolin Group", 14),
  mkItem("mo-swa-02", "montures-optiques", "Swarovski", "SK2052",
    "Monture métal cristaux prestige",
    3, 1, 92, 298, "Marcolin Group", 14),

  // ── Charmant ─────────────────────────────────────────────────
  mkItem("mo-cha2-01", "montures-optiques", "Charmant", "CH10884",
    "Monture titane Ultra Slim japonaise",
    3, 1, 95, 308, "Charmant Group", 21),
  mkItem("mo-cha2-02", "montures-optiques", "Charmant", "CH10927",
    "Monture acétate premium Charmant",
    3, 1, 88, 285, "Charmant Group", 21),

  // ── Rodenstock — complémentaires ─────────────────────────────
  mkItem("mo-rod-03", "montures-optiques", "Rodenstock", "R7145",
    "Monture acier titanisé moderne",
    3, 1, 98, 318, "Rodenstock GmbH", 14),
  mkItem("mo-rod-04", "montures-optiques", "Rodenstock", "R8034",
    "Monture acétate premium collection 2025",
    3, 1, 102, 330, "Rodenstock GmbH", 14),

  // ── Silhouette Pure — complément ─────────────────────────────
  mkItem("mo-sil-06", "montures-optiques", "Silhouette", "EOS 5531",
    "Monture acétate premium semi-cerclée",
    3, 1, 132, 428, "Silhouette International", 21),

  // ── Dolce & Gabbana (Luxottica Group) ────────────────────────
  mkItem("mo-dg-01", "montures-optiques", "Dolce & Gabbana", "DG3342",
    "Monture acétate DG iconic noires",
    2, 1, 148, 480, "Luxottica Group", 21),
  mkItem("mo-dg-02", "montures-optiques", "Dolce & Gabbana", "DG5090",
    "Monture acier DG doré Milanese",
    2, 1, 155, 502, "Luxottica Group", 21),
  mkItem("mo-dg-03", "montures-optiques", "Dolce & Gabbana", "DG3359",
    "Monture acétate leopard print DG",
    2, 1, 152, 493, "Luxottica Group", 21),

  // ── Brooks Brothers (Luxottica Group) ────────────────────────
  mkItem("mo-bb-01", "montures-optiques", "Brooks Brothers", "BB2039",
    "Monture acier tradition preppy américaine",
    3, 1, 95, 308, "Luxottica Group", 21),
  mkItem("mo-bb-02", "montures-optiques", "Brooks Brothers", "BB2040",
    "Monture acétate rectangulaire heritage",
    3, 1, 88, 285, "Luxottica Group", 21),

  // ── Dsquared2 (Marcolin Group) ────────────────────────────────
  mkItem("mo-dsq-01", "montures-optiques", "Dsquared2", "D2 0014",
    "Monture acétate rock-luxe iconique",
    3, 1, 112, 363, "Marcolin Group", 21),
  mkItem("mo-dsq-02", "montures-optiques", "Dsquared2", "D2 0028",
    "Monture acier fine semi-cerclée",
    3, 1, 105, 340, "Marcolin Group", 21),
  mkItem("mo-dsq-03", "montures-optiques", "Dsquared2", "D2 0057",
    "Monture acétate geek-chic écaille",
    3, 1, 108, 350, "Marcolin Group", 21),

  // ── Roberto Cavalli (Marcolin Group) ─────────────────────────
  mkItem("mo-rc-01", "montures-optiques", "Roberto Cavalli", "RC5115",
    "Monture acétate animal print femme",
    2, 1, 115, 373, "Marcolin Group", 21),
  mkItem("mo-rc-02", "montures-optiques", "Roberto Cavalli", "RC5118",
    "Monture acier dorée logo RC",
    2, 1, 108, 350, "Marcolin Group", 21),

  // ── Max Mara (Marcolin Group) ─────────────────────────────────
  mkItem("mo-mm-01", "montures-optiques", "Max Mara", "MM5070",
    "Monture acétate élégante oversize Max Mara",
    3, 1, 118, 383, "Marcolin Group", 21),
  mkItem("mo-mm-02", "montures-optiques", "Max Mara", "MM5089",
    "Monture acétate cat-eye raffiné",
    3, 1, 122, 395, "Marcolin Group", 21),

  // ── Tod's (Marcolin Group) ────────────────────────────────────
  mkItem("mo-tod-01", "montures-optiques", "Tod's", "TO5246",
    "Monture acétate cuir detail gommino",
    2, 1, 128, 415, "Marcolin Group", 21),

  // ── Moncler (Marcolin Group) ──────────────────────────────────
  mkItem("mo-mon-01", "montures-optiques", "Moncler", "ML5152-H",
    "Monture acétate Moncler premium",
    2, 1, 145, 470, "Marcolin Group", 21),
  mkItem("mo-mon-02", "montures-optiques", "Moncler", "ML5117-H",
    "Monture acier fine Moncler",
    2, 1, 138, 448, "Marcolin Group", 21),

  // ── Diesel (Marcolin Group) ───────────────────────────────────
  mkItem("mo-die-01", "montures-optiques", "Diesel", "DL5302",
    "Monture acétate denim-attitude Diesel",
    4, 2, 82, 265, "Marcolin Group", 14),
  mkItem("mo-die-02", "montures-optiques", "Diesel", "DL5434",
    "Monture acier homme urban",
    4, 2, 78, 253, "Marcolin Group", 14),

  // ── Zegna (Marcolin Group) ────────────────────────────────────
  mkItem("mo-zeg-01", "montures-optiques", "Zegna", "EZ5017",
    "Monture titane sartoriale Zegna",
    2, 1, 162, 525, "Marcolin Group", 21),
  mkItem("mo-zeg-02", "montures-optiques", "Zegna", "EZ5018",
    "Monture acétate luxe couture",
    2, 1, 155, 502, "Marcolin Group", 21),

  // ── Karl Lagerfeld (Marchon Eyewear) ─────────────────────────
  mkItem("mo-kl-01", "montures-optiques", "Karl Lagerfeld", "KL6148",
    "Monture acétate Karl Lagerfeld Paris",
    3, 1, 95, 308, "Marchon Eyewear", 21),
  mkItem("mo-kl-02", "montures-optiques", "Karl Lagerfeld", "KL6113",
    "Monture acier fine logo KL",
    3, 1, 88, 285, "Marchon Eyewear", 21),

  // ── Columbia Sportswear (Marchon Eyewear) ────────────────────
  mkItem("mo-col-01", "montures-optiques", "Columbia Sportswear", "C8038",
    "Monture sport outdoor flexible",
    4, 2, 52, 168, "Marchon Eyewear", 14),
  mkItem("mo-col-02", "montures-optiques", "Columbia Sportswear", "C8052",
    "Monture nylon sport légère Columbia",
    4, 2, 48, 155, "Marchon Eyewear", 14),

  // ── Dragon Alliance (Marchon Eyewear) ────────────────────────
  mkItem("mo-dra-01", "montures-optiques", "Dragon Alliance", "DR2040",
    "Monture acétate lifestyle snowboard",
    4, 2, 55, 178, "Marchon Eyewear", 14),

  // ── ETRO (Marchon Eyewear) ────────────────────────────────────
  mkItem("mo-etr-01", "montures-optiques", "ETRO", "ET0013",
    "Monture acétate paisley ETRO Milano",
    2, 1, 128, 415, "Marchon Eyewear", 21),
  mkItem("mo-etr-02", "montures-optiques", "ETRO", "ET0016",
    "Monture acier doublée or broderie",
    2, 1, 132, 428, "Marchon Eyewear", 21),

  // ── Burberry (Marchon Eyewear) ────────────────────────────────
  mkItem("mo-bur-05", "montures-optiques", "Burberry", "BE2406",
    "Monture acétate check heritage 2024",
    4, 2, 92, 298, "Marchon Eyewear", 14),
  mkItem("mo-bur-06", "montures-optiques", "Burberry", "BE2419",
    "Monture acier fine homme trench collection",
    4, 2, 88, 285, "Marchon Eyewear", 14),

  // ── Kate Spade (Safilo Group) ─────────────────────────────────
  mkItem("mo-ks-01", "montures-optiques", "Kate Spade", "KS 2129",
    "Monture acétate feminina Kate Spade NY",
    4, 2, 72, 234, "Safilo Group", 14),
  mkItem("mo-ks-02", "montures-optiques", "Kate Spade", "KS 2130",
    "Monture acier cat-eye logo KS",
    4, 2, 68, 220, "Safilo Group", 14),

  // ── Oxydo (Safilo Group) ──────────────────────────────────────
  mkItem("mo-oxy-01", "montures-optiques", "Oxydo", "OX/E001",
    "Monture acétate avantgarde Oxydo",
    3, 2, 62, 200, "Safilo Group", 14),
  mkItem("mo-oxy-02", "montures-optiques", "Oxydo", "OX/E002",
    "Monture acier fine artsy design",
    3, 2, 58, 188, "Safilo Group", 14),

  // ── Louis Vuitton (LVMH Fashion Group) ───────────────────────
  mkItem("mo-lv-01", "montures-optiques", "Louis Vuitton", "Z1676E",
    "Monture acétate monogramme LV",
    1, 1, 385, 1248, "LVMH Fashion Group", 28),
  mkItem("mo-lv-02", "montures-optiques", "Louis Vuitton", "Z1548W",
    "Monture acier dorée logo LV",
    1, 1, 365, 1183, "LVMH Fashion Group", 28),

  // ── Loewe (LVMH Fashion Group) ────────────────────────────────
  mkItem("mo-loe-01", "montures-optiques", "Loewe", "LW50017I",
    "Monture acétate anagramme Loewe",
    2, 1, 188, 610, "LVMH Fashion Group", 28),

  // ── Neubau Eyewear (Silhouette International) ─────────────────
  mkItem("mo-neu-01", "montures-optiques", "Neubau Eyewear", "N63/00 Bob",
    "Monture biopolymère écologique autrichienne",
    3, 1, 92, 298, "Silhouette International", 21),
  mkItem("mo-neu-02", "montures-optiques", "Neubau Eyewear", "N82/00 Paul",
    "Monture biopolymère légère unisexe",
    3, 1, 88, 285, "Silhouette International", 21),

  // ── Missoni (Marcolin Group) ──────────────────────────────────
  mkItem("mo-mis-01", "montures-optiques", "Missoni", "MI 0074",
    "Monture acétate zigzag multicolore Missoni",
    2, 1, 112, 363, "Marcolin Group", 21),
  mkItem("mo-mis-02", "montures-optiques", "Missoni", "MI 0076",
    "Monture acier fine dorée stripes",
    2, 1, 105, 340, "Marcolin Group", 21),

  // ── BMW (Marchon Eyewear) ─────────────────────────────────────
  mkItem("mo-bmw-01", "montures-optiques", "BMW", "BW0012",
    "Monture titane engineering de précision BMW",
    2, 1, 128, 415, "Marchon Eyewear", 21),
  mkItem("mo-bmw-02", "montures-optiques", "BMW", "BW0013",
    "Monture acier sport automotive design",
    3, 1, 118, 383, "Marchon Eyewear", 21),

  // ── Kenneth Cole (Marchon Eyewear) ───────────────────────────
  mkItem("mo-kc-01", "montures-optiques", "Kenneth Cole", "KC0343",
    "Monture acier new-yorkaise classique",
    4, 2, 58, 188, "Marchon Eyewear", 14),
  mkItem("mo-kc-02", "montures-optiques", "Kenneth Cole", "KC0363",
    "Monture acétate homme lifestyle",
    4, 2, 55, 178, "Marchon Eyewear", 14),

  // ── Brendel (Marchon Eyewear) ─────────────────────────────────
  mkItem("mo-bre-01", "montures-optiques", "Brendel", "53043",
    "Monture acier allemande qualité premium",
    3, 1, 78, 253, "Marchon Eyewear", 14),

  // ── Serengeti (Bollé Brands) ──────────────────────────────────
  mkItem("mo-sere-01", "montures-optiques", "Serengeti", "Tommaso",
    "Monture acier lifestyle photochromique",
    3, 2, 68, 228, "Bollé Brands", 14),

  // ── Skaga (Marchon Eyewear) ───────────────────────────────────
  mkItem("mo-ska-01", "montures-optiques", "Skaga", "SK2127",
    "Monture titane scandinave épurée",
    2, 1, 105, 340, "Marchon Eyewear", 21),
  mkItem("mo-ska-02", "montures-optiques", "Skaga", "SK2148",
    "Monture acétate collections Nordic",
    2, 1, 95, 308, "Marchon Eyewear", 21),

  // ── Brendel/Eschenbach complémentaires ───────────────────────
  mkItem("mo-esc-03", "montures-optiques", "Eschenbach", "3940 novum",
    "Monture acier homme cerclée premium",
    3, 1, 102, 330, "Eschenbach Optik", 21),

  // ── Carolina Herrera Eyewear (De Rigo Group) ──────────────────
  mkItem("mo-carher-01", "montures-optiques", "Carolina Herrera", "VHE803",
    "Monture acétate féminine Carolina Herrera collection florale",
    3, 1, 78, 252, "De Rigo Group", 14),
  mkItem("mo-carher-02", "montures-optiques", "Carolina Herrera", "VHE857",
    "Monture métal bicolore slim Carolina Herrera chic",
    3, 1, 82, 265, "De Rigo Group", 14),
  mkItem("mo-carher-03", "montures-optiques", "Carolina Herrera", "VHE872",
    "Monture cat-eye acétate Carolina Herrera Madrid",
    3, 1, 76, 246, "De Rigo Group", 14),

  // ── Escada Eyewear (De Rigo Group) ───────────────────────────
  mkItem("mo-esca-01", "montures-optiques", "Escada", "EL5218",
    "Monture papillon acétate Escada fashion féminin",
    3, 1, 72, 233, "De Rigo Group", 14),
  mkItem("mo-esca-02", "montures-optiques", "Escada", "EL5242",
    "Monture ronde métal Escada signature dorée",
    3, 1, 68, 220, "De Rigo Group", 14),
  mkItem("mo-esca-03", "montures-optiques", "Escada", "EL5257",
    "Monture hexagonale acétate Escada luxe",
    3, 1, 75, 243, "De Rigo Group", 14),

  // ── Love Moschino (De Rigo Group) ────────────────────────────
  mkItem("mo-lmosc-01", "montures-optiques", "Love Moschino", "ML614V",
    "Monture acétate tendance Love Moschino hearts print",
    4, 2, 54, 175, "De Rigo Group", 14),
  mkItem("mo-lmosc-02", "montures-optiques", "Love Moschino", "ML595V",
    "Monture métal logo Love Moschino finition dorée",
    4, 2, 52, 168, "De Rigo Group", 14),
  mkItem("mo-lmosc-03", "montures-optiques", "Love Moschino", "ML632V",
    "Monture ronde acétate bicolore Love Moschino",
    4, 2, 56, 181, "De Rigo Group", 14),

  // ── Chopard Eyewear (De Rigo Group) ──────────────────────────
  mkItem("mo-chopd-01", "montures-optiques", "Chopard", "VCH289",
    "Monture acétate luxe Chopard collection Imperial",
    2, 1, 188, 610, "De Rigo Group", 21),
  mkItem("mo-chopd-02", "montures-optiques", "Chopard", "VCH315",
    "Monture titane mixte Chopard Imperiale prestige",
    2, 1, 195, 632, "De Rigo Group", 21),
  mkItem("mo-chopd-03", "montures-optiques", "Chopard", "VCH252",
    "Monture métal femme Chopard collection Casmir",
    2, 1, 182, 590, "De Rigo Group", 21),

  // ── Line Art by Charmant (Charmant Group) ─────────────────────
  mkItem("mo-lart-01", "montures-optiques", "Line Art", "XL2116",
    "Demi-monture titane ultra-légère Line Art Air Frame",
    3, 1, 82, 265, "Charmant Group", 21),
  mkItem("mo-lart-02", "montures-optiques", "Line Art", "XL2138",
    "Monture cerclée titane minimaliste Line Art Japan",
    3, 1, 86, 278, "Charmant Group", 21),
  mkItem("mo-lart-03", "montures-optiques", "Line Art", "XL2155",
    "Demi-monture acier Air Frame Line Art slim",
    4, 2, 78, 252, "Charmant Group", 21),
  mkItem("mo-lart-04", "montures-optiques", "Line Art", "XL2173",
    "Monture titane bicolore Line Art Collection",
    3, 1, 88, 285, "Charmant Group", 21),

  // ── Zoffani (Charmant Group) ──────────────────────────────────
  mkItem("mo-zoff-01", "montures-optiques", "Zoffani", "ZF2099",
    "Monture acétate italienne Zoffani bicolore tortoise",
    3, 1, 72, 233, "Charmant Group", 21),
  mkItem("mo-zoff-02", "montures-optiques", "Zoffani", "ZF2112",
    "Monture métal slim Zoffani contemporaine",
    3, 1, 68, 220, "Charmant Group", 21),
  mkItem("mo-zoff-03", "montures-optiques", "Zoffani", "ZF2127",
    "Monture mixte acétate-métal Zoffani modern",
    3, 1, 75, 243, "Charmant Group", 21),

  // ── Lightec by Morel (Morel) ──────────────────────────────────
  mkItem("mo-ltc-01", "montures-optiques", "Lightec", "30171L",
    "Demi-monture titane ultra-mince Lightec by Morel",
    3, 1, 92, 298, "Morel", 21),
  mkItem("mo-ltc-02", "montures-optiques", "Lightec", "30225L",
    "Monture cerclée titane premium Lightec Attitude",
    3, 1, 88, 285, "Morel", 21),
  mkItem("mo-ltc-03", "montures-optiques", "Lightec", "8226L",
    "Monture acétate Lightec Attitude femme élégante",
    3, 1, 85, 275, "Morel", 21),
  mkItem("mo-ltc-04", "montures-optiques", "Lightec", "30290L",
    "Monture titane mixte Lightec by Morel sport",
    3, 1, 94, 305, "Morel", 21),

  // ── John Varvatos (Tura Inc.) ─────────────────────────────────
  mkItem("mo-jvar-01", "montures-optiques", "John Varvatos", "V152",
    "Monture métal masculin rock-luxe John Varvatos NYC",
    3, 1, 54, 175, "Tura Inc.", 14),
  mkItem("mo-jvar-02", "montures-optiques", "John Varvatos", "V371",
    "Monture acétate John Varvatos collector edition",
    3, 1, 58, 188, "Tura Inc.", 14),
  mkItem("mo-jvar-03", "montures-optiques", "John Varvatos", "V545",
    "Monture mixte acier John Varvatos Star USA",
    3, 1, 52, 168, "Tura Inc.", 14),

  // ── Laura Ashley (Tura Inc.) ──────────────────────────────────
  mkItem("mo-lash-01", "montures-optiques", "Laura Ashley", "LA2060",
    "Monture acétate fleurie Laura Ashley collection vintage",
    4, 2, 42, 136, "Tura Inc.", 14),
  mkItem("mo-lash-02", "montures-optiques", "Laura Ashley", "LA2072",
    "Monture métal féminine délicate Laura Ashley",
    4, 2, 38, 123, "Tura Inc.", 14),
  mkItem("mo-lash-03", "montures-optiques", "Laura Ashley", "LA2088",
    "Monture papillon acétate Laura Ashley floral",
    4, 2, 44, 142, "Tura Inc.", 14),

  // ── Andy Wolf (Andy Wolf GmbH) ────────────────────────────────
  mkItem("mo-awolf-01", "montures-optiques", "Andy Wolf", "A543",
    "Monture acétate artisanale Styria Andy Wolf",
    2, 1, 98, 318, "Andy Wolf GmbH", 21),
  mkItem("mo-awolf-02", "montures-optiques", "Andy Wolf", "A556",
    "Monture métal exclusif Andy Wolf handmade Austria",
    2, 1, 105, 340, "Andy Wolf GmbH", 21),
  mkItem("mo-awolf-03", "montures-optiques", "Andy Wolf", "A582",
    "Monture acétate oversized Andy Wolf Vienna",
    2, 1, 102, 330, "Andy Wolf GmbH", 21),
  mkItem("mo-awolf-04", "montures-optiques", "Andy Wolf", "A601",
    "Monture ronde acétate épais Andy Wolf collection",
    2, 1, 108, 350, "Andy Wolf GmbH", 21),

  // ── Götti Switzerland ─────────────────────────────────────────
  mkItem("mo-gott-01", "montures-optiques", "Götti", "TOBEL",
    "Monture acétate suisse précision Götti TOBEL",
    2, 1, 108, 350, "Götti Switzerland", 21),
  mkItem("mo-gott-02", "montures-optiques", "Götti", "RASA",
    "Monture titane Swiss made Götti minimaliste",
    2, 1, 115, 372, "Götti Switzerland", 21),
  mkItem("mo-gott-03", "montures-optiques", "Götti", "RIGI",
    "Monture acétate collection alpine Götti Zurich",
    2, 1, 110, 356, "Götti Switzerland", 21),
  mkItem("mo-gott-04", "montures-optiques", "Götti", "NIESEN",
    "Monture demi-cerclée titane Götti Eyewear",
    2, 1, 118, 382, "Götti Switzerland", 21),

  // ── American Optical optique ──────────────────────────────────
  mkItem("mo-ao-01", "montures-optiques", "American Optical", "Sirmont",
    "Monture métal américaine classique AO Sirmont",
    3, 1, 62, 200, "American Optical", 21),
  mkItem("mo-ao-02", "montures-optiques", "American Optical", "Comfortrim",
    "Monture demi-cerclée américaine AO Comfortrim",
    3, 1, 58, 188, "American Optical", 21),
  mkItem("mo-ao-03", "montures-optiques", "American Optical", "Windsor",
    "Monture acier ronde AO Windsor vintage USA",
    3, 1, 65, 210, "American Optical", 21),

  // ── Masunaga — complémentaires ────────────────────────────────
  mkItem("mo-mas-03", "montures-optiques", "Masunaga", "GMS-820",
    "Demi-monture titane japonaise Masunaga ultra-fine",
    2, 1, 165, 535, "Masunaga Optical", 28),
  mkItem("mo-mas-04", "montures-optiques", "Masunaga", "GMS-835",
    "Monture acier Masunaga collection Tradition Japon",
    2, 1, 178, 577, "Masunaga Optical", 28),
  mkItem("mo-mas-05", "montures-optiques", "Masunaga", "Yuichi Toyama U-127",
    "Monture acétate créateur Masunaga × Yuichi Toyama",
    2, 1, 195, 632, "Masunaga Optical", 28),

  // ── ProDesign Denmark — complémentaires ──────────────────────
  mkItem("mo-pro-03", "montures-optiques", "ProDesign", "7830",
    "Monture acétate danoise ProDesign Pure épurée",
    3, 1, 92, 298, "ProDesign Denmark", 21),
  mkItem("mo-pro-04", "montures-optiques", "ProDesign", "4832",
    "Monture métal slim ProDesign Denmark unisex",
    3, 1, 88, 285, "ProDesign Denmark", 21),
  mkItem("mo-pro-05", "montures-optiques", "ProDesign", "6924",
    "Monture titane ProDesign Denmark Air collection",
    3, 1, 95, 308, "ProDesign Denmark", 21),

  // ── Stepper Eyewear complémentaires ───────────────────────────
  mkItem("mo-step-01", "montures-optiques", "Stepper", "SI-20015",
    "Monture métal cerclée Stepper sport homme",
    4, 2, 55, 178, "Stepper Eyewear", 14),
  mkItem("mo-step-02", "montures-optiques", "Stepper", "SI-20033",
    "Monture acétate Stepper femme fashion",
    4, 2, 52, 168, "Stepper Eyewear", 14),
  mkItem("mo-step-03", "montures-optiques", "Stepper", "SI-10077",
    "Monture demi-cerclée acier Stepper homme slim",
    4, 2, 48, 155, "Stepper Eyewear", 14),

  // ── Menrad complémentaires ────────────────────────────────────
  mkItem("mo-men-04", "montures-optiques", "Menrad", "16026",
    "Monture métal bicolore Menrad Premium homme",
    4, 2, 62, 200, "Menrad GmbH", 21),
  mkItem("mo-men-05", "montures-optiques", "Menrad", "16103",
    "Monture acétate Menrad femme tendance",
    4, 2, 58, 188, "Menrad GmbH", 21),
  mkItem("mo-men-06", "montures-optiques", "Menrad", "16241",
    "Monture titane Menrad ultra-légère mixte",
    3, 1, 72, 233, "Menrad GmbH", 21),

  // ── Face à Face complémentaires ───────────────────────────────
  mkItem("mo-faf-05", "montures-optiques", "Face à Face", "BOCCA",
    "Monture acétate créatrice Face à Face BOCCA Paris",
    3, 1, 118, 382, "Face à Face", 21),
  mkItem("mo-faf-06", "montures-optiques", "Face à Face", "WINK2",
    "Monture métal Face à Face WINK2 féminine",
    3, 1, 112, 363, "Face à Face", 21),

  // ── Anne & Valentin complémentaires ───────────────────────────
  mkItem("mo-anv-03", "montures-optiques", "Anne & Valentin", "MITSUKO",
    "Monture acétate Anne & Valentin MITSUKO epurée",
    3, 1, 135, 437, "Anne & Valentin", 21),
  mkItem("mo-anv-04", "montures-optiques", "Anne & Valentin", "FUZE",
    "Monture mixte Anne & Valentin FUZE contemporaine",
    3, 1, 128, 415, "Anne & Valentin", 21),

  // ── Randolph Engineering complémentaires ──────────────────────
  mkItem("mo-rand-01", "montures-optiques", "Randolph Engineering", "Concorde",
    "Monture acier américaine Randolph Concorde aviateur",
    3, 1, 85, 275, "Randolph USA", 21),
  mkItem("mo-rand-02", "montures-optiques", "Randolph Engineering", "XT8",
    "Monture titane Randolph Engineering XT8 sport USA",
    3, 1, 92, 298, "Randolph USA", 21),

  // ── Gold & Wood complémentaires ───────────────────────────────
  mkItem("mo-gw-03", "montures-optiques", "Gold & Wood", "B104",
    "Monture bois précieux-titane Gold & Wood B104",
    1, 1, 285, 925, "Gold & Wood", 28),
  mkItem("mo-gw-04", "montures-optiques", "Gold & Wood", "C126",
    "Monture écaille véritable Gold & Wood Collector",
    1, 1, 310, 1005, "Gold & Wood", 28),

  // ── Cartier (Richemont Group) ─────────────────────────────────
  mkItem("mo-cart-01", "montures-optiques", "Cartier", "CT0092O",
    "Monture acétate Cartier Santos de Cartier",
    1, 1, 395, 1280, "Richemont Group", 28),
  mkItem("mo-cart-02", "montures-optiques", "Cartier", "CT0035O",
    "Monture métal Cartier Panthere dorée signature",
    1, 1, 425, 1380, "Richemont Group", 28),
  mkItem("mo-cart-03", "montures-optiques", "Cartier", "CT0165O",
    "Monture titane Cartier Première de Cartier",
    1, 1, 445, 1440, "Richemont Group", 28),
  mkItem("mo-cart-04", "montures-optiques", "Cartier", "CT0286O",
    "Monture métal cerclé Cartier C de Cartier",
    1, 1, 415, 1345, "Richemont Group", 28),

  // ── Mont Blanc (Marcolin Group) ───────────────────────────────
  mkItem("mo-mb-01", "montures-optiques", "Mont Blanc", "MB0128O",
    "Monture acétate Mont Blanc Meisterstück",
    2, 1, 142, 460, "Marcolin Group", 21),
  mkItem("mo-mb-02", "montures-optiques", "Mont Blanc", "MB0142O",
    "Monture métal Mont Blanc Explorer mixte",
    2, 1, 148, 480, "Marcolin Group", 21),
  mkItem("mo-mb-03", "montures-optiques", "Mont Blanc", "MB0095O",
    "Monture titane Mont Blanc Legend prestige",
    2, 1, 155, 502, "Marcolin Group", 21),

  // ── Boucheron (Kering Eyewear) ────────────────────────────────
  mkItem("mo-bou-01", "montures-optiques", "Boucheron", "BC0077O",
    "Monture acétate Boucheron Quatre floral",
    1, 1, 285, 925, "Kering Eyewear", 21),
  mkItem("mo-bou-02", "montures-optiques", "Boucheron", "BC0141O",
    "Monture métal Boucheron Serpent Bohème",
    1, 1, 295, 955, "Kering Eyewear", 21),

  // ── Alexander McQueen (Kering Eyewear) ───────────────────────
  mkItem("mo-amq-01", "montures-optiques", "Alexander McQueen", "MQ0340O",
    "Monture acétate graphic Alexander McQueen",
    2, 1, 165, 535, "Kering Eyewear", 21),
  mkItem("mo-amq-02", "montures-optiques", "Alexander McQueen", "MQ0274O",
    "Monture métal Alexander McQueen skull detail",
    2, 1, 172, 557, "Kering Eyewear", 21),

  // ── Woow Eyewear ──────────────────────────────────────────────
  mkItem("mo-woow-01", "montures-optiques", "Woow", "Believe Me",
    "Monture acétate créative Woow Eyewear collection",
    3, 1, 72, 233, "Woow Eyewear SAS", 14),
  mkItem("mo-woow-02", "montures-optiques", "Woow", "Extra Ball",
    "Monture bicolore Woow Eyewear fun design",
    3, 1, 68, 220, "Woow Eyewear SAS", 14),
  mkItem("mo-woow-03", "montures-optiques", "Woow", "Keep Cool",
    "Monture acétate arrondie Woow Eyewear mixte",
    3, 1, 75, 243, "Woow Eyewear SAS", 14),
  mkItem("mo-woow-04", "montures-optiques", "Woow", "Not Too Much",
    "Monture fine acétate Woow Eyewear contemporaine",
    4, 2, 70, 227, "Woow Eyewear SAS", 14),

  // ── Xavier Garcia ─────────────────────────────────────────────
  mkItem("mo-xg-01", "montures-optiques", "Xavier Garcia", "ALDANA",
    "Monture acétate épais Xavier Garcia Barcelona",
    2, 1, 105, 340, "Xavier Garcia", 21),
  mkItem("mo-xg-02", "montures-optiques", "Xavier Garcia", "BELFOR",
    "Monture mixte métal-acétate Xavier Garcia",
    2, 1, 112, 363, "Xavier Garcia", 21),
  mkItem("mo-xg-03", "montures-optiques", "Xavier Garcia", "CAMY",
    "Monture acétate féminine Xavier Garcia collection",
    2, 1, 108, 350, "Xavier Garcia", 21),

  // ── Cazal — complémentaires ───────────────────────────────────
  mkItem("mo-caz-03", "montures-optiques", "Cazal", "3025",
    "Monture acétate Cazal Legends vintage NYC",
    2, 1, 138, 448, "Cazal Eyewear", 21),
  mkItem("mo-caz-04", "montures-optiques", "Cazal", "6020",
    "Monture métal géométrique Cazal Eyewear",
    2, 1, 145, 470, "Cazal Eyewear", 21),
  mkItem("mo-caz-05", "montures-optiques", "Cazal", "6036",
    "Monture acétate Cazal Legends ronde prestige",
    2, 1, 148, 480, "Cazal Eyewear", 21),

  // ── Moscot — complémentaires ──────────────────────────────────
  mkItem("mo-mos-04", "montures-optiques", "Moscot", "Billik",
    "Monture acétate Moscot New York Billik round",
    3, 1, 118, 382, "Moscot", 21),
  mkItem("mo-mos-05", "montures-optiques", "Moscot", "Spector",
    "Monture ovale Moscot Spector downtown NYC",
    3, 1, 122, 395, "Moscot", 21),
  mkItem("mo-mos-06", "montures-optiques", "Moscot", "Originals Grunya",
    "Monture Moscot Originals Grunya acétate havane",
    3, 1, 115, 373, "Moscot", 21),

  // ── Thierry Lasry — complémentaires ──────────────────────────
  mkItem("mo-tl-03", "montures-optiques", "Thierry Lasry", "Saucy",
    "Monture acétate épais Thierry Lasry Saucy Paris",
    2, 1, 195, 632, "Thierry Lasry", 21),
  mkItem("mo-tl-04", "montures-optiques", "Thierry Lasry", "Freaky",
    "Monture acétate géométrique Thierry Lasry Freaky",
    2, 1, 188, 610, "Thierry Lasry", 21),
  mkItem("mo-tl-05", "montures-optiques", "Thierry Lasry", "Raty",
    "Monture métal minimaliste Thierry Lasry Raty",
    2, 1, 178, 577, "Thierry Lasry", 21),

  // ── Jaguar — complémentaires ──────────────────────────────────
  mkItem("mo-jag-03", "montures-optiques", "Jaguar", "33720",
    "Monture métal épurée Jaguar Eyewear homme",
    4, 2, 52, 168, "Jaguar Eyewear", 14),
  mkItem("mo-jag-04", "montures-optiques", "Jaguar", "33806",
    "Monture acétate bicolore Jaguar Eyewear mixte",
    4, 2, 55, 178, "Jaguar Eyewear", 14),
  mkItem("mo-jag-05", "montures-optiques", "Jaguar", "33915",
    "Monture cerclée titane Jaguar Eyewear premium",
    3, 1, 62, 200, "Jaguar Eyewear", 14),

  // ── Pierre Cardin — complémentaires ──────────────────────────
  mkItem("mo-pc-03", "montures-optiques", "Pierre Cardin", "PC6955",
    "Monture acétate homme Pierre Cardin signature",
    4, 2, 38, 123, "Pierre Cardin SAS", 14),
  mkItem("mo-pc-04", "montures-optiques", "Pierre Cardin", "PC6978",
    "Monture métal féminine Pierre Cardin chic",
    4, 2, 35, 113, "Pierre Cardin SAS", 14),
  mkItem("mo-pc-05", "montures-optiques", "Pierre Cardin", "PC6803",
    "Monture demi-cerclée Pierre Cardin mixte",
    4, 2, 36, 117, "Pierre Cardin SAS", 14),

  // ── Porsche Design — complémentaires ─────────────────────────
  mkItem("mo-pd-03", "montures-optiques", "Porsche Design", "P8310",
    "Monture titane Porsche Design P8310 engineering",
    2, 1, 195, 632, "Porsche Design", 21),
  mkItem("mo-pd-04", "montures-optiques", "Porsche Design", "P8340",
    "Monture acétate Porsche Design P8340 sport luxe",
    2, 1, 185, 600, "Porsche Design", 21),

  // ── Mykita — complémentaires ──────────────────────────────────
  mkItem("mo-myk-06", "montures-optiques", "Mykita", "Lerato",
    "Monture métal plié à froid Mykita Lerato Berlin",
    2, 1, 185, 600, "Mykita GmbH", 21),
  mkItem("mo-myk-07", "montures-optiques", "Mykita", "Yuki",
    "Monture acier inox MYKITA Yuki ultra-légère",
    2, 1, 192, 622, "Mykita GmbH", 21),
  mkItem("mo-myk-08", "montures-optiques", "Mykita", "Eyevan 7285 712",
    "Monture titane MYKITA × Eyevan collaboration",
    2, 1, 205, 665, "Mykita GmbH", 21),

  // ── Humphrey's — complémentaires ─────────────────────────────
  mkItem("mo-hum-03", "montures-optiques", "Humphrey's", "582148",
    "Monture cerclée métal Humphrey's by Silhouette",
    5, 2, 36, 117, "Humphrey's by Silhouette", 14),
  mkItem("mo-hum-04", "montures-optiques", "Humphrey's", "583090",
    "Monture acétate féminine Humphrey's slim",
    5, 2, 38, 123, "Humphrey's by Silhouette", 14),

  // ── Starck Biotech Paris — complémentaires ────────────────────
  mkItem("mo-sta-05", "montures-optiques", "Starck Biotech Paris", "SH3091",
    "Monture bioplastique Starck collection Pure",
    2, 1, 128, 415, "Starck Biotech Paris", 21),
  mkItem("mo-sta-06", "montures-optiques", "Starck Biotech Paris", "SH3102",
    "Monture bioplastique transparent Starck Paris",
    2, 1, 132, 428, "Starck Biotech Paris", 21),

  // ── Lindberg — complémentaires ────────────────────────────────
  mkItem("mo-lin-06", "montures-optiques", "Lindberg", "Rimless 9523",
    "Monture sans cercle titane Lindberg rimless",
    2, 1, 245, 794, "Lindberg A/S", 28),
  mkItem("mo-lin-07", "montures-optiques", "Lindberg", "N.O.W Titanium 6541",
    "Monture pliant unique Lindberg N.O.W Titanium",
    2, 1, 262, 849, "Lindberg A/S", 28),
  mkItem("mo-lin-08", "montures-optiques", "Lindberg", "Air Titanium 9747",
    "Monture Air Titanium colorée Lindberg Acetanium",
    2, 1, 228, 739, "Lindberg A/S", 28),

  // ── Etnia Barcelona — complémentaires ────────────────────────
  mkItem("mo-etnia-05", "montures-optiques", "Etnia Barcelona", "Madrid",
    "Monture acétate signature Etnia Barcelona Madrid",
    4, 2, 86, 278, "Etnia Barcelona", 21),
  mkItem("mo-etnia-06", "montures-optiques", "Etnia Barcelona", "Dublin",
    "Monture acétate Etnia Barcelona Dublin colorée",
    4, 2, 82, 265, "Etnia Barcelona", 21),
  mkItem("mo-etnia-07", "montures-optiques", "Etnia Barcelona", "Lagos",
    "Monture mixte métal-acétate Etnia Barcelona",
    4, 2, 84, 272, "Etnia Barcelona", 21),

  // ── Serengeti — complémentaires optiques ─────────────────────
  mkItem("mo-sere-02", "montures-optiques", "Serengeti", "Delio",
    "Monture métal Serengeti Delio lifestyle photochromique",
    3, 1, 68, 228, "Bollé Brands", 14),
  mkItem("mo-sere-03", "montures-optiques", "Serengeti", "Ciriano",
    "Monture cerclée Serengeti Ciriano sport optique",
    3, 1, 72, 240, "Bollé Brands", 14),

  // ── Adidas — complémentaires optiques ────────────────────────
  mkItem("mo-adi-03", "montures-optiques", "Adidas", "ADIDAS SP5084",
    "Monture sport Adidas SP5084 polycarbonate",
    4, 2, 52, 168, "Silhouette International", 14),
  mkItem("mo-adi-04", "montures-optiques", "Adidas", "ADIDAS SP5012",
    "Monture acétate Adidas Originals lifestyle",
    4, 2, 48, 155, "Silhouette International", 14),
];

/* ════════════════════════════════════════════════════════════════
   MONTURES SOLAIRES
   ════════════════════════════════════════════════════════════════ */
const MONTURES_SOLAIRES: StockItem[] = [
  // ── Ray-Ban ──────────────────────────────────────────────────
  mkItem("ms-rb-01", "montures-solaires", "Ray-Ban", "Aviator RB3025",
    "Solaire aviateur métal iconique",
    15, 5, 52, 175, "Luxottica Group", 10),
  mkItem("ms-rb-02", "montures-solaires", "Ray-Ban", "Wayfarer RB2140",
    "Solaire acetate wayfarer classique",
    12, 4, 48, 160, "Luxottica Group", 10),
  mkItem("ms-rb-03", "montures-solaires", "Ray-Ban", "Clubmaster RB3016",
    "Solaire browline métal/acetate",
    8, 3, 55, 185, "Luxottica Group", 10),
  mkItem("ms-rb-04", "montures-solaires", "Ray-Ban", "Erika RB4171",
    "Solaire acétate mat rond velvet",
    10, 3, 45, 150, "Luxottica Group", 10),
  mkItem("ms-rb-05", "montures-solaires", "Ray-Ban", "Round Metal RB3447",
    "Solaire métal rond John Lennon",
    8, 3, 58, 194, "Luxottica Group", 10),
  mkItem("ms-rb-06", "montures-solaires", "Ray-Ban", "Caravan RB3136",
    "Solaire métal carré militaire",
    7, 2, 55, 185, "Luxottica Group", 10),
  mkItem("ms-rb-07", "montures-solaires", "Ray-Ban", "Folding Wayfarer RB4105",
    "Solaire wayfarer pliable compact",
    6, 2, 62, 205, "Luxottica Group", 10),
  mkItem("ms-rb-08", "montures-solaires", "Ray-Ban", "Hexagonal RB3548N",
    "Solaire métal hexagonal tendance",
    7, 2, 52, 174, "Luxottica Group", 10),
  mkItem("ms-rb-09", "montures-solaires", "Ray-Ban", "Clubround RB4246",
    "Solaire acétate demi-cerclée ronde",
    8, 3, 52, 174, "Luxottica Group", 10),
  mkItem("ms-rb-10", "montures-solaires", "Ray-Ban", "Justin RB4165",
    "Solaire acétate rectangulaire rubber",
    10, 3, 42, 140, "Luxottica Group", 10),
  mkItem("ms-rb-11", "montures-solaires", "Ray-Ban", "New Wayfarer RB2132",
    "Solaire acétate new wayfarer slim",
    10, 4, 48, 160, "Luxottica Group", 10),

  // ── Oakley ───────────────────────────────────────────────────
  mkItem("ms-oak-01", "montures-solaires", "Oakley", "Holbrook",
    "Solaire sport acetate Oakley",
    10, 3, 62, 205, "Luxottica Group", 10),
  mkItem("ms-oak-02", "montures-solaires", "Oakley", "Prizm Road",
    "Solaire sport verres Prizm cyclisme",
    6, 2, 72, 240, "Luxottica Group", 10),
  mkItem("ms-oak-03", "montures-solaires", "Oakley", "Frogskins",
    "Solaire acétate retro iconique Oakley",
    8, 3, 52, 175, "Luxottica Group", 10),
  mkItem("ms-oak-04", "montures-solaires", "Oakley", "Flak 2.0 XL",
    "Solaire sport wrap cyclisme/running",
    5, 2, 88, 295, "Luxottica Group", 14),
  mkItem("ms-oak-05", "montures-solaires", "Oakley", "Jawbreaker",
    "Solaire sport vélo haute performance Prizm",
    4, 2, 105, 350, "Luxottica Group", 14),
  mkItem("ms-oak-06", "montures-solaires", "Oakley", "Sutro",
    "Solaire lifestyle semi-rimless tendance",
    6, 2, 65, 218, "Luxottica Group", 10),
  mkItem("ms-oak-07", "montures-solaires", "Oakley", "Radar EV Path",
    "Solaire sport baseball/polyvalent Prizm",
    5, 2, 92, 308, "Luxottica Group", 14),

  // ── Maui Jim ─────────────────────────────────────────────────
  mkItem("ms-mj-01", "montures-solaires", "Maui Jim", "Peahi",
    "Solaire polarisant PolarizedPlus2",
    4, 2, 98, 325, "Maui Jim Inc.", 21),
  mkItem("ms-mj-02", "montures-solaires", "Maui Jim", "Breakwall",
    "Solaire polarisant lifestyle lunette mixte",
    5, 2, 88, 295, "Maui Jim Inc.", 21),
  mkItem("ms-mj-03", "montures-solaires", "Maui Jim", "Lahaina",
    "Solaire polarisant semi-rimless classique",
    4, 2, 105, 350, "Maui Jim Inc.", 21),
  mkItem("ms-mj-04", "montures-solaires", "Maui Jim", "Sugar Beach",
    "Solaire polarisant wraparound sport",
    5, 2, 92, 308, "Maui Jim Inc.", 21),
  mkItem("ms-mj-05", "montures-solaires", "Maui Jim", "Ho'okipa",
    "Solaire polarisant sport ovale icône Maui Jim",
    4, 2, 102, 340, "Maui Jim Inc.", 21),

  // ── Bollé ────────────────────────────────────────────────────
  mkItem("ms-bol-01", "montures-solaires", "Bollé", "Limit",
    "Solaire sport photochromique",
    8, 3, 38, 128, "Bollé Brands", 14),
  mkItem("ms-bol-02", "montures-solaires", "Bollé", "Anaconda",
    "Solaire sport verres polarisants",
    6, 2, 42, 140, "Bollé Brands", 14),
  mkItem("ms-bol-03", "montures-solaires", "Bollé", "Chase",
    "Solaire sport running léger",
    7, 3, 40, 133, "Bollé Brands", 14),
  mkItem("ms-bol-04", "montures-solaires", "Bollé", "Cobra",
    "Solaire sport cyclisme aérodynamique",
    6, 2, 45, 150, "Bollé Brands", 14),
  mkItem("ms-bol-05", "montures-solaires", "Bollé", "Clint",
    "Solaire sport lifestyle polarisant",
    6, 2, 38, 128, "Bollé Brands", 14),

  // ── Julbo ────────────────────────────────────────────────────
  mkItem("ms-jul-01", "montures-solaires", "Julbo", "Trek",
    "Solaire montagne protection totale",
    5, 2, 48, 160, "Julbo SAS", 14),
  mkItem("ms-jul-02", "montures-solaires", "Julbo", "Monterosa",
    "Solaire alpinisme verres Spectron",
    4, 2, 55, 185, "Julbo SAS", 14),
  mkItem("ms-jul-03", "montures-solaires", "Julbo", "Vermont Classic",
    "Solaire montagne iconique cuir latéral",
    4, 2, 52, 174, "Julbo SAS", 14),
  mkItem("ms-jul-04", "montures-solaires", "Julbo", "Cham",
    "Solaire ski freeride protection extrême",
    4, 2, 62, 206, "Julbo SAS", 14),
  mkItem("ms-jul-05", "montures-solaires", "Julbo", "Shield",
    "Solaire sport shield photochromique React",
    4, 2, 68, 228, "Julbo SAS", 14),

  // ── Vuarnet ──────────────────────────────────────────────────
  mkItem("ms-vua-01", "montures-solaires", "Vuarnet", "Legend 06",
    "Solaire mythique Skilynx mineraux français",
    3, 1, 115, 385, "Vuarnet SAS", 14),
  mkItem("ms-vua-02", "montures-solaires", "Vuarnet", "VL1502 Pure Small",
    "Solaire acétate minimaliste verres minéraux",
    3, 1, 125, 418, "Vuarnet SAS", 14),
  mkItem("ms-vua-03", "montures-solaires", "Vuarnet", "VL1902 Edge",
    "Solaire acétate carré verres Skilynx",
    2, 1, 135, 450, "Vuarnet SAS", 14),
  mkItem("ms-vua-04", "montures-solaires", "Vuarnet", "VL0021 Club",
    "Solaire métal iconic round Club",
    3, 1, 108, 360, "Vuarnet SAS", 14),

  // ── Carrera ──────────────────────────────────────────────────
  mkItem("ms-car-01", "montures-solaires", "Carrera", "8016/S",
    "Solaire sport acetate Carrera",
    8, 3, 42, 140, "Safilo Group", 14),
  mkItem("ms-car-02", "montures-solaires", "Carrera", "1001/S",
    "Solaire acier pilote sportif",
    7, 3, 48, 160, "Safilo Group", 14),
  mkItem("ms-car-03", "montures-solaires", "Carrera", "GLORY",
    "Solaire acétate oversize lifestyle",
    6, 2, 56, 188, "Safilo Group", 14),

  // ── Tom Ford ─────────────────────────────────────────────────
  mkItem("ms-tf-01", "montures-solaires", "Tom Ford", "FT0697",
    "Solaire luxe acetate Tom Ford",
    3, 1, 118, 395, "Marcolin Group", 21),
  mkItem("ms-tf-02", "montures-solaires", "Tom Ford", "FT0248 Anouk",
    "Solaire cat-eye acétate iconique TF",
    3, 1, 122, 408, "Marcolin Group", 21),
  mkItem("ms-tf-03", "montures-solaires", "Tom Ford", "FT0885 Maverick",
    "Solaire acétate rétro oversize",
    2, 1, 128, 428, "Marcolin Group", 21),
  mkItem("ms-tf-04", "montures-solaires", "Tom Ford", "FT0775 Atticus",
    "Solaire acier pilote carré",
    3, 1, 115, 385, "Marcolin Group", 21),

  // ── Persol ───────────────────────────────────────────────────
  mkItem("ms-per-01", "montures-solaires", "Persol", "PO2422SJ",
    "Solaire acetate Steve McQueen edition",
    4, 2, 88, 295, "Luxottica Group", 14),
  mkItem("ms-per-02", "montures-solaires", "Persol", "PO0649",
    "Solaire métal rond iconique — Steve McQueen",
    4, 2, 95, 318, "Luxottica Group", 14),
  mkItem("ms-per-03", "montures-solaires", "Persol", "PO3019S",
    "Solaire acétate rectangulaire meflecto",
    4, 2, 82, 274, "Luxottica Group", 14),
  mkItem("ms-per-04", "montures-solaires", "Persol", "PO3235S",
    "Solaire acétate pilote meflecto",
    3, 1, 88, 295, "Luxottica Group", 14),

  // ── Cébé ─────────────────────────────────────────────────────
  mkItem("ms-ceb-01", "montures-solaires", "Cébé", "Haka",
    "Solaire sport trail & randonnée",
    6, 2, 35, 117, "Bollé Brands", 14),
  mkItem("ms-ceb-02", "montures-solaires", "Cébé", "Sunpeak",
    "Solaire sport montagne Cébé",
    5, 2, 32, 107, "Bollé Brands", 14),
  mkItem("ms-ceb-03", "montures-solaires", "Cébé", "Ridge",
    "Solaire vélo sport aérodynamique",
    5, 2, 38, 127, "Bollé Brands", 14),

  // ── Gucci ────────────────────────────────────────────────────
  mkItem("ms-gcc-01", "montures-solaires", "Gucci", "GG1005S",
    "Solaire oversize acetate Gucci",
    3, 1, 145, 485, "Kering Eyewear", 28),
  mkItem("ms-gcc-02", "montures-solaires", "Gucci", "GG0396S",
    "Solaire browline métal web stripe",
    3, 1, 152, 510, "Kering Eyewear", 28),

  // ── Prada ────────────────────────────────────────────────────
  mkItem("ms-pra-01", "montures-solaires", "Prada", "PR 01OS Minimal Baroque",
    "Solaire acetate rectangle Prada",
    3, 1, 138, 460, "Luxottica Group", 28),

  // ── Dior ─────────────────────────────────────────────────────
  mkItem("ms-dio-01", "montures-solaires", "Dior", "DiorSignature S1U",
    "Solaire cat-eye acétate Dior",
    2, 1, 168, 560, "LVMH Fashion Group", 28),

  // ── Chloé ────────────────────────────────────────────────────
  mkItem("ms-chl-01", "montures-solaires", "Chloé", "CE120S",
    "Solaire rétro oversized Chloé",
    3, 1, 112, 375, "Safilo Group", 21),
  mkItem("ms-chl-02", "montures-solaires", "Chloé", "CH0024S",
    "Solaire rond signature chaîne",
    3, 1, 118, 395, "Safilo Group", 21),

  // ── Oliver Peoples ───────────────────────────────────────────
  mkItem("ms-op-01", "montures-solaires", "Oliver Peoples", "OV5217S Gregory Peck Sun",
    "Solaire acetate vintage californien",
    4, 2, 108, 360, "Safilo Group", 21),
  mkItem("ms-op-02", "montures-solaires", "Oliver Peoples", "OV5278SU Coxos",
    "Solaire acétate oversize collection OV",
    3, 1, 115, 385, "Safilo Group", 21),
  mkItem("ms-op-03", "montures-solaires", "Oliver Peoples", "OV5427SU Maysen",
    "Solaire acétate ronde lifestyle",
    3, 1, 112, 373, "Safilo Group", 21),

  // ── Etnia Barcelona ──────────────────────────────────────────
  mkItem("ms-etnia-01", "montures-solaires", "Etnia Barcelona", "California Sun",
    "Solaire acetate coloré polarisant",
    4, 2, 78, 260, "Etnia Barcelona", 21),
  mkItem("ms-etnia-02", "montures-solaires", "Etnia Barcelona", "Costa Rica",
    "Solaire acétate oversize vintage",
    4, 2, 82, 273, "Etnia Barcelona", 21),

  // ── Saint Laurent ────────────────────────────────────────────
  mkItem("ms-sl-01", "montures-solaires", "Saint Laurent", "SL 28 Metal",
    "Solaire métal cat-eye SL Paris",
    3, 1, 155, 518, "Kering Eyewear", 28),
  mkItem("ms-sl-02", "montures-solaires", "Saint Laurent", "SL 471",
    "Solaire acétate rectangulaire oversized",
    2, 1, 162, 540, "Kering Eyewear", 28),

  // ── Celine ───────────────────────────────────────────────────
  mkItem("ms-cel-01", "montures-solaires", "Celine", "CL40197I Triomphe",
    "Solaire acétate losange Triomphe",
    3, 1, 172, 575, "Kering Eyewear", 28),

  // ── Fendi ────────────────────────────────────────────────────
  mkItem("ms-fen-01", "montures-solaires", "Fendi", "FE40073I",
    "Solaire shield acétate FF",
    2, 1, 158, 528, "Safilo Group", 28),

  // ── Versace ──────────────────────────────────────────────────
  mkItem("ms-ver-01", "montures-solaires", "Versace", "VE4406 Medusa",
    "Solaire acétate Medusa doré",
    3, 1, 128, 428, "Luxottica Group", 21),
  mkItem("ms-ver-02", "montures-solaires", "Versace", "VE2217",
    "Solaire métal oversize Medusa",
    3, 1, 118, 395, "Luxottica Group", 21),

  // ── Bottega Veneta ───────────────────────────────────────────
  mkItem("ms-bv-01", "montures-solaires", "Bottega Veneta", "BV1150S",
    "Solaire acétate oversize intreccio",
    2, 1, 162, 540, "Kering Eyewear", 28),

  // ── Emporio Armani ───────────────────────────────────────────
  mkItem("ms-ea-01", "montures-solaires", "Emporio Armani", "EA2150",
    "Solaire pilote métal sport",
    5, 2, 58, 194, "Luxottica Group", 14),

  // ── Polaroid ─────────────────────────────────────────────────
  mkItem("ms-pol-01", "montures-solaires", "Polaroid", "PLD 2109/S",
    "Solaire polarisant accessible lifestyle",
    10, 4, 22, 73, "Safilo Group", 10),
  mkItem("ms-pol-02", "montures-solaires", "Polaroid", "PLD 6196/S",
    "Solaire sport polarisant UV400",
    8, 3, 25, 83, "Safilo Group", 10),
  mkItem("ms-pol-03", "montures-solaires", "Polaroid", "PLD 1016/S",
    "Solaire pilote polarisant classique",
    8, 3, 20, 67, "Safilo Group", 10),
  mkItem("ms-pol-04", "montures-solaires", "Polaroid", "PLD 6009/N",
    "Solaire acétate wayfarer polarisant",
    8, 3, 22, 73, "Safilo Group", 10),

  // ── Serengeti ────────────────────────────────────────────────
  mkItem("ms-ser-01", "montures-solaires", "Serengeti", "Positano",
    "Solaire photochromique drivers polarisant",
    5, 2, 68, 228, "Safilo Group", 14),

  // ── Randolph Engineering ─────────────────────────────────────
  mkItem("ms-ran-01", "montures-solaires", "Randolph Engineering", "Aviator 23K",
    "Solaire aviateur métal US mil-spec",
    3, 1, 105, 350, "Randolph USA", 21),
  mkItem("ms-ran-02", "montures-solaires", "Randolph Engineering", "Sportsman",
    "Solaire wrap sport semi-rimless mil-spec",
    3, 1, 112, 373, "Randolph USA", 21),
  mkItem("ms-ran-03", "montures-solaires", "Randolph Engineering", "Concorde",
    "Solaire métal carré pilote classique",
    3, 1, 108, 360, "Randolph USA", 21),

  // ── Burberry ─────────────────────────────────────────────────
  mkItem("ms-bur-01", "montures-solaires", "Burberry", "BE4397",
    "Solaire acétate check icon femme",
    4, 2, 88, 295, "Safilo Group", 14),
  mkItem("ms-bur-02", "montures-solaires", "Burberry", "BE4383",
    "Solaire acier pilote homme",
    4, 2, 85, 285, "Safilo Group", 14),
  mkItem("ms-bur-03", "montures-solaires", "Burberry", "BE4360",
    "Solaire acétate oversize trench style",
    3, 2, 92, 308, "Safilo Group", 14),

  // ── Ralph Lauren ─────────────────────────────────────────────
  mkItem("ms-rl-01", "montures-solaires", "Ralph Lauren", "RL8188",
    "Solaire acétate sport nautique RL",
    5, 2, 72, 240, "Luxottica Group", 14),
  mkItem("ms-rl-02", "montures-solaires", "Ralph Lauren", "RL7082",
    "Solaire métal aviateur dorée",
    4, 2, 68, 228, "Luxottica Group", 14),

  // ── Polo Ralph Lauren ────────────────────────────────────────
  mkItem("ms-polo-01", "montures-solaires", "Polo Ralph Lauren", "PH4167",
    "Solaire acétate sport prep logo",
    6, 2, 58, 194, "Luxottica Group", 14),
  mkItem("ms-polo-02", "montures-solaires", "Polo Ralph Lauren", "PH3116",
    "Solaire acier pilote masculin",
    5, 2, 55, 185, "Luxottica Group", 14),

  // ── Calvin Klein ─────────────────────────────────────────────
  mkItem("ms-ck-01", "montures-solaires", "Calvin Klein", "CK21511S",
    "Solaire acétate minimaliste CK",
    5, 2, 52, 174, "Safilo Group", 14),
  mkItem("ms-ck-02", "montures-solaires", "Calvin Klein", "CK20548S",
    "Solaire métal fine cerclée rectangulaire",
    5, 2, 48, 160, "Safilo Group", 14),

  // ── Tommy Hilfiger ───────────────────────────────────────────
  mkItem("ms-th-01", "montures-solaires", "Tommy Hilfiger", "TH1955/S",
    "Solaire acétate sport-casual logo TH",
    5, 2, 48, 160, "Safilo Group", 14),
  mkItem("ms-th-02", "montures-solaires", "Tommy Hilfiger", "TH1803/S",
    "Solaire acier pilote homme",
    5, 2, 45, 150, "Safilo Group", 14),

  // ── Lacoste ──────────────────────────────────────────────────
  mkItem("ms-lac-01", "montures-solaires", "Lacoste", "L947S",
    "Solaire acétate sport crocodile",
    6, 2, 50, 168, "Safilo Group", 14),
  mkItem("ms-lac-02", "montures-solaires", "Lacoste", "L863S",
    "Solaire acier pilote sportif",
    5, 2, 48, 160, "Safilo Group", 14),

  // ── Kenzo ────────────────────────────────────────────────────
  mkItem("ms-kenz-01", "montures-solaires", "Kenzo", "KZ40013U",
    "Solaire acétate floral surdimensionné",
    4, 2, 78, 260, "Kering Eyewear", 21),

  // ── Givenchy ─────────────────────────────────────────────────
  mkItem("ms-giv-01", "montures-solaires", "Givenchy", "GV40049U",
    "Solaire acétate 4G logo oversize",
    3, 1, 138, 460, "Kering Eyewear", 28),

  // ── Valentino ────────────────────────────────────────────────
  mkItem("ms-val-01", "montures-solaires", "Valentino", "VA4114",
    "Solaire acétate rockstud Valentino",
    2, 1, 155, 518, "Luxottica Group", 28),
  mkItem("ms-val-02", "montures-solaires", "Valentino", "VA4084",
    "Solaire acier V-logo doré butterfly",
    2, 1, 148, 495, "Luxottica Group", 28),

  // ── Miu Miu ──────────────────────────────────────────────────
  mkItem("ms-miu-01", "montures-solaires", "Miu Miu", "MU 73WS",
    "Solaire acétate oversize Miu Miu",
    2, 1, 162, 540, "Luxottica Group", 28),
  mkItem("ms-miu-02", "montures-solaires", "Miu Miu", "MU 62WS",
    "Solaire acétate cat-eye rétro",
    2, 1, 158, 528, "Luxottica Group", 28),

  // ── Balenciaga ───────────────────────────────────────────────
  mkItem("ms-bal-01", "montures-solaires", "Balenciaga", "BB0099S",
    "Solaire shield BB logo oversize",
    2, 1, 178, 595, "Kering Eyewear", 28),
  mkItem("ms-bal-02", "montures-solaires", "Balenciaga", "BB0081S",
    "Solaire acétate rectangulaire logo BB",
    2, 1, 172, 575, "Kering Eyewear", 28),

  // ── Bvlgari ──────────────────────────────────────────────────
  mkItem("ms-bvl-01", "montures-solaires", "Bvlgari", "BV8258",
    "Solaire acétate serpenti Bvlgari femme",
    2, 1, 158, 528, "Luxottica Group", 28),

  // ── Tiffany & Co. ────────────────────────────────────────────
  mkItem("ms-tif-01", "montures-solaires", "Tiffany & Co.", "TF4194",
    "Solaire acier Tiffany T cat-eye",
    3, 1, 138, 460, "Luxottica Group", 21),

  // ── Police ───────────────────────────────────────────────────
  mkItem("ms-pol2-01", "montures-solaires", "Police", "SPLB43",
    "Solaire acier sport masculin Police",
    5, 2, 45, 150, "De Rigo Group", 14),
  mkItem("ms-pol2-02", "montures-solaires", "Police", "SPLA23",
    "Solaire acétate lifestyle tendance",
    5, 2, 42, 140, "De Rigo Group", 14),

  // ── Guess ────────────────────────────────────────────────────
  mkItem("ms-gue-01", "montures-solaires", "Guess", "GU7874",
    "Solaire acétate femme tendance",
    6, 3, 38, 127, "Safilo Group", 14),
  mkItem("ms-gue-02", "montures-solaires", "Guess", "GU7908",
    "Solaire acier homme sport",
    5, 2, 35, 117, "Safilo Group", 14),

  // ── Hackett London ───────────────────────────────────────────
  mkItem("ms-hac-01", "montures-solaires", "Hackett London", "HEB254",
    "Solaire acétate British lifestyle",
    4, 2, 78, 260, "Marcolin Group", 14),

  // ── Porsche Design ───────────────────────────────────────────
  mkItem("ms-pd-01", "montures-solaires", "Porsche Design", "P8478",
    "Solaire titane sport engineering",
    2, 1, 192, 640, "Porsche Design", 21),
  mkItem("ms-pd-02", "montures-solaires", "Porsche Design", "P8691",
    "Solaire acier wrap aérodynamique",
    2, 1, 185, 618, "Porsche Design", 21),

  // ── American Optical ─────────────────────────────────────────
  mkItem("ms-ao-01", "montures-solaires", "American Optical", "Original Pilot",
    "Solaire aviateur US vintage Original Pilot",
    3, 1, 78, 260, "American Optical", 21),
  mkItem("ms-ao-02", "montures-solaires", "American Optical", "Saratoga",
    "Solaire acier keyhole bridge classique",
    3, 1, 72, 240, "American Optical", 21),

  // ── Moscot ───────────────────────────────────────────────────
  mkItem("ms-mos-01", "montures-solaires", "Moscot", "Lemtosh Sun",
    "Solaire acétate ronde tintée New York",
    3, 1, 152, 507, "Moscot", 21),
  mkItem("ms-mos-02", "montures-solaires", "Moscot", "Zolman Sun",
    "Solaire acétate browline teintée vintage",
    3, 1, 145, 485, "Moscot", 21),

  // ── Garrett Leight ───────────────────────────────────────────
  mkItem("ms-gl-01", "montures-solaires", "Garrett Leight", "Wilson Sun",
    "Solaire acétate ronde teintée Venice Beach",
    3, 1, 158, 528, "Garrett Leight", 21),
  mkItem("ms-gl-02", "montures-solaires", "Garrett Leight", "Clune",
    "Solaire acétate oversize lifestyle",
    3, 1, 162, 540, "Garrett Leight", 21),

  // ── Barton Perreira ──────────────────────────────────────────
  mkItem("ms-bp-01", "montures-solaires", "Barton Perreira", "Chevalier",
    "Solaire acétate carré vintage premium",
    2, 1, 168, 560, "Barton Perreira", 21),

  // ── Cutler & Gross ───────────────────────────────────────────
  mkItem("ms-cg-01", "montures-solaires", "Cutler & Gross", "1338",
    "Solaire acétate artisanal London",
    2, 1, 178, 595, "Cutler & Gross", 28),

  // ── Cazal ────────────────────────────────────────────────────
  mkItem("ms-caz-01", "montures-solaires", "Cazal", "607/3",
    "Solaire acétate vintage iconique 80s",
    2, 1, 148, 495, "Cazal Eyewear", 21),
  mkItem("ms-caz-02", "montures-solaires", "Cazal", "616",
    "Solaire acier geometrique héritage",
    2, 1, 155, 518, "Cazal Eyewear", 21),

  // ── Silhouette (solaires) ─────────────────────────────────────
  mkItem("ms-sil-01", "montures-solaires", "Silhouette", "Accent Shades",
    "Solaire rimless titane ultra-légère",
    3, 1, 145, 485, "Silhouette International", 21),
  mkItem("ms-sil-02", "montures-solaires", "Silhouette", "Urban Sun",
    "Solaire titane/acétate mixte lifestyle",
    3, 1, 138, 460, "Silhouette International", 21),

  // ── Adidas ───────────────────────────────────────────────────
  mkItem("ms-adi-01", "montures-solaires", "Adidas", "SP0069",
    "Solaire sport 3 bandes running",
    5, 2, 55, 185, "Silhouette International", 14),
  mkItem("ms-adi-02", "montures-solaires", "Adidas", "SP0040",
    "Solaire sport lifestyle Adidas",
    5, 2, 52, 174, "Silhouette International", 14),

  // ── Nike Vision ──────────────────────────────────────────────
  mkItem("ms-nik-01", "montures-solaires", "Nike Vision", "EV1059",
    "Solaire sport shield running Nike",
    5, 2, 62, 206, "Marchon Eyewear", 14),
  mkItem("ms-nik-02", "montures-solaires", "Nike Vision", "DZ7358",
    "Solaire sport wraparound lifestyle",
    5, 2, 58, 194, "Marchon Eyewear", 14),

  // ── Under Armour ─────────────────────────────────────────────
  mkItem("ms-ua-01", "montures-solaires", "Under Armour", "UA 0003/G/S",
    "Solaire sport UA wrap performance",
    5, 2, 52, 174, "Safilo Group", 14),

  // ── Thierry Lasry ────────────────────────────────────────────
  mkItem("ms-tl-01", "montures-solaires", "Thierry Lasry", "Spectory",
    "Solaire acétate oversize créateur Paris",
    2, 1, 198, 660, "Thierry Lasry", 28),
  mkItem("ms-tl-02", "montures-solaires", "Thierry Lasry", "Filtery",
    "Solaire acétate rectangulaire art Paris",
    2, 1, 192, 640, "Thierry Lasry", 28),

  // ── Dior (solaires complémentaires) ──────────────────────────
  mkItem("ms-dio-02", "montures-solaires", "Dior", "DiorSignature S2U",
    "Solaire acier CD rond iconique",
    2, 1, 172, 575, "LVMH Fashion Group", 28),
  mkItem("ms-dio-03", "montures-solaires", "Dior", "DiorBlackSuit S4U",
    "Solaire acétate club sport Dior",
    2, 1, 168, 560, "LVMH Fashion Group", 28),

  // ── Chloé (complémentaires) ──────────────────────────────────
  mkItem("ms-chl-03", "montures-solaires", "Chloé", "CH0163S",
    "Solaire acier chain-link logo",
    3, 1, 122, 408, "Safilo Group", 21),
  mkItem("ms-chl-04", "montures-solaires", "Chloé", "CH0195S",
    "Solaire acétate butterfly Chloé",
    3, 1, 118, 395, "Safilo Group", 21),

  // ── Salvatore Ferragamo ───────────────────────────────────────
  mkItem("ms-sf-01", "montures-solaires", "Salvatore Ferragamo", "SF1015S",
    "Solaire acétate Gancini femme",
    3, 1, 128, 428, "Marchon Eyewear", 21),
  mkItem("ms-sf-02", "montures-solaires", "Salvatore Ferragamo", "SF294S",
    "Solaire acier pilote homme",
    3, 1, 118, 395, "Marchon Eyewear", 21),

  // ── Smith Optics ─────────────────────────────────────────────
  mkItem("ms-smi-01", "montures-solaires", "Smith", "Lowdown 2",
    "Solaire acétate sport-lifestyle",
    5, 2, 68, 228, "Safilo Group", 14),
  mkItem("ms-smi-02", "montures-solaires", "Smith", "ChromaPop Contraband",
    "Solaire sport polarisant ChromaPop",
    4, 2, 82, 274, "Safilo Group", 14),
  mkItem("ms-smi-03", "montures-solaires", "Smith", "Attack MAG",
    "Solaire vélo haut de gamme interchangeable",
    3, 2, 115, 385, "Safilo Group", 14),

  // ── Converse ─────────────────────────────────────────────────
  mkItem("ms-con-01", "montures-solaires", "Converse", "CV507S",
    "Solaire acétate Chuck Taylor iconique",
    6, 2, 35, 117, "Safilo Group", 14),

  // ── David Beckham ─────────────────────────────────────────────
  mkItem("ms-db-01", "montures-solaires", "David Beckham", "DB 7108/S",
    "Solaire acétate DB lifestyle luxe",
    4, 2, 65, 218, "Safilo Group", 14),

  // ── Police ── complémentaires solaires ───────────────────────
  mkItem("ms-pol2-03", "montures-solaires", "Police", "SPLL48",
    "Solaire shield sport Police Eyewear",
    5, 2, 48, 160, "De Rigo Group", 14),

  // ── Sting ────────────────────────────────────────────────────
  mkItem("ms-sti-01", "montures-solaires", "Sting", "SST471",
    "Solaire acétate italien tendance",
    4, 2, 50, 168, "De Rigo Group", 14),

  // ── Swarovski ────────────────────────────────────────────────
  mkItem("ms-swa-01", "montures-solaires", "Swarovski", "SK7006",
    "Solaire cristaux Swarovski femme",
    3, 1, 88, 295, "Marcolin Group", 14),

  // ── Anne & Valentin ──────────────────────────────────────────
  mkItem("ms-av-01", "montures-solaires", "Anne & Valentin", "Corail",
    "Solaire acétate créateur français",
    2, 1, 122, 408, "Anne & Valentin", 21),

  // ── Moscot — complémentaires ─────────────────────────────────
  mkItem("ms-mos-03", "montures-solaires", "Moscot", "Originals Gavotte Sun",
    "Solaire acétate aviateur New York",
    3, 1, 148, 495, "Moscot", 21),

  // ── Barton Perreira — complémentaires ────────────────────────
  mkItem("ms-bp-02", "montures-solaires", "Barton Perreira", "Domino",
    "Solaire acétate carré oversize",
    2, 1, 172, 575, "Barton Perreira", 21),

  // ── Longines ─────────────────────────────────────────────────
  mkItem("ms-lng-01", "montures-solaires", "Longines", "LG0023-H",
    "Solaire acier premium horlogerie",
    3, 1, 95, 318, "Marchon Eyewear", 21),

  // ── Hackett — solaires ────────────────────────────────────────
  mkItem("ms-hac-02", "montures-solaires", "Hackett London", "HEB255",
    "Solaire acier pilot premium British",
    3, 1, 82, 274, "Marcolin Group", 14),

  // ── Lacoste — complémentaires ─────────────────────────────────
  mkItem("ms-lac-03", "montures-solaires", "Lacoste", "L921S",
    "Solaire ronde acétate crop",
    5, 2, 52, 174, "Safilo Group", 14),
  mkItem("ms-lac-04", "montures-solaires", "Lacoste", "L6006S",
    "Solaire acier pilote homme sport",
    5, 2, 50, 168, "Safilo Group", 14),

  // ── Kenzo — complémentaires ───────────────────────────────────
  mkItem("ms-kenz-02", "montures-solaires", "Kenzo", "KZ40023U",
    "Solaire acétate graphique Kenzo",
    4, 2, 80, 268, "Kering Eyewear", 21),

  // ── Givenchy — complémentaires ────────────────────────────────
  mkItem("ms-giv-02", "montures-solaires", "Givenchy", "GV40055U",
    "Solaire acétate Givenchy Paris pilote",
    3, 1, 142, 475, "Kering Eyewear", 28),

  // ── Tiffany — solaires ────────────────────────────────────────
  mkItem("ms-tif-02", "montures-solaires", "Tiffany & Co.", "TF4210",
    "Solaire acétate Tiffany T cat-eye",
    3, 1, 142, 475, "Luxottica Group", 21),

  // ── Coach — solaires ──────────────────────────────────────────
  mkItem("ms-coa-01", "montures-solaires", "Coach", "HC8348",
    "Solaire acétate cheval signature",
    4, 2, 72, 240, "Luxottica Group", 14),

  // ── Ralph Lauren — complémentaires ───────────────────────────
  mkItem("ms-rl-03", "montures-solaires", "Ralph Lauren", "RL7074",
    "Solaire acétate heritage Polo Bar",
    4, 2, 72, 240, "Luxottica Group", 14),

  // ── Adidas — complémentaires ──────────────────────────────────
  mkItem("ms-adi-03", "montures-solaires", "Adidas", "SP0088",
    "Solaire shield sport Adidas",
    5, 2, 58, 194, "Silhouette International", 14),

  // ── Dolce & Gabbana (Luxottica Group) ────────────────────────
  mkItem("ms-dg-01", "montures-solaires", "Dolce & Gabbana", "DG4373",
    "Solaire acétate luxe DG sicilienne",
    2, 1, 152, 508, "Luxottica Group", 21),
  mkItem("ms-dg-02", "montures-solaires", "Dolce & Gabbana", "DG6157",
    "Solaire acier DG doré surdimensionné",
    2, 1, 158, 528, "Luxottica Group", 21),

  // ── Brooks Brothers (Luxottica Group) ────────────────────────
  mkItem("ms-bb-01", "montures-solaires", "Brooks Brothers", "BB7056",
    "Solaire acétate preppy américain",
    3, 1, 95, 318, "Luxottica Group", 21),

  // ── Dsquared2 (Marcolin Group) ────────────────────────────────
  mkItem("ms-dsq-01", "montures-solaires", "Dsquared2", "D2 0063/S",
    "Solaire acétate rock-luxe oversized",
    3, 1, 118, 395, "Marcolin Group", 21),
  mkItem("ms-dsq-02", "montures-solaires", "Dsquared2", "D2 0052/S",
    "Solaire acier homme lifestyle",
    3, 1, 112, 373, "Marcolin Group", 21),

  // ── Roberto Cavalli (Marcolin Group) ─────────────────────────
  mkItem("ms-rc-01", "montures-solaires", "Roberto Cavalli", "RC1138",
    "Solaire acétate animal print femme",
    2, 1, 118, 395, "Marcolin Group", 21),

  // ── Max Mara (Marcolin Group) ─────────────────────────────────
  mkItem("ms-mm-01", "montures-solaires", "Max Mara", "MM0065S",
    "Solaire acétate cat-eye Max Mara",
    3, 1, 125, 418, "Marcolin Group", 21),

  // ── Moncler (Marcolin Group) ──────────────────────────────────
  mkItem("ms-mon-01", "montures-solaires", "Moncler", "ML0248",
    "Solaire sport alpin Moncler premium",
    2, 1, 148, 495, "Marcolin Group", 21),
  mkItem("ms-mon-02", "montures-solaires", "Moncler", "ML0279",
    "Solaire acétate oversize lifestyle",
    2, 1, 152, 508, "Marcolin Group", 21),

  // ── Diesel (Marcolin Group) ───────────────────────────────────
  mkItem("ms-die-01", "montures-solaires", "Diesel", "DL0316",
    "Solaire acétate urban denim Diesel",
    4, 2, 85, 285, "Marcolin Group", 14),

  // ── Missoni (Marcolin Group) ──────────────────────────────────
  mkItem("ms-mis-01", "montures-solaires", "Missoni", "MIS 0138/S",
    "Solaire acétate zigzag femme Missoni",
    2, 1, 115, 385, "Marcolin Group", 21),

  // ── Zegna (Marcolin Group) ────────────────────────────────────
  mkItem("ms-zeg-01", "montures-solaires", "Zegna", "EZ0223",
    "Solaire acier sartoriale Zegna",
    2, 1, 168, 560, "Marcolin Group", 21),

  // ── Tom Ford complémentaires (Marcolin Group) ─────────────────
  mkItem("ms-tf-05", "montures-solaires", "Tom Ford", "FT1004 Buckley",
    "Solaire acétate homme rectangulaire",
    3, 1, 122, 408, "Marcolin Group", 21),

  // ── Karl Lagerfeld (Marchon Eyewear) ─────────────────────────
  mkItem("ms-kl-01", "montures-solaires", "Karl Lagerfeld", "KL6098S",
    "Solaire acétate Karl Lagerfeld",
    3, 1, 98, 328, "Marchon Eyewear", 21),

  // ── Columbia Sportswear (Marchon Eyewear) ────────────────────
  mkItem("ms-col-01", "montures-solaires", "Columbia Sportswear", "C536S",
    "Solaire sport outdoor polarisant Columbia",
    4, 2, 55, 185, "Marchon Eyewear", 14),

  // ── Dragon Alliance (Marchon Eyewear) ────────────────────────
  mkItem("ms-dra-01", "montures-solaires", "Dragon Alliance", "DR7008",
    "Solaire sport lifestyle DR shield",
    4, 2, 62, 206, "Marchon Eyewear", 14),
  mkItem("ms-dra-02", "montures-solaires", "Dragon Alliance", "DR2043",
    "Solaire acétate lifestyle snowboard",
    4, 2, 58, 194, "Marchon Eyewear", 14),

  // ── ETRO (Marchon Eyewear) ────────────────────────────────────
  mkItem("ms-etr-01", "montures-solaires", "ETRO", "ET0019S",
    "Solaire acétate paisley oversize ETRO",
    2, 1, 135, 450, "Marchon Eyewear", 21),

  // ── Burberry (Marchon Eyewear) ────────────────────────────────
  mkItem("ms-bur-04", "montures-solaires", "Burberry", "BE4419",
    "Solaire acétate check collection 2024",
    4, 2, 95, 318, "Marchon Eyewear", 14),
  mkItem("ms-bur-05", "montures-solaires", "Burberry", "BE3147",
    "Solaire métal pilote homme",
    4, 2, 88, 295, "Marchon Eyewear", 14),

  // ── Kate Spade (Safilo Group) ─────────────────────────────────
  mkItem("ms-ks-01", "montures-solaires", "Kate Spade", "KS Amara/S",
    "Solaire acétate cat-eye Kate Spade",
    4, 2, 72, 240, "Safilo Group", 14),

  // ── Oxydo (Safilo Group) ──────────────────────────────────────
  mkItem("ms-oxy-01", "montures-solaires", "Oxydo", "OX/S007S",
    "Solaire avantgarde oversize Oxydo",
    3, 2, 65, 218, "Safilo Group", 14),

  // ── Louis Vuitton (LVMH Fashion Group) ───────────────────────
  mkItem("ms-lv-01", "montures-solaires", "Louis Vuitton", "Z1584W",
    "Solaire acétate monogramme LV",
    1, 1, 395, 1320, "LVMH Fashion Group", 28),

  // ── Loewe (LVMH Fashion Group) ────────────────────────────────
  mkItem("ms-loe-01", "montures-solaires", "Loewe", "LW40046U",
    "Solaire acétate anagramme oversize",
    2, 1, 192, 640, "LVMH Fashion Group", 28),

  // ── Fred (LVMH Fashion Group) ─────────────────────────────────
  mkItem("ms-fred-01", "montures-solaires", "Fred", "FG50017U",
    "Solaire acier Force 10 Fred Paris",
    2, 1, 168, 560, "LVMH Fashion Group", 28),

  // ── Serengeti (Bollé Brands) ──────────────────────────────────
  mkItem("ms-sere-01", "montures-solaires", "Serengeti", "Nunzio",
    "Solaire polarisant photochromique drivers",
    4, 2, 72, 240, "Bollé Brands", 14),
  mkItem("ms-sere-02", "montures-solaires", "Serengeti", "Chandler",
    "Solaire polarisant lifestyle Serengeti",
    4, 2, 68, 228, "Bollé Brands", 14),

  // ── Neubau Eyewear (Silhouette International) ─────────────────
  mkItem("ms-neu-01", "montures-solaires", "Neubau Eyewear", "N60/70 Tom",
    "Solaire biopolymère écologique photochromique",
    3, 1, 95, 318, "Silhouette International", 21),

  // ── BMW (Marchon Eyewear) ─────────────────────────────────────
  mkItem("ms-bmw-01", "montures-solaires", "BMW", "BW0040",
    "Solaire acier sport automotive BMW",
    2, 1, 132, 440, "Marchon Eyewear", 21),

  // ── Kenneth Cole (Marchon Eyewear) ───────────────────────────
  mkItem("ms-kc-01", "montures-solaires", "Kenneth Cole", "KC7245S",
    "Solaire acier new-yorkaise lifestyle",
    4, 2, 60, 200, "Marchon Eyewear", 14),

  // ── Skaga (Marchon Eyewear) ───────────────────────────────────
  mkItem("ms-ska-01", "montures-solaires", "Skaga", "SK2179S",
    "Solaire acétate Nordic collection",
    2, 1, 98, 328, "Marchon Eyewear", 21),

  // ── Carolina Herrera Eyewear (De Rigo Group) ──────────────────
  mkItem("ms-carher-01", "montures-solaires", "Carolina Herrera", "VHE895S",
    "Solaire acétate papillon Carolina Herrera floral chic",
    3, 1, 82, 273, "De Rigo Group", 14),
  mkItem("ms-carher-02", "montures-solaires", "Carolina Herrera", "VHE817S",
    "Solaire cat-eye large Carolina Herrera Madrid",
    3, 1, 78, 260, "De Rigo Group", 14),
  mkItem("ms-carher-03", "montures-solaires", "Carolina Herrera", "VHE902S",
    "Solaire oversize acétate Carolina Herrera luxe",
    3, 1, 86, 287, "De Rigo Group", 14),

  // ── Escada Eyewear (De Rigo Group) ───────────────────────────
  mkItem("ms-esca-01", "montures-solaires", "Escada", "EL5220S",
    "Solaire oversize féminin Escada collection luxe",
    3, 1, 75, 250, "De Rigo Group", 14),
  mkItem("ms-esca-02", "montures-solaires", "Escada", "EL5231S",
    "Solaire wayfarer acétate Escada signature",
    3, 1, 72, 240, "De Rigo Group", 14),

  // ── Love Moschino (De Rigo Group) ────────────────────────────
  mkItem("ms-lmosc-01", "montures-solaires", "Love Moschino", "ML583S",
    "Solaire cat-eye Love Moschino hearts signature",
    4, 2, 56, 187, "De Rigo Group", 14),
  mkItem("ms-lmosc-02", "montures-solaires", "Love Moschino", "ML601S",
    "Solaire round Love Moschino doré tendance",
    4, 2, 54, 180, "De Rigo Group", 14),

  // ── Chopard Eyewear (De Rigo Group) ──────────────────────────
  mkItem("ms-chopd-01", "montures-solaires", "Chopard", "SCH316S",
    "Solaire luxe acétate Chopard Happy Sport prestige",
    2, 1, 198, 660, "De Rigo Group", 21),
  mkItem("ms-chopd-02", "montures-solaires", "Chopard", "SCH283S",
    "Solaire métal Chopard Alpine Eagle titane",
    2, 1, 205, 685, "De Rigo Group", 21),

  // ── Lightec by Morel (Morel) ──────────────────────────────────
  mkItem("ms-ltc-01", "montures-solaires", "Lightec", "30281L",
    "Solaire titane ultra-léger Lightec by Morel",
    2, 1, 95, 318, "Morel", 21),
  mkItem("ms-ltc-02", "montures-solaires", "Lightec", "30295L",
    "Solaire cerclé métal Lightec Morel polarisé",
    2, 1, 98, 328, "Morel", 21),

  // ── Andy Wolf (Andy Wolf GmbH) ────────────────────────────────
  mkItem("ms-awolf-01", "montures-solaires", "Andy Wolf", "A517S",
    "Solaire acétate artisanal Andy Wolf Österreich",
    2, 1, 102, 340, "Andy Wolf GmbH", 21),
  mkItem("ms-awolf-02", "montures-solaires", "Andy Wolf", "A533S",
    "Solaire wayfarer Andy Wolf handmade collection",
    2, 1, 108, 360, "Andy Wolf GmbH", 21),
  mkItem("ms-awolf-03", "montures-solaires", "Andy Wolf", "A549S",
    "Solaire oversize acétate Andy Wolf Vienna",
    2, 1, 105, 350, "Andy Wolf GmbH", 21),

  // ── Götti Switzerland ─────────────────────────────────────────
  mkItem("ms-gott-01", "montures-solaires", "Götti", "BALZAC",
    "Solaire acétate suisse Götti Eyewear collection",
    2, 1, 112, 373, "Götti Switzerland", 21),
  mkItem("ms-gott-02", "montures-solaires", "Götti", "BEZEL",
    "Solaire titane Swiss made Götti Pilot épuré",
    2, 1, 118, 393, "Götti Switzerland", 21),

  // ── John Varvatos (Tura Inc.) ─────────────────────────────────
  mkItem("ms-jvar-01", "montures-solaires", "John Varvatos", "V790S",
    "Solaire acier aviateur rock-luxe John Varvatos",
    3, 1, 58, 193, "Tura Inc.", 14),
  mkItem("ms-jvar-02", "montures-solaires", "John Varvatos", "V812S",
    "Solaire acétate John Varvatos Star USA Shield",
    3, 1, 62, 207, "Tura Inc.", 14),

  // ── American Optical — solaires complémentaires ───────────────
  mkItem("ms-ao-03", "montures-solaires", "American Optical", "New Saratoga",
    "Solaire acier AO New Saratoga classique USA",
    3, 1, 75, 250, "American Optical", 21),
  mkItem("ms-ao-04", "montures-solaires", "American Optical", "Sportsman",
    "Solaire AO Sportsman vintage aviateur américain",
    3, 1, 78, 260, "American Optical", 21),
  mkItem("ms-ao-05", "montures-solaires", "American Optical", "Eyejam",
    "Solaire wrap sport AO Eyejam collection",
    3, 1, 68, 227, "American Optical", 21),

  // ── Masunaga solaires ─────────────────────────────────────────
  mkItem("ms-mas-01", "montures-solaires", "Masunaga", "GMS-811S",
    "Solaire métal japonais artisanal Masunaga",
    2, 1, 182, 607, "Masunaga Optical", 28),
  mkItem("ms-mas-02", "montures-solaires", "Masunaga", "GMS-848S",
    "Solaire acétate premium Masunaga optical Japan",
    2, 1, 195, 650, "Masunaga Optical", 28),

  // ── ProDesign Denmark — solaires ──────────────────────────────
  mkItem("ms-pro-01", "montures-solaires", "ProDesign", "Niels",
    "Solaire acétate danois ProDesign Niels oversized",
    3, 1, 95, 318, "ProDesign Denmark", 21),
  mkItem("ms-pro-02", "montures-solaires", "ProDesign", "4842S",
    "Solaire métal ProDesign Denmark épuré unisex",
    3, 1, 88, 293, "ProDesign Denmark", 21),

  // ── Randolph Engineering solaires ────────────────────────────
  mkItem("ms-rand-01", "montures-solaires", "Randolph Engineering", "Aviator",
    "Solaire aviateur militaire Randolph Engineering USA",
    3, 1, 112, 373, "Randolph USA", 21),
  mkItem("ms-rand-02", "montures-solaires", "Randolph Engineering", "Concorde",
    "Solaire Randolph Engineering Concorde titanium",
    3, 1, 118, 393, "Randolph USA", 21),
  mkItem("ms-rand-03", "montures-solaires", "Randolph Engineering", "Thaden",
    "Solaire ronde Randolph Engineering Thaden vintage",
    3, 1, 105, 350, "Randolph USA", 21),

  // ── Stepper Eyewear solaires ──────────────────────────────────
  mkItem("ms-step-01", "montures-solaires", "Stepper", "SI-50136S",
    "Solaire sport wrap Stepper masculin",
    4, 2, 52, 173, "Stepper Eyewear", 14),
  mkItem("ms-step-02", "montures-solaires", "Stepper", "SI-50150S",
    "Solaire pilot acier Stepper sport outdoor",
    4, 2, 55, 184, "Stepper Eyewear", 14),

  // ── Face à Face solaires ──────────────────────────────────────
  mkItem("ms-faf-01", "montures-solaires", "Face à Face", "CHARLY",
    "Solaire acétate créateur Face à Face CHARLY Sun",
    3, 1, 128, 427, "Face à Face", 21),
  mkItem("ms-faf-02", "montures-solaires", "Face à Face", "SOTO",
    "Solaire métal exclusif Face à Face SOTO Paris",
    3, 1, 122, 407, "Face à Face", 21),

  // ── Anne & Valentin solaires ──────────────────────────────────
  mkItem("ms-anv-01", "montures-solaires", "Anne & Valentin", "DIONE",
    "Solaire acétate Anne & Valentin DIONE sun",
    3, 1, 142, 473, "Anne & Valentin", 21),
  mkItem("ms-anv-02", "montures-solaires", "Anne & Valentin", "AGIO",
    "Solaire métal-acétate Anne & Valentin AGIO",
    3, 1, 148, 493, "Anne & Valentin", 21),

  // ── Gold & Wood solaires ──────────────────────────────────────
  mkItem("ms-gw-01", "montures-solaires", "Gold & Wood", "TS10",
    "Solaire bois précieux Gold & Wood TS10 collection",
    1, 1, 295, 985, "Gold & Wood", 28),
  mkItem("ms-gw-02", "montures-solaires", "Gold & Wood", "08.6",
    "Solaire acétate écaille Gold & Wood 08.6 prestige",
    1, 1, 315, 1050, "Gold & Wood", 28),

  // ── Cartier (Richemont Group) solaires ───────────────────────
  mkItem("ms-cart-01", "montures-solaires", "Cartier", "CT0087S",
    "Solaire acétate Cartier Panthere signature prestige",
    1, 1, 405, 1350, "Richemont Group", 28),
  mkItem("ms-cart-02", "montures-solaires", "Cartier", "CT0040S",
    "Solaire métal Cartier Santos-Dumont aviateur",
    1, 1, 425, 1415, "Richemont Group", 28),
  mkItem("ms-cart-03", "montures-solaires", "Cartier", "CT0012RS",
    "Solaire acétate Cartier Première de Cartier",
    1, 1, 415, 1380, "Richemont Group", 28),

  // ── Mont Blanc (Marcolin Group) solaires ─────────────────────
  mkItem("ms-mb-01", "montures-solaires", "Mont Blanc", "MB0104S",
    "Solaire acétate Mont Blanc Meisterstück luxe",
    2, 1, 148, 493, "Marcolin Group", 21),
  mkItem("ms-mb-02", "montures-solaires", "Mont Blanc", "MB0188S",
    "Solaire métal Mont Blanc Legend sport",
    2, 1, 155, 517, "Marcolin Group", 21),

  // ── Boucheron (Kering Eyewear) solaires ──────────────────────
  mkItem("ms-bou-01", "montures-solaires", "Boucheron", "BC0073S",
    "Solaire Boucheron Serpent Bohème collection",
    1, 1, 292, 973, "Kering Eyewear", 21),

  // ── Alexander McQueen (Kering Eyewear) solaires ───────────────
  mkItem("ms-amq-01", "montures-solaires", "Alexander McQueen", "MQ0208S",
    "Solaire shield Alexander McQueen Punk",
    2, 1, 168, 560, "Kering Eyewear", 21),
  mkItem("ms-amq-02", "montures-solaires", "Alexander McQueen", "MQ0336S",
    "Solaire acétate oversize Alexander McQueen",
    2, 1, 175, 583, "Kering Eyewear", 21),

  // ── Woow Eyewear solaires ─────────────────────────────────────
  mkItem("ms-woow-01", "montures-solaires", "Woow", "Too Much",
    "Solaire acétate fun Woow Eyewear Too Much",
    3, 1, 72, 240, "Woow Eyewear SAS", 14),
  mkItem("ms-woow-02", "montures-solaires", "Woow", "Smile",
    "Solaire coloré Woow Eyewear Smile édition",
    3, 1, 68, 227, "Woow Eyewear SAS", 14),

  // ── Xavier Garcia solaires ────────────────────────────────────
  mkItem("ms-xg-01", "montures-solaires", "Xavier Garcia", "CAMY SUN",
    "Solaire acétate Xavier Garcia Camy Sun oversized",
    2, 1, 108, 360, "Xavier Garcia", 21),
  mkItem("ms-xg-02", "montures-solaires", "Xavier Garcia", "BELFOR SUN",
    "Solaire géométrique Xavier Garcia Belfor Sun",
    2, 1, 112, 373, "Xavier Garcia", 21),

  // ── Cazal — solaires complémentaires ─────────────────────────
  mkItem("ms-caz-03", "montures-solaires", "Cazal", "9086",
    "Solaire acétate Cazal Legends oversize fashion",
    2, 1, 148, 493, "Cazal Eyewear", 21),
  mkItem("ms-caz-04", "montures-solaires", "Cazal", "607/2",
    "Solaire métallo Cazal 607 iconic collection",
    2, 1, 152, 507, "Cazal Eyewear", 21),
  mkItem("ms-caz-05", "montures-solaires", "Cazal", "8504",
    "Solaire acétate Cazal Caz 8504 prestige",
    2, 1, 155, 517, "Cazal Eyewear", 21),

  // ── Moscot — solaires complémentaires ────────────────────────
  mkItem("ms-mos-04", "montures-solaires", "Moscot", "Billik Sun",
    "Solaire acétate Moscot Billik Sun NYC round",
    3, 1, 122, 407, "Moscot", 21),
  mkItem("ms-mos-05", "montures-solaires", "Moscot", "Spector Sun",
    "Solaire Moscot Spector Sun downtown acetate",
    3, 1, 125, 417, "Moscot", 21),

  // ── Thierry Lasry — solaires complémentaires ─────────────────
  mkItem("ms-tl-03", "montures-solaires", "Thierry Lasry", "Saucy Sun",
    "Solaire acétate épais Thierry Lasry Saucy Paris",
    2, 1, 198, 660, "Thierry Lasry", 21),
  mkItem("ms-tl-04", "montures-solaires", "Thierry Lasry", "Fancy",
    "Solaire cat-eye Thierry Lasry Fancy prestige",
    2, 1, 205, 683, "Thierry Lasry", 21),
  mkItem("ms-tl-05", "montures-solaires", "Thierry Lasry", "Polynesy",
    "Solaire oversize Thierry Lasry Polynesy sun",
    2, 1, 212, 707, "Thierry Lasry", 21),

  // ── Mykita — solaires ─────────────────────────────────────────
  mkItem("ms-myk-01", "montures-solaires", "Mykita", "MMRAW009",
    "Solaire métal plié Mykita MMRAW009 Berlin",
    2, 1, 192, 640, "Mykita GmbH", 21),
  mkItem("ms-myk-02", "montures-solaires", "Mykita", "MMCRAFT001",
    "Solaire acétate Mykita MMCRAFT collection",
    2, 1, 198, 660, "Mykita GmbH", 21),
  mkItem("ms-myk-03", "montures-solaires", "Mykita", "Mykita + Maison Margiela",
    "Solaire collaboration Mykita × Maison Margiela",
    2, 1, 225, 750, "Mykita GmbH", 21),

  // ── Lindberg — solaires ───────────────────────────────────────
  mkItem("ms-lin-01", "montures-solaires", "Lindberg", "Sun Titanium 8406",
    "Solaire titane Lindberg Sun Titanium cerclé",
    2, 1, 248, 827, "Lindberg A/S", 28),
  mkItem("ms-lin-02", "montures-solaires", "Lindberg", "Strip Sun 9612",
    "Solaire strip Lindberg rimless solaire",
    2, 1, 262, 873, "Lindberg A/S", 28),
  mkItem("ms-lin-03", "montures-solaires", "Lindberg", "Air Sun 9703",
    "Solaire Air Titanium polarisé Lindberg",
    2, 1, 255, 850, "Lindberg A/S", 28),

  // ── Jaguar — solaires ─────────────────────────────────────────
  mkItem("ms-jag-01", "montures-solaires", "Jaguar", "37190S",
    "Solaire sport Jaguar Eyewear polarisé",
    4, 2, 58, 193, "Jaguar Eyewear", 14),
  mkItem("ms-jag-02", "montures-solaires", "Jaguar", "37234S",
    "Solaire acétate lifestyle Jaguar Eyewear",
    4, 2, 62, 207, "Jaguar Eyewear", 14),

  // ── Pierre Cardin — solaires ──────────────────────────────────
  mkItem("ms-pc-01", "montures-solaires", "Pierre Cardin", "PC8452S",
    "Solaire métal homme Pierre Cardin chic parisien",
    4, 2, 38, 127, "Pierre Cardin SAS", 14),
  mkItem("ms-pc-02", "montures-solaires", "Pierre Cardin", "PC8515S",
    "Solaire cat-eye Pierre Cardin signature",
    4, 2, 35, 117, "Pierre Cardin SAS", 14),

  // ── Porsche Design — solaires complémentaires ─────────────────
  mkItem("ms-pd-03", "montures-solaires", "Porsche Design", "P8928",
    "Solaire titane Porsche Design P8928 sport",
    2, 1, 198, 660, "Porsche Design", 21),
  mkItem("ms-pd-04", "montures-solaires", "Porsche Design", "P8712",
    "Solaire acétate Porsche Design P8712 lifestyle",
    2, 1, 188, 627, "Porsche Design", 21),

  // ── Starck Biotech Paris — solaires ──────────────────────────
  mkItem("ms-sta-01", "montures-solaires", "Starck Biotech Paris", "SH5027",
    "Solaire bioplastique Starck Sun collection",
    2, 1, 132, 440, "Starck Biotech Paris", 21),
  mkItem("ms-sta-02", "montures-solaires", "Starck Biotech Paris", "SH5038",
    "Solaire acétate bio Philippe Starck Paris",
    2, 1, 128, 427, "Starck Biotech Paris", 21),

  // ── Silhouette — solaires complémentaires ────────────────────
  mkItem("ms-sil-03", "montures-solaires", "Silhouette", "Explorer Sun",
    "Solaire monture légère Silhouette Explorer",
    3, 1, 145, 483, "Silhouette International", 21),
  mkItem("ms-sil-04", "montures-solaires", "Silhouette", "Momentum",
    "Solaire Silhouette Momentum cerclé sport",
    3, 1, 138, 460, "Silhouette International", 21),
  mkItem("ms-sil-05", "montures-solaires", "Silhouette", "TMA-5 Sun",
    "Solaire Silhouette TMA-5 Iconic design sun",
    2, 1, 158, 527, "Silhouette International", 21),

  // ── Adidas — solaires complémentaires ────────────────────────
  mkItem("ms-adi-04", "montures-solaires", "Adidas", "SP0099",
    "Solaire sport shield Adidas SP0099 wrap",
    4, 2, 55, 184, "Silhouette International", 14),
  mkItem("ms-adi-05", "montures-solaires", "Adidas", "SP0068",
    "Solaire running Adidas SP0068 performance",
    4, 2, 52, 173, "Silhouette International", 14),

  // ── Serengeti — solaires complémentaires ─────────────────────
  mkItem("ms-sere-03", "montures-solaires", "Serengeti", "Lario",
    "Solaire polarisé photochromique Serengeti Lario",
    3, 1, 82, 273, "Bollé Brands", 14),
  mkItem("ms-sere-04", "montures-solaires", "Serengeti", "Conversano",
    "Solaire lifestyle Serengeti Conversano",
    3, 1, 86, 287, "Bollé Brands", 14),
  mkItem("ms-sere-05", "montures-solaires", "Serengeti", "Shelton",
    "Solaire photochromique Serengeti Shelton pilot",
    3, 1, 79, 263, "Bollé Brands", 14),

  // ── Etnia Barcelona — solaires complémentaires ───────────────
  mkItem("ms-etnia-03", "montures-solaires", "Etnia Barcelona", "Las Vegas",
    "Solaire acétate flamboyant Etnia Barcelona",
    4, 2, 80, 267, "Etnia Barcelona", 21),
  mkItem("ms-etnia-04", "montures-solaires", "Etnia Barcelona", "Mumbai",
    "Solaire oversize Etnia Barcelona Mumbai Sun",
    4, 2, 84, 280, "Etnia Barcelona", 21),
  mkItem("ms-etnia-05", "montures-solaires", "Etnia Barcelona", "Beijing",
    "Solaire acétate Etnia Barcelona Beijing coloré",
    4, 2, 78, 260, "Etnia Barcelona", 21),

  // ── Neubau Eyewear — solaires complémentaires ────────────────
  mkItem("ms-neu-02", "montures-solaires", "Neubau Eyewear", "N65/70 Franz",
    "Solaire acétate Neubau Eyewear Franz Austria",
    3, 1, 82, 273, "Silhouette International", 21),
  mkItem("ms-neu-03", "montures-solaires", "Neubau Eyewear", "N72/00 Timm",
    "Solaire métal Neubau Eyewear Timm écologique",
    3, 1, 78, 260, "Silhouette International", 21),

  // ── Humphrey's — solaires ─────────────────────────────────────
  mkItem("ms-hum-01", "montures-solaires", "Humphrey's", "588004S",
    "Solaire acétate Humphrey's by Silhouette femme",
    4, 2, 38, 127, "Humphrey's by Silhouette", 14),
  mkItem("ms-hum-02", "montures-solaires", "Humphrey's", "588016S",
    "Solaire lifestyle Humphrey's cat-eye",
    4, 2, 36, 120, "Humphrey's by Silhouette", 14),

  // ── Maui Jim — complémentaires ───────────────────────────────
  mkItem("ms-mj-06", "montures-solaires", "Maui Jim", "World Cup",
    "Solaire Maui Jim World Cup sport polarisé PolarizedPlus2",
    4, 2, 115, 383, "Maui Jim Inc.", 14),
  mkItem("ms-mj-07", "montures-solaires", "Maui Jim", "Kanaha",
    "Solaire Maui Jim Kanaha acétate lifestyle",
    4, 2, 128, 427, "Maui Jim Inc.", 14),
  mkItem("ms-mj-08", "montures-solaires", "Maui Jim", "Atoll",
    "Solaire Maui Jim Atoll polarisé round",
    4, 2, 108, 360, "Maui Jim Inc.", 14),
  mkItem("ms-mj-09", "montures-solaires", "Maui Jim", "Peahi Sunset",
    "Solaire édition limitée Maui Jim Peahi Sunset",
    3, 1, 135, 450, "Maui Jim Inc.", 14),

  // ── Bollé — solaires complémentaires ─────────────────────────
  mkItem("ms-bol-06", "montures-solaires", "Bollé", "Astrild",
    "Solaire sport cyclisme Bollé Astrild",
    4, 2, 58, 193, "Bollé Brands", 14),
  mkItem("ms-bol-07", "montures-solaires", "Bollé", "Holman",
    "Solaire lifestyle Bollé Holman homme",
    4, 2, 55, 184, "Bollé Brands", 14),
  mkItem("ms-bol-08", "montures-solaires", "Bollé", "Ipswich",
    "Solaire round Bollé Ipswich polarisé",
    4, 2, 62, 207, "Bollé Brands", 14),

  // ── Lafont Paris — solaires ───────────────────────────────────
  mkItem("ms-laf-01", "montures-solaires", "Lafont", "Flore Sun",
    "Solaire acétate créateur Lafont Flore Sun Paris",
    3, 1, 88, 293, "Lafont Paris", 21),
  mkItem("ms-laf-02", "montures-solaires", "Lafont", "Saveur Sun",
    "Solaire acétate coloré Lafont Saveur Paris",
    3, 1, 85, 283, "Lafont Paris", 21),
  mkItem("ms-laf-03", "montures-solaires", "Lafont", "Riviera Sun",
    "Solaire Lafont Riviera Sun ronde French chic",
    3, 1, 90, 300, "Lafont Paris", 21),

  // ── Theo eyewear — solaires ───────────────────────────────────
  mkItem("ms-the-01", "montures-solaires", "Theo", "Stockholm Sun",
    "Solaire acétate belge Theo Stockholm Sun",
    2, 1, 155, 517, "Theo eyewear", 21),
  mkItem("ms-the-02", "montures-solaires", "Theo", "Ziggy Sun",
    "Solaire Theo Ziggy Sun collection Belgique",
    2, 1, 148, 493, "Theo eyewear", 21),
  mkItem("ms-the-03", "montures-solaires", "Theo", "Piton Sun",
    "Solaire géométrique Theo Piton Sun design",
    2, 1, 158, 527, "Theo eyewear", 21),

  // ── Randolph Engineering — complémentaires solaires ───────────
  mkItem("ms-rand-04", "montures-solaires", "Randolph Engineering", "Sportsman XL",
    "Solaire XL Randolph Engineering Sportsman USA",
    3, 1, 108, 360, "Randolph USA", 21),
  mkItem("ms-rand-05", "montures-solaires", "Randolph Engineering", "Intruder",
    "Solaire tactical Randolph Engineering Intruder",
    3, 1, 115, 383, "Randolph USA", 21),
];

/* ════════════════════════════════════════════════════════════════
   LENTILLES SOUPLES
   ════════════════════════════════════════════════════════════════ */
const LENTILLES_SOUPLES: StockItem[] = [
  mkItem("ls-al-01", "lentilles-souples", "Alcon", "Dailies Total 1",
    "Journalières silicone-hydrogel water gradient",
    20, 6, 22, 48, "Alcon Laboratories", 7),
  mkItem("ls-al-02", "lentilles-souples", "Alcon", "Air Optix Plus HydraGlyde",
    "Mensuelles silicone-hydrogel confort durable",
    15, 5, 14, 32, "Alcon Laboratories", 7),
  mkItem("ls-jj-01", "lentilles-souples", "Johnson & Johnson", "Acuvue Oasys 1-Day",
    "Journalières Hydraluxe haute performance",
    18, 6, 20, 44, "Johnson & Johnson Vision", 7),
  mkItem("ls-jj-02", "lentilles-souples", "Johnson & Johnson", "Acuvue Moist",
    "Journalières LACREON hydratation",
    20, 6, 12, 26, "Johnson & Johnson Vision", 7),
  mkItem("ls-coo-01", "lentilles-souples", "CooperVision", "Biofinity",
    "Mensuelles Aquaform technologie confort",
    14, 4, 16, 35, "CooperVision Inc.", 7),
  mkItem("ls-coo-02", "lentilles-souples", "CooperVision", "MyDay Daily",
    "Journalières SFM technologie silicone",
    16, 5, 18, 40, "CooperVision Inc.", 7),
  mkItem("ls-bsl-01", "lentilles-souples", "Bausch & Lomb", "ULTRA",
    "Mensuelles MoistureSeal technologie",
    12, 4, 17, 38, "Bausch & Lomb", 7),
  mkItem("ls-bsl-02", "lentilles-souples", "Bausch & Lomb", "Biotrue ONEday",
    "Journalières mimétisme membrane cellulaire",
    14, 4, 13, 28, "Bausch & Lomb", 7),
];

/* ════════════════════════════════════════════════════════════════
   LENTILLES RIGIDES (RPG)
   ════════════════════════════════════════════════════════════════ */
const LENTILLES_RIGIDES: StockItem[] = [
  mkItem("lr-men-01", "lentilles-rigides", "Menicon", "Menisoft Z",
    "RPG fluorosilicone acrylate Dk/t élevé",
    8, 2, 35, 125, "Menicon Co. Ltd", 14),
  mkItem("lr-con-01", "lentilles-rigides", "Contamac", "Boston XO2",
    "RPG Boston XO2 perméabilité maximale",
    6, 2, 42, 145, "Contamac Ltd", 14),
  mkItem("lr-swl-01", "lentilles-rigides", "SwissLens", "Kerasoft IC",
    "RPG kératocône spécialisé",
    4, 1, 68, 220, "SwissLens SA", 21),
];

/* ════════════════════════════════════════════════════════════════
   ACCESSOIRES
   ════════════════════════════════════════════════════════════════ */
const ACCESSOIRES: StockItem[] = [
  mkItem("acc-01", "accessoires", "Novacel", "Spray nettoyant 30ml",
    "Spray nettoyant lunettes 30ml — sans alcool",
    80, 20, 2.80, 9, "Novacel", 7),
  mkItem("acc-02", "accessoires", "Essilor", "Spray Crizal",
    "Spray nettoyant Crizal 30ml — formule optique",
    60, 20, 3.20, 10, "Essilor France", 7),
  mkItem("acc-03", "accessoires", "Zeiss", "Chiffon microfibre 3pk",
    "Chiffon microfibre Zeiss — pack de 3",
    120, 30, 2.50, 8, "Zeiss Vision Care", 7),
  mkItem("acc-04", "accessoires", "Générique", "Étui rigide universel",
    "Étui rigide toutes montures — coloris assortis",
    45, 10, 4.50, 14, "Optique Distribution", 10),
  mkItem("acc-05", "accessoires", "Générique", "Étui souple slim",
    "Étui souple mince — pochette protectrice",
    60, 15, 2.20, 7, "Optique Distribution", 10),
  mkItem("acc-06", "accessoires", "Générique", "Chaîne / cordon sport",
    "Cordon élastique sport anti-chute",
    30, 8, 3.50, 11, "Optique Distribution", 10),
  mkItem("acc-07", "accessoires", "Générique", "Kit réparation lunettes",
    "Mini-kit visserie & tournevis — universel",
    25, 8, 5.50, 17, "Optique Distribution", 10),
  mkItem("acc-08", "accessoires", "Générique", "Solution nettoyage lentilles 100ml",
    "Solution multifonction lentilles de contact",
    50, 12, 3.80, 12, "Optique Distribution", 7),
  mkItem("acc-09", "accessoires", "Générique", "Étui lentilles voyage",
    "Étui lentilles miroir intégré — format voyage",
    40, 10, 2.80, 9, "Optique Distribution", 7),
  mkItem("acc-10", "accessoires", "Novacel", "Spray nettoyant 100ml",
    "Spray nettoyant lunettes 100ml — sans alcool",
    50, 15, 5.50, 17, "Novacel", 7),
  mkItem("acc-11", "accessoires", "Essilor", "Chiffon microfibre Crizal",
    "Chiffon microfibre premium logo Crizal",
    80, 20, 1.80, 6, "Essilor France", 7),
  mkItem("acc-12", "accessoires", "Générique", "Chiffon microfibre 6pk",
    "Pack 6 chiffons microfibre coloris assortis",
    60, 15, 4.20, 13, "Optique Distribution", 7),
  mkItem("acc-13", "accessoires", "Générique", "Plaquettes nasales silicone",
    "Plaquettes de remplacement silicone universelles — 10 paires",
    40, 10, 1.50, 5, "Optique Distribution", 7),
  mkItem("acc-14", "accessoires", "Générique", "Visserie lunettes assortie",
    "Boîte de visserie lunettes 200 pièces",
    15, 4, 8, 25, "Optique Distribution", 14),
  mkItem("acc-15", "accessoires", "Générique", "Tournevis optique 3-en-1",
    "Tournevis plat/cruciforme/Phillips optique",
    20, 5, 4.50, 14, "Optique Distribution", 10),
  mkItem("acc-16", "accessoires", "Générique", "Présentoir 12 montures",
    "Présentoir table acrylique 12 emplacements",
    6, 2, 18, 55, "Optique Distribution", 21),
  mkItem("acc-17", "accessoires", "Bausch & Lomb", "ReNu MPS 360ml",
    "Solution multifonction lentilles 360ml",
    25, 8, 7.50, 24, "Bausch & Lomb", 7),
  mkItem("acc-18", "accessoires", "Alcon", "Opti-Free Replenish 300ml",
    "Solution désinfectante lentilles 300ml",
    22, 6, 8, 26, "Alcon Laboratories", 7),
];

/* ════════════════════════════════════════════════════════════════
   BASE COMPLÈTE
   ════════════════════════════════════════════════════════════════ */
export const STOCK: StockItem[] = [
  ...VERRES_PROGRESSIFS,
  ...VERRES_SIMPLES,
  ...MONTURES_OPTIQUES,
  ...MONTURES_SOLAIRES,
  ...LENTILLES_SOUPLES,
  ...LENTILLES_RIGIDES,
  ...ACCESSOIRES,
];

/* ════════════════════════════════════════════════════════════════
   LABELS & COULEURS
   ════════════════════════════════════════════════════════════════ */
export const CATEGORIE_LABELS: Record<StockCategorie, string> = {
  "verres-progressifs": "Verres progressifs",
  "verres-simples":     "Verres simples",
  "montures-optiques":  "Montures optiques",
  "montures-solaires":  "Montures solaires",
  "lentilles-souples":  "Lentilles souples",
  "lentilles-rigides":  "Lentilles rigides",
  "accessoires":        "Accessoires",
};

export const CATEGORIE_COLORS: Record<StockCategorie, string> = {
  "verres-progressifs": "#2D8CFF",
  "verres-simples":     "#6366F1",
  "montures-optiques":  "#8B5CF6",
  "montures-solaires":  "#F59E0B",
  "lentilles-souples":  "#00C98A",
  "lentilles-rigides":  "#06B6D4",
  "accessoires":        "#EC4899",
};

/* ════════════════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
   ════════════════════════════════════════════════════════════════ */
export function getStockByCategorie(cat: StockCategorie): StockItem[] {
  return STOCK.filter(item => item.categorie === cat && item.actif);
}

export function getStockByMarque(marque: string): StockItem[] {
  const q = marque.toLowerCase();
  return STOCK.filter(item => item.actif && item.marque.toLowerCase().includes(q));
}

export function getAlertesStock(): StockItem[] {
  return STOCK.filter(item => item.actif && item.quantite <= item.quantiteMin);
}

export function getMarquesByCategorie(cat: StockCategorie): string[] {
  const marques = new Set<string>();
  STOCK.filter(item => item.actif && item.categorie === cat)
       .forEach(item => marques.add(item.marque));
  return Array.from(marques).sort();
}

/* ════════════════════════════════════════════════════════════════
   COEFFICIENTS MARCHÉ PAR CATÉGORIE
   ════════════════════════════════════════════════════════════════ */
/** Coefficients marché par catégorie (PA HT × coeff = PV TTC conseillé) */
export const COEFFICIENTS_MARCHE: Record<StockCategorie, { min: number; moy: number; max: number }> = {
  "verres-progressifs": { min: 2.8, moy: 3.2, max: 4.0 },
  "verres-simples":     { min: 2.5, moy: 3.0, max: 3.5 },
  "montures-optiques":  { min: 2.8, moy: 3.2, max: 3.8 },
  "montures-solaires":  { min: 2.5, moy: 3.0, max: 3.5 },
  "lentilles-souples":  { min: 1.8, moy: 2.2, max: 2.8 },
  "lentilles-rigides":  { min: 2.5, moy: 3.0, max: 3.5 },
  "accessoires":        { min: 2.0, moy: 2.8, max: 3.5 },
};

/** Calcule le PV conseillé depuis PA HT et coeff */
export function calcPvConseille(paHT: number, coeff: number): number {
  return parseFloat((paHT * coeff).toFixed(2));
}

/** Calcule le nouveau PRU pondéré après une entrée */
export function calcNouveauPru(
  stockActuel: number, pruActuel: number,
  qteEntree: number, paHtEntree: number
): number {
  const total = stockActuel + qteEntree;
  if (total === 0) return paHtEntree;
  return parseFloat(((stockActuel * pruActuel + qteEntree * paHtEntree) / total).toFixed(4));
}
