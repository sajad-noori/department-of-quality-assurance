const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/verify', authController.verify);
router.post('/login', authController.login); 
router.post('/resend-code', authController.resendCode);



module.exports = router;
