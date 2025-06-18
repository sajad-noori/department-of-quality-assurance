const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Create department
router.post('/', 
    authenticate, 
    checkRole('institute'),
    departmentController.createDepartment
);

// Get all departments for the authenticated user
router.get('/', 
    authenticate, 
    checkRole('institute'),
    departmentController.getDepartments
);

// Get departments data by user ID (for admin/employee access)
router.get('/user/:userId', 
    authenticate, 
    checkRole(['admin', 'employee']),
    departmentController.getDepartmentsByUserId
);

// Delete department
router.delete('/:id', 
    authenticate, 
    checkRole('institute'),
    departmentController.deleteDepartment
);

module.exports = router; 