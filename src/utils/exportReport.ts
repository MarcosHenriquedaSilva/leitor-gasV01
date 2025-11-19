import type { Reading, AppConfig } from '../types';
import { formatMonthDisplay } from './dateUtils';

interface ReportOptions {
  readings: Reading[];
  config: AppConfig;
  periodLabel: string;
}

const generateHTML = (options: ReportOptions): string => {
  const { readings, config, periodLabel } = options;
  
  // Agrupa leituras por unidade e pega a mais recente de cada
  const latestReadingsByUnit = new Map<number, Reading>();
  
  readings.forEach(reading => {
    const existing = latestReadingsByUnit.get(reading.unit);
    if (!existing) {
      latestReadingsByUnit.set(reading.unit, reading);
    } else {
      // Compara datas para manter a mais recente
      const existingDate = new Date(existing.date.split('/').reverse().join('-') + 'T' + existing.time);
      const currentDate = new Date(reading.date.split('/').reverse().join('-') + 'T' + reading.time);
      
      if (currentDate > existingDate) {
        latestReadingsByUnit.set(reading.unit, reading);
      }
    }
  });

  // Ordena unidades
  const sortedUnits = Array.from(latestReadingsByUnit.keys()).sort((a, b) => a - b);
  
  let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Leituras de Gás - ${periodLabel}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 3px solid #2980b9;
        }
        
        .company-name {
            font-size: 24px;
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .report-title {
            font-size: 20px;
            color: #2980b9;
            margin-bottom: 8px;
        }
        
        .period {
            font-size: 16px;
            color: #7f8c8d;
            font-weight: 500;
        }
        
        .meta-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 35px;
        }
        
        .meta-item {
            text-align: center;
        }
        
        .meta-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .meta-value {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .readings-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .readings-table thead {
            background: #2980b9;
            color: white;
        }
        
        .readings-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .readings-table tbody tr {
            border-bottom: 1px solid #ecf0f1;
            transition: background 0.2s;
        }
        
        .readings-table tbody tr:hover {
            background: #f8f9fa;
        }
        
        .readings-table tbody tr:last-child {
            border-bottom: 2px solid #2980b9;
        }
        
        .readings-table td {
            padding: 15px;
            font-size: 14px;
            color: #2c3e50;
        }
        
        .unit-cell {
            font-weight: bold;
            color: #2980b9;
            font-size: 16px;
        }
        
        .reading-cell {
            font-weight: bold;
            font-size: 18px;
            color: #27ae60;
        }
        
        .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #7f8c8d;
            font-size: 16px;
            font-style: italic;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
        }
        
        .footer-text {
            color: #7f8c8d;
            font-size: 12px;
            line-height: 1.6;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 20px;
            }
            
            .readings-table tbody tr:hover {
                background: transparent;
            }
        }
        
        @media (max-width: 768px) {
            .meta-section {
                flex-direction: column;
                gap: 15px;
            }
            
            .container {
                padding: 20px;
            }
            
            .readings-table {
                font-size: 12px;
            }
            
            .readings-table th,
            .readings-table td {
                padding: 10px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-name">${config.companyName || 'Sistema de Leitura de Gás'}</div>
            <div class="report-title">Relatório de Leituras de Gás</div>
            <div class="period">${periodLabel}</div>
        </div>
        
        <div class="meta-section">
            <div class="meta-item">
                <div class="meta-label">Data do Relatório</div>
                <div class="meta-value">${new Date().toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Hora do Relatório</div>
                <div class="meta-value">${new Date().toLocaleTimeString('pt-BR')}</div>
            </div>
            ${config.responsibleName ? `
            <div class="meta-item">
                <div class="meta-label">Responsável</div>
                <div class="meta-value">${config.responsibleName}</div>
            </div>
            ` : ''}
        </div>
`;

  if (sortedUnits.length === 0) {
    html += '<div class="no-data">Nenhuma leitura encontrada para o período selecionado.</div>';
  } else {
    html += `
        <table class="readings-table">
            <thead>
                <tr>
                    <th>Unidade</th>
                    <th>Data da Leitura</th>
                    <th>Hora da Leitura</th>
                    <th>Leitura (m³)</th>
                </tr>
            </thead>
            <tbody>
`;

    sortedUnits.forEach(unit => {
      const reading = latestReadingsByUnit.get(unit)!;
      html += `
                <tr>
                    <td class="unit-cell">Unidade ${unit}</td>
                    <td>${reading.date}</td>
                    <td>${reading.time}</td>
                    <td class="reading-cell">${reading.value.toFixed(2)} m³</td>
                </tr>
`;
    });

    html += `
            </tbody>
        </table>
`;
  }

  html += `
        <div class="footer">
            <div class="footer-text">
                Relatório gerado automaticamente pelo ${config.companyName || 'Sistema de Leitura de Gás'}<br>
                Total de unidades no relatório: ${sortedUnits.length}
            </div>
        </div>
    </div>
</body>
</html>
`;

  return html;
};

export const exportToHTML = (options: ReportOptions): void => {
  const html = generateHTML(options);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `relatorio-gas-${options.periodLabel.replace(/\//g, '-').replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.html`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printReport = (options: ReportOptions): void => {
  const html = generateHTML(options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};