const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller");
const { upload } = require("../utils/multer"); // ✅ Import multer setup
const { authenticate, checkRole } = require("../middleware/auth.middleware"); // Import auth middlewares
const { getLatestNews } = require("../controllers/news.controller");

// Secure dashboard/admin routes
router.post(
  "/",
  authenticate,
  checkRole("admin"),
  upload.single("image"),
  newsController.createNews
);
router.get("/:id", newsController.getNewsById);
router.put(
  "/:id",
  authenticate,
  checkRole("admin"),
  upload.single("image"),
  newsController.updateNews
);
router.delete(
  "/:id",
  authenticate,
  checkRole("admin"),
  newsController.deleteNews
);

router.get("/", newsController.getAllNews);

// this is the public route which takes 6 latest news
router.get("/news", getLatestNews);

module.exports = router;
