import { Item } from "./Item";

export interface Production extends Item {
  id: number;
  ref: string;
  dateProduction: string;
  tailleArticle: string;
  quantitePremiereChoix: number;
  quantiteDeuxiemeChoix: number;
  quantiteTotale: number;
  planning: string;
  presences: string[];
}

export interface ProductionFormData {
  dateProduction: string;
  tailleArticle: string;
  quantitePremiereChoix: number;
  quantiteDeuxiemeChoix: number;
  quantiteTotale: number;
}
