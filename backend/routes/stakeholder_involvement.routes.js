const express = require("express");
const router = express.Router();
const { authenticate, checkRole } = require("../middleware/auth.middleware");
const stakeholderInvolvementController = require("../controllers/stakeholder_involvement.controller");

// Create or update stakeholder involvement
router.post("/", authenticate, checkRole("institute"), stakeholderInvolvementController.createOrUpdate);

// Get stakeholder involvement for current user
router.get("/", authenticate, checkRole("institute"), stakeholderInvolvementController.getByUserId);

module.exports = router; 