
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
  norm: 'ABNT';
  tone: string;
  content: {
    capa: string;
    folhaRosto: string;
    introducao: string;
    desenvolvimento: string;
    conclusao: string;
    referencias: string;
  };
  status: WorkStatus;
  price: number;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  course: string;
  city: string;
  points: number;
}

export enum PaymentMethod {
  UNITEL_MONEY = 'Unitel Money',
  EXPRESS = 'Multicaixa Express',
  PAYPAY = 'PayPay'
}
