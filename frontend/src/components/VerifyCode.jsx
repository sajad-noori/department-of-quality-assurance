import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyCode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');

  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const response = await axios.post('/api/auth/verify', {
        email,
        code
      });

      setMessage(response.data.message);
      setError('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
      setMessage('');
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/resend-code', { email });

      setMessage(response.data.message || "Code resent successfully.");
      setTimer(60); // restart countdown
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Email Verification</h2>
      <p>We sent a code to <strong>{email}</strong></p>

      <form onSubmit={handleVerify} style={styles.form}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Verify</button>
      </form>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleResend}
          disabled={timer > 0 || resending}
          style={{
            ...styles.resendButton,
            backgroundColor: timer > 0 || resending ? '#ccc' : '#28a745',
            cursor: timer > 0 || resending ? 'not-allowed' : 'pointer'
          }}
        >
          {resending ? 'Resending...' : timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
        </button>
      </div>

      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '100px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center'
  },
  form: {
    marginTop: 20
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    border: '1px solid #aaa'
  },
  button: {
    padding: 10,
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  resendButton: {
    padding: 10,
    width: '100%',
    color: 'white',
    border: 'none',
    borderRadius: 4
  }
};

export default VerifyCode;
