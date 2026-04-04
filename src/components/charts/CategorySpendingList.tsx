import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

interface CategorySpendingListProps {
  filter: 'week' | 'month' | '3month' | '6month';
}

export default function CategorySpendingList({ filter }: CategorySpendingListProps) {
  const { state } = useApp();

  const data = useMemo(() => {
    let startDate = new Date();
    if (filter === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (filter === '3month') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (filter === '6month') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const expenses = state.transactions.filter(
      t => t.type === 'expense' && new Date(t.date) >= startDate
    );

    const spendMap: Record<string, number> = {};
    let total = 0;
    expenses.forEach(t => {
      spendMap[t.category] = (spendMap[t.category] || 0) + t.amount;
      total += t.amount;
    });

    return Object.entries(spendMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // show top 6
  }, [state.transactions, filter]);

  const catColors: Record<string, string> = {
    'Shopping': 'bg-blue-500',
    'Food': 'bg-green-500',
    'Transport': 'bg-orange-500',
    'Entertainment': 'bg-purple-500',
    'Utilities': 'bg-red-500',
    'Healthcare': 'bg-teal-500',
    'Education': 'bg-yellow-500',
    'Other': 'bg-gray-500'
  };

  return (
    <div className="card p-4 lg:p-5 flex flex-col h-full bg-white text-surface-900 dark:bg-surface-900 dark:text-white">
      <div className="mb-6">
        <h3 className="text-base font-semibold">Spending by category</h3>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Breakdown for selected period</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        {data.length === 0 ? (
          <div className="text-center text-surface-500 text-sm py-10">No expenses found</div>
        ) : (
          data.map((item) => (
            <div key={item.name} className="flex items-center gap-4 text-sm">
              <div className="w-[100px] flex items-center gap-2 shrink-0">
                <div className={`w-2 h-2 rounded-sm ${catColors[item.name] || 'bg-gray-500'}`} />
                <span className="font-medium truncate">{item.name}</span>
              </div>
              
              <div className="flex-1 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${catColors[item.name] || 'bg-gray-500'}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="w-[110px] flex justify-end gap-3 shrink-0">
                <span className="font-medium tabular-nums">{formatCurrency(item.amount)}</span>
                <span className="text-surface-500 dark:text-surface-400 tabular-nums w-9 text-right">{item.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
