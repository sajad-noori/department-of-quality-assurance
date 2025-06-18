const express = require('express');
const router = express.Router();
const practicalFacilityController = require('../controllers/practical_facility.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Create a new practical facility
router.post('/', authenticate, checkRole('institute'), practicalFacilityController.createFacility);

// Get all practical facilities for the current user
router.get('/', authenticate, checkRole('institute'), practicalFacilityController.getFacilities);

// Get practical facilities data by user ID (for admin/employee access)
router.get('/user/:userId', authenticate, checkRole(['admin', 'employee']), practicalFacilityController.getFacilitiesByUserId);

// Delete a practical facility
router.delete('/:id', authenticate, checkRole('institute'), practicalFacilityController.deleteFacility);

module.exports = router; 