const express = require("express");
const router = express.Router();
const { saveCenter } = require("../controllers/educational_centers.controller");

router.post("/centers", saveCenter);

module.exports = router;
