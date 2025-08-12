import { Item } from "./Item";

// ===== SIZE DEFINITIONS =====
// Option 1: Type alias (recommended for simple string unions)
export type TailleArticle = "M" | "L" | "XL";

// Option 2: Enum (more verbose but provides better IntelliSense and validation)
export enum TailleArticleEnum {
  M = "M",
  L = "L",
  XL = "XL",
}

// Utility to get all size values as array
export const TAILLE_ARTICLE_OPTIONS: readonly TailleArticle[] = [
  "M",
  "L",
  "XL",
] as const;
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
