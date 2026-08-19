"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  Package,
  Clock,
  Euro,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ErrorState } from "@/components/common/error-state";

import {
  useOrdreFabrication,
  useDeleteOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { useTaillesByOrdreFabrication } from "@/hooks/use-taille-ordre-fabrications";
import { handleApiError } from "@/lib/api/handle-api-error";

import { APP_ROUTES, MESSAGES } from "@/config/app";

interface OrdreFabricationDetailsProps {
  id: number;
}

const getStatusColor = (statut: string) => {
  switch (statut) {
    case "Cree":
      return "bg-blue-100 text-blue-800";
    case "En Cours":
      return "bg-yellow-100 text-yellow-800";
    case "Terminee":
      return "bg-green-100 text-green-800";
    case "Annule":
      return "bg-red-100 text-red-800";
    case "En Attente":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function OrdreFabricationDetails({ id }: OrdreFabricationDetailsProps) {
  const router = useRouter();
  const {
    data: ordreFabrication,
    isLoading,
    refetch,
    error,
  } = useOrdreFabrication(id);
  const { data: tailleOFsResponse } = useTaillesByOrdreFabrication(id);
  const deleteOrdreFabrication = useDeleteOrdreFabrication();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
    actionLabel?: string;
  } | null>(null);

  const handleDelete = async () => {
    setDialogData({
      title: MESSAGES.ACTION.DELETE,
      description: `${MESSAGES.DIALOG.ORDRE_FABRICATION_DELETE} ${ordreFabrication?.ref}`,
      actionLabel: MESSAGES.ACTION.DELETE,
      onConfirm: async () => {
        try {
          await deleteOrdreFabrication.mutateAsync(id);
          setOpenConfirmDialog(false);
          toast.success(MESSAGES.SUCCESS.ORDRE_FABRICATION_DELETED, {
            description:
              "L'ordre de fabrication a été supprimé de votre collection.",
          });
          router.push(APP_ROUTES.CLIENT.ORDRE_FABRICATIONS);
        } catch (error) {
          handleApiError(error, "L'Ordre ne peut pa être supprimer.");
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
          <div className="text-center">
            Chargement des détails de l&apos;ordre fabrication ...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !ordreFabrication) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        backUrl={APP_ROUTES.CLIENT.ORDRE_FABRICATIONS}
      />
    );
  }

  const tailleOFs = tailleOFsResponse?.member || [];

  return (
    <Card className="mx-4 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {ordreFabrication.urgent && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <CardTitle className="text-xl sm:text-2xl break-words">
                {ordreFabrication.ref}
              </CardTitle>
            </div>
            <Badge
              className={`w-fit ${getStatusColor(ordreFabrication.statut)}`}
            >
              {ordreFabrication.statut}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">
                  Date Création:
                </span>
                <div className="font-medium">
                  {new Date(ordreFabrication.dateCreation).toLocaleDateString()}
                </div>
              </div>
            </div>
            {ordreFabrication.dateCloture && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">
                    Date Cloture:
                  </span>
                  <div className="font-medium">
                    {new Date(
                      ordreFabrication.dateCloture,
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">
                  Quantité Totale:
                </span>
                <div className="font-medium">
                  {ordreFabrication.quantiteTotale.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">
                  Prix Unitaire:
                </span>
                <div className="font-medium">
                  €{ordreFabrication.prixUnitaire}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">
                  Temps Unitaire:
                </span>
                <div className="font-medium">
                  {ordreFabrication.tempsUnitaire} cmn
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Information */}
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">Article</h3>
          <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
            <Badge className="text-md">
              <Link
                href={APP_ROUTES.CLIENT.ARTICLE_DETAIL(
                  Number(ordreFabrication.article.id),
                )}
              >
                {`${ordreFabrication.article?.ref} - ${ordreFabrication.article?.designation}`}
              </Link>
            </Badge>
          </div>
        </div>

        {/* Size Details */}
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">
            Configuration des Quantités/Tailles
          </h3>
          <div className="space-y-2">
            {tailleOFs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tailleOFs.map((tailleOF) => (
                  <div key={tailleOF.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-sm">
                        Size {tailleOF.tailleArticle}
                      </Badge>
                      <span className="font-medium">
                        {`Qté: ${tailleOF.quantite.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                {"Aucune information sur la taille n'est disponible"}
              </p>
            )}
          </div>
        </div>

        {/* Plannings */}
        {ordreFabrication.plannings.length > 0 && (
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Plannings</h3>
            <div className="flex flex-wrap gap-2">
              {ordreFabrication.plannings.map((planning, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {planning.ref}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={APP_ROUTES.CLIENT.ORDRE_FABRICATIONS}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au list
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_EDIT(id)}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteOrdreFabrication.isLoading}
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
