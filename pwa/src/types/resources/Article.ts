import { BaseFilters } from "@/types/common/BaseFilters";
import { Item } from "./Item";
import { boolean } from "zod";

export interface Article extends Item {
  id?: number;
  ref?: string;
  designation?: string;
  composition?: string;
  client?: string;
  ordreFabrications?: string[];
}

export interface CreateArticleData {
  designation: string;
  composition: string;
  client?: string;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: number;
}

export interface ArticlesFilters extends BaseFilters {
  ref?: string;
  designation?: string;
  withoutOrdreFabrication?: boolean;
  currentArticle?: string;
}
