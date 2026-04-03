export interface CategoryInfo {
  name: string;
  color: string;
  bgColor: string;
  icon: string; // SVG path data for the icon
}

// SVG icon paths (Heroicons-style, 24x24 viewBox)
const ICON_PATHS = {
  food: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z', // cart
  transport: 'M8 17a2 2 0 002 2h4a2 2 0 002-2M8 17H4.236a2 2 0 01-1.789-1.106l-1.342-2.684A2 2 0 012 11.882V8a2 2 0 012-2h3.93a2 2 0 011.664.89l.812 1.22A2 2 0 0012.07 9H18a2 2 0 012 2v3a2 2 0 01-2 2h-2M8 17v-1', // car
  entertainment: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', // film
  shopping: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', // bag
  healthcare: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', // heart
  utilities: 'M13 10V3L4 14h7v7l9-11h-7z', // lightning
  salary: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // dollar
  freelance: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', // laptop
  investment: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', // trending up
  education: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', // book
  other: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', // clipboard
};

export const CATEGORIES: Record<string, CategoryInfo> = {
  Food: { name: 'Food', color: '#f97316', bgColor: '#fff7ed', icon: ICON_PATHS.food },
  Transport: { name: 'Transport', color: '#3b82f6', bgColor: '#eff6ff', icon: ICON_PATHS.transport },
  Entertainment: { name: 'Entertainment', color: '#8b5cf6', bgColor: '#f5f3ff', icon: ICON_PATHS.entertainment },
  Shopping: { name: 'Shopping', color: '#ec4899', bgColor: '#fdf2f8', icon: ICON_PATHS.shopping },
  Healthcare: { name: 'Healthcare', color: '#ef4444', bgColor: '#fef2f2', icon: ICON_PATHS.healthcare },
  Utilities: { name: 'Utilities', color: '#06b6d4', bgColor: '#ecfeff', icon: ICON_PATHS.utilities },
  Salary: { name: 'Salary', color: '#10b981', bgColor: '#ecfdf5', icon: ICON_PATHS.salary },
  Freelance: { name: 'Freelance', color: '#14b8a6', bgColor: '#f0fdfa', icon: ICON_PATHS.freelance },
  Investment: { name: 'Investment', color: '#6366f1', bgColor: '#eef2ff', icon: ICON_PATHS.investment },
  Education: { name: 'Education', color: '#f59e0b', bgColor: '#fffbeb', icon: ICON_PATHS.education },
  Other: { name: 'Other', color: '#64748b', bgColor: '#f8fafc', icon: ICON_PATHS.other },
};

export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Utilities', 'Education', 'Other'];
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment'];
export const ALL_CATEGORIES = Object.keys(CATEGORIES);

export const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'] as const;
export const STATUSES = ['completed', 'pending', 'failed'] as const;
export const TYPES = ['income', 'expense'] as const;

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b',
  '#10b981', '#14b8a6', '#3b82f6', '#06b6d4', '#ef4444', '#64748b'
];
