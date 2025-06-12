const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/db'); // Adjust based on your DB config location

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'news-images');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Create news
const createNews = (req, res) => {
  const { title, description, content, author, is_published } = req.body;
  const image_path = req.file ? `/uploads/news-images/${req.file.filename}` : null;
  const published = (is_published === 'true' || is_published === true) ? 1 : 0;

  const query = `
    INSERT INTO news (title, description, content, author, image_path, is_published) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [title, description, content, author, image_path, published], (err, result) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.status(201).json({ message: 'News created successfully', id: result.insertId });
  });
};

// Get all news
const getAllNews = (req, res) => {
  db.query('SELECT * FROM news ORDER BY published_date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single news
const getNewsById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM news WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};


// Update news (with old image deletion if new image is uploaded)
const updateNews = (req, res) => {
  const { id } = req.params;
  const { title, description, content, author, is_published } = req.body;
  const newImagePath = req.file ? `/uploads/news-images/${req.file.filename}` : null;
  const published = (is_published === 'true' || is_published === true) ? 1 : 0;

  // Step 1: Get current image path
  db.query('SELECT image_path FROM news WHERE id = ?', [id], (selectErr, result) => {
    if (selectErr) return res.status(500).json({ error: selectErr });

    const oldImagePath = result[0]?.image_path;

    // Step 2: Update the record
    const query = `
      UPDATE news 
      SET title = ?, description = ?, content = ?, author = ?, image_path = COALESCE(?, image_path), is_published = ?
      WHERE id = ?
    `;

    db.query(query, [title, description, content, author, newImagePath, published, id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr });

      // Step 3: Delete old image if a new one was uploaded
      if (newImagePath && oldImagePath) {
        const fileName = path.basename(oldImagePath);
        const filePath = path.join(__dirname, '..', 'uploads', 'news-images', fileName);

        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr && unlinkErr.code !== 'ENOENT') {
            console.error('Failed to delete old image file:', unlinkErr);
          }
        });
      }

      res.json({ message: 'News updated successfully' });
    });
  });
};


// Delete news
const deleteNews = (req, res) => {
  const { id } = req.params;

  db.query('SELECT image_path FROM news WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }

    const image_path = result[0]?.image_path;

    if (image_path) {
      const fileName = path.basename(image_path);
      const filePath = path.join(__dirname, '..', 'uploads', 'news-images', fileName);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== 'ENOENT') {
          console.error('Failed to delete image file:', unlinkErr);
        }

        db.query('DELETE FROM news WHERE id = ?', [id], (delErr) => {
          if (delErr) {
            console.error('Error deleting news from DB:', delErr);
            return res.status(500).json({ error: 'Failed to delete news' });
          }
          return res.json({ message: 'News and image deleted successfully' });
        });
      });
    } else {
      db.query('DELETE FROM news WHERE id = ?', [id], (delErr) => {
        if (delErr) {
          console.error('Error deleting news from DB:', delErr);
          return res.status(500).json({ error: 'Failed to delete news' });
        }
        return res.json({ message: 'News deleted successfully (no image)' });
      });
    }
  });
};



// Get latest 6 news
const getLatestNews = (req, res) => {
  const query = "SELECT * FROM news ORDER BY id DESC LIMIT 6";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching news:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
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
