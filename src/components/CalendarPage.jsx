import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  Home,
  Sun,
  Moon,
  Folder,
  AlertTriangle
} from 'lucide-react';

function checkIsOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dueDate.split('-');
  const taskDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return taskDate < today;
}

export default function CalendarPage({
  tasks,
  onToggleComplete,
  onNavigatePlanner,
  onNavigateHome,
  isDarkMode,
  onToggleDarkMode,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(todayStr);
  };

  // Calendar calculations (Feature 11)
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Map tasks by date and check for overdue count
    const taskDataByDate = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        if (!taskDataByDate[t.dueDate]) {
          taskDataByDate[t.dueDate] = { count: 0, hasOverdue: false };
        }
        taskDataByDate[t.dueDate].count += 1;
        if (checkIsOverdue(t.dueDate, t.completed)) {
          taskDataByDate[t.dueDate].hasOverdue = true;
        }
      }
    });

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ isBlank: true, id: `blank-${i}` });
    }

    for (let day = 1; day <= totalDays; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
      const data = taskDataByDate[dateKey] || { count: 0, hasOverdue: false };

      cells.push({
        isBlank: false,
        day,
        dateKey,
        isToday: dateKey === todayStr,
        taskCount: data.count,
        hasOverdue: data.hasOverdue,
      });
    }

    return cells;
  }, [currentYear, currentMonth, tasks, todayStr]);

  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDateStr);
  }, [tasks, selectedDateStr]);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDateStr) return '';
    try {
      const [year, month, day] = selectedDateStr.split('-');
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

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
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
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
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight">
                SmartTo-Do and Daily Planner
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Interactive Monthly Calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
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
            </button>

            <button
              onClick={onNavigateHome}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={onNavigatePlanner}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Planner</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Calendar View */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Inspect tasks and deadlines by date. Days with overdue tasks are flagged in red.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid Box (7 cols) */}
          <div
            className={`lg:col-span-7 p-5 rounded-2xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">
                {monthNames[currentMonth]} {currentYear}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoToday}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition-colors"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarGrid.map((cell) => {
                if (cell.isBlank) {
                  return (
                    <div
                      key={cell.id}
                      className="h-14 sm:h-16 rounded-xl bg-slate-50/50 dark:bg-slate-900/30"
                    />
                  );
                }

                const isSelected = cell.dateKey === selectedDateStr;
                const hasTasks = cell.taskCount > 0;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedDateStr(cell.dateKey)}
                    className={`h-14 sm:h-16 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                        : cell.isToday
                        ? 'border-blue-300 dark:border-blue-700 bg-slate-50 dark:bg-slate-800/80 font-bold'
                        : isDarkMode
                        ? 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : cell.isToday
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cell.day}
                      </span>
                      {cell.isToday && (
                        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Task count & Overdue badge (Feature 11) */}
                    {hasTasks && (
                      <div className="mt-auto">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                            cell.hasOverdue
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {cell.hasOverdue && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                          <span>{cell.taskCount} {cell.taskCount === 1 ? 'task' : 'tasks'}</span>
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Tasks Panel (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 rounded-2xl border transition-colors space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tasks for Selected Date
              </span>
              <h3 className="text-lg font-bold mt-0.5">
                {formattedSelectedDate}
              </h3>
            </div>

            <div className="space-y-2.5">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task) => {
                  const isTaskOverdue = checkIsOverdue(task.dueDate, task.completed);
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : isTaskOverdue
                          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                          : isDarkMode
                          ? 'bg-slate-800/60 border-slate-700'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => onToggleComplete(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs sm:text-sm font-semibold break-words ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getPriorityBadgeClass(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                              <Folder className="w-3 h-3 text-slate-400" />
                              <span>{task.category || 'Other'}</span>
                            </span>
                            {isTaskOverdue && (
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>OVERDUE</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    No tasks for this date.
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