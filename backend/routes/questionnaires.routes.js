const express = require('express');
const router = express.Router();
const QuestionnairesController = require('../controllers/questionnaires.controller');
const { verifyToken } = require('../middleware/verifyToken');
const { checkRole } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const { uploadFilledQuestionnaire } = require('../utils/multer');

// Set storage for questionnaire files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/questionnaires'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    const mime = allowedTypes.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word files are allowed'));
    }
  }
});

router.use(verifyToken);

// POST /api/questionnaires (admin only)
router.post('/', checkRole('admin'), upload.single('file'), QuestionnairesController.createQuestionnaire);

// GET /api/questionnaires
router.get('/', QuestionnairesController.getAllQuestionnaires);

// DELETE /api/questionnaires/:id (admin only)
router.delete('/:id', checkRole('admin'), QuestionnairesController.deleteQuestionnaire);

// PUT /api/questionnaires/:id (admin only)
router.put('/:id', checkRole('admin'), upload.single('file'), QuestionnairesController.updateQuestionnaire);

// POST /api/questionnaires/filled (user uploads filled questionnaire)
router.post('/filled', verifyToken, uploadFilledQuestionnaire.single('file'), QuestionnairesController.uploadFilledQuestionnaire);

module.exports = router; 