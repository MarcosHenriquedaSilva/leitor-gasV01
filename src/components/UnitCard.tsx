import React from 'react';
import type { Reading } from '../types';
import '../styles/UnitCard.css';

interface UnitCardProps {
  unit: number;
  readings: Reading[];
  onDelete: (id: string) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, readings, onDelete }) => {
  if (readings.length === 0) return null;

  return (
    <div className="unit-card">
      <h3 className="unit-card__title">Unidade {unit}</h3>
      <div className="unit-card__table-container">
        <table className="unit-card__table">
          <thead>
            <tr>
              <th className="unit-card__th">Data</th>
              <th className="unit-card__th">Hora</th>
              <th className="unit-card__th">Leitura</th>
              <th className="unit-card__th">Ações</th>
            </tr>
          </thead>
          <tbody>
            {readings.map(reading => (
              <tr key={reading.id} className="unit-card__tr">
                <td className="unit-card__td">{reading.date}</td>
                <td className="unit-card__td">{reading.time}</td>
                <td className="unit-card__td">{reading.value.toFixed(2)} m³</td>
                <td className="unit-card__td">
                  <button
                    onClick={() => onDelete(reading.id)}
                    className="unit-card__delete-button"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitCard;