import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import ProgressBar from '../ui/ProgressBar';
import CategoryIcon from '../ui/CategoryIcon';
import { isInMonth, getLast6Months } from '../../utils/dateHelpers';

export default function BudgetPlanner() {
  const { state, dispatch, addToast } = useApp();
  const { budgets, role, transactions } = state;
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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

  function startEdit(cat: string) {
    if (role !== 'admin') return;
    setEditingCategory(cat);
    setEditValue((budgets[cat] || 0).toString());
  }

  function saveEdit() {
    if (!editingCategory) return;
    const amount = Math.max(0, Number(editValue) || 0);
    dispatch({ type: 'SET_BUDGET', payload: { category: editingCategory, amount } });
    setEditingCategory(null);
    addToast(`Budget for ${editingCategory} updated`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingCategory(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Budget Planner</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Set and track monthly spending limits by category
          {role === 'viewer' && ' (read-only)'}
        </p>
      </div>

      {/* Summary bar */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">Total Budget</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">Total Spent</p>
            <p className={`text-2xl font-bold ${totalSpent > totalBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} />
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
          {totalBudget > totalSpent
            ? `₹${(totalBudget - totalSpent).toLocaleString('en-IN')} remaining this month`
            : `Over budget by ₹${(totalSpent - totalBudget).toLocaleString('en-IN')}`
          }
        </p>
      </div>

      {/* Category cards */}
      {EXPENSE_CATEGORIES.every(cat => !budgets[cat]) ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {role === 'admin' ? 'Click on a category card to set a budget limit.' : 'Ask an admin to set budget limits.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXPENSE_CATEGORIES.map(cat => {
            const budget = budgets[cat] || 0;
            const spent = categorySpend[cat] || 0;
            const remaining = budget - spent;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const isEditing = editingCategory === cat;

            return (
              <div
                key={cat}
                onClick={() => !isEditing && startEdit(cat)}
                className={`card p-4 ${role === 'admin' && !isEditing ? 'cursor-pointer card-hover' : ''}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CategoryIcon category={cat} size="sm" />
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{cat}</h4>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-xs text-surface-500 dark:text-surface-400">Budget Limit (₹)</label>
                    <input
                      type="number"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full px-3 py-2 rounded-xl border border-primary-300 dark:border-primary-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary-500"
                      onClick={e => e.stopPropagation()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); saveEdit(); }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setEditingCategory(null); }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400 mb-1">
                      <span>Spent: {formatCurrency(spent)}</span>
                      <span>Budget: {formatCurrency(budget)}</span>
                    </div>
                    <ProgressBar value={spent} max={budget} />
                    <p className={`text-xs font-medium mt-2 ${
                      remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {remaining >= 0
                        ? `${formatCurrency(remaining)} remaining`
                        : `${formatCurrency(Math.abs(remaining))} over budget`
                      }
                    </p>
                    <div className="text-right mt-1">
                      <span className={`text-xs font-bold ${
                        percentage < 60 ? 'text-emerald-500' : percentage < 90 ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
