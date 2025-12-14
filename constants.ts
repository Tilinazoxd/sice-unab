
import { TheoryTopic } from "./types";

export const UNAB_COLORS = {
  blue: '#003366', // Deep University Blue
  gold: '#fbbf24', // Accent Gold
  lightBlue: '#e0f2fe',
  darkBlue: '#002855',
};

// Simplified data for display purposes based on the OCR provided.
export const Z_TABLE_DATA = {
  headers: ['z', '0.00', '0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.07', '0.08', '0.09'],
  rows: [
    ['-3.0', '0.0013', '0.0010', '0.0007', '0.0005', '0.0003', '0.0002', '0.0002', '0.0001', '0.0001', '0.0000'],
    ['-2.5', '0.0062', '0.0060', '0.0059', '0.0057', '0.0055', '0.0054', '0.0052', '0.0051', '0.0049', '0.0048'],
    ['-2.0', '0.0228', '0.0222', '0.0217', '0.0212', '0.0207', '0.0202', '0.0197', '0.0192', '0.0188', '0.0183'],
    ['-1.5', '0.0668', '0.0655', '0.0643', '0.0630', '0.0618', '0.0606', '0.0594', '0.0582', '0.0571', '0.0559'],
    ['-1.0', '0.1587', '0.1562', '0.1539', '0.1515', '0.1492', '0.1469', '0.1446', '0.1423', '0.1401', '0.1379'],
    ['-0.5', '0.3085', '0.3050', '0.3015', '0.2981', '0.2946', '0.2912', '0.2877', '0.2843', '0.2810', '0.2776'],
    ['0.0', '0.5000', '0.4960', '0.4920', '0.4880', '0.4840', '0.4801', '0.4761', '0.4721', '0.4681', '0.4641'],
    ['0.5', '0.6915', '0.6950', '0.6985', '0.7019', '0.7054', '0.7088', '0.7123', '0.7157', '0.7190', '0.7224'],
    ['1.0', '0.8413', '0.8438', '0.8461', '0.8485', '0.8508', '0.8531', '0.8554', '0.8577', '0.8599', '0.8621'],
    ['1.5', '0.9332', '0.9345', '0.9357', '0.9370', '0.9382', '0.9394', '0.9406', '0.9418', '0.9429', '0.9441'],
    ['1.9', '0.9713', '0.9719', '0.9726', '0.9732', '0.9738', '0.9744', '0.9750', '0.9756', '0.9761', '0.9767'],
    ['2.5', '0.9938', '0.9940', '0.9941', '0.9943', '0.9945', '0.9946', '0.9948', '0.9949', '0.9951', '0.9952'],
    ['3.0', '0.9987', '0.9990', '0.9993', '0.9995', '0.9997', '0.9998', '0.9998', '0.9999', '0.9999', '1.0000'],
  ]
};

export const T_TABLE_DATA = {
  headers: ['df', '0.60', '0.75', '0.90', '0.95', '0.975', '0.99', '0.995'],
  rows: [
    ['1', '0.325', '1.000', '3.078', '6.314', '12.706', '31.821', '63.657'],
    ['2', '0.289', '0.816', '1.886', '2.920', '4.303', '6.965', '9.925'],
    ['5', '0.267', '0.727', '1.476', '2.015', '2.571', '3.365', '4.032'],
    ['10', '0.260', '0.700', '1.372', '1.812', '2.228', '2.764', '3.169'],
    ['20', '0.257', '0.687', '1.325', '1.725', '2.086', '2.528', '2.845'],
    ['30', '0.256', '0.683', '1.310', '1.697', '2.042', '2.457', '2.750'],
    ['40', '0.255', '0.681', '1.303', '1.684', '2.021', '2.423', '2.704'],
    ['60', '0.254', '0.679', '1.296', '1.671', '2.000', '2.390', '2.660'],
    ['120', '0.254', '0.677', '1.289', '1.658', '1.980', '2.358', '2.617'],
    ['∞', '0.253', '0.674', '1.282', '1.645', '1.960', '2.326', '2.576'],
  ]
};

