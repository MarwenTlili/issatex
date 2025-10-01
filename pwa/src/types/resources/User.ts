import { Avatar } from "./Avatar";
import { Item } from "./Item";

export interface User extends Item {
  id: number;
  ref?: string;
  username?: string;
  email?: string;
  roles?: string[];
  avatar?: Avatar | string | null;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
  lastLoginAt?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  avatar?: string | null;
}
