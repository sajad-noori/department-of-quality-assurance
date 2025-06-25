import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../styles/AuthForm.css';

const VerifyCode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || localStorage.getItem('pendingVerificationEmail');

  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Check for registration data
    const registrationData = localStorage.getItem('registrationData');
    if (!email || !registrationData) {
      console.log('No registration data found, redirecting to register');
      navigate('/register');
      return;
    }

    try {
      const data = JSON.parse(registrationData);
      if (data.status !== 'pending_verification' || data.email !== email) {
        console.log('Invalid registration data, redirecting to register');
        localStorage.removeItem('registrationData');
        localStorage.removeItem('pendingVerificationEmail');
        navigate('/register');
        return;
      }
    } catch (error) {
      console.error('Error parsing registration data:', error);
      localStorage.removeItem('registrationData');
      localStorage.removeItem('pendingVerificationEmail');
      navigate('/register');
      return;
    }

    console.log('Verification page loaded with email:', email);

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('لطفاً کد تایید را وارد کنید');
      return;
    }

    setVerifying(true);
    setError('');
    setMessage('');

    try {
      console.log('Sending verification request for email:', email);
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify',
        { email, code },
        { withCredentials: true }
      );

      console.log('Verification response:', response.data);
      setMessage('ایمیل شما با موفقیت تایید شد');
      
      // Clear all registration data
      localStorage.removeItem('registrationData');
      localStorage.removeItem('pendingVerificationEmail');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'خطا در تایید کد');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/resend-code',
        { email },
        { withCredentials: true }
      );
      setMessage('کد جدید با موفقیت ارسال شد');
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ارسال مجدد کد');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">��</div>
          </div>
          <h2 className="auth-title">تایید ایمیل</h2>
          <p className="auth-subtitle">
            کد تایید به ایمیل <strong>{email}</strong> ارسال شد
          </p>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {message}
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
              disabled={verifying}
              style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button verify-code-button"
            disabled={verifying}
          >
            {verifying ? (
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
                onClick={handleResend}
                disabled={timer > 0 || resending}
              >
                {resending ? (
                  <>
                    <FaSpinner className="spinner" />
                    در حال ارسال...
                  </>
                ) : timer > 0 ? (
                  `ارسال مجدد (${timer} ثانیه)`
                ) : (
                  'ارسال مجدد کد'
                )}
              </button>
              <button
                type="button"
                className="auth-link back-to-login"
                onClick={() => {
                  localStorage.removeItem('registrationData');
                  localStorage.removeItem('pendingVerificationEmail');
                  navigate('/register');
                }}
                disabled={verifying || resending}
              >
                <FaArrowLeft className="back-icon" />
                بازگشت به ثبت‌نام
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
