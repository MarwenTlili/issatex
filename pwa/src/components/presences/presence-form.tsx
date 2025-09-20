"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  usePresence,
  useCreatePresence,
  useUpdatePresence,
} from "@/hooks/use-presences";
import {
  presenceSchema,
  type PresenceFormData,
} from "@/lib/validation/schemas";
import { STATUT_PRESENCE_OPTIONS } from "@/types/resources/Presence";
import {
  type ApiError,
  handleApiError,
  extractFormErrors,
  isValidationError,
  type FormErrors,
} from "@/lib/api/handle-api-error";
import { APP_ROUTES } from "@/config/app";

interface PresenceFormProps {
  presenceId?: number;
}

export function PresenceForm({ presenceId }: PresenceFormProps) {
  const isEdit = !!presenceId;
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PresenceFormData>({
    resolver: zodResolver(presenceSchema),
    defaultValues: {
      datePresence: "",
      heureDebut: "",
      heureFin: "",
      statut: "Present",
      tempsPresence: 0,
      employe: "",
      ilot: "",
    },
  });

  const { data: presence, isLoading: isLoadingPresence } =
    usePresence(presenceId);

  const createPresence = useCreatePresence();
  const updatePresence = useUpdatePresence();

  // Watch for time changes to calculate tempsPresence
  const heureDebut = watch("heureDebut");
  const heureFin = watch("heureFin");

  useEffect(() => {
    if (heureDebut && heureFin) {
      try {
        const debut = new Date(`1970-01-01T${heureDebut}:00`);
        const fin = new Date(`1970-01-01T${heureFin}:00`);

        if (fin > debut) {
          const diffMs = fin.getTime() - debut.getTime();
          const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
          setValue("tempsPresence", diffHours);
        }
      } catch (error) {
        // Invalid time format, ignore
      }
    }
  }, [heureDebut, heureFin, setValue]);

  useEffect(() => {
    if (isEdit && presence) {
      const formatTimeForInput = (timeString?: string) => {
        if (!timeString) return "";
        try {
          // Handle both full datetime and time-only formats
          const date = timeString.includes("T")
            ? new Date(timeString)
            : new Date(`1970-01-01T${timeString}`);
          return date.toTimeString().slice(0, 5); // HH:MM format
        } catch {
          return timeString;
        }
      };

      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0]; // YYYY-MM-DD format
        } catch {
          return dateString;
        }
      };

      reset({
        datePresence: formatDateForInput(presence.datePresence),
        heureDebut: formatTimeForInput(presence.heureDebut),
        heureFin: formatTimeForInput(presence.heureFin),
        statut: presence.statut || "Present",
        tempsPresence: presence.tempsPresence || 0,
        employe: presence.employe || "",
        ilot: presence.ilot || "",
      });
    }
  }, [isEdit, presence, reset]);

  const handleInputChange = (fieldName: keyof PresenceFormData) => {
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      clearErrors(fieldName);
    }
  };

  const onSubmit = async (data: PresenceFormData) => {
    try {
      setApiErrors({});

      if (isEdit && presenceId) {
        await updatePresence.mutateAsync({ id: presenceId, ...data });
      } else {
        await createPresence.mutateAsync(data);
      }
      router.push("/client/presences");
    } catch (error) {
      const apiError = error as ApiError;

      if (isValidationError(apiError)) {
        const formErrors = extractFormErrors(apiError);
        setApiErrors(formErrors);

        // Set form errors for react-hook-form
        Object.entries(formErrors).forEach(([field, message]) => {
          setError(field as keyof PresenceFormData, {
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
            customMessage: isEdit
              ? "Impossible de modifier la présence. Vérifiez vos données."
              : "Impossible de créer la présence. Vérifiez vos données.",
          });
        }
      }
    }
  };

  const isLoading =
    isSubmitting || createPresence.isLoading || updatePresence.isLoading;

  if (isEdit && isLoadingPresence) {
    return (
      <Card className="mx-4 sm:mx-0 max-w-2xl">
        <CardContent className="p-6">
          <LoadingSpinner text="Chargement de la présence..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          {isEdit ? "Modifier la présence" : "Créer une nouvelle présence"}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Date de présence"
              htmlFor="datePresence"
              error={errors.datePresence?.message || apiErrors.datePresence}
              required
            >
              <Input
                id="datePresence"
                type="date"
                {...register("datePresence", {
                  onChange: () => handleInputChange("datePresence"),
                })}
                className={
                  errors.datePresence || apiErrors.datePresence
                    ? "border-red-500"
                    : ""
                }
              />
            </FormField>

            <FormField
              label="Statut"
              htmlFor="statut"
              error={errors.statut?.message || apiErrors.statut}
              required
            >
              <Select
                value={watch("statut")}
                onValueChange={(value) => {
                  setValue("statut", value as any);
                  handleInputChange("statut");
                }}
              >
                <SelectTrigger
                  className={
                    errors.statut || apiErrors.statut ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUT_PRESENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Heure de début"
              htmlFor="heureDebut"
              error={errors.heureDebut?.message || apiErrors.heureDebut}
              required
            >
              <Input
                id="heureDebut"
                type="time"
                {...register("heureDebut", {
                  onChange: () => handleInputChange("heureDebut"),
                })}
                className={
                  errors.heureDebut || apiErrors.heureDebut
                    ? "border-red-500"
                    : ""
                }
              />
            </FormField>

            <FormField
              label="Heure de fin"
              htmlFor="heureFin"
              error={errors.heureFin?.message || apiErrors.heureFin}
              required
            >
              <Input
                id="heureFin"
                type="time"
                {...register("heureFin", {
                  onChange: () => handleInputChange("heureFin"),
                })}
                className={
                  errors.heureFin || apiErrors.heureFin ? "border-red-500" : ""
                }
              />
            </FormField>

            <FormField
              label="Temps de présence (heures)"
              htmlFor="tempsPresence"
              error={errors.tempsPresence?.message || apiErrors.tempsPresence}
              required
              description="Calculé automatiquement"
            >
              <Input
                id="tempsPresence"
                type="number"
                step="0.01"
                min="0"
                max="24"
                {...register("tempsPresence", {
                  valueAsNumber: true,
                  onChange: () => handleInputChange("tempsPresence"),
                })}
                className={
                  errors.tempsPresence || apiErrors.tempsPresence
                    ? "border-red-500"
                    : ""
                }
                readOnly
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Employé"
              htmlFor="employe"
              error={errors.employe?.message || apiErrors.employe}
              required
              description="ID ou référence de l'employé"
            >
              <Input
                id="employe"
                {...register("employe", {
                  onChange: () => handleInputChange("employe"),
                })}
                placeholder="Ex: /api/employes/123"
                className={
                  errors.employe || apiErrors.employe ? "border-red-500" : ""
                }
              />
            </FormField>

            <FormField
              label="Îlot"
              htmlFor="ilot"
              error={errors.ilot?.message || apiErrors.ilot}
              description="ID ou référence de l'îlot (optionnel)"
            >
              <Input
                id="ilot"
                {...register("ilot", {
                  onChange: () => handleInputChange("ilot"),
                })}
                placeholder="Ex: /api/ilots/46"
                className={
                  errors.ilot || apiErrors.ilot ? "border-red-500" : ""
                }
              />
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full sm:w-auto bg-transparent"
          >
            <Link href={APP_ROUTES.SECRETAIRE.PRESENCES}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Annuler
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={isLoading || (!isDirty && isEdit)}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : isEdit ? (
              "Mettre à jour"
            ) : (
              "Créer la présence"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
