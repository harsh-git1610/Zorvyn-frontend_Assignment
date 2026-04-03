import { formatCurrency } from '../../utils/formatCurrency';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  isPercentage?: boolean;
  
  dotColorClass?: string;
  valueColorClass?: string;
  
  bottomLeftText?: string;
  bottomRightText?: string;
  bottomRightColorClass?: string;
  
  // Backward compatibility for Overview.tsx
  change?: number;
}

export default function SummaryCard({ 
  title, 
  value, 
  isPercentage,
  dotColorClass = 'bg-blue-500',
  valueColorClass = 'text-surface-900 dark:text-white',
  bottomLeftText,
  bottomRightText,
  bottomRightColorClass,
  change
}: SummaryCardProps) {
  
  // Handle 'change' prop for Overview.tsx
  let finalLeft = bottomLeftText;
  let finalRight = bottomRightText;
  let finalRightColor = bottomRightColorClass || valueColorClass;

  if (change !== undefined) {
    const isPositive = change >= 0;
    finalLeft = 'vs last month';
    finalRight = `${isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%`;
    finalRightColor = isPositive ? 'text-green-500' : 'text-rose-500';
  }

  const formattedValue = typeof value === 'number' 
    ? (isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value))
    : value;

  return (
    <div className="card p-5 bg-white flex flex-col justify-between dark:bg-[#141414]">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold tracking-[0.08em] text-surface-500 dark:text-surface-400 uppercase">
            {title}
          </span>
          <div className={`w-2 h-2 rounded-full ${dotColorClass}`} />
        </div>
        <div className={`text-4xl sm:text-3xl lg:text-4xl font-bold mb-5 ${valueColorClass}`}>
          {formattedValue}
        </div>
      </div>
      
      <div className="border-t border-surface-200 dark:border-surface-800/60 pt-3 flex justify-between items-center text-xs">
        <span className="text-surface-500 dark:text-surface-500 truncate mr-2">
          {finalLeft}
        </span>
        <span className={`font-semibold shrink-0 ${finalRightColor}`}>
          {finalRight}
        </span>
      </div>
    </div>
  );
}
