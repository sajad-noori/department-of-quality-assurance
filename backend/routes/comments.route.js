const express = require("express");
const router = express.Router({ mergeParams: true });
const commentsController = require("../controllers/comments.controller");
const { authenticate, checkRole } = require("../middleware/auth.middleware");
const { validateComment } = require("../middleware/validateComment");
const { authLimiter } = require("../middleware/rateLimiter");
const { logComment } = require("../middleware/logging.middleware");

// No auth middleware here anymore
router.get("/", commentsController.getComments);
router.post(
  "/",
  [authenticate, validateComment, authLimiter, logComment()],
  commentsController.addComment
);

// Reply routes
router.get("/:commentId/replies", commentsController.getReplies);
router.post(
  "/:commentId/replies",
  [authenticate, validateComment, authLimiter, logComment()],
  commentsController.addReply
);

// Get all comments for all news (admin/employee view)
router.get(
  "/all-news-comments",
  authenticate,
  checkRole(["admin", "employee"]),
  commentsController.getAllNewsComments
);

// Get all comments by the current user that have replies (for notifications)
router.get(
  "/my/replied",
  authenticate,
  commentsController.getMyRepliedComments
);

// Mark a comment's replies as seen (for notifications)
router.post(
  "/my/mark-replies-seen",
  authenticate,
  commentsController.markRepliesAsSeen
);

module.exports = router;
