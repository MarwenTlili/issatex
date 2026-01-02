"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Package,
  Calendar,
  TrendingUp,
  BarChart3,
  Delete,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Production } from "@/types/resources/Production";
import { useDeleteProduction, useProductions } from "@/hooks/use-productions";
import { EnhancedProductionForm } from "./enhanced-production-form";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface ProductionListProps {
  planningId: string;
  ordreFabricationUri: string;
  dateDebut: string;
  dateFin: string;
}

interface GroupedProductions {
  [date: string]: Production[];
}

interface DaySummary {
  date: string;
  totalQuantity: number;
  totalFirstChoice: number;
  totalSecondChoice: number;
  productionCount: number;
  sizes: string[];
}

export function ProductionList({
  planningId,
  ordreFabricationUri,
  dateDebut,
  dateFin,
}: ProductionListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduction, setEditingProduction] = useState<Production | null>(
    null
  );
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const {
    data: productionsData,
    isLoading,
    error,
  } = useProductions(planningId);

  // const productionIsExpired = new Date(dateFin) <= new Date();

  const deleteProduction = useDeleteProduction();

  // Group productions by date and calculate summaries
  const { groupedProductions, daySummaries } = useMemo(() => {
    const productions = productionsData?.["member"] || [];

    const grouped: GroupedProductions = {};
    const summaries: DaySummary[] = [];

    productions.forEach((production) => {
      const date = production.dateProduction;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(production);
    });

    // Calculate summaries for each day
    Object.entries(grouped).forEach(([date, dayProductions]) => {
      const totalQuantity = dayProductions.reduce(
        (sum, p) => sum + p.quantiteTotale,
        0
      );
      const totalFirstChoice = dayProductions.reduce(
        (sum, p) => sum + p.quantitePremiereChoix,
        0
      );
      const totalSecondChoice = dayProductions.reduce(
        (sum, p) => sum + p.quantiteDeuxiemeChoix,
        0
      );
      const sizes = [...new Set(dayProductions.map((p) => p.tailleArticle))];

      summaries.push({
        date,
        totalQuantity,
        totalFirstChoice,
        totalSecondChoice,
        productionCount: dayProductions.length,
        sizes,
      });
    });

    // Sort summaries by date (most recent first)
    summaries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { groupedProductions: grouped, daySummaries: summaries };
  }, [productionsData]);

  const handleEdit = (production: Production) => {
    setEditingProduction(production);
    setShowForm(true);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      setDialogData({
        title: `Supprimer la production "${id}"?`,
        description: "Vous-ête sûre de supprimer cette production?",
        actionLabel: "Supprimer",
        onConfirm: () => {
          deleteProduction.mutateAsync(id);
          setOpenConfirmDialog(false);
        },
      });
      setOpenConfirmDialog(true);
    },
    [deleteProduction]
  );

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduction(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduction(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getDateBadgeVariant = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "default";
    } else if (date < today) {
      return "secondary";
    } else {
      return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-3">
              {[...Array(2)].map((_, j) => (
                <Card key={j}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">
            Erreur lors du chargement des productions
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalProductions = productionsData?.["member"]?.length || 0;

  if (showForm) {
    return (
      <EnhancedProductionForm
        planningId={planningId}
        ordreFabricationUri={ordreFabricationUri}
        dateDebut={dateDebut}
        dateFin={dateFin}
        production={editingProduction || undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productions
          </h3>
          <p className="text-sm text-muted-foreground">
            {totalProductions} production{totalProductions !== 1 ? "s" : ""} sur{" "}
            {daySummaries.length} jour
            {daySummaries.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          // disabled={productionIsExpired}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle production
        </Button>
      </div>

      {totalProductions === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">
              Aucune production enregistrée
            </h4>
            <p className="text-muted-foreground mb-6">
              Commencez par créer votre première production pour cette
              planification
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer la première production
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {daySummaries.map((summary) => (
            <div key={summary.date} className="space-y-4">
              {/* Day Header with Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-base">
                      {formatDate(summary.date)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {summary.productionCount} production
                      {summary.productionCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge variant={getDateBadgeVariant(summary.date)}>
                    {new Date(summary.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </Badge>
                </div>

                {/* Day Summary Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">1er choix:</span>
                    <span className="font-semibold text-green-600">
                      {summary.totalFirstChoice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                    <span className="text-muted-foreground">2ème choix:</span>
                    <span className="font-semibold text-orange-600">
                      {summary.totalSecondChoice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-primary">
                      {summary.totalQuantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Productions for this day */}
              <div className="grid gap-3 pl-4">
                {groupedProductions[summary.date].map((production, index) => (
                  <Card
                    key={production.id}
                    className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="font-mono">
                              {production.tailleArticle}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Réf: {production.ref || `#${production.id}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-xs text-green-700 font-medium">
                                1er choix
                              </p>
                              <p className="text-lg font-bold text-green-800">
                                {production.quantitePremiereChoix}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                              <p className="text-xs text-orange-700 font-medium">
                                2ème choix
                              </p>
                              <p className="text-lg font-bold text-orange-800">
                                {production.quantiteDeuxiemeChoix}
                              </p>
                            </div>
                            <div className="text-center p-2 bg-primary/5 rounded-lg border border-primary/20">
                              <p className="text-xs text-primary font-medium">
                                Total
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {production.quantiteTotale}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(production)}
                          className="ml-4"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(production.id)}
                          className="ml-4"
                        >
                          <Delete className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Separator between days (except for the last one) */}
              {summary !== daySummaries[daySummaries.length - 1] && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </div>
      )}

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
