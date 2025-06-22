import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

export default function StaffCountForm({ formData, onChange, onSubmit }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [totalCounts, setTotalCounts] = useState({
    teachers: 0,
    technical: 0,
    admin: 0,
    service: 0
  });
  const [hasExistingData, setHasExistingData] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const originalDataSetRef = useRef(false);

  const teacherLevels = [
    { label: "دوکتور", key: "teachers_phd", icon: "🎓" },
    { label: "ماستر", key: "teachers_master", icon: "📚" },
    { label: "لیسانس", key: "teachers_bachelor", icon: "📖" }
  ];

  const technicalLevels = [
    { label: "دوکتور", key: "technical_phd", icon: "🔧" },
    { label: "ماستر", key: "technical_master", icon: "⚙️" },
    { label: "لیسانس", key: "technical_bachelor", icon: "🛠️" },
    { label: "فوق بکلوریا", key: "technical_above_baccalaureate", icon: "📐" },
    { label: "بکلوریا", key: "technical_baccalaureate", icon: "📏" },
    { label: "صنف دوازدهم", key: "technical_elementary", icon: "🔨" }
  ];

  const adminLevels = [
    { label: "دوکتور", key: "admin_phd", icon: "👔" },
    { label: "ماستر", key: "admin_master", icon: "📋" },
    { label: "لیسانس", key: "admin_bachelor", icon: "📝" },
    { label: "فوق بکلوریا", key: "admin_above_baccalaureate", icon: "📊" },
    { label: "بکلوریا", key: "admin_baccalaureate", icon: "📈" },
    { label: "صنف دوازدهم", key: "admin_elementary", icon: "📄" }
  ];

  const serviceLevels = [
    { label: "لیسانس", key: "service_bachelor", icon: "🧹" },
    { label: "فوق بکلوریا", key: "service_above_baccalaureate", icon: "🔧" },
    { label: "بکلوریا", key: "service_baccalaureate", icon: "🛡️" },
    { label: "صنف دوازدهم", key: "service_elementary", icon: "⚡" }
  ];

  // Store original data when component mounts or when hasExistingData changes
  useEffect(() => {
    if (hasExistingData && Object.keys(formData).length > 0 && !originalDataSetRef.current) {
      setOriginalData({ ...formData });
      originalDataSetRef.current = true;
    }
  }, [hasExistingData, formData]);

  // Reset the ref when hasExistingData changes to false (new form)
  useEffect(() => {
    if (!hasExistingData) {
      originalDataSetRef.current = false;
      setOriginalData({});
      setHasChanges(false);
    }
  }, [hasExistingData]);

  // Check for changes when formData changes
  useEffect(() => {
    if (hasExistingData && Object.keys(originalData).length > 0) {
      const changed = Object.keys(formData).some(key => 
        formData[key] !== originalData[key]
      );
      setHasChanges(changed);
    }
  }, [formData, originalData, hasExistingData]);

  // Input validation function - now accepts empty values
  const validateInput = (value) => {
    if (value === '' || value === null || value === undefined) return true;
    const num = parseInt(value);
    return !isNaN(num) && num >= 0 && num <= 1000;
  };

  // Calculate totals for each category
  const calculateTotals = (data) => {
    const totals = {
      teachers: 0,
      technical: 0,
      admin: 0,
      service: 0
    };

    Object.entries(data).forEach(([key, value]) => {
      const num = value === '' ? 0 : parseInt(value) || 0;
      if (key.startsWith('teachers_')) totals.teachers += num;
      else if (key.startsWith('technical_')) totals.technical += num;
      else if (key.startsWith('admin_')) totals.admin += num;
      else if (key.startsWith('service_')) totals.service += num;
    });

    return totals;
  };

  // Initialize form data with all fields
  const initializeFormData = () => {
    const initialData = {};
    const allFields = [
      ...teacherLevels,
      ...technicalLevels,
      ...adminLevels,
      ...serviceLevels
    ];
    allFields.forEach(field => {
      initialData[field.key] = '';
    });
    return initialData;
  };

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

  // Fetch existing personnel data
  useEffect(() => {
    const fetchPersonnelData = async () => {
      if (!user || user.role !== 'institute') return;

      try {
        const response = await axios.get('http://localhost:5000/api/personnel', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          setHasExistingData(true);
          // Initialize form with empty values first
          const initialData = initializeFormData();
          
          // Then update with existing data
          Object.entries(response.data).forEach(([key, value]) => {
            if (initialData.hasOwnProperty(key)) {
              initialData[key] = value;
            }
          });

          // Update all form fields at once
          Object.entries(initialData).forEach(([key, value]) => {
            onChange({ target: { name: key, value: value } });
          });

          // Calculate totals with the fetched data
          setTotalCounts(calculateTotals(initialData));
        }
      } catch (err) {
        console.error('Error fetching personnel data:', err);
      }
    };

    fetchPersonnelData();
  }, [user]);

  // Calculate totals whenever formData changes
  useEffect(() => {
    setTotalCounts(calculateTotals(formData));
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    const fields = [
      'teachers_phd', 'teachers_master', 'teachers_bachelor',
      'technical_phd', 'technical_master', 'technical_bachelor',
      'technical_above_baccalaureate', 'technical_baccalaureate', 'technical_elementary',
      'admin_phd', 'admin_master', 'admin_bachelor',
      'admin_above_baccalaureate', 'admin_baccalaureate', 'admin_elementary',
      'service_bachelor', 'service_above_baccalaureate', 'service_baccalaureate', 'service_elementary'
    ];

    fields.forEach(field => {
      const value = formData[field];
      if (value !== '' && value !== null && value !== undefined) {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 1000) {
          newErrors[field] = 'عدد باید بین 0 و 1000 باشد';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Sanitize the data before sending
      const sanitizedData = {};
      Object.entries(formData).forEach(([key, value]) => {
        sanitizedData[key] = value === '' ? 0 : Number(value) || 0;
      });

      const response = await axios.post('http://localhost:5000/api/personnel', sanitizedData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data) {
        alert('اطلاعات با موفقیت ذخیره شد');
        // Reset changes flag after successful submission
        if (hasExistingData) {
          setOriginalData({ ...formData });
          setHasChanges(false);
          originalDataSetRef.current = true; // Keep the ref true since we still have existing data
        }
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Allow empty values
    if (value === '') {
      onChange({ target: { name, value: '' } });
      return;
    }

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      onChange({ target: { name, value } });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const resetToOriginal = () => {
    Object.keys(originalData).forEach(key => {
      onChange({ target: { name: key, value: originalData[key] } });
    });
    setHasChanges(false);
    // Ensure the ref stays true since we still have existing data
    originalDataSetRef.current = true;
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

  const renderFieldGroup = (title, levels, total, categoryColor) => (
    <div className="personnel-section">
      <div className="section-header">
        <h4 className="section-title">
          <span className="section-icon">{title.split(' ')[0]}</span>
          {title.split(' ').slice(1).join(' ')}
        </h4>
        <span className="total-badge">
          مجموع: {total}
        </span>
      </div>
      <div className="fields-grid">
        {levels.map((level) => (
          <div key={level.key} className="field-group">
            <label htmlFor={level.key} className="field-label">
              <span className="field-icon">{level.icon}</span>
              {level.label}
            </label>
            <div className="input-wrapper">
            <input
              type="text"
              id={level.key}
              name={level.key}
                className={`field-input ${errors[level.key] ? 'error' : ''} ${focusedField === level.key ? 'focused' : ''} ${hasExistingData && formData[level.key] !== originalData[level.key] ? 'modified' : ''}`}
              value={formData[level.key] || ''}
              onChange={handleInputChange}
                onFocus={() => handleFocus(level.key)}
                onBlur={handleBlur}
              placeholder={`تعداد ${level.label}`}
              />
              <div className="input-border"></div>
            </div>
            {errors[level.key] && (
              <div className="error-message">
                {errors[level.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="personnel-form" dir="rtl">
      <div className="form-header">
        <h3 className="form-title">
          <span className="form-icon">👥</span>
          فورم معلومات کارکنان مرکز آموزشی
        </h3>
        {hasExistingData && (
          <div className="existing-data-badge">
            <span className="badge-icon">✓</span>
            اطلاعات قبلی شما نمایش داده شده است
            {hasChanges && (
              <span className="changes-indicator">
                <span className="changes-dot"></span>
                تغییرات جدید
          </span>
            )}
          </div>
        )}
      </div>

      {hasExistingData && hasChanges && (
        <div className="changes-notification">
          <div className="notification-content">
            <span className="notification-icon">📝</span>
            <span>شما تغییراتی در فرم ایجاد کرده‌اید. برای ذخیره تغییرات روی دکمه &quot;بروزرسانی اطلاعات&quot; کلیک کنید.</span>
          </div>
          <button 
            type="button" 
            className="reset-button"
            onClick={resetToOriginal}
            title="بازگشت به اطلاعات اصلی"
          >
            بازگشت
          </button>
        </div>
      )}

      <div className="form-container">
        {renderFieldGroup("👨‍🏫 استادان", teacherLevels, totalCounts.teachers, '#0dcaf0')}
        {renderFieldGroup("🔧 کارکن تخنیکی", technicalLevels, totalCounts.technical, '#00b5d7')}
        {renderFieldGroup("👔 کارکن اداری", adminLevels, totalCounts.admin, '#a9e5ff')}
        {renderFieldGroup("🧹 کارکن خدماتی", serviceLevels, totalCounts.service, '#0dcaf0')}

        <div className="submit-section">
        <button
          type="button"
            className={`submit-button ${submitting ? 'loading' : ''} ${hasChanges ? 'has-changes' : ''}`}
          onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span>
                در حال ذخیره...
              </>
            ) : (
              <>
                <span className="button-icon">{hasExistingData ? '🔄' : '💾'}</span>
          {hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
              </>
            )}
        </button>
        </div>
      </div>

      <style>{`
        .personnel-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .form-icon {
          font-size: 2rem;
        }

        .existing-data-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
          color: #030305;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.3);
        }

        .badge-icon {
          font-size: 1.1rem;
        }

        .changes-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-right: 0.5rem;
          padding-right: 0.5rem;
          border-right: 1px solid rgba(3, 3, 5, 0.3);
        }

        .changes-dot {
          width: 8px;
          height: 8px;
          background: #ff6b6b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .changes-notification {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff6b6b;
          font-size: 0.9rem;
        }

        .notification-icon {
          font-size: 1.1rem;
        }

        .reset-button {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-button:hover {
          background: rgba(255, 107, 107, 0.2);
          transform: translateY(-1px);
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .personnel-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0dcaf0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .section-icon {
          font-size: 1.3rem;
        }

        .total-badge {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.3);
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .field-icon {
          font-size: 1.1rem;
        }

        .input-wrapper {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f0f0f0;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .field-input::placeholder {
          color: rgba(240, 240, 240, 0.6);
        }

        .field-input:focus {
          outline: none;
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
          box-shadow: 0 0 0 3px rgba(13, 202, 240, 0.1);
          transform: translateY(-1px);
        }

        .field-input.focused {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }

        .field-input.modified {
          border-color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
        }

        .field-input.error {
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

        .field-input:focus ~ .input-border {
          width: 100%;
        }

        .field-input.modified ~ .input-border {
          background: linear-gradient(90deg, #ffd700, #ffed4e);
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
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
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

        .submit-button.has-changes {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #030305;
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          animation: pulse-glow 2s infinite;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(13, 202, 240, 0.4);
        }

        .submit-button.has-changes:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.5);
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

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
          50% { 
            box-shadow: 0 6px 25px rgba(255, 215, 0, 0.6);
          }
        }

        @media (max-width: 768px) {
          .personnel-form {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .fields-grid {
            grid-template-columns: 1fr;
          }

          .submit-button {
            padding: 0.9rem 2rem;
            font-size: 1rem;
          }

          .changes-notification {
            flex-direction: column;
            align-items: stretch;
          }

          .reset-button {
            align-self: flex-end;
          }

          .section-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

StaffCountForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};
