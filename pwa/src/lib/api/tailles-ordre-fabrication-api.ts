import { ApiCollection } from "@/types/resources/ApiCollection";
import { apiRequest } from "./base";
import { TailleArticle, TailleOrdreFabrication } from "@/types/resources/TailleOrdreFabrication";

export const taillesOrdreFabricationApi = {
  getAllByOrdreFabricationId: async (ordreFabricationId: number) => {
    return apiRequest<ApiCollection<TailleOrdreFabrication>>(
      `/api/taille_ordre_fabrications?ordreFabrication=${ordreFabricationId}`
    );
  },

  getAllByOrdreFabricationURI: (uri: string) => {
    const ordreFabricationId = uri.split("/").pop();
    return apiRequest<ApiCollection<TailleOrdreFabrication>>(
      `/api/taille_ordre_fabrications?ordreFabrication=${ordreFabricationId}`
    );
  },

  create: async (data: {
    tailleArticle: TailleArticle;
    quantite: number;
    ordreFabrication: string;
  }) => {
    return apiRequest<TailleOrdreFabrication>(
      "/api/taille_ordre_fabrications",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  update: async (
    id: number,
    data: {
      tailleArticle: TailleArticle;
      quantite: number;
    }
  ) => {
    return apiRequest<TailleOrdreFabrication>(
      `/api/taille_ordre_fabrications/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: number) => {
    await apiRequest<void>(`/api/taille_ordre_fabrications/${id}`, {
      method: "DELETE",
    });
  },
};
