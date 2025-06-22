import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import ProfileSidebar from './ProfileSidebar';

import GeneralInformationEducationalCenter from "./accreditation/GeneralInformationEducationalCenter"
import Personnel from "./accreditation/Personnel"
import NumberOfStudents from "./accreditation/NumberOfStudents"
import Laylia from "./accreditation/Laylia"
import Standard from "./accreditation/Standard";
import Department from "./accreditation/Departments"
import AcademyFacilities from "./accreditation/AcademyFacilities";
import ClassFacilities from "./accreditation/ClassFacilities";
import PracticalFacilities from "./accreditation/PracticalFacilities";
import Documents from "./accreditation/Documents"
import ReviewAndSubmit from "./accreditation/ReviewAndSubmit";

const steps = [
  "معلومات عمومی مرکز آموزشی",
  "مشخصات پرسونل مرکز آموزشی",
  "تعداد شاگرد موجود در مرکز آموزشی",
  "دیدگاه، ماموریت و اهداف استراتیژیک ",
  "مطابقت با ستندرد های تضمین کیفیت",
  "رشته های موجود",
  "امکانات و تسهیلات",
  "دخیل سازی ذینفعان در پروسه آموزشی",
  "اسناد و مدارک ضمیموی",
  "تکمیل پروسه سطح اول",
];


