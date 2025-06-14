const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const sendEmail = require('../utils/sendEmail');
const redisClient = require('../utils/redisClient');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(400).json({ message: 'Email already exists.' });
  }

  const hashedPassword = await hashPassword(password);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.setEx(`verify:${email}`, 600, JSON.stringify({ name, email, hashedPassword, code }));
  await sendEmail(email, code);

  res.json({ message: 'Verification code sent to email.' });
};

exports.verify = async (req, res) => {
  const { email, code } = req.body;
  const data = await redisClient.get(`verify:${email}`);
  if (!data) return res.status(400).json({ message: 'Invalid or expired code.' });

  const parsed = JSON.parse(data);
  if (parsed.code !== code) return res.status(400).json({ message: 'Incorrect code.' });

  await db.promise().query(
    'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
    [parsed.name, parsed.email, parsed.hashedPassword, 1]
  );

  await redisClient.del(`verify:${email}`);
  res.status(201).json({ message: 'Registration complete.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken({ id: user.id, name: user.name, email, role: user.role });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, role: user.role } });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

exports.resendCode = async (req, res) => {
  const { email } = req.body;

  const data = await redisClient.get(`verify:${email}`);
  if (!data) {
    return res.status(400).json({ message: 'User not found or already verified.' });
  }

  const parsed = JSON.parse(data);
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  parsed.code = newCode;

  await redisClient.setEx(`verify:${email}`, 600, JSON.stringify(parsed));
  await sendEmail(email, newCode);

  res.json({ message: 'New verification code sent to your email.' });
};
