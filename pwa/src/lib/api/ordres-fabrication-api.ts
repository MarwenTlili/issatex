import {
  CreateOrdreFabricationData,
  OrdreFabrication,
  OrdreFabricationFilters,
  UpdateOrdreFabricationData,
} from "@/types/resources/OrdreFabrication";
import { apiRequest, buildQueryParams } from "./base";
import { ApiCollection } from "@/types/resources/ApiCollection";
import { taillesOrdreFabricationApi } from "./tailles-ordre-fabrication-api";

export const ordresFabricationApi = {
  getAllByClientId(clientId: number, filters: OrdreFabricationFilters = {}) {
    const params = buildQueryParams({
      client: clientId,
      ...filters,
    });

    return apiRequest<ApiCollection<OrdreFabrication>>(
      `/api/ordre_fabrications?${params}`
    );
  },

  getById(id: number) {
    return apiRequest<OrdreFabrication>(`/api/ordre_fabrications/${id}`);
  },

  getByURI(uri: string) {
    return apiRequest<OrdreFabrication>(uri);
  },

  async create(data: CreateOrdreFabricationData, clientUri: string) {
    // First create the OrdreFabrication without tailleOFs
    const { tailleOFs, ...ordreFabricationData } = data;

    const ordreFabrication = await apiRequest<OrdreFabrication>(
      "/api/ordre_fabrications",
      {
        method: "POST",
        body: JSON.stringify({
          ...ordreFabricationData,
          dateCreation: new Date().toISOString(),
          statut: "Cree",
          lance: false,
          client: clientUri,
        }),
      }
    );

    // Create size configurations
    if (tailleOFs.length > 0) {
      await Promise.all(
        tailleOFs.map((tailleOF) =>
          taillesOrdreFabricationApi.create({
            ...tailleOF,
            ordreFabrication: ordreFabrication["@id"],
          })
        )
      );
    }

    return ordreFabrication;
  },

  async update(data: UpdateOrdreFabricationData): Promise<OrdreFabrication> {
    const { id, tailleOFs, ...updateData } = data;

    // Update the main order
    const ordreFabrication = await apiRequest<OrdreFabrication>(
      `/api/ordre_fabrications/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify(updateData),
      }
    );

    // Update size configurations if provided
    if (tailleOFs) {
      const existingTailleOFs =
        await taillesOrdreFabricationApi.getAllByOrdreFabricationId(id);

      // Delete existing configurations
      await Promise.all(
        existingTailleOFs.member.map((tof) =>
          taillesOrdreFabricationApi.delete(tof.id)
        )
      );

      // Create new configurations
      if (tailleOFs.length > 0) {
        await Promise.all(
          tailleOFs.map((tailleOF) =>
            taillesOrdreFabricationApi.create({
              ...tailleOF,
              ordreFabrication: ordreFabrication["@id"],
            })
          )
        );
      }
    }

    return ordreFabrication;
  },

  async delete(id: number): Promise<void> {
    // First delete associated TailleOrdreFabrication
    const tailleOFs = await taillesOrdreFabricationApi.getAllByOrdreFabricationId(
      id
    );
    await Promise.all(
      tailleOFs.member.map((tof) => taillesOrdreFabricationApi.delete(tof.id))
    );

    // Then delete the OrdreFabrication
    await apiRequest<void>(`/api/ordre_fabrications/${id}`, {
      method: "DELETE",
    });
  },
};
