import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  children,
  error,
  description,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      {children}

      {description && !error && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Info className="h-3 w-3" />
          {description}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}
