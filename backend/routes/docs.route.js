const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Controller functions (you need to have these implemented)
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  updateDocumentWithFile,
  getDocumentsByType,
} = require("../controllers/docs.controller");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
  "application/x-msdownload",
  "application/x-ole-storage",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error("فقط فایل‌های PDF، Word و Excel مجاز هستند."));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow one file at a time
  }
});

// Error handling middleware for multer file validation
function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.message === "فقط فایل‌های PDF، Word و Excel مجاز هستند.") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد." });
    }
    // You can add other multer error checks here if needed
    return res.status(500).json({ error: "خطایی در آپلود فایل رخ داد." });
  }
  next();
}

// Routes with security middlewares
router.post("/", [authenticate, authLimiter], (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return multerErrorHandler(err, req, res, next);
    uploadDocument(req, res, next);
  });
});

router.put("/:id", [authenticate, authLimiter], (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return multerErrorHandler(err, req, res, next);
    updateDocumentWithFile(req, res, next);
  });
});

// Public routes
router.get("/", getDocuments);
router.get("/documents", getDocumentsByType);

// Protected routes
router.delete("/:id", [authenticate, authLimiter], deleteDocument);

module.exports = router;
