// Inductance Matrix Calculator for 3-Phase Transmission Lines
// Based on Maxwell's coefficient method with image conductor approach

export interface LineParameters {
  height: number; // H - height above ground in meters
  phaseSeparation: number; // S - spacing between phases in meters
  conductorDiameter: number; // d - conductor diameter in cm
  bundleSpacing: number; // B - bundle spacing in cm (0 for single conductor)
  numberOfBundles: number; // N - number of sub-conductors in bundle
}

export interface CalculationResults {
  req: number; // Equivalent radius in meters
  maxwellMatrix: number[][]; // Maxwell's coefficient matrix [P]
  inductanceUntransposed: number[][]; // [L] untransposed in mH/km
  inductanceTransposed: number[][]; // [L] transposed in mH/km
  selfInductance: number; // Ls in mH/km
  mutualInductanceAvg: number; // Lm average in mH/km
  steps: CalculationStep[];
}

export interface CalculationStep {
  label: string;
  formula: string;
  value: string;
  explanation: string;
}

// Constants
const MU_0 = 4 * Math.PI * 1e-7; // Permeability of free space (H/m)
const MU_R = 1; // Relative permeability (assuming non-magnetic conductor)
const COEFFICIENT = 0.2; // μ₀μᵣ / 2π × 1000 = 0.2 mH/km

export function calculateInductanceMatrix(params: LineParameters): CalculationResults {
  const { height, phaseSeparation, conductorDiameter, bundleSpacing, numberOfBundles } = params;
  
  const steps: CalculationStep[] = [];
  const H = height; // meters
  const S = phaseSeparation; // meters
  const r = (conductorDiameter / 100) / 2; // Convert cm to meters, then radius
  const B = bundleSpacing / 100; // Convert cm to meters
  const N = numberOfBundles;

  // Step 1: Calculate equivalent radius (req)
  let req: number;
  if (N === 1 || B === 0) {
    // Single conductor - use GMR approximation (r' = r * e^(-1/4) ≈ 0.7788r for solid conductor)
    req = r * 0.7788;
    steps.push({
      label: "Equivalent Radius (Single Conductor)",
      formula: "r_eq = r × 0.7788",
      value: `${(req * 100).toFixed(4)} cm = ${req.toFixed(6)} m`,
      explanation: "For single conductor, GMR = r × e^(-1/4)"
    });
  } else {
    // Bundle conductor: req = (N × r × R^(N-1))^(1/N)
    // where R = bundle spacing = B
    const product = N * r * Math.pow(B, N - 1);
    req = Math.pow(product, 1 / N);
    steps.push({
      label: "Equivalent Radius (Bundle)",
      formula: "r_eq = (N × r × R^(N-1))^(1/N)",
      value: `${(req * 100).toFixed(4)} cm = ${req.toFixed(6)} m`,
      explanation: `Bundle of ${N} sub-conductors with spacing R = ${B * 100} cm`
    });
  }

  // Step 2: Calculate Maxwell's coefficients
  // P_ii (self) = ln(2H / r_eq)
  const P11 = Math.log((2 * H) / req);
  const P22 = P11;
  const P33 = P11;

  steps.push({
    label: "Self Maxwell Coefficient (P₁₁ = P₂₂ = P₃₃)",
    formula: "P_ii = ln(2H / r_eq)",
    value: P11.toFixed(4),
    explanation: `ln(2 × ${H} / ${req.toFixed(4)}) = ln(${((2 * H) / req).toFixed(4)})`
  });

  // P_12 = P_21 = P_23 = P_32 = ln(√(4H² + S²) / S) for adjacent phases
  // Image distance I_12 = √((2H)² + S²) = √(4H² + S²)
  const I12 = Math.sqrt(4 * H * H + S * S);
  const P12 = Math.log(I12 / S);

  steps.push({
    label: "Mutual Maxwell Coefficient (P₁₂ = P₂₃)",
    formula: "P_12 = ln(√(4H² + S²) / S)",
    value: P12.toFixed(4),
    explanation: `ln(√(4×${H}² + ${S}²) / ${S}) = ln(${I12.toFixed(4)} / ${S}) = ln(${(I12 / S).toFixed(4)})`
  });

  // P_13 = P_31 = ln(√(4H² + 4S²) / 2S) for outer phases
  // Image distance I_13 = √((2H)² + (2S)²) = √(4H² + 4S²)
  const I13 = Math.sqrt(4 * H * H + 4 * S * S);
  const P13 = Math.log(I13 / (2 * S));

  steps.push({
    label: "Mutual Maxwell Coefficient (P₁₃)",
    formula: "P_13 = ln(√(4H² + 4S²) / 2S)",
    value: P13.toFixed(4),
    explanation: `ln(√(4×${H}² + 4×${S}²) / 2×${S}) = ln(${I13.toFixed(4)} / ${2 * S}) = ln(${(I13 / (2 * S)).toFixed(4)})`
  });

  // Maxwell's coefficient matrix [P]
  const maxwellMatrix = [
    [P11, P12, P13],
    [P12, P22, P12],
    [P13, P12, P33]
  ];

  // Step 3: Calculate inductance matrix [L] = 0.2 × [P] mH/km
  const inductanceUntransposed = maxwellMatrix.map(row => 
    row.map(val => val * COEFFICIENT)
  );

  const Ls = P11 * COEFFICIENT;
  const Lm12 = P12 * COEFFICIENT;
  const Lm13 = P13 * COEFFICIENT;

  steps.push({
    label: "Self Inductance (L_s)",
    formula: "L_s = 0.2 × P_ii",
    value: `${Ls.toFixed(4)} mH/km`,
    explanation: `0.2 × ${P11.toFixed(4)} = ${Ls.toFixed(4)} mH/km`
  });

  steps.push({
    label: "Mutual Inductance (L₁₂ = L₂₃)",
    formula: "L_12 = 0.2 × P_12",
    value: `${Lm12.toFixed(4)} mH/km`,
    explanation: `0.2 × ${P12.toFixed(4)} = ${Lm12.toFixed(4)} mH/km`
  });

  steps.push({
    label: "Mutual Inductance (L₁₃)",
    formula: "L_13 = 0.2 × P_13",
    value: `${Lm13.toFixed(4)} mH/km`,
    explanation: `0.2 × ${P13.toFixed(4)} = ${Lm13.toFixed(4)} mH/km`
  });

  // Step 4: Calculate transposed inductance matrix
  // Average mutual inductance = (P12 + P12 + P13) / 3 = (2×P12 + P13) / 3
  const PmAvg = (2 * P12 + P13) / 3;
  const LmAvg = PmAvg * COEFFICIENT;

  steps.push({
    label: "Average Mutual Inductance (Transposed)",
    formula: "L_m = 0.2 × (P₁₂ + P₂₃ + P₁₃) / 3",
    value: `${LmAvg.toFixed(4)} mH/km`,
    explanation: `0.2 × (${P12.toFixed(4)} + ${P12.toFixed(4)} + ${P13.toFixed(4)}) / 3`
  });

  const inductanceTransposed = [
    [Ls, LmAvg, LmAvg],
    [LmAvg, Ls, LmAvg],
    [LmAvg, LmAvg, Ls]
  ];

  return {
    req,
    maxwellMatrix,
    inductanceUntransposed,
    inductanceTransposed,
    selfInductance: Ls,
    mutualInductanceAvg: LmAvg,
    steps
  };
}

export function formatMatrix(matrix: number[][], precision: number = 4): string[][] {
  return matrix.map(row => row.map(val => val.toFixed(precision)));
}
