import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { state, dispatch } = useApp();

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2">
      {state.toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-xl min-w-[280px] max-w-[380px] ${
            toast.type === 'success'
              ? 'bg-emerald-50/90 dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-50/90 dark:bg-rose-900/60 border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-200'
              : 'bg-blue-50/90 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
          }`}
        >
          {toast.type === 'success' && (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.type === 'error' && (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.type === 'info' && (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
            className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
