import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type RHFCheckboxGroupProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: readonly string[];
  required?: boolean;
  className?: string;
};

export function RHFCheckboxGroup<T extends FieldValues>({
  label,
  name,
  control,
  options,
  required,
}: RHFCheckboxGroupProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const values = (field.value as string[] | undefined) ?? [];

        return (
          <div className="space-y-2">
            <Label>
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 md:grid-cols-4">
              {options.map((option) => {
                const id = `${String(name)}-${option
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`;

                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={values.includes(option)}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked === true
                            ? [...new Set([...values, option])]
                            : values.filter((value) => value !== option),
                        );
                      }}
                    />

                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>

            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
