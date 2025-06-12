const db = require('../config/db');

const News = {
  create: (data, callback) => {
    const { title, description, content, author, image_path, is_published } = data;
    const sql = `
      INSERT INTO news (title, description, content, author, image_path, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [title, description, content, author, image_path, is_published], callback);
  },

  getAll: (callback) => {
    db.query("SELECT * FROM news ORDER BY published_date DESC", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM news WHERE id = ?", [id], callback);
  },

  update: (id, data, callback) => {
    const { title, description, content, author, image_path, is_published } = data;
    const sql = `
      UPDATE news SET title=?, description=?, content=?, author=?, image_path=?, is_published=?
      WHERE id=?
    `;
    db.query(sql, [title, description, content, author, image_path, is_published, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM news WHERE id = ?", [id], callback);
  }
};

module.exports = News;
