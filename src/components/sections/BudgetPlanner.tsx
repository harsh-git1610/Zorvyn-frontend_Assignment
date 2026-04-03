import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import CategoryIcon from '../ui/CategoryIcon';
import { isInMonth, getLast6Months } from '../../utils/dateHelpers';
import { format } from 'date-fns';

export default function BudgetPlanner() {
  const { state, dispatch, addToast } = useApp();
  const { budgets, role, transactions } = state;
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const months = getLast6Months();
  const currentMonth = months[months.length - 1];

  const categorySpend = useMemo(() => {
    const spend: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && isInMonth(t.date, currentMonth))
      .forEach(t => {
        spend[t.category] = (spend[t.category] || 0) + t.amount;
      });
    return spend;
  }, [transactions]);

  const totalBudget = EXPENSE_CATEGORIES.reduce((sum, cat) => sum + (budgets[cat] || 0), 0);
  const totalSpent = EXPENSE_CATEGORIES.reduce((sum, cat) => sum + (categorySpend[cat] || 0), 0);
  
  const totalPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const totalRemaining = totalBudget - totalSpent;
  const totalRemainingPct = 100 - totalPct;
  const now = new Date();
  const currentMonthText = format(now, 'MMMM yyyy');

  function toggleEditMode() {
    if (role !== 'admin') return;
    if (!isEditingMode) {
      const v: Record<string, string> = {};
      EXPENSE_CATEGORIES.forEach(c => v[c] = (budgets[c] || 0).toString());
      setEditValues(v);
      setIsEditingMode(true);
    } else {
      EXPENSE_CATEGORIES.forEach(cat => {
        const amount = Math.max(0, Number(editValues[cat]) || 0);
        if (amount !== (budgets[cat] || 0)) {
          dispatch({ type: 'SET_BUDGET', payload: { category: cat, amount } });
        }
      });
      setIsEditingMode(false);
      addToast('Budgets updated successfully');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Budget planner</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Set and track monthly spending limits by category
          {role === 'viewer' && ' (read-only)'}
        </p>
      </div>

      {/* Top Summary Hero Card */}
      <div className="bg-[#1c1c1e] text-surface-300 rounded-[24px] p-6 lg:p-8 flex flex-col gap-8 shadow-sm border border-surface-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-surface-800">
          <div className="pt-4 sm:pt-0 pl-0">
            <p className="text-[10px] font-semibold tracking-widest text-surface-500 uppercase mb-1">Total Budget</p>
            <p className="text-4xl lg:text-3xl xl:text-4xl font-bold text-white mb-1.5">{formatCurrency(totalBudget)}</p>
            <p className="text-xs text-surface-500">{currentMonthText}</p>
          </div>
          
          <div className="pt-4 sm:pt-0 sm:pl-6">
            <p className="text-[10px] font-semibold tracking-widest text-surface-500 uppercase mb-1">Total Spent</p>
            <p className="text-4xl lg:text-3xl xl:text-4xl font-bold text-[#f59e0b] mb-1.5">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-surface-500">{totalPct.toFixed(0)}% of budget used</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <p className="text-[10px] font-semibold tracking-widest text-surface-500 uppercase mb-1">Remaining</p>
            <p className={`text-4xl lg:text-3xl xl:text-4xl font-bold mb-1.5 ${totalRemaining >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(Math.abs(totalRemaining))}
            </p>
            <p className="text-xs text-surface-500">
              {totalRemaining >= 0 ? `${Math.max(0, totalRemainingPct).toFixed(0)}% still available` : 'Budget overrun'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full h-1.5 bg-surface-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, totalPct))}%` }} />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-surface-600">₹0</span>
            <span className="text-surface-500 text-center font-medium">
              {formatCurrency(totalSpent)} spent of {formatCurrency(totalBudget)}
            </span>
            <span className={totalRemaining >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
              {totalRemaining >= 0 ? `${Math.max(0, totalRemainingPct).toFixed(0)}% remaining` : 'Over budget'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mt-12 mb-4">
        <div>
          <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 tracking-[0.1em] uppercase">
            CATEGORIES · {EXPENSE_CATEGORIES.length}
          </h3>
        </div>
        {role === 'admin' && (
          <button
            onClick={toggleEditMode}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border shadow-sm ${
              isEditingMode 
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                : 'bg-white dark:bg-surface-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            {isEditingMode ? 'Save budgets' : '+ Edit budgets'}
          </button>
        )}
      </div>

      {EXPENSE_CATEGORIES.every(cat => !budgets[cat]) && !isEditingMode ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {role === 'admin' ? 'Click + Edit budgets to set limits.' : 'Ask an admin to set budget limits.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXPENSE_CATEGORIES.map(cat => {
            const budget = budgets[cat] || 0;
            const spent = categorySpend[cat] || 0;
            const remaining = budget - spent;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            
            let statusText = 'Well under budget';
            let statusColor = 'text-green-600 dark:text-green-500';
            let barColor = 'bg-green-500';
            let percentBg = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
            
            if (budget === 0) {
              statusText = 'Not started';
              statusColor = 'text-surface-400 text-opacity-80';
              barColor = 'bg-surface-200 dark:bg-surface-700'; 
              percentBg = 'bg-surface-200 text-surface-500 dark:bg-surface-800 dark:text-surface-400';
            } else if (remaining < 0) {
              statusText = 'Over budget';
              statusColor = 'text-rose-600 dark:text-rose-500';
              barColor = 'bg-rose-500';
              percentBg = 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
            } else if (percentage >= 85) {
              statusText = 'Nearing budget';
              statusColor = 'text-amber-600 dark:text-amber-500';
              barColor = 'bg-amber-500';
              percentBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
            } else if (percentage >= 40) {
              statusText = 'Moderate usage';
              statusColor = 'text-amber-600 dark:text-amber-500';
              barColor = 'bg-blue-500'; 
              percentBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
            }
            
            return (
              <div key={cat} className="card p-5 bg-white text-surface-900 dark:bg-surface-900 dark:text-white flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden h-44">
                <div className="flex justify-between items-start mb-6 z-10 relative">
                  <div className="flex gap-3 items-center">
                    <CategoryIcon category={cat} size="sm" />
                    <div>
                      <h4 className="text-sm font-semibold">{cat}</h4>
                      <p className="text-xs text-surface-400 font-light mt-0.5">of {formatCurrency(budget)}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${percentBg}`}>
                    {percentage.toFixed(0)}%
                  </div>
                </div>
                
                <div className="flex justify-between items-baseline mb-4 z-10 relative">
                  <span className={`text-2xl font-normal tabular-nums ${budget === 0 && spent === 0 ? 'text-surface-300 dark:text-surface-600' : 'text-surface-900 dark:text-white'}`}>
                    {formatCurrency(spent)}
                  </span>
                  <span className="text-xs text-surface-400 font-medium">
                    {budget === 0 ? `${formatCurrency(0)} left` : `${formatCurrency(Math.abs(remaining))} ${remaining >= 0 ? 'left' : 'over'}`}
                  </span>
                </div>
                
                <div className="z-10 relative mt-auto">
                  <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.08em]">
                    <span className="text-surface-300 dark:text-surface-600">Spent</span>
                    <span className={statusColor}>{statusText}</span>
                  </div>
                </div>
                
                {/* Editing overlay */}
                {isEditingMode && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md flex flex-col justify-center items-center p-4 py-8 z-20 transition-all border border-blue-200 dark:border-blue-900 rounded-2xl">
                     <p className="text-xs font-semibold mb-2 text-surface-500 dark:text-surface-400">Editing {cat} limit</p>
                     <input
                        type="number"
                        value={editValues[cat]}
                        onChange={(e) => setEditValues({ ...editValues, [cat]: e.target.value })}
                        className="w-full text-center px-4 py-3 bg-surface-50 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-xl font-bold dark:text-white"
                     />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
