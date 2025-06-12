const { findUserByEmail } = require('../Models/user.model');
const { comparePassword } = require('../Utils/hash');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'ایمیل و پسورد لازم است' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز اشتباه است' });
    }

    const { id, name, role } = user;

    res.json({
      message: 'ورود موفق',
      user: { id, name, email, role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ورود' });
  }
};


const tempUsers = {}; // Temporary store (use Redis or DB in production)

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existing] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store temporarily
        tempUsers[email] = { name, email, password: hashedPassword, code };

        await sendEmail(email, code);

        res.status(200).json({ message: 'Verification code sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending verification email' });
    }
};

exports.verify = async (req, res) => {
    const { email, code } = req.body;
   
    const temp = tempUsers[email];
    if (!temp || temp.code !== code) {
        return res.status(400).json({ message: 'Invalid or expired code' });
    }

    try {
        await db.promise().query(
            'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
            [temp.name, temp.email, temp.password, 1]
        );

        delete tempUsers[email];

        res.status(201).json({ message: 'Account verified and registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.resendCode = async (req, res) => {
  const { email } = req.body;

  if (!tempUsers[email]) {
    return res.status(400).json({ message: "User not found or already verified" });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  tempUsers[email].code = verificationCode;

  try {
    await sendEmail(email, verificationCode);
    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send verification code" });
  }
};
