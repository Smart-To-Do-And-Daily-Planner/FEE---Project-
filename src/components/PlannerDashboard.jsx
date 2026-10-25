import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Home,
  Search,
  SlidersHorizontal,
  Clock,
  AlertTriangle,
  CheckCircle,
  ListTodo,
  Sun,
  Moon,
  Target,
  Play,
  ArrowRight
} from 'lucide-react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

/**
 * Helper to determine if a date is overdue
 */
function checkIsOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dueDate.split('-');
  const taskDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return taskDate < today;
}

export default function PlannerDashboard({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onStartFocus,
  onNavigateHome,
  onNavigateCalendar,
  isDarkMode,
  onToggleDarkMode,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [editingTask, setEditingTask] = useState(null);

  // Dynamic calculations for Feature 1 (Analytics) & Feature 2 (Overdue)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const overdueTasks = tasks.filter((t) => checkIsOverdue(t.dueDate, t.completed)).length;
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Feature 6: Dynamic Daily Summary & Time-aware Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  }, []);

  const highPriorityPending = useMemo(() => {
    return tasks.filter((t) => !t.completed && t.priority === 'High').length;
  }, [tasks]);

  // Feature 5: Today's Focus (Top 3 urgent tasks)
  const todaysFocusTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeTasks = tasks.filter((t) => !t.completed);

    // Score urgency: Overdue High (100) > High Due Today (90) > Overdue Med (80) > High Due Soon (70) > Med Due Soon (60)
    const scored = activeTasks.map((task) => {
      let score = 0;
      let statusLabel = 'Due Soon';

      if (task.dueDate) {
        const [y, m, d] = task.dueDate.split('-');
        const dueDateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        const diffDays = Math.round((dueDateObj - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          statusLabel = 'Overdue';
          score = task.priority === 'High' ? 100 : 80;
        } else if (diffDays === 0) {
          statusLabel = 'Due Today';
          score = task.priority === 'High' ? 90 : 70;
        } else if (diffDays === 1) {
          statusLabel = 'Due Tomorrow';
          score = task.priority === 'High' ? 75 : 60;
        } else {
          statusLabel = `Due in ${diffDays} days`;
          score = task.priority === 'High' ? 50 : 30;
        }
      }

      return { task, score, statusLabel };
    });

    // Sort by score descending and take top 3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [tasks]);

  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  // Combined Filter + Search + Sort (Member 3 - useMemo)
  const processedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesFilter =
          filter === 'All' ||
          (filter === 'Active' && !task.completed) ||
          (filter === 'Completed' && task.completed);

        if (!matchesFilter) return false;

        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          return task.title.toLowerCase().includes(query);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
          return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
        } else if (sortBy === 'createdAt') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
  }, [tasks, filter, searchQuery, sortBy]);

  const handleStartEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveUpdatedTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Header */}
      <header
        className={`border-b sticky top-0 z-30 shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                SmartTo-Do and Daily Planner
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Manage your day efficiently
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle (Feature 8) */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={onNavigateCalendar}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Feature 6: Dynamic Greeting & Daily Summary */}
        <div
          className={`p-5 rounded-2xl border transition-colors ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {greeting}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                You have <strong>{pendingTasks}</strong> tasks remaining.{' '}
                {highPriorityPending > 0 && (
                  <span>
                    <strong>{highPriorityPending}</strong> high-priority{' '}
                    {highPriorityPending === 1 ? 'task needs' : 'tasks need'} attention.{' '}
                  </span>
                )}
                {overdueTasks > 0 ? (
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {overdueTasks} {overdueTasks === 1 ? 'task is' : 'tasks are'} overdue.
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    No overdue tasks!
                  </span>
                )}
              </p>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 self-start sm:self-auto">
              Academic Daily Planner
            </div>
          </div>
        </div>

        {/* Feature 1: Improved Analytics Dashboard (4 Metric Cards + Progress) */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Tasks */}
            <div
              className={`p-4 rounded-xl border text-center transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Tasks
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {totalTasks}
              </div>
            </div>

            {/* Completed */}
            <div
              className={`p-4 rounded-xl border text-center transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Completed
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {completedTasks}
              </div>
            </div>

            {/* Pending */}
            <div
              className={`p-4 rounded-xl border text-center transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                {pendingTasks}
              </div>
            </div>

            {/* Overdue */}
            <div
              className={`p-4 rounded-xl border text-center transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Overdue
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
                {overdueTasks}
              </div>
            </div>
          </div>

          {/* Completion Progress Bar */}
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-600 dark:text-slate-400">Completion Progress</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Feature 5: Today's Focus Section */}
        <div
          className={`p-5 rounded-2xl border transition-colors ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-base">Today's Focus</h3>
            </div>
            <span className="text-xs text-slate-400">Prioritized for maximum productivity</span>
          </div>

          {todaysFocusTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {todaysFocusTasks.map(({ task, statusLabel }, idx) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    statusLabel === 'Overdue'
                      ? 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20'
                      : isDarkMode
                      ? 'bg-slate-800/80 border-slate-700/80'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-400">#{idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          statusLabel === 'Overdue'
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <p className="font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 mb-2">
                      {task.title}
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span>{task.priority} Priority</span> &bull; <span>{task.category || 'Other'}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => onStartFocus && onStartFocus(task)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Focus</span>
                    </button>
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No urgent tasks for today.
            </div>
          )}
        </div>

        {/* Feature 10: Main Section (Task Form + Tasks List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <TaskForm
              onAddTask={onAddTask}
              onUpdateTask={handleSaveUpdatedTask}
              onCancelEdit={handleCancelEdit}
              editingTask={editingTask}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Column: Search, Filter, Sort & Task List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search, Filter & Sort Box */}
            <div
              className={`p-4 rounded-xl border transition-colors space-y-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Row 1: Live Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Row 2: Filter Tabs & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* Filter Tabs */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {['All', 'Active', 'Completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        filter === tab
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sort by:</span>
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Creation Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task Count Indicator */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Showing {processedTasks.length} {processedTasks.length === 1 ? 'task' : 'tasks'}</span>
              {(filter !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setFilter('All');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Tasks Container */}
            <div className="space-y-3">
              {processedTasks.length > 0 ? (
                processedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={handleStartEdit}
                    onDelete={onDeleteTask}
                    onStartFocus={onStartFocus}
                    isDarkMode={isDarkMode}
                  />
                ))
              ) : (
                <div
                  className={`p-8 text-center rounded-2xl border border-dashed transition-colors ${
                    isDarkMode
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold mb-1">
                    No tasks found
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {searchQuery
                      ? `No tasks matched "${searchQuery}". Try a different keyword or reset filters.`
                      : 'Add a task to start planning your day.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-3 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <p>SmartTo-Do and Daily Planner &bull; Academic Mini-Project &bull; LocalStorage Powered</p>
      </footer>
    </div>
  );
}