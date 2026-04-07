export type TypeMouvement =
  | "entree"
  | "sortie_vente"
  | "sortie_casse"
  | "sortie_retour_fournisseur"
  | "ajustement_positif"
  | "ajustement_negatif";

export interface MouvementStock {
  id: string;
  date: string;            // ISO
  type: TypeMouvement;
  itemId: string;
  designation: string;     // snapshot du nom produit
  marque: string;
  categorie: string;
  quantite: number;        // toujours positif
  prixAchatHT?: number;    // pour les entrées
  prixVenteTTC?: number;   // pour les sorties vente
  pruAvant?: number;       // P.R.U avant mouvement
  pruApres?: number;       // P.R.U après mouvement
  stockAvant: number;
  stockApres: number;
  numeroBL?: string;       // N° bon de livraison
  fournisseur?: string;
  devisRef?: string;       // pour sortie_vente
  operateur?: string;
  notes?: string;
}

export const LS_MOUVEMENTS = "thor_pro_stock_mouvements";

export function loadMouvements(): MouvementStock[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_MOUVEMENTS) ?? "[]"); } catch { return []; }
}
export function saveMouvements(m: MouvementStock[]): void {
  localStorage.setItem(LS_MOUVEMENTS, JSON.stringify(m));
}
