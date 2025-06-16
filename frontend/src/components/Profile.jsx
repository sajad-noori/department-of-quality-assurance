import React, { useState, useEffect } from "react";
import axios from "axios";

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
  "تکمیل اسناد",
];


// Step components with Bootstrap classes
function Step1() {
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
      newErrors.phoneNumber = "شماره تماس باید ۱۱ رقم باشد";
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
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed, errors:', errors);
      alert("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    try {
      // First get the user info to ensure we're authenticated
      const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          alert("لطفاً ابتدا وارد شوید");
          return;
        }
        throw new Error("خطا در دریافت اطلاعات کاربر");
      }

      const userData = await userResponse.json();
      
      // Now submit the form with user ID
      const response = await fetch("http://localhost:5000/api/centers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          user_id: userData.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Show specific error message from server if available
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg).join('\n');
          alert(errorMessages);
        } else {
          alert(errorData.message || "خطا در ارسال اطلاعات");
        }
        return;
      }

      const data = await response.json();
      alert("فرم با موفقیت ذخیره شد");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "خطایی در ارسال اطلاعات رخ داد");
    }
  };

  return (
    <GeneralInformationEducationalCenter
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      errors={errors}
    />
  );
}

function Step2({ onNext }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    console.log("Submitted Staff Data:", formData);
    if (onNext) onNext(); // move to next step if using multi-step
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

function Step3() {
  return (
    <>
    <label className="form-label-center"> {steps[2]}</label>
    <div className="d-flex">
      <NumberOfStudents />
      <Laylia />
    </div>
    </>
  );
}

function Step4() {
  const [formData, setFormData] = useState({
    vision: '',
    mission: '',
    strategicGoals: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);

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
      if (!user) return;

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
        }
      } catch (err) {
        console.error('Error fetching vision mission:', err);
        setError('Error loading vision mission data');
      }
    };

    fetchVisionMission();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

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
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/vision-mission', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      alert(response.data.message);
      setHasExistingData(true);
    } catch (err) {
      console.error('Error saving vision mission:', err);
      setError(err.response?.data?.message || 'Error saving vision mission data');
    } finally {
      setLoading(false);
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
    <>
      <label className="form-label-center">دیدگاه، ماموریت و اهداف استراتیژیک مرکز آموزشی</label>
      <fieldset className="mb-3 border rounded p-2">
        <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
          فورم دیدگاه، ماموریت و اهداف استراتیژیک
          {hasExistingData && (
            <span className="ms-2 text-info">
              (اطلاعات قبلی شما نمایش داده شده است)
            </span>
          )}
        </legend>
        <div>
          <div style={{height: '300px'}}>
            <label htmlFor="vision" className="form-label small">دیدگاه مرکز آموزشی:</label>
            <textarea
              id="vision"
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              placeholder="دیدگاه مرکز آموزشی را بیان دارید."
              className="form-control h-100 white-placeholder"
              style={{background: "transparent", color: "white"}}
              required
            />
          </div>
          <br />
          <div style={{height: '300px'}}>
            <label htmlFor="mission" className="form-label small">ماموریت مرکز آموزشی:</label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              placeholder="ماموریت مرکز آموزشی را بیان دارید"
              className="form-control h-100 white-placeholder"
              style={{background: "transparent", color: "white"}}
              required
            />
          </div>
          <br />
          <div style={{height: '300px'}}>
            <label htmlFor="strategicGoals" className="form-label small">اهداف استراتیژیک مرکز آموزشی</label>
            <textarea
              id="strategicGoals"
              name="strategicGoals"
              value={formData.strategicGoals}
              onChange={handleChange}
              placeholder="اهداف استراتیژیک مرکز آموزشی را بیان دارید
              1.
              2.
              3.
              4.
              "
              className="form-control h-100 white-placeholder"
              style={{background: "transparent", color: "white"}}
              required
            />
          </div>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <button 
            type="button" 
            className="btn btn-success w-100 mt-4"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'در حال ذخیره...' : hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
          </button>
        </div>
      </fieldset>
      <br />
    </>
  );
}

function Step5() {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <>
    <label className="form-label-center"> {steps[4]}</label>
    <div>
      <Standard value={description} onChange={handleDescriptionChange} />
    </div>
    </>
  );
}

function Step6() {
  return (
    <>
    <label className="form-label-center"> {steps[5]}</label>
    <div className="d-flex">
      <Department />
    </div>
    </>
  );
}

function Step7() {
  return (
    <>
    <label className="form-label-center"> {steps[6]}</label>
    <div className="d-flex">
      <AcademyFacilities />
      <ClassFacilities />
      <PracticalFacilities />
    </div>
    </>
  );
}

