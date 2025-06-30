const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const upload = require('../utils/multer'); // ✅ Import multer setup
const { getLatestNews } = require("../controllers/news.controller");
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Public route for getting latest news (no authentication required)
router.get("/news", getLatestNews);

// Protected routes - require authentication and admin role
router.post('/', authenticate, checkRole('admin'), upload.single('image'), newsController.createNews);
router.get('/:id', newsController.getNewsById);
router.put('/:id', authenticate, checkRole('admin'), upload.single('image'), newsController.updateNews);
router.delete('/:id', authenticate, checkRole('admin'), newsController.deleteNews);

// Protected route for getting all news (admin only)
router.get('/', newsController.getAllNews);

module.exports = router;
