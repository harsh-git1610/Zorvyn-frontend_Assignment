import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import MonthlyComparisonChart from '../charts/MonthlyComparisonChart';
import CategorySpendingList from '../charts/CategorySpendingList';
import WeekdayHeatmap from '../charts/WeekdayHeatmap';
import { generateInsights, type KPI, type ContextualInsight } from '../../utils/insightCalculators';

// Helper to map insight icon names to SVG paths
const INSIGHT_ICONS: Record<string, string> = {
  'arrow-down': 'M19 14l-7 7m0 0l-7-7m7 7V3',
  'briefcase': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'plus-square': 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  'menu': 'M4 6h16M4 12h16M4 18h16',
};

function InsightIcon(props: { icon: string; className?: string }) {
  const path = INSIGHT_ICONS[props.icon] || INSIGHT_ICONS['arrow-down'];
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${props.className || 'bg-white text-surface-900 border border-surface-200'}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  );
}

function renderBadge(badge?: KPI['badge']) {
  if (!badge) return null;
  const colors = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    neutral: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[badge.type]}`}>
      {badge.text}
    </span>
  );
}

// Convert markdown bold `**text**` to <strong> tags safely
function parseText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-surface-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function Insights() {
  const { state } = useApp();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | '3month' | '6month'>('month');
  
  const { kpis, suggestions } = useMemo(() => generateInsights(state.transactions), [state.transactions]);

  const filters = [
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
    { id: '3month', label: 'Last 3 months' },
    { id: '6month', label: 'Last 6 months' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Insights</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-5">Discover patterns and trends in your finances</p>
        
        <div className="flex bg-surface-50 dark:bg-[#1a1a1a] p-1 rounded-xl w-max border border-surface-200 dark:border-surface-800 flex-wrap gap-1">
          {filters.map(f => (
            <button
               key={f.id}
               onClick={() => setTimeFilter(f.id)}
               className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium border ${
                 timeFilter === f.id
                   ? 'bg-white text-surface-900 border-surface-300 dark:bg-surface-800 dark:text-white dark:border-surface-600 shadow-sm'
                   : 'bg-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 border-transparent dark:text-surface-400 dark:hover:text-surface-300 dark:border-transparent dark:hover:border-surface-600'
               }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.slice(0, 3).map(kpi => {
          let valueColor = 'text-green-500';
          let iconColor = 'text-green-600';
          if (kpi.id === 'top-cat') { valueColor = 'text-blue-500'; iconColor = 'text-blue-600'; }
          if (kpi.id === 'pending') { valueColor = 'text-amber-500'; iconColor = 'text-amber-700'; }
          
          return (
            <div key={kpi.id} className="card p-5 bg-white border-surface-200 text-surface-900 dark:bg-surface-900 dark:border-surface-800 dark:text-white flex items-start gap-4 h-full">
              <InsightIcon icon={kpi.icon} className={`bg-white ${iconColor}`} />
              <div className="flex-1 w-full">
                <div className="flex flex-col items-start gap-1 mb-1">
                  <span className="text-[10px] font-bold tracking-wider text-surface-400 uppercase">{kpi.title}</span>
                  {renderBadge(kpi.badge)}
                </div>
                <div className={`text-2xl font-normal mb-1 mt-1 ${valueColor}`}>{kpi.value}</div>
                <div className="text-xs text-surface-400">{kpi.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Cards Row (Bottom 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {kpis.slice(3, 5).map(kpi => {
          let valueColor = 'text-rose-500';
          let iconColor = 'text-rose-600';
          if (kpi.id === 'active-day') { valueColor = 'text-indigo-500'; iconColor = 'text-indigo-600'; }
          
          return (
            <div key={kpi.id} className="card p-5 bg-white border-surface-200 text-surface-900 dark:bg-surface-900 dark:border-surface-800 dark:text-white flex items-start gap-4">
              <InsightIcon icon={kpi.icon} className={`bg-white ${iconColor}`} />
              <div className="flex-1 w-full">
                <div className="flex flex-col items-start gap-1 mb-1">
                  <span className="text-[10px] font-bold tracking-wider text-surface-400 uppercase">{kpi.title}</span>
                  {renderBadge(kpi.badge)}
                </div>
                <div className={`text-2xl font-normal mb-1 mt-1 ${valueColor}`}>{kpi.value}</div>
                <div className="text-xs text-surface-400">{kpi.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Monthly Comparison & Category list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-white border-surface-200 text-surface-900 dark:bg-surface-900 dark:border-surface-800 dark:text-white">
           <MonthlyComparisonChart />
        </div>
        <CategorySpendingList filter={timeFilter} />
      </div>

      {/* Bottom Section: Heatmap */}
      <WeekdayHeatmap />

      {/* Contextual Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-10">
        {suggestions.map((s, idx) => {
          let iconClasses = 'bg-white text-green-700';
          if (idx === 1) iconClasses = 'bg-orange-50 text-orange-700';
          if (idx === 2) iconClasses = 'bg-blue-50 text-blue-700';
          return (
            <div key={s.id} className="card p-4 bg-white border-surface-200 text-surface-900 dark:bg-surface-900 dark:border-surface-800 dark:text-white flex items-start gap-3">
              <InsightIcon icon={s.icon} className={`shrink-0 mt-0.5 ${iconClasses}`} />
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed font-light">
                {parseText(s.text)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
