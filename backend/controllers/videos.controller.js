const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const Video = require('../models/video.model');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage }).single("video");

// Upload new video
const uploadVideo = (req, res) => {
  const { title, description, category } = req.body;
  const videoFile = req.file;

  if (!title || !description || !category || !videoFile) {
    if (videoFile && videoFile.path) {
      fs.unlink(videoFile.path, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }
    return res.status(400).json({ message: "همه فیلدها باید پر شوند." });
  }

  const sql = `INSERT INTO videos (title, description, category, video_path, uploaded_at)
               VALUES (?, ?, ?, ?, NOW())`;
  const params = [title, description, category, videoFile.filename];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database insert error:", err);
      if (videoFile && videoFile.path) {
        fs.unlink(videoFile.path, (unlinkErr) => {
          if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
        });
      }
      return res.status(500).json({ message: "خطای سرور" });
    }

    res.status(200).json({
      message: "ویدیو با موفقیت ذخیره شد.",
      videoId: results.insertId,
    });
  });
};

// Get list of videos
const getVideos = (req, res) => {
  const sql = `SELECT id, title, description, category, video_path AS videoUrl, uploaded_at FROM videos ORDER BY uploaded_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({ message: "خطا در بارگذاری ویدیوها" });
    }

    const baseUrl = "/uploads/videos/";
    const videos = results.map((video) => ({
      ...video,
      videoUrl: baseUrl + video.videoUrl,
    }));

    res.json(videos);
  });
};

// Delete a video by ID
const deleteVideo = (req, res) => {
  const videoId = req.params.id;

  db.query("SELECT video_path FROM videos WHERE id = ?", [videoId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "خطای سرور" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "ویدیو پیدا نشد." });
    }

    const videoFile = results[0].video_path;
    const filePath = path.join(uploadDir, videoFile);

    db.query("DELETE FROM videos WHERE id = ?", [videoId], (err2) => {
      if (err2) {
        console.error("Database delete error:", err2);
        return res.status(500).json({ message: "خطای سرور در حذف ویدیو" });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }

        res.json({ message: "ویدیو با موفقیت حذف شد." });
      });
    });
  });
};

// Update video info and optionally replace video file
const updateVideo = (req, res) => {
  const videoId = req.params.id;
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }
    return res.status(400).json({ message: "همه فیلدها باید پر شوند." });
  }

  db.query("SELECT video_path FROM videos WHERE id = ?", [videoId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err2) => {
          if (err2) console.error("Failed to delete file:", err2);
        });
      }
      return res.status(500).json({ message: "خطای سرور" });
    }

    if (results.length === 0) {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err2) => {
          if (err2) console.error("Failed to delete file:", err2);
        });
      }
      return res.status(404).json({ message: "ویدیو پیدا نشد." });
    }

    const oldVideoFile = results[0].video_path;
    let newVideoFileName = oldVideoFile;

    if (req.file) {
      newVideoFileName = req.file.filename;
      const oldFilePath = path.join(uploadDir, oldVideoFile);
      fs.unlink(oldFilePath, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete old video file:", unlinkErr);
      });
    }

    const sql = `UPDATE videos SET title = ?, description = ?, category = ?, video_path = ? WHERE id = ?`;
    const params = [title, description, category, newVideoFileName, videoId];

    db.query(sql, params, (updateErr) => {
      if (updateErr) {
        console.error("Database update error:", updateErr);
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
          });
        }
        return res.status(500).json({ message: "خطای سرور در به‌روزرسانی ویدیو" });
      }

      res.json({ message: "ویدیو با موفقیت به‌روزرسانی شد." });
    });
  });
};

// Add comment
const addComment = (req, res) => {
  const videoId = req.params.id;
  const { userId, comment } = req.body;

  if (!videoId || !userId || !comment) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  Video.addComment(videoId, userId, comment, (err, result) => {
    if (err) {
      console.error("Error saving comment:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(201).json(result);
  });
};

// Get comments
const getComments = (req, res) => {
  const videoId = req.params.id;

  if (!videoId) {
    return res.status(400).json({ message: "Missing video ID" });
  }

  Video.getCommentsByVideoId(videoId, (err, comments) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(comments);
  });
};

// Export only relevant functions
module.exports = {
  upload,
  uploadVideo,
  getVideos,
  deleteVideo,
  updateVideo,
  addComment,
  getComments,
};
