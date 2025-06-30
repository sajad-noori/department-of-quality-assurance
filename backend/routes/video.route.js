const express = require("express");
const router = express.Router();
const { upload, uploadVideo, getVideos, updateVideo, deleteVideo, addComment, getComments } = require("../controllers/videos.controller");
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Only admin can upload, update, and delete videos
router.post("/video", authenticate, checkRole('admin'), (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "خطا در آپلود فایل" });
    }
    uploadVideo(req, res);
  });
});

router.get('/videos', getVideos);

// Only admin can update and delete videos
router.put('/video/:id', authenticate, checkRole('admin'), upload, updateVideo);
router.delete('/video/:id', authenticate, checkRole('admin'), deleteVideo);

router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

module.exports = router;
