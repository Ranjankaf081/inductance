import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  className?: string;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 0.01,
  tooltip,
  className,
}: InputFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {tooltip && (
          <span className="ml-1 text-muted-foreground text-xs">({tooltip})</span>
        )}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          step={step}
          className="input-engineering pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
          {unit}
        </span>
      </div>
    </div>
  );
}
