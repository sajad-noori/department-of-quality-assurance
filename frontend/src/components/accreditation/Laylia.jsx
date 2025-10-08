import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const Laylia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
  });

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
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
    const fetchLaylia = async () => {
      if (!user || user.role !== 'institute') return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/laylia`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.data.success) {
          setEntries(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching laylia data:', err);
        setError('خطا در بارگذاری اطلاعات لیلیه');
      }
    };

    fetchLaylia();
  }, [user]);

  // Auto-hide notifications
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'اسم رشته الزامی است';
    }
    
    if (!formData.newEnrollments || formData.newEnrollments < 0) {
      errors.newEnrollments = 'تعداد شاگردان شامل لیلیه باید عدد مثبت باشد';
    }
    
    if (!formData.totalStudents || formData.totalStudents < 0) {
      errors.totalStudents = 'تعداد شاگردان بدل عاشه باید عدد مثبت باشد';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleAddEntry = async () => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/laylia`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setEntries([...entries, response.data.data]);
        setFormData({
          name: '',
          newEnrollments: '',
          totalStudents: '',
        });
        setSuccess('اطلاعات لیلیه با موفقیت اضافه شد');
        setFormErrors({});
      }
    } catch (err) {
      console.error('Error adding laylia entry:', err);
      setError(err.response?.data?.message || 'خطا در اضافه کردن اطلاعات لیلیه');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);
      
      const response = await axios.delete(`${API_BASE_URL}/api/laylia/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setEntries(entries.filter(entry => entry.id !== id));
        setSuccess('رکورد با موفقیت حذف شد');
      }
    } catch (err) {
      console.error('Error deleting laylia entry:', err);
      setError(err.response?.data?.message || 'خطا در حذف رکورد');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        minHeight: '300px',
        background: 'linear-gradient(135deg, rgba(13, 202, 240, 0.1) 0%, rgba(0, 181, 215, 0.1) 100%)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(13, 202, 240, 0.2)'
      }}>
        <CircularProgress style={{ color: '#0dcaf0' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ 
        maxWidth: '600px', 
        margin: '2rem auto',
        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(255, 193, 7, 0.1)'
      }}>
        <h4 className="alert-heading mb-3" style={{ color: '#ffc107' }}>دسترسی محدود</h4>
        <p className="mb-3" style={{ color: '#fff' }}>
          لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ 
        maxWidth: '600px', 
        margin: '2rem auto',
        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(255, 193, 7, 0.1)'
      }}>
        <h4 className="alert-heading mb-3" style={{ color: '#ffc107' }}>دسترسی محدود</h4>
        <p className="mb-3" style={{ color: '#fff' }}>
          برای پر کردن این فرم، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.
        </p>
        <hr style={{ borderColor: 'rgba(255, 193, 7, 0.3)' }} />
        <p className="mb-0" style={{ color: '#fff' }}>
          لطفاً با شماره <strong style={{ color: '#0dcaf0' }}>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.
        </p>
      </div>
    );
  }

  return (
    <div className="laylia-form" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">🌙</span>
            تعداد شاگردان شامل لیلیه
          </h3>
          {entries.length > 0 && (
            <div className="entries-badge">
              <span className="badge-icon">📊</span>
              {entries.length} رشته ثبت شده
            </div>
          )}
        </div>

        {/* Success Notification */}
        {success && (
          <div className="success-notification">
            <div className="notification-content">
              <span className="notification-icon">✅</span>
              <span>{success}</span>
            </div>
            <button type="button" className="close-button" onClick={() => setSuccess(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="error-notification">
            <div className="notification-content">
              <span className="notification-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button type="button" className="close-button" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        <div className="form-section">
          <h4 className="section-title">
            <span className="section-icon">📝</span>
            افزودن رشته جدید
          </h4>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span className="field-icon">🎓</span>
                اسم رشته <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="اسم رشته را وارد کنید"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className={`form-input ${formErrors.name ? 'error' : ''} ${focusedField === 'name' ? 'focused' : ''}`}
                />
                <div className="input-border"></div>
              </div>
              {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="field-icon">🌙</span>
                شاگردان شامل لیلیه <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  name="newEnrollments"
                  placeholder="تعداد شاگردان شامل لیلیه"
                  value={formData.newEnrollments}
                  onChange={handleChange}
                  onFocus={() => handleFocus('newEnrollments')}
                  onBlur={handleBlur}
                  className={`form-input ${formErrors.newEnrollments ? 'error' : ''} ${focusedField === 'newEnrollments' ? 'focused' : ''}`}
                  min="0"
                />
                <div className="input-border"></div>
              </div>
              {formErrors.newEnrollments && <div className="error-message">{formErrors.newEnrollments}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="field-icon">👨‍🎓</span>
                شاگردان بدل عاشه <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  name="totalStudents"
                  placeholder="تعداد شاگردان بدل عاشه"
                  value={formData.totalStudents}
                  onChange={handleChange}
                  onFocus={() => handleFocus('totalStudents')}
                  onBlur={handleBlur}
                  className={`form-input ${formErrors.totalStudents ? 'error' : ''} ${focusedField === 'totalStudents' ? 'focused' : ''}`}
                  min="0"
                />
                <div className="input-border"></div>
              </div>
              {formErrors.totalStudents && <div className="error-message">{formErrors.totalStudents}</div>}
            </div>
          </div>

          <div className="submit-section">
            <button
              type="button"
              onClick={handleAddEntry}
              disabled={submitting}
              className={`submit-button ${submitting ? 'loading' : ''}`}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  در حال افزودن...
                </>
              ) : (
                <>
                  <span className="button-icon">➕</span>
                  افزودن رشته
                </>
              )}
            </button>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="entries-section">
            <h4 className="section-title">
              <span className="section-icon">📊</span>
              رشته های ثبت شده
            </h4>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>اسم رشته</th>
                    <th>شاگردان شامل لیلیه</th>
                    <th>شاگردان بدل عاشه</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="table-row">
                      <td>{entry.name}</td>
                      <td>{entry.newEnrollments}</td>
                      <td>{entry.totalStudents}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleting === entry.id}
                          title="حذف رشته"
                        >
                          {deleting === entry.id ? (
                            <span className="spinner-small"></span>
                          ) : (
                            <span className="delete-icon">🗑️</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .laylia-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: clamp(1rem, 3.5vw, 2rem);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .form-container {
          position: relative;
          z-index: 1;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: clamp(1.1rem, 2.2vw + 0.3rem, 1.6rem);
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .form-icon {
          font-size: clamp(1.1rem, 2.2vw, 1.6rem);
        }

        .entries-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
          color: #030305;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: clamp(0.85rem, 0.9vw + 0.1rem, 0.95rem);
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.3);
        }

        .badge-icon {
          font-size: 1.1rem;
        }

        .success-notification,
        .error-notification {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          animation: slideInDown 0.3s ease-out;
        }

        .error-notification {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #28a745;
          font-size: 0.9rem;
        }

        .error-notification .notification-content {
          color: #dc3545;
        }

        .notification-icon {
          font-size: 1.1rem;
        }

        .close-button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .form-section,
        .entries-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: clamp(1rem, 1.6vw + 0.2rem, 1.2rem);
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: clamp(1rem, 1.4vw + 0.2rem, 1.2rem);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: clamp(0.8rem, 0.9vw + 0.1rem, 0.95rem);
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .field-icon {
          font-size: 1rem;
        }

        .required {
          color: #ff6b6b;
          font-weight: bold;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f0f0f0;
          font-size: clamp(0.85rem, 0.9vw + 0.1rem, 0.95rem);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .form-input::placeholder {
          color: rgba(240, 240, 240, 0.6);
        }

        .form-input:focus {
          outline: none;
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
          box-shadow: 0 0 0 3px rgba(13, 202, 240, 0.1);
          transform: translateY(-1px);
        }

        .form-input.focused {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }

        .form-input.error {
          border-color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
          animation: shake 0.3s ease-in-out;
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
          transition: width 0.3s ease;
        }

        .form-input:focus ~ .input-border {
          width: 100%;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          animation: fadeInUp 0.2s ease-in;
        }

        .error-message::before {
          content: "⚠️";
          font-size: 0.75rem;
        }

        .submit-section {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .submit-button {
          position: relative;
          padding: clamp(0.8rem, 2.5vw, 1rem) clamp(1.25rem, 4vw, 2.5rem);
          font-size: clamp(0.95rem, 1vw + 0.1rem, 1.05rem);
          font-weight: 700;
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #030305;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 6px 20px rgba(13, 202, 240, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(13, 202, 240, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-icon {
          font-size: 1.2rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s linear infinite;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          color: #f0f0f0;
        }

        .data-table th {
          background: linear-gradient(135deg, rgba(13, 202, 240, 0.2), rgba(0, 181, 215, 0.2));
          color: #0dcaf0;
          padding: 1rem 0.75rem;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 2px solid rgba(13, 202, 240, 0.3);
        }

        .data-table td {
          padding: 1rem 0.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }

        .table-row:hover {
          background: rgba(13, 202, 240, 0.05);
          transition: background 0.3s ease;
        }

        .delete-button {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
        }

        .delete-button:hover:not(:disabled) {
          background: rgba(255, 107, 107, 0.2);
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .delete-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .delete-icon {
          font-size: 1rem;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 107, 107, 0.3);
          border-radius: 50%;
          border-top-color: #ff6b6b;
          animation: spin 1s linear infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .laylia-form {
            padding: clamp(1rem, 3vw, 1.5rem);
          }

          .form-title {
            font-size: 1.25rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .submit-button {
            padding: 0.85rem 1.4rem;
            font-size: 0.95rem;
          }

          .data-table {
            font-size: 0.8rem;
          }

          .data-table th,
          .data-table td {
            padding: 0.75rem 0.5rem;
          }
        }

        ${theme === 'light' ? `
        .laylia-form {
          background: #fff;
          color: #222;
          border: 1px solid #e0f7fa;
          box-shadow: 0 8px 32px rgba(13,202,240,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
        }
        .form-title {
          color: #0dcaf0;
        }
        .form-header {
          color: #0dcaf0;
        }
        .entries-badge {
          background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
          color: #0dcaf0;
          box-shadow: 0 2px 8px rgba(13,202,240,0.10);
        }
        .success-notification {
          background: linear-gradient(135deg, #e6ffe6 0%, #e7fff7 100%);
          border: 1px solid #b2ffb2;
        }
        .error-notification {
          background: linear-gradient(135deg, #fffbe6 0%, #fffde7 100%);
          border: 1px solid #ffe082;
        }
        .notification-content {
          color: #28a745;
        }
        .error-notification .notification-content {
          color: #ffb300;
        }
        .close-button {
          color: #0dcaf0;
        }
        .close-button:hover {
          background: #e0f7fa;
        }
        .form-section,
        .entries-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .section-title {
          color: #00b5d7;
        }
        .form-label {
          color: #00b5d7;
        }
        .required {
          color: #ff6b6b;
        }
        .form-input {
          background: #fff;
          border: 2px solid #e0f7fa;
          color: #222;
        }
        .form-input::placeholder {
          color: #90a4ae;
        }
        .form-input:focus {
          border-color: #0dcaf0;
          background: #e0f7fa;
          box-shadow: 0 0 0 3px #b2ebf2;
        }
        .form-input.focused {
          border-color: #0dcaf0;
          background: #e0f7fa;
        }
        .form-input.error {
          border-color: #ff6b6b;
          background: #fff0f0;
        }
        .input-border {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        .form-input:focus ~ .input-border {
          width: 100%;
        }
        .error-message {
          color: #ff6b6b;
        }
        .submit-section {
          background: none;
        }
        .submit-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #fff;
          box-shadow: 0 2px 8px rgba(13,202,240,0.10);
        }
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
        }
        .submit-button:disabled {
          opacity: 0.7;
        }
        .button-icon {
          color: #0dcaf0;
        }
        .table-container {
          background: #f7fcfd;
        }
        .data-table {
          color: #222;
        }
        .data-table th {
          background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
          color: #00b5d7;
          border-bottom: 2px solid #b2ebf2;
        }
        .data-table td {
          border-bottom: 1px solid #e0f7fa;
        }
        .table-row:hover {
          background: #e0f7fa;
        }
        .delete-button {
          background: #fff0f0;
          border: 1px solid #ffb3b3;
          color: #ff6b6b;
        }
        .delete-button:hover:not(:disabled) {
          background: #ffeaea;
          box-shadow: 0 4px 15px #ffb3b3;
        }
        .spinner {
          border-top-color: #0dcaf0;
        }
        .spinner-small {
          border-top-color: #ff6b6b;
        }
        @media (max-width: 768px) {
          .laylia-form {
            padding: 1.5rem;
          }
        }
        ` : ''}
      `}</style>
    </div>
  );
};

export default Laylia;
