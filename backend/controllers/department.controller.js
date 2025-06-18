const Department = require('../models/department.model');

exports.createDepartment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }

        const { name, newEnrollments, totalStudents, graduationCycles, establishmentYear, numberOfStudents } = req.body;

        if (!name || !newEnrollments || !totalStudents || !graduationCycles || !establishmentYear || !numberOfStudents) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        const data = {
            userId: req.user.id,
            name,
            newEnrollments,
            totalStudents,
            graduationCycles,
            establishmentYear,
            numberOfStudents
        };

        const department = await Department.create(data);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        console.error('Error in createDepartment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating department',
            error: error.message
        });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }

        const departments = await Department.findByUserId(req.user.id);
        res.json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error in getDepartments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments',
            error: error.message
        });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }

        const { id } = req.params;
        await Department.delete(id, req.user.id);

        res.json({ 
            success: true,
            message: 'Department deleted successfully' 
        });
    } catch (error) {
        console.error('Error in deleteDepartment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting department',
            error: error.message
        });
    }
};

// Get departments data by user ID (for admin/employee access)
exports.getDepartmentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate that userId is a number
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ 
                success: false,
                message: 'شناسه کاربر نامعتبر است' 
            });
        }

        const departments = await Department.findByUserId(userId);

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments by user ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching departments data',
            error: error.message
        });
    }
}; 