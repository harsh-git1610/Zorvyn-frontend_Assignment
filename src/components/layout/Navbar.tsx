import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { state, dispatch } = useApp();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-surface-200 dark:border-surface-700/50 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Zorvyn Finance
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role banner */}
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            state.role === 'admin'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
          }`}>
            {state.role === 'admin' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Admin Mode
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Viewer Mode
              </>
            )}
          </div>

          {/* Role Switcher */}
          <select
            id="role-switcher"
            value={state.role}
            onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as 'admin' | 'viewer' })}
            className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-2.5 py-1.5 text-sm font-medium text-surface-700 dark:text-surface-300 focus:ring-2 focus:ring-primary-500 cursor-pointer transition-colors"
          >
            <option value="admin">⬢ Admin</option>
            <option value="viewer">◎ Viewer</option>
          </select>

          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-surface-600 dark:text-surface-400"
            aria-label="Toggle dark mode"
          >
            {state.darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
