/* ═══════════════════════════════════════════════════════════════
   THOR – Base de données appareils auditifs
   Sources : catalogues publics Phonak, Oticon, Starkey, Widex,
             ReSound, Signia, Bernafon (tarifs indicatifs TTC)
   ═══════════════════════════════════════════════════════════════ */

export interface AppareilAuditif {
  id: string;
  marque: string;
  gamme: string;
  modele: string;
  description: string;
  type: "intra" | "contour" | "rite" | "bte";
  classe: 1 | 2;
  niveauTechno: "entrée" | "intermédiaire" | "avancé" | "premium";
  technologies: string[];
  indicationsPertes: ("légère" | "moyenne" | "sévère" | "profonde")[];
  prixUnitaireHT: number;
  prixUnitaireTTC: number;
  priseEnChargeSS: number;
  tauxTVA: 5.5;
  autonomie?: string;
  connectivite?: string;
  garantie: string;
}

/* ════════════════════════════════════════════════════════════════
   PHONAK
   ════════════════════════════════════════════════════════════════ */
const PHONAK_DB: AppareilAuditif[] = [
  {
    id: "pho-lumity-90-ric",
    marque: "Phonak",
    gamme: "Lumity",
    modele: "Phonak Audéo Lumity 90 RIC",
    description: "Audioprothèse RITE premium avec intelligence artificielle AutoSense OS 5.0 — classification automatique de l'environnement en temps réel, streaming direct Bluetooth 2.4GHz depuis smartphones Android/iOS/TV, recharge complète en 3h, autonomie 24h, application myPhonak, réduction bruit de fond −7dB SNR, étanchéité IP68.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["AutoSense OS 5.0", "Bluetooth 2.4GHz", "IA embarquée", "Rechargeable", "IP68"],
    indicationsPertes: ["légère", "moyenne", "sévère", "profonde"],
    prixUnitaireHT: 3014,
    prixUnitaireTTC: 3180,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth 2.4GHz, app myPhonak, streaming direct",
    garantie: "4 ans constructeur",
  },
  {
    id: "pho-lumity-70-ric",
    marque: "Phonak",
    gamme: "Lumity",
    modele: "Phonak Audéo Lumity 70 RIC",
    description: "Audioprothèse RITE avancée indice 70, AutoSense OS 5.0 classification automatique 7 situations, streaming Bluetooth 2.4GHz direct smartphones, rechargeable 24h, application myPhonak, réduction bruit avancée, étanchéité IP68.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["AutoSense OS 5.0", "Bluetooth 2.4GHz", "Rechargeable", "IP68"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2350,
    prixUnitaireTTC: 2480,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth 2.4GHz, app myPhonak",
    garantie: "4 ans constructeur",
  },
  {
    id: "pho-paradise-50-ric",
    marque: "Phonak",
    gamme: "Paradise",
    modele: "Phonak Audéo Paradise 50 RIC",
    description: "Audioprothèse RITE intermédiaire Paradise, AutoSense OS 4.0, streaming Bluetooth direct Android/iOS, moteur PRISM traitement sonore avancé, étanchéité IP68, rechargeable lithium-ion — confort quotidien.",
    type: "rite",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["AutoSense OS 4.0", "Bluetooth", "PRISM", "Rechargeable", "IP68"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 1790,
    prixUnitaireTTC: 1890,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth, app myPhonak",
    garantie: "4 ans constructeur",
  },
  {
    id: "pho-sky-marvel-bte",
    marque: "Phonak",
    gamme: "Sky Marvel",
    modele: "Phonak Sky Marvel B-PR (enfant)",
    description: "Audioprothèse contour avancée pour enfants et adolescents, robuste et colorée, AutoSense OS 3.0 adaptation automatique, streaming depuis tablettes/smartphones, résistance IP67, légère et durable — contrôle parental via app.",
    type: "bte",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["AutoSense OS 3.0", "Bluetooth", "IP67", "Pédiatrique"],
    indicationsPertes: ["légère", "moyenne", "sévère", "profonde"],
    prixUnitaireHT: 1990,
    prixUnitaireTTC: 2100,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "14h avec piles 13",
    connectivite: "Bluetooth via Roger, app myPhonak junior",
    garantie: "4 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   OTICON
   ════════════════════════════════════════════════════════════════ */
const OTICON_DB: AppareilAuditif[] = [
  {
    id: "oti-intent1-minirite",
    marque: "Oticon",
    gamme: "Intent",
    modele: "Oticon Intent 1 miniRITE R",
    description: "RITE ultra-compact avec capteurs 4 axes détectant les intentions de mouvement pour adapter l'amplification en temps réel, réseau neuronal profond (DNN) sur puce, streaming Auracast public Bluetooth LE Audio, boîtier de charge 3h, garantie 4 ans.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["Capteurs 4D", "DNN IA", "Bluetooth LE Audio", "Auracast", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2740,
    prixUnitaireTTC: 2890,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth LE Audio, Auracast, app Oticon ON",
    garantie: "4 ans constructeur",
  },
  {
    id: "oti-real1-minirite",
    marque: "Oticon",
    gamme: "Real",
    modele: "Oticon Real 1 miniRITE R",
    description: "Audioprothèse RITE avancée Real, DNN réseau neuronal analysant l'environnement, traitement 360° sons authentiques, streaming Bluetooth Made for iPhone/Android, rechargeable 24h, étanchéité IP68, application Oticon ON.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["DNN", "Bluetooth", "360° Sound", "Rechargeable", "IP68"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2085,
    prixUnitaireTTC: 2200,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth Made for iPhone/Android, app Oticon ON",
    garantie: "4 ans constructeur",
  },
  {
    id: "oti-more3-bte",
    marque: "Oticon",
    gamme: "More",
    modele: "Oticon More 3 BTE PP",
    description: "Audioprothèse contour intermédiaire BTE Plus Power, réseau neuronal profond DNN, traitement sons naturels 360°, connexion Bluetooth Made for iPhone, application Oticon ON, robuste pour correction élevée.",
    type: "contour",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["DNN", "Bluetooth", "BTE Plus Power"],
    indicationsPertes: ["moyenne", "sévère", "profonde"],
    prixUnitaireHT: 1660,
    prixUnitaireTTC: 1750,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 13",
    connectivite: "Bluetooth Made for iPhone, app Oticon ON",
    garantie: "4 ans constructeur",
  },
  {
    id: "oti-xceed1-bte",
    marque: "Oticon",
    gamme: "Xceed",
    modele: "Oticon Xceed 1 BTE SP",
    description: "Audioprothèse contour Super Power premium, traitement OpenSound Navigator adaptatif, DNN IA embarquée, connexion Bluetooth, application Oticon ON — puissance maximale pour pertes sévères à profondes.",
    type: "bte",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["DNN", "OpenSound Navigator", "Bluetooth", "Super Power"],
    indicationsPertes: ["sévère", "profonde"],
    prixUnitaireHT: 2512,
    prixUnitaireTTC: 2650,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 675",
    connectivite: "Bluetooth Made for iPhone, app Oticon ON",
    garantie: "4 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   STARKEY
   ════════════════════════════════════════════════════════════════ */
const STARKEY_DB: AppareilAuditif[] = [
  {
    id: "sta-evolv2400-ric",
    marque: "Starkey",
    gamme: "Evolv AI",
    modele: "Starkey Evolv AI 2400 RIC",
    description: "RITE ultra-intelligente avec Edge AI embarqué traitant 80M d'opérations/seconde — détection et alerte chutes intégrée, traduction automatique 27 langues, application Thrive Hearing, suivi activité physique, streaming direct iOS, microphones directionnels multi-mémoire, étanchéité IP68.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["Edge AI", "Détection chutes", "Traduction 27 langues", "Bluetooth", "IP68", "Thrive Hearing"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2293,
    prixUnitaireTTC: 2420,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth direct iOS/Android, app Thrive Hearing",
    garantie: "4 ans constructeur",
  },
  {
    id: "sta-evolv1600-ric",
    marque: "Starkey",
    gamme: "Evolv AI",
    modele: "Starkey Evolv AI 1600 RIC",
    description: "Audioprothèse RITE avancée Edge AI, réduction bruit adaptative, streaming Bluetooth direct iOS, application Thrive Hearing suivi santé, IP68 étanche — gamme avancée Evolv AI fiabilité quotidienne.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["Edge AI", "Bluetooth", "IP68", "Thrive Hearing"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 1877,
    prixUnitaireTTC: 1980,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth, app Thrive Hearing",
    garantie: "4 ans constructeur",
  },
  {
    id: "sta-genesis-ai24-ric",
    marque: "Starkey",
    gamme: "Genesis AI",
    modele: "Starkey Genesis AI 24 RIC",
    description: "Audioprothèse RITE nouvelle génération Genesis AI — architecture IA repensée, traitement 55 milliards d'opérations/heure, son naturel révolutionnaire, détection chutes, streaming Bluetooth LE Audio, rechargeable 51h autonomie boîtier, IP68.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["Genesis AI", "Bluetooth LE Audio", "Détection chutes", "IP68", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2606,
    prixUnitaireTTC: 2750,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable (51h avec boîtier)",
    connectivite: "Bluetooth LE Audio, app Thrive",
    garantie: "4 ans constructeur",
  },
  {
    id: "sta-livio-edge-bte",
    marque: "Starkey",
    gamme: "Livio Edge AI",
    modele: "Starkey Livio Edge AI BTE",
    description: "Audioprothèse contour avancée Edge AI, réduction bruit puissante, microphones directionnels, streaming Bluetooth, application Thrive Hearing, suivi activité — solution robuste pour pertes sévères.",
    type: "bte",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["Edge AI", "Bluetooth", "Microphones directionnels"],
    indicationsPertes: ["moyenne", "sévère", "profonde"],
    prixUnitaireHT: 1754,
    prixUnitaireTTC: 1850,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 13",
    connectivite: "Bluetooth, app Thrive Hearing",
    garantie: "4 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   WIDEX
   ════════════════════════════════════════════════════════════════ */
const WIDEX_DB: AppareilAuditif[] = [
  {
    id: "wid-moment440-ric",
    marque: "Widex",
    gamme: "Moment Sheer",
    modele: "Widex Moment Sheer 440 RIC",
    description: "RITE à traitement sonore ultra-rapide (0.5ms latence ZeroDelay) éliminant l'effet de distorsion du son propre, PureSound technology, streaming direct SoundSense, application Widex Moment, profils personnalisés IA, rechargeable, autonomie 19h.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["ZeroDelay 0.5ms", "PureSound", "IA SoundSense", "Bluetooth", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2512,
    prixUnitaireTTC: 2650,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "19h rechargeable",
    connectivite: "Bluetooth SoundSense, app Widex Moment",
    garantie: "4 ans constructeur",
  },
  {
    id: "wid-moment330-ric",
    marque: "Widex",
    gamme: "Moment",
    modele: "Widex Moment 330 RIC",
    description: "Audioprothèse RITE avancée son naturel, traitement Widex PureSound, latence ultra-faible, streaming Bluetooth direct, application Widex Moment, profils personnalisés — confort sonore exceptionnel.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["PureSound", "Bluetooth", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 1991,
    prixUnitaireTTC: 2100,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "19h rechargeable",
    connectivite: "Bluetooth, app Widex Moment",
    garantie: "4 ans constructeur",
  },
  {
    id: "wid-sheer-bteplus",
    marque: "Widex",
    gamme: "Sheer",
    modele: "Widex Sheer BTE+",
    description: "Audioprothèse contour intermédiaire, technologie PureSound son naturel Widex, connexion Bluetooth, application mobile, robuste pour usage quotidien intense — bon rapport qualité/prix gamme Widex.",
    type: "contour",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["PureSound", "Bluetooth"],
    indicationsPertes: ["moyenne", "sévère"],
    prixUnitaireHT: 1564,
    prixUnitaireTTC: 1650,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 13",
    connectivite: "Bluetooth, app Widex",
    garantie: "3 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   RESOUND
   ════════════════════════════════════════════════════════════════ */
const RESOUND_DB: AppareilAuditif[] = [
  {
    id: "res-nexia9-ric",
    marque: "ReSound",
    gamme: "Nexia",
    modele: "ReSound Nexia 9 RIC",
    description: "RITE premium première mondiale Bluetooth LE Audio et Auracast — streaming multi-streaming simultané TV+téléphone, All Access Directionality 360°, Ultra Focus mode conversations bruyantes, application Smart 3D, compatible Made for iPhone/Android, recharge rapide 30min = 8h.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["Bluetooth LE Audio", "Auracast", "All Access Directionality", "Ultra Focus", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2654,
    prixUnitaireTTC: 2800,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable (recharge rapide 30min = 8h)",
    connectivite: "Bluetooth LE Audio, Auracast, Made for iPhone/Android, app Smart 3D",
    garantie: "4 ans constructeur",
  },
  {
    id: "res-nexia7-ric",
    marque: "ReSound",
    gamme: "Nexia",
    modele: "ReSound Nexia 7 RIC",
    description: "Audioprothèse RITE avancée Bluetooth LE Audio, directionnalité All Access, streaming direct iPhone/Android, rechargeable, application ReSound Smart 3D — rapport qualité/prix gamme Nexia.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["Bluetooth LE Audio", "All Access Directionality", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2038,
    prixUnitaireTTC: 2150,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth LE Audio, app Smart 3D",
    garantie: "4 ans constructeur",
  },
  {
    id: "res-omnia5-bte",
    marque: "ReSound",
    gamme: "OMNIA",
    modele: "ReSound OMNIA 5 BTE",
    description: "Audioprothèse contour intermédiaire OMNIA, traitement son naturel, directionnalité avancée, Bluetooth Made for iPhone, application ReSound Smart 3D — confort acoustique et connectivité.",
    type: "bte",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["Bluetooth", "Made for iPhone", "Directionnalité"],
    indicationsPertes: ["moyenne", "sévère"],
    prixUnitaireHT: 1517,
    prixUnitaireTTC: 1600,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 13",
    connectivite: "Bluetooth Made for iPhone, app Smart 3D",
    garantie: "3 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   SIGNIA
   ════════════════════════════════════════════════════════════════ */
const SIGNIA_DB: AppareilAuditif[] = [
  {
    id: "sig-pure-ax7-ric",
    marque: "Signia",
    gamme: "Pure C&G AX",
    modele: "Signia Pure C&G AX 7 RIC",
    description: "Audioprothèse RITE avancée Augmented Xperience — double processeur indépendant voix/environnement pour son propre naturel, streaming direct Bluetooth Charge&Go, IP68 étanche, rechargeable, application Signia App.",
    type: "rite",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["Augmented Xperience", "Double processeur", "Bluetooth", "Charge&Go", "IP68", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 1991,
    prixUnitaireTTC: 2100,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "36h rechargeable",
    connectivite: "Bluetooth Charge&Go, app Signia App",
    garantie: "4 ans constructeur",
  },
  {
    id: "sig-styletto-ax5-ric",
    marque: "Signia",
    gamme: "Styletto AX",
    modele: "Signia Styletto AX 5 RIC slim",
    description: "Audioprothèse RITE ultra-slim design élégant, Augmented Xperience double processeur son naturel, rechargeable 5 jours boîtier, streaming Bluetooth, application Signia App — discrétion et esthétique maximales.",
    type: "rite",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["Augmented Xperience", "Design slim", "Bluetooth", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne"],
    prixUnitaireHT: 1688,
    prixUnitaireTTC: 1780,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "26h rechargeable (5j avec boîtier)",
    connectivite: "Bluetooth, app Signia App",
    garantie: "4 ans constructeur",
  },
  {
    id: "sig-insio-ax7-ite",
    marque: "Signia",
    gamme: "Insio C&G AX",
    modele: "Signia Insio Charge&Go AX 7 ITE",
    description: "Audioprothèse intra-auriculaire premium rechargeable Charge&Go, Augmented Xperience double processeur, discrétion maximale, Bluetooth streaming, IP68, sur mesure auricule — intra rechargeable de haute technologie.",
    type: "intra",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["Augmented Xperience", "Intra rechargeable", "Bluetooth", "IP68", "Sur mesure"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 2275,
    prixUnitaireTTC: 2400,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "16h rechargeable",
    connectivite: "Bluetooth, app Signia App",
    garantie: "4 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   BERNAFON
   ════════════════════════════════════════════════════════════════ */
const BERNAFON_DB: AppareilAuditif[] = [
  {
    id: "ber-viron9-ric",
    marque: "Bernafon",
    gamme: "Viron",
    modele: "Bernafon Viron 9 RIC",
    description: "Audioprothèse RITE premium Viron, technologie DECS (Dynamic Environnement Categorization System) classification automatique, streaming Bluetooth direct iOS/Android, rechargeable, application Bernafon App — son naturel et confort.",
    type: "rite",
    classe: 2,
    niveauTechno: "premium",
    technologies: ["DECS", "Bluetooth", "Rechargeable"],
    indicationsPertes: ["légère", "moyenne", "sévère"],
    prixUnitaireHT: 1887,
    prixUnitaireTTC: 1990,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "24h rechargeable",
    connectivite: "Bluetooth direct iOS/Android, app Bernafon",
    garantie: "4 ans constructeur",
  },
  {
    id: "ber-leox-sp-bte",
    marque: "Bernafon",
    gamme: "Leox",
    modele: "Bernafon Leox Super Power BTE",
    description: "Audioprothèse contour Super Power Bernafon, puissance maximale pour pertes sévères à profondes, DECS classification environnement, connexion Bluetooth, robustesse IP67 — solution haute puissance.",
    type: "bte",
    classe: 2,
    niveauTechno: "avancé",
    technologies: ["DECS", "Super Power", "Bluetooth", "IP67"],
    indicationsPertes: ["sévère", "profonde"],
    prixUnitaireHT: 1754,
    prixUnitaireTTC: 1850,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 675",
    connectivite: "Bluetooth, app Bernafon",
    garantie: "4 ans constructeur",
  },
  {
    id: "ber-zerena5-ric",
    marque: "Bernafon",
    gamme: "Zerena",
    modele: "Bernafon Zerena 5 RIC",
    description: "Audioprothèse RITE intermédiaire Zerena, traitement DECS automatique, streaming Bluetooth Made for iPhone, application mobile, discret et confortable — entrée de gamme connecté Bernafon.",
    type: "rite",
    classe: 2,
    niveauTechno: "intermédiaire",
    technologies: ["DECS", "Bluetooth Made for iPhone"],
    indicationsPertes: ["légère", "moyenne"],
    prixUnitaireHT: 1375,
    prixUnitaireTTC: 1450,
    priseEnChargeSS: 840,
    tauxTVA: 5.5,
    autonomie: "7j avec piles 312",
    connectivite: "Bluetooth Made for iPhone, app Bernafon",
    garantie: "3 ans constructeur",
  },
];

/* ════════════════════════════════════════════════════════════════
   BASE COMPLÈTE
   ════════════════════════════════════════════════════════════════ */
export const APPAREILS_DB: AppareilAuditif[] = [
  ...PHONAK_DB,
  ...OTICON_DB,
  ...STARKEY_DB,
  ...WIDEX_DB,
  ...RESOUND_DB,
  ...SIGNIA_DB,
  ...BERNAFON_DB,
];

export const MARQUES_APPAREILS = ["Phonak", "Oticon", "Starkey", "Widex", "ReSound", "Signia", "Bernafon"] as const;
export type MarqueAppareil = (typeof MARQUES_APPAREILS)[number];

/* ════════════════════════════════════════════════════════════════
   FONCTIONS UTILITAIRES
   ════════════════════════════════════════════════════════════════ */
export function searchAppareils(
  query: string,
  filters?: { marque?: string; classe?: 1 | 2; niveauTechno?: string },
): AppareilAuditif[] {
  const q = query.toLowerCase().trim();
  return APPAREILS_DB.filter((a) => {
    if (filters?.marque && a.marque !== filters.marque) return false;
    if (filters?.classe && a.classe !== filters.classe) return false;
    if (filters?.niveauTechno && a.niveauTechno !== filters.niveauTechno) return false;
    if (!q) return true;
    return (
      a.modele.toLowerCase().includes(q) ||
      a.marque.toLowerCase().includes(q) ||
      a.gamme.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function getAppareilsByMarque(marque: string): AppareilAuditif[] {
  return APPAREILS_DB.filter((a) => a.marque === marque);
}

export function getAppareilsByPerte(
  perte: "légère" | "moyenne" | "sévère" | "profonde",
): AppareilAuditif[] {
  return APPAREILS_DB.filter((a) => a.indicationsPertes.includes(perte));
}
