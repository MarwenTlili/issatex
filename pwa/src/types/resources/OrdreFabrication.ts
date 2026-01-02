import { BaseFilters } from "../common/BaseFilters";
import { Article } from "./Article";
import { Client } from "./Client";
import { Item } from "./Item";
import { Planning } from "./Planning";
import {
  TailleArticle,
  TailleOrdreFabrication,
  TailleOrdreFabricationData,
} from "./TailleOrdreFabrication";

export const OF_STATUT = {
  DRAFT: {
    label: "DRAFT",
    muiColor: "primary",
    twColor: "bg-blue-100 text-blue-800",
  },
  PLANNED: {
    label: "PLANNED",
    muiColor: "secondary",
    twColor: "bg-indigo-100 text-indigo-800",
  },
  IN_PROGRESS: {
    label: "IN_PROGRESS",
    muiColor: "warning",
    twColor: "bg-amber-100 text-amber-800",
  },
  COMPLETED: {
    label: "COMPLETED",
    muiColor: "success",
    twColor: "bg-green-100 text-green-800",
  },
  CANCELED: {
    label: "CANCELED",
    muiColor: "error",
    twColor: "bg-red-100 text-red-800",
  },
} as const;

export type StatutOF = keyof typeof OF_STATUT;

// Convert to React-Admin compatible choices, eg. to use in <SelectInput ... />
export const OF_STATUT_CHOICES_RA = Object.entries(OF_STATUT).map(
  ([key, value]) => ({
    id: key,
    name: value.label,
  })
);

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
  client: Client;
  article: Article;
  plannings: Planning[];
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
