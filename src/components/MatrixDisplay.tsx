import { cn } from "@/lib/utils";

interface MatrixDisplayProps {
  matrix: string[][];
  label: string;
  unit?: string;
  className?: string;
}

export function MatrixDisplay({ matrix, label, unit, className }: MatrixDisplayProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{label}</span>
        {unit && <span className="text-muted-foreground text-sm">({unit})</span>}
      </div>
      <div className="matrix-display inline-block">
        <div className="flex items-center gap-2">
          {/* Left bracket */}
          <div className="text-4xl font-light text-matrix-text select-none">[</div>
          
          {/* Matrix content */}
          <div className="grid gap-1">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-4">
                {row.map((val, j) => (
                  <span 
                    key={j} 
                    className={cn(
                      "w-20 text-right",
                      i === j ? "text-[hsl(var(--matrix-text))] font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {val}
                  </span>
                ))}
              </div>
            ))}
          </div>
          
          {/* Right bracket */}
          <div className="text-4xl font-light text-matrix-text select-none">]</div>
        </div>
      </div>
    </div>
  );
}
