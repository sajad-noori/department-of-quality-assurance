const db = require('../config/db');

/**
 * Create a new user log entry
 * @param {number} userId - User ID
 * @param {string} action - Action type (login, comment, download, visit, etc.)
 * @param {string} details - Additional details about the action
 * @param {string} ipAddress - User's IP address
 * @param {string} userAgent - User's browser/device info
 * @returns {Promise<Object>} Result of insert query
 */
const createUserLog = (userId, action, details = null, ipAddress = null, userAgent = null) => {
  const sql = `
    INSERT INTO user_logs (user_id, action, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  return new Promise((resolve, reject) => {
    db.query(sql, [userId, action, details, ipAddress, userAgent], (err, result) => {
      if (err) {
        console.error('Error creating user log:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Get logs for a specific user with pagination
 * @param {number} userId - User ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @param {string} actionFilter - Filter by action type (optional)
 * @returns {Promise<Object>} Object with logs and pagination info
 */
const getUserLogs = (userId, page = 1, limit = 20, actionFilter = null) => {
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
    sql += ' AND action = ?';
    countSql += ' AND action = ?';
    params.push(actionFilter);
    countParams.push(actionFilter);
  }
  
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  return new Promise((resolve, reject) => {
    // Get total count
    db.query(countSql, countParams, (err, countResult) => {
      if (err) return reject(err);
      
      const total = countResult[0].total;
      
      // Get logs
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        
        resolve({
          logs: results,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        });
      });
    });
  });
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
const getAllLogsWithUserInfo = (page = 1, limit = 50, userId = null, actionFilter = null, dateFilter = null) => {
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
    sql += ' AND ul.user_id = ?';
    countSql += ' AND ul.user_id = ?';
    params.push(userId);
    countParams.push(userId);
  }
  
  if (actionFilter) {
    sql += ' AND ul.action = ?';
    countSql += ' AND ul.action = ?';
    params.push(actionFilter);
    countParams.push(actionFilter);
  }
  
  if (dateFilter) {
    sql += ' AND DATE(ul.created_at) = ?';
    countSql += ' AND DATE(ul.created_at) = ?';
    params.push(dateFilter);
    countParams.push(dateFilter);
  }
  
  sql += ' ORDER BY ul.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  return new Promise((resolve, reject) => {
    // Get total count
    db.query(countSql, countParams, (err, countResult) => {
      if (err) return reject(err);
      
      const total = countResult[0].total;
      
      // Get logs
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        
        resolve({
          logs: results,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        });
      });
    });
  });
};

/**
 * Get log statistics for admin dashboard
 * @returns {Promise<Object>} Statistics object
 */
const getLogStatistics = () => {
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
  
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      
      // Process results into statistics
      const stats = {
        totalLogs: 0,
        actionBreakdown: {},
        dailyActivity: {},
        topActions: []
      };
      
      results.forEach(row => {
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
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([action, count]) => ({ action, count }));
      
      resolve(stats);
    });
  });
};

/**
 * Delete old logs (cleanup function for admins)
 * @param {number} daysOld - Delete logs older than this many days
 * @returns {Promise<Object>} Result of delete operation
 */
const deleteOldLogs = (daysOld = 90) => {
  const sql = 'DELETE FROM user_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)';
  
  return new Promise((resolve, reject) => {
    db.query(sql, [daysOld], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  createUserLog,
  getUserLogs,
  getAllLogsWithUserInfo,
  getLogStatistics,
  deleteOldLogs
}; 