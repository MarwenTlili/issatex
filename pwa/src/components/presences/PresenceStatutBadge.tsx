import { PRESENCE_STATUT, PresenceStatutType } from "@/types/resources/Presence";
import { Badge } from "@/components/ui/badge";
import { twMerge } from "tailwind-merge";

export const PresenceStatutBadge = ({
  statut,
  className,
}: {
  statut: PresenceStatutType;
  className?: string;
}) => {
  const COLOR_VARIANTS = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
  } as const;
  const { label, twColor } = PRESENCE_STATUT[statut];

  return (
    <Badge
      variant="outline"
      className={twMerge(COLOR_VARIANTS[twColor], className)}
    >
      {label}
    </Badge>
  );
};
