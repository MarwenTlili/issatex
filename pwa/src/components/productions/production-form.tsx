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

import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Production, ProductionFormData } from "@/types/resources/Production";
import {
  useCreateProduction,
  useUpdateProduction,
} from "@/hooks/use-productions";
import {
  TAILLE_ARTICLE_OPTIONS,
  TailleArticle,
} from "@/types/resources/TailleOrdreFabrication";

interface ProductionFormProps {
  planningId: string;
  production?: Production;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductionForm({
  planningId,
  production,
  onSuccess,
  onCancel,
}: ProductionFormProps) {
  const [formData, setFormData] = useState<ProductionFormData>({
    dateProduction: new Date().toISOString().split("T")[0],
    tailleArticle: TAILLE_ARTICLE_OPTIONS[0],
    quantitePremiereChoix: 0,
    quantiteDeuxiemeChoix: 0,
    quantiteTotale: 0,
  });

  const createMutation = useCreateProduction();
  const updateMutation = useUpdateProduction();

  useEffect(() => {
    if (production) {
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
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {production ? "Modifier la production" : "Nouvelle production"}
        </CardTitle>
        <CardDescription>
          Saisissez les détails de la production pour cette planification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  {TAILLE_ARTICLE_OPTIONS.map((taille) => (
                    <SelectItem key={taille} value={taille}>
                      {taille}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantitePremiereChoix">Quantité 1er choix</Label>
              <Input
                id="quantitePremiereChoix"
                type="number"
                min="0"
                value={formData.quantitePremiereChoix}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantitePremiereChoix: Number.parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantiteDeuxiemeChoix">Quantité 2ème choix</Label>
              <Input
                id="quantiteDeuxiemeChoix"
                type="number"
                min="0"
                value={formData.quantiteDeuxiemeChoix}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantiteDeuxiemeChoix: Number.parseInt(e.target.value) || 0,
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
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {production ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
