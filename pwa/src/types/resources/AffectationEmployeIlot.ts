import { BaseFilters } from "../common/BaseFilters";
import { Employe } from "./Employe";
import { Ilot } from "./Ilot";
import { Item } from "./Item";

export interface AffectationEmployeIlot extends Item {
  id: number;
  ref: string;
  responsable: boolean;
  employe: Employe;
  ilot: Ilot;
}

export interface AffectationEmployeIlotFilters extends BaseFilters {
  ref?: string;
  responsable?: boolean;
  employe?: Employe;
  ilot?: string;
}
