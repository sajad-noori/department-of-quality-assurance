const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stage.controller');
const { verifyToken } = require('../middleware/verifyToken');

// Get current user's stage status
router.get('/status', verifyToken, stageController.getStageStatus);

// Mark a stage as complete
router.post('/complete', verifyToken, stageController.completeStage);

module.exports = router; 