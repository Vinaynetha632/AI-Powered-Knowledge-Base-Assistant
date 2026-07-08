import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full sm:w-auto">
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800';
          let textColor = 'text-zinc-800 dark:text-zinc-100';
          let Icon = Info;
          let iconColor = 'text-blue-500';

          switch (toast.type) {
            case 'success':
              bgColor = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50';
              textColor = 'text-emerald-800 dark:text-emerald-200';
              Icon = CheckCircle;
              iconColor = 'text-emerald-500';
              break;
            case 'error':
              bgColor = 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50';
              textColor = 'text-rose-800 dark:text-rose-200';
              Icon = AlertCircle;
              iconColor = 'text-rose-500';
              break;
            case 'warning':
              bgColor = 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
              textColor = 'text-amber-800 dark:text-amber-200';
              Icon = AlertTriangle;
              iconColor = 'text-amber-500';
              break;
            case 'info':
              bgColor = 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50';
              textColor = 'text-blue-800 dark:text-blue-200';
              Icon = Info;
              iconColor = 'text-blue-500';
              break;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in ${bgColor} ${textColor}`}
              role="alert"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium pr-2 leading-tight">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
