import React, { useState } from 'react';
import { Project, ProjectStatus, Evaluation } from '../types';
import { Building2, HardHat, DollarSign, FileText, Image as ImageIcon, Star, Trash2, Pencil, ChevronLeft, ChevronRight, X, FileCheck, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
  onUpdateProject: (project: Project) => void;
  onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onUpdateProject, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'contractor' | 'costs' | 'photos' | 'evaluation' | 'invoices'>('desc');
  const [evaluationForm, setEvaluationForm] = useState<Partial<Evaluation>>({
    rating: project.evaluation?.rating || 0,
    comment: project.evaluation?.comment || ''
  });

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const totalCost = project.costs.material + project.costs.labor + project.costs.equipment;

  const costData = [
    { name: 'Material', value: project.costs.material },
    { name: 'Mão-de-Obra', value: project.costs.labor },
    { name: 'Equipamentos', value: project.costs.equipment },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ProjectStatus.PLANNED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case ProjectStatus.ON_HOLD: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveEvaluation = () => {
    if (evaluationForm.rating && evaluationForm.comment) {
      const updatedProject: Project = {
        ...project,
        evaluation: {
          rating: evaluationForm.rating,
          comment: evaluationForm.comment,
          date: new Date().toISOString()
        }
      };
      onUpdateProject(updatedProject);
      alert("Avaliação salva com sucesso!");
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.images.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.images.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 relative group">
          <div className="absolute top-4 right-4 flex gap-2">
              <button 
                  onClick={() => onEdit(project)} 
                  className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                  title="Editar Obra"
              >
                  <Pencil size={18} />
              </button>
              <button 
                  onClick={() => onDelete(project.id)} 
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Excluir Obra"
              >
                  <Trash2 size={18} />
              </button>
          </div>
          <div className="flex justify-between items-start mb-2 pr-16">
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={project.title}>{project.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className="text-xs text-gray-500">Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 space-y-1">
             <div className="flex items-center gap-1">
                <User size={12} className="text-slate-400" />
                <span className="font-semibold">Solicitante:</span> {project.requester || 'Não informado'}
             </div>
             <div className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                 <span className="font-semibold">Setor:</span> {project.department || 'Não informado'}
             </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('desc')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'desc' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <FileText size={16} /> Descrição
          </button>
          <button onClick={() => setActiveTab('contractor')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'contractor' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <HardHat size={16} /> Empresa
          </button>
          <button onClick={() => setActiveTab('costs')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'costs' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <DollarSign size={16} /> Custos
          </button>
          <button onClick={() => setActiveTab('photos')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'photos' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <ImageIcon size={16} /> Fotos
          </button>
           <button onClick={() => setActiveTab('invoices')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'invoices' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <FileCheck size={16} /> NF
          </button>
          <button onClick={() => setActiveTab('evaluation')} className={`flex-1 min-w-[70px] py-3 text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 ${activeTab === 'evaluation' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Star size={16} /> Avaliação
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 bg-white">
          {activeTab === 'desc' && (
            <div className="animate-fadeIn space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
            </div>
          )}

          {activeTab === 'contractor' && (
            <div className="animate-fadeIn space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Empresa Contratada</p>
                  <h4 className="text-lg font-semibold text-slate-800">{project.contractor.name}</h4>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm border border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500 col-span-1">Razão Social:</span>
                  <span className="text-slate-700 col-span-2 font-medium break-words">{project.contractor.legalName || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500 col-span-1">CNPJ:</span>
                  <span className="text-slate-700 col-span-2 font-medium">{project.contractor.cnpj || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500 col-span-1">Responsável:</span>
                  <span className="text-slate-700 col-span-2 font-medium">{project.contractor.manager || '-'}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500 col-span-1">Contato:</span>
                  <span className="text-slate-700 col-span-2 font-medium">{project.contractor.contact || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="animate-fadeIn">
              <div className="h-32 w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-1">
                {costData.map((item, idx) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                      {item.name}
                    </span>
                    <span className="font-medium text-slate-700">R$ {item.value.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 font-bold mt-2">
                    <span className="text-slate-900">Total</span>
                    <span className="text-blue-600">R$ {totalCost.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="animate-fadeIn">
               {project.images && project.images.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2">
                    {project.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => openLightbox(idx)}
                        className="aspect-square overflow-hidden rounded-lg border border-gray-200 hover:opacity-90 transition-opacity relative group cursor-pointer"
                      >
                        <img src={img} alt={`Obra ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center"></div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                   <ImageIcon size={32} className="mb-2 opacity-50" />
                   <span className="text-xs">Sem fotos anexadas</span>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="animate-fadeIn">
              {project.invoices && project.invoices.length > 0 ? (
                 <div className="space-y-2">
                    {project.invoices.map((inv, idx) => (
                      <a 
                        key={idx} 
                        href={inv} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-colors group"
                      >
                        <div className="bg-red-100 text-red-500 p-2 rounded">
                           <FileText size={18} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Nota Fiscal #{idx + 1}</p>
                           <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                        <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Visualizar
                        </div>
                      </a>
                    ))}
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                   <FileCheck size={32} className="mb-2 opacity-50" />
                   <span className="text-xs">Nenhuma nota fiscal anexada</span>
                 </div>
              )}
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="animate-fadeIn h-full flex flex-col">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Avaliação da Empresa</h4>
              
              <div className="flex justify-center mb-4 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEvaluationForm(prev => ({ ...prev, rating: star }))}
                    className={`transition-all hover:scale-110 ${
                      (evaluationForm.rating || 0) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star size={24} fill={(evaluationForm.rating || 0) >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-gray-50 mb-3 flex-1"
                placeholder="Descreva sua experiência com esta empresa para futuras referências..."
                rows={4}
                value={evaluationForm.comment}
                onChange={(e) => setEvaluationForm(prev => ({ ...prev, comment: e.target.value }))}
              ></textarea>

              <button 
                onClick={handleSaveEvaluation}
                className="w-full py-2 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 transition-colors"
              >
                Salvar Avaliação
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center backdrop-blur-sm" onClick={() => setLightboxOpen(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110]"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          
          <button 
            className="absolute left-4 text-white hover:text-gray-300 z-[110] p-2 bg-black/50 rounded-full"
            onClick={prevPhoto}
          >
            <ChevronLeft size={32} />
          </button>

          <div className="max-w-4xl max-h-screen p-4 flex items-center justify-center">
             <img 
               src={project.images[currentPhotoIndex]} 
               alt="Full view" 
               className="max-h-[85vh] max-w-full rounded-md shadow-2xl"
               onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
             />
          </div>

          <button 
            className="absolute right-4 text-white hover:text-gray-300 z-[110] p-2 bg-black/50 rounded-full"
            onClick={nextPhoto}
          >
            <ChevronRight size={32} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
             {currentPhotoIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;