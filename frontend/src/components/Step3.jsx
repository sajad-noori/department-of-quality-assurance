import React, { useEffect, useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Step3 = () => {
  const [loading, setLoading] = useState(true);
  const [stageStatus, setStageStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStageStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/stages/status`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setStageStatus(res.data.data);
        } else {
          setError('خطا در دریافت وضعیت مرحله.');
        }
      } catch (err) {
        setError('خطا در دریافت وضعیت مرحله.');
      } finally {
        setLoading(false);
      }
    };
    fetchStageStatus();
  }, []);

  let content;
  if (loading) {
    content = <p style={{ color: '#fff' }}>در حال بارگذاری...</p>;
  } else if (error) {
    content = <p style={{ color: 'red' }}>{error}</p>;
  } else if (stageStatus && stageStatus.stage2) {
    content = (
      <div style={{
        background: '#23272f',
        borderRadius: 16,
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginTop: 40,
        marginBottom: 40,
        color: '#fff',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <FaCheckCircle size={48} color="#4ade80" style={{ flexShrink: 0 }} />
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>مرحله سوم</h2>
          <p style={{ margin: '12px 0 0', fontSize: 18 }}>شما مجاز به ادامه مرحله سوم هستید. این یک پیام ساده برای مرحله سوم است.</p>
        </div>
      </div>
    );
  } else {
    content = (
      <div style={{
        background: '#2d1f1f',
        borderRadius: 16,
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginTop: 40,
        marginBottom: 40,
        color: '#fff',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <FaExclamationTriangle size={48} color="#fbbf24" style={{ flexShrink: 0 }} />
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>تکمیل مرحله دوم الزامی است</h2>
          <p style={{ margin: '12px 0 0', fontSize: 18 }}>برای ادامه باید ابتدا مرحله دوم را تکمیل کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ background: '#121212', minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <div className="main-content" style={{ flex: 1, padding: '2rem', marginRight: 320, minHeight: '100vh' }}>
        {content}
      </div>
      <ProfileSidebar />
      <style>{`
        .page-container {
          display: flex;
          min-height: 100vh;
          background: #121212;
          position: relative;
          overflow: hidden;
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          margin-right: 320px;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default Step3; 