const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, authController.register);
router.post('/verify', authLimiter, authController.verify);
router.post('/login', authLimiter, authController.login); 
router.post('/resend-code', authLimiter, authController.resendCode);



module.exports = router;
