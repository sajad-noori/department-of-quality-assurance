const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const rateLimit = require("express-rate-limit");
const { authenticate } = require("../middleware/auth.middleware");
const { logLogin } = require("../middleware/logging.middleware");

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 5 attempts per window
  message: { message: "Too many attempts, please try again later." },
});

const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 300, // 3 attempts per hour
  message: {
    message: "Too many verification attempts, please try again later.",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // 5 attempts per hour
  message: {
    message: "Too many password reset requests, please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 10 attempts per hour
  message: {
    message: "Too many password reset attempts, please try again later.",
  },
});

const verifyResetCodeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 10 attempts per 10 minutes
  message: {
    message: "Too many code verification attempts, please try again later.",
  },
});

// Apply rate limiting to routes
router.post("/register", authLimiter, authController.register);
router.post("/verify", verifyLimiter, authController.verify);
router.post("/login", [authLimiter, logLogin()], authController.login);
router.post("/resend-code", authLimiter, authController.resendCode);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  authController.forgotPassword
);
router.post(
  "/verify-reset-code",
  verifyResetCodeLimiter,
  authController.verifyResetCode
);
router.post(
  "/reset-password",
  resetPasswordLimiter,
  authController.resetPassword
);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
