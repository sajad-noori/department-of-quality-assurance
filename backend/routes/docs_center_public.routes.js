const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authenticate } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { logDownload } = require("../middleware/logging.middleware");
const { promise } = require("../config/db");

// Controller functions
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  updateDocumentWithFile,
  getDocumentsByType,
} = require("../controllers/docs_center_public.controller");

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
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1, // Only allow one file at a time
  },
});

// Error handling middleware for multer file validation
function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.message === "فقط فایل‌های PDF، Word و Excel مجاز هستند.") {
      return res.status(400).json({ error: "فرمت فایل پشتیبانی نمی‌شود." });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "حجم فایل نباید بیشتر از ۱۰۰ مگابایت باشد." });
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

// Download route with logging
router.get(
  "/download/:filename",
  [authenticate, logDownload()],
  async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "..", "uploads", "files", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "فایل یافت نشد" });
      }

      // Get file info for logging and proper download name
      const [results] = await promise.execute(
        "SELECT name, category, fileName FROM docs_center_and_uploads WHERE fileName = ?",
        [filename]
      );

      if (results.length === 0) {
        return res.status(404).json({ message: "فایل یافت نشد" });
      }

      const documentName = results[0].name;
      const category = results[0].category;
      const originalExt = path.extname(documentName) || path.extname(filename);
      const safeName = `${documentName}${originalExt}`;

      // Set the filename for the logging middleware
      req.params.filename = filename;
      req.documentInfo = { name: documentName, category };

      // Detect MIME type
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const mimeType = mimeTypes[ext] || "application/octet-stream";

      // Set headers to force proper download
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(safeName)}"`
      );

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error in download route:", error);
      res.status(500).json({ message: "خطا در دانلود فایل" });
    }
  }
);

module.exports = router;
