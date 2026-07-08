import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import type { DashboardData } from '../types';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import {
  FileText,
  MessageSquare,
  UploadCloud,
  FileCode,
  FileDigit,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to fetch dashboard statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileDigit className="w-5 h-5 text-rose-500" />;
      case 'md':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-500" />;
    }
  };

  if (loading) {
    return <Loader message="Compiling analytics..." size="lg" />;
  }

  const stats = data?.stats || { totalDocuments: 0, totalQuestions: 0 };
  const recentUploads = data?.recentUploads || [];
  const recentConversations = data?.recentConversations || [];

  return (
    <div className="space-y-8 font-sans">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-6 md:p-8 shadow-lg border border-zinc-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-violet-600/20 blur-2xl"></div>
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400">
            <Sparkles className="w-3.5 h-3.5" />
            AI assistant ready
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
            AI-Powered Knowledge Base
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Upload PDF, Markdown, or Plain Text files. Ask questions and get answers extracted strictly from your documents using Google Gemini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Documents
            </span>
            <h3 className="text-3xl font-black text-zinc-950 dark:text-white">
              {stats.totalDocuments}
            </h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Questions Asked
            </span>
            <h3 className="text-3xl font-black text-zinc-950 dark:text-white">
              {stats.totalQuestions}
            </h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              Recent Uploads
            </h3>
            {recentUploads.length > 0 && (
              <Link
                to="/documents"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentUploads.length === 0 ? (
            <EmptyState
              icon={UploadCloud}
              title="No documents uploaded yet"
              description="To get started, upload your first document in PDF, TXT, or Markdown format."
              actionText="Upload Document"
              actionPath="/upload"
            />
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {recentUploads.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-150 dark:border-zinc-800">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/documents/${doc._id}`}
                        className="text-xs font-bold text-zinc-900 dark:text-white truncate block hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
                      >
                        {doc.title}
                      </Link>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(doc.uploadedAt)}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/chat?docId=${doc._id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm shadow-violet-500/10 transition-colors"
                  >
                    Ask AI
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Recent Conversations
            </h3>
            {recentConversations.length > 0 && (
              <Link
                to="/history"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentConversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No chats recorded"
              description="Start a new chat conversation with any of your uploaded files to get answers."
              actionText="Go to AI Chat"
              actionPath="/chat"
            />
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {recentConversations.map((conv) => (
                <div
                  key={conv._id}
                  className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/60 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
                      {getFileIcon(conv.document?.fileType || 'txt')}
                      <span className="truncate">{conv.document?.title || 'Deleted Document'}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(conv.timestamp)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-normal line-clamp-1">
                      Q: {conv.question}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2 pl-3 border-l-2 border-zinc-200 dark:border-zinc-800">
                      A: {conv.answer}
                    </p>
                  </div>
                  <div className="flex justify-end pt-0.5">
                    <button
                      onClick={() => navigate(`/chat?docId=${conv.document?._id || ''}`)}
                      disabled={!conv.document}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline disabled:text-zinc-300 dark:disabled:text-zinc-700 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                    >
                      Continue Conversation
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
