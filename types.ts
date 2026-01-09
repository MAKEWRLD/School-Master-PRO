
export enum WorkType {
  SIMPLE = 'Trabalho Escolar Simples',
  TECHNICAL = 'Trabalho Técnico',
  SCIENTIFIC = 'Artigo Científico',
  MONOGRAPH = 'Monografia',
  TCC = 'TCC',
  DISSERTATION = 'Dissertação',
  THESIS = 'Tese'
}

export const WorkPricing: Record<WorkType, number> = {
  [WorkType.SIMPLE]: 2000,
  [WorkType.TECHNICAL]: 4000,
  [WorkType.SCIENTIFIC]: 7000,
  [WorkType.MONOGRAPH]: 12000,
  [WorkType.TCC]: 15000,
  [WorkType.DISSERTATION]: 25000,
  [WorkType.THESIS]: 40000
};

export enum WorkStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  READY = 'ready'
}

export type AcademicNorm = 'ABNT' | 'APA' | 'CHICAGO' | 'VANCOUVER';

export interface AcademicSection {
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

export interface AcademicContent {
  capa: {
    instituicao: string;
    autor: string;
    titulo: string;
    cidade: string;
    ano: string;
  };
  folhaRosto: string;
  resumo: string;
  abstract: string;
  sumario: { title: string; page: number }[];
  introducao: string;
  desenvolvimento: AcademicSection[];
  conclusao: string;
  referencias: string;
}

export interface ContentVersion {
  id: string;
  timestamp: number;
  content: AcademicContent;
  label?: string;
  // Added authorId to track who created this version
  authorId?: string;
}

export interface AcademicWork {
  id: string;
  userId: string;
  title: string;
  type: WorkType;
  institution: string;
  course: string;
  author: string;
  city: string;
  year: string;
  norm: AcademicNorm;
  tone: string;
  content: AcademicContent;
  status: WorkStatus;
  price: number;
  createdAt: number;
  updatedAt: number;
  versions: ContentVersion[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  course: string;
  city: string;
  points: number;
  isVerified: boolean;
  token?: string;
}