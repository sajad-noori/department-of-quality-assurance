import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaExclamationTriangle } from "react-icons/fa";
import ProfileSidebar from "./ProfileSidebar";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import GeneralInformationEducationalCenter from "./accreditation/GeneralInformationEducationalCenter";
import Personnel from "./accreditation/Personnel";
import NumberOfStudents from "./accreditation/NumberOfStudents";
import Laylia from "./accreditation/Laylia";
import Standard from "./accreditation/Standard";
import Department from "./accreditation/Departments";
import AcademyFacilities from "./accreditation/AcademyFacilities";
import ClassFacilities from "./accreditation/ClassFacilities";
import PracticalFacilities from "./accreditation/PracticalFacilities";
import Documents from "./accreditation/Documents";
import ReviewAndSubmit from "./accreditation/ReviewAndSubmit";
import { useTheme } from "../contexts/ThemeContext";

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

function RestrictedAccessAlert() {
  const { theme } = useTheme();
  
  return (
    <>
      <div className="restricted-access-container">
        <div className={`restricted-access-card ${theme}-theme`}>
          <div className="restricted-icon-wrapper">
            <FaExclamationTriangle className="restricted-icon" />
          </div>
          <h2 className="restricted-title">دسترسی محدود</h2>
          <p className="restricted-description">
            برای دسترسی به این بخش، حساب کاربری شما باید به عنوان یک مرکز آموزشی
            معتبر ثبت شده باشد.
          </p>
          <div className="restricted-contact-info">
            <p>برای راهنمایی و فعال‌سازی حساب، لطفاً با ما تماس بگیرید:</p>
            <a href="tel:0778558968" className="restricted-phone-number">
              ۰۷۷۸۵۵۸۹۶۸
            </a>
          </div>
        </div>
      </div>
      <style>{`
        .restricted-access-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          margin: 2rem auto;
          max-width: 600px;
        }

        .restricted-access-card {
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .restricted-access-card.dark-theme {
          background: #1d1d1d;
          border: 1px solid rgba(255, 193, 7, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          color: #eee;
        }

        .restricted-access-card.light-theme {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          color: #333;
        }

        .restricted-icon-wrapper {
          margin: 0 auto 1.5rem;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
          border: 2px solid rgba(255, 193, 7, 0.4);
        }

        .restricted-icon {
          font-size: 2.5rem;
          color: #ffc107;
          text-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
        }

        .restricted-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffc107;
          margin-bottom: 1rem;
        }

        .restricted-description {
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .dark-theme .restricted-description {
          color: #ccc;
        }

        .light-theme .restricted-description {
          color: #555;
        }

        .restricted-contact-info {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
        }

        .dark-theme .restricted-contact-info {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .light-theme .restricted-contact-info {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .restricted-contact-info p {
          margin-bottom: 0.5rem;
        }

        .dark-theme .restricted-contact-info p {
          color: #aaa;
        }

        .light-theme .restricted-contact-info p {
          color: #666;
        }

        .restricted-phone-number {
          display: inline-block;
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .restricted-phone-number:hover {
          background: rgba(255, 193, 7, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.1);
        }
      `}</style>
    </>
  );
}

