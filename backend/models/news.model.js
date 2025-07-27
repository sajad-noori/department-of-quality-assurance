const { promise } = require("../config/db");

const News = {
  create: async (data) => {
    try {
      const { title, description, content, author, image_path, is_published } =
        data;
      const sql = `
        INSERT INTO news (title, description, content, author, image_path, is_published)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await promise.execute(sql, [
        title,
        description,
        content,
        author,
        image_path,
        is_published,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating news: ${error.message}`);
    }
  },

  getAll: async () => {
    try {
      const [results] = await promise.execute(
        "SELECT * FROM news ORDER BY published_date DESC"
      );
      return results;
    } catch (error) {
      throw new Error(`Error fetching all news: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const [results] = await promise.execute(
        "SELECT * FROM news WHERE id = ?",
        [id]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error fetching news by ID: ${error.message}`);
    }
  },

  update: async (id, data) => {
    try {
      const { title, description, content, author, image_path, is_published } =
        data;
      const sql = `
        UPDATE news SET title=?, description=?, content=?, author=?, image_path=?, is_published=?
        WHERE id=?
      `;
      const [result] = await promise.execute(sql, [
        title,
        description,
        content,
        author,
        image_path,
        is_published,
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating news: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      const [result] = await promise.execute("DELETE FROM news WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting news: ${error.message}`);
    }
  },
};

module.exports = News;
