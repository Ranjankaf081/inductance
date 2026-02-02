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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Header */}
      <header className="gradient-header sticky top-0 z-10 shadow-lg">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-lg transform hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white drop-shadow-lg" />
            </div>
            <div className="text-white drop-shadow-lg">
              <h1 className="text-3xl font-bold">⚡ Inductance Matrix Calculator</h1>
              <p className="text-sm text-white/90">3-Phase Transmission Line Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="colorful-card shadow-lg border-2 border-blue-200 dark:border-purple-700">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  Line Parameters
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter transmission line specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    size="lg"
                    className="border-2 border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
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
              <Card className="border-2 border-dashed border-purple-300 shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4 shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto text-base">
                    Enter your transmission line parameters and click Calculate to see the inductance matrix results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="results" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 p-1">
                  <TabsTrigger value="results" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-purple-400">Results</TabsTrigger>
                  <TabsTrigger value="steps" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-purple-400">Step-by-Step</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-6">
                  {/* Key Results */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 text-white shadow-lg transform hover:scale-105 transition-transform border-0">
                      <CardContent className="pt-4">
                        <p className="text-sm text-blue-100 font-semibold">Equivalent Radius</p>
                        <p className="text-3xl font-mono font-bold mt-2">
                          {(results.req * 100).toFixed(4)}
                        </p>
                        <p className="text-xs text-blue-100 mt-1">cm</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300 text-white shadow-lg transform hover:scale-105 transition-transform border-0">
                      <CardContent className="pt-4">
                        <p className="text-sm text-purple-100 font-semibold">Self Inductance</p>
                        <p className="text-3xl font-mono font-bold mt-2">
                          {results.selfInductance.toFixed(4)}
                        </p>
                        <p className="text-xs text-purple-100 mt-1">mH/km</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-pink-500 via-pink-400 to-pink-300 text-white shadow-lg transform hover:scale-105 transition-transform border-0">
                      <CardContent className="pt-4">
                        <p className="text-sm text-pink-100 font-semibold">Avg. Mutual (Transposed)</p>
                        <p className="text-3xl font-mono font-bold mt-2">
                          {results.mutualInductanceAvg.toFixed(4)}
                        </p>
                        <p className="text-xs text-pink-100 mt-1">mH/km</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Matrices */}
                  <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 border-b-2 border-blue-200 dark:border-blue-700">
                      <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Maxwell's Coefficient Matrix</CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">Natural logarithm of distance ratios</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <MatrixDisplay
                        matrix={formatMatrix(results.maxwellMatrix)}
                        label="[P]"
                      />
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-800">
                      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 border-b-2 border-purple-200 dark:border-purple-700">
                        <CardTitle className="text-lg text-purple-900 dark:text-purple-100">Untransposed Line</CardTitle>
                        <CardDescription className="text-purple-700 dark:text-purple-300">Asymmetric inductance matrix</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <MatrixDisplay
                          matrix={formatMatrix(results.inductanceUntransposed)}
                          label="[L]ᵤₜ"
                          unit="mH/km"
                        />
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-2 border-pink-200 dark:border-pink-800">
                      <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900 dark:to-pink-800 border-b-2 border-pink-200 dark:border-pink-700">
                        <CardTitle className="text-lg text-pink-900 dark:text-pink-100">Transposed Line</CardTitle>
                        <CardDescription className="text-pink-700 dark:text-pink-300">Symmetric inductance matrix</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
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
                  <Card className="shadow-lg border-2 border-cyan-200 dark:border-cyan-800">
                    <CardHeader className="bg-gradient-to-r from-cyan-100 to-cyan-50 dark:from-cyan-900 dark:to-cyan-800 border-b-2 border-cyan-200 dark:border-cyan-700">
                      <CardTitle className="text-lg text-cyan-900 dark:text-cyan-100">Calculation Steps</CardTitle>
                      <CardDescription className="text-cyan-700 dark:text-cyan-300">
                        Detailed breakdown of the inductance matrix calculation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
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
        <Card className="mt-8 shadow-lg border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 border-b-2 border-orange-200 dark:border-orange-700">
            <CardTitle className="text-lg text-orange-900 dark:text-orange-100">Formula Reference</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="formula-box border-2 border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700">
                <p className="text-blue-700 dark:text-blue-300 font-semibold mb-2">📐 Equivalent Radius (Bundle)</p>
                <code className="text-blue-900 dark:text-blue-100 font-mono">r_eq = (N × r × R^(N-1))^(1/N)</code>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">where N = conductors, R = spacing</p>
              </div>
              <div className="formula-box border-2 border-purple-300 bg-purple-50 dark:bg-purple-950 dark:border-purple-700">
                <p className="text-purple-700 dark:text-purple-300 font-semibold mb-2">∑ Self Maxwell Coefficient</p>
                <code className="text-purple-900 dark:text-purple-100 font-mono">P_ii = ln(2H / r_eq)</code>
              </div>
              <div className="formula-box border-2 border-pink-300 bg-pink-50 dark:bg-pink-950 dark:border-pink-700">
                <p className="text-pink-700 dark:text-pink-300 font-semibold mb-2">↔️ Mutual (Adjacent Phases)</p>
                <code className="text-pink-900 dark:text-pink-100 font-mono">P₁₂ = ln(I₁₂ / S)</code>
              </div>
              <div className="formula-box border-2 border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-700">
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">↗️ Mutual (Outer Phases)</p>
                <code className="text-red-900 dark:text-red-100 font-mono">P₁₃ = ln(I₁₃ / 2S)</code>
              </div>
              <div className="formula-box border-2 border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-700">
                <p className="text-green-700 dark:text-green-300 font-semibold mb-2">📏 Conductor Radius</p>
                <code className="text-green-900 dark:text-green-100 font-mono">r = d / 2</code>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">where d is diameter</p>
              </div>
              <div className="formula-box border-2 border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-700">
                <p className="text-green-700 dark:text-green-300 font-semibold mb-2">↗️ Image Distance (Adjacent)</p>
                <code className="text-green-900 dark:text-green-100 font-mono">I₁₂ = √(4H² + S²)</code>
              </div>
              <div className="formula-box border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700">
                <p className="text-yellow-700 dark:text-yellow-300 font-semibold mb-2">↗️ Image Distance (Outer)</p>
                <code className="text-yellow-900 dark:text-yellow-100 font-mono">I₁₃ = √(4H² + 4S²)</code>
              </div>
              <div className="formula-box border-2 border-cyan-300 bg-cyan-50 dark:bg-cyan-950 dark:border-cyan-700">
                <p className="text-cyan-700 dark:text-cyan-300 font-semibold mb-2">📊 Inductance Matrix</p>
                <code className="text-cyan-900 dark:text-cyan-100 font-mono">[L] = 0.2 × [P] mH/km</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="gradient-secondary mt-12 py-8 text-center text-sm text-white shadow-lg">
        <p className="font-semibold">Based on Maxwell's coefficient method with image conductor approach</p>
        <p className="mt-2 text-white/90">3-Phase Horizontal Configuration • EHV Transmission Lines</p>
      </footer>
    </div>
  );
}
