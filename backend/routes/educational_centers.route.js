const express = require("express");
const router = express.Router();
const { saveCenter } = require("../controllers/educational_centers.controller");
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateCenter = [
  body('centerName')
    .trim()
    .notEmpty().withMessage('نام مرکز الزامی است')
    .isLength({ max: 100 }).withMessage('نام مرکز نباید بیشتر از ۱۰۰ کاراکتر باشد'),
  
  body('province')
    .trim()
    .notEmpty().withMessage('استان الزامی است'),
  
  body('district')
    .trim()
    .notEmpty().withMessage('شهرستان الزامی است'),
  
  body('village')
    .trim()
    .notEmpty().withMessage('روستا الزامی است'),
  
  body('centerType')
    .trim()
    .notEmpty().withMessage('نوع مرکز الزامی است'),
  
  body('programType')
    .trim()
    .notEmpty().withMessage('نوع برنامه الزامی است'),
  
  body('foundingYear')
    .isInt({ min: 1300, max: new Date().getFullYear() })
    .withMessage('سال تاسیس باید بین ۱۳۰۰ و سال جاری باشد'),
  
  body('contactName')
    .trim()
    .notEmpty().withMessage('نام تماس گیرنده الزامی است')
    .isLength({ max: 100 }).withMessage('نام تماس گیرنده نباید بیشتر از ۱۰۰ کاراکتر باشد'),
  
  body('phoneNumber')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('شماره تماس باید ۱۰ رقم باشد'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('ایمیل معتبر نیست')
    .normalizeEmail(),
  
  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Protected route with authentication, rate limiting, and validation
router.post("/centers", [authenticate, authLimiter, validateCenter], saveCenter);

module.exports = router;
