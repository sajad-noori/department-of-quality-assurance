const express = require("express");
const router = express.Router();
const QuestionsController = require("../controllers/questions.controller");
const { logQuestion } = require("../middleware/logging.middleware");
const { verifyToken } = require("../middleware/verifyToken");

// Public routes
router.get("/auth/check", QuestionsController.checkAuth);
router.get("/faq", QuestionsController.getFAQQuestions);
router.get("/search", QuestionsController.searchQuestions);

// User routes (require authentication)
router.get(
  "/user/questions",
  verifyToken,
  QuestionsController.getUserQuestions
);
router.post(
  "/submit",
  [verifyToken, logQuestion()],
  QuestionsController.submitQuestion
);
router.put(
  "/user/:questionId/edit",
  verifyToken,
  QuestionsController.editUserQuestion
);
router.delete(
  "/user/:questionId",
  verifyToken,
  QuestionsController.deleteUserQuestion
);

// Get unseen answers to my questions
router.get(
  "/user/unseen-answers",
  verifyToken,
  QuestionsController.getUnseenAnswersToMyQuestions
);

// Mark a question's answer as seen
router.post(
  "/user/mark-answer-seen",
  verifyToken,
  QuestionsController.markAnswerAsSeen
);

// Admin/Employee routes (require admin or employee role)
router.get("/admin/all", verifyToken, QuestionsController.getAllQuestions);
router.get(
  "/admin/pending",
  verifyToken,
  QuestionsController.getPendingQuestions
);
router.get(
  "/admin/unanswered-count",
  verifyToken,
  QuestionsController.getUnansweredQuestionsCount
);
router.put(
  "/admin/:questionId/reply",
  verifyToken,
  QuestionsController.replyToQuestion
);
router.put(
  "/admin/:questionId/edit",
  verifyToken,
  QuestionsController.editQuestion
);
router.put(
  "/admin/:questionId/edit-reply",
  verifyToken,
  QuestionsController.editReply
);
router.delete(
  "/admin/:questionId",
  verifyToken,
  QuestionsController.deleteQuestion
);

module.exports = router;
