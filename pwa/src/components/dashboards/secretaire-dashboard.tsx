"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { usePresences } from "@/hooks/use-presences";
import { usePlannings } from "@/hooks/use-plannings";
import { format, isToday, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import type { Presence } from "@/types/resources/Presence";
import type { Planning } from "@/types/resources/Planning";
import { APP_ROUTES } from "@/config/app";

export function SecretaryDashboard() {
  const { data: presences, isLoading: presencesLoading } = usePresences({
    datePresence: {
      after: format(startOfDay(new Date()), "yyyy-MM-dd"),
      before: format(endOfDay(new Date()), "yyyy-MM-dd"),
    },
  });

  const { data: plannings, isLoading: planningsLoading } = usePlannings({});

  // const { data: employes, isLoading: employesLoading } = useActiveEmployes();

  const todayPresences =
    presences?.member?.filter((p: Presence) =>
      isToday(new Date(p.datePresence))
    ) || [];

  const presentCount = todayPresences.filter(
    (p: Presence) => p.statut === "Present"
  ).length;
  const absentCount = todayPresences.filter(
    (p: Presence) => p.statut === "Absent"
  ).length;
  const lateCount = todayPresences.filter(
    (p: Presence) => p.statut === "Retard"
  ).length;

  const activePlannings = plannings?.member || [];
  // const totalEmployees = employes?.member?.length || 0;

  const stats = [
    {
      title: "Employés Présents",
      value: presencesLoading ? "..." : presentCount.toString(),
      description: "Aujourd'hui",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Employés Absents",
      value: presencesLoading ? "..." : absentCount.toString(),
      description: "Aujourd'hui",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Retards",
      value: presencesLoading ? "..." : lateCount.toString(),
      description: "Aujourd'hui",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Productions Actives",
      value: planningsLoading ? "..." : activePlannings.length.toString(),
      description: "En cours",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tableau de Bord Secrétaire
          </h1>
          <p className="text-slate-600">
            Gestion des présences et planification des productions
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={APP_ROUTES.SECRETAIRE.PRESENCE_NEW}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Présence
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.description}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Presences */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Présences Récentes
                </CardTitle>
                <CardDescription>
                  Dernières présences enregistrées aujourd'hui
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={APP_ROUTES.SECRETAIRE.PRESENCES}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {presencesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : todayPresences.length > 0 ? (
              todayPresences.slice(0, 5).map((presence: Presence) => (
                <div
                  key={presence.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {presence.employe.ref}
                      </p>
                      <p className="text-sm text-slate-600">
                        {format(new Date(presence.datePresence), "dd/MM/yyyy", {
                          locale: fr,
                        })}{" "}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      presence.statut === "Present"
                        ? "default"
                        : presence.statut === "Absent"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {presence.statut === "Present"
                      ? "Présent"
                      : presence.statut === "Absent"
                      ? "Absent"
                      : presence.statut === "Retard"
                      ? "Retard"
                      : "Congé"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>Aucune présence enregistrée aujourd'hui</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Productions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Productions Actives
                </CardTitle>
                <CardDescription>
                  Planifications en cours de production
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={APP_ROUTES.SECRETAIRE.PRODUCTIONS}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Planifier
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {planningsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : activePlannings.length > 0 ? (
              activePlannings.slice(0, 5).map((planning: Planning) => (
                <div
                  key={planning.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{planning.ref}</p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(planning.dateDebut), "dd MMM yyyy", {
                        locale: fr,
                      })}{" "}
                      -
                      {format(new Date(planning.dateFin), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>Aucune production active</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto p-4 bg-transparent"
              asChild
            >
              <Link
                href={APP_ROUTES.SECRETAIRE.PRESENCES}
                className="flex flex-col items-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Gérer les Présences</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 bg-transparent"
              asChild
            >
              <Link
                href={APP_ROUTES.SECRETAIRE.PRODUCTIONS}
                className="flex flex-col items-center gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span>Planifier Production</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 bg-transparent"
              asChild
            >
              <Link
                href={APP_ROUTES.SECRETAIRE.SETTINGS}
                className="flex flex-col items-center gap-2"
              >
                <AlertCircle className="h-6 w-6" />
                <span>Paramètres</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
