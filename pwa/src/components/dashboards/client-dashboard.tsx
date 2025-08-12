"use client";

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

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const { data: client } = useCurrentClient();
  const { data: articlesResponse } = useArticles({ itemsPerPage: 5 });
  const { data: ordreFabricationsResponse } = useOrdreFabrications({
    itemsPerPage: 5,
    order: { dateCreation: "desc" },
  });

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement du tableau de bord ...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your dashboard.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const articles = articlesResponse?.member || [];
  const ordreFabrications = ordreFabricationsResponse?.member || [];
  const totalArticles = articlesResponse?.totalItems || 0;
  const totalOrdreFabrications = ordreFabricationsResponse?.totalItems || 0;

  // Calculate statistics
  const urgentOrders = ordreFabrications.filter((of) => of.urgent).length;
  const completedOrders = ordreFabrications.filter(
    (of) => of.statut === "Terminee"
  ).length;
  const inProgressOrders = ordreFabrications.filter(
    (of) => of.statut === "En_cours"
  ).length;
  const plannedOrders = ordreFabrications.filter(
    (of) => of.statut === "Planifiee"
  ).length;

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

  const quickActions = [
    {
      title: "Nouveau Article",
      description: "Créer un nouvel article",
      icon: <Package className="h-5 w-5" />,
      href: "/client/articles/new",
      color: "bg-blue-500",
    },
    {
      title: "Nouveau Ordre",
      description: "Créer un nouvel ordre",
      icon: <Factory className="h-5 w-5" />,
      href: "/client/ordre-fabrications/new",
      color: "bg-green-500",
    },
    {
      title: "Voir les articles",
      description: "Gérer tous les articles",
      icon: <Eye className="h-5 w-5" />,
      href: "/client/articles",
      color: "bg-purple-500",
    },
    {
      title: "Afficher les ordres",
      description: "Gérer les ordres",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/client/ordre-fabrications",
      color: "bg-orange-500",
    },
  ];

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
            <div className="text-2xl font-bold">{totalArticles}</div>
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
            <div className="text-2xl font-bold">{totalOrdreFabrications}</div>
            <p className="text-xs text-muted-foreground">Total des ordres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders}</div>
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
              {urgentOrders}
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
                  {
                    ordreFabrications.filter((of) => of.statut === "Cree")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Créé</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {inProgressOrders}
                </div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {completedOrders}
                </div>
                <div className="text-sm text-muted-foreground">Complété</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {plannedOrders}
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
              <Link href="/client/articles">Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{article.designation}</div>
                      <div className="text-sm text-muted-foreground">
                        Ref: {article.ref}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {article.ordreFabrications?.length} ordres
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
                  <Link href="/client/articles/new">
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
              <Link href="/client/ordre-fabrications">Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ordreFabrications.length > 0 ? (
              <div className="space-y-4">
                {ordreFabrications.slice(0, 5).map((of) => (
                  <div
                    key={of.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {of.urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{of.ref}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(of.dateCreation).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getStatusColor(of.statut)}`}>
                        {of.statut}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Qté: {of.quantiteTotale.toLocaleString()}
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
                  <Link href="/client/ordre-fabrications/new">
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
