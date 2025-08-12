"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useOrdreFabrication,
  useDeleteOrdreFabrication,
} from "@/hooks/use-ordre-fabrications";
import { useRouter } from "next/navigation";
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
import { useTailleOrdreFabrications } from "@/hooks/use-taille-ordre-fabrications";

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
  const { data: ordreFabrication, isLoading, error } = useOrdreFabrication(id);
  const { data: tailleOFsResponse } = useTailleOrdreFabrications(id);
  const deleteOrdreFabrication = useDeleteOrdreFabrication();

  const handleDelete = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer l&apos;ordre de fabrication?"
      )
    ) {
      deleteOrdreFabrication.mutate(id, {
        onSuccess: () => {
          router.push("/client/ordre-fabrications");
        },
      });
    }
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
      <Card className="mx-4 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center text-red-600 text-sm sm:text-base">
            {error
              ? `Error loading ordre fabrication: ${
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred"
                }`
              : "Ordre fabrication not found"}
          </div>
          <div className="flex justify-center mt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/client/ordre-fabrications">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ordre
                Fabrications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
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
                      ordreFabrication.dateCloture
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
            <Badge variant="outline">
              {ordreFabrication.article.split("/").pop()}
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
                        {tailleOF.quantite.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                Aucune information sur la taille n&apos;est disponible
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
                  {planning.split("/").pop()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/client/ordre-fabrications">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au list
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/client/ordre-fabrications/${id}/edit`}>
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
    </Card>
  );
}
