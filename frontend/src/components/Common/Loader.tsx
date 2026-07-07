import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} text-violet-600 animate-spin`} />
      {message && (
        <p className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
