const Student = require("../models/student.model");
const { promise } = require("../config/db");

// Helper function to check if user is an institute
const checkInstituteAccess = async (userId) => {
  try {
    const query = "SELECT role FROM users WHERE id = ?";
    const [results] = await promise.execute(query, [userId]);
    return results[0]?.role === "institute";
  } catch (error) {
    console.error("Error checking institute access:", error);
    throw error;
  }
};

const addStudent = async (req, res) => {
  try {
    // Check if user is an institute
    const isInstitute = await checkInstituteAccess(req.user.id);
    if (!isInstitute) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only institutes can add student data.",
      });
    }

    const {
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear,
    } = req.body;
    const userId = req.user.id;

    const student = await Student.create({
      userId,
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({
      success: false,
      message: "Error adding student data",
      error: error.message,
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
        message: "Access denied. Only institutes can view student data.",
      });
    }

    const userId = req.user.id;
    const students = await Student.findAll(userId);

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student data",
      error: error.message,
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
        message: "Access denied. Only institutes can update student data.",
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear,
    } = req.body;

    const student = await Student.findOne(id, userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    const updatedStudent = await Student.update(id, userId, {
      name,
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear,
    });

    res.status(200).json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Error updating student data",
      error: error.message,
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
        message: "Access denied. Only institutes can delete student data.",
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    const student = await Student.findOne(id, userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found",
      });
    }

    const deleted = await Student.delete(id, userId);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete student record",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting student data",
      error: error.message,
    });
  }
};

// Get students data by user ID (for admin/employee access)
const getStudentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is a number
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        message: "شناسه کاربر نامعتبر است",
      });
    }

    const students = await Student.findAll(userId);

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student data",
      error: error.message,
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentsByUserId,
};
