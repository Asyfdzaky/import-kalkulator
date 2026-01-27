import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export function PercentageInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  className,
}: PercentageInputProps) {
  return (
    <div className={cn("input-wrapper", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <NumericFormat
        id={id}
        customInput={Input}
        suffix=" %"
        decimalSeparator=","
        placeholder={placeholder}
        value={value || ""}
        onValueChange={(values) => {
          onChange(values.floatValue || 0);
        }}
        className="bg-card"
        allowNegative={false}
        decimalScale={2}
      />
    </div>
  );
}
