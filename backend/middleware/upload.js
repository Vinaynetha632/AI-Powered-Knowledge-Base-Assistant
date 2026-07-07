const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename prefixing current time to avoid name collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${basename}${ext}`);
  }
});

// File filter to restrict uploads to PDF, TXT, and MD formats
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.txt', '.md', '.markdown'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/x-markdown'
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only PDF, TXT, and Markdown (MD) files are allowed.'));
  }
};

// Multer upload middleware instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB upload limit
  fileFilter: fileFilter
});

module.exports = upload;
