import React from 'react';
import type { User } from '../types';
import '../styles/Header.css';

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <h1 className="header__title">Sistema de Leitura de Gás</h1>
      {user && (
        <div className="header__user">
          <div className="header__user-info">
            <span className="header__user-name">{user.name}</span>
            <span className="header__user-company">{user.companyName}</span>
            <span className="header__user-plan">Plano: {user.plan.toUpperCase()}</span>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="header__logout">
              Sair
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;