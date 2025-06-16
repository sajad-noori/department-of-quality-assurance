import React, { useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';

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

  const teacherLevels = [
    { label: "دوکتور", key: "teachers_phd" },
    { label: "ماستر", key: "teachers_master" },
    { label: "لیسانس", key: "teachers_bachelor" }
  ];

  const technicalLevels = [
    { label: "دوکتور", key: "technical_phd" },
    { label: "ماستر", key: "technical_master" },
    { label: "لیسانس", key: "technical_bachelor" },
    { label: "فوق بکلوریا", key: "technical_above_baccalaureate" },
    { label: "بکلوریا", key: "technical_baccalaureate" },
    { label: "صنف دوازدهم", key: "technical_elementary" }
  ];

  const adminLevels = [
    { label: "دوکتور", key: "admin_phd" },
    { label: "ماستر", key: "admin_master" },
    { label: "لیسانس", key: "admin_bachelor" },
    { label: "فوق بکلوریا", key: "admin_above_baccalaureate" },
    { label: "بکلوریا", key: "admin_baccalaureate" },
    { label: "صنف دوازدهم", key: "admin_elementary" }
  ];

  const serviceLevels = [
    { label: "لیسانس", key: "service_bachelor" },
    { label: "فوق بکلوریا", key: "service_above_baccalaureate" },
    { label: "بکلوریا", key: "service_baccalaureate" },
    { label: "صنف دوازدهم", key: "service_elementary" }
  ];

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
      if (!user) return;

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
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'خطا در ذخیره اطلاعات');
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

  const renderFieldGroup = (title, levels, total) => (
    <fieldset className="mb-3 border rounded p-2">
      <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
        {title}
        <span className="ms-2 badge bg-primary">
          مجموع: {total}
        </span>
      </legend>
      <div className="row g-2">
        {levels.map((level) => (
          <div key={level.key} className="col-md-4">
            <label htmlFor={level.key} className="form-label small">
              {level.label}
            </label>
            <input
              type="text"
              id={level.key}
              name={level.key}
              className={`form-control form-control-sm white-placeholder ${errors[level.key] ? 'is-invalid' : ''}`}
              value={formData[level.key] || ''}
              onChange={handleInputChange}
              placeholder={`تعداد ${level.label}`}
              style={{background: "transparent", color: "white"}}
            />
            {errors[level.key] && <div className="invalid-feedback">{errors[level.key]}</div>}
          </div>
        ))}
      </div>
    </fieldset>
  );

  return (
    <fieldset className="mb-3 border rounded p-2">
      <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
        فورم معلومات پرسونل مرکز آموزشی
        {hasExistingData && (
          <span className="ms-2 text-info">
            (اطلاعات قبلی شما نمایش داده شده است)
          </span>
        )}
      </legend>
      <div className="container" dir="rtl">
        {renderFieldGroup("استادان", teacherLevels, totalCounts.teachers)}
        {renderFieldGroup("کارکن تخنیکی", technicalLevels, totalCounts.technical)}
        {renderFieldGroup("کارکن اداری", adminLevels, totalCounts.admin)}
        {renderFieldGroup("کارکن خدماتی", serviceLevels, totalCounts.service)}

        <button
          type="button"
          className="btn btn-primary btn-sm w-100 mt-3"
          onClick={handleSubmit}
        >
          {hasExistingData ? 'بروزرسانی اطلاعات' : 'ثبت اطلاعات'}
        </button>
      </div>
    </fieldset>
  );
}

StaffCountForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func
};
