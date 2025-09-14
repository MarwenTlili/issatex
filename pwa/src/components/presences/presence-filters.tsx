"use client";

import { useState } from "react";
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
import { Filter, X } from "lucide-react";
import { useActiveEmployes } from "@/hooks/use-employes";
import { useProductions } from "@/hooks/use-productions";
import type {
  PresenceFilters as PresenceFiltersType,
  StatutPresence,
} from "@/types/resources/Presence";

interface PresenceFiltersProps {
  filters: PresenceFiltersType;
  onFiltersChange: (filters: PresenceFiltersType) => void;
  onReset: () => void;
}

const statusOptions: { value: StatutPresence; label: string }[] = [
  { value: "Present", label: "Présent" },
  { value: "Absent", label: "Absent" },
  { value: "Retard", label: "Retard" },
  { value: "Conge", label: "Congé" },
];

export function PresenceFilters({
  filters,
  onFiltersChange,
  onReset,
}: PresenceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: employesData } = useActiveEmployes();
  const { data: productionsData } = useProductions("");

  const updateFilter = (
    key: keyof PresenceFiltersType,
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <X className="h-3 w-3 mr-1" />
                Réinitialiser
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Masquer" : "Afficher"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employe-filter">Employé</Label>
              <Select
                value={filters.employe || "all"}
                onValueChange={(value) => updateFilter("employe", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {employesData?.["member"]?.map((employe) => (
                    <SelectItem key={employe["@id"]} value={employe["@id"]}>
                      {employe.prenom} {employe.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="production-filter">Production</Label>
              <Select
                value={filters.production || "all"}
                onValueChange={(value) => updateFilter("production", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les productions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les productions</SelectItem>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut-filter">Statut</Label>
              <Select
                value={filters.statut || "all"}
                onValueChange={(value) =>
                  updateFilter("statut", value as StatutPresence)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Date</Label>
              <Input
                id="date-filter"
                type="date"
                value={filters.datePresence || ""}
                onChange={(e) => updateFilter("datePresence", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-after">Date de début</Label>
              <Input
                id="date-after"
                type="date"
                value={filters["datePresence[after]"] || ""}
                onChange={(e) =>
                  updateFilter("datePresence[after]", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-before">Date de fin</Label>
              <Input
                id="date-before"
                type="date"
                value={filters["datePresence[before]"] || ""}
                onChange={(e) =>
                  updateFilter("datePresence[before]", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
