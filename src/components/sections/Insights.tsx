import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import MonthlyComparisonChart from '../charts/MonthlyComparisonChart';
import CategoryTrendChart from '../charts/CategoryTrendChart';
import WeekdayHeatmap from '../charts/WeekdayHeatmap';
import { generateInsights } from '../../utils/insightCalculators';

const insightTypeColors = {
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  danger: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
};

const insightValueColors = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  danger: 'text-rose-600 dark:text-rose-400',
};

const insightIconBgColors = {
  info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  success: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  danger: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
};

const INSIGHT_ICONS: Record<string, string> = {
  'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'coin': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'receipt': 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
};

function InsightIcon({ icon, type }: { icon: string; type: 'info' | 'warning' | 'success' | 'danger' }) {
  const path = INSIGHT_ICONS[icon] || INSIGHT_ICONS['chart-bar'];
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${insightIconBgColors[type]}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const insights = useMemo(() => generateInsights(state.transactions), [state.transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Insights</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Discover patterns and trends in your finances</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map(insight => (
          <div
            key={insight.id}
            className={`rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${insightTypeColors[insight.type]}`}
          >
            <div className="flex items-start gap-3">
              <InsightIcon icon={insight.icon} type={insight.type} />
              <div className="flex-1">
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">{insight.title}</p>
                <p className={`text-xl font-bold mb-1.5 ${insightValueColors[insight.type]}`}>{insight.value}</p>
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyComparisonChart />
        <WeekdayHeatmap />
      </div>
      
      <CategoryTrendChart />
    </div>
  );
}
