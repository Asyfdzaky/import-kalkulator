import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = "0",
  className,
}: CurrencyInputProps) {
  return (
    <div className={cn("input-wrapper", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <NumericFormat
        id={id}
        customInput={Input}
        thousandSeparator="."
        decimalSeparator=","
        prefix={prefix}
        suffix={suffix}
        placeholder={placeholder}
        value={value || ""}
        onValueChange={(values) => {
          onChange(values.floatValue || 0);
        }}
        className="bg-card"
      />
    </div>
  );
}
