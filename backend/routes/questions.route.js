const express = require('express');
const router = express.Router();
const QuestionsController = require('../controllers/questions.controller');

// Public routes
router.get('/auth/check', QuestionsController.checkAuth);
router.get('/faq', QuestionsController.getFAQQuestions);
router.get('/search', QuestionsController.searchQuestions);

// User routes (require authentication)
router.get('/user/questions', QuestionsController.getUserQuestions);
router.post('/submit', QuestionsController.submitQuestion);
router.put('/user/:questionId/edit', QuestionsController.editUserQuestion);
router.delete('/user/:questionId', QuestionsController.deleteUserQuestion);

// Admin/Employee routes (require admin or employee role)
router.get('/admin/all', QuestionsController.getAllQuestions);
router.get('/admin/pending', QuestionsController.getPendingQuestions);
router.get('/admin/unanswered-count', QuestionsController.getUnansweredQuestionsCount);
router.put('/admin/:questionId/reply', QuestionsController.replyToQuestion);
router.put('/admin/:questionId/edit', QuestionsController.editQuestion);
router.put('/admin/:questionId/edit-reply', QuestionsController.editReply);
router.delete('/admin/:questionId', QuestionsController.deleteQuestion);

module.exports = router; 