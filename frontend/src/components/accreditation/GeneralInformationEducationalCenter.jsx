import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { provinces, districts } from '../../data/afghanistan-locations';



export default function EducationalCenterForm({ formData, onChange, onSubmit, hasExistingData = false }) {
  const [errors, setErrors] = useState({});
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const originalDataSetRef = useRef(false);

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

  useEffect(() => {
    if (formData.province) {
      const provinceDistricts = districts[formData.province] || [];
      setAvailableDistricts(provinceDistricts);
      // Reset district if it's not in the new province's districts
      if (formData.district && !provinceDistricts.find(d => d.id === formData.district)) {
        onChange({ target: { name: 'district', value: '' } });
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.province, formData.district, onChange]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.centerName) newErrors.centerName = "نام مرکز الزامی است";
    if (!formData.province) newErrors.province = "ولایت الزامی است";
    if (!formData.district) newErrors.district = "ولسوالی الزامی است";
    if (!formData.village) newErrors.village = "قریه الزامی است";
    if (!formData.centerType) newErrors.centerType = "نوع مرکز الزامی است";
    if (!formData.programType) newErrors.programType = "نوع برنامه الزامی است";
    if (!formData.foundingYear) newErrors.foundingYear = "سال تاسیس الزامی است";
    if (!formData.contactName) newErrors.contactName = "نام مسئول الزامی است";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "شماره تماس الزامی است";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس باید ۱۰ رقم باشد";
    }
    if (!formData.email) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "فرمت ایمیل نامعتبر است";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', name, 'from', formData[name], 'to', value);
    onChange(e);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Form submit called with hasExistingData:', hasExistingData);
    console.log('Current form data:', formData);
    console.log('Original data:', originalData);
    console.log('Has changes:', hasChanges);
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit();
        // Reset changes flag after successful submission
        if (hasExistingData) {
          setOriginalData({ ...formData });
          setHasChanges(false);
          originalDataSetRef.current = true; // Keep the ref true since we still have existing data
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Show the first error message
      const firstError = Object.values(errors)[0];
      alert(firstError);
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

  return (
    <div className="educational-center-form" dir="rtl">
      <div className="form-header">
        <h3 className="form-title">
          <span className="form-icon">🏫</span>
        فورم معلومات عمومی مرکز آموزشی
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
        {/* اسم مرکز آموزشی */}
        <div className="form-group">
          <label htmlFor="centerName" className="form-label">
            اسم نهاد آموزشی <span className="required">*</span>
          </label>
          <div className="input-wrapper">
          <input
            type="text"
            id="centerName"
            name="centerName"
              className={`form-input ${errors.centerName ? 'error' : ''} ${focusedField === 'centerName' ? 'focused' : ''} ${hasExistingData && formData.centerName !== originalData.centerName ? 'modified' : ''}`}
            value={formData.centerName || ''}
            onChange={handleChange}
              onFocus={() => handleFocus('centerName')}
              onBlur={handleBlur}
            placeholder="نام مرکز آموزشی را وارد کنید"
            required
          />
            <div className="input-border"></div>
          </div>
          {errors.centerName && <div className="error-message">{errors.centerName}</div>}
        </div>

        {/* آدرس مرکز آموزشی */}
        <div className="address-section">
          <h4 className="section-title">
            <span className="section-icon">📍</span>
            آدرس نهاد آموزشی
          </h4>
          
          <div className="address-grid">
            <div className="form-group">
              <label htmlFor="province" className="form-label">
                ولایت <span className="required">*</span>
              </label>
              <div className="input-wrapper">
              <select
                id="province"
                name="province"
                  className={`form-select ${errors.province ? 'error' : ''} ${focusedField === 'province' ? 'focused' : ''} ${hasExistingData && formData.province !== originalData.province ? 'modified' : ''}`}
                value={formData.province || ''}
                onChange={handleChange}
                  onFocus={() => handleFocus('province')}
                  onBlur={handleBlur}
                required
              >
                <option value="">انتخاب ولایت</option>
                {provinces.map(province => (
                    <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
                <div className="input-border"></div>
              </div>
              {errors.province && <div className="error-message">{errors.province}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="district" className="form-label">
                ولسوالی <span className="required">*</span>
              </label>
              <div className="input-wrapper">
              <select
                id="district"
                name="district"
                  className={`form-select ${errors.district ? 'error' : ''} ${focusedField === 'district' ? 'focused' : ''} ${hasExistingData && formData.district !== originalData.district ? 'modified' : ''}`}
                value={formData.district || ''}
                onChange={handleChange}
                  onFocus={() => handleFocus('district')}
                  onBlur={handleBlur}
                required
                disabled={!formData.province}
              >
                <option value="">انتخاب ولسوالی</option>
                {availableDistricts.map(district => (
                    <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
                <div className="input-border"></div>
              </div>
              {errors.district && <div className="error-message">{errors.district}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="village" className="form-label">
                قریه یا گذر <span className="required">*</span>
              </label>
              <div className="input-wrapper">
              <input
                type="text"
                id="village"
                name="village"
                  className={`form-input ${errors.village ? 'error' : ''} ${focusedField === 'village' ? 'focused' : ''} ${hasExistingData && formData.village !== originalData.village ? 'modified' : ''}`}
                value={formData.village || ''}
                onChange={handleChange}
                  onFocus={() => handleFocus('village')}
                  onBlur={handleBlur}
                placeholder="قریه یا گذر"
                required
              />
                <div className="input-border"></div>
              </div>
              {errors.village && <div className="error-message">{errors.village}</div>}
            </div>
          </div>
        </div>

        {/* نوعیت مرکز آموزشی، برنامه مرکز، سال تاسیس */}
        <div className="info-section">
          <h4 className="section-title">
            <span className="section-icon">📋</span>
            معلومات نهاد آموزشی
          </h4>
          
          <div className="info-grid">
            <div className="form-group">
              <label htmlFor="centerType" className="form-label">
                نوع مرکز <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <select
              id="centerType"
              name="centerType"
                  className={`form-select ${errors.centerType ? 'error' : ''} ${focusedField === 'centerType' ? 'focused' : ''} ${hasExistingData && formData.centerType !== originalData.centerType ? 'modified' : ''}`}
              value={formData.centerType || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('centerType')}
                  onBlur={handleBlur}
              required
                >
                  <option value="">انتخاب نوع مرکز</option>
                  <option value="امارتی">امارتی</option>
                  <option value="خصوصی">خصوصی</option>
            </select>
                <div className="input-border"></div>
              </div>
              {errors.centerType && <div className="error-message">{errors.centerType}</div>}
          </div>

            <div className="form-group">
              <label htmlFor="programType" className="form-label">
                نوع برنامه <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <select
              id="programType"
              name="programType"
                  className={`form-select ${errors.programType ? 'error' : ''} ${focusedField === 'programType' ? 'focused' : ''} ${hasExistingData && formData.programType !== originalData.programType ? 'modified' : ''}`}
              value={formData.programType || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('programType')}
                  onBlur={handleBlur}
              required
                >
                  <option value="">انتخاب نوع برنامه</option>
                  <option value="دوساله">دوساله</option>
                  <option value="سه ساله">سه ساله</option>
                  <option value="هر دو برنامه">هر دو برنامه</option>
            </select>
                <div className="input-border"></div>
              </div>
              {errors.programType && <div className="error-message">{errors.programType}</div>}
          </div>

            <div className="form-group">
              <label htmlFor="foundingYear" className="form-label">
                سال تاسیس <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <input
              type="number"
              id="foundingYear"
              name="foundingYear"
                  className={`form-input ${errors.foundingYear ? 'error' : ''} ${focusedField === 'foundingYear' ? 'focused' : ''} ${hasExistingData && formData.foundingYear !== originalData.foundingYear ? 'modified' : ''}`}
              value={formData.foundingYear || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('foundingYear')}
                  onBlur={handleBlur}
                  placeholder="سال تاسیس (مثال: ۱۳۹۰)"
              min="1300"
              max={new Date().getFullYear()}
              required
            />
                <div className="input-border"></div>
              </div>
              {errors.foundingYear && <div className="error-message">{errors.foundingYear}</div>}
            </div>
          </div>
        </div>

        {/* اسم شخص ارتباطی، شماره تماس، ایمیل */}
        <div className="contact-section">
          <h4 className="section-title">
            <span className="section-icon">📞</span>
            معلومات تماس
          </h4>
          
          <div className="contact-grid">
            <div className="form-group">
              <label htmlFor="contactName" className="form-label">
                اسم شخصی ارتباطی <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <input
              type="text"
              id="contactName"
              name="contactName"
                  className={`form-input ${errors.contactName ? 'error' : ''} ${focusedField === 'contactName' ? 'focused' : ''} ${hasExistingData && formData.contactName !== originalData.contactName ? 'modified' : ''}`}
              value={formData.contactName || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('contactName')}
                  onBlur={handleBlur}
                  placeholder="نام مسئول مرکز"
              required
            />
                <div className="input-border"></div>
              </div>
              {errors.contactName && <div className="error-message">{errors.contactName}</div>}
          </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                شماره تماس <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
                  className={`form-input ${errors.phoneNumber ? 'error' : ''} ${focusedField === 'phoneNumber' ? 'focused' : ''} ${hasExistingData && formData.phoneNumber !== originalData.phoneNumber ? 'modified' : ''}`}
              value={formData.phoneNumber || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('phoneNumber')}
                  onBlur={handleBlur}
                  placeholder="شماره تماس (۱۰ رقم)"
                  pattern="[0-9]{10}"
              required
            />
                <div className="input-border"></div>
              </div>
              {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                ایمیل آدرس <span className="required">*</span>
            </label>
              <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
                  className={`form-input ${errors.email ? 'error' : ''} ${focusedField === 'email' ? 'focused' : ''} ${hasExistingData && formData.email !== originalData.email ? 'modified' : ''}`}
              value={formData.email || ''}
              onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
              placeholder="ایمیل"
              required
            />
                <div className="input-border"></div>
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </div>
        </div>

        <div className="submit-section">
        <button
          type="button"
            className={`submit-button ${isSubmitting ? 'loading' : ''} ${hasChanges ? 'has-changes' : ''}`}
          onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
        .educational-center-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: clamp(1rem, 3.5vw, 2rem);
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

        .edit-mode-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #030305;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          animation: pulse-glow 2s infinite;
        }

        .edit-icon {
          font-size: 1.2rem;
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

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: clamp(0.8rem, 1vw + 0.1rem, 0.95rem);
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .required {
          color: #ff6b6b;
          font-weight: bold;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input,
        .form-select {
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

        .form-input::placeholder,
        .form-select::placeholder {
          color: rgba(240, 240, 240, 0.6);
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
          box-shadow: 0 0 0 3px rgba(13, 202, 240, 0.1);
          transform: translateY(-1px);
        }

        .form-input.focused,
        .form-select.focused {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }

        .form-input.modified,
        .form-select.modified {
          border-color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
        }

        .form-input.error,
        .form-select.error {
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

        .form-input:focus ~ .input-border,
        .form-select:focus ~ .input-border {
          width: 100%;
        }

        .form-input.modified ~ .input-border {
          background: linear-gradient(90deg, #ffd700, #ffed4e);
          width: 100%;
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.85rem;
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

        .address-section,
        .info-section,
        .contact-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
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

        .address-grid,
        .info-grid,
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
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
          .educational-center-form {
            padding: clamp(1rem, 3vw, 1.5rem);
          }

          .form-title {
            font-size: 1.25rem;
          }

          .address-grid,
          .info-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .submit-button {
            padding: 0.85rem 1.4rem;
            font-size: 0.95rem;
          }

          .changes-notification {
            flex-direction: column;
            align-items: stretch;
          }

          .reset-button {
            align-self: flex-end;
          }
        }

        .form-select:focus, .form-select:active, .form-select option, .form-select optgroup {
          background: #111 !important;
          color: #f0f0f0;
        }

        /* Extra-small devices */
        @media (max-width: 480px) {
          .educational-center-form { padding: 0 !important; margin: 0 !important; }
          .form-title { font-size: 1.1rem; }
          .form-icon { font-size: 1.1rem; }
          .form-label { font-size: 0.85rem; }
          .section-title { font-size: 1rem; }
          .section-icon { font-size: 1rem; }
          .form-input, .form-select { font-size: 0.85rem; }
          .submit-button { font-size: 0.9rem; padding: 0.8rem 1.2rem; }
        }

        @media (max-width: 360px) {
          .educational-center-form { padding: 0 !important; margin: 0 !important; }
          .form-title { font-size: 1rem; }
          .form-label { font-size: 0.8rem; }
          .section-title { font-size: 0.95rem; }
          .form-input, .form-select { font-size: 0.82rem; }
          .submit-button { font-size: 0.85rem; padding: 0.75rem 1rem; }
        }
      `}</style>
      {/* Light mode styles for GeneralInformationEducationalCenter */}
      <style>{`
        [data-theme="light"] .educational-center-form {
          background: #fff;
          color: #222;
          border: 1.5px solid #e0e0e0;
          box-shadow: 0 8px 32px rgba(13,202,240,0.08);
        }
        [data-theme="light"] .form-header {
          color: #222;
        }
        [data-theme="light"] .form-title {
          color: #0dcaf0;
        }
        [data-theme="light"] .existing-data-badge {
          background: linear-gradient(135deg, #e8f8fc, #fff);
          color: #00b5d7;
          box-shadow: 0 4px 15px rgba(13, 202, 240, 0.10);
        }
        [data-theme="light"] .edit-mode-indicator {
          background: linear-gradient(135deg, #fffbe6, #fff9c4);
          color: #ffd700;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.13);
        }
        [data-theme="light"] .changes-indicator {
          border-right: 1px solid #e0e0e0;
        }
        [data-theme="light"] .changes-dot {
          background: #ff6b6b;
        }
        [data-theme="light"] .changes-notification {
          background: linear-gradient(135deg, #fff0f0, #fff);
          border: 1px solid #ffd7d7;
        }
        [data-theme="light"] .notification-content {
          color: #ff6b6b;
        }
        [data-theme="light"] .reset-button {
          background: #fff0f0;
          border: 1px solid #ffd7d7;
          color: #ff6b6b;
        }
        [data-theme="light"] .reset-button:hover {
          background: #ffeaea;
        }
        [data-theme="light"] .form-label {
          color: #0dcaf0;
        }
        [data-theme="light"] .required {
          color: #ff6b6b;
        }
        [data-theme="light"] .form-input,
        [data-theme="light"] .form-select {
          background: #fff;
          color: #222;
          border: 2px solid #e0e0e0;
        }
        [data-theme="light"] .form-input::placeholder,
        [data-theme="light"] .form-select::placeholder {
          color: #aaa;
        }
        [data-theme="light"] .form-input:focus,
        [data-theme="light"] .form-select:focus {
          border-color: #0dcaf0;
          background: #e8f8fc;
          box-shadow: 0 0 0 3px #e8f8fc;
        }
        [data-theme="light"] .form-input.focused,
        [data-theme="light"] .form-select.focused {
          border-color: #0dcaf0;
          background: #e8f8fc;
        }
        [data-theme="light"] .form-input.modified,
        [data-theme="light"] .form-select.modified {
          border-color: #ffd700;
          background: #fffbe6;
          box-shadow: 0 0 0 2px #fffbe6;
        }
        [data-theme="light"] .form-input.error,
        [data-theme="light"] .form-select.error {
          border-color: #ff6b6b;
          background: #fff0f0;
        }
        [data-theme="light"] .input-border {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        [data-theme="light"] .form-input:focus ~ .input-border,
        [data-theme="light"] .form-select:focus ~ .input-border {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        [data-theme="light"] .form-input.modified ~ .input-border {
          background: linear-gradient(90deg, #ffd700, #ffed4e);
        }
        [data-theme="light"] .error-message {
          color: #ff6b6b;
        }
        [data-theme="light"] .address-section,
        [data-theme="light"] .info-section,
        [data-theme="light"] .contact-section {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
        }
        [data-theme="light"] .section-title {
          color: #0dcaf0;
        }
        [data-theme="light"] .submit-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #fff;
          box-shadow: 0 6px 20px rgba(13, 202, 240, 0.13);
        }
        [data-theme="light"] .submit-button.has-changes {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #222;
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.13);
        }
        [data-theme="light"] .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
        }
        [data-theme="light"] .submit-button.has-changes:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
        }
      `}</style>
    </div>
  );
}

EducationalCenterForm.propTypes = {
  formData: PropTypes.shape({
    centerName: PropTypes.string,
    province: PropTypes.string,
    district: PropTypes.string,
    village: PropTypes.string,
    centerType: PropTypes.string,
    programType: PropTypes.string,
    foundingYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contactName: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  hasExistingData: PropTypes.bool
};

EducationalCenterForm.defaultProps = {
  formData: {
    centerName: '',
    province: '',
    district: '',
    village: '',
    centerType: '',
    programType: '',
    foundingYear: '',
    contactName: '',
    phoneNumber: '',
    email: ''
  },
  hasExistingData: false
};
