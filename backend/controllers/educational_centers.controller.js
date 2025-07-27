const { promise } = require("../config/db");
const { body, validationResult } = require("express-validator");

// Validation middleware
exports.validateCenter = [
  body("centerName")
    .trim()
    .notEmpty()
    .withMessage("نام مرکز الزامی است")
    .isLength({ min: 2, max: 100 })
    .withMessage("نام مرکز باید بین ۲ تا ۱۰۰ حرف باشد")
    .matches(/^[\u0600-\u06FF\s\w-]+$/)
    .withMessage(
      "نام مرکز فقط می‌تواند شامل حروف فارسی، انگلیسی، اعداد و خط تیره باشد"
    ),

  body("province")
    .trim()
    .notEmpty()
    .withMessage("ولایت الزامی است")
    .isLength({ min: 2, max: 50 })
    .withMessage("نام ولایت باید بین ۲ تا ۵۰ حرف باشد")
    .matches(/^[\u0600-\u06FF\s]+$/)
    .withMessage("نام ولایت فقط می‌تواند شامل حروف فارسی باشد"),

  body("district")
    .trim()
    .notEmpty()
    .withMessage("ولسوالی الزامی است")
    .isLength({ min: 2, max: 50 })
    .withMessage("نام ولسوالی باید بین ۲ تا ۵۰ حرف باشد")
    .matches(/^[\u0600-\u06FF\s]+$/)
    .withMessage("نام ولسوالی فقط می‌تواند شامل حروف فارسی باشد"),

  body("village")
    .trim()
    .notEmpty()
    .withMessage("قریه یا گذر الزامی است")
    .isLength({ min: 2, max: 50 })
    .withMessage("نام قریه یا گذر باید بین ۲ تا ۵۰ حرف باشد")
    .matches(/^[\u0600-\u06FF\s]+$/)
    .withMessage("نام قریه یا گذر فقط می‌تواند شامل حروف فارسی باشد"),

  body("centerType")
    .trim()
    .notEmpty()
    .withMessage("نوع مرکز الزامی است")
    .isIn(["دولتی", "خصوصی", "خیریه"])
    .withMessage("نوع مرکز نامعتبر است"),

  body("programType")
    .trim()
    .notEmpty()
    .withMessage("نوع برنامه الزامی است")
    .isIn(["دوساله", "چهارساله", "شش‌ساله"])
    .withMessage("نوع برنامه نامعتبر است"),

  body("foundingYear")
    .trim()
    .notEmpty()
    .withMessage("سال تاسیس الزامی است")
    .isInt({ min: 1300, max: new Date().getFullYear() })
    .withMessage("سال تاسیس باید بین ۱۳۰۰ و سال جاری باشد"),

  body("contactName")
    .trim()
    .notEmpty()
    .withMessage("نام تماس گیرنده الزامی است")
    .isLength({ min: 2, max: 50 })
    .withMessage("نام تماس گیرنده باید بین ۲ تا ۵۰ حرف باشد")
    .matches(/^[\u0600-\u06FF\s]+$/)
    .withMessage("نام تماس گیرنده فقط می‌تواند شامل حروف فارسی باشد"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("شماره تماس الزامی است")
    .matches(/^[0-9]{10}$/)
    .withMessage("شماره تماس باید ۱۰ رقم باشد"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("ایمیل الزامی است")
    .isEmail()
    .withMessage("ایمیل نامعتبر است")
    .normalizeEmail(),
];

exports.saveCenter = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "خطا در اعتبارسنجی اطلاعات",
        errors: errors.array(),
      });
    }

    // Additional role check (as a backup)
    if (req.user.role !== "institute") {
      return res.status(403).json({
        message:
          "شما دسترسی به این بخش را ندارید. فقط کاربران با نقش مرکز آموزشی می‌توانند این فرم را پر کنند.",
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
      userId,
    ];

    await promise.execute(sql, values);
    res.status(201).json({ message: "مرکز آموزشی با موفقیت ذخیره شد" });
  } catch (error) {
    console.error("Database error:", error);
    // Don't expose internal error details to client
    res.status(500).json({ message: "خطا در ذخیره‌سازی اطلاعات" });
  }
};

// Update educational center data for a user
exports.updateCenter = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "خطا در اعتبارسنجی اطلاعات",
        errors: errors.array(),
      });
    }

    // Additional role check (as a backup)
    if (req.user.role !== "institute") {
      return res.status(403).json({
        message:
          "شما دسترسی به این بخش را ندارید. فقط کاربران با نقش مرکز آموزشی می‌توانند این فرم را پر کنند.",
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
      UPDATE educational_centers 
      SET centerName = ?, province = ?, district = ?, village = ?, 
          centerType = ?, programType = ?, foundingYear = ?, 
          contactName = ?, phoneNumber = ?, email = ?
      WHERE user_id = ?
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
      userId,
    ];

    const [result] = await promise.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "مرکز آموزشی یافت نشد" });
    }

    res.json({ message: "مرکز آموزشی با موفقیت بروزرسانی شد" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "خطا در بروزرسانی اطلاعات" });
  }
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

    const [results] = await promise.execute(sql, [userId]);
    res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات" });
  }
};

