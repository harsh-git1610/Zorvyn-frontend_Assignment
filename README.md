# Finance Dashboard

A modern, feature-rich Finance Dashboard single-page application built with React, Tailwind CSS, and Recharts. Track your finances, manage budgets, and achieve savings goals — all with a beautiful, responsive UI.

> **No backend required** — the app runs entirely in the browser using mock data and localStorage for persistence.

---

## ✨ Features

### 📊 Overview Dashboard
- **4 Summary Cards** — Total Balance, Income, Expenses, and Savings Rate with sparkline charts and month-over-month change indicators
- **Balance Trend Chart** — 6-month area chart showing income vs expenses
- **Spending Breakdown** — Donut chart for category-wise expense distribution
- **Recent Transactions** — Quick-view list of the latest 5 transactions
- **Quick Stats** — Highest expense, transaction count, most-used payment method

### 📋 Transactions Management
- Full sortable table with pagination (10 per page)
- Multi-filter support: search, type, category, date range, status
- Export to CSV or JSON
- Add/Edit/Delete transactions (Admin only)
- Confirmation dialogs for delete operations

### 📈 Insights
- **Monthly Comparison** — Side-by-side bar chart with net savings line overlay
- **Category Trends** — Line chart with toggleable category visibility
- **Weekday Heatmap** — Color-coded spending intensity by day of week
- **Auto-generated Insight Cards** — Dynamic analysis of spending patterns, savings rates, and trends

### 💰 Budget Planner (Extra Feature)
- Set monthly budget limits per expense category
- Visual progress bars with color thresholds (green → amber → red)
- Overall budget summary with total spent vs total limit
- Inline editing for admins, read-only for viewers

### 🎯 Goals Tracker (Extra Feature)
- Create savings goals with target amounts and dates
- Circular progress indicators with percentage display
- Smart status detection: On Track / At Risk / Completed / Overdue
- Days remaining counter

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks (useState, useReducer, useContext, useMemo) |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **Recharts** | All charts and data visualizations |
| **date-fns** | Date formatting and manipulation |
| **React Context + useReducer** | Global state management |
| **localStorage** | Data persistence across sessions |
| **Vite** | Build tool and dev server |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

---

## 👥 Role-Based Access Control

Switch between **Admin** and **Viewer** roles using the dropdown in the top navbar.

### Admin
- Full CRUD operations on transactions
- Edit budget limits
- Create/edit/delete savings goals
- Sees "Admin Mode" banner

### Viewer
- Read-only access to all sections
- Can use all filters and sorting
- Can export data (CSV/JSON)
- Sees "Viewer Mode" banner

The selected role is persisted to localStorage.

---

## 🏗️ State Management

The app uses a single **React Context** (`AppContext`) with `useReducer` for centralized state management:

- All state changes go through a dispatcher
- Derived data (filtered transactions, monthly summaries, category totals) computed via `useMemo`
- State slices persisted to localStorage: transactions, role, budgets, goals, dark mode
- Toast notifications managed through the same context

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.tsx          # Context + useReducer + localStorage sync
├── data/
│   ├── mockTransactions.ts     # 50+ realistic mock transactions
│   └── categories.ts           # Category definitions, colors, icons
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── Sidebar.tsx         # Collapsible sidebar + mobile tab bar
│   │   └── Layout.tsx          # Page layout wrapper
│   ├── ui/
│   │   ├── SummaryCard.tsx     # Stat card with sparkline
│   │   ├── Badge.tsx           # Status/type badges
│   │   ├── Modal.tsx           # Reusable modal with focus trapping
│   │   ├── Toast.tsx           # Toast notifications
│   │   ├── ProgressBar.tsx     # Color-coded progress bar
│   │   ├── ConfirmDialog.tsx   # Delete confirmation
│   │   └── Skeleton.tsx        # Loading shimmer skeletons
│   ├── charts/
│   │   ├── BalanceTrendChart.tsx
│   │   ├── SpendingDonutChart.tsx
│   │   ├── MonthlyComparisonChart.tsx
│   │   ├── CategoryTrendChart.tsx
│   │   └── WeekdayHeatmap.tsx
│   ├── sections/
│   │   ├── Overview.tsx
│   │   ├── Transactions.tsx
│   │   ├── Insights.tsx
│   │   ├── BudgetPlanner.tsx
│   │   └── GoalsTracker.tsx
│   └── forms/
│       ├── TransactionForm.tsx
│       └── GoalForm.tsx
├── utils/
│   ├── formatCurrency.ts       # ₹ formatter (Indian number system)
│   ├── dateHelpers.ts          # Date utilities
│   ├── exportHelpers.ts        # CSV/JSON export
│   └── insightCalculators.ts   # Insight generation logic
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🌙 Dark Mode

Toggle dark mode via the button in the top navbar. The preference is persisted to localStorage and applies Tailwind's `dark:` variants throughout the app.

---

## 💱 Currency & Locale

All amounts are formatted in **Indian Rupees (₹)** using the Indian number system:
- `₹1,23,456` format via `Intl.NumberFormat('en-IN')`

---

## ⚠️ Known Limitations / Future Improvements

- **No backend** — all data is local; clearing localStorage resets everything
- **No authentication** — role switching is a UI toggle, not security
- **Charts in dark mode** — tooltip styling may vary slightly across browsers
- **Mobile charts** — complex charts may feel cramped on very small screens
- **Future ideas**: drag-and-drop budget reordering, recurring transaction support, data import, real-time currency conversion

---


