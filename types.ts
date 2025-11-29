export enum ProjectStatus {
  PLANNED = 'Planejado',
  IN_PROGRESS = 'Em Andamento',
  ON_HOLD = 'Pausado',
  COMPLETED = 'Concluído',
}

export interface Costs {
  material: number;
  labor: number; // Mão-de-obra
  equipment: number;
}

export interface Contractor {
  name: string; // Nome fantasia
  legalName: string; // Razão Social
  cnpj: string;
  manager: string; // Responsável
  contact: string; // Telefone/Email
}

export interface Evaluation {
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Project {
  id: string;
  unitId: string;
  title: string;
  description: string;
  
  // New Fields
  requester: string; // Solicitante
  department: string; // Setor
  
  contractor: Contractor;
  startDate: string;
  status: ProjectStatus;
  costs: Costs;
  images: string[]; // URLs of photos
  invoices: string[]; // URLs of PDFs
  evaluation?: Evaluation;
}

export interface Unit {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number }; // Optional for map visualization if needed later
}