"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { usePresences, useDeletePresence } from "@/hooks/use-presences";
import type {
  PresenceFieldOrder,
  PresencesFilters,
} from "@/types/resources/Presence";
import { PresencesTableContent } from "./presences-table-content";
import { PresencesTableFilters } from "./presences-table-filters";
import { PresencesTablePagination } from "./presences-table-pagination";
import { handleApiError } from "@/lib/api/handle-api-error";

import { APP_ROUTES, PAGINATION } from "@/config/app";

export function PresencesTable() {
  const [filters, setFilters] = useState<PresencesFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    itemsPerPage: PAGINATION.DEFAULT_PAGE_SIZE,
    order: { datePresence: "desc" },
  });
  const {
    data: presencesCollection,
    isLoading,
    refetch,
    error,
  } = usePresences(filters);
  const deletePresence = useDeletePresence();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: Partial<PresencesFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: "page" in newFilters ? newFilters.page : PAGINATION.DEFAULT_PAGE,
      }));
    },
    [],
  );

  const handleSort = useCallback((field: PresenceFieldOrder) => {
    setFilters((prev) => {
      const currentOrder = prev.order?.[field];
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        order: { [field]: newOrder },
        page: PAGINATION.DEFAULT_PAGE,
      };
    });
  }, []);

  const handleDelete = useCallback(
    async (id: number, ref: string) => {
      setDialogData({
        title: "Supprimer la présence",
        description: `Êtes-vous sûr de vouloir supprimer la présence ${ref} ?`,
        actionLabel: "Supprimer",
        onConfirm: async () => {
          try {
            await deletePresence.mutateAsync(id);
            setOpenConfirmDialog(false);
          } catch (error) {
            handleApiError(error);
            setOpenConfirmDialog(false);
          }
        },
      });
      setOpenConfirmDialog(true);
    },
    [deletePresence],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFilterChange({ page: newPage });
    },
    [handleFilterChange],
  );

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const totalItems = presencesCollection?.totalItems || 0;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            Gestion des Présences
          </CardTitle>
          <Button asChild className="w-full sm:w-auto">
            <Link href={APP_ROUTES.SECRETAIRE.PRESENCE_NEW}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Présence
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <PresencesTableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <PresencesTableContent
            presencesCollection={presencesCollection}
            isLoading={isLoading}
            filters={filters}
            onSort={handleSort}
            onDelete={handleDelete}
            deleteLoading={deletePresence.isLoading}
          />

          <PresencesTablePagination
            totalItems={totalItems}
            filters={filters}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

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
    </div>
  );
}
