import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionPath,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 mb-4">
        <Icon className="w-6 h-6 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionPath && (
        <Link
          to={actionPath}
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 rounded-xl transition-all duration-200"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
