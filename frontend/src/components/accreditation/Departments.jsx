import React, { useState } from 'react';

const Departments = () => {
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
    graduationCycles: '',
    establishmentYear: '',
    numberOfStudents: '',
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
      formData.graduationCycles &&
      formData.establishmentYear &&
      formData.numberOfStudents
    ) {
      setEntries([...entries, formData]);
      setFormData({
        name: '',
        newEnrollments: '',
        totalStudents: '',
        graduationCycles: '',
        establishmentYear: '',
        numberOfStudents: '',
      });
    } else {
      alert('تمام فیلدها را خانه پری نمایید.');
    }
  };

  return (
    <div className="container p-4 rounded shadow-sm">
   <label htmlFor="description" className="form-label small d-block mb-2">
           در فورم ذیل اسامی رشته های موجود در نهاد آموزشی را با ذکر دوره، تعداد استاد و شاگرد آن درج نمایید.
          </label>
     <fieldset className="mb-3 border rounded p-2">
<legend className="float-none w-auto px-2 mb-2 small">فورم درج رشته ها</legend>
      <div className="row g-3">
        <div className="col-4">
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

        <div className="col-md-4">
          <input
            type="number"
            name="newEnrollments"
            placeholder="سال ایجاد"
            value={formData.newEnrollments}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
            min="1300"
          />
        </div>

        <div className="col-md-4">
          <select
  name="totalStudents"
  value={formData.totalStudents}
  onChange={handleChange}
  className="form-control white-placeholder"
  style={{ background: "transparent", color: "white" }}
>
  <option value="" style={{color: "black"}}>دوره آموزشی را انتخاب کنید</option>
  <option value="دو ساله" style={{color: "black" }}>دو ساله</option>
  <option value="سه ساله" style={{color: "black" }}>سه ساله</option>
  <option value="پنج ساله" style={{color: "black" }}>پنج ساله</option>
</select>
        </div>

        <div className="col-md-4">
          <select 
          name="graduationCycles"
        value={formData.totalStudents}
         onChange={handleChange}
         className="form-control white-placeholder"
    style={{ background: "transparent", color: "white" }}

          >
            <option value="" style={{color: "black" }}>فعال / غیر فعال</option>
            <option value="فعال" style={{color: "black" }}>فعال</option>
            <option value="غیر فعال" style={{color: "black" }}>غیر فعال</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="number"
            name="establishmentYear"
            placeholder="تعداد اساتید رشته"
            value={formData.establishmentYear}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            name="numberOfStudents"
            placeholder="تعداد محصل رشته"
            value={formData.numberOfStudents}
            onChange={handleChange}
            className="form-control white-placeholder"
            style={{background: "transparent", color: "white"}}
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
          <h3 className="mb-3 fw-semibold">لیست رشته‌ها:</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>اسم رشته</th>
                  <th>سال ایجاد</th>
                  <th>دوره آموزشی</th>
                  <th>فعال / غیر فعال</th>
                  <th>تعداد اساتید رشته</th>
                  <th>تعداد محصل</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.newEnrollments}</td>
                    <td>{entry.totalStudents}</td>
                    <td>{entry.graduationCycles}</td>
                    <td>{entry.establishmentYear}</td>
                    <td>{entry.numberOfStudents}</td>
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




export default Departments;
