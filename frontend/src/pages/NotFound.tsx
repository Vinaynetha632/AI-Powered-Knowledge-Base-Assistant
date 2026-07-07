import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 font-sans space-y-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 shadow-inner animate-bounce">
        <HelpCircle className="w-8 h-8 text-violet-500" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          The link you followed might be broken, or the page may have been removed. Let's get you back on track.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-white shadow-md shadow-violet-500/10 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
