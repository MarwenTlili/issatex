import { Item } from "./item";

export interface Client extends Item {
  id?: number;
  ref?: string;
  nom?: string;
  adresse?: string;
  privilegie?: boolean;
}
