import React from 'react';
import {
  CheckCircle2,
  Calendar,
  ListTodo,
  ShieldCheck,
  ArrowRight,
  LogIn,
  Sun,
  Moon,
  Clock,
  Target
} from 'lucide-react';

/**
 * WelcomePage Component
 * Clean, realistic 2nd-year CSE student project welcome view.
 * Developed by Member 1 (Introduction & Planning).
 */
export default function WelcomePage({
  onGetStarted,
  onSignIn,
  isDarkMode,
  onToggleDarkMode,
}) {
  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`border-b transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-1.5 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">SmartTo-Do</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg ml-1">Planner</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-center flex-1 flex flex-col justify-center items-center">
        {/* Project Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-semibold mb-6">
          <span>🎓 2nd Year B.E. / B.Tech CSE Mini-Project</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          SmartTo-Do and Daily Planner
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
          Manage your day efficiently
        </p>

        {/* Natural description */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          Plan your tasks, organize your priorities, and keep track of your daily work in one place.
          Built with task analytics, automated overdue tracking, rule-based smart suggestions, and a Pomodoro focus timer.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Open Planner Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSignIn}
            className={`w-full sm:w-auto px-6 py-3 text-base font-semibold border rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <ListTodo className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm mb-1">Task Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CRUD, priority tagging, categorization, and rule-based smart suggestions.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm mb-1">Analytics & Overdue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time counts for Total, Completed, Pending, and Overdue tasks.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm mb-1">Pomodoro Focus</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built-in 25-minute sprint timer to maintain focused study sessions.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm mb-1">Date Calendar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive monthly view with overdue detection and today marker.
            </p>
          </div>
        </div>


      </main>

      {/* Footer */}
      <footer
        className={`border-t py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <p>SmartTo-Do and Daily Planner &bull; Academic Mini-Project &bull; LocalStorage Powered</p>
      </footer>
    </div>
  );
}