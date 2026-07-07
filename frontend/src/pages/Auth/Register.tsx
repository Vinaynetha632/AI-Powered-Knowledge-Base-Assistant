import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Input Validations
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      showToast('Registration successful! Welcome to the application.', 'success');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Registration failed. Email might be already in use.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl">
        {/* Brand/Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            Get started with your personal AI knowledge assistant
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-800 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name input */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/60 px-4 py-3 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Navigation to Login */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
