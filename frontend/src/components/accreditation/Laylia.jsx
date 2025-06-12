import React, { useState } from 'react';

const Laylia = () => {
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
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
      formData.totalStudents
    ) {
      setEntries([...entries, formData]);
      setFormData({
        name: '',
        newEnrollments: '',
        totalStudents: '',
      });
    } else {
      alert('تمام فیلدها را خانه پری نمایید.');
    }
  };

  return (
    <div className="container mt-4 p-4 rounded shadow-sm" style={{ maxWidth: '700px' }}>
      <fieldset className="mb-3 border rounded p-2">
        <legend className="float-none w-auto px-2 mb-2 small">تعداد شاگردان شامل لیلیه</legend>
      <div className="row g-3">
        <div className="col-12">
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
            placeholder="شاگردان شامل لیلیه"
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
            placeholder="شاگردان بدل عاشه"
            value={formData.totalStudents}
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
          <h3 className="mb-3 fw-semibold">تعداد شاگردان شامل لیلیه</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>اسم رشته</th>
                  <th>شاگردان شامل لیلیه</th>
                  <th>شاگردان بدل عاشه</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.newEnrollments}</td>
                    <td>{entry.totalStudents}</td>
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




export default Laylia;
