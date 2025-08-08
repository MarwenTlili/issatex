import { Item } from "./item";

export interface Ilot extends Item {
  id: number;
  ref: string;
  nom: string;
  description: string;
  plannings: string[];
  machines: string[];
  affectations: string[];
}
