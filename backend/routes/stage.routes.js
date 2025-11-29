const express = require("express");
const router = express.Router();
const stageController = require("../controllers/stage.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Get current user's stage status
router.get("/status", authenticate, stageController.getStageStatus);

// Mark a stage as complete
router.post("/complete", authenticate, stageController.completeStage);

module.exports = router;
