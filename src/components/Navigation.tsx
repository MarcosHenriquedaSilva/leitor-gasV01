import React from 'react';
import type { TabType } from '../types';
import '../styles/Navigation.css';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`navigation__button ${activeTab === 'input' ? 'navigation__button--active' : ''}`}
        onClick={() => onTabChange('input')}
      >
        Nova Leitura
      </button>
      <button
        className={`navigation__button ${activeTab === 'history' ? 'navigation__button--active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        Histórico
      </button>
      <button
        className={`navigation__button ${activeTab === 'config' ? 'navigation__button--active' : ''}`}
        onClick={() => onTabChange('config')}
      >
        ⚙️ Configurações
      </button>
    </nav>
  );
};

export default Navigation;