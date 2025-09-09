import { BaseFilters } from "../common/BaseFilters";
import { Article } from "./Article";
import { Client } from "./Client";
import { Item } from "./Item";
import {
  TailleArticle,
  TailleOrdreFabrication,
  TailleOrdreFabricationData,
} from "./TailleOrdreFabrication";

export type StatutOF =
  | "Cree"
  | "Planifiee"
  | "En_cours"
  | "Terminee"
  | "Annule";

export interface OrdreFabrication extends Item {
  id: number;
  ref: string;
  dateCreation: string;
  dateCloture: string | null;
  urgent: boolean;
  statut: StatutOF;
  quantiteTotale: number;
  prixUnitaire: string;
  tempsUnitaire: number;
  lance: boolean;
  client: string;
  article: string;
  plannings: string[];
  tailleOFs: string[];
}

export interface OrdreFabricationFilters extends BaseFilters {
  ref?: string;
  statut?: string;
  urgent?: boolean;
}

export interface CreateOrdreFabricationData {
  dateCloture: string | null;
  urgent: boolean;
  quantiteTotale: number;
  prixUnitaire: string;
  tempsUnitaire: number;
  article: string;
  tailleOFs: TailleOrdreFabricationData[];
  client?: string;
}

export interface UpdateOrdreFabricationData
  extends Partial<CreateOrdreFabricationData> {
  id: number;
}

export interface OrdreFabricationContext {
  client: Client;
  ordreFabrication: OrdreFabrication;
  article: Article;
  taillesCommande: TailleOrdreFabrication[];
  workingDays: number;
  dailyTargets: { [key in TailleArticle]?: number };
  currentProgress: { [key in TailleArticle]?: number };
}
