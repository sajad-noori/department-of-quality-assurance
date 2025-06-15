import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { provinces, districts } from '../../data/afghanistan-locations';

export default function EducationalCenterForm({ formData, onChange, onSubmit }) {
  const [errors, setErrors] = useState({});
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Update available districts when province changes
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
  }, [formData.province]);

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

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      // Show the first error message
      const firstError = Object.values(errors)[0];
      alert(firstError);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <fieldset className="mb-3 border rounded p-2">
      <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
        فورم معلومات عمومی مرکز آموزشی
      </legend>
      <div className="container" dir="rtl">
        {/* اسم مرکز آموزشی */}
        <div className="mb-3">
          <label htmlFor="centerName" className="form-label small">
            اسم مرکز آموزشی
          </label>
          <input
            type="text"
            id="centerName"
            name="centerName"
            className={`form-control form-control white-placeholder ${errors.centerName ? 'is-invalid' : ''}`}
            value={formData.centerName}
            onChange={handleChange}
            placeholder="نام مرکز آموزشی را وارد کنید"
            required
            style={{background: "transparent", color: "white"}}
          />
          {errors.centerName && <div className="invalid-feedback">{errors.centerName}</div>}
        </div>

        {/* آدرس مرکز آموزشی */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
            آدرس مرکز آموزشی
          </legend>

          <div className="d-flex gap-2 mb-2">
            <div style={{ flex: 1 }}>
              <label htmlFor="province" className="form-label small">
                ولایت
              </label>
              <select
                id="province"
                name="province"
                className={`form-select form-select white-placeholder ${errors.province ? 'is-invalid' : ''}`}
                value={formData.province}
                onChange={handleChange}
                required
                style={{background: "transparent", color: "white"}}
              >
                <option value="">انتخاب ولایت</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id} style={{color: "black"}}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && <div className="invalid-feedback">{errors.province}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="district" className="form-label small">
                ولسوالی
              </label>
              <select
                id="district"
                name="district"
                className={`form-select form-select white-placeholder ${errors.district ? 'is-invalid' : ''}`}
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.province}
                style={{background: "transparent", color: "white"}}
              >
                <option value="">انتخاب ولسوالی</option>
                {availableDistricts.map(district => (
                  <option key={district.id} value={district.id} style={{color: "black"}}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && <div className="invalid-feedback">{errors.district}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="village" className="form-label small">
                قریه یا گذر
              </label>
              <input
                type="text"
                id="village"
                name="village"
                className={`form-control form-control white-placeholder ${errors.village ? 'is-invalid' : ''}`}
                value={formData.village}
                onChange={handleChange}
                placeholder="قریه یا گذر"
                required
                style={{background: "transparent", color: "white"}}
              />
              {errors.village && <div className="invalid-feedback">{errors.village}</div>}
            </div>
          </div>
        </fieldset>

        {/* نوعیت مرکز آموزشی، برنامه مرکز، سال تاسیس */}
        <div className="d-flex gap-2 mb-3">
          <div style={{ flex: 1 }}>
            <label htmlFor="centerType" className="form-label small">
              نوعیت مرکز آموزشی
            </label>
            <select
              id="centerType"
              name="centerType"
              className={`form-select form-select white-placeholder ${errors.centerType ? 'is-invalid' : ''}`}
              value={formData.centerType}
              onChange={handleChange}
              required
              style={{background: "transparent", color: "white"}}
            >
              <option value="" style={{color: "black"}}>انتخاب کنید</option>
              <option value="دولتی" style={{color: "black"}}>دولتی</option>
              <option value="خصوصی" style={{color: "black"}}>خصوصی</option>
            </select>
            {errors.centerType && <div className="invalid-feedback">{errors.centerType}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="programType" className="form-label small">
              برنامه مرکز
            </label>
            <select
              id="programType"
              name="programType"
              className={`form-select form-select white-placeholder ${errors.programType ? 'is-invalid' : ''}`}
              value={formData.programType}
              onChange={handleChange}
              required
              style={{background: "transparent", color: "white"}}
            >
              <option value="" style={{color: "black"}}>انتخاب کنید</option>
              <option value="دوساله" style={{color: "black"}}>دوساله</option>
              <option value="سه ساله" style={{color: "black"}}>سه ساله</option>
              <option value="هر دو برنامه" style={{color: "black"}}>هر دو برنامه</option>
            </select>
            {errors.programType && <div className="invalid-feedback">{errors.programType}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="foundingYear" className="form-label small">
              سال تاسیس
            </label>
            <input
              type="number"
              id="foundingYear"
              name="foundingYear"
              className={`form-control form-control white-placeholder ${errors.foundingYear ? 'is-invalid' : ''}`}
              value={formData.foundingYear}
              onChange={handleChange}
              placeholder="سال"
              min="1300"
              max={new Date().getFullYear()}
              required
              style={{background: "transparent", color: "white"}}
            />
            {errors.foundingYear && <div className="invalid-feedback">{errors.foundingYear}</div>}
          </div>
        </div>

        {/* اسم شخص ارتباطی، شماره تماس، ایمیل */}
        <div className="d-flex gap-2 mb-3">
          <div style={{ flex: 1 }}>
            <label htmlFor="contactName" className="form-label small">
              اسم شخص ارتباطی
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              className={`form-control white-placeholder ${errors.contactName ? 'is-invalid' : ''}`}
              value={formData.contactName}
              onChange={handleChange}
              placeholder="نام شخص"
              required
              style={{background: "transparent", color: "white"}}
            />
            {errors.contactName && <div className="invalid-feedback">{errors.contactName}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="phoneNumber" className="form-label small">
              شماره تماس
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className={`form-control white-placeholder ${errors.phoneNumber ? 'is-invalid' : ''}`}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="شماره تماس (۱۰ رقم)"
              maxLength="10"
              required
              style={{background: "transparent", color: "white"}}
            />
            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="email" className="form-label small">
              ایمیل آدرس
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control white-placeholder ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="ایمیل"
              required
              style={{background: "transparent", color: "white"}}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm w-100"
          onClick={handleSubmit}
        >
          ارسال فرم
        </button>
      </div>
    </fieldset>
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
  onSubmit: PropTypes.func.isRequired
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
  }
};
