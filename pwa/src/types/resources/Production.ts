import { Item } from "./Item";
import { TailleArticle } from "./TailleOrdreFabrication";

export interface Production extends Item {
  id: number;
  ref: string;
  dateProduction: string;
  tailleArticle: TailleArticle;
  quantitePremiereChoix: number;
  quantiteDeuxiemeChoix: number;
  quantiteTotale: number;
  planning: string;
  presences: string[];
}
