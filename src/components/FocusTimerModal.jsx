import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock, CheckCircle2, Target } from 'lucide-react';

/**
 * FocusTimerModal Component
 * Feature 7: Pomodoro Focus Timer for focused student study sessions.
 * 
 * Simple React implementation:
 * - useState for remaining seconds and timer active state
 * - useEffect with setInterval for countdown logic
 * - Easy to explain during viva examinations.
 */
export default function FocusTimerModal({ task, onClose, isDarkMode }) {
  const INITIAL_SECONDS = 25 * 60; // 25 minutes
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(INITIAL_SECONDS);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-xl border transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Focus Mode (Pomodoro)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Focus Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Task Details */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
            Working On
          </span>
          <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {task?.title || 'Selected Task'}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md font-medium bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              {task?.category || 'College'}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Priority: {task?.priority || 'Medium'}
            </span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="my-8 text-center">
          <div className="text-6xl sm:text-7xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Standard 25-minute study sprint
          </p>

          {isCompleted && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Focus session completed! Great job. Take a 5-minute break.</span>
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleTogglePlay}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            title="Reset to 25:00"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}