function Step8() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
        setSnackbar({
          open: true,
          message: 'خطا در دریافت اطلاعات کاربر',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStakeholderInvolvement = async () => {
      if (!user) return;

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
        }
      } catch (err) {
        console.error('Error fetching stakeholder involvement:', err);
        setError('خطا در بارگذاری اطلاعات');
        setSnackbar({
          open: true,
          message: 'خطا در بارگذاری اطلاعات',
          severity: 'error'
        });
      }
    };

    fetchStakeholderInvolvement();
  }, [user]);

  const handleChange = (e) => {
    setDescription(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!description.trim()) {
      setError('توضیحات الزامی است');
      setSnackbar({
        open: true,
        message: 'لطفاً توضیحات را وارد کنید',
        severity: 'error'
      });
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

      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success'
      });
      setHasExistingData(true);
    } catch (err) {
      console.error('Error saving stakeholder involvement:', err);
      setError(err.response?.data?.message || 'خطا در ذخیره اطلاعات');
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'خطا در ذخیره اطلاعات',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
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
    <>
      <label className="form-label-center">دخیل سازی ذینفعان در پروسه آموزشی</label>
      <fieldset className="mb-3 border rounded p-4" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <legend className="float-none w-auto px-3 mb-3" style={{ fontSize: '1rem', color: '#8db8ff' }}>
          فورم دخیل سازی ذینفعان
          {hasExistingData && (
            <span className="ms-2 text-info">
              (اطلاعات قبلی شما نمایش داده شده است)
            </span>
          )}
        </legend>
        <div>
          <div style={{height: '300px'}}>
            <label htmlFor="description" className="form-label small mb-2" style={{ color: '#8db8ff' }}>
              در این بخش مرکز آموزشی باید شیوه های دخیل سازی و میزان مشارکت ذینفعان را واضح سازد.
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleChange}
              placeholder="شیوع دخیل سازی ذینفعان را در اینجا درج نمایید.."
              className="form-control h-100 white-placeholder"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "0.95rem",
                transition: "all 0.3s ease"
              }}
              required
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <div className="alert alert-danger mt-3" role="alert" style={{ borderRadius: "8px" }}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <button 
            type="button" 
            className="btn btn-success w-100 mt-4"
            disabled={isSubmitting}
            onClick={handleSubmit}
            style={{
              borderRadius: "8px",
              padding: "12px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              background: isSubmitting ? "#2c3e50" : "#28a745",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                در حال ذخیره...
              </>
            ) : hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
          </button>
        </div>
      </fieldset>

      {/* Snackbar for feedback */}
      <div 
        className={`alert alert-${snackbar.severity === 'success' ? 'success' : 'danger'} position-fixed bottom-0 end-0 m-3`}
        role="alert"
        style={{
          display: snackbar.open ? 'block' : 'none',
          minWidth: '300px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        <div className="d-flex align-items-center">
          <i className={`fas fa-${snackbar.severity === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
          {snackbar.message}
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={handleCloseSnackbar}
            aria-label="Close"
          ></button>
        </div>
      </div>
      <br />
    </>
  );
}

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

function Step10({ value, onChange }) {
  return (
    <>
      <label className="form-label">ورودی {steps[9]}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="ورودی مرحله دهم"
        className="form-control"
      />
      
        <button type="submit" className="btn btn-success w-100 mt-4">
          ثبت مرحله
        </button>
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

useEffect(() => {
  localStorage.setItem("currentStep", currentStep);
}, [currentStep]);

  const [formData, setFormData] = useState({});

  const StepComponent = stepComponents[currentStep];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [`step${currentStep}Input`]: e.target.value,
    });
  };

  const handleNext = () => {
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

  if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  else alert("تمام مراحل تکمیل شد!");
};


  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="container" dir="rtl">
      <h1 className="title mt-4 mb-4">فورم درخواستی مراکز آموزشی برای شمولیت برای پروسه اعتبار دهی</h1>

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

            return (
              <li
                key={stepNum}
                className={`step-item ${isActive ? "active" : ""} ${
                  isCompleted ? "completed" : ""
                }`}
                onClick={() => setCurrentStep(stepNum)}
                tabIndex={0}
                role="button"
                aria-current={isActive ? "step" : undefined}
                aria-label={`مرحله ${stepNum} - ${title}`}
              >
                <span className="step-circle">{stepNum}</span>
                <span className="step-label">{title}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <form className="form" onSubmit={handleSubmitStep}>
        <StepComponent
          value={formData[`step${currentStep}Input`] || ""}
          onChange={handleInputChange}
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

      <style>{`
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
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
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
        }

        .step-item:hover,
        .step-item:focus {
          color: #9aa9c7;
          text-shadow: none;
          outline: none;
        }

        .step-item.active {
          font-weight: 700;
          color: #8db8ff;
          text-shadow: 0 0 4px #92afff;
        }

        .step-item.completed {
          color: #5f7fc7;
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
        }

        .step-item.active .step-circle {
          background: #7c98ff;
          color: #e0eaff;
          box-shadow: 0 0 12px #7c98ff;
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
      `}</style>
    </div>
  );
}