exports.getEducationalCenters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // Build the search condition
    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        WHERE (ec.centerName LIKE ? 
        OR u.name LIKE ? 
        OR ec.phoneNumber LIKE ? 
        OR u.email LIKE ?)
        AND u.role = 'institute'
      `;
      searchParams = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ];
    } else {
      searchCondition = `WHERE u.role = 'institute'`;
    }

    // Get total count for pagination
    const [countResult] = await promise.execute(
      `SELECT COUNT(*) as total 
       FROM educational_centers ec 
       INNER JOIN users u ON ec.user_id = u.id 
       LEFT JOIN stages s ON ec.user_id = s.user_id
       ${searchCondition}`,
      searchParams
    );
    const total = countResult[0].total;

    // Get paginated educational centers with user and stage data
    const [centers] = await promise.execute(
      `SELECT 
         ec.id,
         ec.user_id,
         ec.centerName,
         u.name as contactName,
         ec.phoneNumber,
         u.email,
         COALESCE(s.stage1, 1) as stage1,
         COALESCE(s.stage2, 0) as stage2,
         COALESCE(s.stage3, 0) as stage3,
         ec.created_at
       FROM educational_centers ec 
       INNER JOIN users u ON ec.user_id = u.id 
       LEFT JOIN stages s ON ec.user_id = s.user_id
       ${searchCondition}
       ORDER BY ec.id DESC 
       LIMIT ${limit} OFFSET ${offset}`,
      searchParams
    );

    res.json({
      centers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching educational centers:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات مراکز آموزشی" });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { stage1, stage2, stage3 } = req.body;

    // First, get the actual user_id from educational_centers table
    const [centerResult] = await promise.execute(
      "SELECT user_id FROM educational_centers WHERE id = ?",
      [userId]
    );

    if (centerResult.length === 0) {
      return res.status(404).json({ message: "مرکز آموزشی یافت نشد" });
    }

    const actualUserId = centerResult[0].user_id;

    // Check if stage record exists for this user
    const [existingStage] = await promise.execute(
      "SELECT id FROM stages WHERE user_id = ?",
      [actualUserId]
    );

    if (existingStage.length > 0) {
      // Update existing stage record
      await promise.execute(
        "UPDATE stages SET stage1 = ?, stage2 = ?, stage3 = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [stage1 ? 1 : 0, stage2 ? 1 : 0, stage3 ? 1 : 0, actualUserId]
      );
    } else {
      // Create new stage record
      await promise.execute(
        "INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, ?, ?, ?)",
        [actualUserId, stage1 ? 1 : 0, stage2 ? 1 : 0, stage3 ? 1 : 0]
      );
    }

    res.json({ message: "مرحله با موفقیت بروزرسانی شد" });
  } catch (error) {
    console.error("Error updating stage:", error);
    res.status(500).json({ message: "خطا در بروزرسانی مرحله" });
  }
};

exports.getStageCounts = async (req, res) => {
  try {
    const [result] = await promise.execute(`
      SELECT 
        SUM(COALESCE(s.stage1, 1)) as stage1_count,
        SUM(COALESCE(s.stage2, 0)) as stage2_count,
        SUM(COALESCE(s.stage3, 0)) as stage3_count,
        COUNT(*) as total_count
      FROM educational_centers ec 
      INNER JOIN users u ON ec.user_id = u.id
      LEFT JOIN stages s ON ec.user_id = s.user_id
      WHERE u.role = 'institute'
    `);

    res.json({
      stage1: result[0].stage1_count || 0,
      stage2: result[0].stage2_count || 0,
      stage3: result[0].stage3_count || 0,
      total: result[0].total_count || 0,
    });
  } catch (error) {
    console.error("Error fetching stage counts:", error);
    res.status(500).json({ message: "خطا در دریافت آمار مراحل" });
  }
};

// Get a specific educational center by user ID
exports.getCenterById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is a number
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "شناسه کاربر نامعتبر است" });
    }

    // Get center details with user and stage information
    const [centers] = await promise.execute(
      `SELECT 
         ec.id,
         ec.centerName,
         ec.province,
         ec.district,
         ec.village,
         ec.centerType,
         ec.programType,
         ec.foundingYear,
         ec.contactName,
         ec.phoneNumber,
         ec.email,
         ec.created_at,
         u.name as contactName,
         u.email as userEmail,
         COALESCE(s.stage1, 1) as stage1,
         COALESCE(s.stage2, 0) as stage2,
         COALESCE(s.stage3, 0) as stage3
       FROM educational_centers ec 
       INNER JOIN users u ON ec.user_id = u.id 
       LEFT JOIN stages s ON ec.user_id = s.user_id
       WHERE ec.user_id = ?`,
      [userId]
    );

    if (centers.length === 0) {
      return res.status(404).json({ message: "مرکز آموزشی یافت نشد" });
    }

    const center = centers[0];

    // Format the response
    const formattedCenter = {
      id: center.id,
      centerName: center.centerName,
      province: center.province,
      district: center.district,
      village: center.village,
      centerType: center.centerType,
      programType: center.programType,
      foundingYear: center.foundingYear,
      contactName: center.contactName,
      phoneNumber: center.phoneNumber,
      email: center.userEmail,
      stage1: center.stage1,
      stage2: center.stage2,
      stage3: center.stage3,
      createdAt: center.created_at,
    };

    res.json({ center: formattedCenter });
  } catch (error) {
    console.error("Error fetching center by user ID:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات مرکز آموزشی" });
  }
};
