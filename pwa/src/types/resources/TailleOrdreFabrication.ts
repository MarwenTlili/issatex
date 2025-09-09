import { Item } from "./Item";

// ===== SIZE DEFINITIONS =====
// Utility to get all size values as array
export const TAILLE_ARTICLE_OPTIONS = ["M", "L", "XL"] as const;
export type TailleArticle = (typeof TAILLE_ARTICLE_OPTIONS)[number];
// ===========================

export interface TailleOrdreFabrication extends Item {
  id: number;
  ref: string;
  tailleArticle: TailleArticle;
  quantite: number;
  ordreFabrication: string;
}

export interface TailleOrdreFabricationInput {
  id: string; // Add unique ID for React keys
  tailleArticle: TailleArticle;
  quantite: number;
}

export interface TailleOrdreFabricationData {
  tailleArticle: TailleArticle;
  quantite: number;
}
