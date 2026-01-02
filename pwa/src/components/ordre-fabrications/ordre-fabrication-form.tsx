"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks/use-articles";
import {
  useCreateOrdreFabrication,
  useUpdateOrdreFabrication,
  useOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { useTaillesByOrdreFabrication } from "@/hooks/use-taille-ordre-fabrications";
import {
  TAILLE_ARTICLE_OPTIONS,
  type TailleArticle,
} from "@/types/resources/TailleOrdreFabrication";
import { APP_ROUTES, MESSAGES, PAGINATION } from "@/config/app";
import {
  ordreFabricationSchema,
  type OrdreFabricationFormData,
} from "@/lib/validation/schemas";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";

interface OrdreFabricationFormProps {
  ordreFabricationId?: number;
}

// 86400000: 1 day in ms
const getTomorrowDate = (): string =>
  new Date(Date.now() + 86400000).toISOString().slice(0, 10);

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
  const form = useForm<OrdreFabricationFormData>({
    resolver: zodResolver(ordreFabricationSchema),
    defaultValues: {
      dateCloture: "",
      urgent: false,
      prixUnitaire: "",
      tempsUnitaire: undefined,
      article: "",
      tailleOFs: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tailleOFs",
  });

  const {
    data: ordreFabrication,
    isLoading: isLoadingOF,
    isSuccess: isSuccessOF,
  } = useOrdreFabrication(ordreFabricationId!);

  // React Query hooks with optimized configuration
  const { data: articlesResponse, isLoading: isLoadingArticles } = useArticles({
    itemsPerPage: PAGINATION.MAX_PAGE_SIZE,
    order: { ref: "desc" },
    // withoutOrdreFabrication: true,
    currentArticle: ordreFabrication?.article?.split("/").pop(),
  });

  const {
    data: tailleOFsResponse,
    isLoading: isLoadingTailles,
    isSuccess: isSuccessTailles,
  } = useTaillesByOrdreFabrication(ordreFabricationId);

  const createOrdreFabrication = useCreateOrdreFabrication();
  const updateOrdreFabrication = useUpdateOrdreFabrication();

  // Single useEffect to populate form data when editing
  useEffect(() => {
    if (
      isEdit &&
      isSuccessOF &&
      isSuccessTailles &&
      ordreFabrication &&
      tailleOFsResponse &&
      articlesResponse
    ) {
      const tailleOFs = tailleOFsResponse.member.map((tof) => ({
        tailleArticle: tof.tailleArticle,
        quantite: tof.quantite,
      }));

      const formData = {
        dateCloture: formatDateForInput(ordreFabrication.dateCloture || ""),
        urgent: ordreFabrication.urgent,
        prixUnitaire: ordreFabrication.prixUnitaire,
        tempsUnitaire: ordreFabrication.tempsUnitaire,
        article: ordreFabrication.article || "",
        tailleOFs,
      };

      form.reset(formData);
    }
  }, [
    ordreFabricationId,
    isEdit,
    isSuccessOF,
    isSuccessTailles,
    ordreFabrication,
    tailleOFsResponse,
    articlesResponse,
    form,
  ]);

  // Watch tailleOFs to calculate total quantity and check if form should be disabled
  const watchedTailleOFs = form.watch("tailleOFs");
  const totalQuantity =
    watchedTailleOFs?.reduce(
      (sum, taille) => sum + (taille.quantite || 0),
      0
    ) || 0;

  // Check if form should be disabled
  const hasTailleOFs = watchedTailleOFs && watchedTailleOFs.length > 0;
  const hasValidTailleOFs =
    hasTailleOFs && watchedTailleOFs.some((taille) => taille.quantite > 0);

  const isLoading =
    createOrdreFabrication.isLoading || updateOrdreFabrication.isLoading;
  const isDataLoading =
    isEdit && (isLoadingOF || isLoadingArticles || isLoadingTailles);

  // Enhanced form validation
  const isFormValid =
    form.formState.isValid && hasTailleOFs && hasValidTailleOFs;

  const hasChanges = isEdit ? form.formState.isDirty : true;
  const canSubmit = isFormValid && hasChanges;

  const onSubmit = async (data: OrdreFabricationFormData) => {
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
      router.push(APP_ROUTES.CLIENT.ORDRE_FABRICATIONS);
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
  const handleSizeChange = (index: number, newSize: TailleArticle) => {
    form.setValue(`tailleOFs.${index}.tailleArticle`, newSize, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const articles = articlesResponse?.member || [];

  // Show loading state for edit mode
  if (isEdit && isDataLoading) {
    return (
      <Card className="mx-4 sm:mx-0 max-w-4xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">{MESSAGES.LOADING.ORDRE_FABRICATIONS}</span>
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
            <Controller
              name="article"
              control={form.control}
              rules={{ required: "L'article est obligatoire" }}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  key={`article-select-${ordreFabricationId || "new"}-${
                    field.value
                  }`}
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
              )}
            />
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
                checked={form.watch("urgent") ?? false}
                onCheckedChange={(checked) =>
                  form.setValue("urgent", !!checked, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
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
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
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
                {"Cliquez sur 'Ajouter' pour commencer."}
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
                            handleSizeChange(index, value as TailleArticle)
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
                          placeholder="0"
                          {...form.register(`tailleOFs.${index}.quantite`, {
                            setValueAs: (v) =>
                              v === "" ? undefined : Number(v),
                          })}
                        />
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
                {form.formState.errors.tailleOFs.message ||
                  "Au moins une configuration de taille est requise"}
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
            <Link href={APP_ROUTES.CLIENT.ORDRE_FABRICATIONS}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : isEdit ? (
              "Mettre à jour"
            ) : (
              "Créer l'ordre de fabrication"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
