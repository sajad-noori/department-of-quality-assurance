const db = require('../config/db');

/**
 * Get all comments for a news article with author info
 * @param {number} newsId
 * @returns {Promise<Array>}
 */
const getCommentsByNewsId = (newsId) => {
  const sql = `
    SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.news_id = ?
    ORDER BY c.created_at ASC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [newsId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/**
 * Add a new comment
 * @param {number} newsId
 * @param {number} userId
 * @param {string} comment
 * @returns {Promise<Object>} inserted comment
 */
const addComment = (newsId, userId, comment) => {
  const sql = `
    INSERT INTO comments (news_id, user_id, comment) VALUES (?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [newsId, userId, comment], (err, results) => {
      if (err) return reject(err);
      // Return the inserted comment with created_at fetched
      const insertedId = results.insertId;
      const selectSql = `
        SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, u.name AS author
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `;
      db.query(selectSql, [insertedId], (err2, res2) => {
        if (err2) return reject(err2);
        resolve(res2[0]);
      });
    });
  });
};

module.exports = {
  getCommentsByNewsId,
  addComment,
};
