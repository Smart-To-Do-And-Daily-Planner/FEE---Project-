import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle,
  Save,
  X,
  AlertCircle,
  Calendar as CalendarIcon,
  Tag,
  AlignLeft,
  Folder,
  Lightbulb,
  Check
} from 'lucide-react';

/**
 * TaskForm Component
 * Developed by Member 1 (Form Layout) & Member 2 (CRUD Logic).
 * 
 * Features:
 * - Feature 3: Task Categories (College, Coding, Assignment, Exam, Personal, Other)
 * - Feature 4: Rule-based Smart Suggestions based on title keyword matching
 * - Supports Add and Edit modes, validation, and cancel handling
 */
export const CATEGORIES = [
  'College',
  'Coding',
  'Assignment',
  'Exam',
  'Personal',
  'Other',
];

export default function TaskForm({
  onAddTask,
  onUpdateTask,
  onCancelEdit,
  editingTask,
  isDarkMode,
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('College');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [appliedSuggestion, setAppliedSuggestion] = useState(false);

  // Sync inputs when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setPriority(editingTask.priority || 'Medium');
      setCategory(editingTask.category || 'Other');
      setDueDate(editingTask.dueDate || '');
      setErrorMessage('');
      setAppliedSuggestion(true); // Don't prompt override when editing
    } else {
      setTitle('');
      setPriority('Medium');
      setCategory('College');
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
      setErrorMessage('');
      setAppliedSuggestion(false);
    }
  }, [editingTask]);

  // Feature 4: Rule-based Smart Suggestion heuristic (Member 3 & 4)
  const smartSuggestion = useMemo(() => {
    if (!title.trim() || editingTask || appliedSuggestion) return null;

    const lower = title.toLowerCase();

    if (
      lower.includes('exam') ||
      lower.includes('test') ||
      lower.includes('quiz') ||
      lower.includes('viva')
    ) {
      return { category: 'Exam', priority: 'High' };
    }

    if (
      lower.includes('assignment') ||
      lower.includes('submit') ||
      lower.includes('submission')
    ) {
      return { category: 'Assignment', priority: 'High' };
    }

    if (
      lower.includes('coding') ||
      lower.includes('programming') ||
      lower.includes('leetcode') ||
      lower.includes('react') ||
      lower.includes('java') ||
      lower.includes('python')
    ) {
      return { category: 'Coding', priority: 'Medium' };
    }

    if (
      lower.includes('buy') ||
      lower.includes('shopping') ||
      lower.includes('grocery')
    ) {
      return { category: 'Personal', priority: 'Low' };
    }

    return { category: 'Other', priority: 'Medium' };
  }, [title, editingTask, appliedSuggestion]);

  // Apply suggested category and priority
  const handleApplySuggestion = () => {
    if (smartSuggestion) {
      setCategory(smartSuggestion.category);
      setPriority(smartSuggestion.priority);
      setAppliedSuggestion(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Please enter a task title.');
      return;
    }

    if (!dueDate) {
      setErrorMessage('Please select a due date.');
      return;
    }

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: trimmedTitle,
        priority,
        category,
        dueDate,
      });
    } else {
      onAddTask({
        title: trimmedTitle,
        priority,
        category,
        dueDate,
      });

      setTitle('');
      setPriority('Medium');
      setCategory('College');
      setAppliedSuggestion(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-white shadow-md'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold flex items-center gap-2">
          {editingTask ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Edit Task</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Add New Task</span>
            </>
          )}
        </h3>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Feature 4: Rule-based Smart Suggestion Box */}
      {smartSuggestion && (
        <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-semibold mb-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Smart Suggestion</span>
            </div>
            <button
              type="button"
              onClick={handleApplySuggestion}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Suggestion</span>
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Suggested Category: <strong className="text-blue-700 dark:text-blue-300">{smartSuggestion.category}</strong> &bull; Priority: <strong className="text-blue-700 dark:text-blue-300">{smartSuggestion.priority}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Task Title <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setAppliedSuggestion(false);
            }}
            placeholder="What needs to be done?"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Priority & Category (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Dropdown (Feature 3) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Priority</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Due Date Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Due Date <span className="text-red-500">*</span></span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {editingTask ? (
            <>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Update Task</span>
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Task</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}