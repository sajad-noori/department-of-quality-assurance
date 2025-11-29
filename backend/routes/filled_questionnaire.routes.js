const express = require("express");
const router = express.Router();
const {
  deleteFilledQuestionnaire,
} = require("../controllers/filled_questionnaire.controller");
const { authenticate } = require("../middleware/auth.middleware");

// DELETE /api/questionnaires/filled/:id (router mounted at /api/questionnaires)
router.delete("/filled/:id", authenticate, deleteFilledQuestionnaire);

module.exports = router;
