import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getWeekdayHeatmapData } from '../../utils/insightCalculators';
import { formatCurrency } from '../../utils/formatCurrency';

export default function WeekdayHeatmap() {
  const { state } = useApp();
  const data = useMemo(() => getWeekdayHeatmapData(state.transactions), [state.transactions]);
  
  const maxSpend = Math.max(...data.map(d => d.avgSpend), 1);

  function getIntensity(spend: number): string {
    if (spend === 0) return 'bg-surface-100 dark:bg-surface-800';
    const ratio = spend / maxSpend;
    if (ratio < 0.25) return 'bg-primary-100 dark:bg-primary-900/30';
    if (ratio < 0.5) return 'bg-primary-200 dark:bg-primary-800/50';
    if (ratio < 0.75) return 'bg-primary-400 dark:bg-primary-600/60';
    return 'bg-primary-600 dark:bg-primary-500';
  }

  function getTextColor(spend: number): string {
    if (spend === 0) return 'text-surface-400 dark:text-surface-500';
    const ratio = spend / maxSpend;
    if (ratio < 0.5) return 'text-surface-700 dark:text-surface-200';
    return 'text-white';
  }

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Spending by Day of Week</h3>
      <div className="grid grid-cols-7 gap-2">
        {data.map(d => (
          <div
            key={d.day}
            className={`${getIntensity(d.avgSpend)} rounded-xl p-3 text-center transition-colors cursor-default group relative`}
          >
            <p className={`text-xs font-medium ${getTextColor(d.avgSpend)} mb-1`}>{d.day}</p>
            <p className={`text-sm font-bold ${getTextColor(d.avgSpend)}`}>
              {d.avgSpend > 0 ? formatCurrency(d.avgSpend) : '—'}
            </p>
            <p className={`text-[10px] font-medium mt-0.5 ${getTextColor(d.avgSpend)} opacity-70`}>
              avg/txn
            </p>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Total: {formatCurrency(d.totalSpend)} · {d.count} transactions
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-surface-900 dark:border-t-surface-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-surface-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-surface-100 dark:bg-surface-800" />
          <div className="w-4 h-4 rounded bg-primary-100 dark:bg-primary-900/30" />
          <div className="w-4 h-4 rounded bg-primary-200 dark:bg-primary-800/50" />
          <div className="w-4 h-4 rounded bg-primary-400 dark:bg-primary-600/60" />
          <div className="w-4 h-4 rounded bg-primary-600 dark:bg-primary-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
