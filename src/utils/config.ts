import type { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../types';

const CONFIG_KEY = 'gas-app-config';

export const loadConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      // Validação básica
      if (config.numberOfUnits && config.numberOfUnits > 0 && config.numberOfUnits <= 200) {
        return config;
      }
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config: AppConfig): void => {
  try {
    // Validação antes de salvar
    if (config.numberOfUnits < 1) {
      throw new Error('Número de unidades deve ser maior que 0');
    }
    if (config.numberOfUnits > 200) {
      throw new Error('Número máximo de unidades é 200');
    }
    
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    throw error;
  }
};

export const generateUnitsList = (numberOfUnits: number): number[] => {
  return Array.from({ length: numberOfUnits }, (_, i) => i + 1);
};