import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaHeadset, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const ReviewAndSubmit = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stepsCompleted, setStepsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkStepsCompletion = async () => {
      if (!user || user.role !== 'institute') return;

      try {
        const response = await axios.get('http://localhost:5000/api/accreditation/check-completion', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        setCompletionData(response.data);
        setStepsCompleted(response.data.completed);
      } catch (err) {
        console.error('Error checking steps completion:', err);
        setStepsCompleted(false);
      }
    };

    if (user) {
      checkStepsCompletion();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">
          لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">
          برای پر کردن این فرم، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.
        </p>
        <hr />
        <p className="mb-0">
          لطفاً با شماره <strong>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.
        </p>
      </div>
    );
  }

  if (!stepsCompleted) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="mb-3">
          <FaExclamationTriangle className="text-warning" style={{ fontSize: '2rem' }} />
        </div>
        <h4 className="alert-heading mb-3">مراحل تکمیل نشده</h4>
        <p className="mb-3">
          لطفاً تمام مراحل نه‌گانه را تکمیل کنید.
        </p>
        {completionData && completionData.incompleteSteps && (
          <div className="mt-3">
            <p className="mb-2">مراحل باقی‌مانده:</p>
            <ul className="list-unstyled">
              {completionData.incompleteSteps.map((step, index) => (
                <li key={index} className="text-muted">• {step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <motion.div 
            className="card border-0 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body p-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-4"
              >
                <div className="success-icon-wrapper mb-4">
                  <FaCheckCircle className="text-success" style={{ fontSize: '4rem' }} />
                </div>
                <h2 className="h3 mb-4 text-success fw-bold">مراحل با موفقیت تکمیل شد</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="alert alert-info d-flex align-items-center mb-4"
                role="alert"
              >
                <FaEnvelope className="me-3" style={{ fontSize: '1.5rem' }} />
                <div>
                  لطفاً منتظر بمانید. درخواست شما در حال بررسی است و به‌زودی پاسخ را در ایمیل خود دریافت خواهید کرد.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="support-section text-center"
              >
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FaHeadset className="text-primary me-2" />
                  <h5 className="mb-0">پشتیبانی</h5>
                </div>
                <p className="text-muted mb-0">
                  برای هرگونه سوال می‌توانید با پشتیبانی تماس بگیرید
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
