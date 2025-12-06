const rateLimit = require("express-rate-limit");

// User-specific key generator for rate limiting
const getUserKey = (req) => {
  // Try to get user ID from authenticated token first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For simplicity, we'll use a combination of IP and user agent for now
    // In a real implementation, you'd decode the JWT to get the user ID
    return `${req.ip}-${req.get('User-Agent')}`;
  }
  
  // For unauthenticated requests, use IP + User-Agent combination
  // This helps distinguish different users on the same network
  return `${req.ip}-${req.get('User-Agent')}`;
};

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each user to 200 requests per windowMs
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit to 1000 requests per window
  message: "Too many requests, try again later.",
  keyGenerator: getUserKey,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

exports.questionnaireLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 30 requests per minute
  message: "Too many questionnaire requests, try again later.",
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth-specific rate limiters
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { message: "Too many attempts, please try again later." },
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    message: "Too many verification attempts, please try again later.",
  },
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    message: "Too many password reset requests, please try again later.",
  },
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    message: "Too many password reset attempts, please try again later.",
  },
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.verifyResetCodeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 attempts per 10 minutes
  message: {
    message: "Too many code verification attempts, please try again later.",
  },
  keyGenerator: getUserKey,
  standardHeaders: true,
  legacyHeaders: false,
});
