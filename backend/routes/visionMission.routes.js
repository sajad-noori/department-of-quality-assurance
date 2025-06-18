const express = require('express');
const router = express.Router();
const visionMissionController = require('../controllers/visionMission.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get vision mission
router.get('/', authenticate, checkRole('institute'), visionMissionController.getVisionMission);

// Get vision mission data by user ID (for admin/employee access)
router.get('/user/:userId', authenticate, checkRole(['admin', 'employee']), visionMissionController.getVisionMissionByUserId);

// Create or update vision mission
router.post('/', authenticate, checkRole('institute'), visionMissionController.createVisionMission);

module.exports = router; 