import { useState } from 'react';
import type { Goal } from '../../context/AppContext';

interface GoalFormProps {
  goal?: Goal;
  onSubmit: (data: Omit<Goal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const [name, setName] = useState(goal?.name || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount?.toString() || '0');
  const [targetDate, setTargetDate] = useState(goal?.targetDate || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Goal name is required';
    if (!targetAmount || Number(targetAmount) <= 0) errs.targetAmount = 'Target amount must be positive';
    if (Number(currentAmount) < 0) errs.currentAmount = 'Current amount cannot be negative';
    if (!targetDate) errs.targetDate = 'Target date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      targetDate,
    });
  }

  const inputClass = "w-full px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const labelClass = "block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Goal Name *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Emergency Fund"
          className={`${inputClass} ${errors.name ? 'border-rose-400' : ''}`}
        />
        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Target Amount (₹) *</label>
          <input
            type="number"
            value={targetAmount}
            onChange={e => setTargetAmount(e.target.value)}
            placeholder="50000"
            min="0"
            className={`${inputClass} ${errors.targetAmount ? 'border-rose-400' : ''}`}
          />
          {errors.targetAmount && <p className="text-xs text-rose-500 mt-1">{errors.targetAmount}</p>}
        </div>
        <div>
          <label className={labelClass}>Current Saved (₹)</label>
          <input
            type="number"
            value={currentAmount}
            onChange={e => setCurrentAmount(e.target.value)}
            placeholder="0"
            min="0"
            className={`${inputClass} ${errors.currentAmount ? 'border-rose-400' : ''}`}
          />
          {errors.currentAmount && <p className="text-xs text-rose-500 mt-1">{errors.currentAmount}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Target Date *</label>
        <input
          type="date"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)}
          className={`${inputClass} ${errors.targetDate ? 'border-rose-400' : ''}`}
        />
        {errors.targetDate && <p className="text-xs text-rose-500 mt-1">{errors.targetDate}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25"
        >
          {goal ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
}
