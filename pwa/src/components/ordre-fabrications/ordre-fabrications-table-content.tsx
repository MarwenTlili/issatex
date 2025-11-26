"use client";

import { memo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  OrdreFabrication,
  OrdreFabricationFilters,
} from "@/types/resources/OrdreFabrication";
import { ApiCollection } from "@/types/resources/ApiCollection";
import { APP_ROUTES } from "@/config/app";

interface OrdreFabricationsTableContentProps {
  ordreFabricationsResponse: ApiCollection<OrdreFabrication> | undefined;
  isLoading: boolean;
  filters: OrdreFabricationFilters;
  onSort: (field: "ref" | "dateCreation" | "statut") => void;
  onDelete: (id: number, ref: string) => void;
  deleteLoading: boolean;
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

export const OrdreFabricationsTableContent = memo(
  function OrdreFabricationsTableContent({
    ordreFabricationsResponse,
    isLoading,
    filters,
    onSort,
    onDelete,
    deleteLoading,
  }: OrdreFabricationsTableContentProps) {
    const ordreFabrications = ordreFabricationsResponse?.member || [];

    return (
      <>
        {/* Desktop Table */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => onSort("ref")}
                    className="h-auto p-0 font-semibold"
                  >
                    Reference
                    {filters.order?.ref === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => onSort("dateCreation")}
                    className="h-auto p-0 font-semibold"
                  >
                    Date Creation
                    {filters.order?.dateCreation === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => onSort("statut")}
                    className="h-auto p-0 font-semibold"
                  >
                    Status
                    {filters.order?.statut === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Urgent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">
                        Chargement de l&apos;ordre de fabrication...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : ordreFabrications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucun ordre de fabrication trouvé
                  </TableCell>
                </TableRow>
              ) : (
                ordreFabrications.map((of) => (
                  <TableRow key={of.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">{of.ref}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(of.dateCreation || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(of.statut || "")}>
                        {of.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {of.quantiteTotale && of.quantiteTotale.toLocaleString()}
                    </TableCell>
                    <TableCell>€{of.prixUnitaire}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {of.article.ref}
                    </TableCell>
                    <TableCell>
                      {of.urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" asChild>
                          <Link
                            href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_DETAIL(
                              `${of.id}`
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        {of.plannings.length === 0 && (
                          <>
                            <Button variant="outline" size="icon" asChild>
                              <Link
                                href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_EDIT(
                                  `${of.id}`
                                )}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                of.id && of.ref && onDelete(of.id, of.ref)
                              }
                              disabled={deleteLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">
                chargement des ordres de fabrication ...
              </span>
            </div>
          ) : ordreFabrications.length === 0 ? (
            <div className="text-center py-8">
              Aucun ordre de fabrication trouvé
            </div>
          ) : (
            ordreFabrications.map((of) => (
              <div key={of.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {of.urgent && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {of.ref}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          of.statut && getStatusColor(of.statut)
                        }`}
                      >
                        {of.statut}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(of.dateCreation || "").toLocaleDateString()}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_DETAIL(
                            `${of.id}`
                          )}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={APP_ROUTES.CLIENT.ORDRE_FABRICATION_EDIT(
                            `${of.id}`
                          )}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          of.id && of.ref && onDelete(of.id, of.ref)
                        }
                        disabled={deleteLoading}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <div className="font-medium">
                      {of.quantiteTotale && of.quantiteTotale.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit Price:</span>
                    <div className="font-medium">€{of.prixUnitaire}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    );
  }
);
