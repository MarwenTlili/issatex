import { Avatar } from "./Avatar";

export type User = {
  "@context": string;
  "@id": string;
  "@type": string;
  id: number | number;
  ref?: string;
  username?: string;
  email?: string;
  roles?: string[];
  avatar?: Avatar;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
};
