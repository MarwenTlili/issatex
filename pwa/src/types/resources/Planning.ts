import { BaseFilters } from "../common/BaseFilters";
import { Ilot } from "./Ilot";
import { Item } from "./Item";
import { OrdreFabrication } from "./OrdreFabrication";
import { Production } from "./Production";

export interface Planning extends Item {
  id: number;
  ref: string;
  dateCreation: string;
  dateDebut: string;
  dateFin: string;
  reporte: boolean;
  ordreFabrication: OrdreFabrication;
  ilot: Ilot;
  productions: Production[];
}

export interface PlanningsFilters extends BaseFilters {
  ref?: string;
}
