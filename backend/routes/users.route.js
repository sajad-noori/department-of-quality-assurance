const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/users.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Protected route - only admin can access user list
router.get('/', [authenticate, checkRole('admin'), authLimiter], getUsers);

// Protected route - only admin can update user roles
router.put('/:userId/role', [authenticate, checkRole('admin'), authLimiter], updateUserRole);

module.exports = router; 