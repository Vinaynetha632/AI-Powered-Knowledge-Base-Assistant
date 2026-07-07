import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  FileDigit,
  FileCode,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const UploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const allowedExtensions = ['.pdf', '.txt', '.md', '.markdown'];

  const validateFile = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return 'Unsupported file format. Please upload PDF, TXT, or MD files.';
    }
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return 'File size is too large. Maximum allowed size is 10MB.';
    }
    return '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        showToast(validationError, 'error');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        showToast(validationError, 'error');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    try {
      const res = await documentService.upload(selectedFile);
      if (res.success && res.document) {
        showToast('Document uploaded and text content extracted successfully!', 'success');
        // Redirect to AI Chat with pre-selected document
        navigate(`/chat?docId=${res.document._id}`);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to upload document.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setUploading(false);
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    if (ext === '.pdf') {
      return <FileDigit className="w-10 h-10 text-rose-500" />;
    } else if (ext === '.md' || ext === '.markdown') {
      return <FileCode className="w-10 h-10 text-blue-500" />;
    } else {
      return <FileText className="w-10 h-10 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Description header */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-zinc-950 dark:text-white">
          Upload Knowledge File
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Upload your document to parse the text. Once uploaded, you can ask the AI assistant questions about the contents.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        {!selectedFile && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-violet-500 bg-violet-50/40 dark:bg-violet-950/10'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.md,.markdown"
              className="hidden"
            />
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 mb-4 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
              Drag & drop your file here, or{' '}
              <span className="text-violet-600 dark:text-violet-400 hover:underline">browse</span>
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              Supports PDF, TXT, or MD files (Max 10MB)
            </p>
          </div>
        )}

        {/* Selected file preview */}
        {selectedFile && (
          <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-800 shadow-sm flex-shrink-0">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                  Size: {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setError('');
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline px-2.5 py-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              >
                Change
              </button>
            )}
          </div>
        )}

        {/* Action Button */}
        {selectedFile && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/60 font-semibold text-white shadow-md shadow-violet-500/10 transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading & Parsing Text...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Proceed to Assistant
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
