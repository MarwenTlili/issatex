"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Calendar, Factory, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Planning } from "@/types/resources/Planning"
import { useOrdreFabrication } from "@/hooks/use-ordre-fabrications"
import { useIlot } from "@/hooks/use-ilots"
import { ProductionList } from "../productions/production-list"

interface PlanningCardProps {
  planning: Planning
  isOpen: boolean
  onToggle: () => void
}

export function PlanningCard({ planning, isOpen, onToggle }: PlanningCardProps) {
  const { data: ordreFabrication, isLoading: loadingOrdre } = useOrdreFabrication(planning.ordreFabrication)
  const { data: ilot, isLoading: loadingIlot } = useIlot(planning.ilot)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer rounded-md hover:bg-blue-200 transition-colors bg-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div>
                  <CardTitle className="text-lg">Planning {planning.ref || `#${planning.id}`}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(planning.dateDebut)} - {formatDate(planning.dateFin)}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Planning Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Ordre de fabrication:</span>
                  </div>
                  {loadingOrdre ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <p className="text-sm text-muted-foreground ml-6">{ordreFabrication?.ref || "Chargement..."}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Îlot:</span>
                  </div>
                  {loadingIlot ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <p className="text-sm text-muted-foreground ml-6">{ilot?.nom || "Chargement..."}</p>
                  )}
                </div>
              </div>

              {/* Productions */}
              <ProductionList
                planningId={planning.id.toString()}
                ordreFabricationUri={planning.ordreFabrication}
                dateDebut={planning.dateDebut}
                dateFin={planning.dateFin}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
