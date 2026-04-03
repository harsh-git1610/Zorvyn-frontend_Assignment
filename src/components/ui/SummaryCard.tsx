import { formatCurrency } from '../../utils/formatCurrency';

interface SummaryCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'purple';
  sparklineData?: number[];
  isPercentage?: boolean;
}

const colorMap = {
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    accent: '#10b981',
  },
  red: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconText: 'text-rose-600 dark:text-rose-400',
    accent: '#ef4444',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconText: 'text-blue-600 dark:text-blue-400',
    accent: '#3b82f6',
  },
  purple: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconText: 'text-violet-600 dark:text-violet-400',
    accent: '#8b5cf6',
  },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (data.length - 1);
  
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SummaryCard({ title, value, change, icon, color, sparklineData, isPercentage }: SummaryCardProps) {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <div className="card card-hover p-4 lg:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl ${colors.iconBg}`}>
          <span className={colors.iconText}>{icon}</span>
        </div>
        {sparklineData && <MiniSparkline data={sparklineData} color={colors.accent} />}
      </div>
      <div>
        <p className="text-sm text-surface-500 dark:text-surface-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-white animate-count">
          {isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value)}
        </p>
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {isPositive ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
          )}
          <span>{Math.abs(change).toFixed(1)}% vs last month</span>
        </div>
      </div>
    </div>
  );
}
