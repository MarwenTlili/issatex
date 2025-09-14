import { BaseFilters } from "../common/BaseFilters";
import type { Item } from "./Item";

export type StatutPresence = "Present" | "Absent" | "Retard" | "Conge";

export interface Presence extends Item {
  id: number;
  ref?: string;
  datePresence: string;
  heureDebut?: string;
  heureFin?: string;
  statut: StatutPresence;
  tempsPresence: number; // Number of hours
  employe: string; // URI reference to employee
  production: string; // URI reference to production
}

export interface CreatePresenceData {
  datePresence: string;
  heureDebut?: string;
  heureFin?: string;
  statut: StatutPresence;
  tempsPresence: number;
  employe: string;
  production: string;
}

export interface UpdatePresenceData extends Partial<CreatePresenceData> {}

export interface PresenceFilters extends BaseFilters {
  employe?: string;
  production?: string;
  statut?: StatutPresence;
  datePresence?: string;
  "datePresence[after]"?: string;
  "datePresence[before]"?: string;
}
