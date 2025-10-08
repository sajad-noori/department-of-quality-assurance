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
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 10,
  fontSize: '1rem',
  background: 'linear-gradient(135deg, #0dcaf0, #00b5d7)',
  color: '#030305',
  boxShadow: '0 6px 20px rgba(13, 202, 240, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #00b5d7, #0dcaf0)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(13, 202, 240, 0.3)',
  },
  '&:disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const Departments = ({ onStepSubmit }) => {
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
  const [focusedField, setFocusedField] = useState(null);
  const { theme } = useTheme();

  const fetchDepartments = async () => {
    if (!user || user.role !== 'institute') return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`, {
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
      setError('خطا در دریافت اطلاعات رشته‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
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
    setError(null);
    setSuccess(null);
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('لطفاً اسم رشته را وارد کنید');
      return false;
    }
    if (!formData.newEnrollments) {
      setError('لطفاً سال ایجاد را وارد کنید');
      return false;
    }
    const currentYear = new Date().getFullYear() - 621;
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
      const response = await axios.post(`${API_BASE_URL}/api/departments`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setFormData({
          name: '',
          newEnrollments: '',
          totalStudents: '',
          graduationCycles: '',
          establishmentYear: '',
          numberOfStudents: '',
        });
        setSuccess('رشته با موفقیت اضافه شد');
        setShouldRefresh(prev => !prev);
        if (onStepSubmit) onStepSubmit(6);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در افزودن رشته');
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
      const response = await axios.delete(`${API_BASE_URL}/api/departments/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setSuccess('رشته با موفقیت حذف شد');
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      setError('خطا در حذف رشته');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress style={{ color: '#0dcaf0' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">برای پر کردن این فرم، حساب کاربری شما باید به عنوان مرکز آموزشی ثبت شود.</p>
        <hr />
        <p className="mb-0">لطفاً با شماره <strong>۰۷۷۸۵۵۸۹۶۸</strong> تماس بگیرید تا حساب کاربری شما به عنوان مرکز آموزشی تنظیم شود.</p>
      </div>
    );
  }

  return (
    <div className="departments-form glass-bg" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">🏫</span>
            رشته‌های موجود
          </h3>
          <p className="form-description">
            در فورم ذیل اسامی رشته های موجود در نهاد آموزشی را با ذکر دوره، تعداد استاد و شاگرد آن درج نمایید.
          </p>
        </div>

        {success && (
          <div className="success-notification">
            <div className="notification-content">
              <span className="notification-icon">✅</span>
              <span>{success}</span>
            </div>
            <button type="button" className="close-button" onClick={() => setSuccess(null)}>
              ✕
            </button>
          </div>
        )}
        {error && (
          <div className="error-notification">
            <div className="notification-content">
              <span className="notification-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button type="button" className="close-button" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        <fieldset className="mb-3 border rounded p-2 form-section">
          <legend className="float-none w-auto px-2 mb-2 small">فورم درج رشته ها</legend>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <input
                type="text"
                name="name"
                placeholder="اسم رشته"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'name' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="number"
                name="newEnrollments"
                placeholder="سال ایجاد"
                value={formData.newEnrollments}
                onChange={handleChange}
                onFocus={() => handleFocus('newEnrollments')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'newEnrollments' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                min="1300"
                max={new Date().getFullYear() - 621}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-12 col-md-4">
              <select
                name="totalStudents"
                value={formData.totalStudents}
                onChange={handleChange}
                onFocus={() => handleFocus('totalStudents')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'totalStudents' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                disabled={isSubmitting}
              >
                <option value="" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>دوره آموزشی را انتخاب کنید</option>
                <option value="دو ساله" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>دو ساله</option>
                <option value="سه ساله" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>سه ساله</option>
                <option value="پنج ساله" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>پنج ساله</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <select 
                name="graduationCycles"
                value={formData.graduationCycles}
                onChange={handleChange}
                onFocus={() => handleFocus('graduationCycles')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'graduationCycles' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                disabled={isSubmitting}
              >
                <option value="" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>فعال / غیر فعال</option>
                <option value="فعال" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>فعال</option>
                <option value="غیر فعال" style={theme === 'light' ? { color: '#222' } : { color: 'black' }}>غیر فعال</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <input
                type="number"
                name="establishmentYear"
                placeholder="تعداد اساتید رشته"
                value={formData.establishmentYear}
                onChange={handleChange}
                onFocus={() => handleFocus('establishmentYear')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'establishmentYear' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="number"
                name="numberOfStudents"
                placeholder="تعداد محصل رشته"
                value={formData.numberOfStudents}
                onChange={handleChange}
                onFocus={() => handleFocus('numberOfStudents')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'numberOfStudents' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
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
                className="add-btn"
              >
                {isSubmitting ? 'در حال افزودن...' : 'افزودن'}
              </StyledButton>
            </div>
          </div>
        </fieldset>

        {entries.length > 0 && (
          <div className="uploaded-files-section">
            <div className="section-header">
              <h4 className="section-title">
                <span className="section-icon">📚</span>
                لیست رشته‌ها
              </h4>
              <span className="file-count">({entries.length} رشته)</span>
            </div>
            <div className="table-container">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>اسم رشته</th>
                    <th>سال ایجاد</th>
                    <th>دوره آموزشی</th>
                    <th>فعال / غیر فعال</th>
                    <th>تعداد اساتید رشته</th>
                    <th>تعداد محصل</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      style={{ 
                        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(13,202,240,0.05)',
                        color: '#f0f0f0',
                        transition: 'background 0.3s',
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
                          className="delete-btn"
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
      <style>{`
        .departments-form.glass-bg {
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: clamp(1rem, 3.5vw, 2rem);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .form-container {
          position: relative;
          z-index: 1;
        }
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-title {
          font-size: clamp(1rem, 1.8vw + 0.2rem, 1.3rem);
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .form-icon {
          font-size: clamp(1.1rem, 2.2vw, 1.6rem);
        }
        .form-description {
          color: #a9e5ff;
          font-size: clamp(0.85rem, 0.9vw + 0.1rem, 0.95rem);
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }
        .success-notification,
        .error-notification {
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          animation: slideInDown 0.3s ease-out;
        }
        .error-notification {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
          border: 1px solid rgba(220, 53, 69, 0.2);
        }
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #28a745;
          font-size: 0.9rem;
        }
        .error-notification .notification-content {
          color: #dc3545;
        }
        .notification-icon {
          font-size: 1.1rem;
        }
        .close-button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .close-button:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }
        .form-section {
          background: rgba(13,202,240,0.05);
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid rgba(13,202,240,0.1);
          margin-bottom: 1.5rem;
        }
        .focused {
          border-color: #0dcaf0 !important;
          box-shadow: 0 0 0 2px #0dcaf0333 !important;
          background: rgba(13,202,240,0.08) !important;
        }
        .uploaded-files-section {
          background: rgba(13,202,240,0.03);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13,202,240,0.1);
          margin-top: 2rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: clamp(1rem, 1.6vw + 0.3rem, 1.3rem);
          font-weight: 600;
          color: #0dcaf0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-icon {
          font-size: clamp(1.05rem, 1.6vw + 0.2rem, 1.2rem);
        }
        .file-count {
          font-size: 0.9rem;
          color: #a9e5ff;
          background: rgba(13,202,240,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
        }
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
        }
        .files-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }
        .files-table th {
          background: rgba(13,202,240,0.1);
          color: #0dcaf0;
          font-weight: 600;
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid rgba(13,202,240,0.2);
        }
        .files-table td {
          padding: 1rem;
          text-align: center;
          color: #f0f0f0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .files-table tr:hover {
          background: rgba(13,202,240,0.05);
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .departments-form.glass-bg { padding: clamp(0.75rem, 2.5vw, 1rem); border-radius: 12px; }
          .form-title { font-size: 1.05rem; }
          .form-description { font-size: 0.9rem; }
          .form-section { padding: clamp(0.75rem, 2.5vw, 1rem); }
          .departments-form.glass-bg .form-control { font-size: 0.9rem; padding: 0.5rem 0.75rem; }
          .add-btn { font-size: 0.9rem; padding: 0.5rem 0.9rem; }
          .files-table th,
          .files-table td {
            padding: 0.6rem 0.4rem;
            font-size: 0.8rem;
          }
        }

        /* Extra-small devices */
        @media (max-width: 480px) {
          .form-title { font-size: 1rem; }
          .form-icon { font-size: 1rem; }
          .form-description { font-size: 0.85rem; }
          .departments-form.glass-bg .form-control { font-size: 0.85rem; padding: 0.45rem 0.7rem; }
          .add-btn { font-size: 0.85rem; padding: 0.45rem 0.8rem; }
          .files-table th, .files-table td { font-size: 0.8rem; }
        }

        @media (max-width: 360px) {
          .form-title { font-size: 0.95rem; }
          .form-description { font-size: 0.8rem; }
          .departments-form.glass-bg .form-control { font-size: 0.82rem; padding: 0.4rem 0.65rem; }
          .add-btn { font-size: 0.8rem; padding: 0.4rem 0.7rem; }
          .files-table th, .files-table td { font-size: 0.78rem; }
        }
        ${theme === 'light' ? `
        .departments-form.glass-bg {
          background: #fff;
          color: #222;
          border: 1px solid #e0f7fa;
          box-shadow: 0 8px 32px rgba(13,202,240,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
        }
        .form-title {
          color: #0dcaf0;
        }
        .form-header {
          color: #0dcaf0;
        }
        .form-description {
          color: #00b5d7;
        }
        .success-notification {
          background: linear-gradient(135deg, #e6ffe6 0%, #e7fff7 100%);
          border: 1px solid #b2ffb2;
        }
        .error-notification {
          background: linear-gradient(135deg, #fffbe6 0%, #fffde7 100%);
          border: 1px solid #ffe082;
        }
        .notification-content {
          color: #28a745;
        }
        .error-notification .notification-content {
          color: #ffb300;
        }
        .close-button {
          color: #0dcaf0;
        }
        .close-button:hover {
          background: #e0f7fa;
        }
        .form-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .focused {
          border-color: #0dcaf0 !important;
          box-shadow: 0 0 0 2px #b2ebf2 !important;
          background: #e0f7fa !important;
        }
        .uploaded-files-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .section-title {
          color: #00b5d7;
        }
        .file-count {
          color: #00b5d7;
          background: #e0f7fa;
        }
        .table-container {
          background: #f7fcfd;
        }
        .files-table {
          background: #fff;
          color: #222;
        }
        .files-table th {
          background: #e0f7fa;
          color: #00b5d7;
          border-bottom: 1px solid #b2ebf2;
        }
        .files-table td {
          color: #222;
          border-bottom: 1px solid #e0f7fa;
        }
        .files-table tr:hover {
          background: #e0f7fa;
        }
        .departments-form.glass-bg input::placeholder {
          color: #666;
          opacity: 1;
        }
        .departments-form.glass-bg select option[disabled] {
          color: #888;
        }
        .delete-btn {
          background: linear-gradient(135deg, #ff6b6b, #dc3545) !important;
          color: white !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .delete-btn:hover {
          background: linear-gradient(135deg, #dc3545, #ff6b6b) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3) !important;
        }
        ` : ''}
      `}</style>
    </div>
  );
};

Departments.propTypes = {
  onStepSubmit: PropTypes.func,
};

Departments.defaultProps = {
  onStepSubmit: () => {},
};

export default Departments;
