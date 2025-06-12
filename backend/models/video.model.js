const db = require('../config/db'); // Your MySQL connection

const Video = {
  getCommentsByVideoId: (videoId, callback) => {
    const sql = 'SELECT * FROM video_comments WHERE video_id = ? ORDER BY created_at ASC';
    db.query(sql, [videoId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  addComment: function (videoId, userId, commentText, callback) {
    const sql = `
      INSERT INTO video_comments (video_id, user_id, comment, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(sql, [videoId, userId, commentText], function (err, result) {
      if (err) return callback(err);
      callback(null, {
        id: result.insertId,
        video_id: videoId,
        user_id: userId,
        comment: commentText,
        created_at: new Date()
      });
    });
  }
};

module.exports = Video;
