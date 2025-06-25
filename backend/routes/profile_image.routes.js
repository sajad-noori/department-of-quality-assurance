const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth.middleware');
const profileImageController = require('../controllers/profile_image.controller');

// Ensure upload directories exist
const tempDir = path.join(__dirname, '../uploads/temp');
const profileDir = path.join(__dirname, '../uploads/profile');

[tempDir, profileDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Routes
/**
 * @route POST /api/upload-profile-image
 * @desc Upload a profile image for the authenticated user
 * @access Private
 */
router.post('/upload-profile-image', 
  authenticate, 
  (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  profileImageController.uploadProfileImage
);

/**
 * @route GET /api/profile-image
 * @desc Get the current user's profile image
 * @access Private
 */
router.get('/profile-image', 
  authenticate, 
  profileImageController.getProfileImage
);

/**
 * @route DELETE /api/profile-image
 * @desc Delete the current user's profile image
 * @access Private
 */
router.delete('/profile-image', 
  authenticate, 
  profileImageController.deleteProfileImage
);

module.exports = router; 