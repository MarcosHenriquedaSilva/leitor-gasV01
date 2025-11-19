import React, { useState, useEffect } from 'react';
import type { Reading, TabType, AppConfig, User } from './types';
import { loadReadings, saveReadings } from './utils/storage';
import { loadConfig, saveConfig } from './utils/config';
import { getCurrentUser, logout as authLogout } from './utils/auth';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ReadingInput from './components/ReadingInput';
import ReadingHistory from './components/ReadingHistory';
import Configuration from './components/Configuration';
import Login from './components/Login';
import Toast from './components/Toast';
import './styles/global.css';
import './styles/App.css';

interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('input');
  const [config, setConfig] = useState<AppConfig>({ numberOfUnits: 6 });
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica autenticação ao carregar
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser);
    }
    setIsLoading(false);
  }, []);

  const loadUserData = (currentUser: User) => {
    // Carrega config com base no usuário
    const loadedConfig = loadConfig();
    const userConfig = {
      ...loadedConfig,
      numberOfUnits: Math.min(loadedConfig.numberOfUnits, currentUser.maxUnits),
      companyName: currentUser.companyName
    };
    setConfig(userConfig);
    
    // Carrega leituras do usuário (prefixado com user ID)
    const userStorageKey = `gas-readings-${currentUser.id}`;
    const stored = localStorage.getItem(userStorageKey);
    const data = stored ? JSON.parse(stored) : [];
    setReadings(data);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    loadUserData(loggedUser);
    showToast(`Bem-vindo, ${loggedUser.name}!`, 'success');
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      authLogout();
      setUser(null);
      setReadings([]);
      setActiveTab('input');
      showToast('Até logo!', 'info');
    }
  };

  const handleAddReading = (unit: number, value: number) => {
    if (!user) return;

    const now = new Date();
    const newReading: Reading = {
      id: `${Date.now()}`,
      unit,
      value,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR')
    };

    const updatedReadings = [newReading, ...readings];
    setReadings(updatedReadings);
    
    // Salva com prefixo do usuário
    const userStorageKey = `gas-readings-${user.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify(updatedReadings));
  };

  const handleDeleteReading = (id: string) => {
    if (!user) return;

    if (window.confirm('Deseja realmente excluir esta leitura?')) {
      const updatedReadings = readings.filter(r => r.id !== id);
      setReadings(updatedReadings);
      
      const userStorageKey = `gas-readings-${user.id}`;
      localStorage.setItem(userStorageKey, JSON.stringify(updatedReadings));
      showToast('Leitura excluída com sucesso!', 'success');
    }
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    if (!user) return;

    // Valida limite de unidades baseado no plano
    if (newConfig.numberOfUnits > user.maxUnits) {
      showToast(`Seu plano permite no máximo ${user.maxUnits} unidades`, 'error');
      return;
    }

    saveConfig(newConfig);
    setConfig(newConfig);
  };

  // Tela de loading
  if (isLoading) {
    return (
      <div className="app app--loading">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  // Tela de login
  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} onShowToast={showToast} />
        {toast && (
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // App autenticado
  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === 'input' && (
          <ReadingInput 
            readings={readings} 
            onAddReading={handleAddReading}
            numberOfUnits={config.numberOfUnits}
            onShowToast={showToast}
          />
        )}
        {activeTab === 'history' && (
          <ReadingHistory 
            readings={readings} 
            onDelete={handleDeleteReading}
            numberOfUnits={config.numberOfUnits}
            config={config}
          />
        )}
        {activeTab === 'config' && (
          <Configuration 
            config={config}
            onSave={handleSaveConfig}
            onShowToast={showToast}
          />
        )}
      </main>
      
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;