import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

/**
 * SignInPage Component
 * Clean frontend student authentication simulation for viva demonstrations.
 */
export default function SignInPage({
  onSignInSuccess,
  onBack,
  isDarkMode,
  onToggleDarkMode,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotMsg(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Email address cannot be empty.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email containing "@".');
      return;
    }

    if (!password) {
      setErrorMessage('Password cannot be empty.');
      return;
    }

    onSignInSuccess({ email: trimmedEmail, rememberMe });
  };

  const handleForgotPassword = () => {
    setForgotMsg(true);
    setErrorMessage('');
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 transition-colors ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
            isDarkMode
              ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div
        className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 transition-colors shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Welcome</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Student Sign In</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your SmartTo-Do and Daily Planner
          </p>
        </div>


        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {forgotMsg && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-300">
            <strong>Password Reset Demo:</strong> This is a client-side mini-project. You can sign in directly with any password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors mt-2"
          >
            Sign In to Planner
          </button>
        </form>
      </div>
    </div>
  );
}