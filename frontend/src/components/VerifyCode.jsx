import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">تایید ایمیل</h2>
            <p className="text-center mb-4">
              کد تایید به ایمیل <strong>{email}</strong> ارسال شد
            </p>

            <form onSubmit={handleVerify}>
              {error && <p className="text-danger text-center small">{error}</p>}
              {message && <p className="text-success text-center small">{message}</p>}
              
              <div className="mb-3">
                <label htmlFor="code" className="form-label">کد تایید</label>
                <input
                  id="code"
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="کد تایید را وارد کنید"
                  required
                  disabled={verifying}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    در حال تایید...
                  </>
                ) : 'تایید'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={handleResend}
                disabled={timer > 0 || resending}
              >
                {resending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    در حال ارسال...
                  </>
                ) : timer > 0 ? `ارسال مجدد (${timer} ثانیه)` : 'ارسال مجدد کد'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
