import { Article } from "./Article";
import { Client } from "./Client";
import { Item } from "./item";
import {
  TailleArticleEnum,
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

export interface OrdreFabricationFilters {
  ref?: string;
  statut?: string;
  urgent?: boolean;
  page?: number;
  itemsPerPage?: number;
  order?: {
    [key: string]: "asc" | "desc";
  };
}

export interface CreateOrdreFabricationData {
  dateCloture: string | null;
  urgent: boolean;
  quantiteTotale: number;
  prixUnitaire: string;
  tempsUnitaire: number;
  article: string;
  tailleOFs: TailleOrdreFabricationData[];
}

export interface UpdateOrdreFabricationData
  extends Partial<CreateOrdreFabricationData> {
  id: number;
}

export interface OrderContext {
  client: Client;
  ordreFabrication: OrdreFabrication;
  article: Article;
  taillesCommande: TailleOrdreFabrication[];
  workingDays: number;
  dailyTargets: { [key in TailleArticleEnum]?: number };
  currentProgress: { [key in TailleArticleEnum]?: number };
}
