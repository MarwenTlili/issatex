"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArticles, useDeleteArticle } from "@/hooks/use-articles";
import type { ArticlesFilters } from "@/types/resources/Article";
import { ArticlesTableContent } from "./articles-table-content";
import { ArticlesTableFilters } from "./articles-table-filters";
import { ArticlesTablePagination } from "./articles-table-pagination";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getErrorMessage, isApiError } from "@/lib/api/handle-api-error";
import { APP_ROUTES, MESSAGES, PAGINATION } from "@/config/app";

export function ArticlesTable() {
  const [filters, setFilters] = useState<ArticlesFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    itemsPerPage: PAGINATION.DEFAULT_PAGE_SIZE,
    order: { ref: "desc" },
  });
  const { data: articlesCollection, isLoading, error } = useArticles(filters);
  const deleteArticle = useDeleteArticle();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ArticlesFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: "page" in newFilters ? newFilters.page : PAGINATION.DEFAULT_PAGE,
      }));
    },
    []
  );

  const handleSort = useCallback((field: "ref" | "designation") => {
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
        title: MESSAGES.ACTION.DELETE,
        description: `${MESSAGES.DIALOG.ARTICLE_DELETE} ${ref}`,
        actionLabel: MESSAGES.ACTION.DELETE,
        onConfirm: async () => {
          try {
            await deleteArticle.mutateAsync(id);
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
    [deleteArticle]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFilterChange({ page: newPage });
    },
    [handleFilterChange]
  );

  if (error) {
    const errorMessage = isApiError(error)
      ? getErrorMessage(error)
      : error instanceof Error
      ? error.message
      : "Une erreur inconnue s'est produite";

    if (
      isApiError(error) &&
      ((error.status && error.status >= 500) || !error.status)
    ) {
      throw new Error(error.title || error.detail || "Server error");
    }

    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            Erreur lors du chargement des articles: {errorMessage}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = articlesCollection?.totalItems || 0;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            List des Articles
          </CardTitle>
          <Button asChild className="w-full sm:w-auto">
            <Link href={APP_ROUTES.CLIENT.ARTICLE_NEW}>
              <Plus className="mr-2 h-4 w-4" /> Ajout Article
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ArticlesTableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <ArticlesTableContent
            articlesCollection={articlesCollection}
            isLoading={isLoading}
            filters={filters}
            onSort={handleSort}
            onDelete={handleDelete}
            deleteLoading={deleteArticle.isLoading}
          />

          <ArticlesTablePagination
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
