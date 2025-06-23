import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaHeadset } from 'react-icons/fa';

const ReviewAndSubmit = () => {
  return (
    <>
      <div className="review-submit-container" dir="rtl">
        <motion.div
          className="review-card"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 20 }}
          >
            <FaCheckCircle className="icon" />
          </motion.div>
          
          <h2 className="title">درخواست شما با موفقیت ثبت شد</h2>
          
          <p className="description">
            از شما سپاسگزاریم. درخواست اعتباردهی شما برای بررسی ارسال شده است. نتیجه از طریق ایمیل به شما اطلاع داده خواهد شد.
          </p>

          <motion.div
            className="alert-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FaEnvelope className="alert-icon" />
            <div>
              لطفاً منتظر بمانید. بررسی درخواست شما ممکن است چند روز کاری طول بکشد.
            </div>
          </motion.div>

          <motion.div
            className="support-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="support-header">
              <FaHeadset className="support-icon" />
              <h5 className="support-title">نیاز به پشتیبانی دارید؟</h5>
            </div>
            <p className="support-text">
              برای هرگونه سوال می‌توانید با ما در تماس باشید.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .review-submit-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #121212;
          min-height: 60vh;
          font-family: sans-serif;
        }

        .review-card {
          background: #1d1d1d;
          border: 1px solid rgba(13, 202, 240, 0.2);
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 600px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          color: #eee;
        }

        .icon-wrapper {
          margin: 0 auto 1.5rem;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(13, 202, 240, 0.05));
          border: 2px solid rgba(13, 202, 240, 0.3);
        }

        .icon {
          font-size: 3rem;
          color: #0dcaf0;
          text-shadow: 0 0 15px rgba(13, 202, 240, 0.5);
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #a9e5ff;
          margin-bottom: 2rem;
        }

        .alert-info {
          display: flex;
          align-items: center;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          background: rgba(13, 202, 240, 0.08);
          border: 1px solid rgba(13, 202, 240, 0.15);
          color: #a9e5ff;
          text-align: right;
        }

        .alert-icon {
          font-size: 1.5rem;
          margin-left: 1rem;
          flex-shrink: 0;
          color: #0dcaf0;
        }

        .support-section {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .support-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .support-icon {
          font-size: 1.2rem;
          color: #0dcaf0;
        }

        .support-title {
          margin-bottom: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #eee;
        }

        .support-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </>
  );
};

export default ReviewAndSubmit;
