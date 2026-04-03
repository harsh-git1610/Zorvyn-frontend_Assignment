import { useState } from 'react';
import { useApp, type Goal } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { differenceInDays, parseISO, format } from 'date-fns';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import GoalForm from '../forms/GoalForm';

function CircularProgress({ percentage, size = 80, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
  
  const color = percentage >= 100 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#6366f1';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="circular-progress">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-200 dark:text-surface-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold text-surface-900 dark:text-white">
        {Math.min(Math.round(percentage), 100)}%
      </span>
    </div>
  );
}

function getGoalStatus(goal: Goal): { label: string; color: string } {
  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  if (percentage >= 100) return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
  
  const daysLeft = differenceInDays(parseISO(goal.targetDate), new Date());
  if (daysLeft < 0) return { label: 'Overdue', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' };
  
  // Simple heuristic: if days elapsed / total days > percentage saved, at risk
  const totalDays = differenceInDays(parseISO(goal.targetDate), parseISO(goal.createdAt));
  const elapsed = totalDays - daysLeft;
  const expectedPercentage = totalDays > 0 ? (elapsed / totalDays) * 100 : 0;
  
  if (percentage < expectedPercentage * 0.7) return { label: 'At Risk', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  return { label: 'On Track', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
}

export default function GoalsTracker() {
  const { state, dispatch, addToast } = useApp();
  const { goals, role } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  function handleAddGoal(data: Omit<Goal, 'id' | 'createdAt'>) {
    const id = 'goal-' + Date.now();
    dispatch({ type: 'ADD_GOAL', payload: { ...data, id, createdAt: new Date().toISOString().split('T')[0] } });
    setShowAddModal(false);
    addToast('Goal created successfully');
  }

  function handleEditGoal(data: Omit<Goal, 'id' | 'createdAt'>) {
    if (!editingGoal) return;
    dispatch({ type: 'EDIT_GOAL', payload: { ...data, id: editingGoal.id, createdAt: editingGoal.createdAt } });
    setEditingGoal(null);
    addToast('Goal updated');
  }

  function handleDeleteGoal() {
    if (!deletingGoalId) return;
    dispatch({ type: 'DELETE_GOAL', payload: deletingGoalId });
    setDeletingGoalId(null);
    addToast('Goal deleted');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Goals Tracker</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Track your savings goals and milestones</p>
        </div>
        {role === 'admin' && (
          <button
            id="add-goal-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25"
          >
            + Create Goal
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No goals yet</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
            {role === 'admin' ? 'Create your first savings goal to start tracking progress.' : 'No goals have been created yet.'}
          </p>
          {role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Create Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(goal => {
            const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const status = getGoalStatus(goal);
            const daysLeft = differenceInDays(parseISO(goal.targetDate), new Date());

            return (
              <div key={goal.id} className="card card-hover p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-surface-900 dark:text-white">{goal.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium mt-1.5 ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <CircularProgress percentage={percentage} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 dark:text-surface-400">Current</span>
                    <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(goal.currentAmount)}</span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 dark:text-surface-400">Target</span>
                    <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800">
                  <div>
                    <p className="text-[11px] text-surface-400">Target Date</p>
                    <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
                      {format(parseISO(goal.targetDate), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-surface-400">
                      {daysLeft >= 0 ? 'Days Left' : 'Overdue'}
                    </p>
                    <p className={`text-xs font-bold ${daysLeft >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-rose-500'}`}>
                      {Math.abs(daysLeft)} days
                    </p>
                  </div>
                </div>

                {role === 'admin' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingGoalId(goal.id)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Goal">
        <GoalForm onSubmit={handleAddGoal} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Goal Modal */}
      <Modal isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} title="Edit Goal">
        {editingGoal && (
          <GoalForm goal={editingGoal} onSubmit={handleEditGoal} onCancel={() => setEditingGoal(null)} />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingGoalId}
        onClose={() => setDeletingGoalId(null)}
        onConfirm={handleDeleteGoal}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
      />
    </div>
  );
}
