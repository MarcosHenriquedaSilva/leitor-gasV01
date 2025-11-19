import type { Reading } from '../types';

// Converte data BR (DD/MM/YYYY) para objeto Date
export const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// Formata Date para string BR
export const formatDateBR = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Retorna YYYY-MM do mês atual
export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Retorna início e fim da semana atual
export const getCurrentWeek = (): { start: string; end: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Segunda-feira
  
  const monday = new Date(now.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

// Filtra leituras por mês (YYYY-MM)
export const filterByMonth = (readings: Reading[], month: string): Reading[] => {
  return readings.filter(reading => {
    const date = parseDate(reading.date);
    const readingMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return readingMonth === month;
  });
};

// Filtra leituras por semana
export const filterByWeek = (readings: Reading[], start: string, end: string): Reading[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  return readings.filter(reading => {
    const date = parseDate(reading.date);
    return date >= startDate && date <= endDate;
  });
};

// Obtém lista de meses únicos das leituras
export const getAvailableMonths = (readings: Reading[]): string[] => {
  const months = new Set<string>();
  
  readings.forEach(reading => {
    const date = parseDate(reading.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.add(monthKey);
  });
  
  return Array.from(months).sort().reverse(); // Mais recentes primeiro
};

// Formata mês para exibição (Janeiro/2024)
export const formatMonthDisplay = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${monthNames[parseInt(monthNum) - 1]}/${year}`;
};