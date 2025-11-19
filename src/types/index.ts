export interface Reading {
  id: string;
  unit: number;
  value: number;
  date: string;
  time: string;
}

export type TabType = 'input' | 'history' | 'config';

export interface AppConfig {
  numberOfUnits: number;
  companyName?: string;
  responsibleName?: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  numberOfUnits: 6,
  companyName: 'Sistema de Leitura de Gás',
  responsibleName: ''
};

export type PeriodType = 'month' | 'week' | 'all';

export interface ReportFilter {
  period: PeriodType;
  month?: string;  // YYYY-MM
  weekStart?: string;  // YYYY-MM-DD
  weekEnd?: string;    // YYYY-MM-DD
}

export interface User {
  id: string;
  name: string;
  email?: string;
}
