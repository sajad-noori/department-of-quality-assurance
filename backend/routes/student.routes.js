const express = require('express');
const router = express.Router();
const { addStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/student.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get all students for the authenticated user
router.get('/', authenticate, checkRole('institute'), getStudents);

// Add a new student record
router.post('/', authenticate, checkRole('institute'), addStudent);

// Update a student record
router.put('/:id', authenticate, checkRole('institute'), updateStudent);

// Delete a student record
router.delete('/:id', authenticate, checkRole('institute'), deleteStudent);

module.exports = router; 