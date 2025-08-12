import { Item } from "./Item";

export interface Article extends Item {
  id?: number;
  ref?: string;
  designation?: string;
  composition?: string;
  client?: string;
  ordreFabrications?: string[];
}

export interface CreateArticleData {
  designation?: string;
  composition?: string;
}

export interface UpdateArticleData extends CreateArticleData {
  id: number;
}

export interface ArticlesFilters {
  ref?: string;
  page?: number;
  itemsPerPage?: number;
  order?: {
    [key: string]: "asc" | "desc";
  };
}
