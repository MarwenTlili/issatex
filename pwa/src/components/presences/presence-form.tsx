"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  diffHours,
  formatDate,
  formatDecimalHours,
  formatTime,
} from "@/lib/utils/date";
import { PresenceFormData, presenceSchema } from "@/lib/validation/schemas";
import { useAffectationEmployeIlot } from "@/hooks/use-affectation-employe-ilot";

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
      heureDebut: null,
      heureFin: null,
      statut: "Present",
      tempsPresence: null,
      tempsPresenceText: "",
      employe: "",
      ilot: "",
    },
  });

  const heureDebut = useWatch({ control, name: "heureDebut" });
  const heureFin = useWatch({ control, name: "heureFin" });

  const { data: presence, isLoading: isLoadingPresence } =
    usePresence(presenceId);
  const { data: ilotsData, isLoading: isLoadingIlots } = useIlots();

  const createPresence = useCreatePresence();
  const updatePresence = useUpdatePresence();

  const ilot = useWatch({ control, name: "ilot" });

  const { data: affectationsEmployeIlot, isLoading: affectationsIsLoading } =
    useAffectationEmployeIlot({ ilot });

  const employesForIlot = useMemo(() => {
    if (!affectationsEmployeIlot || !ilot) return [];
    return affectationsEmployeIlot.member.map((a) => a.employe);
  }, [affectationsEmployeIlot, ilot]);

  const statut = useWatch({ control, name: "statut" });

  // --- 1️⃣ Handle edit mode (loading + ilot setup + form reset) ---
  useEffect(() => {
    if (!isEdit || !presence) return;

    // Step 1: set ilot first (to trigger employes loading)
    if (presence.ilot?.["@id"]) {
      setValue("ilot", presence.ilot["@id"]);
    }

    // Step 2: when employes are ready, reset the form
    if (ilotsData && employesForIlot.length > 0) {
      reset({
        datePresence: formatDate(presence.datePresence, "INPUT"),
        heureDebut: presence.heureDebut
          ? formatTime(presence.heureDebut)
          : null,
        heureFin: presence.heureFin ? formatTime(presence.heureFin) : null,
        statut: presence.statut || "Present",
        tempsPresence: presence.tempsPresence || null,
        employe: presence.employe?.["@id"] || "",
        ilot: presence.ilot?.["@id"] || "",
      });
    }
  }, [isEdit, presence, ilotsData, employesForIlot, reset, setValue]);

  // --- 2️⃣ Handle statut changes (auto-reset for Absent / Congé) ---
  useEffect(() => {
    if (["Absent", "Conge"].includes(statut)) {
      setValue("heureDebut", null);
      setValue("heureFin", null);
      setValue("tempsPresence", null);
      setValue("tempsPresenceText", "");
    }
  }, [statut, setValue]);

  // --- 3️⃣ Compute tempsPresence automatically ---
  useEffect(() => {
    // Only compute if statut allows time tracking
    if (["Absent", "Conge"].includes(statut)) return;

    const diff = diffHours(heureDebut, heureFin);
    setValue("tempsPresence", diff);
    setValue("tempsPresenceText", formatDecimalHours(diff));
  }, [heureDebut, heureFin, statut, setValue]);

  const onSubmit = async (data: PresenceFormData) => {
    try {
      setApiErrors({});

      // remove tempsPresenceText (UI only)
      const { tempsPresenceText, ...payload } = data;

      // Normalize heures based on statut
      if (["Absent", "Conge"].includes(payload.statut)) {
        payload.heureDebut = null as any;
        payload.heureFin = null as any;
      }

      if (isEdit && presenceId) {
        await updatePresence.mutateAsync({ id: presenceId, ...payload });
      } else {
        await createPresence.mutateAsync(payload);
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
            >
              <Input
                id="heureDebut"
                type="time"
                lang="fr-FR"
                {...register("heureDebut")}
                disabled={["Absent", "Conge"].includes(statut)}
              />
            </FormField>

            <FormField
              label="Heure de fin"
              htmlFor="heureFin"
              error={errors.heureFin?.message || apiErrors.heureFin}
            >
              <Input
                id="heureFin"
                type="time"
                lang="fr-FR"
                {...register("heureFin")}
                disabled={["Absent", "Conge"].includes(statut)}
              />
            </FormField>

            <FormField
              label="Temps de présence (h)"
              htmlFor="tempsPresenceText"
            >
              <Input
                id="tempsPresenceText"
                type="string"
                {...register("tempsPresenceText")}
                readOnly
              />
            </FormField>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
                    disabled={affectationsIsLoading}
                    key={field.value || "empty"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employesForIlot.map((e) => (
                        <SelectItem key={e.id} value={e["@id"]}>
                          {e?.prenom} {e?.nom} ({e?.ref})
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
