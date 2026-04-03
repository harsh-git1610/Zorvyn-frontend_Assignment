import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';
import { getLast6Months, formatMonthShort, isInMonth } from '../../utils/dateHelpers';
import { formatCompactCurrency } from '../../utils/formatCurrency';

const categoryColors: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Healthcare: '#ef4444',
  Utilities: '#06b6d4',
  Education: '#f59e0b',
  Other: '#64748b',
};

export default function CategoryTrendChart() {
  const { state } = useApp();
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(EXPENSE_CATEGORIES)
  );

  const data = useMemo(() => {
    const months = getLast6Months();
    return months.map(month => {
      const monthTx = state.transactions.filter(t => t.type === 'expense' && isInMonth(t.date, month));
      const row: Record<string, string | number> = { month: formatMonthShort(month) };
      EXPENSE_CATEGORIES.forEach(cat => {
        row[cat] = monthTx.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
      });
      return row;
    });
  }, [state.transactions]);

  const toggleCategory = (cat: string) => {
    setVisibleCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Category Spending Trends</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {EXPENSE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              visibleCategories.has(cat)
                ? 'bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
            {cat}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCompactCurrency(v)} width={60} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-surface-50, #f8fafc)',
              border: '1px solid var(--color-surface-200, #e2e8f0)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [formatCompactCurrency(value), '']}
          />
          {EXPENSE_CATEGORIES.filter(cat => visibleCategories.has(cat)).map(cat => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              stroke={categoryColors[cat]}
              strokeWidth={2}
              dot={{ fill: categoryColors[cat], r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
