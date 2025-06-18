const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Build the search condition
    const searchCondition = search
      ? 'WHERE name LIKE ? OR email LIKE ?'
      : '';
    const searchParams = search
      ? [`%${search}%`, `%${search}%`]
      : [];

    // Get total count for pagination
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total FROM users ${searchCondition}`,
      searchParams
    );
    const total = countResult[0].total;

    // Get paginated users
    const [users] = await db.promise().query(
      `SELECT id, name, email, role FROM users ${searchCondition} 
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...searchParams, limit, offset]
    );

    res.json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربران' });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Build the search condition with role filter
    let searchCondition = 'WHERE role = ?';
    let searchParams = [role];

    if (search) {
      searchCondition += ' AND (name LIKE ? OR email LIKE ?)';
      searchParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count for pagination
    const [countResult] = await db.promise().query(
      `SELECT COUNT(*) as total FROM users ${searchCondition}`,
      searchParams
    );
    const total = countResult[0].total;

    // Get paginated users by role
    const [users] = await db.promise().query(
      `SELECT id, name, email, role FROM users ${searchCondition} 
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...searchParams, limit, offset]
    );

    res.json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربران' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'institute', 'admin', 'employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'نقش نامعتبر است' });
    }

    // Check if user exists
    const [users] = await db.promise().query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // Update user role
    await db.promise().query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );

    res.json({ message: 'نقش کاربر با موفقیت بروزرسانی شد' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'خطا در بروزرسانی نقش کاربر' });
  }
}; 