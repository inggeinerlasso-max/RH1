import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Download,
  Edit2,
  FileText,
  Filter,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Building2,
  Scale,
  PieChart,
  ClipboardList
} from 'lucide-react';

// Categorías y tipos de residuos hospitalarios normativos
const WASTE_CATEGORIES = {
  BIOHAZARD: {
    id: 'BIOHAZARD',
    name: 'Riesgo Biológico / Infecciosos',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-500',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    subtypes: [
      { id: 'biosanitarios', name: 'Biosanitarios (Gasa, guantes, jeringas)' },
      { id: 'anatomopatologicos', name: 'Anatomopatológicos (Tejidos, fluidos)' },
      { id: 'cortopunzantes', name: 'Cortopunzantes (Agujas, bisturís)' },
      { id: 'animales', name: 'De Animales' }
    ]
  },
  CHEMICAL: {
    id: 'CHEMICAL',
    name: 'Químicos y Especiales',
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-500',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    subtypes: [
      { id: 'fármacos', name: 'Medicamentos y Fármacos Vencidos' },
      { id: 'citostáticos', name: 'Fármacos Citostáticos / Oncológicos' },
      { id: 'reactivos', name: 'Reactivos de Laboratorio' },
      { id: 'metales', name: 'Metales Pesados (Mercurio, Amalgamas)' }
    ]
  },
  RADIOACTIVE: {
    id: 'RADIOACTIVE',
    name: 'Radiactivos',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-500',
    badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    subtypes: [
      { id: 'radioisotopos', name: 'Fuentes y Sustancias Radiactivas' }
    ]
  },
  NON_HAZARDOUS: {
    id: 'NON_HAZARDOUS',
    name: 'No Peligrosos',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    subtypes: [
      { id: 'biodegradables', name: 'Biodegradables / Orgánicos' },
      { id: 'reciclables', name: 'Reciclables (Plástico, Cartón, Vidrio)' },
      { id: 'ordinarios', name: 'Ordinarios e Inertes (No aprovechables)' }
    ]
  }
};

// Áreas y Servicios de Clínica Girón ESE
const HOSPITAL_AREAS = [
  'Urgencias',
  'Hospitalización',
  'Consultorio 10',
  'Laboratorio',
  'Vacunación',
  'Morgue y Almacén',
  'Consulta Externa Alta',
  'Consulta Externa Baja',
  'Farmacia',
  'Área de Preparación',
  'PAS Malpaso',
  'PAS Nuevo Girón',
  'Girosalud'
];

// Opciones de Turno por servicio
const SHIFTS_THREE_TURNS = [
  'Mañana (06:00 - 14:00)',
  'Tarde (14:00 - 22:00)',
  'Noche (22:00 - 06:00)'
];

const SHIFTS_SINGLE_TURN = [
  'Turno Único (07:00 am - 05:00 pm)'
];

// Función helper para obtener turnos disponibles según el área
const getShiftsForArea = (areaName) => {
  if (areaName === 'Urgencias' || areaName === 'Laboratorio') {
    return SHIFTS_THREE_TURNS;
  }
  return SHIFTS_SINGLE_TURN;
};

const generateMockData = () => {
  const today = new Date();
  const mockLogs = [];
  const operators = ['Carlos Mendoza', 'Maria Fernanda Rios', 'Jorge Eliécer Silva', 'Ana Lucía Gómez'];
  
  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(i / 4));
    
    const dateStr = date.toISOString().split('T')[0];
    const categoryKeys = Object.keys(WASTE_CATEGORIES);
    const catKey = categoryKeys[i % categoryKeys.length];
    const catObj = WASTE_CATEGORIES[catKey];
    const subtype = catObj.subtypes[i % catObj.subtypes.length];
    const area = HOSPITAL_AREAS[i % HOSPITAL_AREAS.length];
    
    // Obtener turnos permitidos para el área
    const areaShifts = getShiftsForArea(area);
    const shift = areaShifts[i % areaShifts.length];

    let weight = 0;
    if (catKey === 'BIOHAZARD') weight = parseFloat((Math.random() * 15 + 3).toFixed(2));
    else if (catKey === 'CHEMICAL') weight = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
    else if (catKey === 'RADIOACTIVE') weight = parseFloat((Math.random() * 2 + 0.1).toFixed(2));
    else weight = parseFloat((Math.random() * 25 + 5).toFixed(2));

    mockLogs.push({
      id: `RH1-${1000 + i}`,
      date: dateStr,
      time: `${10 + (i % 8)}:${(i * 12) % 60 < 10 ? '0' : ''}${(i * 12) % 60}`,
      categoryKey: catKey,
      subtypeId: subtype.id,
      subtypeName: subtype.name,
      area: area,
      weightKg: weight,
      shift: shift,
      operator: operators[i % operators.length],
      notes: i % 7 === 0 ? 'Contenedor lleno al límite. Rotulado verificado.' : '',
      alert: i % 11 === 0 ? 'Bolsa sobrecargada levemente' : ''
    });
  }
  return mockLogs;
};

