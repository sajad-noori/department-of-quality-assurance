const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersByRole,
  updateUserRole,
  updateMe,
  updateMyPassword,
  deleteUser,
} = require("../controllers/users.controller");
const { authenticate, checkRole } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");

// Protected route - only admin can access user list
router.get("/", [authenticate, checkRole("admin"), authLimiter], getUsers);

// Protected route - employees can view institute users
router.get(
  "/role/:role",
  [authenticate, checkRole(["admin", "employee"]), authLimiter],
  getUsersByRole
);

// Protected route - only admin can update user roles
router.put(
  "/:userId/role",
  [authenticate, checkRole("admin"), authLimiter],
  updateUserRole
);

router.delete(
  "/:userId",
  [authenticate, checkRole("admin"), authLimiter],
  deleteUser
);

// Protected route - update own name
router.put("/me", [authenticate, authLimiter], updateMe);
// Protected route - update own password
router.put("/me/password", [authenticate, authLimiter], updateMyPassword);

module.exports = router;
