const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  authLimiter,
  verifyLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  verifyResetCodeLimiter
} = require("../middleware/rateLimiter");
const { authenticate } = require("../middleware/auth.middleware");
const { logLogin } = require("../middleware/logging.middleware");

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
