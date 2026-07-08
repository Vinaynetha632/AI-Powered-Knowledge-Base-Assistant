import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/api';
import type { Conversation } from '../types';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import {
  MessageSquare,
  Search,
  Calendar,
  ExternalLink,
  FileDigit,
  FileCode,
  FileText,
} from 'lucide-react';

const ConversationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async (search?: string) => {
    try {
      setLoading(true);
      const res = await chatService.getHistory(search);
      if (res.success) {
        setHistory(res.history);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to fetch conversation history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHistory(searchTerm);
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-4 h-4 text-zinc-400" />;
    switch (fileType) {
      case 'pdf':
        return <FileDigit className="w-4 h-4 text-rose-500" />;
      case 'md':
        return <FileCode className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-zinc-950 dark:text-white">
          Conversation Logs
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Review your previous questions and AI responses across all documents.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search within question contents, answers, or document titles..."
          className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all shadow-sm"
        />
      </div>

      {loading && history.length === 0 ? (
        <Loader message="Gathering question archives..." size="lg" />
      ) : history.length === 0 ? (
        <EmptyState
          icon={searchTerm ? Search : MessageSquare}
          title={searchTerm ? 'No results found' : 'No history found'}
          description={
            searchTerm
              ? 'Try adjusting your search terms or view your full logs list.'
              : 'Ask questions on your documents to generate QA history.'
          }
          actionText={searchTerm ? 'Clear Filter' : 'Go to Chat'}
          actionPath={searchTerm ? undefined : '/chat'}
          {...(searchTerm
            ? {
                actionText: 'Show All History',
                actionPath: '#',
                onClick: (e: any) => {
                  e.preventDefault();
                  setSearchTerm('');
                },
              }
            : {})}
        />
      ) : (
        <div className="space-y-5">
          {history.map((conv) => (
            <div
              key={conv._id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/65 text-xs font-bold text-zinc-650 dark:text-zinc-350 max-w-[320px] sm:max-w-xs md:max-w-md truncate">
                  {getFileIcon(conv.document?.fileType)}
                  <span className="truncate">{conv.document?.title || 'Deleted Document'}</span>
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold flex items-center gap-1.5 sm:self-center">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(conv.timestamp)}
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Question Asked
                  </h4>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-normal pl-3.5 border-l-2 border-violet-500">
                    {conv.question}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-zinc-450 dark:text-zinc-500 tracking-wider">
                    AI Answer Response
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-3.5 border-l-2 border-emerald-500 whitespace-pre-wrap select-text">
                    {conv.answer}
                  </p>
                </div>
              </div>

              {conv.document && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => navigate(`/chat?docId=${conv.document?._id}`)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                  >
                    Open Document Chat
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
