const Comment = require("../models/comment");

// Simple HTML tag stripper for XSS prevention
function sanitizeInput(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, "");
}

exports.getComments = async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const comments = await Comment.getCommentsByNewsId(newsId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت نظرات" });
  }
};

exports.addComment = async (req, res) => {
  const newsId = req.params.newsId;
  const userId = req.user?.id; // ✅ Get user ID from decoded JWT
  let { comment } = req.body;
  comment = sanitizeInput(comment);

  // 🔐 Ensure user is authenticated (JWT middleware should add req.user)
  if (!userId) {
    return res
      .status(401)
      .json({ message: "لطفاً وارد شوید تا بتوانید نظر دهید." });
  }

  // ✅ Input validation
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "نظر نمی‌تواند خالی باشد." });
  }

  try {
    const newComment = await Comment.addComment(newsId, userId, comment);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ثبت نظر" });
  }
};

exports.getReplies = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const replies = await Comment.getRepliesByCommentId(commentId);
    res.json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت پاسخ‌ها" });
  }
};

exports.addReply = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;
  let { comment: replyText } = req.body;
  replyText = sanitizeInput(replyText);

  // ✅ Enhanced input validation
  if (!userId) {
    return res
      .status(401)
      .json({ message: "لطفاً وارد شوید تا بتوانید پاسخ دهید." });
  }

  // ✅ Validate commentId format
  if (!commentId || isNaN(parseInt(commentId)) || parseInt(commentId) <= 0) {
    return res.status(400).json({ message: "شناسه نظر نامعتبر است." });
  }

  // ✅ Enhanced text validation
  if (!replyText || typeof replyText !== "string" || replyText.trim() === "") {
    return res.status(400).json({ message: "پاسخ نمی‌تواند خالی باشد." });
  }

  // ✅ Content length validation
  if (replyText.length > 1000) {
    return res
      .status(400)
      .json({ message: "پاسخ نمی‌تواند بیشتر از 1000 کاراکتر باشد." });
  }

  // ✅ Check if parent comment exists
  try {
    const parentComment = await Comment.getCommentById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "نظر مورد نظر یافت نشد." });
    }
  } catch (err) {
    console.error("Error checking parent comment:", err);
    return res.status(500).json({ message: "خطا در بررسی نظر" });
  }

  try {
    const newReply = await Comment.addReply(commentId, userId, replyText);
    res.status(201).json(newReply);
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: "خطا در ثبت پاسخ" });
  }
};

exports.getAllNewsComments = async (req, res) => {
  try {
    const comments = await Comment.getAllNewsComments();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت همه نظرات اخبار" });
  }
};
