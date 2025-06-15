const { body, validationResult } = require('express-validator');

exports.validateComment = [
  body('comment')
    .trim()
    .notEmpty().withMessage('متن نظر نمی‌تواند خالی باشد.')
    .isLength({ max: 500 }).withMessage('نظر نباید بیشتر از ۵۰۰ کاراکتر باشد.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
