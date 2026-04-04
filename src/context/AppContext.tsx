import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { generateMockTransactions } from '../data/mockTransactions';
import { isInMonth, getLast6Months, formatMonthShort } from '../utils/dateHelpers';


// ─── Types ───────────────────────────────────────────────────

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
}

export interface Filters {
  search: string;
  type: 'all' | 'income' | 'expense';
  categories: string[];
  dateFrom: string;
  dateTo: string;
  status: 'all' | 'completed' | 'pending' | 'failed';
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface AppState {
  transactions: Transaction[];
  filters: Filters;
  sort: SortConfig;
  currentPage: number;
  role: 'admin' | 'viewer';
  budgets: Record<string, number>;
  goals: Goal[];
  darkMode: boolean;
  activeSection: string;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── Actions ─────────────────────────────────────────────────

type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ROLE'; payload: 'admin' | 'viewer' }
  | { type: 'SET_BUDGET'; payload: { category: string; amount: number } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'EDIT_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SECTION'; payload: string }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

// ─── Initial State ───────────────────────────────────────────

const defaultFilters: Filters = {
  search: '',
  type: 'all',
  categories: [],
  dateFrom: '',
  dateTo: '',
  status: 'all',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function createInitialState(): AppState {
  const storedTransactions = loadFromStorage<Transaction[] | null>('zorvyn_transactions', null);
  return {
    transactions: storedTransactions || generateMockTransactions(),
    filters: defaultFilters,
    sort: { column: 'date', direction: 'desc' },
    currentPage: 1,
    role: loadFromStorage<'admin' | 'viewer'>('zorvyn_role', 'admin'),
    budgets: loadFromStorage<Record<string, number>>('zorvyn_budgets', {
      Food: 8000,
      Transport: 5000,
      Entertainment: 3000,
      Shopping: 10000,
      Healthcare: 5000,
      Utilities: 5000,
      Education: 4000,
      Other: 3000,
    }),
    goals: loadFromStorage<Goal[]>('zorvyn_goals', [
      {
        id: 'goal-1',
        name: 'Emergency Fund',
        targetAmount: 200000,
        currentAmount: 85000,
        targetDate: '2026-12-31',
        createdAt: '2026-01-01',
      },
      {
        id: 'goal-2',
        name: 'New Laptop',
        targetAmount: 80000,
        currentAmount: 52000,
        targetDate: '2026-06-30',
        createdAt: '2026-02-01',
      },
      {
        id: 'goal-3',
        name: 'Vacation Fund',
        targetAmount: 50000,
        currentAmount: 12000,
        targetDate: '2026-09-30',
        createdAt: '2026-03-01',
      },
    ]),
    darkMode: loadFromStorage<boolean>('zorvyn_darkMode', false),
    activeSection: 'overview',
    toasts: [],
  };
}

// ─── Reducer ─────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, currentPage: 1 };
    case 'CLEAR_FILTERS':
      return { ...state, filters: defaultFilters, currentPage: 1 };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.category]: action.payload.amount },
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'EDIT_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => (g.id === action.payload.id ? action.payload : g)),
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_SECTION':
      return { ...state, activeSection: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts.slice(-2), action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  filteredTransactions: Transaction[];
  paginatedTransactions: Transaction[];
  totalPages: number;
  monthlySummary: { month: string; income: number; expense: number; net: number }[];
  categoryTotals: { name: string; value: number; color: string }[];
  currentMonthIncome: number;
  currentMonthExpenses: number;
  lastMonthIncome: number;
  lastMonthExpenses: number;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const ITEMS_PER_PAGE = 10;

// ─── Provider ────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('zorvyn_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('zorvyn_role', JSON.stringify(state.role));
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem('zorvyn_budgets', JSON.stringify(state.budgets));
  }, [state.budgets]);

  useEffect(() => {
    localStorage.setItem('zorvyn_goals', JSON.stringify(state.goals));
  }, [state.goals]);

  useEffect(() => {
    localStorage.setItem('zorvyn_darkMode', JSON.stringify(state.darkMode));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Toast helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3000);
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = [...state.transactions];
    const { search, type, categories, dateFrom, dateTo, status } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        t => t.description.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q))
      );
    }
    if (type !== 'all') {
      result = result.filter(t => t.type === type);
    }
    if (categories.length > 0) {
      result = result.filter(t => categories.includes(t.category));
    }
    if (dateFrom) {
      result = result.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(t => t.date <= dateTo + 'T23:59:59.999Z');
    }
    if (status !== 'all') {
      result = result.filter(t => t.status === status);
    }

    // Sort
    const { column, direction } = state.sort;
    result.sort((a, b) => {
      let cmp = 0;
      if (column === 'date') cmp = a.date.localeCompare(b.date);
      else if (column === 'description') cmp = a.description.localeCompare(b.description);
      else if (column === 'category') cmp = a.category.localeCompare(b.category);
      else if (column === 'amount') cmp = a.amount - b.amount;
      else if (column === 'status') cmp = a.status.localeCompare(b.status);
      else if (column === 'paymentMethod') cmp = a.paymentMethod.localeCompare(b.paymentMethod);
      return direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [state.transactions, state.filters, state.sort]);

  // Paginated
  const paginatedTransactions = useMemo(() => {
    const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, state.currentPage]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)), [filteredTransactions]);

  // Monthly summary
  const monthlySummary = useMemo(() => {
    const months = getLast6Months();
    return months.map(month => {
      const monthTx = state.transactions.filter(t => isInMonth(t.date, month));
      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month: formatMonthShort(month), income, expense, net: income - expense };
    });
  }, [state.transactions]);

  // Category totals (current month expenses)
  const categoryTotals = useMemo(() => {
    const months = getLast6Months();
    const currentMonth = months[months.length - 1];
    const totals: Record<string, number> = {};
    
    state.transactions
      .filter(t => t.type === 'expense' && isInMonth(t.date, currentMonth))
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });

    const colors: Record<string, string> = {
      Food: '#f97316', Transport: '#3b82f6', Entertainment: '#8b5cf6',
      Shopping: '#ec4899', Healthcare: '#ef4444', Utilities: '#06b6d4',
      Education: '#f59e0b', Other: '#64748b',
    };

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value, color: colors[name] || '#64748b' }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  // Current/Last month computations
  const months = getLast6Months();
  const currentMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];

  const currentMonthIncome = useMemo(() =>
    state.transactions.filter(t => t.type === 'income' && isInMonth(t.date, currentMonth)).reduce((s, t) => s + t.amount, 0),
    [state.transactions]
  );
  const currentMonthExpenses = useMemo(() =>
    state.transactions.filter(t => t.type === 'expense' && isInMonth(t.date, currentMonth)).reduce((s, t) => s + t.amount, 0),
    [state.transactions]
  );
  const lastMonthIncome = useMemo(() =>
    state.transactions.filter(t => t.type === 'income' && isInMonth(t.date, lastMonth)).reduce((s, t) => s + t.amount, 0),
    [state.transactions]
  );
  const lastMonthExpenses = useMemo(() =>
    state.transactions.filter(t => t.type === 'expense' && isInMonth(t.date, lastMonth)).reduce((s, t) => s + t.amount, 0),
    [state.transactions]
  );

  const value = useMemo(() => ({
    state,
    dispatch,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    monthlySummary,
    categoryTotals,
    currentMonthIncome,
    currentMonthExpenses,
    lastMonthIncome,
    lastMonthExpenses,
    addToast,
  }), [state, filteredTransactions, paginatedTransactions, totalPages, monthlySummary, categoryTotals, currentMonthIncome, currentMonthExpenses, lastMonthIncome, lastMonthExpenses, addToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
