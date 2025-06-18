const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnel.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get personnel data for an institute
router.get('/', 
  authenticate, 
  checkRole(['institute', 'admin']), 
  personnelController.getPersonnel
);

// Get personnel data by user ID (for admin/employee access)
router.get('/user/:userId', 
  authenticate, 
  checkRole(['admin', 'employee']), 
  personnelController.getPersonnelByUserId
);

// Update personnel data
router.post('/', 
  authenticate, 
  checkRole(['institute']), 
  personnelController.updatePersonnel
);

module.exports = router; 