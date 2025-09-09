"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticlesFilters } from "@/types/resources/Article";
import { PAGINATION } from "@/config/app";

interface ArticlesTablePaginationProps {
  totalItems: number;
  filters: ArticlesFilters;
  onPageChange: (page: number) => void;
}

export const ArticlesTablePagination = memo(function ArticlesTablePagination({
  totalItems,
  filters,
  onPageChange,
}: ArticlesTablePaginationProps) {
  const totalPages = Math.ceil(
    totalItems / (filters.itemsPerPage || PAGINATION.DEFAULT_PAGE_SIZE)
  );
  const currentPage = filters.page || PAGINATION.DEFAULT_PAGE;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Affichage de{" "}
        {(currentPage - 1) *
          (filters.itemsPerPage || PAGINATION.DEFAULT_PAGE_SIZE) +
          1}{" "}
        à{" "}
        {Math.min(
          currentPage * (filters.itemsPerPage || PAGINATION.DEFAULT_PAGE_SIZE),
          totalItems
        )}{" "}
        sur {totalItems} articles
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
});
