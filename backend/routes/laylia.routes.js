const express = require('express');
const router = express.Router();
const layliaController = require('../controllers/laylia.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get all laylia entries
router.get('/', authenticate, checkRole('institute'), layliaController.getLaylia);

// Add a new laylia entry
router.post('/', authenticate, checkRole('institute'), layliaController.addLaylia);

// Delete a laylia entry
router.delete('/:id', authenticate, checkRole('institute'), layliaController.deleteLaylia);

module.exports = router; 