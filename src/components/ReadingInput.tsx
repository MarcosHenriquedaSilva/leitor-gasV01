import React, { useState } from 'react';
import type { Reading } from '../types';
import '../styles/ReadingInput.css';

interface ReadingInputProps {
  readings: Reading[];
  onAddReading: (unit: number, value: number) => void;
  numberOfUnits: number;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

const ReadingInput: React.FC<ReadingInputProps> = ({ readings, onAddReading, numberOfUnits, onShowToast }) => {
  const [values, setValues] = useState<Record<number, string>>({});

  // Atualiza valores quando numberOfUnits mudar
  React.useEffect(() => {
    console.log('ReadingInput - numberOfUnits mudou para:', numberOfUnits);
    setValues(prevValues => {
      const initialValues: Record<number, string> = {};
      for (let i = 1; i <= numberOfUnits; i++) {
        initialValues[i] = prevValues[i] || '';
      }
      return initialValues;
    });
  }, [numberOfUnits]);

  const handleSubmit = (unit: number) => {
    const value = values[unit];
    
    if (!value || parseFloat(value) < 0) {
      onShowToast('Por favor, insira um valor válido', 'error');
      return;
    }

    onAddReading(unit, parseFloat(value));
    setValues(prev => ({ ...prev, [unit]: '' }));
    onShowToast(`Leitura da Unidade ${unit} registrada com sucesso!`, 'success');
  };

  const handleChange = (unit: number, value: string) => {
    setValues(prev => ({ ...prev, [unit]: value }));
  };

  const getLastReading = (unit: number): Reading | undefined => {
    return readings.find(r => r.unit === unit);
  };

  return (
    <div className="reading-input">
      <h2 className="reading-input__main-title">Registrar Leituras</h2>
      
      <div className="reading-input__grid">
        {Array.from({ length: numberOfUnits }, (_, i) => i + 1).map(unit => {
          const lastReading = getLastReading(unit);
          
          return (
            <div key={unit} className="reading-input__unit-card">
              <div className="reading-input__unit-header">
                <h3 className="reading-input__unit-title">Unidade {unit}</h3>
                {lastReading && (
                  <span className="reading-input__last-value">
                    Última: {lastReading.value.toFixed(2)} m³
                  </span>
                )}
              </div>

              <div className="reading-input__form">
                <label className="reading-input__label">
                  Leitura (m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={values[unit]}
                  onChange={(e) => handleChange(unit, e.target.value)}
                  className="reading-input__input"
                  placeholder="Digite a leitura"
                />
                
                <button 
                  onClick={() => handleSubmit(unit)} 
                  className="reading-input__submit"
                >
                  Registrar
                </button>

                {lastReading && (
                  <div className="reading-input__last-reading">
                    <small>
                      {lastReading.date} às {lastReading.time}
                    </small>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingInput;