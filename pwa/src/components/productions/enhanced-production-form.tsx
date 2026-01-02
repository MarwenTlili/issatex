"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormField } from "@/components/ui/form-field";

import {
  CalendarIcon,
  Loader2,
  Target,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Production } from "@/types/resources/Production";
import {
  productionSchema,
  type ProductionFormData,
} from "@/lib/validation/schemas";
import {
  TAILLE_ARTICLE_OPTIONS,
  type TailleArticle,
} from "@/types/resources/TailleOrdreFabrication";
import { useTaillesByOrdreFabrication } from "@/hooks/use-taille-ordre-fabrications";
import {
  useCreateProduction,
  useUpdateProduction,
} from "@/hooks/use-productions";
import { OrderContextPanel } from "./order-context-panel";
import {
  type ApiError,
  handleApiError,
  extractFormErrors,
  isValidationError,
  type FormErrors,
} from "@/lib/api/handle-api-error";

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
  const [apiErrors, setApiErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      dateProduction: new Date().toISOString().split("T")[0],
      tailleArticle: production?.tailleArticle,
      quantitePremiereChoix: 0,
      quantiteDeuxiemeChoix: 0,
      quantiteTotale: 0,
    },
  });

  const watchedValues = watch();

  const ordreFabricationId = ordreFabricationUri.split("/").pop() || "";
  const { data: taillesData } =
    useTaillesByOrdreFabrication(ordreFabricationId);

  const createMutation = useCreateProduction();
  const updateMutation = useUpdateProduction();

  useEffect(() => {
    if (production) {
      reset({
        dateProduction: production.dateProduction.split("T")[0],
        tailleArticle: production.tailleArticle,
        quantitePremiereChoix: production.quantitePremiereChoix,
        quantiteDeuxiemeChoix: production.quantiteDeuxiemeChoix,
        quantiteTotale: production.quantiteTotale,
      });
    }
  }, [production, reset]);

  // Auto-calculate total quantity
  useEffect(() => {
    const total =
      watchedValues.quantitePremiereChoix + watchedValues.quantiteDeuxiemeChoix;
    setValue("quantiteTotale", total);
  }, [
    watchedValues.quantitePremiereChoix,
    watchedValues.quantiteDeuxiemeChoix,
    setValue,
  ]);

  const handleInputChange = (fieldName: keyof ProductionFormData) => {
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      clearErrors(fieldName);
    }
  };

  // Get order information for selected size
  const selectedSizeOrder = taillesData?.["member"]?.find(
    (taille) => taille.tailleArticle === watchedValues.tailleArticle
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

  const onSubmit: SubmitHandler<ProductionFormData> = async (data) => {
    try {
      setApiErrors({});

      if (production) {
        await updateMutation.mutateAsync({
          id: production.id.toString(),
          data,
        });
        toast({
          title: "Production mise à jour",
          description: "La production a été mise à jour avec succès.",
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          planning: `/api/plannings/${planningId}`,
        });
        toast({
          title: "Production créée",
          description: "La nouvelle production a été créée avec succès.",
        });
      }
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;

      if (isValidationError(apiError)) {
        const formErrors = extractFormErrors(apiError);
        setApiErrors(formErrors);

        // Set form errors for react-hook-form
        Object.entries(formErrors).forEach(([field, message]) => {
          setError(field as keyof ProductionFormData, {
            type: "api",
            message,
          });
        });
      } else {
        if ((apiError.status && apiError.status >= 500) || !apiError.status) {
          // Server errors or network errors should trigger error boundary
          throw new Error(apiError.title || apiError.detail || "Server error");
        } else {
          // Handle client errors (4xx) with toast
          handleApiError(apiError, {
            customMessage: production
              ? "Impossible de modifier la production. Vérifiez vos données."
              : "Impossible de créer la production. Vérifiez vos données.",
          });
        }
      }
    }
  };

  const isLoading =
    isSubmitting || createMutation.isLoading || updateMutation.isLoading;

  // Get available sizes from order
  const availableSizes =
    taillesData?.["member"]?.map((t) => t.tailleArticle) ||
    Object.values(TAILLE_ARTICLE_OPTIONS);

  const getSuggestionAlert = () => {
    if (!selectedSizeOrder || watchedValues.quantiteTotale === 0) return null;

    const isOnTarget = watchedValues.quantiteTotale === dailyTarget;
    const isAboveTarget = watchedValues.quantiteTotale > dailyTarget;
    const isBelowTarget = watchedValues.quantiteTotale < dailyTarget;

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
            {watchedValues.quantiteTotale - dailyTarget} articles.
          </AlertDescription>
        </Alert>
      );
    } else if (isBelowTarget) {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Target className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Il manque {dailyTarget - watchedValues.quantiteTotale} articles pour
            atteindre l&apos;objectif quotidien.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const hasChanges = production ? isDirty : true;
  const isFormValid =
    isValid &&
    (watchedValues.quantitePremiereChoix > 0 ||
      watchedValues.quantiteDeuxiemeChoix > 0);

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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Date de production"
                  htmlFor="dateProduction"
                  error={
                    errors.dateProduction?.message || apiErrors.dateProduction
                  }
                  required
                >
                  <Input
                    id="dateProduction"
                    type="date"
                    {...register("dateProduction", {
                      onChange: () => handleInputChange("dateProduction"),
                    })}
                    min={dateDebut}
                    max={dateFin}
                    className={
                      errors.dateProduction || apiErrors.dateProduction
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormField>

                <FormField
                  label="Taille article"
                  htmlFor="tailleArticle"
                  error={
                    errors.tailleArticle?.message || apiErrors.tailleArticle
                  }
                  required
                >
                  <Select
                    value={watchedValues.tailleArticle}
                    onValueChange={(value: TailleArticle) => {
                      setValue("tailleArticle", value);
                      handleInputChange("tailleArticle");
                    }}
                  >
                    <SelectTrigger
                      className={
                        errors.tailleArticle || apiErrors.tailleArticle
                          ? "border-red-500"
                          : ""
                      }
                    >
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
                </FormField>
              </div>

              {/* Target Information */}
              {selectedSizeOrder && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">
                      Objectif pour la taille {watchedValues.tailleArticle}
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
                <FormField
                  label="Quantité 1er choix"
                  htmlFor="quantitePremiereChoix"
                  error={
                    errors.quantitePremiereChoix?.message ||
                    apiErrors.quantitePremiereChoix
                  }
                  required
                >
                  <Input
                    id="quantitePremiereChoix"
                    type="number"
                    min="0"
                    {...register("quantitePremiereChoix", {
                      valueAsNumber: true,
                      onChange: () =>
                        handleInputChange("quantitePremiereChoix"),
                    })}
                    className={
                      errors.quantitePremiereChoix ||
                      apiErrors.quantitePremiereChoix
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormField>

                <FormField
                  label="Quantité 2ème choix"
                  htmlFor="quantiteDeuxiemeChoix"
                  error={
                    errors.quantiteDeuxiemeChoix?.message ||
                    apiErrors.quantiteDeuxiemeChoix
                  }
                  required
                >
                  <Input
                    id="quantiteDeuxiemeChoix"
                    type="number"
                    min="0"
                    {...register("quantiteDeuxiemeChoix", {
                      valueAsNumber: true,
                      onChange: () =>
                        handleInputChange("quantiteDeuxiemeChoix"),
                    })}
                    className={
                      errors.quantiteDeuxiemeChoix ||
                      apiErrors.quantiteDeuxiemeChoix
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormField>

                <div className="space-y-2">
                  <Label htmlFor="quantiteTotale">Quantité totale</Label>
                  <Input
                    id="quantiteTotale"
                    type="number"
                    value={watchedValues.quantiteTotale}
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
                      setValue("quantitePremiereChoix", target);
                      setValue("quantiteDeuxiemeChoix", 0);
                      handleInputChange("quantitePremiereChoix");
                      handleInputChange("quantiteDeuxiemeChoix");
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
                <Button
                  type="submit"
                  disabled={
                    isLoading || !isFormValid || (production && !hasChanges)
                  }
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {production ? "Mise à jour" : "Créé"}
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
