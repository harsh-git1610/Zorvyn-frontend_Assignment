import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCompactCurrency } from '../../utils/formatCurrency';

export default function MonthlyComparisonChart() {
  const { monthlySummary } = useApp();

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Monthly Comparison</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={monthlySummary} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          <Legend iconSize={10} wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
          <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
