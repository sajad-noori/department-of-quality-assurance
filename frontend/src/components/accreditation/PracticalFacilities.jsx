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

const StyledButton = styled(Button)({
  textTransform: 'none',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.2s ease-in-out',
});

const PracticalFacilities = () => {
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      console.error('Error fetching facilities:', err);
      setError('Error fetching facility data');
      showSnackbar('Error fetching facility data', 'error');
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
        showSnackbar('Error fetching user data', 'error');
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
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('لطفاً اسم رشته را وارد کنید');
      showSnackbar('لطفاً اسم رشته را وارد کنید', 'error');
      return false;
    }
    if (!formData.equipment_name.trim()) {
      setError('لطفاً نام وسیله کار عملی را وارد کنید');
      showSnackbar('لطفاً نام وسیله کار عملی را وارد کنید', 'error');
      return false;
    }
    if (!formData.equipment_count) {
      setError('لطفاً تعداد وسیله را وارد کنید');
      showSnackbar('لطفاً تعداد وسیله را وارد کنید', 'error');
      return false;
    }
    if (!formData.equipment_status) {
      setError('لطفاً وضعیت وسیله را وارد کنید');
      showSnackbar('لطفاً وضعیت وسیله را وارد کنید', 'error');
      return false;
    }
    return true;
  };

  const handleAddEntry = async () => {
    if (!user || user.role !== 'institute') {
      showSnackbar('شما دسترسی لازم برای این عملیات را ندارید', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

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
        showSnackbar('امکانات با موفقیت اضافه شد');
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      console.error('Error adding facility:', err);
      const errorMessage = err.response?.data?.message || 'Error adding facility data';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      showSnackbar('شما دسترسی لازم برای این عملیات را ندارید', 'error');
      return;
    }

    if (!window.confirm('آیا از حذف این امکانات اطمینان دارید؟')) {
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
        showSnackbar('امکانات با موفقیت حذف شد');
        setShouldRefresh(prev => !prev);
      }
    } catch (err) {
      console.error('Error deleting facility:', err);
      showSnackbar('Error deleting facility data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!user || user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center" role="alert">
        شما دسترسی لازم برای مشاهده این صفحه را ندارید
      </div>
    );
  }

  return (
    <div className="container mt-4 p-4 rounded shadow-sm" style={{ maxWidth: '700px' }}>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <label htmlFor="description" className="form-label small d-block mb-2">
        میزان تجهیزات موجود در ورکشاپ، لارم، لابراتوار و کتابخانه را بصورت رشته وار طی جدول ذیل درج نموده و وضعیت موجود آنرا بیان دارید.
      </label>

      <fieldset className="mb-3 mt-4 border rounded p-2">
        <legend className="float-none w-auto px-2 mb-2 small">تسهیلات و تجهیزات کار عملی</legend>
        <div className="row g-3">
          <div className="col-md-6">
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

          <div className="col-md-6">
            <input
              type="text"
              name="equipment_name"
              placeholder="وسیله کار عملی"
              value={formData.equipment_name}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{background: "transparent", color: "white"}}
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
              className="form-control white-placeholder"
              style={{background: "transparent", color: "white"}}
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <div className="col-md-6">
            <select
              name="equipment_status"
              value={formData.equipment_status}
              onChange={handleChange}
              className="form-control white-placeholder"
              style={{ background: "transparent", color: "white" }}
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
        <div className="mt-5">
          <h3 className="mb-3 fw-semibold">امکانات مرکز آموزشی:</h3>
          <div className="table-responsive">
            <table className="table table-bordered text-center" style={{ backgroundColor: 'white' }}>
              <thead className="table-dark">
                <tr>
                  <th className="text-white">اسم رشته</th>
                  <th className="text-white">وسیله کار عملی</th>
                  <th className="text-white">تعداد وسیله</th>
                  <th className="text-white">وضعیت وسیله</th>
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

export default PracticalFacilities;
