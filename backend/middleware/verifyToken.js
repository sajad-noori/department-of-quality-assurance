const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'نیاز به ورود دارید.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'توکن نامعتبر است.' });
    }

    req.user = decoded; // decoded should include user id and any other claims
    next();
  });
};
