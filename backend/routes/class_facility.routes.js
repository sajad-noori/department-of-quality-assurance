const express = require('express');
const router = express.Router();
const classFacilityController = require('../controllers/class_facility.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Create a new class facility
router.post('/', authenticate, checkRole('institute'), classFacilityController.createFacility);

// Get all class facilities for the current user
router.get('/', authenticate, checkRole('institute'), classFacilityController.getFacilities);

// Get class facilities data by user ID (for admin/employee access)
router.get('/user/:userId', authenticate, checkRole(['admin', 'employee']), classFacilityController.getFacilitiesByUserId);

// Delete a class facility
router.delete('/:id', authenticate, checkRole('institute'), classFacilityController.deleteFacility);

module.exports = router; 