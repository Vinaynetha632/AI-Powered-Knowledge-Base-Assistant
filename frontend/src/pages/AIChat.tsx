import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { chatService, documentService } from '../services/api';
import type { Document } from '../types';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Common/Loader';
import {
  Sparkles,
  Send,
  Loader2,
  FileDigit,
  FileCode,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const urlDocId = searchParams.get('docId');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  
  const [docsLoading, setDocsLoading] = useState(true);
  const [sending, setSending] = useState(false);


  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setDocsLoading(true);
        const res = await documentService.list();
        if (res.success) {
          setDocuments(res.documents);
          
        
          if (urlDocId && res.documents.some((d: Document) => d._id === urlDocId)) {
            setSelectedDocId(urlDocId);
          } else if (res.documents.length > 0) {
            setSelectedDocId(res.documents[0]._id);
          }
        }
      } catch (err: any) {
        showToast('Could not load documents for chat selection.', 'error');
      } finally {
        setDocsLoading(false);
      }
    };

    loadDocuments();
  }, [urlDocId]);


  useEffect(() => {
    if (!selectedDocId) {
      setSelectedDoc(null);
      setMessages([]);
      return;
    }

    const doc = documents.find((d) => d._id === selectedDocId);
    if (doc) {
      setSelectedDoc(doc);
    
      setMessages([
        {
          sender: 'ai',
          text: `Hi! I'm your AI Knowledge Assistant. I've indexed "${doc.title}". Ask me any questions, and I will answer based strictly on the text in this document.`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedDocId, documents]);

 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDocId) {
      showToast('Please select a document first.', 'warning');
      return;
    }

    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion('');
    
   
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userQuestion, timestamp: new Date() },
    ]);

    setSending(true);
    try {
      const res = await chatService.ask(selectedDocId, userQuestion);
      if (res.success && res.conversation) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: res.conversation.answer, timestamp: new Date() },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to generate answer. Gemini API might be unavailable.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Error: ${errMsg}`,
          timestamp: new Date(),
        },
      ]);
      showToast(errMsg, 'error');
    } finally {
      setSending(false);
    }
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

  if (docsLoading) {
    return <Loader message="Setting up AI playground..." size="lg" />;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col font-sans">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250">
            Select Document Context:
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>No documents available. Upload one to chat!</span>
            <Link to="/upload" className="text-violet-600 hover:underline font-bold ml-2">
              Upload Now
            </Link>
          </div>
        ) : (
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="block w-full sm:w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold text-zinc-900 dark:text-white focus:border-violet-500 focus:outline-none transition-all shadow-inner"
          >
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.title} ({doc.fileType.toUpperCase()})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {selectedDoc && (
          <div className="px-5 py-3 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-650 dark:text-zinc-300 max-w-[300px] truncate">
              {getFileIcon(selectedDoc.fileType)}
              <span className="truncate">{selectedDoc.title}</span>
            </span>
            <Link
              to={`/documents/${selectedDoc._id}`}
              className="text-[10px] font-bold text-violet-605 dark:text-violet-400 hover:underline"
            >
              View Document text
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50 dark:bg-zinc-950 select-text">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
              <HelpCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Knowledge base is empty
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mt-1">
                  Upload a document first, then start chatting with the AI assistant to fetch information.
                </p>
              </div>
              <Link
                to="/upload"
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md transition-colors"
              >
                Upload File
              </Link>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-scale-up`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-violet-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                      }`}
                    >
                      {!isUser && (
                        <span className="text-[9px] font-black uppercase text-violet-555 dark:text-violet-400 flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3" />
                          Assistant
                        </span>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1.5 text-right font-medium ${
                          isUser ? 'text-violet-200' : 'text-zinc-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {sending && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-none p-4 text-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                    <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                      Reading document context & composing answer...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {documents.length > 0 && (
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex gap-3 flex-shrink-0"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
              disabled={sending}
              className="flex-1 rounded-xl border border-zinc-205 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:border-violet-500 focus:outline-none transition-all disabled:opacity-50 shadow-inner"
            />
            <button
              type="submit"
              disabled={sending || !question.trim()}
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 dark:disabled:text-zinc-650 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 disabled:shadow-none transition-all cursor-pointer flex-shrink-0"
              aria-label="Send query"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AIChat;
