const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const standardController = require('../controllers/standard.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Ensure upload directories exist
const tempDir = path.join(__dirname, '../uploads/temp');
const filesDir = path.join(__dirname, '../uploads/files');

[tempDir, filesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only PDF and Word documents
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Create standard with file upload
router.post('/', 
    authenticate, 
    checkRole('institute'),
    upload.single('file'),
    standardController.createStandard
);

// Get all standards for a user
router.get('/', 
    authenticate, 
    checkRole('institute'),
    standardController.getStandards
);

// Get standards data by user ID (for admin/employee access)
router.get('/user/:userId', 
    authenticate, 
    checkRole(['admin', 'employee']),
    standardController.getStandardsByUserId
);

// Download standard file by ID (for admin/employee access)
router.get('/download/:id', 
    authenticate, 
    checkRole(['admin', 'employee']),
    standardController.downloadStandardFile
);

// Delete a standard
router.delete('/:id', 
    authenticate, 
    checkRole('institute'),
    standardController.deleteStandard
);

module.exports = router; 