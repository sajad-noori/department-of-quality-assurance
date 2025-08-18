const multer = require("multer");
const path = require("path");

// Set storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/news-images"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max file size 5MB
});

// Multer for filled questionnaires (PDF, DOC, DOCX)
const filledQuestionnaireStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/questionnaires");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const filledQuestionnaireFileFilter = (req, file, cb) => {
  const allowedExt = /\.pdf$|\.doc$|\.docx$/i;
  const extOk = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = /pdf|msword|officedocument/.test(
    String(file.mimetype).toLowerCase()
  );
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word files are allowed"));
  }
};

const uploadFilledQuestionnaire = multer({
  storage: filledQuestionnaireStorage,
  fileFilter: filledQuestionnaireFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  upload,
  uploadFilledQuestionnaire,
};
