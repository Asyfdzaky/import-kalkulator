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
          isHighlight || isTotal ? "font-semibold text-white" : "text-white/70"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-white",
          isTotal ? "text-xl font-bold" : isHighlight ? "font-semibold" : "",
        )}
      >
        Rp {formatCurrency(value)}
      </span>
    </div>
  );
}
