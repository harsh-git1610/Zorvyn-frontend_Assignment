import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getWeekdayHeatmapData } from '../../utils/insightCalculators';


export default function WeekdayHeatmap() {
  const { state } = useApp();
  const data = useMemo(() => getWeekdayHeatmapData(state.transactions), [state.transactions]);
  

  const topDayData = [...data].sort((a,b) => b.avgSpend - a.avgSpend)[0];

  return (
    <div className="card p-4 lg:p-5 h-full bg-white text-surface-900 border-surface-200 dark:bg-surface-900 dark:border-surface-800 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-base font-semibold">Spending by day of week</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Average transaction amount per day</p>
        </div>
        {topDayData && topDayData.avgSpend > 0 && (
          <div className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs px-3 py-1.5 rounded-full font-medium inline-block w-max">
            {topDayData.day} is your highest day
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
        {data.map(d => {
          const isHighest = topDayData && d.day === topDayData.day && d.avgSpend > 0;
          return (
            <div
              key={d.day}
              className={`rounded-xl p-3 text-center transition-colors cursor-default min-w-[70px] flex-1 flex flex-col items-center justify-between border border-transparent ${
                isHighest 
                  ? 'bg-blue-600 dark:bg-blue-600 shadow-md transform -translate-y-1' 
                  : 'bg-surface-50 border-surface-200 dark:border-transparent dark:bg-surface-800/80 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <p className={`text-xs font-medium mb-2 ${isHighest ? 'text-blue-50' : 'text-surface-500 dark:text-surface-300'}`}>{d.day}</p>
              
              {/* Highlight line */}
              <div className={`w-8 h-0.5 rounded-full mb-2 ${isHighest ? 'bg-white' : 'bg-blue-500 dark:bg-blue-400/50'}`} />

              <p className={`text-sm font-bold whitespace-nowrap mb-0.5 ${isHighest ? 'text-white' : 'text-surface-900 dark:text-surface-100'}`}>
                {d.avgSpend > 0 ? `₹${d.avgSpend.toLocaleString('en-IN')}` : '—'}
              </p>
              <p className={`text-[10px] font-medium opacity-80 ${isHighest ? 'text-blue-100' : 'text-surface-500 dark:text-surface-400'}`}>
                avg/txn
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
