import React, { useState } from 'react';
import type { Reading, AppConfig, PeriodType } from '../types';
import { exportToHTML, printReport } from '../utils/exportReport';
import { filterByMonth, filterByWeek, getCurrentMonth, getCurrentWeek, getAvailableMonths, formatMonthDisplay } from '../utils/dateUtils';
import UnitCard from './UnitCard';
import '../styles/ReadingHistory.css';

interface ReadingHistoryProps {
  readings: Reading[];
  onDelete: (id: string) => void;
  numberOfUnits: number;
  config: AppConfig;
}

const ReadingHistory: React.FC<ReadingHistoryProps> = ({ readings, onDelete, numberOfUnits, config }) => {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [weekStart, setWeekStart] = useState<string>(getCurrentWeek().start);
  const [weekEnd, setWeekEnd] = useState<string>(getCurrentWeek().end);

  const availableMonths = getAvailableMonths(readings);

  const getFilteredReadings = (): Reading[] => {
    if (periodType === 'all') {
      return readings;
    } else if (periodType === 'month') {
      return filterByMonth(readings, selectedMonth);
    } else {
      return filterByWeek(readings, weekStart, weekEnd);
    }
  };

  const getPeriodLabel = (): string => {
    if (periodType === 'all') {
      return 'Todas as Leituras';
    } else if (periodType === 'month') {
      return formatMonthDisplay(selectedMonth);
    } else {
      const start = new Date(weekStart).toLocaleDateString('pt-BR');
      const end = new Date(weekEnd).toLocaleDateString('pt-BR');
      return `Semana ${start} - ${end}`;
    }
  };

  const filteredReadings = getFilteredReadings();

  const getUnitReadings = (unit: number): Reading[] => {
    return filteredReadings.filter(r => r.unit === unit);
  };

  const handlePrint = () => {
    printReport({
      readings: filteredReadings,
      config,
      periodLabel: getPeriodLabel()
    });
  };

  const handleExport = () => {
    exportToHTML({
      readings: filteredReadings,
      config,
      periodLabel: getPeriodLabel()
    });
  };

  return (
    <div className="reading-history">
      <div className="reading-history__header">
        <h2 className="reading-history__title">Histórico de Leituras</h2>
      </div>

      {/* Filtros */}
      <div className="reading-history__filters">
        <div className="reading-history__filter-group">
          <label className="reading-history__filter-label">Período:</label>
          <select 
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as PeriodType)}
            className="reading-history__filter-select"
          >
            <option value="month">Mensal</option>
            <option value="week">Semanal</option>
            <option value="all">Todas</option>
          </select>
        </div>

        {periodType === 'month' && (
          <div className="reading-history__filter-group">
            <label className="reading-history__filter-label">Mês:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="reading-history__filter-select"
            >
              {availableMonths.length === 0 ? (
                <option value={getCurrentMonth()}>{formatMonthDisplay(getCurrentMonth())}</option>
              ) : (
                availableMonths.map(month => (
                  <option key={month} value={month}>
                    {formatMonthDisplay(month)}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        {periodType === 'week' && (
          <>
            <div className="reading-history__filter-group">
              <label className="reading-history__filter-label">De:</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="reading-history__filter-input"
              />
            </div>
            <div className="reading-history__filter-group">
              <label className="reading-history__filter-label">Até:</label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="reading-history__filter-input"
              />
            </div>
          </>
        )}

        <div className="reading-history__buttons">
          <button 
            onClick={handlePrint} 
            className="reading-history__button reading-history__button--print"
          >
            🖨️ Imprimir
          </button>
          <button 
            onClick={handleExport} 
            className="reading-history__button reading-history__button--export"
          >
            📄 Exportar HTML
          </button>
        </div>
      </div>

      <div className="reading-history__info">
        <strong>Período:</strong> {getPeriodLabel()} | 
        <strong> Total de leituras:</strong> {filteredReadings.length}
      </div>

      {filteredReadings.length === 0 ? (
        <p className="reading-history__empty">Nenhuma leitura encontrada para o período selecionado.</p>
      ) : (
        <div className="reading-history__units">
          {Array.from({ length: numberOfUnits }, (_, i) => i + 1).map(unit => (
            <UnitCard
              key={unit}
              unit={unit}
              readings={getUnitReadings(unit)}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;