const express = require('express');
const router = express.Router();
const practicalFacilityController = require('../controllers/practical_facility.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Create a new practical facility
router.post('/', authenticate, checkRole('institute'), practicalFacilityController.createFacility);

// Get all practical facilities for the current user
router.get('/', authenticate, checkRole('institute'), practicalFacilityController.getFacilities);

// Delete a practical facility
router.delete('/:id', authenticate, checkRole('institute'), practicalFacilityController.deleteFacility);

module.exports = router; 