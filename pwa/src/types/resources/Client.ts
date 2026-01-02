import { Item } from "./Item";

export interface Client extends Item {
  id?: number;
  ref?: string;
  nom?: string;
  adresse?: string;
  privilegie?: boolean;
  ordreFabrications?: string[];
  articles?: string[];
  account?: string;
}
