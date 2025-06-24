const express = require("express");
const router = express.Router();
const { 
  getStepProgress, 
  updateStepProgress, 
  markStepAsSubmitted, 
  resetProgress 
} = require("../controllers/stepProgress.controller");
const { authenticate, checkRole } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Get step progress for the current user
router.get("/", 
  authenticate, 
  checkRole('institute'), 
  authLimiter, 
  getStepProgress
);

// Update step progress for the current user
router.put("/", 
  authenticate, 
  checkRole('institute'), 
  authLimiter, 
  updateStepProgress
);

// Mark a specific step as submitted
router.post("/mark-step", 
  authenticate, 
  checkRole('institute'), 
  authLimiter, 
  markStepAsSubmitted
);

// Reset progress for the current user
router.post("/reset", 
  authenticate, 
  checkRole('institute'), 
  authLimiter, 
  resetProgress
);

module.exports = router; 