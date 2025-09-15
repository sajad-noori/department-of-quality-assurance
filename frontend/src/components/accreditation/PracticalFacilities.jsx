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
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

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

const PracticalFacilities = ({ onStepSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    equipment_name: '',
    equipment_count: '',
    equipment_status: '',
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

  const fetchFacilities = async () => {
    if (!user || user.role !== 'institute') return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/practical-facilities', {
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
      setError('خطا در دریافت اطلاعات تجهیزات عملی');
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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'institute') {
      fetchFacilities();
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
    if (!formData.equipment_name.trim()) {
      setError('لطفاً نام وسیله کار عملی را وارد کنید');
      return false;
    }
    if (!formData.equipment_count) {
      setError('لطفاً تعداد وسیله را وارد کنید');
      return false;
    }
    if (!formData.equipment_status) {
      setError('لطفاً وضعیت وسیله را وارد کنید');
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
      const response = await axios.post('http://localhost:5000/api/practical-facilities', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setFormData({
          name: '',
          equipment_name: '',
          equipment_count: '',
          equipment_status: '',
        });
        setSuccess('امکانات با موفقیت اضافه شد');
        setShouldRefresh(prev => !prev);
        if (onStepSubmit) onStepSubmit(7);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در افزودن تجهیزات عملی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      return;
    }
    if (!window.confirm('آیا از حذف این تجهیزات اطمینان دارید؟')) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/api/practical-facilities/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setSuccess('امکانات با موفقیت حذف شد');
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      setError('خطا در حذف تجهیزات عملی');
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
    <div className="academy-facilities-form glass-bg" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">🛠️</span>
            تجهیزات عملی مرکز آموزشی
          </h3>
          <p className="form-description" style={theme === 'light' ? { color: '#00b5d7' } : {  color: '#a9e5ff' }}>
            میزان تجهیزات موجود در ورکشاپ، لابراتوار و کتابخانه را بصورت رشته وار طی جدول ذیل درج نموده و وضعیت موجود آنرا بیان دارید.
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
          <legend className="float-none w-auto px-2 mb-2 small">تجهیزات عملی مرکز آموزشی</legend>
          <div className="row g-3">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <input
                type="text"
                name="equipment_name"
                placeholder="وسیله کار عملی"
                value={formData.equipment_name}
                onChange={handleChange}
                onFocus={() => handleFocus('equipment_name')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'equipment_name' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-6">
              <input
                type="number"
                name="equipment_count"
                placeholder="تعداد وسیله"
                value={formData.equipment_count}
                onChange={handleChange}
                onFocus={() => handleFocus('equipment_count')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'equipment_count' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="col-md-6">
              <select
                name="equipment_status"
                value={formData.equipment_status}
                onChange={handleChange}
                onFocus={() => handleFocus('equipment_status')}
                onBlur={handleBlur}
                className={`form-control white-placeholder ${focusedField === 'equipment_status' ? 'focused' : ''}`}
                style={theme === 'light' ? { background: '#fff', color: '#222' } : { background: 'transparent', color: 'white' }}
                disabled={isSubmitting}
              >
                <option value="" style={{color: "black"}}>وضعیت وسیله را انتخاب کنید</option>
                <option value="excellent" style={{color: "black"}}>عالی</option>
                <option value="good" style={{color: "black"}}>خوب</option>
                <option value="average" style={{color: "black"}}>متوسط</option>
                <option value="poor" style={{color: "black"}}>ضعیف</option>
              </select>
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
          <div className="uploaded-files-section">
            <div className="section-header">
              <h4 className="section-title">
                <span className="section-icon">🛠️</span>
                لیست تجهیزات عملی مرکز آموزشی
              </h4>
              <span className="file-count">({entries.length} مورد)</span>
            </div>
            <div className="table-container">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>اسم رشته</th>
                    <th>وسیله کار عملی</th>
                    <th>تعداد وسیله</th>
                    <th>وضعیت وسیله</th>
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
                      <td>{entry.equipment_name}</td>
                      <td>{entry.equipment_count}</td>
                      <td>
                        {entry.equipment_status === 'excellent' && 'عالی'}
                        {entry.equipment_status === 'good' && 'خوب'}
                        {entry.equipment_status === 'average' && 'متوسط'}
                        {entry.equipment_status === 'poor' && 'ضعیف'}
                      </td>
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
        .academy-facilities-form.glass-bg {
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
          font-size: clamp(1.1rem, 2.2vw + 0.3rem, 1.6rem);
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
          padding: 1.5rem;
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
          font-size: 1.3rem;
          font-weight: 600;
          color: #0dcaf0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-icon {
          font-size: 1.4rem;
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
          .academy-facilities-form.glass-bg { padding: clamp(1rem, 3vw, 1.25rem); }
          .form-title { font-size: 1.25rem; }
          .files-table th,
          .files-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
        /* Extra-small devices */
        @media (max-width: 480px) {
          .form-title { font-size: 1.1rem; }
          .form-icon { font-size: 1.1rem; }
          .form-description { font-size: 0.9rem; }
          .files-table th, .files-table td { font-size: 0.85rem; }
        }
        @media (max-width: 360px) {
          .form-title { font-size: 1rem; }
          .form-description { font-size: 0.85rem; }
          .files-table th, .files-table td { font-size: 0.8rem; }
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
        ${theme === 'light' ? `
        .academy-facilities-form.glass-bg input::placeholder {
          color: #666;
          opacity: 1;
        }
        .academy-facilities-form.glass-bg select option[disabled] {
          color: #888;
        }
        .academy-facilities-form.glass-bg .files-table {
          background: #fff;
          color: #222;
        }
        .academy-facilities-form.glass-bg .files-table th {
          background: #e0f7fa;
          color: #00b5d7;
          border-bottom: 1px solid #b2ebf2;
        }
        .academy-facilities-form.glass-bg .files-table td {
          color: #222;
          border-bottom: 1px solid #e0f7fa;
        }
        .academy-facilities-form.glass-bg .files-table tr:hover {
          background: #e0f7fa;
        }
        ` : ''}
      `}</style>
    </div>
  );
};

PracticalFacilities.propTypes = {
  onStepSubmit: PropTypes.func,
};

PracticalFacilities.defaultProps = {
  onStepSubmit: () => {},
};

export default PracticalFacilities;
