import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  )},
  { id: 'transactions', label: 'Transactions', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  )},
  { id: 'insights', label: 'Insights', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  )},
  { id: 'budget', label: 'Budget Planner', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { id: 'goals', label: 'Goals Tracker', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  )},
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-60 border-r border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-900 shrink-0 transition-all duration-200">
        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
          {navItems.map(item => {
            const isActive = state.activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => dispatch({ type: 'SET_SECTION', payload: item.id })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-primary-500' : ''}`}>{item.icon}</span>
                <span className="hidden lg:block truncate">{item.label}</span>
                {isActive && <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-surface-200 dark:border-surface-700/50">
        <nav className="flex items-center justify-around py-1.5">
          {navItems.map(item => {
            const isActive = state.activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: 'SET_SECTION', payload: item.id })}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-surface-500 dark:text-surface-400'
                }`}
              >
                <span className={isActive ? 'text-primary-500' : ''}>{item.icon}</span>
                <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
