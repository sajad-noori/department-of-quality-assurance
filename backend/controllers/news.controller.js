const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { promise } = require("../config/db");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads", "news-images");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Create news
const createNews = async (req, res) => {
  try {
    const { title, description, content, author, is_published } = req.body;
    const image_path = req.file
      ? `/uploads/news-images/${req.file.filename}`
      : null;
    const published = is_published === "true" || is_published === true ? 1 : 0;

    const query = `
      INSERT INTO news (title, description, content, author, image_path, is_published) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await promise.execute(query, [
      title,
      description,
      content,
      author,
      image_path,
      published,
    ]);
    res
      .status(201)
      .json({ message: "News created successfully", id: result.insertId });
  } catch (error) {
    console.error("DB insert error:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
};

// Get all news
const getAllNews = async (req, res) => {
  try {
    const [results] = await promise.execute(
      "SELECT * FROM news ORDER BY published_date DESC"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Get single news
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await promise.execute("SELECT * FROM news WHERE id = ?", [
      id,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};

// Update news (with old image deletion if new image is uploaded)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, author, is_published } = req.body;
    const newImagePath = req.file
      ? `/uploads/news-images/${req.file.filename}`
      : null;
    const published = is_published === "true" || is_published === true ? 1 : 0;

    // Step 1: Get current image path
    const [currentResult] = await promise.execute(
      "SELECT image_path FROM news WHERE id = ?",
      [id]
    );

    if (currentResult.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    const oldImagePath = currentResult[0]?.image_path;

    // Step 2: Update the record
    const query = `
      UPDATE news 
      SET title = ?, description = ?, content = ?, author = ?, image_path = COALESCE(?, image_path), is_published = ?
      WHERE id = ?
    `;

    await promise.execute(query, [
      title,
      description,
      content,
      author,
      newImagePath,
      published,
      id,
    ]);

    // Step 3: Delete old image if a new one was uploaded
    if (newImagePath && oldImagePath) {
      const fileName = path.basename(oldImagePath);
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "news-images",
        fileName
      );

      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        if (unlinkErr.code !== "ENOENT") {
          console.error("Failed to delete old image file:", unlinkErr);
        }
      }
    }

    res.json({ message: "News updated successfully" });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ error: "Database update failed" });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the news item first
    const [result] = await promise.execute(
      "SELECT image_path FROM news WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "News item not found" });
    }

    const image_path = result[0]?.image_path;

    // Delete from database first
    await promise.execute("DELETE FROM news WHERE id = ?", [id]);

    // Then delete the image file if it exists
    if (image_path) {
      const fileName = path.basename(image_path);
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "news-images",
        fileName
      );

      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        if (unlinkErr.code !== "ENOENT") {
          console.error("Failed to delete image file:", unlinkErr);
        }
      }

      res.json({ message: "News and image deleted successfully" });
    } else {
      res.json({ message: "News deleted successfully (no image)" });
    }
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Failed to delete news" });
  }
};

// Get latest 6 news
const getLatestNews = async (req, res) => {
  try {
    const query = "SELECT * FROM news ORDER BY id DESC LIMIT 6";
    const [results] = await promise.execute(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching latest news:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  upload,
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getLatestNews,
};
