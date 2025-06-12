const Comment = require('../models/comment');

exports.getComments = async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const comments = await Comment.getCommentsByNewsId(newsId);
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت نظرات' });
  }
};

exports.addComment = async (req, res) => {
  const newsId = req.params.newsId;
  const { comment, userId } = req.body;  // get userId from body (sent by client)

  if (!userId) {
    return res.status(401).json({ message: 'لطفاً وارد شوید تا بتوانید نظر دهید.' });
  }

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'نظر نمی تواند خالی باشد' });
  }

  try {
    const newComment = await Comment.addComment(newsId, userId, comment);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ثبت نظر' });
  }
};
