const express = require('express');
const router = express.Router();

// Controllers
const { signup, login, logout, getMe } = require('../controllers/authController');
const { uploadDocument, getDocuments, getDocumentById, deleteDocument } = require('../controllers/documentController');
const { askQuestion, getHistory } = require('../controllers/chatController');
const { getDashboardStats } = require('../controllers/dashboardController');

// Middlewares
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ==========================================
// Authentication Endpoints
// ==========================================
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ==========================================
// Document Management Endpoints
// ==========================================
router.get('/documents', protect, getDocuments);
router.post('/documents', protect, upload.single('file'), uploadDocument);
router.get('/documents/:id', protect, getDocumentById);
router.delete('/documents/:id', protect, deleteDocument);

// ==========================================
// AI Question Answering & Chat Endpoints
// ==========================================
router.post('/ask', protect, askQuestion);
router.get('/history', protect, getHistory);

// ==========================================
// Analytics / Dashboard Metrics Endpoints
// ==========================================
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
