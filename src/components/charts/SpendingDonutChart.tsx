import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SpendingDonutChart() {
  const { categoryTotals } = useApp();

  const total = categoryTotals.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Spending Breakdown</h3>
      {categoryTotals.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-surface-400 dark:text-surface-500 text-sm">
          No expenses this month
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryTotals.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-50, #f8fafc)',
                    border: '1px solid var(--color-surface-200, #e2e8f0)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-surface-400 dark:text-surface-500">Total</span>
              <span className="text-lg font-bold text-surface-900 dark:text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-2.5 text-xs">
            {categoryTotals.map(cat => (
              <div key={cat.name} className="flex items-center gap-2 min-w-[120px]">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-surface-600 dark:text-surface-400">{cat.name}</span>
                <span className="font-semibold text-surface-900 dark:text-surface-200 ml-auto tabular-nums">
                  {total > 0 ? ((cat.value / total) * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
