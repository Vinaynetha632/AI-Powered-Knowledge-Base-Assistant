import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentService } from '../services/api';
import type { Document } from '../types';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Common/Loader';
import EmptyState from '../components/Common/EmptyState';
import Modal from '../components/Common/Modal';
import {
  FileText,
  FileDigit,
  FileCode,
  Search,
  Trash2,
  Eye,
  MessageSquare,
  UploadCloud,
  Calendar,
  Layers,
} from 'lucide-react';

const Documents: React.FC = () => {
  const { showToast } = useToast();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = async (search?: string) => {
    try {
      setLoading(true);
      const res = await documentService.list(search);
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to retrieve documents.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDocuments(searchTerm);
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDeleteClick = (doc: Document) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;

    setDeleting(true);
    try {
      const res = await documentService.delete(docToDelete._id);
      if (res.success) {
        showToast('Document deleted successfully!', 'success');
        setDocuments((prev) => prev.filter((d) => d._id !== docToDelete._id));
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete document.', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDocToDelete(null);
    }
  };

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
        return <FileDigit className="w-6 h-6 text-rose-500" />;
      case 'md':
        return <FileCode className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-zinc-950 dark:text-white">
            My Knowledge Base
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Manage your parsed documents and prompt them using the AI chat.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Add Document
        </Link>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search documents by title..."
          className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all shadow-sm"
        />
      </div>

      {loading && documents.length === 0 ? (
        <Loader message="Fetching knowledge library..." size="lg" />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={searchTerm ? Search : UploadCloud}
          title={searchTerm ? 'No search results found' : 'Your knowledge base is empty'}
          description={
            searchTerm
              ? 'Try modifying your keywords or check for spelling errors.'
              : 'Upload documents to build your personal knowledge base.'
          }
          actionText={searchTerm ? 'Clear Search' : 'Upload Document'}
          actionPath={searchTerm ? undefined : '/upload'}
          {...(searchTerm ? { actionText: 'Show All Documents', actionPath: undefined } : {})}
          {...(searchTerm
            ? {
                actionText: 'Show All',
                actionPath: '#',
                onClick: (e: any) => {
                  e.preventDefault();
                  setSearchTerm('');
                },
              }
            : {})}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-800/60 shadow-inner">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <span className="inline-flex items-center text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                    {doc.fileType}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white truncate" title={doc.title}>
                    {doc.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {formatBytes(doc.metadata.size)}
                    </span>
                    {doc.metadata.pageCount && doc.metadata.pageCount > 1 && (
                      <span className="flex items-center gap-1">
                        Pages: {doc.metadata.pageCount}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                <Link
                  to={`/chat?docId=${doc._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask AI
                </Link>
                <Link
                  to={`/documents/${doc._id}`}
                  className="inline-flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors cursor-pointer"
                  title="Preview document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDeleteClick(doc)}
                  className="inline-flex items-center justify-center p-2 text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-100 dark:border-rose-900/35 rounded-lg transition-colors cursor-pointer"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        confirmBtnStyle="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white disabled:opacity-50"
      >
        <div className="space-y-2">
          <p>
            Are you sure you want to delete <strong className="text-zinc-900 dark:text-white">"{docToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-450 font-bold bg-rose-50 dark:bg-rose-950/10 p-2.5 rounded-lg">
            WARNING: This action is permanent. It will delete the physical file, its metadata, and all associated chat logs.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Documents;
