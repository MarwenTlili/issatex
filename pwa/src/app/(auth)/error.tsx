"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ClientRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log telemetry here
    console.error("Route Boundary Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-xl font-bold tracking-tight text-destructive">
        {"Une erreur s'est produite"}
      </h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message ||
          "Nous ne parvenons pas à charger cette page pour le moment."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        {"Réessayer"}
      </Button>
    </div>
  );
}
