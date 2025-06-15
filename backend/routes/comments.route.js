const express = require('express');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controllers/comments.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateComment } = require('../middleware/validateComment');
const { authLimiter } = require('../middleware/rateLimiter');

// No auth middleware here anymore
router.get('/', commentsController.getComments);
router.post('/', [authenticate, validateComment, authLimiter], commentsController.addComment);

module.exports = router;
