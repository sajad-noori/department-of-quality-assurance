const { promise } = require("../config/db");

/**
 * Create a new user log entry
 * @param {number} userId - User ID
 * @param {string} action - Action type (login, comment, download, visit, etc.)
 * @param {string} details - Additional details about the action
 * @param {string} ipAddress - User's IP address
 * @param {string} userAgent - User's browser/device info
 * @returns {Promise<Object>} Result of insert query
 */
const createUserLog = async (
  userId,
  action,
  details = null,
  ipAddress = null,
  userAgent = null
) => {
  try {
    const sql = `
      INSERT INTO user_logs (user_id, action, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await promise.execute(sql, [
      userId,
      action,
      details,
      ipAddress,
      userAgent,
    ]);
    return result;
  } catch (error) {
    console.error("Error creating user log:", error);
    throw error;
  }
};

/**
 * Get logs for a specific user with pagination
 * @param {number} userId - User ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} actionFilter - Filter by action type (optional)
 * @returns {Promise<Object>} Object with logs and pagination info
 */
const getUserLogs = async (
  userId,
  page = 1,
  limit = 20,
  actionFilter = null
) => {
  try {
    const offset = (page - 1) * limit;

    let sql = `
      SELECT * FROM user_logs 
      WHERE user_id = ?
    `;

    let countSql = `
      SELECT COUNT(*) as total FROM user_logs 
      WHERE user_id = ?
    `;

    const params = [userId];
    const countParams = [userId];

    if (actionFilter) {
      sql += " AND action = ?";
      countSql += " AND action = ?";
      params.push(actionFilter);
      countParams.push(actionFilter);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Get total count
    const [countResult] = await promise.execute(countSql, countParams);
    const total = countResult[0].total;

    // Get logs
    const [results] = await promise.execute(sql, params);

    return {
      logs: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error("Error getting user logs:", error);
    throw error;
  }
};

/**
 * Get all logs with user information (admin only)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} userId - Filter by user ID (optional)
 * @param {string} actionFilter - Filter by action type (optional)
 * @param {string} dateFilter - Filter by date range (optional)
 * @returns {Promise<Object>} Object with logs and pagination info
 */
const getAllLogsWithUserInfo = async (
  page = 1,
  limit = 50,
  userId = null,
  actionFilter = null,
  dateFilter = null
) => {
  try {
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        ul.id,
        ul.user_id,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        ec.centerName as institute_name,
        ul.action,
        ul.details,
        ul.ip_address,
        ul.user_agent,
        ul.created_at,
        ul.updated_at
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      LEFT JOIN educational_centers ec ON u.id = ec.user_id
      WHERE 1=1
    `;

    let countSql = `
      SELECT COUNT(*) as total 
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      LEFT JOIN educational_centers ec ON u.id = ec.user_id
      WHERE 1=1
    `;

    const params = [];
    const countParams = [];

    if (userId) {
      sql += " AND ul.user_id = ?";
      countSql += " AND ul.user_id = ?";
      params.push(userId);
      countParams.push(userId);
    }

    if (actionFilter) {
      sql += " AND ul.action = ?";
      countSql += " AND ul.action = ?";
      params.push(actionFilter);
      countParams.push(actionFilter);
    }

    if (dateFilter) {
      sql += " AND DATE(ul.created_at) = ?";
      countSql += " AND DATE(ul.created_at) = ?";
      params.push(dateFilter);
      countParams.push(dateFilter);
    }

    sql += ` ORDER BY ul.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Get total count
    const [countResult] = await promise.execute(countSql, countParams);
    const total = countResult[0].total;

    // Get logs
    const [results] = await promise.execute(sql, params);

    return {
      logs: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error("Error getting all logs with user info:", error);
    throw error;
  }
};

/**
 * Get log statistics for admin dashboard
 * @returns {Promise<Object>} Statistics object
 */
const getLogStatistics = async () => {
  try {
    const sql = `
      SELECT 
        action,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM user_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY action, DATE(created_at)
      ORDER BY date DESC, count DESC
    `;

    const [results] = await promise.execute(sql);

    // Process results into statistics
    const stats = {
      totalLogs: 0,
      actionBreakdown: {},
      dailyActivity: {},
      topActions: [],
    };

    results.forEach((row) => {
      stats.totalLogs += row.count;

      if (!stats.actionBreakdown[row.action]) {
        stats.actionBreakdown[row.action] = 0;
      }
      stats.actionBreakdown[row.action] += row.count;

      if (!stats.dailyActivity[row.date]) {
        stats.dailyActivity[row.date] = 0;
      }
      stats.dailyActivity[row.date] += row.count;
    });

    // Get top 5 actions
    stats.topActions = Object.entries(stats.actionBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));

    return stats;
  } catch (error) {
    console.error("Error getting log statistics:", error);
    throw error;
  }
};

/**
 * Delete old logs (cleanup function for admins)
 * @param {number} daysOld - Delete logs older than this many days
 * @returns {Promise<Object>} Result of delete operation
 */
const deleteOldLogs = async (daysOld = 90) => {
  try {
    const sql =
      "DELETE FROM user_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)";
    const [result] = await promise.execute(sql, [daysOld]);
    return result;
  } catch (error) {
    console.error("Error deleting old logs:", error);
    throw error;
  }
};

/**
 * Check if a visit log exists for a user for today
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
const hasVisitLogToday = async (userId) => {
  try {
    const sql = `SELECT COUNT(*) as count FROM user_logs WHERE user_id = ? AND action = 'visit' AND DATE(created_at) = CURDATE()`;
    const [results] = await promise.execute(sql, [userId]);
    return results[0].count > 0;
  } catch (error) {
    console.error("Error checking visit log today:", error);
    throw error;
  }
};

module.exports = {
  createUserLog,
  getUserLogs,
  getAllLogsWithUserInfo,
  getLogStatistics,
  deleteOldLogs,
  hasVisitLogToday,
};
