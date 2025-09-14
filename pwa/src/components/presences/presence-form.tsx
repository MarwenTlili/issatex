"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import { useActiveEmployes } from "@/hooks/use-employes";
import { useProductions } from "@/hooks/use-productions";
import type {
  CreatePresenceData,
  UpdatePresenceData,
  StatutPresence,
} from "@/types/resources/Presence";
import { PresenceFormData, presenceSchema } from "@/lib/validation/schemas";

interface PresenceFormProps {
  initialData?: Partial<PresenceFormData>;
  onSubmit: (data: CreatePresenceData | UpdatePresenceData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

const statusOptions: { value: StatutPresence; label: string }[] = [
  { value: "Present", label: "Présent" },
  { value: "Absent", label: "Absent" },
  { value: "Retard", label: "Retard" },
  { value: "Conge", label: "Congé" },
];

export function PresenceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode = "create",
}: PresenceFormProps) {
  const { data: employesData } = useActiveEmployes();
  const { data: productionsData } = useProductions("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PresenceFormData>({
    resolver: zodResolver(presenceSchema),
    defaultValues: {
      datePresence:
        initialData?.datePresence || new Date().toISOString().split("T")[0],
      heureDebut: initialData?.heureDebut || "",
      heureFin: initialData?.heureFin || "",
      statut: initialData?.statut || "Present",
      tempsPresence: initialData?.tempsPresence || 8,
      employe: initialData?.employe || "",
      production: initialData?.production || "",
    },
  });

  const watchedStatus = watch("statut");
  const watchedHeureDebut = watch("heureDebut");
  const watchedHeureFin = watch("heureFin");

  // Auto-calculate tempsPresence when start and end times change
  const calculateHours = () => {
    if (watchedHeureDebut && watchedHeureFin) {
      const start = new Date(`2000-01-01T${watchedHeureDebut}`);
      const end = new Date(`2000-01-01T${watchedHeureFin}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));
      setValue("tempsPresence", Math.round(diffHours * 100) / 100);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {mode === "create" ? "Nouvelle présence" : "Modifier la présence"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="datePresence">Date de présence</Label>
              <div className="relative">
                <Input
                  id="datePresence"
                  type="date"
                  {...register("datePresence")}
                  className="pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.datePresence && (
                <p className="text-sm text-destructive">
                  {errors.datePresence.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value: StatutPresence) =>
                  setValue("statut", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.statut && (
                <p className="text-sm text-destructive">
                  {errors.statut.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heureDebut">Heure de début</Label>
              <Input
                id="heureDebut"
                type="time"
                {...register("heureDebut")}
                onChange={(e) => {
                  setValue("heureDebut", e.target.value);
                  setTimeout(calculateHours, 100);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heureFin">Heure de fin</Label>
              <Input
                id="heureFin"
                type="time"
                {...register("heureFin")}
                onChange={(e) => {
                  setValue("heureFin", e.target.value);
                  setTimeout(calculateHours, 100);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempsPresence">Temps de présence (heures)</Label>
              <Input
                id="tempsPresence"
                type="number"
                step="0.25"
                min="0"
                max="24"
                {...register("tempsPresence", { valueAsNumber: true })}
              />
              {errors.tempsPresence && (
                <p className="text-sm text-destructive">
                  {errors.tempsPresence.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employe">Employé</Label>
              <Select
                value={watch("employe")}
                onValueChange={(value) => setValue("employe", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employesData?.["member"]?.map((employe) => (
                    <SelectItem key={employe["@id"]} value={employe["@id"]}>
                      {employe.prenom} {employe.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employe && (
                <p className="text-sm text-destructive">
                  {errors.employe.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="production">Production</Label>
              <Select
                value={watch("production")}
                onValueChange={(value) => setValue("production", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une production" />
                </SelectTrigger>
                <SelectContent>
                  {productionsData?.["member"]?.map((production) => (
                    <SelectItem
                      key={production["@id"]}
                      value={production["@id"]}
                    >
                      {production.ref || `Production #${production.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.production && (
                <p className="text-sm text-destructive">
                  {errors.production.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : mode === "create"
                ? "Créer"
                : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
