const express = require("express");
const router = express.Router();
const { 
  getStepProgress, 
  updateStepProgress, 
  markStepAsSubmitted, 
  resetProgress 
} = require("../controllers/stepProgress.controller");
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// Get step progress for the current user
router.get("/", 
  authenticate, 
  checkRole('institute'), 
  getStepProgress
);

// Update step progress for the current user
router.put("/", 
  authenticate, 
  checkRole('institute'), 
  updateStepProgress
);

// Mark a specific step as submitted
router.post("/mark-step", 
  authenticate, 
  checkRole('institute'), 
  markStepAsSubmitted
);

// Reset progress for the current user
router.post("/reset", 
  authenticate, 
  checkRole('institute'), 
  resetProgress
);

module.exports = router; 