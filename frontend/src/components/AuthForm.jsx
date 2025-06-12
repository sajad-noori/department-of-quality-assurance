import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Helper function to validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper to check if user is already logged in
function isLoggedIn() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ✅ LOGIN COMPONENT
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const user = res.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.role === 'admin' ? '/dashboard' : redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ورود');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">ورود</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-danger text-center small">{error}</p>}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">ایمیل</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">رمز عبور</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '38px',
                    left: '12px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    userSelect: 'none',
                  }}
                  title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
              <button type="submit" className="btn btn-primary w-100">ورود</button>
              <p className="text-center mt-3 mb-0 small">
                حساب ندارید؟{' '}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => navigate('/register')}
                >
                  ثبت‌نام
                </button>
              </p>
            </form>
          </div>
        </div>
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
    if (name.trim().length < 3) return setError('نام باید حداقل ۳ حرف باشد');
    if (!validateEmail(email)) return setError('ایمیل معتبر نیست');
    if (password.length < 6) return setError('رمز عبور باید حداقل ۶ حرف باشد');
    if (password !== confirmPassword) return setError('رمز عبور با تکرار آن مطابقت ندارد');

    setError('');
    try {
      await axios.post('/api/auth/register', { name, email, password });
      navigate('/verify-code?email=' + encodeURIComponent(email));
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">ثبت‌ نام</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-danger text-center small">{error}</p>}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">نام کامل</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">ایمیل</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">رمز عبور</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '38px',
                    left: '12px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    userSelect: 'none',
                  }}
                  title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">تکرار رمز عبور</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">ثبت‌نام</button>
              <p className="text-center mt-3 mb-0 small">
                حساب دارید؟{' '}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => navigate('/login')}
                >
                  ورود
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
