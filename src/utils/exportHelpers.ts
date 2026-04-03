import type { Transaction } from '../context/AppContext';

export function exportToCSV(transactions: Transaction[], filename = 'transactions'): void {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status', 'Payment Method', 'Note'];
  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.type,
    t.amount.toString(),
    t.status,
    t.paymentMethod,
    t.note || '',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportToJSON(transactions: Transaction[], filename = 'transactions'): void {
  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
