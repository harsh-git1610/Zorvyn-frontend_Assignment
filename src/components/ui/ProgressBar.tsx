interface ProgressBarProps {
  value: number;
  max: number;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ value, max, size = 'md' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const barColor = percentage < 60
    ? 'bg-emerald-500'
    : percentage < 90
    ? 'bg-amber-500'
    : 'bg-rose-500';

  return (
    <div className={`w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
      <div
        className={`${barColor} rounded-full transition-all duration-500 ease-out ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
