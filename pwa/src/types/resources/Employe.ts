import { BaseFilters } from "../common/BaseFilters";
import type { Item } from "./Item";

export interface Employe extends Item {
  id: number;
  ref: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  poste?: string;
  dateEmbauche?: string;
  actif: boolean;
}

export interface EmployesFilter extends BaseFilters {
  ref?: string;
  nom?: string;
  prenom?: string;
  poste?: string;
}
