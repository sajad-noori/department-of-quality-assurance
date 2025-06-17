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

// Input validation helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { name: req.body.name, email: req.body.email });
    const { name, email, password } = req.body;

    // Input validation
    if (!name || name.trim().length < 3) {
      console.log('Name validation failed');
      return res.status(400).json({ message: 'نام باید حداقل ۳ حرف باشد' });
    }
    if (!validateEmail(email)) {
      console.log('Email validation failed');
      return res.status(400).json({ message: 'ایمیل معتبر نیست' });
    }
    if (!password || password.length < 6) {
      console.log('Password validation failed');
      return res.status(400).json({ message: 'رمز عبور باید حداقل ۶ حرف باشد' });
    }

    // Check database connection
    try {
      console.log('Checking for existing user...');
      const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        console.log('User already exists');
        return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است' });
      }
      console.log('No existing user found');
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ message: 'خطا در اتصال به پایگاه داده' });
    }

    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code');

    // Store verification data in memory (temporary solution)
    const verificationData = {
      name,
      email,
      hashedPassword,
      code,
      timestamp: Date.now()
    };
    
    // Store in memory (temporary solution)
    global.verificationStore = global.verificationStore || new Map();
    global.verificationStore.set(email, verificationData);
    
    // Set timeout to clean up verification data after 10 minutes
    setTimeout(() => {
      global.verificationStore.delete(email);
    }, 10 * 60 * 1000);

    // Send verification email
    try {
      console.log('Sending verification email...');
      await sendEmail(email, code);
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Clean up verification data if email fails
      global.verificationStore.delete(email);
      return res.status(500).json({ message: 'خطا در ارسال ایمیل تایید' });
    }

    console.log('Registration process completed successfully');
    res.json({ 
      message: 'کد تایید به ایمیل شما ارسال شد',
      email: email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'خطا در ثبت‌نام' });
  }
};

exports.verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('Verification attempt:', { email, code });

    // Get verification data from memory
    const verificationData = global.verificationStore?.get(email);
    
    if (!verificationData) {
      console.log('No verification data found for email:', email);
      return res.status(400).json({ message: 'کد تایید نامعتبر یا منقضی شده است' });
    }

    // Check if code is expired (10 minutes)
    if (Date.now() - verificationData.timestamp > 10 * 60 * 1000) {
      console.log('Verification code expired for email:', email);
      global.verificationStore.delete(email);
      return res.status(400).json({ message: 'کد تایید منقضی شده است' });
    }

    if (verificationData.code !== code) {
      console.log('Invalid verification code for email:', email);
      return res.status(400).json({ message: 'کد تایید نامعتبر است' });
    }

    // Create user in database
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'user')
    `;
    
    const [result] = await db.promise().query(sql, [
      verificationData.name,
      verificationData.email,
      verificationData.hashedPassword
    ]);

    // Clean up verification data
    global.verificationStore.delete(email);

    // Generate token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'ثبت نام با موفقیت انجام شد',
      token,
      user: {
        id: result.insertId,
        name: verificationData.name,
        email: verificationData.email
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'خطا در تایید ثبت نام' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است' });
    }

    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    const token = generateToken({ id: user.id, name: user.name, email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'ورود موفقیت‌آمیز',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطا در ورود' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'خروج موفقیت‌آمیز' });
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'ایمیل معتبر نیست' });
    }

    const data = await redisClient.get(`verify:${email}`);
    if (!data) {
      return res.status(400).json({ message: 'کاربر یافت نشد یا قبلاً تایید شده است' });
    }

    const parsed = JSON.parse(data);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    parsed.code = newCode;

    await redisClient.setEx(`verify:${email}`, 600, JSON.stringify(parsed));
    await sendEmail(email, newCode);

    res.json({ message: 'کد جدید به ایمیل شما ارسال شد' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ message: 'خطا در ارسال مجدد کد' });
  }
};

exports.getMe = (req, res) => {
  const user = req.user;
  if (!user) return res.sendStatus(401);
  res.json({ user });
}; 