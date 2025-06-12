import React from "react";

export default function EducationalCenterForm({ formData, onChange, onSubmit }) {
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
            className="form-control form-control white-placeholder"
            value={formData.centerName}
            onChange={onChange}
            placeholder="نام مرکز آموزشی را وارد کنید"
            required
            style={{background: "transparent", color: "white"}}
          />
        </div>

        {/* آدرس مرکز آموزشی (ولایت، ولسوالی، قریه یا گذر) */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small" style={{ fontSize: '0.85rem' }}>
            آدرس مرکز آموزشی
          </legend>

          <div className="d-flex gap-2 mb-2">
            <div style={{ flex: 1 }}>
              <label htmlFor="province" className="form-label small">
                ولایت
              </label>
              <input
                type="text"
                id="province"
                name="province"
                className="form-control form-control white-placeholder"
                value={formData.province}
                onChange={onChange}
                placeholder="ولایت"
                required
                style={{background: "transparent", color: "white"}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="district" className="form-label small">
                ولسوالی
              </label>
              <input
                type="text"
                id="district"
                name="district"
                className="form-control form-control white-placeholder"
                value={formData.district}
                onChange={onChange}
                placeholder="ولسوالی"
                required
                style={{background: "transparent", color: "white"}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="village" className="form-label small">
                قریه یا گذر
              </label>
              <input
                type="text"
                id="village"
                name="village"
                className="form-control form-control white-placeholder"
                value={formData.village}
                onChange={onChange}
                placeholder="قریه یا گذر"
                required
                style={{background: "transparent", color: "white"}}
              />
            </div>
          </div>
        </fieldset>

        {/* نوعیت مرکز آموزشی، برنامه مرکز، سال تاسیس در یک ردیف */}
        <div className="d-flex gap-2 mb-3">
          <div style={{ flex: 1 }}>
            <label htmlFor="centerType" className="form-label small">
              نوعیت مرکز آموزشی
            </label>
            <select
              id="centerType"
              name="centerType"
              className="form-select form-select white-placeholder"
              value={formData.centerType}
              onChange={onChange}
              required
              style={{background: "transparent", color: "white"}}
            >
              <option value="" style={{color: "black"}}>انتخاب کنید</option>
              <option value="دولتی" style={{color: "black"}}>دولتی</option>
              <option value="خصوصی" style={{color: "black"}}>خصوصی</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="programType" className="form-label small">
              برنامه مرکز
            </label>
            <select
              id="programType"
              name="programType"
              className="form-select form-select white-placeholder"
              value={formData.programType}
              onChange={onChange}
              required
              style={{background: "transparent", color: "white"}}
            >
              <option value="" style={{color: "black"}}>انتخاب کنید</option>
              <option value="دوساله" style={{color: "black"}}>دوساله</option>
              <option value="سه ساله" style={{color: "black"}}>سه ساله</option>
              <option value="هر دو برنامه" style={{color: "black"}}>هر دو برنامه</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="foundingYear" className="form-label small">
              سال تاسیس
            </label>
            <input
              type="number"
              id="foundingYear"
              name="foundingYear"
              className="form-control form-control white-placeholder"
              value={formData.foundingYear}
              onChange={onChange}
              placeholder="سال"
              min="1300"
              max="1500"
              required
              style={{background: "transparent", color: "white"}}
            />
          </div>
        </div>

        {/* اسم شخص ارتباطی، شماره تماس، ایمیل در یک ردیف */}
        <div className="d-flex gap-2 mb-3">
          <div style={{ flex: 1 }}>
            <label htmlFor="contactName" className="form-label small">
              اسم شخص ارتباطی
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              className="form-control white-placeholder"
              value={formData.contactName}
              onChange={onChange}
              placeholder="نام شخص"
              required
              style={{background: "transparent", color: "white"}}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="phoneNumber" className="form-label small">
              شماره تماس
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-control white-placeholder"
              value={formData.phoneNumber}
              onChange={onChange}
              placeholder="شماره تماس"
              required
              style={{background: "transparent", color: "white"}}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="email" className="form-label small">
              ایمیل آدرس
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control white-placeholder"
              value={formData.email}
              onChange={onChange}
              placeholder="ایمیل"
              required
              style={{background: "transparent", color: "white"}}
            />
          </div>
        </div>
<button
  type="button"
  className="btn btn-primary btn-sm w-100"
  onClick={onSubmit}
>
  ارسال فرم
</button>

    </div>
    </fieldset>
  );
}
