const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

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

const upload = multer({ storage, fileFilter });

// Error handling middleware for multer file validation
function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.message === "فقط فایل‌های PDF، Word و Excel مجاز هستند.") {
      return res.status(400).json({ error: err.message });
    }
    // You can add other multer error checks here if needed
    return res.status(500).json({ error: "خطایی در آپلود فایل رخ داد." });
  }
  next();
}

// Routes with multer + error handler middleware to catch file validation errors
router.post("/", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return multerErrorHandler(err, req, res, next);
    uploadDocument(req, res, next);
  });
});

router.put("/:id", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return multerErrorHandler(err, req, res, next);
    updateDocumentWithFile(req, res, next);
  });
});

router.get("/", getDocuments);
router.delete("/:id", deleteDocument);
router.get("/documents", getDocumentsByType);


module.exports = router;
