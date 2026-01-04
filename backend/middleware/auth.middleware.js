const jwt = require("jsonwebtoken");
const findUserById = require("../models/user.model").findUserById;

function extractToken(req) {
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
}

exports.authenticate = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "شما وارد نشده اید",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "توکن معتبر نیست یا منقضی شده است",
    });
  }
};

exports.checkRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "شما وارد نشده اید",
      });
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    try {
      const userFromDb = await findUserById(req.user.id);
      if (!userFromDb) {
        return res.status(401).json({
          success: false,
          message: "کاربر یافت نشد",
        });
      }

      if (!roles.includes(userFromDb.role)) {
        return res.status(403).json({
          success: false,
          message: "شما دسترسی به این بخش را ندارید",
        });
      }

      // attach the fresh user object (optional)
      req.user = { ...req.user, role: userFromDb.role };
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "خطا در بررسی سطح دسترسی",
      });
    }
  };
};
