import React, { useState } from 'react';

const ClassFacilities = () => {
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
    graduationCycles: '',
  });

  const [entries, setEntries] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = () => {
    if (
      formData.name &&
      formData.newEnrollments &&
      formData.totalStudents &&
      formData.graduationCycles 
    ) {
      setEntries([...entries, formData]);
      setFormData({
        name: '',
        newEnrollments: '',
        totalStudents: '',
        graduationCycles: '',
      });
    } else {
      alert('تمام فیلدها را خانه پری نمایید.');
    }
  };

  return (
    <div className="container mt-4 p-4 rounded shadow-sm" style={{ maxWidth: '700px' }}>
      <label htmlFor="description" className="form-label small d-block mb-2">
          میزان موجودیت تجهیزات و مواد ممد درسی از قبیل کتب، میز، چوکی مناسب پروجکتو یا LCD در صنوف را بصورت مشرح بیان داشته و طی جدول بصورت رشته وار لست نموده و کیفیت آنرا نیز بیان دارید.
          </label>
     <fieldset className="mb-3 border rounded p-2">
<legend className="float-none w-auto px-2 mb-2 small">تجهیزات درسی داخل صنوف</legend>
      <div className="row g-3">
        <div className="col-6">
          <input
            type="text"
            name="name"
            placeholder="اسم رشته"
            value={formData.name}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="newEnrollments"
            placeholder="وسیله درسی"
            value={formData.newEnrollments}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
            min="0"
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="totalStudents"
            placeholder="تعداد وسیله"
            value={formData.totalStudents}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
            min="0"
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="graduationCycles"
            placeholder="وضعیت وسیله"
            value={formData.graduationCycles}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
            min="0"
          />
        </div>


        <div className="col-12 text-center mt-3">
          <button
            type="button"
            onClick={handleAddEntry}
            className="btn btn-primary px-4"
          >
            افزودن
          </button>
        </div>
      </div>
</fieldset>
      {entries.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-3 fw-semibold">امکانات مرکز آموزشی</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>اسم رشته</th>
                  <th>جدید شمولان</th>
                  <th>مجموعی شاگرد</th>
                  <th>دوره فراغت</th>
               
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.newEnrollments}</td>
                    <td>{entry.totalStudents}</td>
                    <td>{entry.graduationCycles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};




export default ClassFacilities;
