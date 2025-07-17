"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks/use-articles";
import {
  useCreateOrdreFabrication,
  useUpdateOrdreFabrication,
  useOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { useTailleOrdreFabrications } from "@/hooks/use-taille-ordre-fabrications";

interface OrdreFabricationFormProps {
  id?: number;
}

const TAILLE_OPTIONS = ["M", "L", "XL"] as const;

// Helper function to validate numeric strings
const numericStringSchema = (fieldName: string, minValue = 0) =>
  z.string().refine((val) => {
    if (val === "") return false; // Empty string is invalid
    const num = Number.parseFloat(val);
    return !isNaN(num) && num >= minValue;
  }, `${fieldName} doit être supérieur ou égal à ${minValue}`);

// Zod schema for validation
const ordreFabricationSchema = z.object({
  article: z.string().min(1, "L'article est requis"),
  dateCloture: z
    .string()
    .min(1, "Date de cloture est requis")
    .refine((date) => {
      const clotureDate = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return clotureDate > currentDate;
    }, "La date de cloture de date doit être à l'avenir"),
  urgent: z.boolean(),
  prixUnitaire: z
    .string()
    .min(1, "Le prix unitaire est obligatoire")
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Le prix unitaire doit être supérieur à 0"),
  tempsUnitaire: numericStringSchema("Le temps unitaire", 1),
  tailleOFs: z
    .array(
      z.object({
        tailleArticle: z.enum(TAILLE_OPTIONS),
        quantite: numericStringSchema("La quantité", 0),
      })
    )
    .min(1, "Au moins une configuration de taille est requise")
    .refine(
      (tailleOFs) =>
        tailleOFs.some((taille) => {
          const qty = Number.parseFloat(taille.quantite);
          return !isNaN(qty) && qty > 0;
        }),
      "Au moins une taille doit avoir une quantité supérieure à 0"
    ),
});

type OrdreFabricationFormData = z.infer<typeof ordreFabricationSchema>;

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const getDefaultValues = (): OrdreFabricationFormData => ({
  article: "",
  dateCloture: "",
  urgent: false,
  prixUnitaire: "",
  tempsUnitaire: "",
  tailleOFs: [],
});

export function OrdreFabricationForm({ id }: OrdreFabricationFormProps) {
  const isEdit = !!id;
  const router = useRouter();
  const { data: articlesResponse } = useArticles({
    itemsPerPage: 100,
    order: { ref: "desc" },
  });

  // Force refetch when ID changes by adding refetchOnMount and refetchOnWindowFocus
  const {
    data: ordreFabrication,
    isLoading: isLoadingOrdre,
    refetch: refetchOrdre,
  } = useOrdreFabrication(id);

  const {
    data: tailleOFsResponse,
    isLoading: isLoadingTailles,
    refetch: refetchTailles,
  } = useTailleOrdreFabrications(id);

  const createOrdreFabrication = useCreateOrdreFabrication();
  const updateOrdreFabrication = useUpdateOrdreFabrication();

  const form = useForm<OrdreFabricationFormData>({
    resolver: zodResolver(ordreFabricationSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "tailleOFs",
  });

  const watchedTailleOFs = form.watch("tailleOFs");
  const quantiteTotale =
    watchedTailleOFs?.reduce((sum, taille) => {
      const qty = Number.parseFloat(taille?.quantite || "0");
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0) || 0;

  const [lastLoadedId, setLastLoadedId] = useState<number | undefined>(
    undefined
  );

  // Force refetch when ID changes
  useEffect(() => {
    if (id && id !== lastLoadedId) {
      // Force refetch both queries
      if (refetchOrdre) refetchOrdre();
      if (refetchTailles) refetchTailles();
      // Reset form to default values immediately
      form.reset(getDefaultValues());
      setLastLoadedId(id);
    }
  }, [id, lastLoadedId, refetchOrdre, refetchTailles, form]);

  // Initialize form when data loads
  useEffect(() => {
    if (!isEdit) {
      // Create mode
      form.reset(getDefaultValues());
      return;
    }

    // Edit mode - only proceed if we have data for the current ID
    if (id && ordreFabrication && tailleOFsResponse && id === lastLoadedId) {
      const tailleOFs = tailleOFsResponse.member.map((tof) => ({
        tailleArticle: tof.tailleArticle as "M" | "L" | "XL",
        quantite: tof.quantite.toString(), // Convert to string
      }));

      const formData: OrdreFabricationFormData = {
        article: ordreFabrication.article || "",
        dateCloture: formatDateForInput(ordreFabrication.dateCloture || ""),
        urgent: ordreFabrication.urgent || false,
        prixUnitaire: (ordreFabrication.prixUnitaire || 0).toString(),
        tempsUnitaire: (ordreFabrication.tempsUnitaire || "").toString(), // Convert to string
        tailleOFs,
      };

      // Add a small delay to ensure all components are ready
      setTimeout(() => {
        // Reset form with new data
        form.reset(formData);
        // Also update field array explicitly
        replace(tailleOFs);
        // Force update the article field specifically
        form.setValue("article", ordreFabrication.article || "", {
          shouldValidate: true,
        });
      }, 50);
    }
  }, [
    isEdit,
    id,
    ordreFabrication,
    tailleOFsResponse,
    lastLoadedId,
    form,
    replace,
  ]);

  const isSaveOrEditLoading =
    createOrdreFabrication.isLoading || updateOrdreFabrication.isLoading;

  // Show loading when:
  // 1. In edit mode and data is loading
  // 2. In edit mode and we don't have data yet
  // 3. ID changed but data hasn't loaded yet
  const isDataLoading =
    (isEdit && (isLoadingOrdre || isLoadingTailles)) ||
    (isEdit && (!ordreFabrication || !tailleOFsResponse)) ||
    (isEdit && id !== lastLoadedId) ||
    !articlesResponse;

  if (isDataLoading) {
    return (
      <Card className="mx-4 sm:mx-0 max-w-4xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">
              {isEdit
                ? `Loading data for ordre fabrication ${id}...`
                : "Initializing form..."}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: OrdreFabricationFormData) => {
    try {
      const formDataForAPI = {
        ...data,
        dateCloture: data.dateCloture || null,
        quantiteTotale,
        // Convert string values back to numbers for API
        tempsUnitaire: Number.parseFloat(data.tempsUnitaire),
        tailleOFs: data.tailleOFs.map((taille) => ({
          ...taille,
          quantite: Number.parseFloat(taille.quantite),
        })),
      };

      if (isEdit && id) {
        await updateOrdreFabrication.mutateAsync({
          id: id,
          ...formDataForAPI,
        });
      } else {
        await createOrdreFabrication.mutateAsync(formDataForAPI);
      }
      router.push(`/ordre-fabrications`);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const addTailleOF = () => {
    const usedSizes = fields.map((field) => field.tailleArticle);
    const availableSizes = TAILLE_OPTIONS.filter(
      (size) => !usedSizes.includes(size)
    );

    if (availableSizes.length > 0) {
      append({
        tailleArticle: availableSizes[0],
        quantite: "", // Changed from 0 to empty string
      });
    }
  };

  const getAvailableSizes = (currentIndex: number) => {
    const usedSizes = fields
      .filter((_, index) => index !== currentIndex)
      .map((field) => field.tailleArticle)
      .filter(Boolean);

    return TAILLE_OPTIONS.filter((size) => !usedSizes.includes(size));
  };

  const articles = articlesResponse?.member || [];

  return (
    <Card className="mx-4 sm:mx-0 max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Article Selection */}
            <FormField
              control={form.control}
              name="article"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    Article à fabriquer *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an article" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articles?.map((article) => (
                        <SelectItem key={article.id} value={article["@id"]}>
                          {article.ref} - {article.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateCloture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Date de cloture *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={getTomorrowDate()}
                        className="text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgent"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm sm:text-base">
                      Urgent
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prixUnitaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Prix unitaire (€) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tempsUnitaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Temps unitaire (cmn) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        className="text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Size Configurations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm sm:text-base font-medium">
                  Configuration des Quantités/Tailles *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTailleOF}
                  disabled={fields.length >= TAILLE_OPTIONS.length}
                >
                  <Plus className="h-4 w-4" />
                  Ajout
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Aucune configuration de taille n'a été ajoutée. <br />
                  Cliquez sur "Ajout" pour commencer.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-4 items-end p-4 border rounded-lg"
                    >
                      <FormField
                        control={form.control}
                        name={`tailleOFs.${index}.tailleArticle`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm">Size</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableSizes(index).map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tailleOFs.${index}.quantite`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-sm">Quantité</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {form.formState.errors.tailleOFs && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.tailleOFs.message}
                </p>
              )}
            </div>

            {/* Total Quantity Display */}
            <div className="rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="font-medium">Quantité totale:</span>
                <span className="text-lg font-bold">
                  {quantiteTotale.toLocaleString()}
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
              <Link href={"/ordre-fabrications"}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
              </Link>
            </Button>

            <Button
              type="submit"
              disabled={
                isSaveOrEditLoading ||
                !form.formState.isValid ||
                watchedTailleOFs.length === 0 ||
                quantiteTotale === 0 ||
                !form.formState.isDirty // disable if no changes
              }
              className="w-full sm:w-auto"
            >
              {isSaveOrEditLoading
                ? "Saving..."
                : isEdit
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
