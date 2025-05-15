export type AvatarResource = {
  contentUrl: string;
  "@id": string;
};

export type User = {
  id: number;
  ref: string;
  username: string;
  email: string;
  roles: string[];
  avatar: AvatarResource;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
};
