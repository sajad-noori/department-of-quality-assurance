import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../styles/AuthForm.css';

// Helper function to validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Decode JWT payload (base64 decode)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if user is logged in by validating stored token and extracting user info
function isLoggedIn() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const user = parseJwt(token);
  if (!user) return null;
  // Optional: you can check token expiry here if your token has exp field
  return user;
}

// ✅ LOGIN COMPONENT
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  // ✅ Redirect if already logged in
  useEffect(() => {
    const user = isLoggedIn();
    if (user) {
      navigate(user.role === 'admin' ? '/dashboard' : redirectPath, { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setError('ایمیل معتبر نیست');
    if (password.length < 6) return setError('رمز عبور باید حداقل ۶ حرف باشد');

    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true } // ✅ send cookie
      );

      const { user } = res.data;
      navigate(user.role === 'admin' ? '/dashboard' : redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🔐</div>
          </div>
          <h2 className="auth-title">ورود به سیستم</h2>
          <p className="auth-subtitle">لطفاً اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="label-icon" />
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="label-icon" />
              رمز عبور
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                در حال ورود...
              </>
            ) : (
              'ورود'
            )}
          </button>

          <div className="auth-footer">
            <div className="auth-links">
              <button
                type="button"
                className="auth-link forgot-password-link"
                onClick={() => navigate('/forgot-password')}
                disabled={isLoading}
              >
                رمز عبور خود را فراموش کرده اید؟
              </button>
              <p className="auth-link-text">
                حساب ندارید؟{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => navigate('/register')}
                  disabled={isLoading}
                >
                  ثبت‌نام
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ FORGOT PASSWORD COMPONENT
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setError('ایمیل معتبر نیست');

    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      );

      setSuccess('کد بازنشانی رمز عبور به ایمیل شما ارسال شد.');
      // Store email for verification step
      localStorage.setItem('resetEmail', email);
      setTimeout(() => {
        navigate('/verify-reset-code');
      }, 2000);
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err.response?.status === 404) {
        setError('کاربری با این ایمیل یافت نشد.');
      } else {
        setError(err.response?.data?.message || 'خطا در ارسال کد بازنشانی');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🔑</div>
          </div>
          <h2 className="auth-title">فراموشی رمز عبور</h2>
          <p className="auth-subtitle">ایمیل خود را وارد کنید تا کد بازنشانی ارسال شود</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="label-icon" />
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button forgot-password-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                در حال ارسال...
              </>
            ) : (
              'ارسال کد بازنشانی'
            )}
          </button>

          <div className="auth-footer">
            <button
              type="button"
              className="auth-link back-to-login"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              <FaArrowLeft className="back-icon" />
              بازگشت به صفحه ورود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ VERIFY RESET CODE COMPONENT
export function VerifyResetCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(resetEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return setError('کد باید ۶ رقم باشد');

    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/verify-reset-code',
        { email, code },
        { withCredentials: true }
      );

      // Store verification token for password reset
      localStorage.setItem('resetToken', res.data.token);
      navigate('/reset-password');
    } catch (err) {
      console.error('Verify reset code error:', err);
      if (err.response?.status === 400) {
        setError('کد نامعتبر یا منقضی شده است.');
      } else {
        setError(err.response?.data?.message || 'خطا در تایید کد');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      );
      setError('کد جدید ارسال شد.');
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ارسال کد جدید');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect to forgot-password
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🔐</div>
          </div>
          <h2 className="auth-title">تایید کد بازنشانی</h2>
          <p className="auth-subtitle">کد ۶ رقمی ارسال شده به {email} را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="code" className="form-label">
              <FaEnvelope className="label-icon" />
              کد تایید
            </label>
            <input
              id="code"
              type="text"
              className="form-input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              disabled={isLoading}
              style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button verify-code-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                در حال تایید...
              </>
            ) : (
              'تایید کد'
            )}
          </button>

          <div className="auth-footer">
            <div className="auth-links">
              <button
                type="button"
                className="auth-link resend-code-link"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                ارسال مجدد کد
              </button>
              <button
                type="button"
                className="auth-link back-to-login"
                onClick={() => {
                  localStorage.removeItem('resetEmail');
                  navigate('/login');
                }}
                disabled={isLoading}
              >
                <FaArrowLeft className="back-icon" />
                بازگشت به صفحه ورود
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ RESET PASSWORD COMPONENT
export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('رمز عبور باید حداقل ۶ حرف باشد');
    if (password !== confirmPassword) return setError('رمز عبور با تکرار آن مطابقت ندارد');

    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const resetToken = localStorage.getItem('resetToken');
      const res = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { token: resetToken, password },
        { withCredentials: true }
      );

      setSuccess('رمز عبور شما با موفقیت تغییر یافت.');
      
      // Clean up stored data
      localStorage.removeItem('resetToken');
      localStorage.removeItem('resetEmail');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.response?.status === 400) {
        setError('توکن نامعتبر یا منقضی شده است.');
        // Clean up invalid token
        localStorage.removeItem('resetToken');
        localStorage.removeItem('resetEmail');
      } else {
        setError(err.response?.data?.message || 'خطا در بازنشانی رمز عبور');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🔐</div>
          </div>
          <h2 className="auth-title">بازنشانی رمز عبور</h2>
          <p className="auth-subtitle">رمز عبور جدید خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="label-icon" />
              رمز عبور جدید
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور جدید خود را وارد کنید"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock className="label-icon" />
              تکرار رمز عبور جدید
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="رمز عبور جدید را دوباره وارد کنید"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button reset-password-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                در حال بازنشانی...
              </>
            ) : (
              'بازنشانی رمز عبور'
            )}
          </button>

          <div className="auth-footer">
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                localStorage.removeItem('resetToken');
                localStorage.removeItem('resetEmail');
                navigate('/login');
              }}
              disabled={isLoading}
            >
              بازگشت به صفحه ورود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ REGISTER COMPONENT
