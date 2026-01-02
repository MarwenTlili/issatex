"use client";

import { memo, useState, useEffect } from "react";

import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArticlesFilters } from "@/types/resources/Article";

interface ArticlesTableFiltersProps {
  filters: ArticlesFilters;
  onFilterChange: (newFilters: Partial<ArticlesFilters>) => void;
}

export const ArticlesTableFilters = memo(function ArticlesTableFilters({
  filters,
  onFilterChange,
}: ArticlesTableFiltersProps) {
  // Local state for the input field to prevent parent re-renders
  const [localRefFilter, setLocalRefFilter] = useState(filters.ref || "");

  const handleClearFilter = () => {
    setLocalRefFilter("");
  };

  // Debounce the filter change to parent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({ ref: localRefFilter || undefined });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localRefFilter, onFilterChange]);

  // Update local state when filters prop changes (e.g., when reset externally)
  useEffect(() => {
    setLocalRefFilter(filters.ref || "");
  }, [filters.ref]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-row gap-2">
        <Select
          value={filters.itemsPerPage?.toString() || "10"}
          onValueChange={(value) =>
            onFilterChange({ itemsPerPage: Number.parseInt(value) })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 par page</SelectItem>
            <SelectItem value="10">10 par page</SelectItem>
            <SelectItem value="20">20 par page</SelectItem>
            <SelectItem value="50">50 par page</SelectItem>
          </SelectContent>
        </Select>
        <div>
          <div className="flex-1 relative">
            <Input
              placeholder="réference..."
              value={localRefFilter}
              onChange={(e) => setLocalRefFilter(e.target.value)}
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {localRefFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="h-7 w-7 p-0 hover:bg-transparent"
                  title="Clear filter"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              )}
              <div className="flex items-center justify-center w-8 h-full">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
