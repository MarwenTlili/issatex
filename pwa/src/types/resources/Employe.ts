import { BaseFilters } from "../common/BaseFilters";
import type { Item } from "./Item";

export interface Employe extends Item {
  id: number;
  ref: string;
  nom: string;
  prenom: string;
  poste?: string;
  affectations?: string[];
  presences?: string[];
}

export interface EmployesFilter extends BaseFilters {
  ref?: string;
  nom?: string;
  prenom?: string;
  poste?: string;
}