// Step components with Bootstrap classes
function Step1({ onStepSubmit }) {
  const [formData, setFormData] = useState({
    centerName: "",
    province: "",
    district: "",
    village: "",
    centerType: "",
    programType: "",
    foundingYear: "",
    contactName: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
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

  // Fetch existing center data - only once
  useEffect(() => {
    const fetchCenterData = async () => {
      // Only fetch data if user exists, is an institute, and data hasn't been loaded yet
      if (!user || user.role !== 'institute' || dataLoaded) return;

      try {
        const response = await axios.get('http://localhost:5000/api/educational-centers/centers', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data && response.data.length > 0) {
          const centerData = response.data[0];
          setHasExistingData(true);
          
          // Update form with existing data
          setFormData({
            centerName: centerData.centerName || "",
            province: centerData.province || "",
            district: centerData.district || "",
            village: centerData.village || "",
            centerType: centerData.centerType || "",
            programType: centerData.programType || "",
            foundingYear: centerData.foundingYear || "",
            contactName: centerData.contactName || "",
            phoneNumber: centerData.phoneNumber || "",
            email: centerData.email || "",
          });
          
          // Mark step as submitted if data exists
          if (onStepSubmit) {
            onStepSubmit(1);
        }
        }
        setDataLoaded(true);
      } catch (err) {
        console.error('Error fetching center data:', err);
        setDataLoaded(true);
      }
    };

    fetchCenterData();
  }, [user, onStepSubmit, dataLoaded]);

  const validateForm = () => {
    const newErrors = {};
    
    // Log form data for debugging
    console.log('Validating form data:', formData);
    
    if (!formData.centerName || !formData.centerName.trim()) {
      newErrors.centerName = "نام مرکز الزامی است";
    }
    if (!formData.province || !formData.province.trim()) {
      newErrors.province = "ولایت الزامی است";
    }
    if (!formData.district || !formData.district.trim()) {
      newErrors.district = "ولسوالی الزامی است";
    }
    if (!formData.village || !formData.village.trim()) {
      newErrors.village = "قریه یا گذر الزامی است";
    }
    if (!formData.centerType || !formData.centerType.trim()) {
      newErrors.centerType = "نوع مرکز الزامی است";
    }
    if (!formData.programType || !formData.programType.trim()) {
      newErrors.programType = "نوع برنامه الزامی است";
    }
    if (!formData.foundingYear) {
      newErrors.foundingYear = "سال تاسیس الزامی است";
    } else if (isNaN(formData.foundingYear) || formData.foundingYear < 1300 || formData.foundingYear > new Date().getFullYear()) {
      newErrors.foundingYear = "سال تاسیس باید بین ۱۳۰۰ و سال جاری باشد";
    }
    if (!formData.contactName || !formData.contactName.trim()) {
      newErrors.contactName = "نام تماس گیرنده الزامی است";
    }
    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "شماره تماس الزامی است";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس باید ۱۰ رقم باشد";
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "ایمیل معتبر نیست";
    }

    // Log validation errors for debugging
    console.log('Validation errors:', newErrors);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
      [name]: value
    }));
    // Clear error for this specific field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    console.log('Has existing data:', hasExistingData);
    
    if (!validateForm()) {
      console.log('Validation failed, errors:', errors);
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    try {
      const url = 'http://localhost:5000/api/educational-centers/centers';
      const method = hasExistingData ? 'PUT' : 'POST';
      
      console.log('Making request with method:', method);
      
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response received:', response.data);
      
      const message = hasExistingData ? "اطلاعات با موفقیت بروزرسانی شد" : "اطلاعات با موفقیت ثبت شد";
      alert(message);
      setHasExistingData(true);
      
      // Mark step as submitted
      if (onStepSubmit) {
        onStepSubmit(1);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\n');
        alert(errorMessages);
      } else {
        alert(error.response?.data?.message || "خطایی در ارسال اطلاعات رخ داد");
      }
    }
  };

  if (loading) {
    return (
      <div className="alert alert-info text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        در حال بارگذاری...
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

  return (
    <GeneralInformationEducationalCenter
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      hasExistingData={hasExistingData}
    />
  );
}

Step1.propTypes = {
  onStepSubmit: PropTypes.func
};

Step1.defaultProps = {
  onStepSubmit: () => {}
};

function Step2({ onStepSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Staff Data:", formData);
    // Mark step 2 as submitted when Personnel form is successfully submitted
    if (onStepSubmit) {
      onStepSubmit(2);
    }
  };

  return (
    <>
    <label className="form-label-center"> {steps[1]}</label>
    <Personnel
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
    </>
  );
}

Step2.propTypes = {
  onStepSubmit: PropTypes.func
};

Step2.defaultProps = {
  onStepSubmit: () => {}
};

function Step3({ onStepSubmit }) {
  const [step3Submitted, setStep3Submitted] = useState(false);

  const handleStep3Submit = () => {
    console.log("Step 3 submitted - NumberOfStudents data added");
    setStep3Submitted(true);
    // Mark step 3 as submitted when NumberOfStudents form is successfully submitted
    if (onStepSubmit) {
      onStepSubmit(3);
    }
  };

  return (
    <>
    <label className="form-label-center"> {steps[2]}</label>
    <div className="d-flex">
      <NumberOfStudents onStepSubmit={handleStep3Submit} />
      <Laylia />
    </div>
    </>
  );
}

Step3.propTypes = {
  onStepSubmit: PropTypes.func
};

Step3.defaultProps = {
  onStepSubmit: () => {}
};

function Step4({ onStepSubmit }) {
  const [formData, setFormData] = useState({
    vision: '',
    mission: '',
    strategicGoals: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
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
    const fetchVisionMission = async () => {
      if (!user || user.role !== 'institute') return;

      try {
        const response = await axios.get('http://localhost:5000/api/vision-mission', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data) {
          setFormData({
            vision: response.data.vision || '',
            mission: response.data.mission || '',
            strategicGoals: response.data.strategic_goals || ''
          });
          setHasExistingData(true);
          // Don't mark as submitted when just loading existing data
          // if (onStepSubmit) {
          //   onStepSubmit(4);
          // }
        }
      } catch (err) {
        console.error('Error fetching vision mission:', err);
        setError('خطا در بارگذاری اطلاعات دیدگاه و ماموریت');
      }
    };

    fetchVisionMission();
  }, [user, onStepSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this specific field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const validateForm = () => {
    if (!formData.vision.trim()) {
      setError('دیدگاه مرکز آموزشی الزامی است');
      return false;
    }
    if (!formData.mission.trim()) {
      setError('ماموریت مرکز آموزشی الزامی است');
      return false;
    }
    if (!formData.strategicGoals.trim()) {
      setError('اهداف استراتیژیک مرکز آموزشی الزامی است');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:5000/api/vision-mission', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setHasExistingData(true);
      setSuccess(hasExistingData ? 'اطلاعات با موفقیت بروزرسانی شد' : 'اطلاعات با موفقیت ثبت شد');
      if (onStepSubmit) {
        onStepSubmit(4);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ذخیره اطلاعات دیدگاه و ماموریت');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress style={{ color: '#0dcaf0' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">برای پر کردن این فرم، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.</p>
        <hr />
        <p className="mb-0">لطفاً با شماره <strong>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.</p>
      </div>
    );
  }

  return (
    <div className="vision-mission-form" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">🎯</span>
            دیدگاه، ماموریت و اهداف استراتیژیک مرکز آموزشی
          </h3>
          {hasExistingData && (
            <div className="entries-badge">
              <span className="badge-icon">📋</span>
              اطلاعات قبلی شما نمایش داده شده است
            </div>
          )}
        </div>
        
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
          <div className="form-group">
            <label className="form-label">دیدگاه مرکز آموزشی <span className="required">*</span></label>
            <div className="input-wrapper">
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
                onFocus={() => handleFocus('vision')}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              placeholder="دیدگاه مرکز آموزشی را بیان دارید."
                className={`form-input ${error && formData.vision.trim() === '' ? 'error' : ''} ${focusedField === 'vision' ? 'focused' : ''}`}
                rows={5}
            />
              <div className="input-border"></div>
          </div>
          </div>
          <div className="form-group">
            <label className="form-label">ماموریت مرکز آموزشی <span className="required">*</span></label>
            <div className="input-wrapper">
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
                onFocus={() => handleFocus('mission')}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="ماموریت مرکز آموزشی را بیان دارید."
                className={`form-input ${error && formData.mission.trim() === '' ? 'error' : ''} ${focusedField === 'mission' ? 'focused' : ''}`}
                rows={5}
              />
              <div className="input-border"></div>
          </div>
          </div>
          <div className="form-group">
            <label className="form-label">اهداف استراتیژیک مرکز آموزشی <span className="required">*</span></label>
            <div className="input-wrapper">
            <textarea
              name="strategicGoals"
              value={formData.strategicGoals}
              onChange={handleChange}
                onFocus={() => handleFocus('strategicGoals')}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={`اهداف استراتیژیک مرکز آموزشی را بیان دارید\n1.\n2.\n3.\n4.`}
                className={`form-input ${error && formData.strategicGoals.trim() === '' ? 'error' : ''} ${focusedField === 'strategicGoals' ? 'focused' : ''}`}
                rows={6}
              />
              <div className="input-border"></div>
          </div>
            </div>
          <div className="submit-section">
          <button 
            type="button" 
            onClick={handleSubmit}
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <span className="button-icon">💾</span>
                  {hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
                </>
              )}
          </button>
        </div>
        </div>
      </div>
      <style>{`
        .vision-mission-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
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
        .entries-badge {
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
        .form-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          font-size: 0.95rem;
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
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
        .white-placeholder::placeholder {
          color: #e0eaff;
          opacity: 1;
        }
        
        /* Ensure form inputs and textareas can be selected and edited */
        textarea, input, .form-input {
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        }
        
        /* Ensure the form container allows text selection */
        .vision-mission-form {
          user-select: text !important;
        }
        
        .form-container {
          user-select: text !important;
        }
      `}</style>
    </div>
  );
}

Step4.propTypes = {
  onStepSubmit: PropTypes.func
};

Step4.defaultProps = {
  onStepSubmit: () => {}
};

function Step5({ onStepSubmit }) {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <>
    <label className="form-label-center"> {steps[4]}</label>
    <div>
      <Standard value={description} onChange={handleDescriptionChange} onStepSubmit={onStepSubmit} />
    </div>
    </>
  );
}

Step5.propTypes = {
  onStepSubmit: PropTypes.func
};

Step5.defaultProps = {
  onStepSubmit: () => {}
};

function Step6({ onStepSubmit }) {
  return (
    <>
    <label className="form-label-center"> {steps[5]}</label>
    <div className="d-flex">
      <Department onStepSubmit={onStepSubmit} />
    </div>
    </>
  );
}

Step6.propTypes = {
  onStepSubmit: PropTypes.func
};

Step6.defaultProps = {
  onStepSubmit: () => {}
};

function Step7({ onStepSubmit }) {
  const [academySubmitted, setAcademySubmitted] = useState(false);
  const [classSubmitted, setClassSubmitted] = useState(false);
  const [practicalSubmitted, setPracticalSubmitted] = useState(false);

  // Check if we can proceed to next step (Academy and Class are required, Practical is optional)
  useEffect(() => {
    if (academySubmitted && classSubmitted && onStepSubmit) {
      onStepSubmit(7);
    }
  }, [academySubmitted, classSubmitted, onStepSubmit]);

  return (
    <>
    <label className="form-label-center"> {steps[6]}</label>
    <div className="d-flex flex-column gap-4">
      <div className="facility-section">
        <h4 className="section-title mb-3">امکانات اکادمیک</h4>
        <AcademyFacilities onStepSubmit={() => setAcademySubmitted(true)} />
        {academySubmitted && (
          <div className="submission-status success">
            <span>✓ امکانات اکادمیک ثبت شد</span>
          </div>
        )}
      </div>
      
      <div className="facility-section">
        <h4 className="section-title mb-3">امکانات صنفی</h4>
        <ClassFacilities onStepSubmit={() => setClassSubmitted(true)} />
        {classSubmitted && (
          <div className="submission-status success">
            <span>✓ امکانات صنفی ثبت شد</span>
          </div>
        )}
      </div>
      
      <div className="facility-section">
        <h4 className="section-title mb-3">امکانات عملی (اختیاری)</h4>
        <PracticalFacilities onStepSubmit={() => setPracticalSubmitted(true)} />
        {practicalSubmitted && (
          <div className="submission-status success">
            <span>✓ امکانات عملی ثبت شد</span>
          </div>
        )}
      </div>
      
      {academySubmitted && classSubmitted && (
        <div className="step-completion-notice">
          <div className="alert alert-success">
            <strong>✓ مرحله ۷ تکمیل شد!</strong> شما می‌توانید به مرحله بعدی بروید.
          </div>
        </div>
      )}
    </div>
    </>
  );
}

Step7.propTypes = {
  onStepSubmit: PropTypes.func,
};

Step7.defaultProps = {
  onStepSubmit: () => {},
};

function Step8({ onStepSubmit }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
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
    const fetchStakeholderInvolvement = async () => {
      if (!user || user.role !== 'institute' || dataLoaded) return;

      try {
        const response = await axios.get('http://localhost:5000/api/stakeholder-involvement', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.success && response.data.data) {
          setDescription(response.data.data.description || '');
          setHasExistingData(true);
          setDataLoaded(true);
          // Mark step as submitted if data exists
          if (onStepSubmit) {
            onStepSubmit(8);
          }
        } else {
          setDataLoaded(true);
        }
      } catch (err) {
        console.error('Error fetching stakeholder involvement:', err);
        setError('خطا در بارگذاری اطلاعات');
        setDataLoaded(true);
      }
    };

    fetchStakeholderInvolvement();
  }, [user, onStepSubmit, dataLoaded]);

  const handleChange = (e) => {
    setDescription(e.target.value);
    if (error) {
      setError(null);
    }
    if (success) {
      setSuccess(null);
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateForm = () => {
    if (!description.trim()) {
      setError('توضیحات الزامی است');
      return false;
    }
    if (description.trim().length < 50) {
      setError('توضیحات باید حداقل ۵۰ کاراکتر باشد');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5000/api/stakeholder-involvement', 
        { description },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      setSuccess(hasExistingData ? 'اطلاعات با موفقیت بروزرسانی شد' : 'اطلاعات با موفقیت ثبت شد');
      setHasExistingData(true);
      
      // Mark step as submitted
      if (onStepSubmit) {
        onStepSubmit(8);
      }
    } catch (err) {
      console.error('Error saving stakeholder involvement:', err);
      setError(err.response?.data?.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress style={{ color: '#0dcaf0' }} />
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

  return (
    <div className="stakeholder-form" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">🤝</span>
            دخیل سازی ذینفعان در پروسه آموزشی
          </h3>
          <p className="form-description">
            در این بخش مرکز آموزشی باید شیوه های دخیل سازی و میزان مشارکت ذینفعان را واضح سازد.
          </p>
          {hasExistingData && (
            <div className="entries-badge">
              <span className="badge-icon">📋</span>
              اطلاعات قبلی شما نمایش داده شده است
            </div>
          )}
        </div>
        
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
          <div className="form-group">
            <label className="form-label">
              توضیحات دخیل سازی ذینفعان <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="در این بخش توضیح دهید که چگونه ذینفعان (مانند والدین، کارفرمایان، جامعه محلی) در پروسه آموزشی دخیل می‌شوند. مثال‌ها:
• جلسات منظم با والدین
• مشارکت کارفرمایان در طراحی برنامه‌ها
• همکاری با جامعه محلی
• بازخورد از فارغ‌التحصیلان
• مشارکت در تصمیم‌گیری‌های آموزشی"
                className={`form-input ${error && description.trim() === '' ? 'error' : ''} ${focusedField === 'description' ? 'focused' : ''}`}
                rows={10}
                disabled={isSubmitting}
                maxLength={2000}
              />
              <div className="input-border"></div>
            </div>
            <div className={`character-count ${description.length > 1800 ? 'warning' : ''} ${description.length >= 2000 ? 'error' : ''}`}>
              {description.length} / 2000 کاراکتر
              {description.length < 50 && description.length > 0 && (
                <span className="min-chars-warning"> (حداقل ۵۰ کاراکتر نیاز است)</span>
              )}
            </div>
          </div>
          
          <div className="form-tips">
            <h5 className="tips-title">💡 نکات مهم:</h5>
            <ul className="tips-list">
              <li>شیوه‌های مختلف مشارکت ذینفعان را توضیح دهید</li>
              <li>فرکانس و نوع تعاملات را مشخص کنید</li>
              <li>نحوه استفاده از بازخوردها را بیان کنید</li>
              <li>مثال‌های عملی ارائه دهید</li>
            </ul>
          </div>
          
          <div className="submit-section">
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting || description.trim().length < 50}
              className={`submit-button ${isSubmitting ? 'loading' : ''} ${description.trim().length < 50 ? 'disabled' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <span className="button-icon">💾</span>
                  {hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
                </>
              )}
            </button>
            <div className="submit-hint">
              برای ذخیره سریع، از کلیدهای <kbd>Ctrl + Enter</kbd> استفاده کنید
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .stakeholder-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
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
        
        .form-description {
          color: #a9e5ff;
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 1rem;
        }
        
        .entries-badge {
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
        
        .form-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
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
          font-size: 0.95rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          resize: vertical;
          min-height: 200px;
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
        
        .form-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
        
        .character-count {
          text-align: left;
          font-size: 0.8rem;
          color: #a9e5ff;
          margin-top: 0.5rem;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .character-count.warning {
          color: #ffc107;
        }
        
        .character-count.error {
          color: #ff6b6b;
        }
        
        .min-chars-warning {
          color: #ff6b6b;
          font-weight: 600;
        }
        
        .form-tips {
          background: rgba(13, 202, 240, 0.05);
          border: 1px solid rgba(13, 202, 240, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin: 1.5rem 0;
        }
        
        .tips-title {
          color: #0dcaf0;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .tips-list li {
          color: #a9e5ff;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          padding-right: 1.5rem;
          position: relative;
        }
        
        .tips-list li:before {
          content: "•";
          color: #0dcaf0;
          font-weight: bold;
          position: absolute;
          right: 0;
        }
        
        .tips-list li:last-child {
          margin-bottom: 0;
        }
        
        .submit-hint {
          text-align: center;
          font-size: 0.8rem;
          color: #a9e5ff;
          margin-top: 1rem;
          opacity: 0.8;
        }
        
        .submit-hint kbd {
          background: rgba(13, 202, 240, 0.2);
          border: 1px solid rgba(13, 202, 240, 0.3);
          border-radius: 4px;
          padding: 0.2rem 0.4rem;
          font-size: 0.75rem;
          color: #0dcaf0;
          font-family: monospace;
        }
        
        .submit-section {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
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
          .stakeholder-form {
            padding: 1.5rem;
          }
          
          .form-title {
            font-size: 1.5rem;
          }
          
          .form-description {
            font-size: 0.9rem;
          }
          
          .submit-button {
            padding: 0.9rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

Step8.propTypes = {
  onStepSubmit: PropTypes.func
};

Step8.defaultProps = {
  onStepSubmit: () => {}
};

function Step9() {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <>
    <label className="form-label-center"> {steps[4]}</label>
    <div>
      <Documents value={description} onChange={handleDescriptionChange} />
    </div>
    </>
  );
}

function Step10() {
  return (
    <>
      <label className="form-label-center">{steps[9]}</label>
      <ReviewAndSubmit />
    </>
  );
}

// Map steps to components
const stepComponents = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  5: Step5,
  6: Step6,
  7: Step7,
  8: Step8,
  9: Step9,
  10: Step10,
};


export default function MultiStepForm10() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const [formData, setFormData] = useState({});
  const [stepSubmissionStatus, setStepSubmissionStatus] = useState(() => {
    const savedStatus = localStorage.getItem("stepSubmissionStatus");
    return savedStatus ? JSON.parse(savedStatus) : {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false
    };
  });

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("stepSubmissionStatus", JSON.stringify(stepSubmissionStatus));
  }, [stepSubmissionStatus]);

  const StepComponent = stepComponents[currentStep];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [`step${currentStep}Input`]: e.target.value,
    });
  };

  const handleNext = () => {
    // Check if current step is submitted before allowing next
    if (currentStep === 1 && !stepSubmissionStatus[1]) {
      alert("لطفاً ابتدا فرم مرحله اول را تکمیل و ثبت کنید");
      return;
    }
    
    if (currentStep === 2 && !stepSubmissionStatus[2]) {
      alert("لطفاً ابتدا فرم مرحله دوم را تکمیل و ثبت کنید");
      return;
    }
    
    if (currentStep === 3 && !stepSubmissionStatus[3]) {
      alert("لطفاً ابتدا فرم مرحله سوم را تکمیل و ثبت کنید");
      return;
    }
    
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitStep = async (e) => {
    e.preventDefault();

    // Define required fields for each step
    const requiredFieldsByStep = {
      1: [
        "centerName",
        "province",
        "district",
        "village",
        "centerType",
        "programType",
        "foundingYear",
        "contactName",
        "phoneNumber",
        "email",
      ],
      // Add step 2, 3, etc. if needed
    };

    const requiredFields = requiredFieldsByStep[currentStep] || [];

    const missingField = requiredFields.find((key) => {
      const val = formData[key];
      return !val || val.toString().trim() === "";
    });

    if (missingField) {
      alert(`لطفاً فیلدهای ضروری مرحله ${steps[currentStep - 1]} را پر کنید.`);
      return;
    }

    // If validation passes
    if (currentStep === 4) {
      // For Step4, we'll let the component handle its own submission
      return;
    }

    alert(`مرحله ${currentStep} ثبت شد`);
    
    // Mark current step as submitted
    setStepSubmissionStatus(prev => ({
      ...prev,
      [currentStep]: true
    }));

    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    else alert("تمام مراحل تکمیل شد!");
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="page-container">
      <div className="main-content">
        <h1 className="title mt-4 mb-4">فورم درخواستی مراکز آموزشی برای شمولیت  پروسه اعتبار دهی</h1>

        <div className="progress-wrapper" aria-label="نوار پیشرفت مراحل">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%`, right: 0, left: "auto" }}
            />
          </div>

          <ul className="steps-list">
            {steps.map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              const isSubmitted = stepSubmissionStatus[stepNum];
              const canNavigate = stepNum === 1 || stepSubmissionStatus[stepNum - 1];

              return (
                <li
                  key={stepNum}
                  className={`step-item ${isActive ? "active" : ""} ${
                    isCompleted ? "completed" : ""
                  } ${isSubmitted ? "submitted" : ""} ${!canNavigate ? "disabled" : ""}`}
                  onClick={() => {
                    if (canNavigate) {
                      setCurrentStep(stepNum);
                    } else {
                      alert("لطفاً ابتدا مرحله قبلی را تکمیل کنید");
                    }
                  }}
                  tabIndex={canNavigate ? 0 : -1}
                  role="button"
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`مرحله ${stepNum} - ${title}`}
                  aria-disabled={!canNavigate}
                >
                  <span className="step-circle">{stepNum}</span>
                  <span className="step-label">{title}</span>
                  {isSubmitted && <span className="step-check">✓</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="form">
          {[1, 2, 3, 4, 5, 6, 7].includes(currentStep) ? (
            <div className="form">
              <StepComponent
                onStepSubmit={(stepNumber) => {
                  setStepSubmissionStatus(prev => ({
                    ...prev,
                    [stepNumber]: true
                  }));
                }}
              />

              <div className="buttons d-flex justify-content-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  aria-disabled={currentStep === 1}
                  className="btn btn-primary"
                >
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === steps.length}
                  aria-disabled={currentStep === steps.length}
                  className="btn btn-primary"
                >
                  بعدی
                </button>
              </div>
            </div>
          ) : (
        <form className="form" onSubmit={handleSubmitStep}>
          <StepComponent
            value={formData[`step${currentStep}Input`] || ""}
            onChange={handleInputChange}
                onStepSubmit={(stepNumber) => {
                  setStepSubmissionStatus(prev => ({
                    ...prev,
                    [stepNumber]: true
                  }));
                }}
          />

          <div className="buttons d-flex justify-content-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              aria-disabled={currentStep === 1}
              className="btn btn-primary"
            >
              قبلی
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === steps.length}
              aria-disabled={currentStep === steps.length}
              className="btn btn-primary"
            >
              بعدی
            </button>
          </div>
        </form>
          )}
        </div>
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
          margin-right: 320px; /* Width of sidebar + margin */
          min-height: 100vh;
        }

        * {
          box-sizing: border-box;
        }
        body,
        html,
        #__next {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #121212;
          color: #d1d8f0;
          direction: rtl;
        }

        .container {
          max-width: 1100px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          user-select: none;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-align: center;
          text-shadow: none;
          user-select: none;
        }

        .progress-wrapper {
          position: relative;
          width: 100%;
        }

        .progress-bar-bg {
          position: relative;
          height: 12px;
          background: #2f3a70;
          border-radius: 14px;
          box-shadow: inset 0 0 14px #203160;
          overflow: hidden;
        }

        .progress-bar-fill {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: auto;
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
          border-radius: 14px;
          box-shadow: none;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .steps-list {
          margin-top: 14px;
          padding: 0 10px;
          display: flex;
          justify-content: space-evenly;
          list-style: none;
          user-select: none;
        }

        .step-item {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-width: 80px;
          color: #7b8bbf;
          transition: color 0.3s ease;
          outline: none;
          user-select: none;
          position: relative;
        }

        .step-item:hover:not(.disabled),
        .step-item:focus:not(.disabled) {
          color: #9aa9c7;
          text-shadow: none;
          outline: none;
        }

        .step-item.disabled {
          cursor: not-allowed;
          opacity: 0.5;
          color: #5a6b8f;
        }

        .step-item.active {
          font-weight: 700;
          color: #0dcaf0;
          text-shadow: 0 0 4px #0dcaf0;
        }

        .step-item.completed {
          color: #00b5d7;
        }

        .step-item.submitted {
          color: #a9e5ff;
        }

        .step-circle {
          display: inline-flex;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #394c7b;
          color: #889bd4;
          font-weight: 600;
          font-size: 15px;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          box-shadow: inset 0 0 6px #2e3a66;
          user-select: none;
          position: relative;
        }

        .step-item.active .step-circle {
          background: #0dcaf0;
          color: #030305;
          box-shadow: 0 0 12px #0dcaf0;
        }

        .step-item.submitted .step-circle {
          background: #00b5d7;
          color: #030305;
          box-shadow: 0 0 8px #00b5d7;
        }

        .step-check {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #a9e5ff;
          color: #030305;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .form-label-center {
            text-align: center;
            font-size: 2rem;
        }
        .step-label {
          font-size: 14px;
          user-select: none;
        }   
        /* Buttons container */
        .buttons {
          width: 100%;
        }
        .white-placeholder::placeholder {
          color: #e0eaff;
          opacity: 1;
        }

        /* Step 7 specific styles */
        .facility-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }

        .section-title {
          color: #0dcaf0;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .submission-status {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          animation: fadeInUp 0.3s ease-out;
        }

        .submission-status.success {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
          border: 1px solid rgba(40, 167, 69, 0.2);
          color: #28a745;
        }

        .step-completion-notice {
          margin-top: 2rem;
          animation: slideInDown 0.5s ease-out;
        }

        .step-completion-notice .alert {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
          border: 1px solid rgba(40, 167, 69, 0.2);
          color: #28a745;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          .facility-section {
            padding: 1rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}