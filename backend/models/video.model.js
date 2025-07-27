const { promise } = require("../config/db");

const Video = {
  getCommentsByVideoId: async (videoId) => {
    try {
      const sql =
        "SELECT * FROM video_comments WHERE video_id = ? ORDER BY created_at ASC";
      const [results] = await promise.execute(sql, [videoId]);
      return results;
    } catch (error) {
      throw new Error(`Error fetching video comments: ${error.message}`);
    }
  },

  addComment: async function (videoId, userId, commentText) {
    try {
      const sql = `
        INSERT INTO video_comments (video_id, user_id, comment, created_at)
        VALUES (?, ?, ?, NOW())
      `;
      const [result] = await promise.execute(sql, [
        videoId,
        userId,
        commentText,
      ]);

      return {
        id: result.insertId,
        video_id: videoId,
        user_id: userId,
        comment: commentText,
        created_at: new Date(),
      };
    } catch (error) {
      throw new Error(`Error adding video comment: ${error.message}`);
    }
  },
};

module.exports = Video;
