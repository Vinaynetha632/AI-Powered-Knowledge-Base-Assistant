import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  MessageSquare,
  History,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Document', path: '/upload', icon: UploadCloud },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Chat History', path: '/history', icon: History },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return 'Dashboard';
    const match = menuItems.find((item) => item.path === currentPath);
    if (match) return match.name;
    if (currentPath.startsWith('/documents/')) return 'Document Preview';
    return 'Knowledge Assistant';
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden">

      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
              KnowledgeBase
            </h1>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wider uppercase">
              AI Assistant
            </span>
          </div>
        </div>

       
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 shadow-sm border border-violet-100/50 dark:border-violet-900/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

    
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {user?.name || 'User'}
              </h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-zinc-400" />
            Logout
          </button>
        </div>
      </aside>

      
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
       
          <div
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

        
          <div className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 animate-slide-in-left">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

       
            <div className="flex items-center gap-2 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600 text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                  KnowledgeBase
                </h1>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wider uppercase">
                  AI Assistant
                </span>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </h2>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-zinc-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
=
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/60 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Welcome, <span className="text-zinc-800 dark:text-zinc-200 font-bold">{user?.name}</span>
            </span>
            <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase shadow-inner">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
