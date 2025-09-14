import { Badge } from "@/components/ui/badge";
import type { StatutPresence } from "@/types/resources/Presence";

interface PresenceStatusBadgeProps {
  status: StatutPresence;
}

const statusConfig = {
  Present: {
    label: "Présent",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  Absent: {
    label: "Absent",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Retard: {
    label: "Retard",
    variant: "secondary" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  Conge: {
    label: "Congé",
    variant: "outline" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
};

export function PresenceStatusBadge({ status }: PresenceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
