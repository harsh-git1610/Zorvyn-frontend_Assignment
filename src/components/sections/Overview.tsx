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
    state, dispatch,
    currentMonthIncome, currentMonthExpenses,
    lastMonthIncome, lastMonthExpenses
  } = useApp();

  const totalBalance = useMemo(() => {
    return state.transactions
      .filter(t => t.status !== 'failed')
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  }, [state.transactions]);


  // Percentage changes
  const incomeChange = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseChange = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
  const balanceChange = incomeChange - expenseChange;
  const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;
  const lastSavingsRate = lastMonthIncome > 0 ? ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100 : 0;
  const savingsRateChange = savingsRate - lastSavingsRate;



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
          dotColorClass="bg-blue-500"
          valueColorClass="text-surface-900 dark:text-white"
        />
        <SummaryCard
          title="Total Income"
          value={currentMonthIncome}
          change={incomeChange}
          dotColorClass="bg-emerald-500"
          valueColorClass="text-surface-900 dark:text-white"
        />
        <SummaryCard
          title="Total Expenses"
          value={currentMonthExpenses}
          change={expenseChange}
          dotColorClass="bg-rose-500"
          valueColorClass="text-surface-900 dark:text-white"
        />
        <SummaryCard
          title="Savings Rate"
          value={savingsRate}
          change={savingsRateChange}
          dotColorClass="bg-purple-500"
          valueColorClass="text-surface-900 dark:text-white"
          isPercentage
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
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Transactions</h3>
            <button
              onClick={() => dispatch({ type: 'SET_SECTION', payload: 'transactions' })}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
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
