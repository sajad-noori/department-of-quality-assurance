const db = require("../config/db");

/**
 * Get all comments for a news article with author info
 * @param {number} newsId
 * @returns {Promise<Array>}
 */
const getCommentsByNewsId = (newsId) => {
  const sql = `
    SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
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
        SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
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

/**
 * Get all replies for a comment with author info
 * @param {number} commentId
 * @returns {Promise<Array>}
 */
const getRepliesByCommentId = (commentId) => {
  const sql = `
    SELECT cr.id, cr.parent_comment_id, cr.user_id, cr.reply_text, cr.created_at, u.name AS author
    FROM comment_replies cr
    LEFT JOIN users u ON cr.user_id = u.id
    WHERE cr.parent_comment_id = ?
    ORDER BY cr.created_at ASC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [commentId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/**
 * Get a comment by ID
 * @param {number} commentId
 * @returns {Promise<Object>} comment object
 */
const getCommentById = (commentId) => {
  const sql = `
    SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [commentId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

/**
 * Add a new reply to a comment
 * @param {number} commentId
 * @param {number} userId
 * @param {string} replyText
 * @returns {Promise<Object>} inserted reply
 */
const addReply = (commentId, userId, replyText) => {
  const sql = `
    INSERT INTO comment_replies (parent_comment_id, user_id, reply_text) VALUES (?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [commentId, userId, replyText], (err, results) => {
      if (err) return reject(err);

      // Update reply count in comments table
      const updateCountSql = `
        UPDATE comments SET reply_count = reply_count + 1 WHERE id = ?
      `;
      db.query(updateCountSql, [commentId], (err2) => {
        if (err2) return reject(err2);

        // Return the inserted reply with created_at fetched
        const insertedId = results.insertId;
        const selectSql = `
          SELECT cr.id, cr.parent_comment_id, cr.user_id, cr.reply_text, cr.created_at, u.name AS author
          FROM comment_replies cr
          LEFT JOIN users u ON cr.user_id = u.id
          WHERE cr.id = ?
        `;
        db.query(selectSql, [insertedId], (err3, res3) => {
          if (err3) return reject(err3);
          resolve(res3[0]);
        });
      });
    });
  });
};

/**
 * Get all comments for all news with author and news info
 * @returns {Promise<Array>}
 */
const getAllNewsComments = () => {
  const sql = `
    SELECT c.id, c.news_id, n.title AS news_title, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN news n ON c.news_id = n.id
    ORDER BY c.created_at DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/**
 * Get all comments by a user that have at least one reply (for notifications)
 * @param {number} userId
 * @returns {Promise<Array>}
 */
const getUserCommentsWithReplies = (userId) => {
  const sql = `
    SELECT c.id, c.news_id, n.title AS news_title, c.user_id, c.comment, c.created_at, c.reply_count, c.reply_seen,
      (SELECT MAX(cr.created_at) FROM comment_replies cr WHERE cr.parent_comment_id = c.id) AS last_reply_at
    FROM comments c
    LEFT JOIN news n ON c.news_id = n.id
    WHERE c.user_id = ? AND c.reply_count > 0
    ORDER BY last_reply_at DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/**
 * Mark a comment's replies as seen
 * @param {number} commentId
 * @returns {Promise<void>}
 */
const markRepliesAsSeen = (commentId) => {
  const sql = `UPDATE comments SET reply_seen = 1 WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [commentId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  getCommentsByNewsId,
  addComment,
  getCommentById,
  getRepliesByCommentId,
  addReply,
  getAllNewsComments,
  getUserCommentsWithReplies,
  markRepliesAsSeen, // <-- add export
};
