import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mapError } from "@/lib/api/handle-api-error";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  backUrl?: string;
  backLabel?: string;
}

export function ErrorState({
  error,
  onRetry,
  backUrl,
  backLabel = "Retour",
}: ErrorStateProps) {
  const { title, message } = mapError(error);

  return (
    <Card className="mx-4 sm:mx-0 border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4">
        <div className="rounded-full bg-muted p-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h3 className="font-semibold text-lg sm:text-xl tracking-tight">
            {title}
          </h3>
          {message && (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          )}

          {backUrl && (
            <Button asChild className="w-full sm:w-auto">
              <Link href={backUrl}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
