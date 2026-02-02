import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Zap, Calculator, BookOpen, RotateCcw } from "lucide-react";
import { InputField } from "./InputField";
import { MatrixDisplay } from "./MatrixDisplay";
import { CalculationStep } from "./CalculationStep";
import { LineDiagram } from "./LineDiagram";
import { calculateInductanceMatrix, formatMatrix, type LineParameters } from "@/lib/inductanceCalculator";

const defaultParams: LineParameters = {
  height: 15,
  phaseSeparation: 11,
  conductorDiameter: 3.18,
  bundleSpacing: 45.72,
  numberOfBundles: 2,
};

export function InductanceCalculator() {
  const [params, setParams] = useState<LineParameters>(defaultParams);
  const [calculated, setCalculated] = useState(false);

  const results = useMemo(() => {
    if (!calculated) return null;
    try {
      return calculateInductanceMatrix(params);
    } catch {
      return null;
    }
  }, [params, calculated]);

  const updateParam = <K extends keyof LineParameters>(key: K, value: LineParameters[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setCalculated(false);
  };

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setParams(defaultParams);
    setCalculated(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Inductance Matrix Calculator</h1>
              <p className="text-sm text-muted-foreground">3-Phase Transmission Line Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                  Line Parameters
                </CardTitle>
                <CardDescription>
                  Enter transmission line specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField
                  id="height"
                  label="Height above ground"
                  value={params.height}
                  onChange={(v) => updateParam("height", v)}
                  unit="m"
                  tooltip="H"
                  min={1}
                  step={0.5}
                />

                <InputField
                  id="separation"
                  label="Phase separation"
                  value={params.phaseSeparation}
                  onChange={(v) => updateParam("phaseSeparation", v)}
                  unit="m"
                  tooltip="S"
                  min={0.5}
                  step={0.5}
                />

                <InputField
                  id="diameter"
                  label="Conductor diameter"
                  value={params.conductorDiameter}
                  onChange={(v) => updateParam("conductorDiameter", v)}
                  unit="cm"
                  tooltip="d"
                  min={0.1}
                  step={0.01}
                />

                <InputField
                  id="numberOfBundles"
                  label="Number of sub-conductors"
                  value={params.numberOfBundles}
                  onChange={(v) => updateParam("numberOfBundles", Math.max(1, Math.round(v)))}
                  unit="N"
                  tooltip="N"
                  min={1}
                  step={1}
                />

                {params.numberOfBundles > 1 && (
                  <InputField
                    id="bundleSpacing"
                    label="Bundle spacing"
                    value={params.bundleSpacing}
                    onChange={(v) => updateParam("bundleSpacing", v)}
                    unit="cm"
                    tooltip="B"
                    min={1}
                    step={0.1}
                  />
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCalculate} 
                    className="flex-1"
                    size="lg"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    size="lg"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <LineDiagram height={params.height} separation={params.phaseSeparation} />
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!results ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Enter your transmission line parameters and click Calculate to see the inductance matrix results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="results" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-6">
                  {/* Key Results */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Equivalent Radius</p>
                        <p className="text-2xl font-mono font-bold text-primary">
                          {(results.req * 100).toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground">cm</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Self Inductance</p>
                        <p className="text-2xl font-mono font-bold text-accent">
                          {results.selfInductance.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground">mH/km</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-engineering-orange/5 to-engineering-orange/10 border-engineering-orange/20">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Avg. Mutual (Transposed)</p>
                        <p className="text-2xl font-mono font-bold text-engineering-orange">
                          {results.mutualInductanceAvg.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground">mH/km</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Matrices */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Maxwell's Coefficient Matrix</CardTitle>
                      <CardDescription>Natural logarithm of distance ratios</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MatrixDisplay
                        matrix={formatMatrix(results.maxwellMatrix)}
                        label="[P]"
                      />
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Untransposed Line</CardTitle>
                        <CardDescription>Asymmetric inductance matrix</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MatrixDisplay
                          matrix={formatMatrix(results.inductanceUntransposed)}
                          label="[L]ᵤₜ"
                          unit="mH/km"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Transposed Line</CardTitle>
                        <CardDescription>Symmetric inductance matrix</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MatrixDisplay
                          matrix={formatMatrix(results.inductanceTransposed)}
                          label="[L]ₜ"
                          unit="mH/km"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Calculation Steps</CardTitle>
                      <CardDescription>
                        Detailed breakdown of the inductance matrix calculation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.steps.map((step, i) => (
                        <CalculationStep key={i} step={step} index={i} />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Formula Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Formula Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Equivalent Radius (Bundle)</p>
                <code className="text-foreground">r_eq = √(r × B)</code>
              </div>
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Self Maxwell Coefficient</p>
                <code className="text-foreground">P_ii = ln(2H / r_eq)</code>
              </div>
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Mutual Maxwell Coefficient</p>
                <code className="text-foreground">P_ij = ln(I_ij / A_ij)</code>
              </div>
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Image Distance (Adjacent)</p>
                <code className="text-foreground">I_12 = √(4H² + S²)</code>
              </div>
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Image Distance (Outer)</p>
                <code className="text-foreground">I_13 = √(4H² + 4S²)</code>
              </div>
              <div className="formula-box">
                <p className="text-muted-foreground mb-1">Inductance Matrix</p>
                <code className="text-foreground">[L] = 0.2 × [P] mH/km</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>Based on Maxwell's coefficient method with image conductor approach</p>
        <p className="mt-1">3-Phase Horizontal Configuration • EHV Transmission Lines</p>
      </footer>
    </div>
  );
}
