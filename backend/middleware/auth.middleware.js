const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'شما وارد نشده اید' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'توکن معتبر نیست یا منقضی شده است' });
  }
};

exports.authenticate = (req, res, next) => {
  // Check for token in cookies
  let token = req.cookies.token;
  
  // If not in cookies, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'شما وارد نشده اید'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'توکن معتبر نیست یا منقضی شده است'
    });
  }
};

exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'شما وارد نشده اید'
      });
    }
    
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'شما دسترسی به این بخش را ندارید'
      });
    }
    
    next();
  };
};