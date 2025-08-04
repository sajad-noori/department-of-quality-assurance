const express = require("express");
const router = express.Router();
const {
  deleteFilledQuestionnaire,
} = require("../controllers/filled_questionnaire.controller");
const { verifyToken } = require("../middleware/verifyToken");

// DELETE /api/questionnaires/filled/:id (router mounted at /api/questionnaires)
router.delete(
  "/filled/:id",
  verifyToken,
  deleteFilledQuestionnaire
);

module.exports = router;
