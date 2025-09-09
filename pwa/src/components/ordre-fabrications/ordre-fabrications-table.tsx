"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  useOrdreFabrications,
  useDeleteOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { OrdreFabricationFilters } from "@/types/resources/OrdreFabrication";
import { OrdreFabricationsTableFilters } from "./ordre-fabrications-table-filters";
import { OrdreFabricationsTableContent } from "./ordre-fabrications-table-content";
import { OrdreFabricationsTablePagination } from "./ordre-fabrications-table-pagination";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MESSAGES } from "@/config/app";
import { isApiError } from "@/lib/api/handle-api-error";

export function OrdreFabricationsTable() {
  const [filters, setFilters] = useState<OrdreFabricationFilters>({
    page: 1,
    itemsPerPage: 10,
    order: { dateCreation: "desc" },
  });

  const {
    data: ordreFabricationsResponse,
    isLoading,
    error,
  } = useOrdreFabrications(filters);
  const deleteOrdreFabrication = useDeleteOrdreFabrication();

  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: Partial<OrdreFabricationFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        // Reset to page 1 when filtering (except for page changes)
        page: "page" in newFilters ? newFilters.page : 1,
      }));
    },
    []
  );

  const handleSort = useCallback((field: "ref" | "dateCreation" | "statut") => {
    setFilters((prev) => {
      const currentOrder = prev.order?.[field];
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        order: { [field]: newOrder },
        page: 1,
      };
    });
  }, []);

  const handleDelete = useCallback(
    async (id: number, ref: string) => {
      setDialogData({
        title: MESSAGES.ACTION.DELETE,
        description: `${MESSAGES.DIALOG.ORDRE_FABRICATION_DELETE} ${ref}`,
        actionLabel: MESSAGES.ACTION.DELETE,
        onConfirm: async () => {
          try {
            await deleteOrdreFabrication.mutateAsync(id);
            setOpenConfirmDialog(false);
          } catch (error) {
            if (
              isApiError(error) &&
              ((error.status && error.status >= 500) || !error.status)
            ) {
              throw new Error(error.title || error.detail || "Server error");
            }
            setOpenConfirmDialog(false);
          }
        },
      });
      setOpenConfirmDialog(true);
    },
    [deleteOrdreFabrication]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFilterChange({ page: newPage });
    },
    [handleFilterChange]
  );

  if (error) {
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            Error loading ordre fabrications:{" "}
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = ordreFabricationsResponse?.totalItems || 0;

  return (
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">Tout les ordres</CardTitle>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/client/ordre-fabrications/new">
            <Plus className="mr-2 h-4 w-4" /> Nouveau
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <OrdreFabricationsTableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <OrdreFabricationsTableContent
          ordreFabricationsResponse={ordreFabricationsResponse}
          isLoading={isLoading}
          filters={filters}
          onSort={handleSort}
          onDelete={handleDelete}
          deleteLoading={deleteOrdreFabrication.isLoading}
        />

        <OrdreFabricationsTablePagination
          totalItems={totalItems}
          filters={filters}
          onPageChange={handlePageChange}
        />
      </CardContent>
      {openConfirmDialog && dialogData && (
        <ConfirmDialog
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          title={dialogData.title}
          description={dialogData.description}
          actionLabel={dialogData.actionLabel}
          onConfirm={dialogData.onConfirm}
        />
      )}
    </Card>
  );
}
