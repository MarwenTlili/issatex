import type {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import { ApiService, apiRequest } from "./base";
import { taillesOrdreFabricationApi } from "./tailles-ordre-fabrication-api";
import type { ApiCollection } from "@/types/resources/ApiCollection";
import { buildQueryParams } from "@/lib/utils";

import { API_ENDPOINTS } from "@/config/api";

class OrdresFabricationApiService extends ApiService<
  OrdreFabrication,
  CreateOrdreFabricationData,
  UpdateOrdreFabricationData
> {
  constructor() {
    super(API_ENDPOINTS.ORDRE_FABRICATIONS);
  }

  async getAllByClientId(
    clientId?: number,
    filters: OrdreFabricationFilters = {},
  ): Promise<ApiCollection<OrdreFabrication>> {
    const params = buildQueryParams({
      client: clientId,
      ...filters,
    });

    return apiRequest<ApiCollection<OrdreFabrication>>(
      `${API_ENDPOINTS.ORDRE_FABRICATIONS}?${params}`,
    );
  }

  async create(data: CreateOrdreFabricationData): Promise<OrdreFabrication> {
    // First create the OrdreFabrication without tailleOFs
    const { tailleOFs, client, ...ordreFabricationData } = data;

    const ordreFabrication = await apiRequest<OrdreFabrication>(
      API_ENDPOINTS.ORDRE_FABRICATIONS,
      {
        method: "POST",
        body: JSON.stringify({
          ...ordreFabricationData,
          dateCreation: new Date().toISOString(),
          statut: "Cree",
          lance: false,
          client: client,
        }),
      },
    );

    // Create size configurations
    if (tailleOFs.length > 0) {
      await Promise.all(
        tailleOFs.map((tailleOF) =>
          taillesOrdreFabricationApi.create({
            ...tailleOF,
            ordreFabrication: ordreFabrication["@id"],
          }),
        ),
      );
    }

    return ordreFabrication;
  }

  async update(
    id: number,
    data: UpdateOrdreFabricationData,
  ): Promise<OrdreFabrication> {
    const { tailleOFs, ...updateData } = data;

    // Update the main order
    const ordreFabrication = await apiRequest<OrdreFabrication>(
      `${API_ENDPOINTS.ORDRE_FABRICATIONS}/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify(updateData),
      },
    );

    // Update size configurations if provided
    if (tailleOFs) {
      const existingTailleOFs =
        await taillesOrdreFabricationApi.getAllByOrdreFabrication(id);

      // Delete existing configurations
      await Promise.all(
        existingTailleOFs.member.map((tof) =>
          taillesOrdreFabricationApi.delete(tof.id),
        ),
      );

      // Create new configurations
      if (tailleOFs.length > 0) {
        await Promise.all(
          tailleOFs.map((tailleOF) =>
            taillesOrdreFabricationApi.create({
              ...tailleOF,
              ordreFabrication: ordreFabrication["@id"],
            }),
          ),
        );
      }
    }

    return ordreFabrication;
  }
}

export const ordresFabricationApi = new OrdresFabricationApiService();
