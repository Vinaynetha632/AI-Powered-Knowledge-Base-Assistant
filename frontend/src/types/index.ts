export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DocumentMetadata {
  size: number;
  encoding: string;
  pageCount?: number;
}

export interface Document {
  _id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'md';
  owner: string;
  uploadedAt: string;
  metadata: DocumentMetadata;
  extractedContent?: string;
}

export interface ConversationDocument {
  _id: string;
  title: string;
  fileType: 'pdf' | 'txt' | 'md';
}

export interface Conversation {
  _id: string;
  user: string;
  document: ConversationDocument | null;
  question: string;
  answer: string;
  timestamp: string;
}

export interface DashboardStats {
  totalDocuments: number;
  totalQuestions: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUploads: Document[];
  recentConversations: Conversation[];
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}
