import { Item } from "./Item";

export const STATUTS = [
  "AVAILABLE",
  "UNAVAILABLE",
  "BROKEN",
  "MAINTENANCE",
] as const;

// Type automatically inferred from the literal array
export type StatutMachine = (typeof STATUTS)[number];

export interface Machine extends Item {
  id: number;
  ref: string;
  nom: string;
  type: string;
  statut: StatutMachine;
  ilot?: string;
}
