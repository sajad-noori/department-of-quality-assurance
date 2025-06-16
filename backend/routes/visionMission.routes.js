const express = require('express');
const router = express.Router();
const visionMissionController = require('../controllers/visionMission.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get vision mission
router.get('/', authenticate, checkRole('institute'), visionMissionController.getVisionMission);

// Create or update vision mission
router.post('/', authenticate, checkRole('institute'), visionMissionController.createVisionMission);

module.exports = router; 