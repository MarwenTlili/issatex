import { Item } from "./Item";

export interface Planning extends Item {
  id: number;
  ref: string;
  dateCreation: string;
  dateDebut: string;
  dateFin: string;
  reporte: boolean;
  ordreFabrication: string;
  ilot: string;
  productions: string[];
}
