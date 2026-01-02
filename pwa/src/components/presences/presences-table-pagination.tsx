"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PresencesFilters } from "@/types/resources/Presence";
import { PAGINATION } from "@/config/app";

interface PresencesTablePaginationProps {
  totalItems: number;
  filters: PresencesFilters;
  onPageChange: (page: number) => void;
}

export function PresencesTablePagination({
  totalItems,
  filters,
  onPageChange,
}: PresencesTablePaginationProps) {
  const itemsPerPage = filters.itemsPerPage || PAGINATION.DEFAULT_PAGE_SIZE;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = filters.page || PAGINATION.DEFAULT_PAGE;

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        Affichage de {startItem} à {endItem} sur {totalItems} présences
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="flex items-center gap-2">
          <span className="text-sm">Éléments par page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              const newItemsPerPage = Number.parseInt(value);
              const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
              const newPage = currentPage > newTotalPages ? 1 : currentPage;

              onPageChange(newPage);
              // Note: itemsPerPage change should be handled by parent component
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
