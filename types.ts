
export interface DataPoint {
  id: string;
  x: number;
  y?: number; // Optional for univariate analysis
}

export type StatMode = 'univariate' | 'bivariate';

export interface CalculationStep {
  title: string;
  formula: string;
  substitution: string;
  result: string | number;
  interpretation: string;
}

export interface UnivariateResults {
  mean: number;
  median: number;
  modes: number[];
  variance: number;
  stdDev: number;
  range: number;
  n: number;
  sum: number;
  steps: CalculationStep[];
}

export interface BivariateResults {
  meanX: number;
  meanY: number;
  covariance: number;
  correlation: number; // r
  slope: number; // b1
  intercept: number; // b0
  determination: number; // r^2
  steps: CalculationStep[];
}

export interface HypothesisInput {
  testType: 'mean' | 'proportion'; // Z/T for mean, Z for proportion
  tailType: 'two-tailed' | 'left-tailed' | 'right-tailed';
  nullValue: number; // Mu_0 or P_0
  sampleMean: number; // x_bar or p_hat
  sampleSize: number; // n
  stdDev?: number; // s or sigma (optional if proportion)
  significance: number; // alpha (0.05, 0.01, etc)
}

export interface HypothesisResult {
  statistic: number; // Z or T score
  criticalValue: number | [number, number]; // One or two values
  pValue: number;
  distribution: 'Z' | 'T';
  isRejected: boolean;
  steps: CalculationStep[];
  chartData: { x: number; y: number; isCritical: boolean; isStatistic: boolean }[];
}

export interface TheorySection {
  title: string;
  definition: string;
  context?: string; // When to use it
  formula?: string;
  example?: string;
  interpretation?: string;
  imageUrl?: string; // URL for the illustrative image
  imageType?: 'chart' | 'concept' | 'formula'; // Fallback type
}

export interface TheoryTopic {
  id: string;
  title: string;
  description: string;
  sections: TheorySection[];
  video?: {
    id: string;
    title: string;
    description: string;
  };
  isTable?: boolean; // Special flag for statistical tables
}
