"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, Edit, Trash2 } from "lucide-react";
import { PresenceStatusBadge } from "./presence-status-badge";
import type { Presence } from "@/types/resources/Presence";
import { formatDate, formatTime } from "@/lib/utils/date";

interface PresenceCardProps {
  presence: Presence;
  onEdit?: (presence: Presence) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export function PresenceCard({
  presence,
  onEdit,
  onDelete,
  isLoading,
}: PresenceCardProps) {
  const employeeName = presence.employe
    ? `${presence.employe.split("/").pop()}`
    : // Extract ID from URI
      "Employé inconnu";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Employé #{employeeName}
          </CardTitle>
          <PresenceStatusBadge status={presence.statut} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(presence.datePresence)}</span>
        </div>

        {presence.heureDebut && presence.heureFin && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <div>
              {formatTime(presence.heureDebut)} -{" "}
              {formatTime(presence.heureFin)}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {presence.tempsPresence}h de présence
          </Badge>

          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(presence)}
                disabled={isLoading}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(presence.id)}
                disabled={isLoading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
