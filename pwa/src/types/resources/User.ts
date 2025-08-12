import { Avatar } from "./Avatar";
import { Item } from "./Item";

export interface User extends Item {
  id: number | number;
  ref?: string;
  username?: string;
  email?: string;
  roles?: string[];
  avatar?: Avatar;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
}
