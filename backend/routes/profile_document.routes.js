const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate, checkRole } = require('../middleware/auth.middleware');
const profileDocumentController = require('../controllers/profile_document.controller');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/temp'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Try to get document_type from body or query
    let docType = req.body && req.body.document_type;
    if (!docType && req.query && req.query.document_type) {
      docType = req.query.document_type;
    }
    let index = -1;
    if (docType) {
      const match = docType.match(/doc(\d+)_path/);
      if (match) index = parseInt(match[1], 10) - 1;
    }
    if (index >= 3) {
      if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
        cb(null, true);
      } else {
        cb(new Error('Only zip files are allowed for this field.'));
      }
    } else {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images, PDFs, Word and Excel files are allowed.'));
      }
    }
  }
});

// Ensure temp directory exists
const fs = require('fs');
const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Routes
router.post('/upload', authenticate, upload.single('file'), profileDocumentController.upload);
router.get('/', authenticate, profileDocumentController.getDocuments);
router.get('/user/:userId', authenticate, checkRole(['admin', 'employee']), profileDocumentController.getDocumentsByUserIdForAdmin);
router.get('/download/:folder/:subfolder/:filename', authenticate, checkRole(['admin', 'employee']), profileDocumentController.downloadDocument);
router.delete('/:id', authenticate, profileDocumentController.deleteDocument);

module.exports = router; 