// URL Placeholders for images based on the provided descriptions
// Added more specific placeholders to ensure every section has an image
const IMAGES = {
  centralTendency: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1000&auto=format&fit=crop", 
  median: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
  mode: "https://images.unsplash.com/photo-1535320903710-d9cf5d56751c?q=80&w=1000&auto=format&fit=crop",
  dispersion: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop", 
  stdDev: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000&auto=format&fit=crop",
  correlation: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop", 
  pearson: "https://images.unsplash.com/photo-1666112835156-c65bb806ac73?q=80&w=1000&auto=format&fit=crop",
  regression: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", 
  confidence: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop", 
  probability: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1000&auto=format&fit=crop",
  hypothesis: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=1000&auto=format&fit=crop",
  typesOfTests: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1000&auto=format&fit=crop",
  errors: "https://images.unsplash.com/photo-1594826816962-6f546294a322?q=80&w=1000&auto=format&fit=crop",
  statistic: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
  pValue: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
};

export const TEAM_MEMBERS = [
  {
    name: "Terrones Gálvez Edward Iván",
    role: "Docente del curso: Estadística – UNAB",
    image: "Edward.jpg",
    isTeacher: true
  },
  {
    name: "Mendoza Giraldo Rhaid Wenceslao",
    role: "Estudiante - Ingeniería de Sistemas e Informática",
    image: "Rhaid.jpg",
    isTeacher: false
  },
  {
    name: "Morales Domínguez Jeremy Isaías",
    role: "Estudiante - Ingeniería de Sistemas e Informática",
    image: "Jeremy.jpg",
    isTeacher: false
  },
  {
    name: "Luna Montes Nelson Iván",
    role: "Estudiante - Ingeniería de Sistemas e Informática",
    image: "Nelson.jpg",
    isTeacher: false
  }
];

