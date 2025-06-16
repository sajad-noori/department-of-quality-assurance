const Standard = require('../models/standard.model');
const path = require('path');
const fs = require('fs').promises;

// Define upload directories
const tempDir = path.join(__dirname, '../uploads/temp');
const filesDir = path.join(__dirname, '../uploads/files');

// Map of MIME types to simpler file types
const mimeTypeMap = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

exports.createStandard = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { standardTitle, description } = req.body;
        if (!standardTitle || !description) {
            return res.status(400).json({ message: 'Standard title and description are required' });
        }

        // Generate unique filename
        const uniqueFileName = Standard.generateUniqueFileName(req.file.originalname);
        const filePath = path.join(filesDir, uniqueFileName);

        // Move the file from temp to final location
        await fs.rename(req.file.path, filePath);

        // Get simplified file type
        const fileType = mimeTypeMap[req.file.mimetype] || 'unknown';

        const data = {
            userId: req.user.id,
            standardTitle,
            description,
            fileName: uniqueFileName,
            originalFileName: req.file.originalname,
            filePath,
            fileType
        };

        const standard = await Standard.create(data);

        res.status(201).json({
            message: 'Standard created successfully',
            data: standard
        });
    } catch (error) {
        console.error('Error in createStandard:', error);
        // Clean up temp file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error cleaning up temp file:', unlinkError);
            }
        }
        res.status(500).json({
            message: 'Error creating standard',
            error: error.message
        });
    }
};

exports.getStandards = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const standards = await Standard.findByUserId(req.user.id);
        res.json(standards);
    } catch (error) {
        console.error('Error in getStandards:', error);
        res.status(500).json({
            message: 'Error fetching standards',
            error: error.message
        });
    }
};

exports.deleteStandard = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        await Standard.delete(id, req.user.id);

        res.json({ message: 'Standard deleted successfully' });
    } catch (error) {
        console.error('Error in deleteStandard:', error);
        res.status(500).json({
            message: 'Error deleting standard',
            error: error.message
        });
    }
}; 