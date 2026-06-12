import { Item } from "./Item";

export interface Client extends Item {
  id?: number;
  ref?: string;
  nom?: string;
  prenomResponsable?: string;
  nomResponsable?: string;
  tailleEntreprise?: TailleEntreprise;
  typeEntreprise?: TypeEntreprise;
  categoryTextile?: CategoryTextile;
  adresse?: string;
  ville?: string;
  gouvernemental?: string;
  codePostal?: string;
  pays?: string;
  numeroTelephone?: string;
  focusMarche?: FocusMarche;
  informationsComplementaires?: string;
  privilegie?: boolean;
  ordreFabrications?: string[];
  articles?: string[];
  account?: string;
}

export const TailleEntrepriseValues = [
  "Petite (1-49)",
  "Moyenne (50-249)",
  "Grande (250+)",
] as const;
export type TailleEntreprise = (typeof TailleEntrepriseValues)[number];

export const TypeEntrepriseValues = [
  "Marque de mode",
  "Convertisseur textile",
  "Grossiste",
  "Clientèle corporative",
  "Détaillante",
  "Sous-traitant",
  "Autre ...",
] as const;
export type TypeEntreprise = (typeof TypeEntrepriseValues)[number];

export const CategoryTextileValues = [
  "Habillement & Vêtements",
  "Tissus & Textiles",
  "Fils & Filés",
  "Textiles de maison",
  "Textiles techniques",
  "Accessoires",
] as const;
export type CategoryTextile = (typeof CategoryTextileValues)[number];

export const FocusMarcheValues = [
  "Marché interieur",
  "Exportation internationale",
  "Durable",
  "Luxe",
  "Mode rapide",
  "Industriel",
] as const;
export type FocusMarche = (typeof FocusMarcheValues)[number];
