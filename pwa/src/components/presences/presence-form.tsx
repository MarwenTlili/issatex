"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { useEmployes } from "@/hooks/use-employes";
import { useIlots } from "@/hooks/use-ilots";
import { STATUT_PRESENCE_OPTIONS } from "@/types/resources/Presence";
import {
  type ApiError,
  handleApiError,
  extractFormErrors,
  isValidationError,
  type FormErrors,
} from "@/lib/api/handle-api-error";
import { APP_ROUTES } from "@/config/app";
import { formatDate, formatTime } from "@/lib/utils/date";
import { PresenceFormData, presenceSchema } from "@/lib/validation/schemas";

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
    control,
    setValue,
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

  const heureDebut = useWatch({ control, name: "heureDebut" });
  const heureFin = useWatch({ control, name: "heureFin" });

  const { data: presence, isLoading: isLoadingPresence } =
    usePresence(presenceId);
  const { data: employesData, isLoading: isLoadingEmployes } = useEmployes();
  const { data: ilotsData, isLoading: isLoadingIlots } = useIlots();

  const createPresence = useCreatePresence();
  const updatePresence = useUpdatePresence();

  useEffect(() => {
    if (heureDebut && heureFin) {
      const debut = new Date(`1970-01-01T${heureDebut}:00`);
      const fin = new Date(`1970-01-01T${heureFin}:00`);
      if (fin > debut) {
        const diffHours =
          Math.round(
            ((fin.getTime() - debut.getTime()) / (1000 * 60 * 60)) * 100
          ) / 100;
        setValue("tempsPresence", diffHours);
      }
    }
  }, [heureDebut, heureFin, setValue]);

  useEffect(() => {
    if (isEdit && presence && employesData && ilotsData) {
      setTimeout(() => {
        reset({
          datePresence: formatDate(presence.datePresence, "INPUT"),
          heureDebut: formatTime(presence.heureDebut),
          heureFin: formatTime(presence.heureFin),
          statut: presence.statut || "Present",
          tempsPresence: presence.tempsPresence || 0,
          employe: presence.employe["@id"] || "",
          ilot: presence.ilot["@id"] || "",
        });
      }, 0);
    }
  }, [isEdit, presence, employesData, ilotsData, reset]);

  const onSubmit = async (data: PresenceFormData) => {
    try {
      setApiErrors({});
      // console.log(data);
      if (isEdit && presenceId) {
        await updatePresence.mutateAsync({ id: presenceId, ...data });
      } else {
        await createPresence.mutateAsync(data);
      }
      router.push(APP_ROUTES.SECRETAIRE.PRESENCES);
    } catch (err) {
      const apiError = err as ApiError;
      if (isValidationError(apiError)) {
        const formErrors = extractFormErrors(apiError);
        setApiErrors(formErrors);
        Object.entries(formErrors).forEach(([field, message]) => {
          setError(field as keyof PresenceFormData, { type: "api", message });
        });
      } else {
        handleApiError(apiError, {
          customMessage: isEdit
            ? "Impossible de modifier la présence."
            : "Impossible de créer la présence.",
        });
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

  const employes = employesData?.member ?? [];
  const ilots = ilotsData?.member ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Modifier la présence" : "Créer une nouvelle présence"}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Date de présence"
              htmlFor="datePresence"
              error={errors.datePresence?.message || apiErrors.datePresence}
              required
            >
              <Input
                id="datePresence"
                type="date"
                {...register("datePresence")}
              />
            </FormField>

            <FormField
              label="Statut"
              htmlFor="statut"
              error={errors.statut?.message || apiErrors.statut}
              required
            >
              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    key={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUT_PRESENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              label="Heure de début"
              htmlFor="heureDebut"
              error={errors.heureDebut?.message || apiErrors.heureDebut}
              required
            >
              <Input
                id="heureDebut"
                type="time"
                lang="fr-FR"
                {...register("heureDebut")}
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
                lang="fr-FR"
                {...register("heureFin")}
              />
            </FormField>

            <FormField
              label="Temps de présence (heures)"
              htmlFor="tempsPresence"
              error={errors.tempsPresence?.message || apiErrors.tempsPresence}
              required
            >
              <Input
                id="tempsPresence"
                type="number"
                readOnly
                {...register("tempsPresence", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Employé"
              htmlFor="employe"
              error={errors.employe?.message || apiErrors.employe}
              required
            >
              <Controller
                name="employe"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={isLoadingEmployes}
                    key={field.value || "empty"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employes.map((e) => (
                        <SelectItem key={e.id} value={e["@id"]}>
                          {e.prenom} {e.nom} ({e.ref})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Îlot"
              htmlFor="ilot"
              required
              error={errors.ilot?.message || apiErrors.ilot}
            >
              <Controller
                name="ilot"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                    disabled={isLoadingIlots}
                    key={field.value || "none"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un îlot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun îlot</SelectItem>
                      {ilots.map((i) => (
                        <SelectItem key={i.id} value={i["@id"]}>
                          {i.nom} ({i.ref})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={APP_ROUTES.SECRETAIRE.PRESENCES}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Annuler
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading || (isEdit && !isDirty)}>
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : isEdit ? (
              "Mettre à jour"
            ) : (
              "Créer"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
