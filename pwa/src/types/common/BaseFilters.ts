export interface BaseFilters {
  page?: number;
  itemsPerPage?: number;
  order?: {
    [key: string]: "asc" | "desc";
  };
}
