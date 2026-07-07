import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { documentService } from '../services/api';
import type { Document } from '../types';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Common/Loader';
import {
  ArrowLeft,
  MessageSquare,
  FileDigit,
  FileCode,
  FileText,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

const DocumentPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await documentService.getById(id);
        if (res.success) {
          setDocument(res.document);
        }
      } catch (err: any) {
        console.error(err);
        showToast(err.response?.data?.message || 'Failed to fetch document content.', 'error');
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id, navigate]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileDigit className="w-8 h-8 text-rose-500" />;
      case 'md':
        return <FileCode className="w-8 h-8 text-blue-500" />;
      default:
        return <FileText className="w-8 h-8 text-emerald-500" />;
    }
  };

  if (loading) {
    return <Loader message="Retrieving text transcript..." size="lg" />;
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Document not found.</p>
        <Link to="/documents" className="text-violet-600 hover:underline mt-4 inline-block">
          Return to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Documents
        </Link>
        <Link
          to={`/chat?docId=${document._id}`}
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask Assistant Questions
        </Link>
      </div>

      {/* Grid Layout: Left Panel Info, Right Panel Extracted Text */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Info panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-800 shadow-inner">
              {getFileIcon(document.fileType)}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate" title={document.title}>
                {document.title}
              </h3>
              <span className="inline-block text-[9px] font-extrabold uppercase text-zinc-400 dark:text-zinc-500 mt-0.5">
                Type: {document.fileType}
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Document Statistics
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Layers className="w-3.5 h-3.5" />
                  File Size
                </span>
                <span>{formatBytes(document.metadata.size)}</span>
              </div>
              {document.metadata.pageCount && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Layers className="w-3.5 h-3.5" />
                    Total Pages
                  </span>
                  <span>{document.metadata.pageCount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Uploaded On
                </span>
                <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 text-center">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-violet-50 dark:bg-violet-950/20 text-[10px] font-bold text-violet-650 dark:text-violet-400 border border-violet-100 dark:border-violet-900/35">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Gemini QA Ready
            </div>
          </div>
        </div>

        {/* Text Transcript panel */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col overflow-hidden h-[500px]">
          <div className="px-5 py-4 border-b border-zinc-150 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/40">
            <h3 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
              Parsed Text Content
            </h3>
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              {document.extractedContent ? `${document.extractedContent.length} characters` : '0 characters'}
            </span>
          </div>
          <div className="flex-1 p-5 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 font-mono text-xs text-zinc-700 dark:text-zinc-350 leading-relaxed whitespace-pre-wrap select-text selection:bg-violet-100 dark:selection:bg-violet-950">
            {document.extractedContent ? (
              document.extractedContent
            ) : (
              <p className="text-zinc-400 italic text-center py-12">
                No text extracted from this file.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
