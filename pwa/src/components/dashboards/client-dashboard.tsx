"use client";

import type React from "react";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Package,
  Factory,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  BarChart3,
} from "lucide-react";
import { useArticles } from "@/hooks/use-articles";
import { useOrdreFabrications } from "@/hooks/use-ordre-fabrications";
import { useCurrentClient } from "@/hooks/use-clients";
import { formatDate } from "@/lib/utils/date";
import { formatNumber } from "@/lib/utils/format";
import { APP_ROUTES } from "@/config/app";
import { OF_STATUT } from "@/types/resources/OrdreFabrication";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const { data: client } = useCurrentClient();
  const { data: articlesResponse, isLoading: isLoadingArticles } = useArticles({
    itemsPerPage: 5,
  });
  const { data: ordreFabricationsResponse, isLoading: isLoadingOrdres } =
    useOrdreFabrications({
      itemsPerPage: 5,
      order: { dateCreation: "desc" },
    });

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        title: "Nouveau Article",
        description: "Créer un nouvel article",
        icon: <Package className="h-5 w-5" />,
        href: APP_ROUTES.CLIENT.ARTICLE_NEW,
        color: "bg-blue-500",
      },
      {
        title: "Nouveau Ordre",
        description: "Créer un nouvel ordre",
        icon: <Factory className="h-5 w-5" />,
        href: APP_ROUTES.CLIENT.ORDRE_FABRICATION_NEW,
        color: "bg-green-500",
      },
      {
        title: "Voir les articles",
        description: "Gérer tous les articles",
        icon: <Eye className="h-5 w-5" />,
        href: APP_ROUTES.CLIENT.ARTICLES,
        color: "bg-purple-500",
      },
      {
        title: "Afficher les ordres",
        description: "Gérer les ordres",
        icon: <BarChart3 className="h-5 w-5" />,
        href: APP_ROUTES.CLIENT.ORDRE_FABRICATIONS,
        color: "bg-orange-500",
      },
    ],
    [],
  );

  const statistics = useMemo(() => {
    const articles = articlesResponse?.member || [];
    const ordreFabrications = ordreFabricationsResponse?.member || [];
    const totalArticles = articlesResponse?.totalItems || 0;
    const totalOrdreFabrications = ordreFabricationsResponse?.totalItems || 0;

    const urgentOrders = ordreFabrications.filter((of) => of.urgent).length;
    const completedOrders = ordreFabrications.filter(
      (of) => of.statut === "COMPLETE",
    ).length;
    const inProgressOrders = ordreFabrications.filter(
      (of) => of.statut === "EN_COURS",
    ).length;
    const plannedOrders = ordreFabrications.filter(
      (of) => of.statut === "PREVUE",
    ).length;
    const createdOrders = ordreFabrications.filter(
      (of) => of.statut === "BROUILLON",
    ).length;

    return {
      totalArticles,
      totalOrdreFabrications,
      urgentOrders,
      completedOrders,
      inProgressOrders,
      plannedOrders,
      createdOrders,
      articles,
      ordreFabrications,
    };
  }, [articlesResponse, ordreFabricationsResponse]);

  if (status === "loading" || isLoadingArticles || isLoadingOrdres) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
            <p className="text-muted-foreground mb-6">
              Veuillez vous connecter pour accéder à votre tableau de bord.
            </p>
            <Button asChild>
              <Link href={APP_ROUTES.LOGIN}>Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Content de te revoir, {session?.user?.name || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos opérations de fabrication pour{" "}
          <span className="font-bold">{client?.nom || "your company"}</span>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nombre total d&apos;articles
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(statistics.totalArticles)}
            </div>
            <p className="text-xs text-muted-foreground">
              Actif dans le catalogue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ordres de fabrication
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(statistics.totalOrdreFabrications)}
            </div>
            <p className="text-xs text-muted-foreground">Total des ordres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(statistics.inProgressOrders)}
            </div>
            <p className="text-xs text-muted-foreground">Actuellement actif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordres urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(statistics.urgentOrders)}
            </div>
            <p className="text-xs text-muted-foreground">
              Nécessite une attention particulière
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>Tâches courantes et raccourcis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                asChild
                className="w-full justify-start h-auto p-4 bg-transparent"
              >
                <Link href={action.href}>
                  <div
                    className={`p-2 rounded-md ${action.color} text-white mr-3`}
                  >
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Order Status Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Aperçu de l&apos;état de l&apos;ordre
            </CardTitle>
            <CardDescription>
              État actuel de vos commandes de fabrication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(statistics.createdOrders)}
                </div>
                <div className="text-sm text-muted-foreground">Créé</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {formatNumber(statistics.inProgressOrders)}
                </div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(statistics.completedOrders)}
                </div>
                <div className="text-sm text-muted-foreground">Complété</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {formatNumber(statistics.plannedOrders)}
                </div>
                <div className="text-sm text-muted-foreground">Planifié</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Articles récents
              </CardTitle>
              <CardDescription>Vos derniers articles</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={APP_ROUTES.CLIENT.ARTICLES}>Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {statistics.articles.length > 0 ? (
              <div className="space-y-4">
                {statistics.articles.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{article.designation}</div>
                      <div className="text-sm text-muted-foreground">
                        Ref: {article.ref}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatNumber(article.ordreFabrications?.length || 0)}{" "}
                      ordres
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun article pour le moment</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="mt-2 bg-transparent"
                >
                  <Link href={APP_ROUTES.CLIENT.ARTICLE_NEW}>
                    Créez votre premier article
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Manufacturing Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Ordres récentes
              </CardTitle>
              <CardDescription>Dernières ordres de fabrication</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={APP_ROUTES.CLIENT.ORDRE_FABRICATIONS}>Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {statistics.ordreFabrications.length > 0 ? (
              <div className="space-y-4">
                {statistics.ordreFabrications.slice(0, 5).map((of) => (
                  <div
                    key={of.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {of.urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{of.ref}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(of.dateCreation)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-xs ${OF_STATUT[of.statut].twColor}`}
                      >
                        {of.statut}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Qté: {formatNumber(of.quantiteTotale)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune ordre de fabrication pour le moment</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="mt-2 bg-transparent"
                >
                  <Link href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_NEW}>
                    Créez votre premier ordre de fabrication
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
