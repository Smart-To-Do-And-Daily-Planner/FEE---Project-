import React from 'react';
import {
  Calendar,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  AlertTriangle,
  Play,
  Folder
} from 'lucide-react';

/**
 * TaskCard Component
 * Developed by Member 1 (Layout) & Member 2 (Interactions).
 * 
 * Features:
 * - Feature 2: Overdue Task Detection (shows ⚠ OVERDUE badge for incomplete overdue tasks)
 * - Feature 3: Task Category badge display (safe fallback to 'Other')
 * - Feature 7: "Start Focus" button triggering Pomodoro Focus Mode
 * - Complete toggle, Edit, and Delete actions
 */
export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartFocus,
  isDarkMode,
}) {
  // Feature 2: Check if task is overdue
  // Task is overdue if not completed AND due date is before today
  const isOverdue = (() => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = task.dueDate.split('-');
    const taskDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return taskDate < today;
  })();

  // Format due date: DD-MM-YYYY
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        return `${day}-${month}-${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Priority color styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return isDarkMode
          ? 'bg-red-950/70 text-red-300 border-red-800'
          : 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return isDarkMode
          ? 'bg-amber-950/70 text-amber-300 border-amber-800'
          : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return isDarkMode
          ? 'bg-blue-950/70 text-blue-300 border-blue-800'
          : 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return isDarkMode
          ? 'bg-slate-800 text-slate-300 border-slate-700'
          : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const category = task.category || 'Other';

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        task.completed
          ? isDarkMode
            ? 'bg-slate-900/40 border-emerald-900/40 text-slate-400'
            : 'bg-emerald-50/40 border-emerald-200/80 text-slate-600'
          : isOverdue
          ? isDarkMode
            ? 'bg-slate-900 border-red-900/60 shadow-xs'
            : 'bg-white border-red-200 shadow-sm'
          : isDarkMode
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Top Row: Complete toggle, Title, and Overdue Badge */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0"
          title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          aria-label="Toggle task status"
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm sm:text-base font-semibold break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : isDarkMode
                  ? 'text-slate-100'
                  : 'text-slate-800'
              }`}
            >
              {task.title}
            </p>

            {/* Feature 2: Overdue Warning Badge */}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>OVERDUE</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Metadata (Priority, Category, Due Date) & Actions */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority */}
          <span
            className={`px-2.5 py-0.5 rounded-md border font-semibold text-[11px] ${getPriorityBadgeClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>

          {/* Category Badge (Feature 3) */}
          <span className="px-2.5 py-0.5 rounded-md border text-[11px] font-medium bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <Folder className="w-3 h-3 text-slate-400" />
            <span>{category}</span>
          </span>

          {/* Due Date Indicator */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDisplayDate(task.dueDate)}</span>
          </div>
        </div>

        {/* Right: Actions (Focus, Edit, Delete) */}
        <div className="flex items-center gap-1.5">
          {/* Feature 7: Start Focus Button */}
          {!task.completed && (
            <button
              type="button"
              onClick={() => onStartFocus && onStartFocus(task)}
              className="px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors flex items-center gap-1"
              title="Start Pomodoro Focus on this task"
            >
              <Play className="w-3 h-3" />
              <span>Focus</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}