const userLogModel = require('../models/userLog.model');

/**
 * Get all logs with user information (admin only)
 * @route GET /api/logs
 * @access Admin only
 */
const getAllLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      action, 
      date,
      search 
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'پارامترهای صفحه‌بندی نامعتبر هستند'
      });
    }

    // Get logs with filters
    const result = await userLogModel.getAllLogsWithUserInfo(
      pageNum,
      limitNum,
      userId,
      action,
      date
    );

    // Filter by search term if provided
    let filteredLogs = result.logs;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = result.logs.filter(log => 
        log.user_name?.toLowerCase().includes(searchLower) ||
        log.user_email?.toLowerCase().includes(searchLower) ||
        log.details?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: {
        logs: filteredLogs,
        pagination: result.pagination
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لاگ‌ها'
    });
  }
};

/**
 * Get logs for a specific user (admin only)
 * @route GET /api/logs/user/:userId
 * @access Admin only
 */
const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, action } = req.query;

    // Validate user ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'شناسه کاربر نامعتبر است'
      });
    }

    const result = await userLogModel.getUserLogs(
      parseInt(userId),
      parseInt(page),
      parseInt(limit),
      action
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لاگ‌های کاربر'
    });
  }
};

/**
 * Get log statistics for admin dashboard
 * @route GET /api/logs/statistics
 * @access Admin only
 */
const getLogStatistics = async (req, res) => {
  try {
    const stats = await userLogModel.getLogStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching log statistics:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار لاگ‌ها'
    });
  }
};

/**
 * Delete old logs (admin only)
 * @route DELETE /api/logs/cleanup
 * @access Admin only
 */
const cleanupOldLogs = async (req, res) => {
  try {
    const { daysOld = 90 } = req.body;

    // Validate days parameter
    if (!daysOld || isNaN(daysOld) || daysOld < 1 || daysOld > 365) {
      return res.status(400).json({
        success: false,
        message: 'تعداد روزها باید بین 1 تا 365 باشد'
      });
    }

    const result = await userLogModel.deleteOldLogs(parseInt(daysOld));

    res.json({
      success: true,
      message: `${result.affectedRows} لاگ قدیمی حذف شد`,
      data: {
        deletedCount: result.affectedRows,
        daysOld: parseInt(daysOld)
      }
    });
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در پاکسازی لاگ‌های قدیمی'
    });
  }
};

/**
 * Export logs to CSV (admin only)
 * @route GET /api/logs/export
 * @access Admin only
 */
const exportLogs = async (req, res) => {
  try {
    const { userId, action, date, format = 'csv' } = req.query;

    // Get all logs without pagination for export
    const result = await userLogModel.getAllLogsWithUserInfo(
      1,
      10000, // Large limit to get all logs
      userId,
      action,
      date
    );

    if (format === 'csv') {
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="user_logs.csv"');

      // Create CSV header
      const csvHeader = 'ID,User ID,User Name,User Email,User Role,Action,Details,IP Address,User Agent,Created At\n';
      res.write(csvHeader);

      // Write each log as CSV row
      result.logs.forEach(log => {
        const csvRow = [
          log.id,
          log.user_id,
          `"${log.user_name || ''}"`,
          `"${log.user_email || ''}"`,
          `"${log.user_role || ''}"`,
          `"${log.action || ''}"`,
          `"${(log.details || '').replace(/"/g, '""')}"`,
          `"${log.ip_address || ''}"`,
          `"${(log.user_agent || '').replace(/"/g, '""')}"`,
          `"${log.created_at || ''}"`
        ].join(',') + '\n';
        
        res.write(csvRow);
      });

      res.end();
    } else {
      res.status(400).json({
        success: false,
        message: 'فرمت نامعتبر است. فقط CSV پشتیبانی می‌شود'
      });
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در صادرات لاگ‌ها'
    });
  }
};

/**
 * Get available log actions for filtering
 * @route GET /api/logs/actions
 * @access Admin only
 */
const getLogActions = async (req, res) => {
  try {
    const db = require('../config/db');
    
    const sql = 'SELECT DISTINCT action FROM user_logs ORDER BY action';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching log actions:', err);
        return res.status(500).json({
          success: false,
          message: 'خطا در دریافت انواع لاگ‌ها'
        });
      }

      const actions = results.map(row => row.action);

      res.json({
        success: true,
        data: actions
      });
    });
  } catch (error) {
    console.error('Error fetching log actions:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت انواع لاگ‌ها'
    });
  }
};

module.exports = {
  getAllLogs,
  getUserLogs,
  getLogStatistics,
  cleanupOldLogs,
  exportLogs,
  getLogActions
}; 