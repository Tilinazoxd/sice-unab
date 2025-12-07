
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  BookOpen, 
  Table as TableIcon, 
  Trash2, 
  Download, 
  Upload, 
  Plus, 
  TrendingUp,
  Sigma,
  PieChart,
  Printer,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Home,
  FileText,
  PlayCircle,
  BarChart2,
  Image as ImageIcon,
  Activity,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, BarChart, Bar, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { DataPoint, UnivariateResults, BivariateResults, StatMode, TheoryTopic, TheorySection, HypothesisInput, HypothesisResult } from './types';
import { calculateUnivariate, calculateBivariate, getConfidenceIntervalSteps, calculateHypothesisTest } from './utils/statsEngine';
import { THEORY_TOPICS, UNAB_COLORS, Z_TABLE_DATA, T_TABLE_DATA, TEAM_MEMBERS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'calculator' | 'theory' | 'credits'>('home');
  const [activeTopicId, setActiveTopicId] = useState<string>(THEORY_TOPICS[0].id);
  
  // Calculator State
  const [calcMode, setCalcMode] = useState<'descriptive' | 'hypothesis'>('descriptive');
  
  // Descriptive State
  const [data, setData] = useState<DataPoint[]>([]);
  const [statMode, setStatMode] = useState<StatMode>('univariate');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [uniResults, setUniResults] = useState<UnivariateResults | null>(null);
  const [biResults, setBiResults] = useState<BivariateResults | null>(null);

  // Hypothesis State
  const [hypInput, setHypInput] = useState<HypothesisInput>({
    testType: 'mean',
    tailType: 'two-tailed',
    nullValue: 0,
    sampleMean: 0,
    sampleSize: 30,
    stdDev: 1,
    significance: 0.05
  });
  const [hypResult, setHypResult] = useState<HypothesisResult | null>(null);

  // Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // MathJax
  useEffect(() => {
    if ((window as any).MathJax) {
      (window as any).MathJax.typesetPromise && (window as any).MathJax.typesetPromise();
    }
  }, [activeView, activeTopicId, uniResults, biResults, hypResult, calcMode]);

  // --- Handlers ---
  const handleCalculate = () => {
    if (statMode === 'univariate') {
      const results = calculateUnivariate(data);
      setUniResults(results);
      setBiResults(null);
    } else {
      const uniRes = calculateUnivariate(data); 
      setUniResults(uniRes); 
      const results = calculateBivariate(data);
      setBiResults(results);
    }
    setTimeout(() => {
       if ((window as any).MathJax) {
        (window as any).MathJax.typesetPromise();
      }
    }, 100);
  };

  const handleHypothesisCalculate = () => {
    const res = calculateHypothesisTest(hypInput);
    setHypResult(res);
    setTimeout(() => {
       if ((window as any).MathJax) {
        (window as any).MathJax.typesetPromise();
      }
    }, 100);
  };

  const handleAddRow = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setData([...data, { id: newId, x: 0, y: statMode === 'bivariate' ? 0 : undefined }]);
  };

  const handleDeleteRow = (id: string) => {
    setData(data.filter(d => d.id !== id));
    if (data.length <= 1) {
       setUniResults(null);
       setBiResults(null);
    }
  };

  const handleClearData = () => {
    setData([]);
    setUniResults(null);
    setBiResults(null);
  };

  const handleDataChange = (id: string, field: 'x' | 'y', value: string) => {
    const numVal = parseFloat(value);
    setData(data.map(d => d.id === id ? { ...d, [field]: isNaN(numVal) ? 0 : numVal } : d));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n');
      const newData: DataPoint[] = [];
      
      lines.forEach((line, index) => {
        if (index === 0 && isNaN(parseFloat(line.split(',')[0]))) return; // Skip header
        const parts = line.split(/[;,]/);
        if (parts.length > 0 && parts[0].trim() !== '') {
          newData.push({
            id: Math.random().toString(36).substr(2, 9),
            x: parseFloat(parts[0]),
            y: parts.length > 1 ? parseFloat(parts[1]) : undefined
          });
        }
      });
      setData(newData);
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += statMode === 'bivariate' ? "X,Y\n" : "X\n";
    data.forEach(row => {
      csvContent += statMode === 'bivariate' ? `${row.x},${row.y}\n` : `${row.x}\n`;
    });
    if (uniResults) {
        csvContent += `\nRESULTADOS\nMedia,${uniResults.mean}\nMediana,${uniResults.median}\nDesviacion Std,${uniResults.stdDev}\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datos_resultados_sice.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => window.print();

  const downloadTableAsPDF = (tableName: string, data: typeof Z_TABLE_DATA) => {
      const printWindow = window.open('', '', 'width=900,height=650');
      if (!printWindow) return alert('Por favor habilite las ventanas emergentes');

      const headersHtml = data.headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f3f4f6;">${h}</th>`).join('');
      const rowsHtml = data.rows.map(row => 
          `<tr>${row.map((cell, i) => `<td style="border: 1px solid #ddd; padding: 6px; text-align: center; ${i===0?'font-weight:bold; background-color:#f9fafb':''}">${cell}</td>`).join('')}</tr>`
      ).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Tabla ${tableName} - SICE UNAB</title>
            <style>
              body { font-family: 'Arial', sans-serif; padding: 20px; }
              h1 { color: #003366; text-align: center; font-size: 24px; margin-bottom: 10px; }
              h2 { color: #555; text-align: center; font-size: 16px; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #888; }
            </style>
          </head>
          <body>
            <h1>Universidad Nacional de Barranca</h1>
            <h2>Tabla Estadística: ${tableName}</h2>
            <table>
              <thead><tr>${headersHtml}</tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
            <div class="footer">Generado por SICE - UNAB</div>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
  };

  // --- Renderers ---

  const renderHeader = () => (
    <header className="bg-[#003366] text-white shadow-lg sticky top-0 z-50 border-b-4 border-[#fbbf24] no-print">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveView('home')}>
            <div className="bg-white p-1 rounded-sm shadow-sm">
               <div className="w-10 h-10 flex items-center justify-center font-bold text-[#003366] border-2 border-[#003366] rounded-sm text-xs leading-none text-center">
                 UNAB
               </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">SICE</h1>
              <p className="text-xs text-blue-200 font-light">Universidad Nacional de Barranca</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeView === 'home' ? 'bg-[#fbbf24] text-[#003366] font-bold shadow-md' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <Home size={18} />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => setActiveView('calculator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeView === 'calculator' ? 'bg-[#fbbf24] text-[#003366] font-bold shadow-md' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <Calculator size={18} />
              <span>Calculadora</span>
            </button>
            <button
              onClick={() => setActiveView('theory')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeView === 'theory' ? 'bg-[#fbbf24] text-[#003366] font-bold shadow-md' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <BookOpen size={18} />
              <span>Teoría</span>
            </button>
            <button
              onClick={() => setActiveView('credits')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${activeView === 'credits' ? 'bg-[#fbbf24] text-[#003366] font-bold shadow-md' : 'hover:bg-blue-800 text-blue-100'}`}
            >
              <Users size={18} />
              <span>Créditos</span>
            </button>
          </nav>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#002855] px-4 py-2 space-y-2 border-t border-blue-800">
           {['home', 'calculator', 'theory', 'credits'].map((view) => (
             <button
               key={view}
               onClick={() => { setActiveView(view as any); setMobileMenuOpen(false); }}
               className={`flex items-center w-full space-x-2 px-4 py-3 rounded-md transition-colors capitalize ${activeView === view ? 'bg-[#fbbf24] text-[#003366] font-bold' : 'text-blue-100'}`}
             >
               {view === 'home' && <Home size={18} />}
               {view === 'calculator' && <Calculator size={18} />}
               {view === 'theory' && <BookOpen size={18} />}
               {view === 'credits' && <Users size={18} />}
               <span>{view === 'home' ? 'Inicio' : view === 'calculator' ? 'Calculadora' : view === 'theory' ? 'Teoría' : 'Créditos'}</span>
             </button>
           ))}
        </div>
      )}
    </header>
  );

  const renderHome = () => (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#003366] to-[#002855] text-white py-20 px-4 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
            <img 
                src="https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=1920&auto=format&fit=crop" 
                alt="Background Statistics" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fbbf24] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-block px-4 py-1 bg-blue-800/50 rounded-full border border-blue-700 text-blue-200 text-sm mb-6 uppercase tracking-wider font-semibold backdrop-blur-sm">
            Universidad Nacional de Barranca
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md">
            Sistema Integral de <br/>
            <span className="text-[#fbbf24]">Cálculo Estadístico</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-sm">
             Una plataforma académica moderna, de acceso libre, diseñada para facilitar el aprendizaje y la aplicación rigurosa de la estadística descriptiva e inferencial.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setActiveView('calculator')}
              className="px-8 py-4 bg-[#fbbf24] hover:bg-yellow-400 text-[#003366] font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
            >
              <Calculator className="mr-2" />
              Comenzar a Calcular
            </button>
            <button 
              onClick={() => setActiveView('theory')}
              className="px-8 py-4 bg-white/10 border-2 border-white hover:bg-white/20 text-white font-bold rounded-lg transition-all flex items-center justify-center text-lg backdrop-blur-sm"
            >
              <BookOpen className="mr-2" />
              Explorar Teoría
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer h-full" onClick={() => setActiveView('theory')}>
              <div className="w-14 h-14 bg-blue-100 text-[#003366] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Marco Teórico Completo</h3>
              <p className="text-gray-600 leading-relaxed">
                Conceptos detallados, fórmulas matemáticas formales y ejemplos prácticos seleccionados por docentes de la UNAB.
              </p>
           </div>
           
           <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer h-full" onClick={() => setActiveView('calculator')}>
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Calculator size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Calculadora Avanzada</h3>
              <p className="text-gray-600 leading-relaxed">
                Procesamiento de datos descriptivos y pruebas de hipótesis con explicación paso a paso de cada fórmula aplicada.
              </p>
           </div>

           <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer h-full" onClick={() => { setActiveView('theory'); setActiveTopicId('tables'); }}>
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <TableIcon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Tablas Estadísticas</h3>
              <p className="text-gray-600 leading-relaxed">
                Acceso directo y descarga de Tablas Z y T-Student digitalizadas para consultas rápidas durante exámenes o prácticas.
              </p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderCredits = () => {
    const teacher = TEAM_MEMBERS.find(m => m.isTeacher);
    const students = TEAM_MEMBERS.filter(m => !m.isTeacher);

    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] bg-slate-50 relative">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop" 
                alt="University Tech Background" 
                className="w-full h-full object-cover opacity-[0.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/5 to-slate-50/95"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 bg-[#003366] text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Créditos y Reconocimientos</h1>
            <p className="text-blue-200 text-lg font-light max-w-2xl mx-auto">El equipo académico y de desarrollo detrás de SICE - UNAB</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          
          {/* Extended Introductory Text */}
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl border border-blue-100 mb-16">
             <div className="text-center md:text-left mb-8">
               <h2 className="text-2xl font-bold text-[#003366] border-b-4 border-[#fbbf24] inline-block pb-2">
                  Nuestra Misión Académica
               </h2>
             </div>
             
             <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-justify">
               <p>
                  Como estudiantes de la <span className="font-bold text-[#003366]">Escuela Profesional de Ingeniería de Sistemas e Informática</span> de la Universidad Nacional de Barranca, entendemos que la estadística no es solo una asignatura, sino el lenguaje fundamental de la ciencia de datos, la investigación y la toma de decisiones estratégicas en la era moderna.
               </p>
               <p>
                  El proyecto <span className="font-bold">SICE (Sistema Integral de Cálculo Estadístico)</span> nace de nuestro compromiso genuino por aportar valor real a la comunidad universitaria. Nuestro propósito es democratizar el acceso a herramientas de cálculo avanzadas, ofreciendo un entorno digital donde la teoría rigurosa se encuentra con la práctica interactiva. Buscamos que cada estudiante pueda visualizar conceptos abstractos, validar sus resultados con confianza y fortalecer su pensamiento analítico.
               </p>
               
               <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#003366] mt-8">
                  <p className="italic text-gray-800">
                    "La excelencia académica requiere herramientas a la altura de los desafíos actuales."
                  </p>
                  <p className="mt-4 text-gray-700">
                    Esta plataforma es también un tributo a la exigencia académica impulsada por el <span className="font-bold text-[#003366]">Mg. Edward Iván Terrones Gálvez</span>. Su dedicación incansable, su rigor metodológico y su pasión por la enseñanza de la Estadística han sido el motor principal que nos inspiró a desarrollar este sistema. Agradecemos su mentoría, que nos ha impulsado a superar las expectativas y a elevar el estándar de nuestra formación profesional.
                  </p>
               </div>
             </div>
          </div>

          {/* Teacher Section (Separated) */}
          <div className="mb-20">
             <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px w-12 bg-[#fbbf24]"></div>
                <h3 className="text-3xl font-bold text-[#003366] uppercase tracking-widest text-center">
                   Docente Responsable del Curso
                </h3>
                <div className="h-px w-12 bg-[#fbbf24]"></div>
             </div>

             <div className="flex justify-center">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border-t-8 border-[#003366] max-w-lg w-full transform hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                   {/* Decorative circle */}
                   <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-50 rounded-full transition-transform group-hover:scale-125 z-0"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-48 h-48 rounded-full p-2 bg-gradient-to-br from-[#003366] to-blue-500 mb-8 shadow-lg">
                          <img 
                            src={teacher?.image} 
                            alt={teacher?.name}
                            className="w-full h-full rounded-full object-cover border-4 border-white"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000"; }}
                          />
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 mb-3">{teacher?.name}</h4>
                      <p className="text-[#003366] font-bold text-xl mb-6">{teacher?.role}</p>
                      <div className="inline-block px-6 py-2 bg-[#fbbf24] text-[#003366] text-sm font-bold rounded-full uppercase tracking-wider shadow-sm">
                          Mentor Académico
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Students Section */}
          <div>
             <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px w-8 bg-gray-300"></div>
                <h3 className="text-2xl font-bold text-gray-600 uppercase tracking-widest text-center">
                   Equipo de Desarrollo – Ingeniería de Sistemas e Informática
                </h3>
                <div className="h-px w-8 bg-gray-300"></div>
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {students.map((student, idx) => (
                   <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-8 text-center group hover:-translate-y-1">
                      <div className="w-32 h-32 rounded-full mb-6 p-1 border-4 border-[#fbbf24] shadow-md overflow-hidden relative">
                        <img 
                          src={student.image} 
                          alt={student.name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000"; }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#003366] transition-colors">{student.name}</h3>
                      <p className="text-sm font-medium text-gray-500 mb-4">{student.role}</p>
                      <div className="w-10 h-1 bg-gray-200 rounded-full group-hover:bg-[#fbbf24] transition-colors"></div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    );
  };

  const renderTheory = () => {
    const activeTopic = THEORY_TOPICS.find(t => t.id === activeTopicId);

    const renderImageOrPlaceholder = (url: string | undefined, type: string | undefined, title: string) => {
      if (url) {
        return (
          <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4 group relative">
             <img src={url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-medium">Figura ilustrativa: {title}</span>
             </div>
          </div>
        );
      }
      
      let bgClass = "bg-blue-50 text-blue-800";
      let Icon = ImageIcon;
      if (type === 'formula') { bgClass = "bg-slate-50 text-slate-800"; Icon = Sigma; }
      if (type === 'chart') { bgClass = "bg-green-50 text-green-800"; Icon = BarChart2; }

      return (
        <div className={`w-full h-48 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 ${bgClass} mb-4 opacity-90`}>
          <Icon size={48} className="mb-2 opacity-50" />
          <span className="text-sm font-medium uppercase tracking-wider">{title}</span>
          <span className="text-xs opacity-75 mt-1">Representación Visual</span>
        </div>
      );
    };

    return (
      <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-80px)] bg-slate-50">
        {/* Sidebar Accordion-like */}
        <div className="w-full md:w-1/4 bg-white border-r border-gray-200 shadow-sm z-10 flex flex-col h-[calc(100vh-80px)] sticky top-[80px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
             <h3 className="font-bold text-[#003366] flex items-center text-lg">
               <BookOpen size={20} className="mr-2" /> Contenido Académico
             </h3>
          </div>
          <div className="overflow-y-auto flex-grow p-2">
            <ul className="space-y-1">
              {THEORY_TOPICS.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between group ${activeTopicId === topic.id ? 'bg-[#003366] text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
                  >
                    <span className="font-medium">{topic.title}</span>
                    {activeTopicId === topic.id && <ChevronRight size={16} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4 p-6 md:p-10 overflow-y-auto h-[calc(100vh-80px)]">
          {activeTopic && !activeTopic.isTable && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              {/* Header */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-[#003366] mb-4 border-b pb-4">
                  {activeTopic.title}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  {activeTopic.description}
                </p>
              </div>

              {/* Video Embed */}
              {activeTopic.video && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-gray-900 p-4 flex items-center text-white">
                      <PlayCircle className="mr-2 text-red-500" />
                      <span className="font-semibold">Recurso Multimedia: {activeTopic.video.title}</span>
                   </div>
                   <div className="aspect-video w-full bg-black">
                     <iframe 
                       width="100%" 
                       height="100%" 
                       src={`https://www.youtube.com/embed/${activeTopic.video.id}`} 
                       title={activeTopic.video.title}
                       frameBorder="0" 
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                       allowFullScreen
                     ></iframe>
                   </div>
                   <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t">
                      <span className="font-bold">Objetivo:</span> {activeTopic.video.description}
                   </div>
                </div>
              )}

              {/* Sections Loop */}
              {activeTopic.sections.map((section, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fbbf24]"></div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-[#003366] w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 font-bold border border-blue-200">{idx + 1}</span>
                    {section.title}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Definición Formal</h4>
                           <p className="text-gray-700 leading-relaxed text-justify">{section.definition}</p>
                        </div>
                        
                        {section.context && (
                           <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                             <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Contexto de Uso</h4>
                             <p className="text-sm text-blue-900">{section.context}</p>
                           </div>
                        )}

                        {section.formula && (
                          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-inner">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Formulación Matemática</h4>
                            <div className="text-center text-lg py-2 overflow-x-auto">
                              {section.formula}
                            </div>
                          </div>
                        )}
                     </div>

                     <div className="space-y-6">
                        {renderImageOrPlaceholder(section.imageUrl, section.imageType, section.title)}
                        
                        {section.example && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-sm">
                             <h4 className="font-bold text-green-800 mb-2 flex items-center border-b border-green-200 pb-1"><FileText size={14} className="mr-1"/> Ejemplo Aplicado</h4>
                             <p className="text-green-900 leading-relaxed">{section.example}</p>
                          </div>
                        )}
                        {section.interpretation && (
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm">
                             <h4 className="font-bold text-amber-800 mb-2 border-b border-amber-200 pb-1">Interpretación Intuitiva</h4>
                             <p className="text-amber-900 italic leading-relaxed">"{section.interpretation}"</p>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTopic?.isTable && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">Tablas Estadísticas Oficiales</h2>
                  <p className="mb-6 text-gray-600 text-lg">Consulte las tablas de probabilidad acumulada. Utilice los botones a continuación para generar una versión imprimible en PDF.</p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                     <button 
                        onClick={() => downloadTableAsPDF('Distribución Normal (Z)', Z_TABLE_DATA)}
                        className="flex items-center px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md font-medium"
                     >
                        <Printer size={18} className="mr-2" /> Imprimir / Guardar Tabla Z (PDF)
                     </button>
                     <button 
                        onClick={() => downloadTableAsPDF('T-Student', T_TABLE_DATA)}
                        className="flex items-center px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md font-medium"
                     >
                        <Printer size={18} className="mr-2" /> Imprimir / Guardar Tabla T (PDF)
                     </button>
                  </div>

                  <div className="space-y-12">
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 px-6 py-4 border-b font-bold text-gray-800 flex justify-between items-center">
                              <span>Distribución Normal Estándar (Z) - P(Z &lt; z)</span>
                              <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">Vista Previa</span>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full text-sm text-center">
                                  <thead>
                                      <tr className="bg-gray-50 text-xs font-bold text-gray-600 uppercase">
                                          {Z_TABLE_DATA.headers.map((h, i) => <th key={i} className="px-3 py-3 border-b border-r last:border-r-0 min-w-[50px]">{h}</th>)}
                                      </tr>
                                  </thead>
                                  <tbody className="font-mono text-gray-600">
                                      {Z_TABLE_DATA.rows.map((row, i) => (
                                          <tr key={i} className="hover:bg-blue-50 transition-colors even:bg-slate-50">
                                              {row.map((cell, j) => (
                                                  <td key={j} className={`px-2 py-2 border-r last:border-r-0 ${j === 0 ? 'font-bold bg-gray-100 text-[#003366]' : ''}`}>{cell}</td>
                                              ))}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 px-6 py-4 border-b font-bold text-gray-800 flex justify-between items-center">
                              <span>Distribución T-Student (Área cola derecha)</span>
                              <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">Vista Previa</span>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full text-sm text-center">
                                  <thead>
                                      <tr className="bg-gray-50 text-xs font-bold text-gray-600 uppercase">
                                          {T_TABLE_DATA.headers.map((h, i) => <th key={i} className="px-3 py-3 border-b border-r last:border-r-0 min-w-[60px]">{h}</th>)}
                                      </tr>
                                  </thead>
                                  <tbody className="font-mono text-gray-600">
                                      {T_TABLE_DATA.rows.map((row, i) => (
                                          <tr key={i} className="hover:bg-blue-50 transition-colors even:bg-slate-50">
                                              {row.map((cell, j) => (
                                                  <td key={j} className={`px-2 py-2 border-r last:border-r-0 ${j === 0 ? 'font-bold bg-gray-100 text-[#003366]' : ''}`}>{cell}</td>
                                              ))}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHypothesisForm = () => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-[#003366] mb-6 flex items-center border-b pb-4">
              <Activity className="mr-2 text-[#fbbf24]" size={24} />
              <span>Configuración de Prueba</span>
          </h2>

          <div className="space-y-4">
              {/* Test Type Selection */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Parámetro</label>
                  <select 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                      value={hypInput.testType}
                      onChange={(e) => setHypInput({...hypInput, testType: e.target.value as any})}
                  >
                      <option value="mean">Media (μ)</option>
                      <option value="proportion">Proporción (p)</option>
                  </select>
              </div>

              {/* Tail Selection */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de la Prueba</label>
                  <select 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                      value={hypInput.tailType}
                      onChange={(e) => setHypInput({...hypInput, tailType: e.target.value as any})}
                  >
                      <option value="two-tailed">Bilateral (≠)</option>
                      <option value="left-tailed">Cola Izquierda (&lt;)</option>
                      <option value="right-tailed">Cola Derecha (&gt;)</option>
                  </select>
              </div>

              {/* Null Value */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Hipotético (H₀)</label>
                  <input 
                      type="number" 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                      value={hypInput.nullValue}
                      onChange={(e) => setHypInput({...hypInput, nullValue: parseFloat(e.target.value)})}
                  />
              </div>

              {/* Sample Data */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{hypInput.testType === 'mean' ? 'Media Muestral' : 'Proporción Muestral'}</label>
                      <input 
                          type="number" 
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                          value={hypInput.sampleMean}
                          onChange={(e) => setHypInput({...hypInput, sampleMean: parseFloat(e.target.value)})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño (n)</label>
                      <input 
                          type="number" 
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                          value={hypInput.sampleSize}
                          onChange={(e) => setHypInput({...hypInput, sampleSize: parseFloat(e.target.value)})}
                      />
                  </div>
              </div>

              {/* Std Dev (Only for Mean) */}
              {hypInput.testType === 'mean' && (
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desviación Estándar (s o σ)</label>
                      <input 
                          type="number" 
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                          value={hypInput.stdDev}
                          onChange={(e) => setHypInput({...hypInput, stdDev: parseFloat(e.target.value)})}
                      />
                  </div>
              )}

              {/* Alpha */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Significancia (α)</label>
                  <select 
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                      value={hypInput.significance}
                      onChange={(e) => setHypInput({...hypInput, significance: parseFloat(e.target.value)})}
                  >
                      <option value="0.10">0.10 (10%)</option>
                      <option value="0.05">0.05 (5%)</option>
                      <option value="0.01">0.01 (1%)</option>
                  </select>
              </div>

              <div className="pt-4">
                  <button 
                      onClick={handleHypothesisCalculate}
                      className="w-full py-3 bg-[#003366] hover:bg-[#002855] text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg text-sm transform hover:-translate-y-0.5"
                  >
                      CALCULAR PRUEBA
                  </button>
              </div>
          </div>
      </div>
  );

  const renderCalculator = () => (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      
      {/* Mode Switcher */}
      <div className="flex justify-center mb-8 no-print">
         <div className="bg-white p-1 rounded-lg shadow-md border border-gray-200 inline-flex">
            <button 
               onClick={() => setCalcMode('descriptive')}
               className={`px-6 py-2 rounded-md font-bold transition-all ${calcMode === 'descriptive' ? 'bg-[#fbbf24] text-[#003366] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
               Estadística Descriptiva
            </button>
            <button 
               onClick={() => setCalcMode('hypothesis')}
               className={`px-6 py-2 rounded-md font-bold transition-all ${calcMode === 'hypothesis' ? 'bg-[#fbbf24] text-[#003366] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
               Pruebas de Hipótesis
            </button>
         </div>
      </div>

      {calcMode === 'descriptive' ? (
        <div className="grid lg:grid-cols-12 gap-8">
            {/* ... Existing Descriptive Calculator Inputs ... */}
            <div className="lg:col-span-4 space-y-6 no-print">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#003366] mb-6 flex items-center border-b pb-4">
                <TableIcon className="mr-2 text-[#fbbf24]" size={24} /> 
                <span>Datos de Entrada</span>
                </h2>
                
                <div className="flex bg-gray-100 p-1.5 rounded-lg mb-6">
                <button 
                    onClick={() => { setStatMode('univariate'); handleClearData(); }}
                    className={`flex-1 text-sm font-bold py-2 rounded-md transition-all shadow-sm ${statMode === 'univariate' ? 'bg-white text-[#003366]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Univariado
                </button>
                <button 
                    onClick={() => { setStatMode('bivariate'); handleClearData(); }}
                    className={`flex-1 text-sm font-bold py-2 rounded-md transition-all shadow-sm ${statMode === 'bivariate' ? 'bg-white text-[#003366]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Bivariado (X, Y)
                </button>
                </div>

                <div className="max-h-[350px] overflow-y-auto border border-gray-200 rounded-lg mb-4 scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-600 uppercase bg-gray-50 sticky top-0 z-10 font-bold">
                    <tr>
                        <th className="px-4 py-3 text-center w-12 bg-gray-50">#</th>
                        <th className="px-4 py-3 bg-gray-50">Variable X</th>
                        {statMode === 'bivariate' && <th className="px-4 py-3 bg-gray-50">Variable Y</th>}
                        <th className="px-2 py-3 w-10 bg-gray-50"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {data.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-4 py-2 text-center text-gray-400 font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-2">
                            <input
                            type="number"
                            value={row.x || ''}
                            onChange={(e) => handleDataChange(row.id, 'x', e.target.value)}
                            className="w-full bg-transparent focus:outline-none font-mono text-gray-700 font-medium"
                            placeholder="0"
                            />
                        </td>
                        {statMode === 'bivariate' && (
                            <td className="px-4 py-2">
                            <input
                                type="number"
                                value={row.y || ''}
                                onChange={(e) => handleDataChange(row.id, 'y', e.target.value)}
                                className="w-full bg-transparent focus:outline-none font-mono text-gray-700 font-medium"
                                placeholder="0"
                            />
                            </td>
                        )}
                        <td className="px-2 py-2 text-center">
                            <button 
                            onClick={() => handleDeleteRow(row.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Eliminar fila"
                            >
                            <X size={14} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-12 text-center text-gray-400 text-sm italic">
                            <div className="flex flex-col items-center">
                                <TableIcon size={32} className="mb-2 opacity-20" />
                                Ingrese datos manualmente o importe un archivo
                            </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>

                <div className="space-y-3">
                <button onClick={handleAddRow} className="flex items-center justify-center w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium">
                    <Plus size={16} className="mr-2" /> Agregar Nueva Fila
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-center py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                        <Upload size={16} className="mr-2" /> Importar Excel/CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button onClick={exportToCSV} disabled={data.length === 0} className="flex items-center justify-center py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50">
                        <Download size={16} className="mr-2" /> Exportar + Resultados
                    </button>
                </div>
                
                <div className="pt-2 flex gap-3">
                    <button onClick={handleClearData} className="flex-1 flex items-center justify-center py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm">
                        <Trash2 size={16} className="mr-2" /> Limpiar Todo
                    </button>
                    <button onClick={handleCalculate} className="flex-[2] flex items-center justify-center py-3 bg-[#003366] hover:bg-[#002855] text-white rounded-lg transition-all font-bold shadow-md hover:shadow-lg text-sm transform hover:-translate-y-0.5">
                        <Calculator size={18} className="mr-2" /> CALCULAR AHORA
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* Results Panel (Descriptive) */}
            <div className="lg:col-span-8 space-y-8 print-only w-full">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Resultados</h2>
                    <p className="text-gray-500">Análisis descriptivo y procedimiento detallado</p>
                </div>
                <button 
                    onClick={printReport}
                    disabled={!uniResults}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-600"
                >
                    <Printer size={18} className="mr-2" />
                    Imprimir Reporte
                </button>
            </div>
            
            <div id="printable-area" className="animate-fadeIn">
                {!uniResults && !biResults ? (
                    <div className="flex flex-col items-center justify-center h-96 bg-white border-2 border-dashed border-gray-200 rounded-xl text-gray-400 no-print">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <TrendingUp size={48} className="opacity-50 text-blue-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">Esperando datos...</p>
                        <p className="text-sm">Ingrese valores en la tabla y presione Calcular</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Descriptive Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 break-inside-avoid">
                        {[
                            { label: 'Media Aritmética', value: uniResults?.mean.toFixed(2), color: 'border-blue-500', icon: Sigma },
                            { label: 'Mediana', value: uniResults?.median.toFixed(2), color: 'border-green-500', icon: BarChart2 },
                            { label: 'Desv. Estándar', value: uniResults?.stdDev.toFixed(2), color: 'border-purple-500', icon: TrendingUp },
                            ...(biResults ? [{ label: 'Correlación (r)', value: biResults.correlation.toFixed(3), color: 'border-orange-500', icon: Scatter }] : [])
                        ].map((card, i) => (
                            <div key={i} className={`bg-white p-4 rounded-xl shadow-sm border-t-4 ${card.color} border-l border-r border-b border-gray-100`}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                {/* @ts-ignore */}
                                <card.icon size={16} className="text-gray-300" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        ))}
                        </div>

                        {/* Descriptive Steps */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden break-inside-avoid">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-4 border-b border-gray-200">
                            <h3 className="font-bold text-lg text-[#003366] flex items-center">
                            <BookOpen className="mr-3 text-[#fbbf24]" size={20} /> 
                            Procedimiento Detallado
                            </h3>
                        </div>
                        <div className="p-6 space-y-8">
                            {[...(biResults ? biResults.steps : (uniResults ? uniResults.steps : [])), ...getConfidenceIntervalSteps(uniResults!, confidenceLevel)].map((step, idx) => (
                            <div key={idx} className="relative pl-6 border-l-2 border-gray-200 last:border-0 pb-8 last:pb-0 break-inside-avoid">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-400"></div>
                                <h4 className="font-bold text-md text-gray-800 mb-3">{step.title}</h4>
                                <div className="grid lg:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <div className="font-mono text-xs overflow-x-auto">
                                    <div className="mb-1 font-bold text-slate-400 uppercase text-[10px]">Fórmula</div>
                                    <div className="mb-3 text-slate-700 bg-white p-2 rounded border border-slate-100 shadow-sm inline-block min-w-full">{step.formula}</div>
                                    <div className="mb-1 font-bold text-slate-400 uppercase text-[10px]">Sustitución</div>
                                    <div className="text-slate-600">{step.substitution}</div>
                                    </div>
                                    <div className="flex flex-col justify-center border-l pl-4 border-slate-200">
                                    <div className="mb-1 font-bold text-green-600 uppercase text-[10px]">Resultado</div>
                                    <div className="text-xl font-bold text-gray-900 mb-2">{step.result}</div>
                                    <div className="text-xs text-gray-600 bg-amber-50 p-2 rounded-md border border-amber-100 flex items-start">
                                        <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                                        <span className="italic">{step.interpretation}</span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Descriptive Graphs */}
                        <div className="grid lg:grid-cols-1 gap-8 break-before-auto">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 break-inside-avoid">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center border-b pb-2">
                                <BarChart2 size={20} className="mr-2 text-[#003366]" /> Distribución de Frecuencias
                                </h3>
                                <div className="h-[350px] w-full bg-gray-50 rounded-lg p-2 border border-gray-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={
                                    data.map(d => ({ x: d.x })).sort((a,b) => a.x - b.x).reduce((acc: any[], curr) => {
                                        const existing = acc.find(item => item.name === curr.x);
                                        if (existing) existing.freq += 1;
                                        else acc.push({ name: curr.x, freq: 1 });
                                        return acc;
                                    }, [])
                                    }>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                        <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                                        <Bar dataKey="freq" fill={UNAB_COLORS.blue} radius={[4, 4, 0, 0]} name="Frecuencia" />
                                    </BarChart>
                                </ResponsiveContainer>
                                </div>
                            </div>

                            {statMode === 'bivariate' && biResults && (
                                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 break-inside-avoid">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center border-b pb-2">
                                    <TrendingUp size={20} className="mr-2 text-[#003366]" /> Dispersión y Línea de Regresión
                                </h3>
                                <div className="h-[350px] w-full bg-gray-50 rounded-lg p-2 border border-gray-100">
                                    <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" dataKey="x" name="X" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                        <YAxis type="number" dataKey="y" name="Y" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                        <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: '12px'}} />
                                        <Scatter name="Datos" data={data} fill={UNAB_COLORS.blue} shape="circle" />
                                        <Scatter 
                                        name="Regresión" 
                                        data={[
                                            { x: Math.min(...data.map(d => d.x)), y: biResults.intercept + biResults.slope * Math.min(...data.map(d => d.x)) },
                                            { x: Math.max(...data.map(d => d.x)), y: biResults.intercept + biResults.slope * Math.max(...data.map(d => d.x)) }
                                        ]} 
                                        line={{ stroke: UNAB_COLORS.gold, strokeWidth: 3 }} 
                                        shape={() => <></>}
                                        legendType="line"
                                        />
                                    </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 text-center bg-blue-50 p-2 rounded-lg border border-blue-100 text-[#003366] font-mono text-xs font-medium">
                                    Ecuación: y = {biResults.intercept.toFixed(4)} + {biResults.slope.toFixed(4)}x
                                </div>
                                </div>
                            )}
                        </div>

                        {/* Descriptive Config */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm no-print">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-[#003366] text-sm">Intervalos de Confianza</h4>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                    <label className="text-xs font-medium text-gray-700">Nivel:</label>
                                    <select 
                                        value={confidenceLevel} 
                                        onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                                        className="bg-white border border-gray-300 rounded px-3 py-1 text-xs focus:outline-none focus:border-blue-500 font-medium"
                                    >
                                        <option value="0.90">90%</option>
                                        <option value="0.95">95%</option>
                                        <option value="0.99">99%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
      ) : (
        /* HYPOTHESIS CALCULATOR MODE */
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 no-print">
                {renderHypothesisForm()}
            </div>

            <div className="lg:col-span-8 space-y-8 print-only w-full">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4 no-print">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Prueba de Hipótesis</h2>
                        <p className="text-gray-500">Resultado y decisión estadística</p>
                    </div>
                    <button 
                        onClick={printReport}
                        disabled={!hypResult}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-600"
                    >
                        <Printer size={18} className="mr-2" />
                        Imprimir
                    </button>
                </div>

                {!hypResult ? (
                    <div className="flex flex-col items-center justify-center h-96 bg-white border-2 border-dashed border-gray-200 rounded-xl text-gray-400 no-print">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <Activity size={48} className="opacity-50 text-blue-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">Esperando configuración...</p>
                        <p className="text-sm">Configure los parámetros y presione Calcular</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Result Summary */}
                        <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-l border-r border-b border-gray-200 text-center relative overflow-hidden" style={{borderTopColor: hypResult.isRejected ? '#ef4444' : '#10b981'}}>
                            <div className="absolute top-4 right-4 opacity-10">
                                {hypResult.isRejected ? <AlertTriangle size={80} /> : <CheckCircle size={80} />}
                            </div>
                            <h3 className={`text-4xl font-bold mb-2 ${hypResult.isRejected ? 'text-red-600' : 'text-green-600'}`}>
                                {hypResult.isRejected ? 'Se RECHAZA H₀' : 'No se rechaza H₀'}
                            </h3>
                            <p className="text-gray-600 text-lg">
                                {hypResult.isRejected 
                                  ? 'Existe evidencia estadística significativa a favor de la hipótesis alternativa.' 
                                  : 'No existe suficiente evidencia estadística para rechazar la hipótesis nula.'}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden break-inside-avoid">
                            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-4 border-b border-gray-200">
                                <h3 className="font-bold text-lg text-[#003366] flex items-center">
                                <BookOpen className="mr-3 text-[#fbbf24]" size={20} /> 
                                Solución Paso a Paso
                                </h3>
                            </div>
                            <div className="p-6 space-y-8">
                                {hypResult.steps.map((step, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-gray-200 last:border-0 pb-8 last:pb-0 break-inside-avoid">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-400"></div>
                                    <h4 className="font-bold text-md text-gray-800 mb-3">{step.title}</h4>
                                    <div className="grid lg:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div className="font-mono text-xs overflow-x-auto">
                                            {step.formula && (
                                                <>
                                                    <div className="mb-1 font-bold text-slate-400 uppercase text-[10px]">Fórmula / Planteamiento</div>
                                                    <div className="mb-3 text-slate-700 bg-white p-2 rounded border border-slate-100 shadow-sm inline-block min-w-full">{step.formula}</div>
                                                </>
                                            )}
                                            {step.substitution && (
                                                <>
                                                    <div className="mb-1 font-bold text-slate-400 uppercase text-[10px]">Sustitución</div>
                                                    <div className="text-slate-600">{step.substitution}</div>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center border-l pl-4 border-slate-200">
                                            <div className="mb-1 font-bold text-green-600 uppercase text-[10px]">Resultado</div>
                                            <div className="text-xl font-bold text-gray-900 mb-2">{step.result}</div>
                                            <div className="text-xs text-gray-600 bg-amber-50 p-2 rounded-md border border-amber-100 flex items-start">
                                                <div className="mt-1 mr-2 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                                                <span className="italic">{step.interpretation}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* Distribution Graph */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 break-inside-avoid">
                            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center border-b pb-2">
                                <Activity size={20} className="mr-2 text-[#003366]" /> Región de Rechazo y Estadístico
                            </h3>
                            <div className="h-[400px] w-full bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={hypResult.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis 
                                            dataKey="x" 
                                            type="number" 
                                            domain={['dataMin', 'dataMax']} 
                                            tickCount={9}
                                            tick={{fill: '#6b7280', fontSize: 12}}
                                        />
                                        <YAxis hide />
                                        <RechartsTooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-2 border shadow-lg text-xs rounded">
                                                            <p>Z/T: {data.x}</p>
                                                            <p className={data.isCritical ? 'text-red-500 font-bold' : 'text-gray-500'}>
                                                                {data.isCritical ? 'Zona de Rechazo' : 'Zona de No Rechazo'}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        {/* Critical Region Shade */}
                                        <Area 
                                            type="monotone" 
                                            dataKey="y" 
                                            data={hypResult.chartData.map(d => ({...d, y: d.isCritical ? d.y : 0}))} 
                                            fill="#fca5a5" 
                                            stroke="none" 
                                            fillOpacity={0.6} 
                                        />
                                        {/* Distribution Curve */}
                                        <Line 
                                            type="monotone" 
                                            dataKey="y" 
                                            stroke="#003366" 
                                            strokeWidth={2} 
                                            dot={false} 
                                            activeDot={false}
                                        />
                                        {/* Statistic Marker Line */}
                                        <ReferenceLine x={hypResult.statistic} stroke="#10b981" strokeWidth={3} label={{ value: 'Estadístico', fill: '#10b981', position: 'top' }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded border border-gray-200 text-xs shadow-sm">
                                    <div className="flex items-center mb-1"><span className="w-3 h-3 bg-red-300 mr-2 rounded-sm"></span> Zona de Rechazo (α)</div>
                                    <div className="flex items-center"><span className="w-3 h-3 bg-[#003366] mr-2 rounded-full h-[2px]"></span> Distribución {hypResult.distribution}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {renderHeader()}
      <main className="flex-grow">
        {activeView === 'home' && renderHome()}
        {activeView === 'calculator' && renderCalculator()}
        {activeView === 'theory' && renderTheory()}
        {activeView === 'credits' && renderCredits()}
      </main>
      <footer className="bg-[#002855] text-white py-6 mt-auto no-print border-t border-blue-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="mb-4 md:mb-0 text-center md:text-left">
                <h4 className="font-bold text-lg mb-1">UNAB</h4>
                <p className="text-xs text-blue-200">Universidad Nacional de Barranca</p>
             </div>
             <div className="text-center md:text-right">
                <p className="text-xs opacity-80">&copy; {new Date().getFullYear()} Sistema Integral de Cálculo Estadístico (SICE).</p>
                <p className="text-[10px] text-slate-400 mt-1">Herramienta académica de uso libre.</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
