import { formatCurrency } from "@/lib/importCalculations";
import { cn } from "@/lib/utils";

interface ResultRowProps {
  label: string;
  value: number;
  isHighlight?: boolean;
  isTotal?: boolean;
  className?: string;
}

export function ResultRow({
  label,
  value,
  isHighlight = false,
  isTotal = false,
  className,
}: ResultRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2",
        isTotal && "border-t-2 border-primary pt-3 mt-2",
        className
      )}
    >
      <span
        className={cn(
          "text-sm",
          isHighlight || isTotal ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-mono",
          isTotal ? "text-xl font-bold text-success" : isHighlight ? "font-semibold text-foreground" : "text-foreground",
        )}
      >
        Rp {formatCurrency(value)}
      </span>
    </div>
  );
}
