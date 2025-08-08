"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlannings } from "@/hooks/use-plannings";
import { PlanningCard } from "@/components/plannings/planning-card";

export default function ProductionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: planningsData,
    isLoading,
    error,
    refetch,
  } = usePlannings(currentPage, itemsPerPage);

  const filteredPlannings =
    planningsData?.["member"]?.filter(
      (planning) =>
        planning.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planning.id.toString().includes(searchTerm)
    ) || [];

  const totalItems = planningsData?.["totalItems"] || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">
              Erreur lors du chargement des planifications
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            Gestion des Productions
          </h1>
          <p className="text-muted-foreground mt-2">
            Saisissez les productions pour chaque planification
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par référence ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredPlannings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucune planification trouvée
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Aucune planification ne correspond à votre recherche."
                : "Aucune planification disponible pour le moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Plannings List */}
          <div className="space-y-4">
            {filteredPlannings.map((planning) => (
              <PlanningCard key={planning.id} planning={planning} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
