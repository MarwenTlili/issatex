"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import { usePresence, useDeletePresence } from "@/hooks/use-presences";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { isApiError, getErrorMessage } from "@/lib/api/handle-api-error";
import { STATUT_PRESENCE_OPTIONS } from "@/types/resources/Presence";
import { APP_ROUTES } from "@/config/app";
import { formatDate, formatDecimalHours, formatTime } from "@/lib/utils/date";

interface PresenceDetailsProps {
  id: number;
}

const STATUT_COLORS = {
  Present: "bg-green-100 text-green-800 border-green-200",
  Absent: "bg-red-100 text-red-800 border-red-200",
  Retard: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Conge: "bg-blue-100 text-blue-800 border-blue-200",
} as const;

const STATUT_LABELS = {
  Present: "Présent",
  Absent: "Absent",
  Retard: "Retard",
  Conge: "Congé",
} as const;

export function PresenceDetails({ id }: PresenceDetailsProps) {
  const router = useRouter();
  const { data: presence, isLoading, error } = usePresence(id);
  const deletePresence = useDeletePresence();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleDelete = async () => {
    setDialogData({
      title: "Supprimer la présence",
      description: `Êtes-vous sûr de vouloir supprimer la présence ${presence?.ref} ?`,
      actionLabel: "Supprimer",
      onConfirm: async () => {
        try {
          await deletePresence.mutateAsync(id);
          setOpenConfirmDialog(false);
          router.push(APP_ROUTES.SECRETAIRE.PRESENCES);
        } catch (error) {
          if (
            isApiError(error) &&
            ((error.status && error.status >= 500) || !error.status)
          ) {
            throw new Error(error.title || error.detail || "Server error");
          }
          setOpenConfirmDialog(false);
        }
      },
    });
    setOpenConfirmDialog(true);
  };

  if (isLoading) {
    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">Chargement de la présence...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !presence) {
    const message = isApiError(error)
      ? getErrorMessage(error)
      : (error as Error)?.message ?? "Erreur inconnue";

    if (
      isApiError(error) &&
      ((error.status && error.status >= 500) || !error.status)
    ) {
      throw new Error(error.title || error.detail || "Server error");
    }

    return (
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            {message}
          </div>
          <div className="flex justify-center mt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href={APP_ROUTES.SECRETAIRE.PRESENCES}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux présences
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statutOption = STATUT_PRESENCE_OPTIONS.find(
    (opt) => opt.value === presence.statut
  );

  return (
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span>{presence?.ref || `PRE-${presence?.id}`}</span>
              <Badge
                variant="outline"
                className={`${
                  STATUT_COLORS[
                    presence.statut as keyof typeof STATUT_COLORS
                  ] || "bg-gray-100 text-gray-800"
                }`}
              >
                {STATUT_LABELS[presence.statut as keyof typeof STATUT_LABELS] ||
                  presence.statut}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Date de présence</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(presence.datePresence)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Horaires</h3>
                <p className="text-sm text-muted-foreground">
                  {formatTime(presence.heureDebut)} -{" "}
                  {formatTime(presence.heureFin)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Temps de présence</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDecimalHours(presence.tempsPresence)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Employé</h3>
                <p className="text-sm text-muted-foreground">
                  {`${presence.employe?.nom} ${presence.employe.prenom} (${presence.employe.ref})` ||
                    "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Îlot</h3>
                <p className="text-sm text-muted-foreground">
                  {`${presence.ilot?.nom} (${presence.ilot?.ref})` ||
                    "Non assigné"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {statutOption && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Informations sur le statut</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statutOption.color}>
                {statutOption.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Statut de présence pour cette journée
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto bg-transparent"
        >
          <Link href={APP_ROUTES.SECRETAIRE.PRESENCES}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux présences
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto bg-transparent"
          >
            <Link href={APP_ROUTES.SECRETAIRE.PRESENCE_EDIT(id)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePresence.isLoading}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </CardFooter>

      {openConfirmDialog && dialogData && (
        <ConfirmDialog
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          title={dialogData.title}
          description={dialogData.description}
          actionLabel={dialogData.actionLabel}
          onConfirm={dialogData.onConfirm}
        />
      )}
    </Card>
  );
}
