import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type RHFSelectProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  placeholder?: string;
  options: readonly string[];
  required?: boolean;
};

export function RHFSelect<T extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  options,
  required,
}: RHFSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className={cn(fieldState.error && "border-red-500")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
