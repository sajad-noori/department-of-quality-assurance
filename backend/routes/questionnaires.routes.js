const express = require("express");
const router = express.Router();
const QuestionnairesController = require("../controllers/questionnaires.controller");
const { authenticate, checkRole } = require("../middleware/auth.middleware");
const { questionnaireLimiter } = require("../middleware/rateLimiter");
const multer = require("multer");
const path = require("path");
const { uploadFilledQuestionnaire } = require("../utils/multer");

// Set storage for questionnaire files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/questionnaires"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.pdf$|\.doc$|\.docx$|\.xls$|\.xlsx$/i;
    const extOk = allowedExt.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = /pdf|msword|officedocument|excel|spreadsheet/.test(
      file.mimetype.toLowerCase()
    );
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word, and Excel files are allowed"));
    }
  },
});

// Note: don't apply auth globally here. Protect only the routes that need it.

// POST /api/questionnaires (admin only)
router.post(
  "/",
  authenticate,
  checkRole("admin"),
  upload.single("file"),
  QuestionnairesController.createQuestionnaire
);

// GET /api/questionnaires (public)
router.get("/", QuestionnairesController.getAllQuestionnaires);

// DELETE /api/questionnaires/:id (admin only)
router.delete(
  "/:id",
  authenticate,
  checkRole("admin"),
  QuestionnairesController.deleteQuestionnaire
);

// PUT /api/questionnaires/:id (admin only)
router.put(
  "/:id",
  authenticate,
  checkRole("admin"),
  upload.single("file"),
  QuestionnairesController.updateQuestionnaire
);

// POST /api/questionnaires/filled (user uploads filled questionnaire)
router.post(
  "/filled",
  authenticate,
  uploadFilledQuestionnaire.single("file"),
  QuestionnairesController.uploadFilledQuestionnaire
);

// GET /api/questionnaires/:id/filled (get all filled questionnaires for a questionnaire)
router.get(
  "/:id/filled",
  authenticate,
  checkRole("employee"),
  QuestionnairesController.getFilledQuestionnaires
);

// GET /api/questionnaires/filled/user (get all filled questionnaires for the current user)
router.get(
  "/filled/user",
  authenticate,
  QuestionnairesController.getFilledQuestionnairesForUser
);

// PATCH /api/questionnaires/filled/:id/check (mark a filled questionnaire as checked)
router.patch(
  "/filled/:id/check",
  authenticate,
  checkRole("employee"),
  QuestionnairesController.checkFilledQuestionnaire
);

// GET /api/questionnaires/:id/filled/unchecked-count (get count of unchecked filled questionnaires)
router.get(
  "/:id/filled/unchecked-count",
  questionnaireLimiter,
  authenticate,
  checkRole("employee"),
  QuestionnairesController.getUncheckedFilledCount
);

// GET /api/questionnaires/filled/total-unchecked-count (get total count of unchecked filled questionnaires)
router.get(
  "/filled/total-unchecked-count",
  questionnaireLimiter,
  authenticate,
  checkRole("employee"),
  QuestionnairesController.getTotalUncheckedFilledCount
);

module.exports = router;
