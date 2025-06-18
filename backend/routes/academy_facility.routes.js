const express = require('express');
const router = express.Router();
const academyFacilityController = require('../controllers/academy_facility.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Create facility
router.post('/', 
    authenticate, 
    checkRole('institute'),
    academyFacilityController.createFacility
);

// Get all facilities for the authenticated user
router.get('/', 
    authenticate, 
    checkRole('institute'),
    academyFacilityController.getFacilities
);

// Get academy facilities data by user ID (for admin/employee access)
router.get('/user/:userId', 
    authenticate, 
    checkRole(['admin', 'employee']),
    academyFacilityController.getFacilitiesByUserId
);

// Delete facility
router.delete('/:id', 
    authenticate, 
    checkRole('institute'),
    academyFacilityController.deleteFacility
);

module.exports = router; 