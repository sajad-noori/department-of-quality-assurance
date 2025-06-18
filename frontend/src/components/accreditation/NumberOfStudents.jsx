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
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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
        setLoading(true);
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
        setError('خطا در بارگذاری اطلاعات شاگردان');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  // Auto-hide notifications
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'اسم رشته الزامی است';
    }
    
    if (!formData.newEnrollments || formData.newEnrollments < 0) {
      errors.newEnrollments = 'تعداد جدید شمولان باید عدد مثبت باشد';
    }
    
    if (!formData.totalStudents || formData.totalStudents < 0) {
      errors.totalStudents = 'تعداد مجموعی شاگرد باید عدد مثبت باشد';
    }
    
    if (!formData.graduationCycles || formData.graduationCycles < 0) {
      errors.graduationCycles = 'تعداد دوره فراغت باید عدد مثبت باشد';
    }
    
    if (!formData.establishmentYear || formData.establishmentYear < 1300 || formData.establishmentYear > 1500) {
      errors.establishmentYear = 'سال تاسیس باید بین ۱۳۰۰ تا ۱۵۰۰ باشد';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddEntry = async () => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
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
        setSuccess('اطلاعات شاگردان با موفقیت اضافه شد');
        setFormErrors({});
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.response?.data?.message || 'خطا در اضافه کردن اطلاعات شاگردان');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);
      
      const response = await axios.delete(`http://localhost:5000/api/students/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setEntries(entries.filter(entry => entry.id !== id));
        setSuccess('رکورد با موفقیت حذف شد');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.response?.data?.message || 'خطا در حذف رکورد');
    } finally {
      setDeleting(null);
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
    <div className="container mt-4 p-4 rounded shadow-sm" style={{ maxWidth: '700px' }}>
      {/* Success Notification */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

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
              className={`form-control white-placeholder ${formErrors.name ? 'is-invalid' : ''}`}
              style={{background: "transparent", color: "white"}}
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="newEnrollments"
              placeholder="تعداد جدید شمولان"
              value={formData.newEnrollments}
              onChange={handleChange}
              className={`form-control white-placeholder ${formErrors.newEnrollments ? 'is-invalid' : ''}`}
              style={{background: "transparent", color: "white"}}
              min="0"
            />
            {formErrors.newEnrollments && <div className="invalid-feedback">{formErrors.newEnrollments}</div>}
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="totalStudents"
              placeholder="تعداد مجموعی شاگرد"
              value={formData.totalStudents}
              onChange={handleChange}
              className={`form-control white-placeholder ${formErrors.totalStudents ? 'is-invalid' : ''}`}
              style={{background: "transparent", color: "white"}}
              min="0"
            />
            {formErrors.totalStudents && <div className="invalid-feedback">{formErrors.totalStudents}</div>}
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="graduationCycles"
              placeholder="تعداد دوره فراغت"
              value={formData.graduationCycles}
              onChange={handleChange}
              className={`form-control white-placeholder ${formErrors.graduationCycles ? 'is-invalid' : ''}`}
              style={{background: "transparent", color: "white"}}
              min="0"
            />
            {formErrors.graduationCycles && <div className="invalid-feedback">{formErrors.graduationCycles}</div>}
          </div>

          <div className="col-md-6">
            <input
              type="number"
              name="establishmentYear"
              placeholder="سال تاسیس رشته"
              value={formData.establishmentYear}
              onChange={handleChange}
              className={`form-control white-placeholder ${formErrors.establishmentYear ? 'is-invalid' : ''}`}
              style={{background: "transparent", color: "white"}}
              min="1300" max="1500"
            />
            {formErrors.establishmentYear && <div className="invalid-feedback">{formErrors.establishmentYear}</div>}
          </div>

          <div className="col-12 text-center mt-3">
            <button
              type="button"
              onClick={handleAddEntry}
              disabled={submitting}
              className="btn btn-primary px-4"
            >
              {submitting ? 'در حال افزودن...' : 'افزودن'}
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
                        disabled={deleting === entry.id}
                      >
                        {deleting === entry.id ? 'حذف...' : 'حذف'}
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
