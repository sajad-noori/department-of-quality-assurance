import React from "react";
export default function StaffCountForm({ formData, onChange, onSubmit }) {
  const teacherLevels = [
    { label: "دوکتور", key: "phd" },
    { label: "ماستر", key: "master" },
    { label: "لیسانس", key: "bachelor" },
  ];

  const technicalLevels = [
    { label: "دوکتور", key: "phd" },
    { label: "ماستر", key: "master" },
    { label: "لیسانس", key: "bachelor" },
    { label: "فوق بکلوریا", key: "above_baccalaureate" },
    { label: "بکلوریا", key: "baccalaureate" },
    { label: "ابتدایی/بی سواد", key: "elementary" },
  ];

  const adminLevels = technicalLevels; // Same levels

  const serviceLevels = [
    { label: "لیسانس", key: "bachelor" },
    { label: "فوق بکلوریا", key: "above_baccalaureate" },
    { label: "بکلوریا", key: "baccalaureate" },
    { label: "ابتدایی/بی سواد", key: "elementary" },
  ];

  const renderFields = (prefix, levels) =>
    levels.map(({ label, key }) => (
      <div key={key} style={{ flex: "1 1 30%" }}>
        <label className="form-label small">{label}</label>
        <input
          type="number"
          min="0"
          name={`${prefix}_${key}`}
          className="form-control form-control white-placeholder"
          value={formData[`${prefix}_${key}`] || ""}
          onChange={onChange}
          placeholder={`تعداد ${label}`}
          style={{background: "transparent"}}
        />
      </div>
    ));

  return (
    <div className="container" dir="rtl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
        }}
      >
       

        {/* تعداد اساتید */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small">تعداد اساتید</legend>
          <div className="d-flex gap-2 flex-wrap">
            {renderFields("teachers", teacherLevels)}
          </div>
        </fieldset>
 {/* نوت */}
        <div className="alert alert-info small p-2 mb-3">
          <strong>نوت:</strong> هدف از کارمند فنی افرادی می‌باشد که در بخش‌های اجرای کار عملی (ورکشاپ، لابراتوار و کتابخانه) فعالیت می‌کنند.
        </div>
        {/* تعداد کارمندان فنی */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small">تعداد کارمندان فنی</legend>
          <div className="d-flex gap-2 flex-wrap">
            {renderFields("technical", technicalLevels)}
          </div>
        </fieldset>

        {/* تعداد کارمندان اداری */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small">تعداد کارمندان اداری</legend>
          <div className="d-flex gap-2 flex-wrap">
            {renderFields("admin", adminLevels)}
          </div>
        </fieldset>

        {/* تعداد کارکن خدماتی */}
        <fieldset className="mb-3 border rounded p-2">
          <legend className="float-none w-auto px-2 mb-2 small">تعداد کارکن خدماتی</legend>
          <div className="d-flex gap-2 flex-wrap">
            {renderFields("service", serviceLevels)}
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary btn-sm w-100">
          ثبت معلومات
        </button>
      </form>
    </div>
  );
}
