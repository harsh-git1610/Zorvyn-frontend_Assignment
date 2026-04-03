import { useState } from 'react';
import { useApp, type Transaction } from '../../context/AppContext';
import { ALL_CATEGORIES, CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';
import { exportToCSV, exportToJSON } from '../../utils/exportHelpers';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import TransactionForm from '../forms/TransactionForm';
import CategoryIcon from '../ui/CategoryIcon';

export default function Transactions() {
  const { state, dispatch, filteredTransactions, paginatedTransactions, totalPages, addToast } = useApp();
  const { filters, sort, currentPage, role } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  function handleSort(column: string) {
    dispatch({
      type: 'SET_SORT',
      payload: {
        column,
        direction: sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc',
      },
    });
  }

  function handleAddTransaction(data: Omit<Transaction, 'id'>) {
    const id = 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...data, id } });
    setShowAddModal(false);
    addToast('Transaction added successfully');
  }

  function handleEditTransaction(data: Omit<Transaction, 'id'>) {
    if (!editingTx) return;
    dispatch({ type: 'EDIT_TRANSACTION', payload: { ...data, id: editingTx.id } });
    setEditingTx(null);
    addToast('Transaction updated');
  }

  function handleDelete() {
    if (!deletingTxId) return;
    dispatch({ type: 'DELETE_TRANSACTION', payload: deletingTxId });
    setDeletingTxId(null);
    addToast('Transaction deleted');
  }

  function toggleCategory(cat: string) {
    const current = filters.categories;
    const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    dispatch({ type: 'SET_FILTERS', payload: { categories: updated } });
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sort.column !== column) return <span className="text-surface-300 dark:text-surface-600 ml-1">↕</span>;
    return <span className="text-primary-500 ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, filteredTransactions.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Transactions</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage and track all your transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredTransactions)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button
            onClick={() => exportToJSON(filteredTransactions)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export JSON
          </button>
          {role === 'admin' && (
            <button
              id="add-transaction-btn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by description..."
            value={filters.search}
            onChange={e => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary-500 transition-colors"
          />
          <select
            value={filters.type}
            onChange={e => dispatch({ type: 'SET_FILTERS', payload: { type: e.target.value as 'all' | 'income' | 'expense' } })}
            className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category multi-select */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 cursor-pointer min-w-[140px] text-left"
            >
              {filters.categories.length > 0 ? `${filters.categories.length} categories` : 'All Categories'}
              <span className="ml-2">▾</span>
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg z-30 max-h-64 overflow-y-auto">
                {ALL_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 px-3 py-2 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded accent-primary-500"
                    />
                    <span className="text-surface-700 dark:text-surface-300 flex items-center gap-1.5"><CategoryIcon category={cat} size="sm" /> {cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => dispatch({ type: 'SET_FILTERS', payload: { dateFrom: e.target.value } })}
            className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100"
            placeholder="From date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => dispatch({ type: 'SET_FILTERS', payload: { dateTo: e.target.value } })}
            className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100"
            placeholder="To date"
          />

          <select
            value={filters.status}
            onChange={e => dispatch({ type: 'SET_FILTERS', payload: { status: e.target.value as typeof filters.status } })}
            className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <button
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            className="px-3 py-2 rounded-xl text-xs font-medium text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No transactions found</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Try adjusting your filters.</p>
          <button
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                  {[
                    { key: 'date', label: 'Date' },
                    { key: 'description', label: 'Description' },
                    { key: 'category', label: 'Category' },
                    { key: 'paymentMethod', label: 'Payment Method' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'status', label: 'Status' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer hover:text-surface-700 dark:hover:text-surface-200 transition-colors whitespace-nowrap"
                    >
                      {col.label}<SortIcon column={col.key} />
                    </th>
                  ))}
                  {role === 'admin' && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {paginatedTransactions.map(tx => {
                  const cat = CATEGORIES[tx.category];
                  return (
                    <tr key={tx.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-surface-600 dark:text-surface-400">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={tx.category} size="sm" />
                          <div>
                            <p className="font-medium text-surface-900 dark:text-white">{tx.description}</p>
                            {tx.note && <p className="text-xs text-surface-400 mt-0.5">{tx.note}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: cat?.bgColor || '#f8fafc', color: cat?.color || '#64748b' }}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400 whitespace-nowrap">{tx.paymentMethod}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={tx.status}>{tx.status}</Badge>
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingTx(tx)}
                              className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 hover:text-primary-500 transition-colors"
                              aria-label="Edit transaction"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                              onClick={() => setDeletingTxId(tx.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-500 hover:text-rose-500 transition-colors"
                              aria-label="Delete transaction"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-surface-100 dark:border-surface-800">
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Showing {startItem}–{endItem} of {filteredTransactions.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, currentPage - 1) })}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              ).map(page => (
                <button
                  key={page}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: page })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.min(totalPages, currentPage + 1) })}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal isOpen={!!editingTx} onClose={() => setEditingTx(null)} title="Edit Transaction">
        {editingTx && (
          <TransactionForm
            transaction={editingTx}
            onSubmit={handleEditTransaction}
            onCancel={() => setEditingTx(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingTxId}
        onClose={() => setDeletingTxId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
