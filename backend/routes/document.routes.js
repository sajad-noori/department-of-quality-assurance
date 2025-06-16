const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticate, checkRole } = require("../middleware/auth.middleware");
const documentController = require("../controllers/document.controller");
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/documents';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload document
router.post("/upload", 
  authenticate, 
  checkRole("institute"), 
  upload.single('file'), 
  documentController.uploadDocument
);

// Get all documents for current user
router.get("/", 
  authenticate, 
  checkRole("institute"), 
  documentController.getDocuments
);

// Delete document
router.delete("/:id", 
  authenticate, 
  checkRole("institute"), 
  documentController.deleteDocument
);

module.exports = router; 