export default function App() {
  const [logs, setLogs] = useState(generateMockData());
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const initialArea = HOSPITAL_AREAS[0]; // Urgencias
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    categoryKey: 'BIOHAZARD',
    subtypeId: WASTE_CATEGORIES.BIOHAZARD.subtypes[0].id,
    area: initialArea,
    weightKg: '',
    shift: getShiftsForArea(initialArea)[0],
    operator: 'Carlos Mendoza',
    notes: '',
    alert: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filtering State
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [filterArea, setFilterArea] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let todayTotalKg = 0;
    let monthTotalKg = 0;
    let biohazardTotalKg = 0;
    let chemicalTotalKg = 0;
    let nonHazardousTotalKg = 0;

    const areaBreakdown = {};
    HOSPITAL_AREAS.forEach(area => { areaBreakdown[area] = 0; });

    logs.forEach(log => {
      const logDate = new Date(log.date);
      const logWeight = parseFloat(log.weightKg) || 0;

      if (log.date === todayStr) {
        todayTotalKg += logWeight;
      }

      if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
        monthTotalKg += logWeight;
      }

      if (log.categoryKey === 'BIOHAZARD') biohazardTotalKg += logWeight;
      else if (log.categoryKey === 'CHEMICAL' || log.categoryKey === 'RADIOACTIVE') chemicalTotalKg += logWeight;
      else nonHazardousTotalKg += logWeight;

      if (areaBreakdown[log.area] !== undefined) {
        areaBreakdown[log.area] += logWeight;
      } else {
        areaBreakdown[log.area] = logWeight;
      }
    });

    const hazardousTotal = biohazardTotalKg + chemicalTotalKg;
    const grandTotal = hazardousTotal + nonHazardousTotalKg;
    const hazardousRatio = grandTotal > 0 ? ((hazardousTotal / grandTotal) * 100).toFixed(1) : 0;
    const recyclingRatio = grandTotal > 0 ? ((nonHazardousTotalKg / grandTotal) * 100).toFixed(1) : 0;

    return {
      todayTotalKg: todayTotalKg.toFixed(2),
      monthTotalKg: monthTotalKg.toFixed(2),
      biohazardTotalKg: biohazardTotalKg.toFixed(2),
      chemicalTotalKg: chemicalTotalKg.toFixed(2),
      nonHazardousTotalKg: nonHazardousTotalKg.toFixed(2),
      hazardousRatio,
      recyclingRatio,
      areaBreakdown,
      totalLogsCount: logs.length
    };
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return logs.filter(log => {
      if (filterDateRange === 'today' && log.date !== todayStr) return false;
      if (filterDateRange === 'week') {
        const logDate = new Date(log.date);
        const diffDays = (today - logDate) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      }
      if (filterDateRange === 'month') {
        const logDate = new Date(log.date);
        if (logDate.getMonth() !== today.getMonth() || logDate.getFullYear() !== today.getFullYear()) return false;
      }

      if (filterArea !== 'ALL' && log.area !== filterArea) return false;
      if (filterCategory !== 'ALL' && log.categoryKey !== filterCategory) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesSubtype = log.subtypeName.toLowerCase().includes(q);
        const matchesArea = log.area.toLowerCase().includes(q);
        const matchesOperator = log.operator.toLowerCase().includes(q);
        const matchesId = log.id.toLowerCase().includes(q);
        return matchesSubtype || matchesArea || matchesOperator || matchesId;
      }

      return true;
    });
  }, [logs, filterDateRange, filterArea, filterCategory, searchTerm]);

  const handleCategoryChange = (catKey) => {
    const category = WASTE_CATEGORIES[catKey];
    setFormData({
      ...formData,
      categoryKey: catKey,
      subtypeId: category.subtypes[0].id
    });
  };

  const handleAreaChange = (newArea) => {
    const availableShifts = getShiftsForArea(newArea);
    setFormData({
      ...formData,
      area: newArea,
      shift: availableShifts[0]
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.weightKg || parseFloat(formData.weightKg) <= 0) {
      alert('Por favor ingrese un peso válido mayor a 0 kg.');
      return;
    }

    const selectedCategory = WASTE_CATEGORIES[formData.categoryKey];
    const selectedSubtype = selectedCategory.subtypes.find(s => s.id === formData.subtypeId);

    if (editingId) {
      setLogs(logs.map(log => log.id === editingId ? {
        ...log,
        ...formData,
        weightKg: parseFloat(formData.weightKg),
        subtypeName: selectedSubtype ? selectedSubtype.name : formData.subtypeId
      } : log));
      setToastMessage('Registro actualizado correctamente para Clínica Girón ESE');
      setEditingId(null);
    } else {
      const newEntry = {
        id: `RH1-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        weightKg: parseFloat(formData.weightKg),
        subtypeName: selectedSubtype ? selectedSubtype.name : formData.subtypeId
      };
      setLogs([newEntry, ...logs]);
      setToastMessage('Nuevo pesaje registrado en el sistema RH1');
    }

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    const resetArea = HOSPITAL_AREAS[0];
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      categoryKey: 'BIOHAZARD',
      subtypeId: WASTE_CATEGORIES.BIOHAZARD.subtypes[0].id,
      area: resetArea,
      weightKg: '',
      shift: getShiftsForArea(resetArea)[0],
      operator: formData.operator,
      notes: '',
      alert: ''
    });

    if (editingId) setActiveTab('history');
  };

  const handleEditClick = (log) => {
    setEditingId(log.id);
    setFormData({
      date: log.date,
      time: log.time,
      categoryKey: log.categoryKey,
      subtypeId: log.subtypeId,
      area: log.area,
      weightKg: log.weightKg.toString(),
      shift: log.shift,
      operator: log.operator,
      notes: log.notes || '',
      alert: log.alert || ''
    });
    setActiveTab('register');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm(`¿Está seguro de eliminar el registro ${id}?`)) {
      setLogs(logs.filter(l => l.id !== id));
      setToastMessage('Registro eliminado con éxito');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Fecha', 'Hora', 'Categoría', 'Tipo Residuo', 'Área / Servicio', 'Peso (kg)', 'Turno', 'Responsable', 'Observaciones'];
    const rows = filteredLogs.map(log => [
      log.id,
      log.date,
      log.time,
      WASTE_CATEGORIES[log.categoryKey]?.name || log.categoryKey,
      `"${log.subtypeName}"`,
      `"${log.area}"`,
      log.weightKg,
      `"${log.shift}"`,
      `"${log.operator}"`,
      `"${log.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Clinica_Giron_ESE_Residuos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* TOAST NOTIFICATION */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 text-white p-2 rounded-xl shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Clínica Girón ESE <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold ml-2">RH1 Control</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistema de Pesaje y Control Diario de Residuos Hospitalarios
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => { setActiveTab('register'); setEditingId(null); }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Pesaje</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-700/50 flex space-x-1 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard & Indicadores
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'register'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            {editingId ? 'Editando Pesaje' : 'Formulario de Registro'}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Historial de Registros
            <span className="ml-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-2 py-0.5 text-xs font-bold">
              {logs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'manifest'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Manifiesto Oficial RH1
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* TAB 1: DASHBOARD & METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* KPI 1 */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Generado Hoy</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.todayTotalKg} <span className="text-sm font-normal text-slate-500">kg</span></h3>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-950/60 p-3 rounded-xl text-teal-600 dark:text-teal-400">
                    <Scale className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-teal-600 dark:text-teal-400 font-medium gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Monitoreo diario en tiempo real</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acumulado Mes Actual</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.monthTotalKg} <span className="text-sm font-normal text-slate-500">kg</span></h3>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/60 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Mes en curso</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Peligrosos / Biológicos</p>
                    <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{stats.hazardousRatio}%</h3>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/60 p-3 rounded-xl text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Total de {(parseFloat(stats.biohazardTotalKg) + parseFloat(stats.chemicalTotalKg)).toFixed(1)} kg peligrosos
                </p>
              </div>

              {/* KPI 4 */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">No Peligrosos</p>
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.recyclingRatio}%</h3>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Meta de segregación activa</span>
                </div>
              </div>

            </div>

            {/* CHARTS & DISTRIBUTION SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* DISTRIBUTION BY CATEGORY */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-teal-600" />
                    Distribución por Categoría
                  </h3>
                </div>

                <div className="space-y-4">
                  {Object.keys(WASTE_CATEGORIES).map(catKey => {
                    const cat = WASTE_CATEGORIES[catKey];
                    let totalCatKg = 0;
                    if (catKey === 'BIOHAZARD') totalCatKg = stats.biohazardTotalKg;
                    else if (catKey === 'CHEMICAL') totalCatKg = stats.chemicalTotalKg;
                    else if (catKey === 'RADIOACTIVE') totalCatKg = 0;
                    else totalCatKg = stats.nonHazardousTotalKg;

                    const grandTotal = parseFloat(stats.biohazardTotalKg) + parseFloat(stats.chemicalTotalKg) + parseFloat(stats.nonHazardousTotalKg);
                    const percentage = grandTotal > 0 ? ((totalCatKg / grandTotal) * 100).toFixed(1) : 0;

                    return (
                      <div key={catKey} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                            {cat.name}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{totalCatKg} kg ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Verificar etiquetado y bolsas rojas en acopio.
                  </p>
                </div>
              </div>

              {/* GENERATION BY HOSPITAL SERVICE / AREA */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    Generación por Servicio - Clínica Girón ESE
                  </h3>
                  <span className="text-xs text-slate-500">Filtrado en kg</span>
                </div>

                <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-2">
                  {Object.entries(stats.areaBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([area, kg]) => {
                      const maxKg = Math.max(...Object.values(stats.areaBreakdown), 1);
                      const percentOfMax = (kg / maxKg) * 100;

                      return (
                        <div key={area} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-[300px]">{area}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{kg.toFixed(1)} kg</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-md overflow-hidden flex">
                            <div
                              className="bg-teal-600 dark:bg-teal-500 h-full rounded-md transition-all duration-500"
                              style={{ width: `${percentOfMax}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* ENVIRONMENTAL NORMATIVE ALERT BOX */}
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-500/30 text-teal-300">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Cumplimiento Sanitario & Ambiental (RH1)</h4>
                  <p className="text-xs text-teal-100/80 mt-1 max-w-2xl">
                    Registro diario consolidado de **Clínica Girón ESE** a cargo de la Directora Ambiental **Gladys Florez** para reportes oficiales de auditoría sanitaria.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('manifest')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg whitespace-nowrap transition-all shadow"
              >
                Ver Manifiesto RH1
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: FORM FOR PESAJES */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="bg-teal-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-6 h-6" />
                    <div>
                      <h2 className="text-lg font-bold">
                        {editingId ? `Editar Pesaje: ${editingId}` : 'Nuevo Registro de Pesaje Diario - Clínica Girón ESE'}
                      </h2>
                      <p className="text-xs text-teal-100">Diligencie los datos recolectados en la báscula de acopio</p>
                    </div>
                  </div>
                  {editingId && (
                    <button
                      onClick={() => { setEditingId(null); setActiveTab('history'); }}
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-xs rounded-lg font-medium"
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                
                {/* CATEGORY SELECTOR */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    1. Clasificación del Residuo *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.keys(WASTE_CATEGORIES).map(catKey => {
                      const cat = WASTE_CATEGORIES[catKey];
                      const isSelected = formData.categoryKey === catKey;

                      return (
                        <div
                          key={catKey}
                          onClick={() => handleCategoryChange(catKey)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? `${cat.borderColor} bg-slate-50 dark:bg-slate-700/50 shadow-sm`
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-4 h-4 rounded-full ${cat.color}`}></span>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {cat.subtypes.length} subgrupos
                              </p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className={`w-5 h-5 ${cat.textColor}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SUBTYPE & SERVICE AREA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo Específico de Residuo *
                    </label>
                    <select
                      value={formData.subtypeId}
                      onChange={(e) => setFormData({ ...formData, subtypeId: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      {WASTE_CATEGORIES[formData.categoryKey].subtypes.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Área / Servicio de Origen *
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                    >
                      {HOSPITAL_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WEIGHT, DATE, TIME, SHIFT */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">
                      Peso Registrado (Kilogramos) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={formData.weightKg}
                        onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-teal-500 rounded-lg p-2.5 pr-10 text-base font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">kg</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha del Registro
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Turno Hospitalario
                    </label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none font-medium text-teal-700 dark:text-teal-300"
                    >
                      {getShiftsForArea(formData.area).map(shift => (
                        <option key={shift} value={shift}>{shift}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formData.area === 'Urgencias' || formData.area === 'Laboratorio'
                        ? 'Servicio de 24h (3 turnos de 8h)'
                        : 'Servicio regular (1 turno 7am - 5pm)'}
                    </p>
                  </div>
                </div>

                {/* OPERATOR & NOTES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Operador / Responsable del Pesaje
                    </label>
                    <input
                      type="text"
                      value={formData.operator}
                      onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                      placeholder="Nombre del personal"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Observaciones o Novedad (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="ej. Contenedor rojo sin rotular, bolsa sobrepasada..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {editingId ? 'Guardar Cambios del Registro' : 'Guardar Pesaje RH1'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY & TABLES */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, área, operador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 text-xs outline-none"
                >
                  <option value="all">Todas las Fechas</option>
                  <option value="today">Registros de Hoy</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Mes Actual</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 text-xs outline-none"
                >
                  <option value="ALL">Todas las Categorías</option>
                  {Object.keys(WASTE_CATEGORIES).map(k => (
                    <option key={k} value={k}>{WASTE_CATEGORIES[k].name}</option>
                  ))}
                </select>

                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 text-xs outline-none"
                >
                  <option value="ALL">Todas las Áreas</option>
                  {HOSPITAL_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-teal-600" />
                  Exportar CSV / Excel
                </button>
              </div>

            </div>

            {/* LOGS TABLE */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Código RH1</th>
                      <th className="py-3.5 px-4">Fecha & Hora</th>
                      <th className="py-3.5 px-4">Clasificación / Subtipo</th>
                      <th className="py-3.5 px-4">Área Hospitalaria</th>
                      <th className="py-3.5 px-4 text-right">Peso (Kg)</th>
                      <th className="py-3.5 px-4">Operador</th>
                      <th className="py-3.5 px-4">Novedad</th>
                      <th className="py-3.5 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-slate-400">
                          No se encontraron registros que coincidan con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map(log => {
                        const cat = WASTE_CATEGORIES[log.categoryKey] || WASTE_CATEGORIES.BIOHAZARD;

                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {log.id}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              <div>{log.date}</div>
                              <div className="text-[10px] text-slate-400">{log.time}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${cat.badgeBg} mb-1`}>
                                {cat.name}
                              </span>
                              <div className="text-slate-800 dark:text-slate-200 font-medium">
                                {log.subtypeName}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                              {log.area}
                              <div className="text-[10px] text-slate-400">{log.shift}</div>
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">
                              {log.weightKg.toFixed(2)} kg
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {log.operator}
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                              {log.notes ? (
                                <span className="text-amber-600 dark:text-amber-400 text-[11px] flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                  {log.notes}
                                </span>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-600">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-1">
                                <button
                                  onClick={() => handleEditClick(log)}
                                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(log.id)}
                                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/50 rounded text-red-600 dark:text-red-400 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 px-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
                <span>Mostrando {filteredLogs.length} de {logs.length} registros totales</span>
                <span className="font-bold">Total Peso Filtrado: {filteredLogs.reduce((acc, curr) => acc + curr.weightKg, 0).toFixed(2)} kg</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: OFFICIAL MANIFEST TEMPLATE (RH1) */}
        {activeTab === 'manifest' && (
          <div className="space-y-4">
            
            <div className="flex justify-between items-center print:hidden bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Plantilla Oficial de Manifiesto RH1 - Clínica Girón ESE</h3>
                <p className="text-xs text-slate-500">Formato listo para impresión física o archivo oficial institucional</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimir Documento
              </button>
            </div>

            {/* PRINTABLE RH1 FORM CONTAINER */}
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
              
              {/* HEADER */}
              <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide">FORMATO DE REGISTRO DIARIO DE RESIDUOS (RH1)</h2>
                  <p className="text-xs font-semibold text-slate-600">SISTEMA NACIONAL DE GESTIÓN DE RESIDUOS HOSPITALARIOS</p>
                </div>
                <div className="text-right border-l-2 border-slate-800 pl-4">
                  <p className="text-xs font-bold">CÓDIGO INSTITUCIONAL: <span className="font-mono">CG-ESE-RH1</span></p>
                  <p className="text-xs">FECHA IMPRESIÓN: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* INSTITUTION DETAILS */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <p><span className="font-bold">INSTITUCIÓN:</span> Clínica Girón ESE</p>
                  <p><span className="font-bold">SERVICIOS REGISTRADOS:</span> 13 Áreas asistenciales / PAS / Girosalud</p>
                </div>
                <div>
                  <p><span className="font-bold">DIRECTORA AMBIENTAL:</span> Gladys Florez</p>
                  <p><span className="font-bold">SISTEMA:</span> EcoMed RH1 Digital</p>
                </div>
              </div>

              {/* SUMMARY TABLE FOR MANIFEST */}
              <h4 className="text-xs font-bold uppercase mb-2">Consolidado del Día - {new Date().toLocaleDateString()}</h4>
              <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-left font-bold border-b border-slate-300">
                    <th className="border border-slate-300 p-2">Categoría del Residuo</th>
                    <th className="border border-slate-300 p-2">Subtipo Principal</th>
                    <th className="border border-slate-300 p-2 text-right">Cantidad Total (Kg)</th>
                    <th className="border border-slate-300 p-2">Estado Recipientes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold text-red-700">Riesgo Biológico / Infecciosos</td>
                    <td className="border border-slate-300 p-2">Biosanitarios y Cortopunzantes</td>
                    <td className="border border-slate-300 p-2 text-right font-bold">{stats.biohazardTotalKg} kg</td>
                    <td className="border border-slate-300 p-2">Bolsa Roja / Guardianes Sellados</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold text-purple-700">Químicos y Especiales</td>
                    <td className="border border-slate-300 p-2">Medicamentos / Reactivos</td>
                    <td className="border border-slate-300 p-2 text-right font-bold">{stats.chemicalTotalKg} kg</td>
                    <td className="border border-slate-300 p-2">Contenedor Rígido Etiquetado</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold text-emerald-700">No Peligrosos</td>
                    <td className="border border-slate-300 p-2">Biodegradables / Reciclables / Ordinarios</td>
                    <td className="border border-slate-300 p-2 text-right font-bold">{stats.nonHazardousTotalKg} kg</td>
                    <td className="border border-slate-300 p-2">Bolsas Verdes y Grises</td>
                  </tr>
                  <tr className="bg-slate-50 font-black">
                    <td colSpan="2" className="border border-slate-300 p-2 text-right">TOTAL GENERAL GENERADO HOY:</td>
                    <td className="border border-slate-300 p-2 text-right text-sm">{stats.todayTotalKg} kg</td>
                    <td className="border border-slate-300 p-2">Conforme Normativa RH1</td>
                  </tr>
                </tbody>
              </table>

              {/* SIGNATURE SECTION */}
              <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-slate-300 text-xs">
                <div className="text-center">
                  <div className="border-b border-slate-400 mb-2 h-10"></div>
                  <p className="font-bold">Gladys Florez</p>
                  <p className="text-slate-600 font-semibold">Directora Ambiental - Clínica Girón ESE</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-400 mb-2 h-10"></div>
                  <p className="font-bold">Firma Empresa Recolectora Especializada</p>
                  <p className="text-slate-500">Gestor de Residuos Autorizado</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Clínica Girón ESE &copy; 2026 - Sistema de Gestión e Indicadores de Residuos Hospitalarios (RH1) | Directora Ambiental: Gladys Florez
        </div>
      </footer>

    </div>
  );
}