import type { Item } from "./Item";

export interface Employe extends Item {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  poste?: string;
  dateEmbauche?: string;
  actif: boolean;
}
