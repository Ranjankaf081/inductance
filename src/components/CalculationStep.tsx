import type { CalculationStep as StepType } from "@/lib/inductanceCalculator";

interface CalculationStepProps {
  step: StepType;
  index: number;
}

export function CalculationStep({ step, index }: CalculationStepProps) {
  return (
    <div className="result-highlight rounded-lg p-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
              Step {index + 1}
            </span>
            <h4 className="font-semibold text-foreground">{step.label}</h4>
          </div>
          <div className="formula-box">
            <code className="text-engineering-blue">{step.formula}</code>
          </div>
          <p className="text-sm text-muted-foreground">{step.explanation}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-engineering-green">
            {step.value}
          </div>
        </div>
      </div>
    </div>
  );
}
