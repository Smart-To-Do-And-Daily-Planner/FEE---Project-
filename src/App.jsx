import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import WelcomePage from './components/WelcomePage';
import SignInPage from './components/SignInPage';
import PlannerDashboard from './components/PlannerDashboard';
import CalendarPage from './components/CalendarPage';
import FocusTimerModal from './components/FocusTimerModal';

/**
 * SmartTo-Do and Daily Planner
 * Academic 2nd-Year B.E./B.Tech CSE Project
 * 
 * Main coordinator component managing top-level page routing,
 * tasks state persistence via custom useLocalStorage hook,
 * dark mode theme toggling, and Pomodoro focus modal.
 */

// Initial realistic student sample tasks
const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Complete Java Assignment',
    priority: 'High',
    category: 'Assignment',
    dueDate: '2026-10-02',
    createdAt: '2026-09-28T10:00:00',
    completed: false,
  },
  {
    id: 2,
    title: 'Prepare DBMS Notes',
    priority: 'Medium',
    category: 'College',
    dueDate: '2026-10-04',
    createdAt: '2026-09-29T11:00:00',
    completed: false,
  },
  {
    id: 3,
    title: 'Prepare Project Presentation',
    priority: 'High',
    category: 'Exam',
    dueDate: '2026-10-06',
    createdAt: '2026-09-30T09:00:00',
    completed: true,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [tasks, setTasks] = useLocalStorage('smart-planner-tasks', INITIAL_TASKS);
  const [userSession, setUserSession] = useState(null);

  // Feature 8: Dark Mode State with LocalStorage persistence
  const [isDarkMode, setIsDarkMode] = useLocalStorage('smart-planner-dark-mode', false);

  // Feature 7: Focused task for Pomodoro Modal
  const [focusTask, setFocusTask] = useState(null);

  // Synchronize 'dark' class on documentElement for Tailwind CSS support
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Add Task Handler (Member 2 & 3)
  const handleAddTask = ({ title, priority, category, dueDate }) => {
    const newTask = {
      id: Date.now(),
      title,
      priority: priority || 'Medium',
      category: category || 'College',
      dueDate,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  // Update Task Handler (Preserves id, createdAt, and completed state)
  const handleUpdateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              title: updatedTask.title,
              priority: updatedTask.priority,
              category: updatedTask.category || 'Other',
              dueDate: updatedTask.dueDate,
              createdAt: task.createdAt || new Date().toISOString(),
              completed: task.completed,
            }
          : task
      )
    );
  };

  // Delete Task Handler
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (focusTask && focusTask.id === taskId) {
      setFocusTask(null);
    }
  };

  // Toggle Task Completion Handler
  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle successful sign in
  const handleSignInSuccess = (userData) => {
    setUserSession(userData);
    setCurrentPage('planner');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {currentPage === 'welcome' && (
        <WelcomePage
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onGetStarted={() => setCurrentPage('planner')}
          onSignIn={() => setCurrentPage('signin')}
        />
      )}

      {currentPage === 'signin' && (
        <SignInPage
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onSignInSuccess={handleSignInSuccess}
          onBack={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'calendar' && (
        <CalendarPage
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onNavigatePlanner={() => setCurrentPage('planner')}
          onNavigateHome={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'planner' && (
        <PlannerDashboard
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          tasks={tasks}
          userSession={userSession}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onStartFocus={(task) => setFocusTask(task)}
          onNavigateHome={() => setCurrentPage('welcome')}
          onNavigateCalendar={() => setCurrentPage('calendar')}
        />
      )}

      {/* Feature 7: Pomodoro Focus Timer Modal */}
      {focusTask && (
        <FocusTimerModal
          task={focusTask}
          onClose={() => setFocusTask(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}