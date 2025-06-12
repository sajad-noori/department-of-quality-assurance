const express = require('express');
const router = express.Router();
const { recordVisit, getVisitorStats } = require('../controllers/visitorController');

router.post('/visit', recordVisit);
router.get('/visitor-stats', getVisitorStats);

module.exports = router;