// Step components with Bootstrap classes
function Step1({ onStepSubmit, user }) {
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
  const [hasExistingData, setHasExistingData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch existing center data - only once
  useEffect(() => {
    const fetchCenterData = async () => {
      // Only fetch data if user exists, is an institute, and data hasn't been loaded yet
      if (!user || user.role !== "institute" || dataLoaded) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/educational-centers/centers",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

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
      } catch (err) {
        console.error("Error fetching center data:", err);
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchCenterData();
  }, [user, onStepSubmit, dataLoaded]);

  const validateForm = () => {
    const newErrors = {};

    // Log form data for debugging
    console.log("Validating form data:", formData);

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
    } else if (
      isNaN(formData.foundingYear) ||
      formData.foundingYear < 1300 ||
      formData.foundingYear > new Date().getFullYear()
    ) {
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
    console.log("Validation errors:", newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this specific field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", formData);
    console.log("Has existing data:", hasExistingData);

    if (!validateForm()) {
      console.log("Validation failed, errors:", errors);
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    try {
      const url = "http://localhost:5000/api/educational-centers/centers";
      const method = hasExistingData ? "PUT" : "POST";

      console.log("Making request with method:", method);

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Response received:", response.data);

      const message = hasExistingData
        ? "اطلاعات با موفقیت بروزرسانی شد"
        : "اطلاعات با موفقیت ثبت شد";
      alert(message);
      setHasExistingData(true);

      // Mark step as submitted
      if (onStepSubmit) {
        onStepSubmit(1);
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMessages = error.response.data.errors
          .map((err) => err.msg)
          .join("\n");
        alert(errorMessages);
      } else {
        alert(error.response?.data?.message || "خطایی در ارسال اطلاعات رخ داد");
      }
    }
  };

  if (loading) {
    return (
      <div
        className="alert alert-info text-center p-4"
        role="alert"
        style={{ maxWidth: "600px", margin: "2rem auto" }}
      >
        در حال بارگذاری...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="alert alert-warning text-center p-4"
        role="alert"
        style={{ maxWidth: "600px", margin: "2rem auto" }}
      >
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== "institute") {
    return <RestrictedAccessAlert />;
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
  onStepSubmit: PropTypes.func,
  user: PropTypes.object,
};

Step1.defaultProps = {
  onStepSubmit: () => {},
  user: null,
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
  onStepSubmit: PropTypes.func,
};

Step2.defaultProps = {
  onStepSubmit: () => {},
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
      <div className="d-flex flex-column flex-lg-row gap-3 w-100">
        <div className="flex-fill w-100">
          <NumberOfStudents onStepSubmit={handleStep3Submit} />
        </div>
        <div className="flex-fill w-100">
          <Laylia />
        </div>
      </div>
    </>
  );
}

Step3.propTypes = {
  onStepSubmit: PropTypes.func,
};

Step3.defaultProps = {
  onStepSubmit: () => {},
};

function Step4({ onStepSubmit, user }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    vision: "",
    mission: "",
    strategicGoals: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const fetchVisionMission = async () => {
      if (!user || user.role !== "institute") {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/vision-mission",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data) {
          setFormData({
            vision: response.data.vision || "",
            mission: response.data.mission || "",
            strategicGoals: response.data.strategic_goals || "",
          });
          setHasExistingData(true);
          // Don't mark as submitted when just loading existing data
          // if (onStepSubmit) {
          //   onStepSubmit(4);
          // }
        }
      } catch (err) {
        console.error("Error fetching vision mission:", err);
        setError("خطا در بارگذاری اطلاعات دیدگاه و ماموریت");
      } finally {
        setLoading(false);
      }
    };

    fetchVisionMission();
  }, [user, onStepSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this specific field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const validateForm = () => {
    if (!formData.vision.trim()) {
      setError("دیدگاه مرکز آموزشی الزامی است");
      return false;
    }
    if (!formData.mission.trim()) {
      setError("ماموریت مرکز آموزشی الزامی است");
      return false;
    }
    if (!formData.strategicGoals.trim()) {
      setError("اهداف استراتیژیک مرکز آموزشی الزامی است");
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
      const response = await axios.post(
        "http://localhost:5000/api/vision-mission",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setHasExistingData(true);
      setSuccess(
        hasExistingData
          ? "اطلاعات با موفقیت بروزرسانی شد"
          : "اطلاعات با موفقیت ثبت شد"
      );
      if (onStepSubmit) {
        onStepSubmit(4);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "خطا در ذخیره اطلاعات دیدگاه و ماموریت"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <CircularProgress style={{ color: "#0dcaf0" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="alert alert-warning text-center p-4"
        role="alert"
        style={{ maxWidth: "600px", margin: "2rem auto" }}
      >
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== "institute") {
    return <RestrictedAccessAlert />;
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
            <button
              type="button"
              className="close-button"
              onClick={() => setSuccess(null)}
            >
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
            <button
              type="button"
              className="close-button"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}
        <div className="form-section">
          <div className="form-group">
            <label className="form-label">
              دیدگاه مرکز آموزشی <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                onFocus={() => handleFocus("vision")}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="دیدگاه مرکز آموزشی را بیان دارید."
                className={`form-input ${
                  error && formData.vision.trim() === "" ? "error" : ""
                } ${focusedField === "vision" ? "focused" : ""}`}
                rows={5}
              />
              <div className="input-border"></div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              ماموریت مرکز آموزشی <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                onFocus={() => handleFocus("mission")}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="ماموریت مرکز آموزشی را بیان دارید."
                className={`form-input ${
                  error && formData.mission.trim() === "" ? "error" : ""
                } ${focusedField === "mission" ? "focused" : ""}`}
                rows={5}
              />
              <div className="input-border"></div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              اهداف استراتیژیک مرکز آموزشی <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <textarea
                name="strategicGoals"
                value={formData.strategicGoals}
                onChange={handleChange}
                onFocus={() => handleFocus("strategicGoals")}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={`اهداف استراتیژیک مرکز آموزشی را بیان دارید\n1.\n2.\n3.\n4.`}
                className={`form-input ${
                  error && formData.strategicGoals.trim() === "" ? "error" : ""
                } ${focusedField === "strategicGoals" ? "focused" : ""}`}
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
              className={`submit-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <span className="button-icon">💾</span>
                  {hasExistingData ? "بروزرسانی اطلاعات" : "ثبت اطلاعات"}
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

        /* Step8 mobile adjustments */
        @media (max-width: 576px) {
          /* Force the Step8 button to be much smaller on small screens */
          .stakeholder-form .submit-section .submit-button {
            padding: 0.35rem 0.6rem !important;
            font-size: 0.75rem !important;
            min-width: 100px !important;
            line-height: 1.1 !important;
          }
          .stakeholder-form { padding: 1rem; border-radius: 12px; }
          .form-title { font-size: 1.1rem; }
          .form-icon { font-size: 1.2rem; }
          .form-description { font-size: 0.9rem; margin-bottom: 0.75rem; }
          .form-section { padding: 1rem; }
          .form-label { font-size: 0.85rem; }
          .form-input { font-size: 0.9rem; padding: 0.6rem 0.8rem; min-height: 140px; }
          .character-count { font-size: 0.8rem; }
          .tips-title { font-size: 1rem; }
          .tips-list { padding-right: 1rem; }
          .submit-button { min-width: 130px; padding: 0.45rem 0.8rem; font-size: 0.82rem; box-shadow: 0 4px 12px rgba(13, 202, 240, 0.25); }
          .submit-button .button-icon { font-size: 0.95rem; }
          .entries-badge { font-size: 0.8rem; padding: 0.35rem 0.6rem; }
          .submit-hint { display: none; }
        }

        @media (max-width: 360px) {
          .form-title { font-size: 1rem; }
          .form-icon { font-size: 1.1rem; }
          .form-input { min-height: 120px; }
          .submit-button { min-width: 110px; font-size: 0.78rem; padding: 0.4rem 0.7rem; box-shadow: 0 3px 10px rgba(13, 202, 240, 0.2); }
          .submit-button .button-icon { font-size: 0.9rem; }
        }
        .submit-section {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .submit-button {
          position: relative;
          padding: 0.8rem 1.75rem;
          font-size: 1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #030305;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          min-width: 180px;
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
        
        /* Step4 mobile adjustments */
        @media (max-width: 576px) {
          .vision-mission-form {
            padding: 1rem;
            border-radius: 12px;
          }
          .form-header {
            margin-bottom: 1rem;
          }
          .form-title {
            font-size: 1.2rem;
          }
          .form-icon {
            font-size: 1.4rem;
          }
          .entries-badge {
            padding: 0.35rem 0.6rem;
            font-size: 0.8rem;
          }
          .form-section {
            padding: 1rem;
          }
          .form-label {
            font-size: 0.85rem;
          }
          .form-input {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }
          .submit-button {
            padding: 0.65rem 1.25rem;
            font-size: 0.95rem;
            min-width: 150px;
          }
          .success-notification,
          .error-notification {
            padding: 0.75rem;
          }
          .notification-content {
            font-size: 0.85rem;
          }
        }
        ${
          theme === "light"
            ? `
        .vision-mission-form {
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
        .form-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
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
        @media (max-width: 768px) {
          .vision-mission-form {
            padding: 1.5rem;
          }
        }
        `
            : ""
        }
      `}</style>
    </div>
  );
}

Step4.propTypes = {
  onStepSubmit: PropTypes.func,
  user: PropTypes.object,
};

Step4.defaultProps = {
  onStepSubmit: () => {},
  user: null,
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
        <Standard
          value={description}
          onChange={handleDescriptionChange}
          onStepSubmit={onStepSubmit}
        />
      </div>
    </>
  );
}

Step5.propTypes = {
  onStepSubmit: PropTypes.func,
};

Step5.defaultProps = {
  onStepSubmit: () => {},
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
  onStepSubmit: PropTypes.func,
};

Step6.defaultProps = {
  onStepSubmit: () => {},
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
          <PracticalFacilities
            onStepSubmit={() => setPracticalSubmitted(true)}
          />
          {practicalSubmitted && (
            <div className="submission-status success">
              <span>✓ امکانات عملی ثبت شد</span>
            </div>
          )}
        </div>

        {academySubmitted && classSubmitted && (
          <div className="step-completion-notice">
            <div className="alert alert-success">
              <strong>✓ مرحله ۷ تکمیل شد!</strong> شما می‌توانید به مرحله بعدی
              بروید.
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

function Step8({ onStepSubmit, user }) {
  const { theme } = useTheme();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchStakeholderInvolvement = async () => {
      if (!user || user.role !== "institute" || dataLoaded) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/stakeholder-involvement",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data.success && response.data.data) {
          setDescription(response.data.data.description || "");
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
        console.error("Error fetching stakeholder involvement:", err);
        setError("خطا در بارگذاری اطلاعات");
        setDataLoaded(true);
      } finally {
        setLoading(false);
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
      setError("توضیحات الزامی است");
      return false;
    }
    if (description.trim().length < 50) {
      setError("توضیحات باید حداقل ۵۰ کاراکتر باشد");
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
      const response = await axios.post(
        "http://localhost:5000/api/stakeholder-involvement",
        { description },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setSuccess(
        hasExistingData
          ? "اطلاعات با موفقیت بروزرسانی شد"
          : "اطلاعات با موفقیت ثبت شد"
      );
      setHasExistingData(true);

      // Mark step as submitted
      if (onStepSubmit) {
        onStepSubmit(8);
      }
    } catch (err) {
      console.error("Error saving stakeholder involvement:", err);
      setError(err.response?.data?.message || "خطا در ذخیره اطلاعات");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <CircularProgress style={{ color: "#0dcaf0" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="alert alert-warning text-center p-4"
        role="alert"
        style={{ maxWidth: "600px", margin: "2rem auto" }}
      >
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== "institute") {
    return <RestrictedAccessAlert />;
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
            در این بخش مرکز آموزشی باید شیوه های دخیل سازی و میزان مشارکت
            ذینفعان را واضح سازد.
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
            <button
              type="button"
              className="close-button"
              onClick={() => setSuccess(null)}
            >
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
            <button
              type="button"
              className="close-button"
              onClick={() => setError(null)}
            >
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
                onFocus={() => handleFocus("description")}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
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
                className={`form-input ${
                  error && description.trim() === "" ? "error" : ""
                } ${focusedField === "description" ? "focused" : ""}`}
                rows={10}
                disabled={isSubmitting}
                maxLength={2000}
              />
              <div className="input-border"></div>
            </div>
            <div
              className={`character-count ${
                description.length > 1800 ? "warning" : ""
              } ${description.length >= 2000 ? "error" : ""}`}
            >
              {description.length} / 2000 کاراکتر
              {description.length < 50 && description.length > 0 && (
                <span className="min-chars-warning">
                  {" "}
                  (حداقل ۵۰ کاراکتر نیاز است)
                </span>
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
              className={`submit-button ${isSubmitting ? "loading" : ""} ${
                description.trim().length < 50 ? "disabled" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <span className="button-icon">💾</span>
                  {hasExistingData ? "بروزرسانی اطلاعات" : "ثبت اطلاعات"}
                </>
              )}
            </button>
            <div className="submit-hint d-none d-sm-block">
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
          font-size: clamp(1.1rem, 1.8vw + 0.4rem, 1.4rem);
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .form-icon {
          font-size: clamp(1.2rem, 2vw + 0.4rem, 1.6rem);
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
        ${
          theme === "light"
            ? `
        .stakeholder-form {
          background: #fff;
          color: #222;
          border: 1px solid #e0f7fa;
          box-shadow: 0 8px 32px rgba(13,202,240,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
        }
        .stakeholder-form .form-title {
          color: #0dcaf0;
        }
        .stakeholder-form .form-header {
          color: #0dcaf0;
        }
        .stakeholder-form .form-description {
          color: #00b5d7;
        }
        .stakeholder-form .entries-badge {
          background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
          color: #0dcaf0;
          box-shadow: 0 2px 8px rgba(13,202,240,0.10);
        }
        .stakeholder-form .success-notification {
          background: linear-gradient(135deg, #e6ffe6 0%, #e7fff7 100%);
          border: 1px solid #b2ffb2;
        }
        .stakeholder-form .error-notification {
          background: linear-gradient(135deg, #fffbe6 0%, #fffde7 100%);
          border: 1px solid #ffe082;
        }
        .stakeholder-form .notification-content {
          color: #28a745;
        }
        .stakeholder-form .error-notification .notification-content {
          color: #ffb300;
        }
        .stakeholder-form .close-button {
          color: #0dcaf0;
        }
        .stakeholder-form .close-button:hover {
          background: #e0f7fa;
        }
        .stakeholder-form .form-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .stakeholder-form .form-label {
          color: #00b5d7;
        }
        .stakeholder-form .required {
          color: #ff6b6b;
        }
        .stakeholder-form .form-input {
          background: #fff;
          border: 2px solid #e0f7fa;
          color: #222;
        }
        .stakeholder-form .form-input::placeholder {
          color: #90a4ae;
        }
        .stakeholder-form .form-input:focus {
          border-color: #0dcaf0;
          background: #e0f7fa;
          box-shadow: 0 0 0 3px #b2ebf2;
        }
        .stakeholder-form .form-input.focused {
          border-color: #0dcaf0;
          background: #e0f7fa;
        }
        .stakeholder-form .form-input.error {
          border-color: #ff6b6b;
          background: #fff0f0;
        }
        .stakeholder-form .input-border {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        .stakeholder-form .form-input:focus ~ .input-border {
          width: 100%;
        }
        .stakeholder-form .error-message {
          color: #ff6b6b;
        }
        .stakeholder-form .submit-section {
          background: none;
        }
        .stakeholder-form .submit-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #fff;
          box-shadow: 0 2px 8px rgba(13,202,240,0.10);
        }
        .stakeholder-form .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
        }
        .stakeholder-form .submit-button:disabled {
          opacity: 0.7;
        }
        .stakeholder-form .button-icon {
          color: #0dcaf0;
        }
        .stakeholder-form .form-tips {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .stakeholder-form .tips-title {
          color: #0dcaf0;
        }
        .stakeholder-form .tips-list li {
          color: #00b5d7;
        }
        .stakeholder-form .submit-hint {
          color: #00b5d7;
        }
        .stakeholder-form .character-count {
          color: #00b5d7;
        }
        .stakeholder-form .character-count.warning {
          color: #ffc107;
        }
        .stakeholder-form .character-count.error {
          color: #ff6b6b;
        }
        .stakeholder-form .min-chars-warning {
          color: #ff6b6b;
        }
        @media (max-width: 768px) {
          .stakeholder-form {
            padding: 1.5rem;
          }
        }
        `
            : ""
        }
      `}</style>
    </div>
  );
}

Step8.propTypes = {
  onStepSubmit: PropTypes.func,
  user: PropTypes.object,
};

Step8.defaultProps = {
  onStepSubmit: () => {},
  user: null,
};

function Step9({ onStepSubmit }) {
  // When the Documents component signals completion, mark this step as submitted
  // without automatically navigating to the next step.
  const handleDocumentsComplete = () => {
    if (onStepSubmit) {
      onStepSubmit(9); // Just pass the current step number
    }
  };

  return (
    <>
      <label className="form-label-center">{steps[8]}</label>
      <div>
        <Documents onStepChange={handleDocumentsComplete} />
      </div>
    </>
  );
}

Step9.propTypes = {
  onStepSubmit: PropTypes.func,
};

Step9.defaultProps = {
  onStepSubmit: () => {},
};

function Step10() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/educational-centers/centers",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data && response.data.length > 0) {
          setFormData(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching center data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenterData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <ReviewAndSubmit formData={formData} />
      <style>{`
        ${
          theme === "light"
            ? `
        .review-submit-container {
          background-color: #fff;
        }
        .review-card {
          background: #fff;
          color: #222;
          border: 1px solid #e0f7fa;
          box-shadow: 0 8px 32px rgba(13,202,240,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
        }
        .icon-wrapper {
          background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
          border: 2px solid #0dcaf0;
        }
        .icon {
          color: #0dcaf0;
          text-shadow: 0 0 10px #0dcaf0;
        }
        .title {
          color: #0dcaf0;
        }
        .description {
          color: #00b5d7;
        }
        .alert-info {
          background: #e0f7fa;
          border: 1px solid #b2ebf2;
          color: #00b5d7;
        }
        .alert-icon {
          color: #0dcaf0;
        }
        .support-section {
          border-top: 1px solid #e0f7fa;
        }
        .support-title {
          color: #00b5d7;
        }
        .support-text {
          color: #666;
        }
        `
            : ""
        }
      `}</style>
    </>
  );
}

// Step components mapping
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
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepSubmissionStatus, setStepSubmissionStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
  });
  const [progressLoading, setProgressLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Scroll to top when sidebar is shown
  useEffect(() => {
    if (showSidebar) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [showSidebar]);

  // Fetch user and initialize progress from database
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Load progress from database when user changes
  useEffect(() => {
    if (user && user.id && user.role === "institute") {
      fetchProgressFromDatabase();
    } else {
      setProgressLoading(false);
    }
  }, [user]);

  const fetchProgressFromDatabase = async () => {
    try {
      setProgressLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/step-progress",
        {
          withCredentials: true,
        }
      );

      setCurrentStep(response.data.current_step);
      setStepSubmissionStatus(response.data.step_submission_status);
    } catch (error) {
      console.error("Error fetching progress from database:", error);
      // If there's an error, start with default values
      setCurrentStep(1);
      setStepSubmissionStatus({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
      });
    } finally {
      setProgressLoading(false);
    }
  };

  const saveProgressToDatabase = async (
    newCurrentStep,
    newStepSubmissionStatus
  ) => {
    try {
      await axios.put(
        "http://localhost:5000/api/step-progress",
        {
          current_step: newCurrentStep,
          step_submission_status: newStepSubmissionStatus,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error saving progress to database:", error);
    }
  };

  const isInstitute = user && user.role === "institute";
  const displayStep = isInstitute ? currentStep : 1;
  const StepComponent = stepComponents[displayStep];

  const handleMarkStepAsSubmitted = async (stepNumber, nextStep) => {
    try {
      // Mark step as submitted in database
      await axios.post(
        "http://localhost:5000/api/step-progress/mark-step",
        {
          stepNumber: stepNumber,
        },
        {
          withCredentials: true,
        }
      );

      // Update local state
      setStepSubmissionStatus((prev) => ({
        ...prev,
        [stepNumber]: true,
      }));

      // Navigate to next step if provided
      if (nextStep && nextStep <= steps.length) {
        const newCurrentStep = nextStep;
        setCurrentStep(newCurrentStep);

        // Save updated progress to database
        await saveProgressToDatabase(newCurrentStep, {
          ...stepSubmissionStatus,
          [stepNumber]: true,
        });
      }
    } catch (error) {
      console.error("Error marking step as submitted:", error);
      alert("خطا در ثبت مرحله. لطفاً دوباره تلاش کنید.");
    }
  };

  // Only allow navigation to a step if all previous steps are completed
  const handleNext = async () => {
    if (currentStep < steps.length) {
      let canGo = true;
      for (let i = 1; i <= currentStep; i++) {
        if (!stepSubmissionStatus[i]) {
          canGo = false;
          break;
        }
      }
      if (canGo) {
        const newCurrentStep = currentStep + 1;
        setCurrentStep(newCurrentStep);

        // Save updated progress to database
        await saveProgressToDatabase(newCurrentStep, stepSubmissionStatus);
      } else {
        alert(
          `لطفاً ابتدا مرحله ${steps[currentStep - 1]} را تکمیل و ثبت کنید`
        );
      }
    }
  };

  const handlePrev = async () => {
    if (currentStep > 1) {
      const newCurrentStep = currentStep - 1;
      setCurrentStep(newCurrentStep);

      // Save updated progress to database
      await saveProgressToDatabase(newCurrentStep, stepSubmissionStatus);
    }
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleSidebarToggle = () => {
    const willShowSidebar = !showSidebar;
    setShowSidebar(willShowSidebar);
  };

  if (userLoading || progressLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Floating sidebar toggle button */}
      {!showSidebar && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 2000,
            boxShadow: "0 4px 16px rgba(13,202,240,0.10)",
            borderRadius: "32px 0 0 32px",
            background: "transparent",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleSidebarToggle}
            sx={{
              borderRadius: "32px 0 0 32px",
              px: { xs: 1.25, sm: 2, md: 3 },
              py: { xs: 0.5, sm: 0.75, md: 1 },
              fontWeight: 700,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              color: "#030305",
              background: "#0dcaf0",
              borderColor: "#0dcaf0",
              boxShadow: "0 4px 15px rgba(13,202,240,0.18)",
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              minHeight: { xs: 32, sm: 36, md: 40 },
              whiteSpace: "nowrap",
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 18, sm: 22, md: 24 },
              },
              transition: "background 0.2s, color 0.2s",
              "&:hover": {
                background: "#00b5d7",
                borderColor: "#00b5d7",
                color: "#030305",
              },
            }}
          >
            نمایش پروفایل
            <ChevronLeftIcon sx={{ ml: 1 }} />
          </Button>
        </div>
      )}

      <div
        className="main-content"
        style={{ marginRight: showSidebar ? "320px" : "0" }}
      >
        <h1 className="title mt-4 mb-4">
          فورم درخواستی مراکز آموزشی برای شمولیت پروسه اعتبار دهی
        </h1>

        {isInstitute && (
          <div className="progress-wrapper" aria-label="نوار پیشرفت مراحل">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ "--progress": `${progressPercent}%` }}
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
                    } ${isSubmitted ? "submitted" : ""} ${
                      !canNavigate ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (canNavigate) {
                        setCurrentStep(stepNum);
                        saveProgressToDatabase(stepNum, stepSubmissionStatus);
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
        )}

        <div className="form">
          <StepComponent onStepSubmit={handleMarkStepAsSubmitted} user={user} />

          {isInstitute && (
            <div className="buttons d-flex justify-content-between mt-4">
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
          )}
        </div>
      </div>

      {showSidebar && <ProfileSidebar onClose={() => setShowSidebar(false)} />}

      <style>{`
        .page-container {
          display: flex;
          min-height: 100vh;
          background: #121212;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          min-height: 100vh;
          transition: margin-right 0.3s ease;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
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

        /* Ensure step content never overflows horizontally */
        .form {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .form * {
          max-width: 100%;
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
          /* Horizontal progress uses width */
          width: var(--progress);
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
        
        /* Vertical progress layout for small screens */
        @media (max-width: 576px) {
          /* Remove outer horizontal paddings so step fills screen width */
          .main-content { padding-right: 0 !important; padding-left: 0 !important; }
          .form { padding-right: 0 !important; padding-left: 0 !important; }
          /* Tighten title margins on mobile */
          .title { font-size: 1.2rem; margin-right: 0 !important; margin-left: 0 !important; }
          /* Ensure progress takes full width without side gaps */
          .progress-wrapper { margin-right: 0 !important; margin-left: 0 !important; }
          .progress-bar-bg { margin-right: 0 !important; margin-left: 0 !important; }
          /* Step 10: Review container should not add side padding */
          .review-submit-container { padding-right: 0 !important; padding-left: 0 !important; }
          .review-card { margin-right: 0 !important; margin-left: 0 !important; }
          .progress-wrapper {
            display: grid;
            grid-template-columns: 12px 1fr;
            align-items: start;
            gap: 12px;
          }
          .progress-bar-bg {
            width: 12px;
            height: auto;
            min-height: 280px;
          }
          .progress-bar-fill {
            /* Switch to vertical growth: bottom to top */
            width: 100%;
            left: 0;
            right: auto;
            top: auto;
            bottom: 0;
            /* Vertical progress uses height */
            height: var(--progress);
            transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .steps-list {
            margin-top: 0;
            padding: 0 0 0 8px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .step-item {
            flex-direction: row;
            align-items: center;
            text-align: right;
            min-width: 0;
          }
          .step-circle {
            margin-bottom: 0;
            margin-left: 8px;
          }
          .step-label {
            font-size: 13px;
          }
          /* Avoid any nested flex rows from forcing horizontal scroll */
          .row {
            margin-right: 0 !important;
            margin-left: 0 !important;
          }
          [class*="col-"] {
            padding-right: 0.5rem;
            padding-left: 0.5rem;
          }
          .form {
            overflow-x: hidden;
          }
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
      {/* Light mode styles for Profile (MultiStepForm10) */}
      <style>{`
        [data-theme="light"] .page-container {
          background: #fff;
          color: #222;
        }
        [data-theme="light"] .main-content {
          background: #fff;
          color: #222;
        }
        [data-theme="light"] .title {
          color: #0dcaf0;
        }
        [data-theme="light"] .progress-bar-bg {
          background: #e0e0e0;
          box-shadow: inset 0 0 14px #e8f8fc;
        }
        [data-theme="light"] .progress-bar-fill {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        [data-theme="light"] .step-item {
          color: #888;
        }
        [data-theme="light"] .step-item.active {
          color: #0dcaf0;
          text-shadow: 0 0 4px #0dcaf0;
        }
        [data-theme="light"] .step-item.completed {
          color: #00b5d7;
        }
        [data-theme="light"] .step-item.submitted {
          color: #0dcaf0;
        }
        [data-theme="light"] .step-item.disabled {
          color: #bbb;
        }
        [data-theme="light"] .step-circle {
          background: #e8f8fc;
          color: #00b5d7;
          box-shadow: 0 0 6px #e8f8fc;
        }
        [data-theme="light"] .step-item.active .step-circle {
          background: #0dcaf0;
          color: #fff;
          box-shadow: 0 0 12px #0dcaf0;
        }
        [data-theme="light"] .step-item.submitted .step-circle {
          background: #00b5d7;
          color: #fff;
          box-shadow: 0 0 8px #00b5d7;
        }
        [data-theme="light"] .step-check {
          background: #0dcaf0;
          color: #fff;
        }
        [data-theme="light"] .form {
          background: #fff;
        }
        [data-theme="light"] .facility-section {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
        }
        [data-theme="light"] .section-title {
          color: #0dcaf0;
        }
        [data-theme="light"] .submission-status.success {
          background: linear-gradient(135deg, #e8f8fc, #fff);
          border: 1px solid #e0e0e0;
          color: #00b5d7;
        }
        [data-theme="light"] .step-completion-notice .alert {
          background: linear-gradient(135deg, #e8f8fc, #fff);
          border: 1px solid #e0e0e0;
          color: #00b5d7;
        }
      `}</style>
    </div>
  );
}
