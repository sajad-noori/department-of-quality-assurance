const Student = require('../models/student.model');
const db = require('../config/db');

// Helper function to check if user is an institute
const checkInstituteAccess = async (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT role FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      resolve(results[0]?.role === 'institute');
    });
  });
};

const addStudent = async (req, res) => {
  try {
    // Check if user is an institute
    const isInstitute = await checkInstituteAccess(req.user.id);
    if (!isInstitute) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only institutes can add student data.'
      });
    }

    const { name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = req.body;
    const userId = req.user.id;

    const student = await Student.create({
      userId,
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding student data',
      error: error.message
    });
  }
};

const getStudents = async (req, res) => {
  try {
    // Check if user is an institute
    const isInstitute = await checkInstituteAccess(req.user.id);
    if (!isInstitute) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only institutes can view student data.'
      });
    }

    const userId = req.user.id;
    const students = await Student.findAll(userId);

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student data',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    // Check if user is an institute
    const isInstitute = await checkInstituteAccess(req.user.id);
    if (!isInstitute) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only institutes can update student data.'
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const { name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = req.body;

    const student = await Student.findOne(id, userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found'
      });
    }

    const updatedStudent = await Student.update(id, userId, {
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear
    });

    res.status(200).json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student data',
      error: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    // Check if user is an institute
    const isInstitute = await checkInstituteAccess(req.user.id);
    if (!isInstitute) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only institutes can delete student data.'
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const student = await Student.findOne(id, userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found'
      });
    }

    const deleted = await Student.delete(id, userId);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete student record'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student data',
      error: error.message
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent
}; 