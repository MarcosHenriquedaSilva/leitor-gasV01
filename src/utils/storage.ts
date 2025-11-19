import type { Reading } from '../types';

const STORAGE_KEY = 'gas-readings';

export const loadReadings = (): Reading[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return [];
  }
};

export const saveReadings = (readings: Reading[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};