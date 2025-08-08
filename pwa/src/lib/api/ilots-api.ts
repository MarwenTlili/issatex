import { Ilot } from "@/types/resources/Ilot";
import { apiRequest } from "../api";
import { ApiCollection } from "@/types/resources";

export const ilotApi = {
  getByURI: (id: string) => apiRequest<Ilot>(`${id}`),

  getAll: () => apiRequest<ApiCollection<Ilot>>(`/api/ilots`),
};
