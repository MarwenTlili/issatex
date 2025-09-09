"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ClipboardList } from "lucide-react"
import { usePlannings } from "@/hooks/use-plannings"
import type { PlanningsFilters } from "@/types/resources/Planning"
import { PAGINATION } from "@/config/app"
import { PlanningsListFilters } from "./plannings-list-filters"
import { PlanningsListContent } from "./plannings-list-content"
import { PlanningsListPagination } from "./plannings-list-pagination"

export function PlanningsList() {
  const [filters, setFilters] = useState<PlanningsFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    itemsPerPage: PAGINATION.DEFAULT_PAGE_SIZE,
    order: { dateCreation: "desc" },
  })

  const [openPlanningId, setOpenPlanningId] = useState<number | null>(null)

  const { data: planningsData, isLoading, error, refetch } = usePlannings(filters.page || 1, filters.itemsPerPage || 10)

  const handleFilterChange = useCallback((newFilters: Partial<PlanningsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: "page" in newFilters ? newFilters.page : PAGINATION.DEFAULT_PAGE,
    }))
  }, [])

  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFilterChange({ page: newPage })
    },
    [handleFilterChange],
  )

  const handlePlanningToggle = useCallback((planningId: number) => {
    setOpenPlanningId((prev) => (prev === planningId ? null : planningId))
  }, [])

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-4">Erreur lors du chargement des planifications</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalItems = planningsData?.["totalItems"] || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            Gestion des Productions
          </h1>
          <p className="text-muted-foreground mt-2">Saisissez les productions pour chaque planification</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <PlanningsListFilters filters={filters} onFilterChange={handleFilterChange} />

          <PlanningsListContent
            planningsData={planningsData}
            isLoading={isLoading}
            filters={filters}
            openPlanningId={openPlanningId}
            onPlanningToggle={handlePlanningToggle}
          />

          <PlanningsListPagination totalItems={totalItems} filters={filters} onPageChange={handlePageChange} />
        </CardContent>
      </Card>
    </div>
  )
}
