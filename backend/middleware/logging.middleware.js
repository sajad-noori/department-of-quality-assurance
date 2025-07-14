const userLogModel = require('../models/userLog.model');

/**
 * Middleware to log user activities
 * @param {string} action - The action to log
 * @param {Function} getDetails - Function to get details (optional)
 * @returns {Function} Express middleware
 */
const logUserActivity = (action, getDetails = null) => {
  return async (req, res, next) => {
    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override send method to log after response
    res.send = function(data) {
      // Restore original methods
      res.send = originalSend;
      res.json = originalJson;
      
      // Log the activity if user is authenticated and response is successful
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = getDetails ? getDetails(req, data) : null;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          // Log asynchronously without blocking the response
          userLogModel.createUserLog(
            req.user.id,
            action,
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging user activity:', err);
          });
        } catch (err) {
          console.error('Error in logging middleware:', err);
        }
      }
      
      // Call original send
      return originalSend.call(this, data);
    };
    
    // Override json method to log after response
    res.json = function(data) {
      // Restore original methods
      res.send = originalSend;
      res.json = originalJson;
      
      // Log the activity if user is authenticated and response is successful
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = getDetails ? getDetails(req, data) : null;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          // Log asynchronously without blocking the response
          userLogModel.createUserLog(
            req.user.id,
            action,
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging user activity:', err);
          });
        } catch (err) {
          console.error('Error in logging middleware:', err);
        }
      }
      
      // Call original json
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log specific actions with custom details
 * @param {string} action - The action to log
 * @param {Function} getDetails - Function to get details
 * @returns {Function} Express middleware
 */
const logCustomActivity = (action, getDetails) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override both send and json methods
    res.send = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = getDetails(req, data);
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            action,
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging custom activity:', err);
          });
        } catch (err) {
          console.error('Error in custom logging middleware:', err);
        }
      }
      
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = getDetails(req, data);
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            action,
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging custom activity:', err);
          });
        } catch (err) {
          console.error('Error in custom logging middleware:', err);
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log file downloads
 * @returns {Function} Express middleware
 */
const logDownload = () => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    const originalDownload = res.download;
    
    // Override send method
    res.send = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      res.download = originalDownload;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const fileName = req.params.filename || req.query.file || 'unknown';
          const documentInfo = req.documentInfo || {};
          const details = `Downloaded file: ${documentInfo.name || fileName} (${documentInfo.category || 'unknown category'})`;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            'download',
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging download activity:', err);
          });
        } catch (err) {
          console.error('Error in download logging middleware:', err);
        }
      }
      
      return originalSend.call(this, data);
    };
    
    // Override json method
    res.json = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      res.download = originalDownload;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const fileName = req.params.filename || req.query.file || 'unknown';
          const documentInfo = req.documentInfo || {};
          const details = `Downloaded file: ${documentInfo.name || fileName} (${documentInfo.category || 'unknown category'})`;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            'download',
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging download activity:', err);
          });
        } catch (err) {
          console.error('Error in download logging middleware:', err);
        }
      }
      
      return originalJson.call(this, data);
    };
    
    // Override download method
    res.download = function(filePath, filename, options, callback) {
      res.send = originalSend;
      res.json = originalJson;
      res.download = originalDownload;
      
      if (req.user) {
        try {
          const documentInfo = req.documentInfo || {};
          const details = `Downloaded file: ${documentInfo.name || filename} (${documentInfo.category || 'unknown category'})`;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            'download',
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging download activity:', err);
          });
        } catch (err) {
          console.error('Error in download logging middleware:', err);
        }
      }
      
      return originalDownload.call(this, filePath, filename, options, callback);
    };
    
    next();
  };
};

/**
 * Middleware to log comments
 * @returns {Function} Express middleware
 */
const logComment = () => {
  return logCustomActivity('comment', (req, data) => {
    const newsId = req.params.newsId || 'unknown';
    const commentText = req.body.comment ? req.body.comment.substring(0, 100) : '';
    return `Commented on news ID: ${newsId} - "${commentText}${commentText.length >= 100 ? '...' : ''}"`;
  });
};

/**
 * Middleware to log questions
 * @returns {Function} Express middleware
 */
const logQuestion = () => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override send method
    res.send = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const questionText = req.body.question ? req.body.question.substring(0, 100) : '';
          const details = `Asked question: "${questionText}${questionText.length >= 100 ? '...' : ''}"`;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            'question',
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging question activity:', err);
          });
        } catch (err) {
          console.error('Error in question logging middleware:', err);
        }
      }
      
      return originalSend.call(this, data);
    };
    
    // Override json method
    res.json = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const questionText = req.body.question ? req.body.question.substring(0, 100) : '';
          const details = `Asked question: "${questionText}${questionText.length >= 100 ? '...' : ''}"`;
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          userLogModel.createUserLog(
            req.user.id,
            'question',
            details,
            ipAddress,
            userAgent
          ).catch(err => {
            console.error('Error logging question activity:', err);
          });
        } catch (err) {
          console.error('Error in question logging middleware:', err);
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log login attempts
 * @returns {Function} Express middleware
 */
const logLogin = () => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Override both send and json methods
    res.send = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      // Log login attempt regardless of authentication status
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          const details = parsedData.message === 'ورود موفقیت‌آمیز' ? 'Login successful' : 'Login failed';
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          // For successful login, we need to get the user ID from the response
          if (parsedData.user && parsedData.user.id) {
            userLogModel.createUserLog(
              parsedData.user.id,
              'login',
              details,
              ipAddress,
              userAgent
            ).catch(err => {
              console.error('Error logging login activity:', err);
            });
          }
        } catch (err) {
          console.error('Error in login logging middleware:', err);
        }
      }
      
      return originalSend.call(this, data);
    };
    
    res.json = function(data) {
      res.send = originalSend;
      res.json = originalJson;
      
      // Log login attempt regardless of authentication status
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const details = data.message === 'ورود موفقیت‌آمیز' ? 'Login successful' : 'Login failed';
          const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
          const userAgent = req.headers['user-agent'];
          
          // For successful login, we need to get the user ID from the response
          if (data.user && data.user.id) {
            userLogModel.createUserLog(
              data.user.id,
              'login',
              details,
              ipAddress,
              userAgent
            ).catch(err => {
              console.error('Error logging login activity:', err);
            });
          }
        } catch (err) {
          console.error('Error in login logging middleware:', err);
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log page visits (for authenticated users)
 * @param {string} pageName - Name of the page being visited
 * @returns {Function} Express middleware
 */
const logPageVisit = (pageName) => {
  return logUserActivity('visit', () => `Visited page: ${pageName}`);
};

/**
 * Middleware to log admin actions
 * @returns {Function} Express middleware
 */
const logAdminAction = () => {
  return logCustomActivity('admin_action', (req, data) => {
    const action = req.method + ' ' + req.originalUrl;
    const details = req.body ? JSON.stringify(req.body).substring(0, 200) : '';
    return `Admin action: ${action}${details ? ` - ${details}` : ''}`;
  });
};

module.exports = {
  logUserActivity,
  logCustomActivity,
  logDownload,
  logComment,
  logQuestion,
  logLogin,
  logPageVisit,
  logAdminAction
}; 