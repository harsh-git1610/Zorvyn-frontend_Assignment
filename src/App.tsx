import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Overview from './components/sections/Overview';
import Transactions from './components/sections/Transactions';
import Insights from './components/sections/Insights';
import BudgetPlanner from './components/sections/BudgetPlanner';
import GoalsTracker from './components/sections/GoalsTracker';
import { SkeletonCard, SkeletonChart, SkeletonTable } from './components/ui/Skeleton';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}

function AppContent() {
  const { state } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = () => {
    if (loading) return <LoadingSkeleton />;
    
    switch (state.activeSection) {
      case 'overview': return <Overview />;
      case 'transactions': return <Transactions />;
      case 'insights': return <Insights />;
      case 'budget': return <BudgetPlanner />;
      case 'goals': return <GoalsTracker />;
      default: return <Overview />;
    }
  };

  return (
    <Layout>
      {/* Role banner */}
      <div className={`mb-4 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
        state.role === 'admin'
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700'
      }`}>
        {state.role === 'admin' ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Admin Mode — You have full edit access
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Viewer Mode — Read-only access
          </>
        )}
      </div>
      {renderSection()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
