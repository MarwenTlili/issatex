export * from "./Avatar";
export * from "./User";

export interface ApiCollection<T> {
  "@context": string;
  "@id": string;
  "@type": string;
  totalItems: number;
  member: T[];
}
