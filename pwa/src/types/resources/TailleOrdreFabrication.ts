import { Item } from "./item";

export type TailleArticle = "M" | "L" | "XL";

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
