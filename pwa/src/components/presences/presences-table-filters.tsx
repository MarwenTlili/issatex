"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter, Check, ChevronsUpDown } from "lucide-react";
import type { PresencesFilters } from "@/types/resources/Presence";
import { STATUT_PRESENCE_OPTIONS } from "@/types/resources/Presence";
import { useEmployes } from "@/hooks/use-employes";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIlots } from "@/hooks/use-ilots";
import { SelectLabel } from "@radix-ui/react-select";

interface PresencesTableFiltersProps {
  filters: PresencesFilters;
  onFilterChange: (filters: Partial<PresencesFilters>) => void;
}

export function PresencesTableFilters({
  filters,
  onFilterChange,
}: PresencesTableFiltersProps) {
  const { data: employesCollection } = useEmployes();
  const { data: ilotsCollection } = useIlots();

  const [localFilters, setLocalFilters] = useState({
    ref: filters.ref || "",
    statut: filters.statut || "all",
    dateAfter: filters.datePresence?.after || "",
    dateBefore: filters.datePresence?.before || "",
    employe: filters.employe || "",
    ilot: filters.ilot || "",
  });

  const employes = employesCollection?.member || [];
  const selectedEmploye = employes.find(
    (emp) => emp.id === Number.parseInt(localFilters.employe)
  );

  const ilots = ilotsCollection?.member || [];

  const [showFilters, setShowFilters] = useState(false);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleApplyFilters = () => {
    const newFilters: Partial<PresencesFilters> = {};

    if (localFilters.ref) newFilters.ref = localFilters.ref;
    newFilters.statut =
      localFilters.statut !== "all" ? localFilters.statut : undefined;

    if (localFilters.dateAfter || localFilters.dateBefore) {
      newFilters.datePresence = {};
      if (localFilters.dateAfter)
        newFilters.datePresence.after = localFilters.dateAfter;
      if (localFilters.dateBefore)
        newFilters.datePresence.before = localFilters.dateBefore;
    }

    newFilters.employe = localFilters.employe || "";
    newFilters.ilot = localFilters.ilot || "";

    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      ref: "",
      statut: "all",
      dateAfter: "",
      dateBefore: "",
      employe: "",
      ilot: "",
    });
    setSearchTerm("");
    onFilterChange({
      ref: undefined,
      statut: undefined,
      datePresence: undefined,
      employe: undefined,
      ilot: undefined,
    });
  };

  // Filter employees based on search term
  const filteredEmployes = useMemo(() => {
    if (!searchTerm) return employes;

    return employes.filter(
      (employe) =>
        employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employe.ref.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employes, searchTerm]);

  const hasActiveFilters =
    filters.ref ||
    filters.datePresence?.before ||
    filters.datePresence?.after ||
    (filters.statut && filters.statut !== "all") ||
    filters.datePresence ||
    filters.employe ||
    filters.ilot;

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* per page */}
          <Select
            value={filters.itemsPerPage?.toString() || "10"}
            onValueChange={(value) =>
              onFilterChange({ itemsPerPage: Number.parseInt(value) })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 par page</SelectItem>
              <SelectItem value="10">10 par page</SelectItem>
              <SelectItem value="20">20 par page</SelectItem>
              <SelectItem value="50">50 par page</SelectItem>
            </SelectContent>
          </Select>

          {/* ref Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par référence..."
              value={localFilters.ref}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, ref: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyFilters();
                }
              }}
              className={cn("pl-10", localFilters.ref && "pr-10")}
            />
            {localFilters.ref && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalFilters((prev) => ({ ...prev, ref: "" }));
                  onFilterChange({ ref: undefined });
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* filter action */}
        <div className="flex md:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {
                  Object.keys(filters).filter(
                    (key) =>
                      key !== "page" &&
                      key !== "itemsPerPage" &&
                      key !== "order" &&
                      filters[key as keyof PresencesFilters]
                  ).length
                }
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* filter fields */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Statuts */}
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <div className="relative">
                  <Select
                    value={localFilters.statut}
                    onValueChange={(value) =>
                      setLocalFilters((prev) => ({ ...prev, statut: value }))
                    }
                  >
                    <SelectTrigger
                      className={cn(localFilters.statut !== "all" && "pr-10")}
                    >
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {STATUT_PRESENCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {localFilters.statut !== "all" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLocalFilters((prev) => ({ ...prev, statut: "all" }));
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted z-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Date de début */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date de début
                </label>
                <Input
                  type="date"
                  value={localFilters.dateAfter}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateAfter: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Date de fin */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date de fin
                </label>
                <Input
                  type="date"
                  value={localFilters.dateBefore}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateBefore: e.target.value,
                    }))
                  }
                />
              </div>

              {/* employe select with autocomplete */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Employé
                </label>
                <div className="relative">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-full justify-between",
                          selectedEmploye && "pr-10"
                        )}
                      >
                        {selectedEmploye
                          ? `${selectedEmploye.nom} ${selectedEmploye.prenom} (${selectedEmploye.ref})`
                          : "Tous les employés"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un employé..."
                          value={searchTerm}
                          onValueChange={setSearchTerm}
                        />
                        <CommandList>
                          <CommandEmpty>Aucun employé trouvé.</CommandEmpty>
                          <CommandGroup>
                            {/* Option Tous les employés */}
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setLocalFilters((prev) => ({
                                  ...prev,
                                  employe: "", // vide = pas de filtre employé
                                }));
                                setOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  localFilters.employe === ""
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              Tous les employés
                            </CommandItem>

                            {/* Liste des employés */}
                            {filteredEmployes.map((employe) => (
                              <CommandItem
                                key={employe.id}
                                value={employe.id.toString()}
                                onSelect={(currentValue) => {
                                  setLocalFilters((prev) => ({
                                    ...prev,
                                    employe:
                                      currentValue === localFilters.employe
                                        ? ""
                                        : currentValue, // toggle
                                  }));
                                  setOpen(false);
                                  setSearchTerm("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    localFilters.employe ===
                                      employe.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {`${employe.nom} ${employe.prenom} (${employe.ref})`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedEmploye && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocalFilters((prev) => ({ ...prev, employe: "" }));
                        setSearchTerm("");
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted z-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* ilot select filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ilot</label>
                <div className="relative">
                  <Select
                    value={localFilters.ilot || "all"}
                    onValueChange={(value) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        ilot: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={cn("w-full", localFilters.ilot && "pr-10")}
                    >
                      <SelectValue placeholder="Tous les ilots" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tous les ilots</SelectItem>
                        {ilots.map((ilot) => (
                          <SelectItem key={ilot.id} value={`${ilot.id}`}>
                            {ilot.nom} ({ilot.ref})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {localFilters.ilot && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLocalFilters((prev) => ({ ...prev, ilot: "" }));
                        onFilterChange({ ilot: undefined });
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted z-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* appliquer les filter */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Annuler
              </Button>
              <Button onClick={handleApplyFilters}>
                Appliquer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
