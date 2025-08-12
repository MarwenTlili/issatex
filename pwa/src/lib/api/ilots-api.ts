import { Ilot } from "@/types/resources/Ilot";
import { apiRequest } from "./base";
import { ApiCollection } from "@/types/resources/ApiCollection";

export const ilotApi = {
  getByURI(uri: string) {
    return apiRequest<Ilot>(uri);
  },

  getAll() {
    return apiRequest<ApiCollection<Ilot>>(`/api/ilots`);
  },
};
