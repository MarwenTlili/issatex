"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";
import type { Planning, PlanningsFilters } from "@/types/resources/Planning";
import type { ApiCollection } from "@/types/resources/ApiCollection";
import { PlanningCard } from "./planning-card";

interface PlanningsListContentProps {
  planningsData: ApiCollection<Planning> | undefined;
  isLoading: boolean;
  filters: PlanningsFilters;
  openPlanningId: number | null;
  onPlanningToggle: (planningId: number) => void;
}

export const PlanningsListContent = memo(function PlanningsListContent({
  planningsData,
  isLoading,
  filters,
  openPlanningId,
  onPlanningToggle,
}: PlanningsListContentProps) {
  const filteredPlannings =
    planningsData?.["member"]?.filter(
      (planning) =>
        !filters.ref ||
        planning.ref?.toLowerCase().includes(filters.ref.toLowerCase()) ||
        planning.id.toString().includes(filters.ref)
    ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredPlannings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucune planification trouvée
          </h3>
          <p className="text-muted-foreground">
            {filters.ref
              ? "Aucune planification ne correspond à votre recherche."
              : "Aucune planification disponible pour le moment."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPlannings.map((planning) => (
        <PlanningCard
          key={planning.id}
          planning={planning}
          isOpen={openPlanningId === planning.id}
          onToggle={() => onPlanningToggle(planning.id)}
        />
      ))}
    </div>
  );
});
