"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks/use-articles";
import {
  useCreateOrdreFabrication,
  useUpdateOrdreFabrication,
  useOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { useTailleOrdreFabrications } from "@/hooks/use-taille-ordre-fabrications";
import { TAILLE_ARTICLE_OPTIONS, TailleArticle } from "@/types/resources/TailleOrdreFabrication";

interface OrdreFabricationFormProps {
  ordreFabricationId?: number;
}

interface FormData {
  dateCloture: string;
  urgent: boolean;
  prixUnitaire: string;
  tempsUnitaire: number;
  article: string;
  tailleOFs: Array<{
    tailleArticle: TailleArticle;
    quantite: number;
  }>;
}

const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export function OrdreFabricationForm({
  ordreFabricationId,
}: OrdreFabricationFormProps) {
  const isEdit = !!ordreFabricationId;
  const router = useRouter();

  // React Hook Form setup
  const form = useForm<FormData>({
    defaultValues: {
      dateCloture: "",
      urgent: false,
      prixUnitaire: "",
      tempsUnitaire: 0,
      article: "",
      tailleOFs: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tailleOFs",
  });

  // React Query hooks with optimized configuration
  const { data: articlesResponse } = useArticles({
    itemsPerPage: 100,
    order: { ref: "desc" },
  });

  const {
    data: ordreFabrication,
    isLoading: isLoadingOF,
    isSuccess: isSuccessOF,
  } = useOrdreFabrication(ordreFabricationId!, {
    enabled: !!ordreFabricationId,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: tailleOFsResponse,
    isLoading: isLoadingTailles,
    isSuccess: isSuccessTailles,
  } = useTailleOrdreFabrications(ordreFabricationId, {
    enabled: !!ordreFabricationId,
    staleTime: 10 * 60 * 1000,
  });

  const createOrdreFabrication = useCreateOrdreFabrication();
  const updateOrdreFabrication = useUpdateOrdreFabrication();

  // Single useEffect to populate form data when editing
  useEffect(() => {
    if (
      isEdit &&
      isSuccessOF &&
      isSuccessTailles &&
      ordreFabrication &&
      tailleOFsResponse
    ) {
      console.log("Populating form with data:", ordreFabrication.article);

      const tailleOFs = tailleOFsResponse.member.map((tof) => ({
        tailleArticle: tof.tailleArticle,
        quantite: tof.quantite,
      }));

      form.reset({
        dateCloture: formatDateForInput(ordreFabrication.dateCloture || ""),
        urgent: ordreFabrication.urgent,
        prixUnitaire: ordreFabrication.prixUnitaire,
        tempsUnitaire: ordreFabrication.tempsUnitaire,
        article: ordreFabrication.article,
        tailleOFs,
      });
    }
  }, [
    isEdit,
    isSuccessOF,
    isSuccessTailles,
    ordreFabrication,
    tailleOFsResponse,
    form,
  ]);

  // Watch tailleOFs to calculate total quantity
  const watchedTailleOFs = form.watch("tailleOFs");
  const totalQuantity =
    watchedTailleOFs?.reduce(
      (sum, taille) => sum + (taille.quantite || 0),
      0
    ) || 0;

  const isLoading =
    createOrdreFabrication.isLoading || updateOrdreFabrication.isLoading;
  const isDataLoading = isEdit && (isLoadingOF || isLoadingTailles);

  const onSubmit = async (data: FormData) => {
    try {
      const formDataForAPI = {
        ...data,
        quantiteTotale: totalQuantity,
        dateCloture: data.dateCloture || null,
      };

      if (isEdit && ordreFabricationId) {
        await updateOrdreFabrication.mutateAsync({
          id: ordreFabricationId,
          ...formDataForAPI,
        });
      } else {
        await createOrdreFabrication.mutateAsync(formDataForAPI);
      }

      router.push("/ordre-fabrications");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Fixed function to get available sizes for a specific field
  const getAvailableSizes = (currentIndex: number): TailleArticle[] => {
    const currentFormValues = form.getValues("tailleOFs");
    const usedSizes = currentFormValues
      .map((item, index) =>
        index !== currentIndex ? item.tailleArticle : null
      )
      .filter((size): size is TailleArticle => size !== null);

    return TAILLE_ARTICLE_OPTIONS.filter((size) => !usedSizes.includes(size));
  };

  const addTailleOF = () => {
    const currentFormValues = form.getValues("tailleOFs");
    const usedSizes = currentFormValues.map((item) => item.tailleArticle);
    const availableSizes = TAILLE_ARTICLE_OPTIONS.filter(
      (size) => !usedSizes.includes(size)
    );

    if (availableSizes.length > 0) {
      append({
        tailleArticle: availableSizes[0],
        quantite: 0,
      });
    }
  };

  // Handle size change with proper form update
  const handleSizeChange = (index: number, newSize: "M" | "L" | "XL") => {
    form.setValue(`tailleOFs.${index}.tailleArticle`, newSize, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const articles = articlesResponse?.member || [];

  // Show loading state for edit mode
  if (isDataLoading) {
    return (
      <Card className="mx-4 sm:mx-0 max-w-4xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading form data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 sm:mx-0 max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {isEdit ? "Edit Ordre Fabrication" : "Create New Ordre Fabrication"}
        </CardTitle>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Article Selection */}
          <div className="space-y-2">
            <Label htmlFor="article" className="text-sm sm:text-base">
              Article *
            </Label>
            <Select
              value={form.watch("article")}
              onValueChange={(value) =>
                form.setValue("article", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="article"
                className={
                  form.formState.errors.article ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select an article" />
              </SelectTrigger>
              <SelectContent>
                {articles.map((article) => (
                  <SelectItem key={article.id} value={article["@id"]}>
                    {article.ref} - {article.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.article && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {form.formState.errors.article.message}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateCloture" className="text-sm sm:text-base">
                Date de cloture *
              </Label>
              <Input
                id="dateCloture"
                type="date"
                min={getTomorrowDate()}
                {...form.register("dateCloture", {
                  required: "Date de cloture est requis",
                  validate: (value) => {
                    if (!value) return "Date de cloture est requis";
                    const clotureDate = new Date(value);
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    if (clotureDate <= currentDate) {
                      return "La date de cloture doit être à l'avenir";
                    }
                    return true;
                  },
                })}
                className={`text-sm sm:text-base ${
                  form.formState.errors.dateCloture ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.dateCloture && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {form.formState.errors.dateCloture.message}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="urgent"
                checked={form.watch("urgent")}
                onCheckedChange={(checked) =>
                  form.setValue("urgent", !!checked)
                }
              />
              <Label htmlFor="urgent" className="text-sm sm:text-base">
                Urgent
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prixUnitaire" className="text-sm sm:text-base">
                Prix unitaire (€) *
              </Label>
              <Input
                id="prixUnitaire"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...form.register("prixUnitaire", {
                  required: "Le prix unitaire est obligatoire",
                  validate: (value) => {
                    const num = Number.parseFloat(value);
                    if (isNaN(num) || num <= 0) {
                      return "Le prix unitaire doit être supérieur à 0";
                    }
                    return true;
                  },
                })}
                className={`text-sm sm:text-base ${
                  form.formState.errors.prixUnitaire ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.prixUnitaire && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {form.formState.errors.prixUnitaire.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempsUnitaire" className="text-sm sm:text-base">
                Temps unitaire (cmn) *
              </Label>
              <Input
                id="tempsUnitaire"
                type="number"
                min="1"
                placeholder="0"
                {...form.register("tempsUnitaire", {
                  required: "Le temps unitaire est obligatoire",
                  valueAsNumber: true,
                  validate: (value) => {
                    if (!value || value <= 0) {
                      return "Le temps unitaire doit être supérieur à 0";
                    }
                    return true;
                  },
                })}
                className={`text-sm sm:text-base ${
                  form.formState.errors.tempsUnitaire ? "border-red-500" : ""
                }`}
              />
              {form.formState.errors.tempsUnitaire && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {form.formState.errors.tempsUnitaire.message}
                </div>
              )}
            </div>
          </div>

          {/* Size Configurations - FIXED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm sm:text-base font-medium">
                Configuration des tailles *
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTailleOF}
                disabled={fields.length >= TAILLE_ARTICLE_OPTIONS.length}
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                Aucune configuration de taille. <br />
                Cliquez sur "Ajouter" pour commencer.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const availableSizes = getAvailableSizes(index);
                  const currentSize = form.watch(
                    `tailleOFs.${index}.tailleArticle`
                  );

                  return (
                    <div
                      key={field.id}
                      className="flex gap-4 items-end p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Label className="text-sm">Taille</Label>
                        <Select
                          value={currentSize}
                          onValueChange={(value) =>
                            handleSizeChange(index, value as "M" | "L" | "XL")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une taille" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Always show the currently selected size */}
                            {currentSize &&
                              !availableSizes.includes(currentSize) && (
                                <SelectItem value={currentSize}>
                                  {currentSize}
                                </SelectItem>
                              )}
                            {/* Show available sizes */}
                            {availableSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm">Quantité</Label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...form.register(`tailleOFs.${index}.quantite`, {
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message:
                                "La quantité doit être supérieure ou égale à 0",
                            },
                          })}
                        />
                        {form.formState.errors.tailleOFs?.[index]?.quantite && (
                          <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {
                              form.formState.errors.tailleOFs[index]?.quantite
                                ?.message
                            }
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {form.formState.errors.tailleOFs && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Au moins une configuration de taille est requise
              </div>
            )}
          </div>

          {/* Total Quantity Display */}
          <div className="rounded-lg p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Quantité totale:</span>
              <span className="text-lg font-bold">
                {totalQuantity.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full sm:w-auto bg-transparent"
          >
            <Link
              href={
                isEdit && ordreFabricationId
                  ? `/ordre-fabrications/${ordreFabricationId}`
                  : "/ordre-fabrications"
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? "Enregistrement..."
              : isEdit
              ? "Mettre à jour"
              : "Créer l'ordre de fabrication"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
