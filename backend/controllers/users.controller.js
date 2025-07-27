const { promise } = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // Build the search condition
    const searchCondition = search ? "WHERE name LIKE ? OR email LIKE ?" : "";
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

    // Get total count for pagination
    const [countResult] = await promise.execute(
      `SELECT COUNT(*) as total FROM users ${searchCondition}`,
      searchParams
    );
    const total = countResult[0].total;

    // Get paginated users
    const [users] = await promise.execute(
      `SELECT id, name, email, role FROM users ${searchCondition} 
       ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
      searchParams
    );

    res.json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربران" });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    // Build the search condition with role filter
    let searchCondition = "WHERE role = ?";
    let searchParams = [role];

    if (search) {
      searchCondition += " AND (name LIKE ? OR email LIKE ?)";
      searchParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count for pagination
    const [countResult] = await promise.execute(
      `SELECT COUNT(*) as total FROM users ${searchCondition}`,
      searchParams
    );
    const total = countResult[0].total;

    // Get paginated users by role
    const [users] = await promise.execute(
      `SELECT id, name, email, role FROM users ${searchCondition} 
       ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
      searchParams
    );

    res.json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربران" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ["user", "institute", "admin", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "نقش نامعتبر است" });
    }

    // Check if user exists
    const [users] = await promise.execute("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    // Update user role
    await promise.execute("UPDATE users SET role = ? WHERE id = ?", [
      role,
      userId,
    ]);

    res.json({ message: "نقش کاربر با موفقیت بروزرسانی شد" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "خطا در بروزرسانی نقش کاربر" });
  }
};

/**
 * Update authenticated user's name
 * PUT /api/users/me
 */
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "نام باید حداقل ۳ حرف باشد" });
    }
    await promise.execute("UPDATE users SET name = ? WHERE id = ?", [
      name,
      userId,
    ]);
    res.json({ message: "نام با موفقیت بروزرسانی شد" });
  } catch (error) {
    console.error("Error updating user name:", error);
    res.status(500).json({ message: "خطا در بروزرسانی نام" });
  }
};

/**
 * Update authenticated user's password
 * PUT /api/users/me/password
 */
exports.updateMyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "رمز عبور فعلی و جدید الزامی است" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "رمز عبور جدید باید حداقل ۶ حرف باشد" });
    }
    // Get current hashed password
    const [users] = await promise.execute(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );
    if (!users.length) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    const user = users[0];
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور فعلی اشتباه است" });
    }
    const hashed = await hashPassword(newPassword);
    await promise.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      userId,
    ]);
    res.json({ message: "رمز عبور با موفقیت بروزرسانی شد" });
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ message: "خطا در بروزرسانی رمز عبور" });
  }
};
