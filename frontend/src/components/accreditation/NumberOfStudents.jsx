import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NumberOfStudents = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
    graduationCycles: '',
    establishmentYear: '',
  });

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
    const fetchStudents = async () => {
      if (!user || user.role !== 'institute') return;

      try {
        const response = await axios.get('http://localhost:5000/api/students', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.data.success) {
          setEntries(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Error fetching student data');
      }
    };

    fetchStudents();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = async () => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (
      formData.name &&
      formData.newEnrollments &&
      formData.totalStudents &&
      formData.graduationCycles &&
      formData.establishmentYear
    ) {
      try {
        const response = await axios.post('http://localhost:5000/api/students', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.success) {
          setEntries([...entries, response.data.data]);
          setFormData({
            name: '',
            newEnrollments: '',
            totalStudents: '',
            graduationCycles: '',
            establishmentYear: '',
          });
        }
      } catch (err) {
        console.error('Error adding student:', err);
        setError('Error adding student data');
      }
    } else {
      alert('تمام فیلدها را خانه پری نمایید.');
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/students/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setEntries(entries.filter(entry => entry.id !== id));
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Error deleting student data');
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
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/login')}
        >
          ورود به سیستم
        </button>
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

  if (error) {
    return (
      <div className="alert alert-danger text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4 p-4 rounded shadow-sm" style={{ maxWidth: '700px' }}>
      <fieldset className="mb-3 border rounded p-2">
        <legend className="float-none w-auto px-2 mb-2 small">تعداد شاگردان بر اساس رشته</legend>
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
              placeholder="تعداد جدید شمولان"
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
              placeholder="تعداد مجموعی شاگرد"
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
              placeholder="تعداد دوره فراغت"
              value={formData.graduationCycles}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{background: "transparent", color: "white"}}
              min="0"
            />
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="establishmentYear"
              placeholder="سال تاسیس رشته"
              value={formData.establishmentYear}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{background: "transparent", color: "white"}}
              min="1300" max="1500"
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
          <h3 className="mb-3 fw-semibold">تعداد شاگردان بر اساس رشته</h3>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>اسم رشته</th>
                  <th>جدید شمولان</th>
                  <th>مجموعی شاگرد</th>
                  <th>دوره فراغت</th>
                  <th>سال تاسیس</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td>
                    <td>{entry.newEnrollments}</td>
                    <td>{entry.totalStudents}</td>
                    <td>{entry.graduationCycles}</td>
                    <td>{entry.establishmentYear}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(entry.id)}
                      >
                        حذف
                      </button>
                    </td>
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

export default NumberOfStudents;
