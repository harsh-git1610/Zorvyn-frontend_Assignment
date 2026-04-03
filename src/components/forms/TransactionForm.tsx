import { useState, useEffect } from 'react';
import type { Transaction } from '../../context/AppContext';
import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, STATUSES } from '../../data/categories';

interface TransactionFormProps {
  transaction?: Transaction; // if editing
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(
    transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState(transaction?.status || 'completed');
  const [paymentMethod, setPaymentMethod] = useState(transaction?.paymentMethod || 'UPI');
  const [note, setNote] = useState(transaction?.note || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!amount || Number(amount) <= 0) errs.amount = 'Amount must be positive';
    if (!category) errs.category = 'Category is required';
    if (!date) errs.date = 'Date is required';
    if (new Date(date) > new Date()) errs.date = 'Date cannot be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      date: new Date(date).toISOString(),
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      status: status as Transaction['status'],
      paymentMethod,
      note: note.trim() || undefined,
    });
  }

  const inputClass = "w-full px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const labelClass = "block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex rounded-xl bg-surface-100 dark:bg-surface-800 p-1">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            type === 'expense'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-surface-600 dark:text-surface-400'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            type === 'income'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-surface-600 dark:text-surface-400'
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Description *</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g., Netflix, Swiggy"
            className={`${inputClass} ${errors.description ? 'border-rose-400 dark:border-rose-500' : ''}`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className={labelClass}>Amount (₹) *</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            className={`${inputClass} ${errors.amount ? 'border-rose-400 dark:border-rose-500' : ''}`}
          />
          {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className={labelClass}>Date *</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`${inputClass} ${errors.date ? 'border-rose-400 dark:border-rose-500' : ''}`}
          />
          {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className={inputClass}
          >
            {PAYMENT_METHODS.map(pm => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={inputClass}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            className={inputClass}
          />
        </div>
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
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
