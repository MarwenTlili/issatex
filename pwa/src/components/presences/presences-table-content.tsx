"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMobile } from "@/hooks/use-mobile";
import {
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Clock,
  User,
} from "lucide-react";
import type { ApiCollection } from "@/types/resources/ApiCollection";
import type { Presence, PresenceFieldOrder, PresencesFilters } from "@/types/resources/Presence";
import { APP_ROUTES } from "@/config/app";
import { formatDate, formatTime } from "@/lib/utils/date";

interface PresencesTableContentProps {
  presencesCollection?: ApiCollection<Presence>;
  isLoading: boolean;
  filters: PresencesFilters;
  onSort: (field: PresenceFieldOrder) => void;
  onDelete: (id: number, ref: string) => void;
  deleteLoading: boolean;
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

export function PresencesTableContent({
  presencesCollection,
  isLoading,
  filters,
  onSort,
  onDelete,
  deleteLoading,
}: PresencesTableContentProps) {
  const isMobile = useMobile();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, ref: string) => {
    setDeletingId(id);
    try {
      onDelete(id, ref);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner text="Chargement des présences..." />
      </div>
    );
  }

  const presences = presencesCollection?.member || [];

  if (presences.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          Aucune présence trouvée
        </div>
        <Button asChild>
          <Link href={APP_ROUTES.SECRETAIRE.PRESENCE_NEW}>
            Créer une présence
          </Link>
        </Button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {presences.map((presence) => (
          <div
            key={presence.id}
            className="border rounded-lg p-4 space-y-3 bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium text-sm">
                  {presence.ref || `PRE-${presence.id}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(presence.datePresence)}
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  STATUT_COLORS[
                    presence.statut as keyof typeof STATUT_COLORS
                  ] || "bg-gray-100 text-gray-800"
                }`}
              >
                {STATUT_LABELS[presence.statut as keyof typeof STATUT_LABELS] ||
                  presence.statut}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>
                  {formatTime(presence.heureDebut)} -{" "}
                  {formatTime(presence.heureFin)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">
                  {`${presence.employe?.nom} ${presence.employe.prenom} (${presence.employe.ref})` ||
                    "N/A"}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Temps: {presence.tempsPresence || 0}h
            </div>

            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={APP_ROUTES.SECRETAIRE.PRESENCE_DETAIL(presence.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={APP_ROUTES.SECRETAIRE.PRESENCE_EDIT(presence.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDelete(
                        presence.id!,
                        presence.ref || `PRE-${presence.id}`
                      )
                    }
                    disabled={deletingId === presence.id || deleteLoading}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("ref")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Référence
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("datePresence")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Horaires</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("statut")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Statut
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Temps</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("ilot.nom")}>
                Îlot
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presences.map((presence) => (
            <TableRow key={presence.id}>
              <TableCell className="font-medium">
                {presence.ref || `PRE-${presence.id}`}
              </TableCell>
              <TableCell>{formatDate(presence.datePresence)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatTime(presence.heureDebut)} -{" "}
                  {formatTime(presence.heureFin)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    STATUT_COLORS[
                      presence.statut as keyof typeof STATUT_COLORS
                    ] || "bg-gray-100 text-gray-800"
                  }
                >
                  {STATUT_LABELS[
                    presence.statut as keyof typeof STATUT_LABELS
                  ] || presence.statut}
                </Badge>
              </TableCell>
              <TableCell>{presence.tempsPresence || 0}h</TableCell>
              <TableCell>
                {`${presence.employe?.nom} ${presence.employe.prenom} (${presence.employe.ref})` ||
                  "N/A"}
              </TableCell>
              <TableCell>
                <div>{presence.ilot?.ref || "-"}</div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={APP_ROUTES.SECRETAIRE.PRESENCE_DETAIL(
                          presence.id
                        )}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={APP_ROUTES.SECRETAIRE.PRESENCE_EDIT(presence.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDelete(
                          presence.id!,
                          presence.ref || `PRE-${presence.id}`
                        )
                      }
                      disabled={deletingId === presence.id || deleteLoading}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
