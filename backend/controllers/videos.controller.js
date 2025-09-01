const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { promise } = require("../config/db");
const Video = require("../models/video.model");

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
const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, youtubeLink } = req.body;
    const videoFile = req.file;

    // Require title/description/category and at least one source (file or youtubeLink)
    if (!title || !description || !category || (!videoFile && !youtubeLink)) {
      if (videoFile && videoFile.path) {
        fs.unlink(videoFile.path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
      return res
        .status(400)
        .json({ message: "همه فیلدها باید پر شوند یا لینک یوتیوب وارد شود." });
    }

    // Determine video_path: filename when file uploaded, otherwise the provided youtubeLink (stored as-is)
    const videoPath = videoFile ? videoFile.filename : youtubeLink.trim();

    const sql = `INSERT INTO videos (title, description, category, video_path, uploaded_at)
                 VALUES (?, ?, ?, ?, NOW())`;
    const params = [title, description, category, videoPath];

    const [results] = await promise.execute(sql, params);

    res.status(200).json({
      message: "ویدیو با موفقیت ذخیره شد.",
      videoId: results.insertId,
    });
  } catch (error) {
    console.error("Database insert error:", error);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
      });
    }
    res.status(500).json({ message: "خطای سرور" });
  }
};

// Get list of videos
const getVideos = async (req, res) => {
  try {
    const sql = `SELECT id, title, description, category, video_path AS videoPath, uploaded_at FROM videos ORDER BY uploaded_at DESC`;

    const [results] = await promise.execute(sql);

    const baseUrl = "/uploads/videos/";
    const videos = results.map((video) => {
      const raw = video.videoPath || "";
      // If stored value looks like an absolute URL (youtube or http), return as-is
      const isUrl =
        /^(https?:)?\/\//i.test(raw) || /youtube\.com|youtu\.be/i.test(raw);
      return {
        ...video,
        videoUrl: isUrl ? raw : baseUrl + raw,
      };
    });

    res.json(videos);
  } catch (error) {
    console.error("Database fetch error:", error);
    res.status(500).json({ message: "خطا در بارگذاری ویدیوها" });
  }
};

// Delete a video by ID
const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const [results] = await promise.execute(
      "SELECT video_path FROM videos WHERE id = ?",
      [videoId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "ویدیو پیدا نشد." });
    }

    const videoFile = results[0].video_path;

    await promise.execute("DELETE FROM videos WHERE id = ?", [videoId]);

    // If the stored video path looks like a local filename (not a URL), delete the file
    const isUrl =
      /^(https?:)?\/\//i.test(videoFile) ||
      /youtube\.com|youtu\.be/i.test(videoFile);
    if (!isUrl) {
      const filePath = path.join(uploadDir, videoFile);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        }
      });
    }

    res.json({ message: "ویدیو با موفقیت حذف شد." });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

// Update video info and optionally replace video file or switch to a youtube link
const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { title, description, category, youtubeLink } = req.body;

    if (!title || !description || !category) {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
      return res.status(400).json({ message: "همه فیلدها باید پر شوند." });
    }

    const [results] = await promise.execute(
      "SELECT video_path FROM videos WHERE id = ?",
      [videoId]
    );

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

    // If a new file uploaded, use it and delete old file if it was a local file
    if (req.file) {
      newVideoFileName = req.file.filename;
      const isOldUrl =
        /^(https?:)?\/\//i.test(oldVideoFile) ||
        /youtube\.com|youtu\.be/i.test(oldVideoFile);
      if (!isOldUrl) {
        const oldFilePath = path.join(uploadDir, oldVideoFile);
        fs.unlink(oldFilePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Failed to delete old video file:", unlinkErr);
        });
      }
    } else if (youtubeLink) {
      // Switching to a YouTube link: delete old local file if it was stored locally
      newVideoFileName = youtubeLink.trim();
      const isOldUrl =
        /^(https?:)?\/\//i.test(oldVideoFile) ||
        /youtube\.com|youtu\.be/i.test(oldVideoFile);
      if (!isOldUrl) {
        const oldFilePath = path.join(uploadDir, oldVideoFile);
        fs.unlink(oldFilePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Failed to delete old video file:", unlinkErr);
        });
      }
    }

    const sql = `UPDATE videos SET title = ?, description = ?, category = ?, video_path = ? WHERE id = ?`;
    const params = [title, description, category, newVideoFileName, videoId];

    await promise.execute(sql, params);

    res.json({ message: "ویدیو با موفقیت به‌روزرسانی شد." });
  } catch (error) {
    console.error("Database update error:", error);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
      });
    }
    res.status(500).json({ message: "خطای سرور در به‌روزرسانی ویدیو" });
  }
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
