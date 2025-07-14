const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');
const { authenticate, checkRole } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(checkRole(['admin']));

/**
 * @route GET /api/logs
 * @desc Get all logs with filtering and pagination
 * @access Admin only
 */
router.get('/', logsController.getAllLogs);

/**
 * @route GET /api/logs/user/:userId
 * @desc Get logs for a specific user
 * @access Admin only
 */
router.get('/user/:userId', logsController.getUserLogs);

/**
 * @route GET /api/logs/statistics
 * @desc Get log statistics for dashboard
 * @access Admin only
 */
router.get('/statistics', logsController.getLogStatistics);

/**
 * @route GET /api/logs/actions
 * @desc Get available log action types for filtering
 * @access Admin only
 */
router.get('/actions', logsController.getLogActions);

/**
 * @route GET /api/logs/export
 * @desc Export logs to CSV
 * @access Admin only
 */
router.get('/export', logsController.exportLogs);

/**
 * @route DELETE /api/logs/cleanup
 * @desc Delete old logs
 * @access Admin only
 */
router.delete('/cleanup', logsController.cleanupOldLogs);

module.exports = router; 