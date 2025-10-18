import { BaseFilters } from "../common/BaseFilters";
import { Employe } from "./Employe";
import { Ilot } from "./Ilot";
import type { Item } from "./Item";

export type StatutPresence = "Present" | "Absent" | "Retard" | "Conge";
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

export const STATUT_PRESENCE_OPTIONS = [
  { value: "Present", label: "Présent", color: "bg-green-100 text-green-800" },
  { value: "Absent", label: "Absent", color: "bg-red-100 text-red-800" },
  { value: "Retard", label: "Retard", color: "bg-yellow-100 text-yellow-800" },
  { value: "Conge", label: "Congé", color: "bg-blue-100 text-blue-800" },
] as const;