export const TEST_TOPICS = [
  {
    id: 'central-tendency',
    title: 'Medidas de Tendencia Central',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=387863e7-1e79-4a4e-b224-57d4dfe6f5e2&gameMode=nano',
        subtitle: 'Ideal para comenzar'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=6471286f-6f6b-4d7b-bdd7-0977c8245b66&gameMode=nano',
        subtitle: 'Refuerza conceptos'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=bfe93acd-ed45-4628-ba31-40e6822cead8&gameMode=nano',
        subtitle: 'Nivel avanzado'
      }
    ]
  },
  {
    id: 'dispersion',
    title: 'Medidas de Dispersión',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=f6a6fb4e-7fcb-40c2-bdea-fd8a3c560fed&gameMode=nano',
        subtitle: 'Conceptos básicos'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=e2a54cd6-a5b3-432e-a493-07d35db43a7a&gameMode=nano',
        subtitle: 'Cálculo y análisis'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=ece51504-d090-4d58-9473-5baa51d5286a&gameMode=nano',
        subtitle: 'Reto de variabilidad'
      }
    ]
  },
  {
    id: 'covariance',
    title: 'Covarianza y Correlación',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=b3487d84-da0f-4245-9db0-5f7fa6eb9dd6&gameMode=nano',
        subtitle: 'Identifica relaciones'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=784896ea-dbec-43be-a326-d61d11950341&gameMode=nano',
        subtitle: 'Interpretación de r'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=af9d65f1-cc4d-418d-8011-e778823cdeee&gameMode=nano',
        subtitle: 'Análisis profundo'
      }
    ]
  },
  {
    id: 'regression',
    title: 'Regresión Lineal Simple',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=cf9cbdf0-75d8-4548-8f15-f28fe373f412&gameMode=nano',
        subtitle: 'La recta de ajuste'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=2032d49b-4c84-4c5a-9105-bd20ff8a2bae&gameMode=nano',
        subtitle: 'Predicciones'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=8103b250-29f4-4269-9546-0cc28a568d76&gameMode=nano',
        subtitle: 'Modelado avanzado'
      }
    ]
  },
  {
    id: 'confidence',
    title: 'Intervalos de Confianza',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=52534394-a9d6-4a3c-9dca-4f0fa8065798&gameMode=nano',
        subtitle: 'Estimación puntual'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=2b22b875-a552-46af-99ae-c05021e2a762&gameMode=nano',
        subtitle: 'Cálculo de intervalos'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=c3e88b4f-2ebc-4d99-9937-7bbb86c4b06b&gameMode=nano',
        subtitle: 'Interpretación crítica'
      }
    ]
  },
  {
    id: 'hypothesis',
    title: 'Pruebas de Hipótesis',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=36d3d5f5-05cb-4020-8023-355ee7e72f09&gameMode=nano',
        subtitle: 'H₀ vs H₁'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=5d93f7d5-4c26-457d-a36c-3b9d5f208f80&gameMode=nano',
        subtitle: 'Valores P y decisiones'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=26de24df-5055-4983-8cfa-8f55116ecaa8&gameMode=nano',
        subtitle: 'Errores Tipo I y II'
      }
    ]
  },
  {
    id: 'probability',
    title: 'Probabilidades',
    levels: [
      {
        difficulty: 'Fácil',
        url: 'https://kahoot.it/solo?quizId=458a558a-1fff-4ddc-9887-615dfddfa31a&gameMode=nano',
        subtitle: 'Conceptos de azar'
      },
      {
        difficulty: 'Medio',
        url: 'https://kahoot.it/solo?quizId=e31f7170-a7aa-4736-9260-ca055bbaf2f2&gameMode=nano',
        subtitle: 'Regla de Laplace'
      },
      {
        difficulty: 'Difícil',
        url: 'https://kahoot.it/solo?quizId=4edc88b3-5df8-4c1f-b6ce-534be1bbaff7&gameMode=nano',
        subtitle: 'Eventos compuestos'
      }
    ]
  }
];

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'central-tendency',
    title: 'Medidas de Tendencia Central',
    description: 'Son indicadores estadísticos que resumen un conjunto de datos en un solo valor numérico, el cual pretende representar el "centro" o núcleo de la distribución. Son fundamentales para describir el comportamiento general de una variable.',
    video: {
      id: 'oH3hTV53TdU',
      title: 'Media, Mediana y Moda',
      description: 'Explicación detallada del cálculo manual e interpretación de las tres principales medidas de tendencia central.'
    },
    sections: [
      {
        title: 'Media Aritmética (Promedio)',
        definition: 'La media aritmética es el valor obtenido al sumar todos los datos y dividir el resultado entre el número total de datos. Es el "centro de gravedad" de la distribución.',
        context: 'Se utiliza en variables cuantitativas con distribuciones simétricas y sin valores atípicos extremos, ya que es sensible a estos.',
        formula: '$$\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}$$',
        example: 'Considere las notas de 5 alumnos: 12, 15, 14, 18, 16. Suma = 75. N=5. Media = 15.',
        interpretation: 'Si se repartieran los valores equitativamente entre todos los individuos, a cada uno le correspondería el valor de la media.',
        imageUrl: IMAGES.centralTendency,
        imageType: 'chart'
      },
      {
        title: 'Mediana',
        definition: 'Es el valor que ocupa la posición central de un conjunto de datos ordenados. Deja el 50% de las observaciones por debajo y el 50% por encima.',
        context: 'Es preferible a la media cuando la distribución presenta sesgos fuertes o valores atípicos (outliers), ya que es una medida robusta.',
        formula: '$$Me = \\begin{cases} x_{(n+1)/2} & \\text{si } n \\text{ es impar} \\\\ \\frac{x_{n/2} + x_{n/2 + 1}}{2} & \\text{si } n \\text{ es par} \\end{cases}$$',
        example: 'Datos: 2, 3, 5, 7, 200. La media se dispararía, pero la mediana es 5, representando mejor al grupo típico.',
        interpretation: 'Es el umbral que divide a la población en dos mitades exactas.',
        imageUrl: IMAGES.median,
        imageType: 'concept'
      },
      {
        title: 'Moda',
        definition: 'Es el valor o categoría que aparece con mayor frecuencia en el conjunto de datos.',
        context: 'Es la única medida de tendencia central utilizable para variables cualitativas nominales (ej. marca de auto, color).',
        example: 'En una encuesta de satisfacción (Malo, Regular, Bueno, Bueno, Excelente), la moda es "Bueno".',
        interpretation: 'Representa el valor más típico, común o popular dentro del grupo estudiado.',
        imageUrl: IMAGES.mode,
        imageType: 'chart'
      }
    ]
  },
  {
    id: 'dispersion',
    title: 'Medidas de Dispersión',
    description: 'Mientras que la tendencia central nos dice dónde está el centro, la dispersión nos indica qué tan esparcidos o concentrados están los datos alrededor de ese centro. Son vitales para entender la variabilidad y el riesgo.',
    video: {
      id: 'oZRaDwnpXkY',
      title: 'Varianza y Desviación Estándar',
      description: 'Aprende a cuantificar la variabilidad de tus datos paso a paso.'
    },
    sections: [
      {
        title: 'Varianza (S²)',
        definition: 'Es el promedio de los cuadrados de las diferencias entre cada dato y la media aritmética. Cuantifica la dispersión en unidades cuadráticas.',
        context: 'Base matemática para la desviación estándar y análisis avanzados como ANOVA.',
        formula: '$$s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n-1}$$',
        example: 'Para datos 2 y 4 (Media 3): Diferencias son -1 y 1. Cuadrados: 1 y 1. Suma=2. Varianza = 2/(2-1) = 2.',
        interpretation: 'Un valor alto indica que los datos están muy alejados de la media. Al estar al cuadrado, no tiene una interpretación física directa simple.',
        imageUrl: IMAGES.dispersion,
        imageType: 'formula'
      },
      {
        title: 'Desviación Estándar (S)',
        definition: 'Es la raíz cuadrada positiva de la varianza. Devuelve la medida de dispersión a las unidades originales de la variable.',
        context: 'Es la medida de dispersión más reportada junto con la media.',
        formula: '$$s = \\sqrt{s^2}$$',
        example: 'Si la varianza de salarios es 2500 soles², la desviación es 50 soles. Indica la variabilidad promedio.',
        interpretation: 'En una distribución normal, aproximadamente el 68% de los datos caen dentro de ±1 desviación estándar de la media.',
        imageUrl: IMAGES.stdDev,
        imageType: 'concept'
      }
    ]
  },
  {
    id: 'correlation',
    title: 'Covarianza y Correlación',
    description: 'Análisis bivariado que estudia la relación lineal entre dos variables cuantitativas. Permite entender cómo el cambio en una variable afecta o se asocia con la otra.',
    video: {
      id: '1BMX762A9Dg',
      title: 'Covarianza y Correlación de Pearson',
      description: 'Entendiendo la fuerza y dirección de la relación lineal entre variables.'
    },
    sections: [
      {
        title: 'Covarianza (Sxy)',
        definition: 'Medida aritmética del producto de las desviaciones de las dos variables respecto a sus medias. Indica la dirección de la relación lineal.',
        formula: '$$S_{xy} = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{n-1}$$',
        interpretation: 'Positiva: Relación directa (ambas suben). Negativa: Relación inversa. Cero: Sin relación lineal aparente. No indica fuerza.',
        imageUrl: IMAGES.correlation,
        imageType: 'chart'
      },
      {
        title: 'Coeficiente de Correlación (r)',
        definition: 'Versión estandarizada de la covarianza. Mide tanto la dirección como la intensidad de la relación lineal.',
        context: 'Fundamental para determinar si vale la pena hacer una regresión lineal.',
        formula: '$$r = \\frac{S_{xy}}{S_x S_y}$$',
        example: 'r = 0.95 (Relación fuerte positiva), r = -0.10 (Relación nula/débil), r = -0.85 (Relación fuerte negativa).',
        interpretation: 'Es un valor adimensional entre -1 y +1. Cuanto más cerca de los extremos, más fuerte es la relación lineal.',
        imageUrl: IMAGES.pearson,
        imageType: 'concept'
      }
    ]
  },
  {
    id: 'regression',
    title: 'Regresión Lineal Simple',
    description: 'Técnica de modelado predictivo que permite estimar el valor de una variable dependiente (Y) a partir de una independiente (X) mediante una ecuación lineal.',
    video: {
      id: 'fNeXC8d5En8',
      title: 'Introducción a la Regresión Lineal',
      description: 'Ajuste de mínimos cuadrados y construcción de la ecuación de la recta.'
    },
    sections: [
      {
        title: 'Ecuación de la Recta (Y = b₀ + b₁X)',
        definition: 'Modelo matemático que representa la línea recta que "mejor se ajusta" a la nube de puntos, minimizando la suma de errores al cuadrado.',
        formula: '$$Y = b_0 + b_1X$$',
        example: 'Ventas = 100 + 50(Publicidad). Si invierto 10 en publicidad, espero 600 en ventas.',
        interpretation: 'b₁ (pendiente) indica cuánto cambia Y por cada unidad extra de X. b₀ (intercepto) es el valor de Y cuando X es cero.',
        imageUrl: IMAGES.regression,
        imageType: 'chart'
      }
    ]
  },
  {
    id: 'confidence',
    title: 'Intervalos de Confianza',
    description: 'Método de estimación estadística que permite definir un par de valores (rango) dentro del cual se espera encontrar el verdadero parámetro poblacional con un nivel de certeza determinado.',
    video: {
      id: '6_V-bJlvR6Y',
      title: 'Intervalos de Confianza para la Media',
      description: 'Estimación por intervalos usando Z y T-Student.'
    },
    sections: [
      {
        title: 'Estimación para la Media (μ)',
        definition: 'Rango de valores calculado a partir de los datos muestrales que probablemente contiene a la media poblacional desconocida.',
        context: 'Es más informativo que una estimación puntual porque nos da una idea de la precisión de nuestra estimación.',
        formula: '$$IC = \\bar{x} \\pm Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$$ (para n grande)',
        example: 'Si obtenemos un intervalo [14.5, 16.2] para notas promedio con 95% de confianza.',
        interpretation: 'Significa que si repitiéramos el muestreo muchas veces, el 95% de los intervalos calculados contendrían la media real.',
        imageUrl: IMAGES.confidence,
        imageType: 'formula'
      }
    ]
  },
  {
    id: 'hypothesis',
    title: 'Pruebas de Hipótesis',
    description: 'Procedimiento estadístico basado en la evidencia de la muestra y la teoría de la probabilidad, usado para determinar si una hipótesis planteada sobre un parámetro poblacional debe ser rechazada o no.',
    video: {
      id: 'k3oBZQ5Brbs',
      title: 'Prueba de Hipótesis: Conceptos Fundamentales',
      description: 'Introducción oficial a los componentes de una prueba de hipótesis estadística.'
    },
    sections: [
      {
        title: 'Hipótesis Nula (H₀) y Alternativa (H₁)',
        definition: 'La Hipótesis Nula (H₀) es la afirmación de "no efecto" o "status quo" que se asume verdadera hasta que la evidencia demuestre lo contrario. La Hipótesis Alternativa (H₁) es la afirmación que el investigador desea probar.',
        context: 'H₀ siempre contiene el signo de igualdad (=, ≥, ≤). H₁ contiene desigualdad (≠, <, >).',
        formula: '$$H_0: \\mu = \\mu_0 \\quad vs \\quad H_1: \\mu \\neq \\mu_0$$',
        example: 'Si probamos un medicamento nuevo. H₀: "El medicamento no tiene efecto (media igual)". H₁: "El medicamento cambia la media".',
        interpretation: 'El objetivo de la prueba es ver si los datos proporcionan suficiente evidencia para rechazar H₀ en favor de H₁.',
        imageUrl: IMAGES.hypothesis,
        imageType: 'concept'
      },
      {
        title: 'Tipos de Prueba',
        definition: 'La dirección de la prueba depende de H₁. Puede ser bilateral (dos colas) si H₁ es "diferente de", o unilateral (una cola) si H₁ es "mayor que" o "menor que".',
        context: 'Determina dónde se ubica la "región de rechazo" en la curva de distribución.',
        example: 'H₁: μ < 50 (Cola izquierda). H₁: μ > 50 (Cola derecha). H₁: μ ≠ 50 (Dos colas).',
        interpretation: 'En una prueba de dos colas, el error alfa se divide en dos extremos. En una cola, se concentra en un solo lado.',
        imageUrl: IMAGES.typesOfTests,
        imageType: 'chart'
      },
      {
        title: 'Errores Tipo I y Tipo II',
        definition: 'Error Tipo I (α): Rechazar H₀ cuando es verdadera (Falso Positivo). Error Tipo II (β): No rechazar H₀ cuando es falsa (Falso Negativo).',
        context: 'El nivel de significancia (α) es la probabilidad máxima de cometer un Error Tipo I que estamos dispuestos a aceptar.',
        example: 'Condenar a un inocente es Error Tipo I. Liberar a un culpable es Error Tipo II.',
        interpretation: 'Buscamos minimizar ambos, pero suelen ser inversamente proporcionales. Fijamos α (usualmente 0.05) para controlar el riesgo de falso positivo.',
        imageUrl: IMAGES.errors,
        imageType: 'formula'
      },
      {
        title: 'Estadístico de Prueba (Z vs T)',
        definition: 'Valor calculado a partir de la muestra que estandariza la diferencia entre la media muestral y la poblacional hipotética.',
        context: 'Usamos Z-test cuando conocemos la desviación estándar poblacional (σ) o n ≥ 30. Usamos T-test cuando desconocemos σ y n < 30.',
        formula: '$$Z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} \\quad , \\quad T = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$$ ',
        interpretation: 'Mide cuántos errores estándar se aleja nuestra muestra de lo que dice la hipótesis nula.',
        imageUrl: IMAGES.statistic,
        imageType: 'formula'
      },
      {
        title: 'Valor P (P-value)',
        definition: 'Es la probabilidad de obtener un estadístico de prueba igual o más extremo que el observado, asumiendo que H₀ es verdadera.',
        context: 'Es el criterio moderno para decidir. Si P-valor < α, rechazamos H₀.',
        example: 'Si P-valor = 0.03 y α = 0.05, rechazamos H₀ porque 0.03 es muy poco probable por azar.',
        interpretation: 'Cuanto menor es el valor P, más fuerte es la evidencia contra la hipótesis nula.',
        imageUrl: IMAGES.pValue,
        imageType: 'chart'
      }
    ]
  },
  {
    id: 'probability',
    title: 'Probabilidad Clásica (Laplace)',
    description: 'Rama de las matemáticas que estudia los experimentos aleatorios. La definición clásica de Laplace es la base para calcular probabilidades en espacios muestrales finitos y equiprobables.',
    video: {
      id: 'qFQToHdNN9k',
      title: 'Probabilidad: Regla de Laplace',
      description: 'Conceptos básicos de azar y cálculo de probabilidades simples.'
    },
    sections: [
      {
        title: 'Regla de Laplace',
        definition: 'Si un experimento aleatorio tiene un espacio muestral equiprobable, la probabilidad de un evento A es el cociente entre sus casos favorables y los casos totales posibles.',
        formula: '$$P(A) = \\frac{\\text{Número de casos favorables a A}}{\\text{Número total de casos posibles}}$$',
        example: 'Lanzar un dado y obtener un número mayor a 4 (5, 6). Casos favorables: 2. Totales: 6. P(A) = 2/6 = 33.3%.',
        interpretation: 'Cuantifica la certeza de que ocurra un evento, variando desde 0 (imposible) a 1 (seguro).',
        imageUrl: IMAGES.probability,
        imageType: 'concept'
      }
    ]
  },
  {
    id: 'tables',
    title: 'Tablas Estadísticas Oficiales',
    description: 'Recursos de referencia obligatoria para el cálculo de probabilidades en distribuciones teóricas. Incluye la tabla Z (Normal Estándar) y la tabla T de Student.',
    isTable: true,
    sections: []
  }
];
