const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promise } = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { sendVerificationEmail } = require("../utils/sendEmail");
const ProfileImage = require("../models/profile_image.model");
const findUserById = require("../models/user.model").findUserById;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Input validation helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "نام باید حداقل ۳ حرف باشد" });
    }
    if (!validateEmail(email)) {
      console.log("Email validation failed");
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }
    if (!password || password.length < 6) {
      console.log("Password validation failed");
      return res
        .status(400)
        .json({ message: "رمز عبور باید حداقل ۶ حرف باشد" });
    }

    // Check database connection
    try {
      console.log("Checking for existing user...");
      const [existing] = await promise.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        console.log("User already exists");
        return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
      }
      console.log("No existing user found");
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ message: "خطا در اتصال به پایگاه داده" });
    }

    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated verification code");

    // Store verification data in memory (temporary solution)
    const verificationData = {
      name,
      email,
      hashedPassword,
      code,
      timestamp: Date.now(),
    };

    // Store in memory (temporary solution)
    global.verificationStore = global.verificationStore || new Map();
    global.verificationStore.set(email, verificationData);

    // Set timeout to clean up verification data after 10 minutes
    setTimeout(() => {
      global.verificationStore.delete(email);
    }, 10 * 60 * 1000);

    // Send verification email
    try {
      console.log("Sending verification email...");
      await sendVerificationEmail(email, code);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Clean up verification data if email fails
      global.verificationStore.delete(email);
      return res.status(500).json({ message: "خطا در ارسال ایمیل تایید" });
    }

    console.log("Registration process completed successfully");
    res.json({
      message: "کد تایید به ایمیل شما ارسال شد",
      email: email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "خطا در ثبت‌نام" });
  }
};

exports.verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log("Verification attempt:", { email, code });

    // Get verification data from memory
    const verificationData = global.verificationStore?.get(email);

    if (!verificationData) {
      console.log("No verification data found for email:", email);
      return res
        .status(400)
        .json({ message: "کد تایید نامعتبر یا منقضی شده است" });
    }

    // Check if code is expired (10 minutes)
    if (Date.now() - verificationData.timestamp > 10 * 60 * 1000) {
      console.log("Verification code expired for email:", email);
      global.verificationStore.delete(email);
      return res.status(400).json({ message: "کد تایید منقضی شده است" });
    }

    if (verificationData.code !== code) {
      console.log("Invalid verification code for email:", email);
      return res.status(400).json({ message: "کد تایید نامعتبر است" });
    }

    // Create user in database
    const sql = `
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES (?, ?, ?, 'user', 1)
    `;

    const [result] = await promise.query(sql, [
      verificationData.name,
      verificationData.email,
      verificationData.hashedPassword,
    ]);

    // Clean up verification data
    global.verificationStore.delete(email);

    // Generate token (include basic role information for authorization middleware)
    const tokenPayload = {
      id: result.insertId,
      name: verificationData.name,
      role: "user",
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "ثبت نام با موفقیت انجام شد",
      token,
      user: {
        id: result.insertId,
        name: verificationData.name,
        email: verificationData.email,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "خطا در تایید ثبت نام" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" });
    }

    const [users] = await promise.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.status(200).json({
      message: "ورود موفقیت‌آمیز",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "خطا 13 در ورود" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "خروج موفقیت‌آمیز" });
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }

    // Use in-memory verification store instead of Redis
    const store = global.verificationStore || new Map();
    const existing = store.get(email);
    if (!existing) {
      return res
        .status(400)
        .json({ message: "کاربر یافت نشد یا قبلاً تایید شده است" });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const updated = { ...existing, code: newCode, timestamp: Date.now() };
    store.set(email, updated);
    global.verificationStore = store;

    await sendVerificationEmail(email, newCode);

    // Refresh expiry: clear after 10 minutes
    setTimeout(() => {
      store.delete(email);
    }, 10 * 60 * 1000);

    res.json({ message: "کد جدید به ایمیل شما ارسال شد" });
  } catch (error) {
    console.error("Resend code error:", error);
    res.status(500).json({ message: "خطا در ارسال مجدد کد" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    if (!user) return res.sendStatus(401);

    // Get user's profile image
    const profileImage = await ProfileImage.findByUserId(user.id);

    const userData = {
      ...user,
      profileImage: profileImage
        ? `/uploads/profile/${profileImage.file_name}`
        : null,
    };

    res.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "ایمیل معتبر نیست" });
    }

    // Check if user exists
    const [users] = await promise.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "کاربری با این ایمیل یافت نشد" });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store reset code in database
    await promise.query(
      "UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?",
      [resetCode, resetCodeExpiry, email]
    );

    // Send reset email with code
    const emailSubject = "کد بازنشانی رمز عبور";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">بازنشانی رمز عبور</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            سلام ${user.name}،
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            درخواست بازنشانی رمز عبور برای حساب کاربری شما دریافت شده است.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            کد بازنشانی شما:
          </p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${resetCode}</span>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            این کد تا ۱۰ دقیقه معتبر است.
          </p>
          <p style="color: #666; font-size: 14px; text-align: center;">
            اگر شما این درخواست را نکرده‌اید، این ایمیل را نادیده بگیرید.
          </p>
        </div>
      </div>
    `;

    const sendEmail = require("../utils/sendEmail");
    await sendEmail(email, emailSubject, emailBody);

    res.json({
      message: "کد بازنشانی رمز عبور ارسال شد",
      email: email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "خطا در ارسال کد بازنشانی" });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code || code.length !== 6) {
      return res.status(400).json({ message: "ایمیل و کد ۶ رقمی الزامی است" });
    }

    // Find user with valid reset code
    const [users] = await promise.query(
      "SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expiry > NOW()",
      [email, code]
    );

    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: "کد نامعتبر یا منقضی شده است" });
    }

    // Generate temporary token for password reset
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store reset token and clear reset code
    await promise.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ?, reset_code = NULL, reset_code_expiry = NULL WHERE id = ?",
      [resetToken, resetTokenExpiry, user.id]
    );

    res.json({
      message: "کد تایید شد",
      token: resetToken,
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ message: "خطا در تایید کد" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "توکن و رمز عبور جدید الزامی است" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "رمز عبور باید حداقل ۶ حرف باشد" });
    }

    // Find user with valid reset token
    const [users] = await promise.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );

    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: "توکن نامعتبر یا منقضی شده است" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await promise.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.json({ message: "رمز عبور با موفقیت بازنشانی شد" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "خطا در بازنشانی رمز عبور" });
  }
};
