import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import SummaryCard from '../ui/SummaryCard';
import BalanceTrendChart from '../charts/BalanceTrendChart';
import SpendingDonutChart from '../charts/SpendingDonutChart';
import Badge from '../ui/Badge';
import CategoryIcon from '../ui/CategoryIcon';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';

export default function Overview() {
  const {
    state, monthlySummary,
    currentMonthIncome, currentMonthExpenses,
    lastMonthIncome, lastMonthExpenses
  } = useApp();

  const totalBalance = useMemo(() => {
    return state.transactions
      .filter(t => t.status !== 'failed')
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  }, [state.transactions]);

  const totalIncome = useMemo(() => state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [state.transactions]);
  const totalExpenses = useMemo(() => state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [state.transactions]);

  // Percentage changes
  const incomeChange = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseChange = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
  const balanceChange = incomeChange - expenseChange;
  const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;
  const lastSavingsRate = lastMonthIncome > 0 ? ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100 : 0;
  const savingsRateChange = savingsRate - lastSavingsRate;

  // Sparkline data from monthly summary
  const incomeSparkline = monthlySummary.map(m => m.income);
  const expenseSparkline = monthlySummary.map(m => m.expense);
  const netSparkline = monthlySummary.map(m => m.net);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [state.transactions]);

  // Quick stats
  const quickStats = useMemo(() => {
    const currentMonthTx = state.transactions.filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    
    const highestExpense = currentMonthTx
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    const methodCounts: Record<string, number> = {};
    currentMonthTx.forEach(t => {
      methodCounts[t.paymentMethod] = (methodCounts[t.paymentMethod] || 0) + 1;
    });
    const topMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      highestExpense,
      txCount: currentMonthTx.length,
      topMethod: topMethod ? topMethod[0] : 'N/A',
    };
  }, [state.transactions]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Track your financial health at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={totalBalance}
          change={balanceChange}
          color="blue"
          
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
        <SummaryCard
          title="Total Income"
          value={currentMonthIncome}
          change={incomeChange}
          color="green"   
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>}
        />
        <SummaryCard
          title="Total Expenses"
          value={currentMonthExpenses}
          change={expenseChange}
          color="red"
          
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>}
        />
        <SummaryCard
          title="Savings Rate"
          value={savingsRate}
          change={savingsRateChange}
          color="purple"
          isPercentage
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceTrendChart />
        <SpendingDonutChart />
      </div>

      {/* Recent Transactions + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 card">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {recentTransactions.map(tx => {
              return (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <CategoryIcon category={tx.category} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{tx.description}</p>
                    <p className="text-xs text-surface-400">{formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.status}>{tx.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-5 space-y-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20">
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Highest Expense</p>
              <p className="text-base font-bold text-surface-900 dark:text-white">
                {quickStats.highestExpense ? formatCurrency(quickStats.highestExpense.amount) : '—'}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">
                {quickStats.highestExpense?.description || 'No expenses this month'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Transactions This Month</p>
              <p className="text-base font-bold text-surface-900 dark:text-white">{quickStats.txCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Most Used Payment</p>
              <p className="text-base font-bold text-surface-900 dark:text-white">{quickStats.topMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
