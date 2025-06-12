const express = require('express');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controllers/comments.controller');

// No auth middleware here anymore
router.get('/', commentsController.getComments);
router.post('/', commentsController.addComment);

module.exports = router;
