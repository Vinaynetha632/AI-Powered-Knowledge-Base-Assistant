import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard & Document Pages
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import Documents from './pages/Documents';
import DocumentPreview from './pages/DocumentPreview';

// Chat & History Pages
import AIChat from './pages/AIChat';
import ConversationHistory from './pages/ConversationHistory';

// Fallback Page
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
        
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              <Route path="upload" element={<UploadDocument />} />

              <Route path="documents" element={<Documents />} />
              <Route path="documents/:id" element={<DocumentPreview />} />

              <Route path="chat" element={<AIChat />} />

              <Route path="history" element={<ConversationHistory />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
