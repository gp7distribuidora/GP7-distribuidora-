import { Unit, Project, ProjectStatus } from './types';

export const UNITS: Unit[] = [
  { id: '1', name: 'Unidade Capanema', city: 'Capanema', state: 'PA' },
  { id: '2', name: 'Unidade Paragominas', city: 'Paragominas', state: 'PA' },
  { id: '3', name: 'Unidade Marabá', city: 'Marabá', state: 'PA' },
  { id: '4', name: 'Unidade Jequié', city: 'Jequié', state: 'BA' },
  { id: '5', name: 'Unidade Eunápolis', city: 'Eunápolis', state: 'BA' },
  { id: '6', name: 'Unidade Teixeira de Freitas', city: 'Teixeira de Freitas', state: 'BA' },
  { id: '7', name: 'Unidade Itapetinga', city: 'Itapetinga', state: 'BA' },
  { id: '8', name: 'Unidade Porto Seguro', city: 'Porto Seguro', state: 'BA' },
  { id: '9', name: 'Unidade Rio Branco', city: 'Rio Branco', state: 'AC' },
];

// Initial mock data
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    unitId: '1',
    title: 'Reforma do Telhado',
    description: 'Substituição completa das telhas de fibrocimento por termoacústicas devido a infiltrações.',
    requester: 'João Silva',
    department: 'Manutenção Predial',
    contractor: {
      name: 'ConstruNorte Ltda',
      legalName: 'ConstruNorte Engenharia e Construções LTDA',
      cnpj: '12.345.678/0001-90',
      manager: 'Roberto Almeida',
      contact: '(91) 98877-6655'
    },
    startDate: '2023-10-15',
    status: ProjectStatus.IN_PROGRESS,
    costs: {
      material: 45000,
      labor: 20000,
      equipment: 5000,
    },
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300&h=200',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=300&h=200',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=300&h=200'
    ],
    invoices: [
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    ]
  },
  {
    id: 'p2',
    unitId: '3',
    title: 'Ampliação do Galpão B',
    description: 'Construção de nova área de armazenagem com 500m².',
    requester: 'Maria Oliveira',
    department: 'Logística',
    contractor: {
      name: 'Marabá Engenharia',
      legalName: 'Marabá Soluções em Engenharia S.A.',
      cnpj: '98.765.432/0001-10',
      manager: 'Fernanda Costa',
      contact: 'contato@marabaeng.com.br'
    },
    startDate: '2023-11-01',
    status: ProjectStatus.PLANNED,
    costs: {
      material: 150000,
      labor: 80000,
      equipment: 30000,
    },
    images: [],
    invoices: []
  },
  {
    id: 'p3',
    unitId: '2',
    title: 'Pintura Externa',
    description: 'Pintura de toda a fachada e muros laterais.',
    requester: 'Carlos Santos',
    department: 'Administrativo',
    contractor: {
      name: 'Pinturas Express',
      legalName: 'Pinturas Express LTDA',
      cnpj: '11.222.333/0001-44',
      manager: 'Carlos Pintor',
      contact: '(91) 99999-8888'
    },
    startDate: '2023-09-10',
    status: ProjectStatus.COMPLETED,
    costs: {
      material: 12000,
      labor: 8000,
      equipment: 2000,
    },
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=300&h=200'],
    invoices: [],
    evaluation: {
      rating: 5,
      comment: 'Serviço excelente e rápido.',
      date: '2023-10-01'
    }
  }
];