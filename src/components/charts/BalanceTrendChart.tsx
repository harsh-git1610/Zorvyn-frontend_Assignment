import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCompactCurrency } from '../../utils/formatCurrency';

export default function BalanceTrendChart() {
  const { monthlySummary } = useApp();

  return (
    <div className="card p-4 lg:p-5">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Balance Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={monthlySummary} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(value: any) => [formatCompactCurrency(Number(value)), '']}
          />
          <Legend iconSize={10} wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" />
          <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
