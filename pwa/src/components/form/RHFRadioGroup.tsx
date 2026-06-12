import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type RHFRadioGroupProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  options: readonly string[];
  required?: boolean;
};

export function RHFRadioGroup<T extends FieldValues>({
  label,
  name,
  control,
  options,
  required,
}: RHFRadioGroupProps<T>) {
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
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
          >
            {options.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem id={value} value={value} />
                <Label htmlFor={value} className="font-normal cursor-pointer">
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
