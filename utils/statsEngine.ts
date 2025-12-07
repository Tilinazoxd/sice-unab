
import { DataPoint, UnivariateResults, BivariateResults, CalculationStep, HypothesisInput, HypothesisResult } from "../types";

// Helper to round numbers for display
const round = (num: number, decimals = 4) => Number(Math.round(Number(num + 'e' + decimals)) + 'e-' + decimals);

// --- Math Helpers for Distributions ---

// Approximate Normal CDF (Cumulative Distribution Function)
const normalCDF = (z: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
};

// Approximate Inverse Normal CDF (Probit) - Abramowitz and Stegun
const inverseNormal = (p: number): number => {
  if (p <= 0 || p >= 1) return 0;
  
  const a1 = -3.969683028665376e+01;
  const a2 = 2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 = 1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 = 2.506628277459239e+00;

  const b1 = -5.447609879822406e+01;
  const b2 = 1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 = 6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;

  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 = 4.374664141464968e+00;
  const c6 = 2.938163982698783e+00;

  const d1 = 7.784695709041462e-03;
  const d2 = 3.224671290700398e-01;
  const d3 = 2.445134137142996e+00;
  const d4 = 3.754408661907416e+00;

  const p_low = 0.02425;
  const p_high = 1 - p_low;

  let q, r;

  if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
             (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
              ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
};

// Simplified T-Distribution Inverse (Approximation)
// For educational purposes, a high-accuracy approximation is sufficient
const inverseStudentT = (p: number, df: number): number => {
    // If df is large, use Normal
    if (df > 120) return inverseNormal(p);
    
    // Cornish-Fisher expansion based on Z
    const z = inverseNormal(p);
    const z2 = z * z;
    
    // Approximation terms
    const term1 = (z2 + 1) / 4;
    const term2 = (5 * z2 * z2 + 16 * z2 + 3) / 96;
    const term3 = (3 * z2 * z2 * z2 + 19 * z2 * z2 + 17 * z2 - 15) / 384;
    
    let t = z + (term1 * z) / df + (term2 * z) / (df * df) + (term3 * z) / (df * df * df);
    return t;
};

// Simplified T-CDF 
const studentTCDF = (t: number, df: number): number => {
   // Use normal approximation for large df or fallback
   if (df > 120) return normalCDF(t);
   
   // Betainc approximation fallback to Z for simple JS implementation
   // In a complete math library this would be better, but for academic calculator matching,
   // we will use a basic approximation or Normal if df is high.
   // Given constraints, we will stick to Normal approximation for P-value calculation
   // but warn about it. However, for decision making, critical value is more important.
   return normalCDF(t); 
};


// --- Main Calculations ---

export const calculateUnivariate = (data: DataPoint[]): UnivariateResults | null => {
  if (data.length === 0) return null;

  const n = data.length;
  const values = data.map(d => d.x).sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  let median = 0;
  if (n % 2 === 0) {
    median = (values[n / 2 - 1] + values[n / 2]) / 2;
  } else {
    median = values[Math.floor(n / 2)];
  }

  // Mode
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  values.forEach(v => {
    frequency[v] = (frequency[v] || 0) + 1;
    if (frequency[v] > maxFreq) maxFreq = frequency[v];
  });
  const modes = Object.keys(frequency).map(Number).filter(k => frequency[k] === maxFreq);

  // Variance & Std Dev (Sample)
  const sumSqDiff = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const variance = n > 1 ? sumSqDiff / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Steps Generation
  const steps: CalculationStep[] = [
    {
      title: 'Media Aritmética (Promedio)',
      formula: '$$\\bar{x} = \\frac{\\sum x_i}{n}$$',
      substitution: `$$\\bar{x} = \\frac{${round(sum)}}{${n}}$$`,
      result: round(mean),
      interpretation: `El valor representativo central de la distribución es ${round(mean)}. Si se redistribuyeran los valores equitativamente, este sería el valor asignado.`
    },
    {
      title: 'Varianza Muestral (S²)',
      formula: '$$s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n-1}$$',
      substitution: `$$s^2 = \\frac{${round(sumSqDiff)}}{${n - 1}}$$`,
      result: round(variance),
      interpretation: `La variabilidad promedio al cuadrado es ${round(variance)}. Indica qué tan dispersos están los datos respecto a la media.`
    },
    {
      title: 'Desviación Estándar (S)',
      formula: '$$s = \\sqrt{s^2}$$',
      substitution: `$$s = \\sqrt{${round(variance)}}$$`,
      result: round(stdDev),
      interpretation: `En promedio, cada dato se aleja ${round(stdDev)} unidades respecto a la media aritmética. Es la medida de riesgo o error promedio.`
    }
  ];

  return {
    mean,
    median,
    modes,
    variance,
    stdDev,
    range: values[values.length - 1] - values[0],
    n,
    sum,
    steps
  };
};

export const calculateBivariate = (data: DataPoint[]): BivariateResults | null => {
  if (data.length === 0) return null;
  // Ensure we have valid Y values
  const validData = data.filter(d => d.y !== undefined);
  if (validData.length === 0) return null;

  const n = validData.length;
  const sumX = validData.reduce((acc, d) => acc + d.x, 0);
  const sumY = validData.reduce((acc, d) => acc + (d.y || 0), 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  validData.forEach(d => {
    sumXY += (d.x - meanX) * ((d.y || 0) - meanY);
    sumXX += Math.pow(d.x - meanX, 2);
    sumYY += Math.pow((d.y || 0) - meanY, 2);
  });

  const covariance = sumXY / (n - 1);
  const stdDevX = Math.sqrt(sumXX / (n - 1));
  const stdDevY = Math.sqrt(sumYY / (n - 1));
  
  const correlation = sumXY / Math.sqrt(sumXX * sumYY);
  
  // Regression Coefficients: y = b0 + b1x
  const slope = sumXY / sumXX; // b1
  const intercept = meanY - slope * meanX; // b0
  const determination = Math.pow(correlation, 2);

  const steps: CalculationStep[] = [
    {
      title: 'Covarianza (Sxy)',
      formula: '$$S_{xy} = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{n-1}$$',
      substitution: `$$S_{xy} = \\frac{${round(sumXY)}}{${n - 1}}$$`,
      result: round(covariance),
      interpretation: covariance > 0 ? 'La covarianza es positiva, indicando una relación directa entre las variables.' : 'La covarianza es negativa, indicando una relación inversa entre las variables.'
    },
    {
      title: 'Coeficiente de Correlación de Pearson (r)',
      formula: '$$r = \\frac{S_{xy}}{\\sqrt{S_{xx}S_{yy}}}$$',
      substitution: `$$r = \\frac{${round(sumXY)}}{\\sqrt{${round(sumXX)} \\cdot ${round(sumYY)}}}$$`,
      result: round(correlation),
      interpretation: `Existe una correlación ${Math.abs(correlation) > 0.8 ? 'fuerte' : (Math.abs(correlation) > 0.5 ? 'moderada' : 'débil')} y ${correlation > 0 ? 'positiva' : 'negativa'} entre las variables.`
    },
    {
      title: 'Pendiente de Regresión (b₁)',
      formula: '$$b_1 = \\frac{S_{xy}}{S_{xx}}$$ (Mínimos Cuadrados)',
      substitution: `$$b_1 = \\frac{${round(sumXY)}}{${round(sumXX)}}$$`,
      result: round(slope),
      interpretation: `Por cada unidad que aumenta la variable independiente X, la variable Y cambia en promedio ${round(slope)} unidades.`
    },
    {
      title: 'Intercepto (b₀)',
      formula: '$$b_0 = \\bar{y} - b_1\\bar{x}$$',
      substitution: `$$b_0 = ${round(meanY)} - (${round(slope)} \\cdot ${round(meanX)})$$`,
      result: round(intercept),
      interpretation: 'Es el valor estimado de la variable dependiente Y cuando X es igual a cero.'
    },
    {
      title: 'Modelo Lineal',
      formula: '$$Y = b_0 + b_1X$$',
      substitution: `$$Y = ${round(intercept)} + ${round(slope)}X$$`,
      result: `Y = ${round(intercept)} + ${round(slope)}X`,
      interpretation: 'Esta ecuación permite predecir valores de Y para cualquier valor dado de X dentro del rango estudiado.'
    }
  ];

  return {
    meanX,
    meanY,
    covariance,
    correlation,
    slope,
    intercept,
    determination,
    steps
  };
};

export const getConfidenceIntervalSteps = (stats: UnivariateResults, confidenceLevel: number = 0.95): CalculationStep[] => {
  const zMap: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };
  
  const z = zMap[confidenceLevel] || 1.96; 
  const marginOfError = z * (stats.stdDev / Math.sqrt(stats.n));
  const lower = stats.mean - marginOfError;
  const upper = stats.mean + marginOfError;

  return [{
    title: `Intervalo de Confianza para la Media (${confidenceLevel * 100}%)`,
    formula: '$$IC = \\bar{x} \\pm Z_{\\alpha/2} \\frac{s}{\\sqrt{n}}$$ (Aprox. Normal)',
    substitution: `$$IC = ${round(stats.mean)} \\pm ${z} \\frac{${round(stats.stdDev)}}{\\sqrt{${stats.n}}}$$`,
    result: `[${round(lower)}, ${round(upper)}]`,
    interpretation: `Con un nivel de confianza del ${confidenceLevel * 100}%, estimamos que el verdadero valor de la media poblacional se encuentra dentro de este intervalo.`
  }];
};

// --- Hypothesis Testing Engine ---

export const calculateHypothesisTest = (input: HypothesisInput): HypothesisResult => {
  const steps: CalculationStep[] = [];
  const { testType, tailType, nullValue, sampleMean, sampleSize, stdDev, significance } = input;
  
  // 1. Determine Distribution (Z vs T)
  // ACADEMIC ADJUSTMENT: For Mean tests, we assume variance is unknown (Input is 's'), thus we force T-Test.
  // Exception is Proportion which is always Z.
  const isZ = testType === 'proportion';
  const distribution = isZ ? 'Z' : 'T';

  // 2. State Hypotheses
  let h0 = '', h1 = '';
  const param = testType === 'mean' ? '\\mu' : 'p';
  if (tailType === 'two-tailed') {
    h0 = `H_0: ${param} = ${nullValue}`;
    h1 = `H_1: ${param} \\neq ${nullValue}`;
  } else if (tailType === 'left-tailed') {
    h0 = `H_0: ${param} \\geq ${nullValue}`;
    h1 = `H_1: ${param} < ${nullValue}`;
  } else {
    h0 = `H_0: ${param} \\leq ${nullValue}`;
    h1 = `H_1: ${param} > ${nullValue}`;
  }

  steps.push({
    title: '1. Planteamiento de Hipótesis',
    formula: `$$${h0} \\quad vs \\quad ${h1}$$`,
    substitution: '',
    result: '',
    interpretation: `Se trata de una prueba ${tailType === 'two-tailed' ? 'bilateral (dos colas)' : 'unilateral'}.`
  });

  // 2a. Selection Logic
  steps.push({
      title: '2. Selección de la Prueba Adecuada',
      formula: '',
      substitution: '',
      result: `Prueba ${distribution}`,
      interpretation: isZ 
          ? `Dado que se trata de una proporción, utilizamos una prueba Z.`
          : `Dado que se desconoce la varianza de la población (se usa 's'), utilizamos una prueba T-Student.`
  });

  // 3. Significance
  steps.push({
      title: '3. Nivel de Significancia',
      formula: `$$\\alpha = ${significance}$$`,
      substitution: '',
      result: `Confianza = ${(1 - significance) * 100}%`,
      interpretation: `Nivel de riesgo de cometer un error Tipo I.`
  });

  // 4. Calculate Critical Value
  let criticalValue: number | [number, number] = 0;
  if (isZ) {
    if (tailType === 'two-tailed') {
      const zCrit = Math.abs(inverseNormal(significance / 2));
      criticalValue = [-zCrit, zCrit];
    } else if (tailType === 'left-tailed') {
      criticalValue = inverseNormal(significance); // will be negative
    } else {
      criticalValue = inverseNormal(1 - significance); // will be positive
    }
  } else {
    // T-Distribution
    const df = sampleSize - 1;
    if (tailType === 'two-tailed') {
      const tCrit = Math.abs(inverseStudentT(1 - (significance / 2), df));
      criticalValue = [-tCrit, tCrit];
    } else if (tailType === 'left-tailed') {
      criticalValue = inverseStudentT(significance, df);
    } else {
      criticalValue = inverseStudentT(1 - significance, df);
    }
  }

  // Format Critical Decision Rule
  let decisionRule = '';
  if (Array.isArray(criticalValue)) {
      decisionRule = `Rechazar H0 si ${distribution} < ${round(criticalValue[0])} o ${distribution} > ${round(criticalValue[1])}`;
  } else if (tailType === 'left-tailed') {
      decisionRule = `Rechazar H0 si ${distribution} < ${round(criticalValue)}`;
  } else {
      decisionRule = `Rechazar H0 si ${distribution} > ${round(criticalValue)}`;
  }

  steps.push({
      title: '4. Valores Críticos y Regla de Decisión',
      formula: '',
      substitution: '',
      result: Array.isArray(criticalValue) ? `±${round(criticalValue[1])}` : `${round(criticalValue)}`,
      interpretation: decisionRule
  });

  // 5. Calculate Statistic
  let statistic = 0;
  let stdError = 0;

  if (testType === 'mean') {
    // s / sqrt(n)
    stdError = (stdDev || 0) / Math.sqrt(sampleSize);
    statistic = (sampleMean - nullValue) / stdError;
    
    steps.push({
      title: '5. Calcule la estadística de prueba',
      formula: `$$${distribution} = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$$`,
      substitution: `$$${distribution} = \\frac{${sampleMean} - ${nullValue}}{${stdDev}/\\sqrt{${sampleSize}}} = \\frac{${round(sampleMean - nullValue)}}{${round(stdError)}}$$`,
      result: round(statistic),
      interpretation: `El estadístico T calculado es ${round(statistic)}.`
    });

  } else {
    // Proportion: Z = (p_hat - p0) / sqrt( p0(1-p0)/n )
    const p0 = nullValue;
    const q0 = 1 - p0;
    stdError = Math.sqrt((p0 * q0) / sampleSize);
    statistic = (sampleMean - p0) / stdError;

    steps.push({
      title: '5. Calcule la estadística de prueba',
      formula: '$$Z = \\frac{\\hat{p} - p_0}{\\sqrt{\\frac{p_0(1-p_0)}{n}}}$$',
      substitution: `$$Z = \\frac{${sampleMean} - ${p0}}{\\sqrt{\\frac{${p0}\\cdot${round(q0)}}{${sampleSize}}}} = \\frac{${round(sampleMean - p0)}}{${round(stdError)}}$$`,
      result: round(statistic),
      interpretation: `El estadístico Z calculado es ${round(statistic)}.`
    });
  }

  // 6. P-Value Calculation
  let pValue = 0;
  if (isZ) {
    const cdf = normalCDF(statistic);
    if (tailType === 'left-tailed') pValue = cdf;
    else if (tailType === 'right-tailed') pValue = 1 - cdf;
    else pValue = 2 * Math.min(cdf, 1 - cdf);
  } else {
    // T approximation (using Normal approx for P-value if library missing, but consistent with Stat)
    // Note: For large T values, P goes to 0 or 1.
    const cdf = studentTCDF(statistic, sampleSize - 1);
    if (tailType === 'left-tailed') pValue = cdf;
    else if (tailType === 'right-tailed') pValue = 1 - cdf;
    else pValue = 2 * Math.min(cdf, 1 - cdf);
  }
  
  // Clamp P-Value
  if (pValue < 0) pValue = 0;
  if (pValue > 1) pValue = 1;

  // 7. Decision
  const isRejected = pValue < significance;
  
  steps.push({
    title: '6. Tome una decisión basada en el resultado',
    formula: `$$Valor\\_P (${pValue.toFixed(5)}) ${isRejected ? '<' : '>'} \\alpha (${significance})$$`,
    substitution: `Estadístico (${round(statistic)}) vs Crítico (${Array.isArray(criticalValue) ? '±'+round(criticalValue[1]) : round(criticalValue)})`,
    result: isRejected ? 'Se RECHAZA H0' : 'NO se puede rechazar H0',
    interpretation: isRejected 
      ? `Existe evidencia estadística suficiente para rechazar la hipótesis nula, ya que el valor P es menor que el nivel de significancia (y el estadístico cae en la zona de rechazo).`
      : `No existe evidencia suficiente para rechazar la hipótesis nula, ya que el valor P es mayor que el nivel de significancia (el estadístico no cae en la zona de rechazo).`
  });

  // Chart Data Generation
  const chartData = [];
  // Generate points from -4 to +4 (standard deviations)
  const start = -4.5;
  const end = 4.5;
  const stepsCount = 100;
  const stepSize = (end - start) / stepsCount;
  
  // Helper to check critical region
  const isInCritical = (val: number): boolean => {
    if (Array.isArray(criticalValue)) {
      return val < criticalValue[0] || val > criticalValue[1];
    } else if (tailType === 'left-tailed') {
      return val < criticalValue;
    } else {
      return val > criticalValue;
    }
  };

  for (let i = 0; i <= stepsCount; i++) {
    const x = start + i * stepSize;
    // Use normal density for visuals (T looks similar enough for generic chart)
    const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    
    chartData.push({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(4)),
      isCritical: isInCritical(x),
      isStatistic: Math.abs(x - statistic) < 0.1 // Highlight bar
    });
  }

  return {
    statistic,
    criticalValue,
    pValue,
    distribution,
    isRejected,
    steps,
    chartData
  };
};
