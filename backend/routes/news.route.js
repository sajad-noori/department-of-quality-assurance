const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const upload = require('../utils/multer'); // ✅ Import multer setup
const { getLatestNews } = require("../controllers/news.controller");

router.post('/', upload.single('image'), newsController.createNews);
router.get('/:id', newsController.getNewsById);
router.put('/:id', upload.single('image'), newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

router.get('/', newsController.getAllNews);

// this is the public route which takes 6 latest news
router.get("/news", getLatestNews);

module.exports = router;
