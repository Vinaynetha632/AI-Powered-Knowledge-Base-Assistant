const express = require('express');
const router = express.Router();

const { signup, login, logout, getMe } = require('../controllers/authController');
const { uploadDocument, getDocuments, getDocumentById, deleteDocument } = require('../controllers/documentController');
const { askQuestion, getHistory } = require('../controllers/chatController');
const { getDashboardStats } = require('../controllers/dashboardController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.get('/documents', protect, getDocuments);
router.post('/documents', protect, upload.single('file'), uploadDocument);
router.get('/documents/:id', protect, getDocumentById);
router.delete('/documents/:id', protect, deleteDocument);

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getHistory);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
