import React, { useState, useMemo } from 'react';
import { UNITS, INITIAL_PROJECTS } from './constants';
import { Project, Unit, ProjectStatus } from './types';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import { 
  LayoutGrid, 
  MapPin, 
  Plus, 
  Search, 
  TrendingUp, 
  Briefcase,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell 
} from 'recharts';

const App: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Computed Stats
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const totalInvested = projects.reduce((acc, curr) => 
      acc + curr.costs.material + curr.costs.labor + curr.costs.equipment, 0
    );
    
    // 1. Cost by Unit (All Units)
    const costByUnit = UNITS.map(unit => {
      const unitCost = projects
        .filter(p => p.unitId === unit.id)
        .reduce((acc, curr) => acc + curr.costs.material + curr.costs.labor + curr.costs.equipment, 0);
      return {
        name: unit.city,
        shortName: unit.state,
        value: unitCost
      };
    }).sort((a, b) => b.value - a.value);

    // 2. Timeline Data (Monthly Costs)
    const timelineMap = new Map<string, number>();
    
    projects.forEach(project => {
      const date = new Date(project.startDate);
      // Key format: YYYY-MM for sorting
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const cost = project.costs.material + project.costs.labor + project.costs.equipment;
      
      timelineMap.set(key, (timelineMap.get(key) || 0) + cost);
    });

    const monthlyCosts = Array.from(timelineMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1);
        return {
          name: dateObj.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          fullDate: key,
          value: value
        };
      });

    return { totalProjects, activeProjects, completedProjects, totalInvested, costByUnit, monthlyCosts };
  }, [projects]);

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'aiAnalysis'>) => {
    if (editingProject) {
      // Update existing
      const updatedProject: Project = {
        ...projectData,
        id: editingProject.id,
        aiAnalysis: editingProject.aiAnalysis,
        evaluation: editingProject.evaluation
      };
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
    } else {
      // Create new
      const newProject: Project = {
        ...projectData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setProjects(prev => [...prev, newProject]);
    }
    setIsModalOpen(false);
  };

  const handleUpdateAnalysis = (projectId: string, analysis: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, aiAnalysis: analysis } : p));
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.")) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Filter projects for display
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (selectedUnit) {
      filtered = filtered.filter(p => p.unitId === selectedUnit.id);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.contractor.name.toLowerCase().includes(lower) ||
        p.requester.toLowerCase().includes(lower) ||
        p.department.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [projects, selectedUnit, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">GP7 <span className="text-white font-light">Distribuidora</span></h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Obras</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Painel Geral</div>
          <button
            onClick={() => setSelectedUnit(null)}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-all ${!selectedUnit ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border-r-4 border-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutGrid size={18} />
            Visão Geral
          </button>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unidades</div>
          <div className="space-y-1">
            {UNITS.map(unit => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className={`w-full text-left px-6 py-2 flex items-center gap-3 transition-colors text-sm ${selectedUnit?.id === unit.id ? 'bg-slate-800 text-white border-r-4 border-blue-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <MapPin size={14} />
                {unit.city}/{unit.state}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
           <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">GP7 Distribuidora</p>
              <p>Sistema v1.2.0</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        
        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{selectedUnit ? selectedUnit.name : 'Visão Geral da Rede'}</h2>
            <p className="text-slate-500 mt-1">
              {selectedUnit 
                ? `Gerenciando obras em ${selectedUnit.city} - ${selectedUnit.state}` 
                : 'Monitoramento consolidado das 9 unidades'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar obras, empresas..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
             </div>
             {selectedUnit && (
               <button 
                onClick={handleOpenNewModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md shadow-blue-200 transition-transform active:scale-95 whitespace-nowrap"
               >
                 <Plus size={18} />
                 Nova Obra
               </button>
             )}
          </div>
        </header>

        {/* Dashboard Widgets (Overview Mode) */}
        {!selectedUnit && (
          <div className="space-y-6 mb-8 animate-fadeIn">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Investimento Total</p>
                  <p className="text-2xl font-bold text-slate-800">R$ {stats.totalInvested.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Em Andamento</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.activeProjects}</p>
                </div>
              </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Obras Concluídas</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.completedProjects}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total de Projetos</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalProjects}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Investment per Unit */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  Investimento por Unidade
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.costByUnit} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} 
                        width={140} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc', radius: 4}}
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Total']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                        {stats.costByUnit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? '#3b82f6' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Timeline */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                   <TrendingUp size={18} className="text-green-500" />
                   Custo Total Mensal
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyCosts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        axisLine={false} 
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis hide />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Tooltip 
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Investimento']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#059669' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            {selectedUnit ? 'Projetos da Unidade' : 'Todos os Projetos Recentes'}
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">{filteredProjects.length}</span>
          </h3>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onUpdateAnalysis={handleUpdateAnalysis} 
                  onDelete={handleDeleteProject}
                  onUpdateProject={handleUpdateProject}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                 <Briefcase size={32} />
               </div>
               <h3 className="text-lg font-medium text-slate-700">Nenhum projeto encontrado</h3>
               <p className="text-gray-500 max-w-sm mx-auto mt-2">
                 {selectedUnit 
                   ? 'Esta unidade ainda não possui obras cadastradas ou os filtros não correspondem.' 
                   : 'Selecione uma unidade para começar a adicionar obras.'}
               </p>
               {selectedUnit && (
                 <button 
                  onClick={handleOpenNewModal}
                  className="mt-6 text-blue-600 font-medium hover:text-blue-800 hover:underline"
                 >
                   Cadastrar primeira obra
                 </button>
               )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {(selectedUnit || editingProject) && (
        <ProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProject} 
          unit={selectedUnit || UNITS.find(u => u.id === editingProject?.unitId)!}
          projectToEdit={editingProject}
        />
      )}
    </div>
  );
};

export default App;