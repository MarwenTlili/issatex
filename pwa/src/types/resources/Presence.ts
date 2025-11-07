import { BaseFilters } from "../common/BaseFilters";
import { Employe } from "./Employe";
import { Ilot } from "./Ilot";
import type { Item } from "./Item";

export const PRESENCE_STATUT = {
  Present: { label: "Présent", muiColor: "success", twColor: "green" },
  Retard: { label: "Retard", muiColor: "warning", twColor: "yellow" },
  Conge: { label: "Congé", muiColor: "info", twColor: "blue" },
  Absent: { label: "Absent", muiColor: "error", twColor: "red" },
} as const;

export type StatutPresence = keyof typeof PRESENCE_STATUT;
export type PresenceFieldOrder = "ref" | "datePresence" | "statut" | "ilot.nom";

export interface Presence extends Item {
  id: number;
  ref: string;
  datePresence: string;
  heureDebut: string | null;
  heureFin: string | null;
  statut: StatutPresence;
  tempsPresence: string | null;
  employe: Employe;
  ilot: Ilot;
}

export interface CreatePresenceData {
  datePresence?: string;
  heureDebut?: string | null;
  heureFin?: string | null;
  statut?: StatutPresence;
  tempsPresence?: string | null;
  employe?: string;
  ilot?: string;
}

export interface UpdatePresenceData extends Partial<CreatePresenceData> {
  id: number;
}

export interface PresencesFilters extends BaseFilters {
  ref?: string;
  employe?: string;
  ilot?: string;
  statut?: string;
  datePresence?: {
    after?: string;
    before?: string;
  };
}
