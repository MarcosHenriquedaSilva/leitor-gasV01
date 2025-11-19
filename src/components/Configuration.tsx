import React, { useState } from 'react';
import type { AppConfig } from '../types';
import '../styles/Configuration.css';

interface ConfigurationProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ config, onSave, onShowToast }) => {
  const [numberOfUnits, setNumberOfUnits] = useState<string>(config.numberOfUnits.toString());
  const [companyName, setCompanyName] = useState<string>(config.companyName || '');
  const [responsibleName, setResponsibleName] = useState<string>(config.responsibleName || '');
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    const units = parseInt(numberOfUnits);

    // Validações
    if (isNaN(units) || units < 1) {
      setError('Número de unidades deve ser maior que 0');
      return;
    }

    if (units > 200) {
      setError('Número máximo de unidades é 200');
      return;
    }

    const newConfig: AppConfig = {
      numberOfUnits: units,
      companyName: companyName || 'Sistema de Leitura de Gás',
      responsibleName: responsibleName
    };

    try {
      onSave(newConfig);
      setError('');
      onShowToast('Configurações salvas com sucesso!', 'success');
    } catch {
      setError('Erro ao salvar configurações');
      onShowToast('Erro ao salvar configurações', 'error');
    }
  };

  return (
    <div className="configuration">
      <div className="configuration__container">
        <h2 className="configuration__title">⚙️ Configurações</h2>
        
        <div className="configuration__card">
          <div className="configuration__section">
            <h3 className="configuration__section-title">Configurações Gerais</h3>
            
            <div className="configuration__form-group">
              <label className="configuration__label">
                Nome da Empresa/Sistema
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="configuration__input"
                placeholder="Digite o nome da empresa"
              />
              <small className="configuration__help">
                Este nome aparecerá no cabeçalho e relatórios
              </small>
            </div>

            <div className="configuration__form-group">
              <label className="configuration__label">
                Nome do Responsável
              </label>
              <input
                type="text"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className="configuration__input"
                placeholder="Nome de quem gera os relatórios"
              />
              <small className="configuration__help">
                Nome que aparecerá como responsável nos relatórios
              </small>
            </div>

            <div className="configuration__form-group">
              <label className="configuration__label">
                Número de Unidades
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={numberOfUnits}
                onChange={(e) => setNumberOfUnits(e.target.value)}
                className="configuration__input"
                placeholder="Ex: 6"
              />
              <small className="configuration__help">
                Quantidade de unidades para gerenciar (máximo: 200)
              </small>
            </div>

            {error && (
              <div className="configuration__error">
                ⚠️ {error}
              </div>
            )}

            <button onClick={handleSave} className="configuration__save-button">
               Salvar Configurações
            </button>
          </div>

          <div className="configuration__section configuration__section--info">
            <h3 className="configuration__section-title">Informações Salvas</h3>
            <div className="configuration__info-box">
              <p><strong></strong> {config.companyName}</p>
              <p><strong>Unidades:</strong> {config.numberOfUnits}</p>
              <p><strong>Responsável:</strong> {config.responsibleName}</p>
              
            </div>

            <div className="configuration__warning">
              <strong>⚠️ Atenção:</strong>
              <p>Alterar o número de unidades não afeta os dados já registrados. Leituras antigas de unidades desativadas permanecerão no histórico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;