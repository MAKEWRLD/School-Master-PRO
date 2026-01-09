
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

export interface AcademicContent {
  capa: string;
  folhaRosto: string;
  introducao: string;
  desenvolvimento: string;
  conclusao: string;
  referencias: string;
}

export interface ContentVersion {
  id: string;
  timestamp: number;
  content: AcademicContent;
  label?: string;
  authorId: string;
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
  paymentId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  course: string;
  city: string;
  points: number;
  avatar?: string;
  token?: string;
}

export enum PaymentMethod {
  UNITEL_MONEY = 'Unitel Money',
  EXPRESS = 'Multicaixa Express',
  PAYPAY = 'PayPay',
  PAYPAL = 'PayPal'
}
