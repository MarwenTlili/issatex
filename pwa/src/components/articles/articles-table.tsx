"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArticles, useDeleteArticle } from "@/hooks/use-articles";
import { ArticleFilters } from "@/types/resources/Article";
import { ArticlesTableContent } from "./articles-table-content";
import { ArticlesTableFilters } from "./articles-table-filters";
import { ArticlesTablePagination } from "./articles-table-pagination";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function ArticlesTable() {
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 1,
    itemsPerPage: 5,
    order: { ref: "desc" },
  });
  const deleteArticle = useDeleteArticle();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const { data: articlesCollection, isLoading, error } = useArticles(filters);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ArticleFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        // Reset to page 1 when filtering (except for page changes)
        page: "page" in newFilters ? newFilters.page : 1,
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
        page: 1,
      };
    });
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      setDialogData({
        title: `Delete article "${id}"?`,
        description: "Are you sure you want to delete this article?",
        actionLabel: "Delete",
        onConfirm: () => {
          deleteArticle.mutateAsync(id);
          setOpenConfirmDialog(false);
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
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            Error loading articles:{" "}
            {error instanceof Error ? error.message : "Unknown error occurred"}
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
            <Link href="/articles/new">
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
