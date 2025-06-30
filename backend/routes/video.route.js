const express = require("express");
const router = express.Router();
const { upload, uploadVideo, getVideos, updateVideo, deleteVideo, addComment, getComments } = require("../controllers/videos.controller");

// Only admin can upload, update, and delete videos
router.post("/video",(req, res) => {
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
router.put('/video/:id', updateVideo);
router.delete('/video/:id', deleteVideo);

router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

module.exports = router;
