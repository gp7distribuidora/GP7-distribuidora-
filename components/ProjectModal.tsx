import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, Unit } from '../types';
import { X, ImagePlus, Briefcase, FileText, User, Users } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'aiAnalysis'>) => void;
  unit: Unit;
  projectToEdit?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, unit, projectToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requester: '',
    department: '',
    // Contractor Data
    contractorName: '',
    contractorLegalName: '',
    contractorCnpj: '',
    contractorManager: '',
    contractorContact: '',
    
    status: ProjectStatus.PLANNED,
    material: 0,
    labor: 0,
    equipment: 0,
    startDate: new Date().toISOString().split('T')[0],
    imagesText: '',
    invoicesText: ''
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        description: projectToEdit.description,
        requester: projectToEdit.requester,
        department: projectToEdit.department,
        contractorName: projectToEdit.contractor.name,
        contractorLegalName: projectToEdit.contractor.legalName,
        contractorCnpj: projectToEdit.contractor.cnpj,
        contractorManager: projectToEdit.contractor.manager,
        contractorContact: projectToEdit.contractor.contact,
        status: projectToEdit.status,
        material: projectToEdit.costs.material,
        labor: projectToEdit.costs.labor,
        equipment: projectToEdit.costs.equipment,
        startDate: projectToEdit.startDate,
        imagesText: projectToEdit.images.join('\n'),
        invoicesText: projectToEdit.invoices ? projectToEdit.invoices.join('\n') : ''
      });
    } else {
      // Reset for new entry
      setFormData({
        title: '',
        description: '',
        requester: '',
        department: '',
        contractorName: '',
        contractorLegalName: '',
        contractorCnpj: '',
        contractorManager: '',
        contractorContact: '',
        status: ProjectStatus.PLANNED,
        material: 0,
        labor: 0,
        equipment: 0,
        startDate: new Date().toISOString().split('T')[0],
        imagesText: '',
        invoicesText: ''
      });
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse images/pdfs from text area (one per line)
    const images = formData.imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const invoices = formData.invoicesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    onSave({
      unitId: unit.id,
      title: formData.title,
      description: formData.description,
      requester: formData.requester,
      department: formData.department,
      contractor: {
        name: formData.contractorName,
        legalName: formData.contractorLegalName,
        cnpj: formData.contractorCnpj,
        manager: formData.contractorManager,
        contact: formData.contractorContact,
      },
      status: formData.status,
      startDate: formData.startDate,
      costs: {
        material: Number(formData.material),
        labor: Number(formData.labor),
        equipment: Number(formData.equipment)
      },
      images: images,
      invoices: invoices
    });

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {projectToEdit ? 'Editar Obra' : 'Nova Obra'} - {unit.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Project Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Dados da Obra</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Obra</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: Reforma do Refeitório"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <User size={14}/> Solicitante GP7
                   </label>
                   <input
                      required
                      name="requester"
                      value={formData.requester}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Nome do solicitante"
                    />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <Users size={14}/> Setor
                   </label>
                   <input
                      required
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ex: Logística"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Descreva o escopo da obra..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Atual</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    {Object.values(ProjectStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                   <ImagePlus size={16} /> Fotos (URLs)
                </label>
                <textarea
                  name="imagesText"
                  value={formData.imagesText}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs font-mono"
                  placeholder="Cole as URLs das imagens aqui (uma por linha)"
                />
                <p className="text-xs text-gray-500 mt-1">Insira links diretos para imagens (jpg, png).</p>
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                   <FileText size={16} /> Notas Fiscais (URLs PDF)
                </label>
                <textarea
                  name="invoicesText"
                  value={formData.invoicesText}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs font-mono"
                  placeholder="Cole as URLs dos PDFs aqui (uma por linha)"
                />
              </div>
            </div>

            {/* Right Column: Contractor & Costs */}
            <div className="space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                   <Briefcase size={18} /> Empresa Contratada
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia</label>
                  <input
                    required
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                    placeholder="Nome da Construtora"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">CNPJ</label>
                    <input
                      name="contractorCnpj"
                      value={formData.contractorCnpj}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Razão Social</label>
                    <input
                      name="contractorLegalName"
                      value={formData.contractorLegalName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      placeholder="Razão Social Ltda"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Responsável</label>
                    <input
                      name="contractorManager"
                      value={formData.contractorManager}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      placeholder="Eng. Responsável"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Contatos</label>
                    <input
                      name="contractorContact"
                      value={formData.contractorContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      placeholder="Tel / Email"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Orçamento Estimado (R$)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Materiais</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mão-de-Obra</label>
                    <input
                       type="number"
                       min="0"
                       step="0.01"
                      name="labor"
                      value={formData.labor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Equipamentos</label>
                    <input
                       type="number"
                       min="0"
                       step="0.01"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-md shadow-blue-200 transition-all transform hover:scale-105"
            >
              {projectToEdit ? 'Salvar Alterações' : 'Salvar Obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;