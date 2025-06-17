import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)({
  textTransform: 'none',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.2s ease-in-out',
});

const Departments = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    newEnrollments: '',
    totalStudents: '',
    graduationCycles: '',
    establishmentYear: '',
    numberOfStudents: '',
  });

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const fetchDepartments = async () => {
    if (!user || user.role !== 'institute') return;

    try {
      const response = await axios.get('http://localhost:5000/api/departments', {
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
      console.error('Error fetching departments:', err);
      setError('Error fetching department data');
    } finally {
      setLoading(false);
    }
  };

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
    if (user && user.role === 'institute') {
      fetchDepartments();
    }
  }, [user, shouldRefresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous error/success messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('لطفاً اسم رشته را وارد کنید');
      return false;
    }
    if (!formData.newEnrollments) {
      setError('لطفاً سال ایجاد را وارد کنید');
      return false;
    }
    // Get current Persian year
    const currentYear = new Date().getFullYear() - 621; // Convert Gregorian to Persian year
    const year = parseInt(formData.newEnrollments);
    if (year < 1300 || year > currentYear) {
      setError(`سال ایجاد باید بین ۱۳۰۰ تا ${currentYear} باشد`);
      return false;
    }
    if (!formData.totalStudents) {
      setError('لطفاً دوره آموزشی را انتخاب کنید');
      return false;
    }
    if (!formData.graduationCycles) {
      setError('لطفاً وضعیت فعال/غیرفعال را انتخاب کنید');
      return false;
    }
    if (!formData.establishmentYear) {
      setError('لطفاً تعداد اساتید رشته را وارد کنید');
      return false;
    }
    if (!formData.numberOfStudents) {
      setError('لطفاً تعداد محصل رشته را وارد کنید');
      return false;
    }
    return true;
  };

  const handleAddEntry = async () => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5000/api/departments', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        // Clear the form
        setFormData({
          name: '',
          newEnrollments: '',
          totalStudents: '',
          graduationCycles: '',
          establishmentYear: '',
          numberOfStudents: '',
        });
        setSuccess('رشته با موفقیت اضافه شد');
        // Trigger a refresh of the data
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      console.error('Error adding department:', err);
      setError(err.response?.data?.message || 'Error adding department data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      return;
    }

    if (!window.confirm('آیا از حذف این رشته اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/departments/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('رشته با موفقیت حذف شد');
        // Trigger a refresh of the data
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Error deleting department data');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress />
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
    <div className="container p-4 rounded shadow-sm">
      <label htmlFor="description" className="form-label small d-block mb-2">
        در فورم ذیل اسامی رشته های موجود در نهاد آموزشی را با ذکر دوره، تعداد استاد و شاگرد آن درج نمایید.
      </label>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
          <ErrorIcon className="me-2" />
          <div>{error}</div>
        </div>
      )}
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
          <CheckCircleIcon className="me-2" />
          <div>{success}</div>
        </div>
      )}

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
              disabled={isSubmitting}
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
              max={new Date().getFullYear() - 621} // Current Persian year
              disabled={isSubmitting}
            />
          </div>

          <div className="col-md-4">
            <select
              name="totalStudents"
              value={formData.totalStudents}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{ background: "transparent", color: "white" }}
              disabled={isSubmitting}
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
              value={formData.graduationCycles}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{ background: "transparent", color: "white" }}
              disabled={isSubmitting}
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
              min="0"
              disabled={isSubmitting}
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
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <div className="col-12 text-center mt-3">
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleAddEntry}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            >
              {isSubmitting ? 'در حال افزودن...' : 'افزودن'}
            </StyledButton>
          </div>
        </div>
      </fieldset>

      {entries.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-3 fw-semibold">لیست رشته‌ها:</h3>
          <div className="table-responsive">
            <table className="table table-bordered text-center" style={{ backgroundColor: 'white' }}>
              <thead className="table-dark">
                <tr>
                  <th className="text-white">اسم رشته</th>
                  <th className="text-white">سال ایجاد</th>
                  <th className="text-white">دوره آموزشی</th>
                  <th className="text-white">فعال / غیر فعال</th>
                  <th className="text-white">تعداد اساتید رشته</th>
                  <th className="text-white">تعداد محصل</th>
                  <th className="text-white">عملیات</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {entries.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      color: '#000000'
                    }}
                  >
                    <td>{entry.name}</td>
                    <td>{entry.new_enrollments}</td>
                    <td>{entry.total_students}</td>
                    <td>{entry.graduation_cycles}</td>
                    <td>{entry.establishment_year}</td>
                    <td>{entry.number_of_students}</td>
                    <td>
                      <StyledButton
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(entry.id)}
                        startIcon={<DeleteIcon />}
                      >
                        حذف
                      </StyledButton>
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

export default Departments;
