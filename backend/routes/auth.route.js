const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', authLimiter, authController.register);
router.post('/verify', authLimiter, authController.verify);
router.post('/login', authLimiter, authController.login); 
router.post('/resend-code', authLimiter, authController.resendCode);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});



module.exports = router;
