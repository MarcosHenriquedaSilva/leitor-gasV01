import React, { useState } from 'react';
import type { User } from '../types';
import '../styles/Login.css';

interface LoginProps {
  onLogin: (user: User) => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

type ViewMode = 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLogin, onShowToast }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));

      const { login } = await import('../utils/auth');
      const user = login(email, password);

      if (user) {
        onShowToast(`Bem-vindo, ${user.name}!`, 'success');
        onLogin(user);
      } else {
        onShowToast('Email ou senha incorretos', 'error');
      }
    } catch (error) {
      onShowToast('Erro ao fazer login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!name || !companyName) {
        onShowToast('Preencha todos os campos', 'error');
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const { register } = await import('../utils/auth');
      const user = register({
        email,
        password,
        name,
        companyName,
        plan: 'free',
        maxUnits: 3
      });

      if (user) {
        onShowToast('Conta criada com sucesso!', 'success');
        onLogin(user);
      } else {
        onShowToast('Email já cadastrado', 'error');
      }
    } catch (error) {
      onShowToast('Erro ao criar conta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__brand">
          <div className="login__logo">📊</div>
          <h1 className="login__title">Sistema de Leitura de Gás</h1>
          <p className="login__subtitle">Gerencie suas leituras de forma simples e eficiente</p>
        </div>

        <div className="login__card">
          <div className="login__tabs">
            <button
              className={`login__tab ${viewMode === 'login' ? 'login__tab--active' : ''}`}
              onClick={() => setViewMode('login')}
            >
              Entrar
            </button>
            <button
              className={`login__tab ${viewMode === 'register' ? 'login__tab--active' : ''}`}
              onClick={() => setViewMode('register')}
            >
              Criar Conta
            </button>
          </div>

          {viewMode === 'login' ? (
            <form onSubmit={handleLogin} className="login__form">
              <div className="login__form-group">
                <label className="login__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login__input"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="login__form-group">
                <label className="login__label">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login__input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="login__button"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <div className="login__demo">
                <p className="login__demo-title">Contas de demonstração:</p>
                <div className="login__demo-accounts">
                  <div className="login__demo-account">
                    <strong>Admin:</strong> admin@sistema.com / admin123
                  </div>
                  <div className="login__demo-account">
                    <strong>Demo:</strong> demo@sistema.com / demo123
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login__form">
              <div className="login__form-group">
                <label className="login__label">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login__input"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="login__form-group">
                <label className="login__label">Nome da Empresa</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="login__input"
                  placeholder="Nome da sua empresa"
                  required
                />
              </div>

              <div className="login__form-group">
                <label className="login__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login__input"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="login__form-group">
                <label className="login__label">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login__input"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="login__button"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
              </button>

              <p className="login__info">
                🎉 Plano gratuito inclui 3 unidades
              </p>
            </form>
          )}
        </div>

        <div className="login__footer">
          <p>Sistema desenvolvido para gestão eficiente de leituras de gás</p>
        </div>
      </div>
    </div>
  );
};

export default Login;