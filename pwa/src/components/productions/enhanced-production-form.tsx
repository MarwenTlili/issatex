"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  CalendarIcon,
  Loader2,
  Target,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Production, ProductionFormData } from "@/types/resources/Production";
import {
  TailleArticle,
  TailleArticleEnum,
} from "@/types/resources/TailleOrdreFabrication";
import { useTaillesByOrdreFabricationURI } from "@/hooks/use-taille-ordre-fabrications";
import {
  useCreateProduction,
  useUpdateProduction,
} from "@/hooks/use-productions";
import { OrderContextPanel } from "./order-context-panel";

interface EnhancedProductionFormProps {
  planningId: string;
  ordreFabricationUri: string;
  dateDebut: string;
  dateFin: string;
  production?: Production;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EnhancedProductionForm({
  planningId,
  ordreFabricationUri,
  dateDebut,
  dateFin,
  production,
  onSuccess,
  onCancel,
}: EnhancedProductionFormProps) {
  const [formData, setFormData] = useState<ProductionFormData>({
    dateProduction: new Date().toISOString().split("T")[0],
    tailleArticle: production?.tailleArticle || "",
    quantitePremiereChoix: 0,
    quantiteDeuxiemeChoix: 0,
    quantiteTotale: 0,
  });

  const ordreFabricationId = ordreFabricationUri.split("/").pop() || "";
  const { data: taillesData } =
    useTaillesByOrdreFabricationURI(ordreFabricationId);

  const createMutation = useCreateProduction();
  const updateMutation = useUpdateProduction();

  useEffect(() => {
    if (production) {
      console.log("production.tailleArticle: ", production.tailleArticle);

      setFormData({
        dateProduction: production.dateProduction.split("T")[0],
        tailleArticle: production.tailleArticle,
        quantitePremiereChoix: production.quantitePremiereChoix,
        quantiteDeuxiemeChoix: production.quantiteDeuxiemeChoix,
        quantiteTotale: production.quantiteTotale,
      });
    }
  }, [production]);

  // Auto-calculate total quantity
  useEffect(() => {
    const total =
      formData.quantitePremiereChoix + formData.quantiteDeuxiemeChoix;
    setFormData((prev) => ({ ...prev, quantiteTotale: total }));
  }, [formData.quantitePremiereChoix, formData.quantiteDeuxiemeChoix]);

  // Get order information for selected size
  const selectedSizeOrder = taillesData?.["member"]?.find(
    (taille) => taille.tailleArticle === formData.tailleArticle
  );

  // Calculate working days between planning dates
  const workingDays = (() => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  })();

  const dailyTarget = selectedSizeOrder
    ? Math.ceil(selectedSizeOrder.quantite / workingDays)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (production) {
        await updateMutation.mutateAsync({
          id: production.id.toString(),
          data: formData,
        });
        toast({
          title: "Production mise à jour",
          description: "La production a été mise à jour avec succès.",
        });
      } else {
        await createMutation.mutateAsync({
          ...formData,
          planning: `/api/plannings/${planningId}`,
        });
        toast({
          title: "Production créée",
          description: "La nouvelle production a été créée avec succès.",
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l&apos;enregistrement.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  // Get available sizes from order
  const availableSizes =
    taillesData?.["member"]?.map((t) => t.tailleArticle) ||
    Object.values(TailleArticleEnum);

  const getSuggestionAlert = () => {
    if (!selectedSizeOrder || formData.quantiteTotale === 0) return null;

    const isOnTarget = formData.quantiteTotale === dailyTarget;
    const isAboveTarget = formData.quantiteTotale > dailyTarget;
    const isBelowTarget = formData.quantiteTotale < dailyTarget;

    if (isOnTarget) {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Parfait ! Cette quantité correspond exactement à l&apos;objectif
            quotidien.
          </AlertDescription>
        </Alert>
      );
    } else if (isAboveTarget) {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Cette quantité dépasse l&apos;objectif quotidien de{" "}
            {dailyTarget - formData.quantiteTotale} articles.
          </AlertDescription>
        </Alert>
      );
    } else if (isBelowTarget) {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Target className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Il manque {dailyTarget - formData.quantiteTotale} articles pour
            atteindre l&apos;objectif quotidien.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {production ? "Modifier la production" : "Nouvelle production"}
            </CardTitle>
            <CardDescription>
              Saisissez les détails de la production en tenant compte des
              objectifs de commande.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateProduction">Date de production</Label>
                  <Input
                    id="dateProduction"
                    type="date"
                    value={formData.dateProduction}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateProduction: e.target.value,
                      }))
                    }
                    min={dateDebut}
                    max={dateFin}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tailleArticle">Taille article</Label>
                  <Select
                    value={formData.tailleArticle}
                    onValueChange={(value: TailleArticle) =>
                      setFormData((prev) => ({ ...prev, tailleArticle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((taille) => {
                        const orderInfo = taillesData?.["member"]?.find(
                          (t) => t.tailleArticle === taille
                        );
                        return (
                          <SelectItem key={taille} value={taille}>
                            <div className="flex items-center justify-between w-full">
                              <span>{taille}</span>
                              {orderInfo && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  (Commandé: {orderInfo.quantite})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target Information */}
              {selectedSizeOrder && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">
                      Objectif pour la taille {formData.tailleArticle}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total commandé</p>
                      <p className="font-semibold text-primary">
                        {selectedSizeOrder.quantite}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Objectif quotidien
                      </p>
                      <p className="font-semibold text-orange-600">
                        {dailyTarget}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jours ouvrables</p>
                      <p className="font-semibold">{workingDays}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantitePremiereChoix">
                    Quantité 1er choix
                  </Label>
                  <Input
                    id="quantitePremiereChoix"
                    type="number"
                    min="0"
                    value={formData.quantitePremiereChoix}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantitePremiereChoix:
                          Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantiteDeuxiemeChoix">
                    Quantité 2ème choix
                  </Label>
                  <Input
                    id="quantiteDeuxiemeChoix"
                    type="number"
                    min="0"
                    value={formData.quantiteDeuxiemeChoix}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantiteDeuxiemeChoix:
                          Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantiteTotale">Quantité totale</Label>
                  <Input
                    id="quantiteTotale"
                    type="number"
                    value={formData.quantiteTotale}
                    readOnly
                    className="bg-muted font-semibold"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              {selectedSizeOrder && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const target = dailyTarget;
                      setFormData((prev) => ({
                        ...prev,
                        quantitePremiereChoix: target,
                        quantiteDeuxiemeChoix: 0,
                      }));
                    }}
                  >
                    Utiliser l&apos;objectif quotidien ({dailyTarget})
                  </Button>
                </div>
              )}

              {/* Suggestion Alert */}
              {getSuggestionAlert()}

              <div className="flex justify-end gap-2 pt-4">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {production ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Context Panel */}
      <div className="lg:col-span-1">
        <OrderContextPanel
          planningId={planningId}
          ordreFabricationUri={ordreFabricationUri}
          dateDebut={dateDebut}
          dateFin={dateFin}
        />
      </div>
    </div>
  );
}
