const db = require("../config/db");
const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validateCenter = [
  body('centerName')
    .trim()
    .notEmpty().withMessage('نام مرکز الزامی است')
    .isLength({ min: 2, max: 100 }).withMessage('نام مرکز باید بین ۲ تا ۱۰۰ حرف باشد')
    .matches(/^[\u0600-\u06FF\s\w-]+$/).withMessage('نام مرکز فقط می‌تواند شامل حروف فارسی، انگلیسی، اعداد و خط تیره باشد'),
  
  body('province')
    .trim()
    .notEmpty().withMessage('ولایت الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام ولایت باید بین ۲ تا ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FF\s]+$/).withMessage('نام ولایت فقط می‌تواند شامل حروف فارسی باشد'),
  
  body('district')
    .trim()
    .notEmpty().withMessage('ولسوالی الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام ولسوالی باید بین ۲ تا ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FF\s]+$/).withMessage('نام ولسوالی فقط می‌تواند شامل حروف فارسی باشد'),
  
  body('village')
    .trim()
    .notEmpty().withMessage('قریه یا گذر الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام قریه یا گذر باید بین ۲ تا ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FF\s]+$/).withMessage('نام قریه یا گذر فقط می‌تواند شامل حروف فارسی باشد'),
  
  body('centerType')
    .trim()
    .notEmpty().withMessage('نوع مرکز الزامی است')
    .isIn(['دولتی', 'خصوصی', 'خیریه']).withMessage('نوع مرکز نامعتبر است'),
  
  body('programType')
    .trim()
    .notEmpty().withMessage('نوع برنامه الزامی است')
    .isIn(['دوساله', 'چهارساله', 'شش‌ساله']).withMessage('نوع برنامه نامعتبر است'),
  
  body('foundingYear')
    .trim()
    .notEmpty().withMessage('سال تاسیس الزامی است')
    .isInt({ min: 1300, max: new Date().getFullYear() }).withMessage('سال تاسیس باید بین ۱۳۰۰ و سال جاری باشد'),
  
  body('contactName')
    .trim()
    .notEmpty().withMessage('نام تماس گیرنده الزامی است')
    .isLength({ min: 2, max: 50 }).withMessage('نام تماس گیرنده باید بین ۲ تا ۵۰ حرف باشد')
    .matches(/^[\u0600-\u06FF\s]+$/).withMessage('نام تماس گیرنده فقط می‌تواند شامل حروف فارسی باشد'),
  
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('شماره تماس الزامی است')
    .matches(/^[0-9]{10}$/).withMessage('شماره تماس باید ۱۰ رقم باشد'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است')
    .normalizeEmail()
];

exports.saveCenter = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "خطا در اعتبارسنجی اطلاعات",
      errors: errors.array()
    });
  }

  // Additional role check (as a backup)
  if (req.user.role !== 'institute') {
    return res.status(403).json({ 
      message: "شما دسترسی به این بخش را ندارید. فقط کاربران با نقش مرکز آموزشی می‌توانند این فرم را پر کنند."
    });
  }

  const {
    centerName,
    province,
    district,
    village,
    centerType,
    programType,
    foundingYear,
    contactName,
    phoneNumber,
    email,
  } = req.body;

  // Get user ID from the authenticated user
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
  }

  // Sanitize inputs
  const sanitizedData = {
    centerName: centerName.trim(),
    province: province.trim(),
    district: district.trim(),
    village: village.trim(),
    centerType: centerType.trim(),
    programType: programType.trim(),
    foundingYear: parseInt(foundingYear),
    contactName: contactName.trim(),
    phoneNumber: phoneNumber.trim(),
    email: email.trim().toLowerCase(),
  };

  const sql = `
    INSERT INTO educational_centers 
    (centerName, province, district, village, centerType, programType, foundingYear, contactName, phoneNumber, email, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sanitizedData.centerName,
    sanitizedData.province,
    sanitizedData.district,
    sanitizedData.village,
    sanitizedData.centerType,
    sanitizedData.programType,
    sanitizedData.foundingYear,
    sanitizedData.contactName,
    sanitizedData.phoneNumber,
    sanitizedData.email,
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      // Don't expose internal error details to client
      return res.status(500).json({ message: "خطا در ذخیره‌سازی اطلاعات" });
    }
    res.status(201).json({ message: "مرکز آموزشی با موفقیت ذخیره شد" });
  });
};

// Get educational center data for a user
exports.getCenter = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
    }

    const sql = `
      SELECT * FROM educational_centers 
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "خطا در دریافت اطلاعات" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error in getCenter:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات" });
  }
};
