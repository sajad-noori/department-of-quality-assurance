const express = require("express");
const router = express.Router();
const QuestionsController = require("../controllers/questions.controller");
const { logQuestion } = require("../middleware/logging.middleware");
const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.get("/auth/check", QuestionsController.checkAuth);
router.get("/faq", QuestionsController.getFAQQuestions);
router.get("/search", QuestionsController.searchQuestions);

// User routes (require authentication)
router.get(
  "/user/questions",
  authenticate,
  QuestionsController.getUserQuestions
);
router.post(
  "/submit",
  [authenticate, logQuestion()],
  QuestionsController.submitQuestion
);
router.put(
  "/user/:questionId/edit",
  authenticate,
  QuestionsController.editUserQuestion
);
router.delete(
  "/user/:questionId",
  authenticate,
  QuestionsController.deleteUserQuestion
);

// Get unseen answers to my questions
router.get(
  "/user/unseen-answers",
  authenticate,
  QuestionsController.getUnseenAnswersToMyQuestions
);

// Mark a question's answer as seen
router.post(
  "/user/mark-answer-seen",
  authenticate,
  QuestionsController.markAnswerAsSeen
);

// Admin/Employee routes (require admin or employee role)
router.get("/admin/all", authenticate, QuestionsController.getAllQuestions);
router.get(
  "/admin/pending",
  authenticate,
  QuestionsController.getPendingQuestions
);
router.get(
  "/admin/unanswered-count",
  authenticate,
  QuestionsController.getUnansweredQuestionsCount
);
router.put(
  "/admin/:questionId/reply",
  authenticate,
  QuestionsController.replyToQuestion
);
router.put(
  "/admin/:questionId/edit",
  authenticate,
  QuestionsController.editQuestion
);
router.put(
  "/admin/:questionId/edit-reply",
  authenticate,
  QuestionsController.editReply
);
router.delete(
  "/admin/:questionId",
  authenticate,
  QuestionsController.deleteQuestion
);

module.exports = router;
