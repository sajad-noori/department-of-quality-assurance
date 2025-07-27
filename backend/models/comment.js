const { promise } = require("../config/db");

/**
 * Get all comments for a news article with author info
 * @param {number} newsId
 * @returns {Promise<Array>}
 */
const getCommentsByNewsId = async (newsId) => {
  const sql = `
    SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.news_id = ?
    ORDER BY c.created_at ASC
  `;
  try {
    const [results] = await promise.execute(sql, [newsId]);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Add a new comment
 * @param {number} newsId
 * @param {number} userId
 * @param {string} comment
 * @returns {Promise<Object>} inserted comment
 */
const addComment = async (newsId, userId, comment) => {
  const sql = `
    INSERT INTO comments (news_id, user_id, comment) VALUES (?, ?, ?)
  `;
  try {
    const [results] = await promise.execute(sql, [newsId, userId, comment]);
    // Return the inserted comment with created_at fetched
    const insertedId = results.insertId;
    const selectSql = `
      SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const [res2] = await promise.execute(selectSql, [insertedId]);
    return res2[0];
  } catch (err) {
    throw err;
  }
};

/**
 * Get all replies for a comment with author info
 * @param {number} commentId
 * @returns {Promise<Array>}
 */
const getRepliesByCommentId = async (commentId) => {
  const sql = `
    SELECT cr.id, cr.parent_comment_id, cr.user_id, cr.reply_text, cr.created_at, u.name AS author
    FROM comment_replies cr
    LEFT JOIN users u ON cr.user_id = u.id
    WHERE cr.parent_comment_id = ?
    ORDER BY cr.created_at ASC
  `;
  try {
    const [results] = await promise.execute(sql, [commentId]);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Get a comment by ID
 * @param {number} commentId
 * @returns {Promise<Object>} comment object
 */
const getCommentById = async (commentId) => {
  const sql = `
    SELECT c.id, c.news_id, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `;
  try {
    const [results] = await promise.execute(sql, [commentId]);
    return results[0] || null;
  } catch (err) {
    throw err;
  }
};

/**
 * Add a new reply to a comment
 * @param {number} commentId
 * @param {number} userId
 * @param {string} replyText
 * @returns {Promise<Object>} inserted reply
 */
const addReply = async (commentId, userId, replyText) => {
  const sql = `
    INSERT INTO comment_replies (parent_comment_id, user_id, reply_text) VALUES (?, ?, ?)
  `;
  try {
    const [results] = await promise.execute(sql, [
      commentId,
      userId,
      replyText,
    ]);

    // Update reply count in comments table
    const updateCountSql = `
      UPDATE comments SET reply_count = reply_count + 1 WHERE id = ?
    `;
    await promise.execute(updateCountSql, [commentId]);

    // Return the inserted reply with created_at fetched
    const insertedId = results.insertId;
    const selectSql = `
      SELECT cr.id, cr.parent_comment_id, cr.user_id, cr.reply_text, cr.created_at, u.name AS author
      FROM comment_replies cr
      LEFT JOIN users u ON cr.user_id = u.id
      WHERE cr.id = ?
    `;
    const [res3] = await promise.execute(selectSql, [insertedId]);
    return res3[0];
  } catch (err) {
    throw err;
  }
};

/**
 * Get all comments for all news with author and news info
 * @returns {Promise<Array>}
 */
const getAllNewsComments = async () => {
  const sql = `
    SELECT c.id, c.news_id, n.title AS news_title, c.user_id, c.comment, c.created_at, c.reply_count, u.name AS author
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN news n ON c.news_id = n.id
    ORDER BY c.created_at DESC
  `;
  try {
    const [results] = await promise.execute(sql);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Get all comments by a user that have at least one reply (for notifications)
 * @param {number} userId
 * @returns {Promise<Array>}
 */
const getUserCommentsWithReplies = async (userId) => {
  const sql = `
    SELECT c.id, c.news_id, n.title AS news_title, c.user_id, c.comment, c.created_at, c.reply_count, c.reply_seen,
      (SELECT MAX(cr.created_at) FROM comment_replies cr WHERE cr.parent_comment_id = c.id) AS last_reply_at
    FROM comments c
    LEFT JOIN news n ON c.news_id = n.id
    WHERE c.user_id = ? AND c.reply_count > 0
    ORDER BY last_reply_at DESC
  `;
  try {
    const [results] = await promise.execute(sql, [userId]);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Mark a comment's replies as seen
 * @param {number} commentId
 * @returns {Promise<void>}
 */
const markRepliesAsSeen = async (commentId) => {
  const sql = `UPDATE comments SET reply_seen = 1 WHERE id = ?`;
  try {
    await promise.execute(sql, [commentId]);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getCommentsByNewsId,
  addComment,
  getCommentById,
  getRepliesByCommentId,
  addReply,
  getAllNewsComments,
  getUserCommentsWithReplies,
  markRepliesAsSeen,
};
