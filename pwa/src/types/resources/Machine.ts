import { Item } from "./Item";

export const MACHINE_STATUT = {
  AVAILABLE: { label: "Available", muiColor: "success" },
  UNAVAILABLE: { label: "Unavailable", muiColor: "default" },
  MAINTENANCE: { label: "Maintenance", muiColor: "warning" },
  BROKEN: { label: "Broken", muiColor: "error" },
} as const;

// Define a type `StatutMachine` that can only be one of the keys of MACHINE_STATUT.
export type MachineStatutType = keyof typeof MACHINE_STATUT;

export interface Machine extends Item {
  id: number;
  ref: string;
  nom: string;
  type: string;
  statut: MachineStatutType;
  ilot?: string;
}