export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const user = isLoggedIn();
    if (user) {
      navigate(user.role === 'admin' ? '/dashboard' : '/home', { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registration form submitted');
    setIsLoading(true);
    setError('');

    // Validate inputs
    if (name.trim().length < 3) {
      console.log('Name validation failed');
      setIsLoading(false);
      return setError('نام باید حداقل ۳ حرف باشد');
    }
    if (!validateEmail(email)) {
      console.log('Email validation failed');
      setIsLoading(false);
      return setError('ایمیل معتبر نیست');
    }
    if (password.length < 6) {
      console.log('Password validation failed');
      setIsLoading(false);
      return setError('رمز عبور باید حداقل ۶ حرف باشد');
    }
    if (password !== confirmPassword) {
      console.log('Password confirmation failed');
      setIsLoading(false);
      return setError('رمز عبور با تکرار آن مطابقت ندارد');
    }

    console.log('Sending registration request...');
    
    try {
      console.log('Request payload:', { name, email, password });
      
      // Create axios instance with default config
      const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000',
        timeout: 30000, // Increased to 30 seconds
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Add request interceptor for logging
      axiosInstance.interceptors.request.use(request => {
        console.log('Starting Request:', request);
        return request;
      });

      // Add response interceptor for logging
      axiosInstance.interceptors.response.use(
        response => {
          console.log('Response:', response);
          return response;
        },
        error => {
          console.error('Response Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
              url: error.config?.url,
              method: error.config?.method,
              headers: error.config?.headers
            }
          });
          return Promise.reject(error);
        }
      );

      console.log('Making registration request to:', '/api/auth/register');
      const res = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        password
      });
      
      console.log('Registration response:', res.data);
      
      if (res.data) {
        console.log('Registration successful, preparing to redirect...');
        // Save registration data in localStorage
        const registrationData = {
          name,
          email: res.data.email || email, // Use email from response if available
          timestamp: new Date().toISOString(),
          status: 'pending_verification'
        };
        console.log('Saving registration data:', registrationData);
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        localStorage.setItem('pendingVerificationEmail', res.data.email || email);
        
        // Clear any existing auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        console.log('Redirecting to verification page...');
        const verificationUrl = '/verify-code?email=' + encodeURIComponent(res.data.email || email);
        console.log('Verification URL:', verificationUrl);
        
        // Use replace: true to prevent back navigation to registration
        navigate(verificationUrl, { replace: true });
      } else {
        console.log('Unexpected response:', res.data);
        setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      // Clear any partial registration data on error
      localStorage.removeItem('registrationData');
      localStorage.removeItem('pendingVerificationEmail');
      
      if (err.code === 'ERR_NETWORK') {
        setError('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
      } else if (err.code === 'ECONNABORTED') {
        setError('زمان اتصال به سرور به پایان رسید. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.');
      } else if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage) {
          setError(errorMessage);
        } else {
          setError('خطای سرور. لطفاً بعداً تلاش کنید.');
        }
      } else if (err.response?.status === 429) {
        setError('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.');
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage) {
          setError(errorMessage);
        } else {
          setError('اطلاعات وارد شده نامعتبر است.');
        }
      } else {
        setError(err.response?.data?.message || 'خطا در ثبت‌نام');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing registration data on component mount
  useEffect(() => {
    const registrationData = localStorage.getItem('registrationData');
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        console.log(data)
        // If registration is pending verification, redirect to verification page
        if (data.status === 'pending_verification') {
          navigate('/verify-code?email=' + encodeURIComponent(data.email));
        }
      } catch (error) {
        console.error('Error parsing registration data:', error);
        localStorage.removeItem('registrationData');
      }
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">📝</div>
          </div>
          <h2 className="auth-title">ثبت‌نام</h2>
          <p className="auth-subtitle">حساب کاربری جدید ایجاد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <FaUser className="label-icon" />
              نام کامل
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام کامل خود را وارد کنید"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="label-icon" />
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="label-icon" />
              رمز عبور
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock className="label-icon" />
              تکرار رمز عبور
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="رمز عبور را دوباره وارد کنید"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button register-button"
            disabled={isLoading}
            onClick={() => console.log('Register button clicked')}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                در حال ثبت‌نام...
              </>
            ) : (
              'ثبت‌نام'
            )}
          </button>

          <div className="auth-footer">
            <p className="auth-link-text">
              حساب دارید؟{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate('/login')}
                disabled={isLoading}
              >
                ورود
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
