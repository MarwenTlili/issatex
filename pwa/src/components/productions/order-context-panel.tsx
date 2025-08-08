"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  User,
  Package,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrdreFabricationByURI } from "@/hooks/use-ordre-fabrications";
import { useClientByUri } from "@/hooks/use-clients";
import { useArticleByURI } from "@/hooks/use-articles";
import { useTaillesByOrdreFabricationURI } from "@/hooks/use-taille-ordre-fabrications";
import { useProductions } from "@/hooks/use-productions";
import { OrderContext } from "@/types/resources/OrdreFabrication";
import {
  TailleArticle,
  TailleArticleEnum,
} from "@/types/resources/TailleOrdreFabrication";

interface OrderContextPanelProps {
  planningId: string;
  ordreFabricationUri: string;
  dateDebut: string;
  dateFin: string;
}

export function OrderContextPanel({
  planningId,
  ordreFabricationUri,
  dateDebut,
  dateFin,
}: OrderContextPanelProps) {
  const ordreFabricationId = ordreFabricationUri.split("/").pop() || "";

  const { data: ordreFabricationData, isLoading: loadingOrdre } =
    useOrdreFabricationByURI(ordreFabricationUri);
  const { data: clientData, isLoading: loadingClient } = useClientByUri(
    ordreFabricationData?.client || ""
  );
  const { data: articleData, isLoading: loadingArticle } = useArticleByURI(
    ordreFabricationData?.article || ""
  );
  const { data: taillesData, isLoading: loadingTailles } =
    useTaillesByOrdreFabricationURI(ordreFabricationId);
  const { data: productionsData } = useProductions(planningId);

  // Calculate working days (excluding weekends)
  const workingDays = useMemo(() => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0) {
        // Not Sunday (0)
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }, [dateDebut, dateFin]);

  // Calculate order context
  const orderContext = useMemo((): OrderContext | null => {
    if (!ordreFabricationData || !clientData || !articleData || !taillesData)
      return null;

    const taillesCommande = taillesData["member"] || [];
    const productions = productionsData?.["member"] || [];

    // Calculate daily targets
    const dailyTargets: { [key in TailleArticleEnum]?: number } = {};
    taillesCommande.forEach((taille) => {
      dailyTargets[taille.tailleArticle] = Math.ceil(
        taille.quantite / workingDays
      );
    });

    // Calculate current progress
    const currentProgress: Partial<Record<TailleArticleEnum, number>> = {};
    productions.forEach((production) => {
      const taille = production.tailleArticle as TailleArticleEnum;
      if (!currentProgress[taille]) {
        currentProgress[taille] = 0;
      }
      currentProgress[taille]! += production.quantiteTotale;
    });

    return {
      client: clientData,
      ordreFabrication: ordreFabricationData,
      article: articleData,
      taillesCommande,
      workingDays,
      dailyTargets,
      currentProgress,
    };
  }, [
    ordreFabricationData,
    clientData,
    articleData,
    taillesData,
    productionsData,
    workingDays,
  ]);

  const isLoading =
    loadingOrdre || loadingClient || loadingArticle || loadingTailles;

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Separator />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orderContext) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Impossible de charger les informations de l'ordre de fabrication
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    client,
    ordreFabrication,
    article,
    taillesCommande,
    dailyTargets,
    currentProgress,
  } = orderContext;

  const getProgressPercentage = (taille: TailleArticle, ordered: number) => {
    const produced = currentProgress[taille] || 0;
    return Math.min((produced / ordered) * 100, 100);
  };

  const getStatusIcon = (taille: TailleArticle, ordered: number) => {
    const produced = currentProgress[taille] || 0;
    const percentage = (produced / ordered) * 100;

    if (percentage >= 100) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    } else if (percentage >= 50) {
      return <TrendingUp className="h-4 w-4 text-orange-600" />;
    } else {
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Contexte de la commande
        </CardTitle>
        <CardDescription>
          Informations client et objectifs de production
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Client</h4>
          </div>
          <div className="pl-6 space-y-1">
            <p className="font-medium">{client.nom}</p>
            <p className="text-sm text-muted-foreground">
              Réf: {client.ref || "Non définie"}
            </p>
            {client.privilegie && (
              <Badge variant="secondary" className="text-xs">
                Client privilégié
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Order Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Commande</h4>
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Réf OF:</span>
              <Badge variant="outline">
                {ordreFabrication.ref || `#${ordreFabrication.id}`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Article:</span>
              <span className="text-sm font-medium">{article.designation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Statut:</span>
              <Badge
                variant={ordreFabrication.urgent ? "destructive" : "default"}
              >
                {ordreFabrication.urgent ? "Urgent" : ordreFabrication.statut}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Production Planning */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Planification</h4>
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Jours ouvrables:</span>
              <Badge variant="outline">{workingDays} jours</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Période:</span>
              <span className="text-xs text-muted-foreground">
                {new Date(dateDebut).toLocaleDateString("fr-FR")} -{" "}
                {new Date(dateFin).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Size Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Objectifs par taille</h4>
          </div>

          <div className="space-y-4">
            {taillesCommande.map((taille) => {
              const dailyTarget = dailyTargets[taille.tailleArticle] || 0;
              const produced = currentProgress[taille.tailleArticle] || 0;
              const progressPercentage = getProgressPercentage(
                taille.tailleArticle,
                taille.quantite
              );

              return (
                <div key={taille.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(taille.tailleArticle, taille.quantite)}
                      <Badge variant="outline" className="font-mono">
                        {taille.tailleArticle}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {produced}/{taille.quantite}
                    </span>
                  </div>

                  <Progress value={progressPercentage} className="h-2" />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Objectif quotidien: {dailyTarget}</span>
                    <span>{Math.round(progressPercentage)}% complété</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Résumé</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Total commandé:{" "}
              {taillesCommande.reduce((sum, t) => sum + t.quantite, 0)} articles
            </p>
            <p>
              Total produit:{" "}
              {Object.values(currentProgress).reduce(
                (sum, val) => sum + (val || 0),
                0
              )}{" "}
              articles
            </p>
            <p>
              Reste à produire:{" "}
              {taillesCommande.reduce((sum, t) => sum + t.quantite, 0) -
                Object.values(currentProgress).reduce(
                  (sum, val) => sum + (val || 0),
                  0
                )}{" "}
              articles
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
