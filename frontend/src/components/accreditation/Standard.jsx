import React, { useState, useEffect, useRef } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 2,
});

const FilePreview = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  margin: '8px 0',
  backgroundColor: 'rgba(13, 202, 240, 0.1)',
  border: '1px solid rgba(13, 202, 240, 0.2)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(13, 202, 240, 0.15)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(13, 202, 240, 0.2)',
  }
});

function Standard({ value, onChange, onStepSubmit }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();

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
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'institute') {
      fetchStandards();
    }
  }, [user]);

  const fetchStandards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/standards', {
        withCredentials: true
      });
      setUploadedFiles(response.data.map(standard => ({
        id: standard.id,
        name: standard.original_file_name,
        firstLine: standard.standard_title
      })));
    } catch (err) {
      setError('خطا در بارگذاری ستندردها');
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };
    
  const processFiles = (files) => {
    // Validate file types
    const invalidFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      return !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType);
    });

    if (invalidFiles.length > 0) {
      setError('فقط فایل‌های PDF و Word مجاز هستند');
      return;
    }

    // Validate file size (10MB limit)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('حجم فایل‌ها باید کمتر از ۱۰ مگابایت باشد');
      return;
    }

    setTempFiles((prev) => [...prev, ...files]);
    setError(null);
    setSuccess('فایل‌ها با موفقیت انتخاب شدند');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const removeTempFile = (index) => {
    setTempFiles(prev => prev.filter((_, i) => i !== index));
    setSuccess('فایل حذف شد');
  };

  const handleAdd = async () => {
    if (!user || user.role !== 'institute') {
      setError('فقط کاربران مرکز آموزشی می‌توانند ستندرد اضافه کنند');
      return;
    }

    if (!value.trim()) {
      setError('لطفاً توضیحات ستندرد را وارد کنید');
      return;
    }

    if (tempFiles.length === 0) {
      setError('لطفاً حداقل یک فایل انتخاب کنید');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const firstLine = value.split("\n")[0];
      
      // Upload each file
      for (const file of tempFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('standardTitle', firstLine);
        formData.append('description', value);

        await axios.post('http://localhost:5000/api/standards', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Refresh the standards list
      await fetchStandards();
      setTempFiles([]);
      onChange(''); // Clear the textarea
      setSuccess('ستندردها با موفقیت اضافه شدند');
      if (onStepSubmit) onStepSubmit(5);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در آپلود فایل‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      setError('فقط کاربران مرکز آموزشی می‌توانند ستندرد حذف کنند');
      return;
    }

    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این ستندرد را حذف کنید؟')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`http://localhost:5000/api/standards/${id}`, {
        withCredentials: true
      });
      await fetchStandards();
      setSuccess('ستندرد با موفقیت حذف شد');
    } catch (err) {
      setError('خطا در حذف ستندرد');
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => setFocusedField('description');
  const handleBlur = () => setFocusedField(null);

  const handleUploadAreaClick = (e) => {
    if (
      e.target.closest('.upload-button') ||
      e.target.tagName === 'INPUT'
    ) {
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
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
    <div className="standard-form" dir="rtl">
      <div className="form-container">
        <div className="form-header">
          <h3 className="form-title">
            <span className="form-icon">📋</span>
            مطابقت با ستندرد های تضمین کیفیت
          </h3>
          <p className="form-description">
        در این بخش مرکز آموزشی باید مطابقت ساختار های موجود در مرکز آموزشی را با ستندرد ها و معیارات ریاست تضمین کیفیت و اعتبار دهی بصورت مشرح طبق روال ذیل بیان نماید:
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

        <div className="form-section">
          <div className="form-group">
            <label className="form-label">توضیحات ستندرد <span className="required">*</span></label>
            <div className="input-wrapper">
          <textarea
            id="description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            placeholder={`ستندرد اول :(عنوان ستندرد)
تشریح ساختار های موجود در مطابقت با نیازمندی های تعریف شده ستندرد را در اینجا بنوسید.`}
                className={`form-input ${focusedField === 'description' ? 'focused' : ''}`}
            rows={10}
          />
              <div className="input-border"></div>
            </div>
        </div>

          <div className="upload-section">
            <h4 className="upload-title">
              <span className="upload-icon">📎</span>
              آپلود مدارک اثباته
            </h4>
            <p className="upload-description">مدارک اثباته برای هر ستندرد جداگانه در این قسمت اضافه کنید:</p>
            
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleUploadAreaClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="upload-content">
                <CloudUploadIcon className="upload-icon-large" />
                <p className="upload-text">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
                <p className="upload-hint">فقط فایل‌های PDF و Word (حداکثر ۱۰ مگابایت)</p>
            <Button
              component="label"
              variant="contained"
                  className="upload-button"
              disabled={loading}
                  tabIndex={-1}
            >
                  انتخاب فایل
              <VisuallyHiddenInput 
                type="file" 
                onChange={handleFileChange} 
                multiple 
                accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
              />
            </Button>
          </div>
            </div>

          {tempFiles.length > 0 && (
              <div className="temp-files-section">
                <h5 className="temp-files-title">فایل‌های انتخاب شده:</h5>
              {tempFiles.map((file, index) => (
                <FilePreview key={index}>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  <Button
                    size="small"
                    onClick={() => removeTempFile(index)}
                    disabled={loading}
                      className="remove-file-btn"
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </FilePreview>
              ))}
            </div>
          )}
        </div>

          <div className="submit-section">
        <button 
          type="button" 
          onClick={handleAdd} 
              className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading || tempFiles.length === 0 || !value.trim()}
        >
          {loading ? (
            <>
                  <span className="spinner"></span>
              در حال آپلود...
            </>
              ) : (
                <>
                  <span className="button-icon">➕</span>
                  افزودن ستندرد
                </>
              )}
        </button>
          </div>
      </div>

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
          <div className="uploaded-files-section">
            <div className="section-header">
              <h4 className="section-title">
                <span className="section-icon">📊</span>
                ستندرد های اپلود شده
              </h4>
              <span className="file-count">({uploadedFiles.length} فایل)</span>
            </div>
            <div className="table-container">
              <table className="files-table">
                <thead>
                <tr>
                  <th>شماره</th>
                  <th>ستندرد</th>
                  <th>نام فایل</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={file.id}>
                    <td>{index + 1}</td>
                    <td>{file.firstLine || "-"}</td>
                    <td>{file.name}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(file.id)}
                        disabled={loading}
                          className="delete-btn"
                        startIcon={<DeleteIcon />}
                      >
                        حذف
                      </Button>
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
        .standard-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
          font-size: 1.8rem;
          font-weight: 700;
          color: #0dcaf0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .form-icon {
          font-size: 2rem;
        }
        
        .form-description {
          color: #a9e5ff;
          font-size: 0.95rem;
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
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
        
        .form-section {
          background: rgba(13, 202, 240, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #a9e5ff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .required {
          color: #ff6b6b;
          font-weight: bold;
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f0f0f0;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          resize: vertical;
        }
        
        .form-input::placeholder {
          color: rgba(240, 240, 240, 0.6);
        }
        
        .form-input:focus {
          outline: none;
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
          box-shadow: 0 0 0 3px rgba(13, 202, 240, 0.1);
          transform: translateY(-1px);
        }
        
        .form-input.focused {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.1);
        }
        
        .input-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
          transition: width 0.3s ease;
        }
        
        .form-input:focus ~ .input-border {
          width: 100%;
        }
        
        .upload-section {
          background: rgba(13, 202, 240, 0.03);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
          margin-bottom: 1.5rem;
        }
        
        .upload-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #0dcaf0;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .upload-icon {
          font-size: 1.3rem;
        }
        
        .upload-description {
          color: #a9e5ff;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .upload-area {
          border: 2px dashed rgba(13, 202, 240, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: rgba(13, 202, 240, 0.02);
        }
        
        .upload-area:hover,
        .upload-area.drag-active {
          border-color: #0dcaf0;
          background: rgba(13, 202, 240, 0.05);
          transform: translateY(-2px);
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .upload-icon-large {
          font-size: 3rem !important;
          color: #0dcaf0;
          margin-bottom: 0.5rem;
        }
        
        .upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f0f0f0;
          margin: 0;
        }
        
        .upload-hint {
          font-size: 0.85rem;
          color: #a9e5ff;
          margin: 0;
        }
        
        .upload-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7) !important;
          color: #030305 !important;
          font-weight: 600 !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 8px !important;
          margin-top: 1rem !important;
          transition: all 0.3s ease !important;
        }
        
        .upload-button:hover {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3) !important;
        }
        
        .temp-files-section {
          margin-top: 1.5rem;
        }
        
        .temp-files-title {
          font-size: 1rem;
          font-weight: 600;
          color: #a9e5ff;
          margin-bottom: 1rem;
        }
        
        .file-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-grow: 1;
        }
        
        .file-name {
          font-weight: 500;
          color: #f0f0f0;
        }
        
        .file-size {
          font-size: 0.8rem;
          color: #a9e5ff;
        }
        
        .remove-file-btn {
          color: #ff6b6b !important;
          min-width: auto !important;
          padding: 0.25rem !important;
        }
        
        .remove-file-btn:hover {
          background: rgba(255, 107, 107, 0.1) !important;
        }
        
        .submit-section {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        
        .submit-button {
          position: relative;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #030305;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 6px 20px rgba(13, 202, 240, 0.3);
        }
        
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(13, 202, 240, 0.4);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .button-icon {
          font-size: 1.2rem;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s linear infinite;
        }
        
        .uploaded-files-section {
          background: rgba(13, 202, 240, 0.03);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(13, 202, 240, 0.1);
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
          background: rgba(13, 202, 240, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }
        
        .files-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }
        
        .files-table th {
          background: rgba(13, 202, 240, 0.1);
          color: #0dcaf0;
          font-weight: 600;
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid rgba(13, 202, 240, 0.2);
        }
        
        .files-table td {
          padding: 1rem;
          text-align: center;
          color: #f0f0f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .files-table tr:hover {
          background: rgba(13, 202, 240, 0.05);
        }
        
        .delete-btn {
          background: linear-gradient(135deg, #ff6b6b, #dc3545) !important;
          color: white !important;
          font-weight: 600 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .delete-btn:hover {
          background: linear-gradient(135deg, #dc3545, #ff6b6b) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3) !important;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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
          .standard-form {
            padding: 1rem;
          }
          
          .form-title {
            font-size: 1.5rem;
          }
          
          .upload-area {
            padding: 1.5rem;
          }
          
          .upload-icon-large {
            font-size: 2.5rem !important;
          }
          
          .files-table th,
          .files-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.9rem;
          }
        }
        ${theme === 'light' ? `
        .standard-form {
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
        .form-label {
          color: #00b5d7;
        }
        .required {
          color: #ff6b6b;
        }
        .form-input {
          background: #fff;
          border: 2px solid #e0f7fa;
          color: #222;
        }
        .form-input::placeholder {
          color: #90a4ae;
        }
        .form-input:focus {
          border-color: #0dcaf0;
          background: #e0f7fa;
          box-shadow: 0 0 0 3px #b2ebf2;
        }
        .form-input.focused {
          border-color: #0dcaf0;
          background: #e0f7fa;
        }
        .input-border {
          background: linear-gradient(90deg, #0dcaf0, #00b5d7);
        }
        .form-input:focus ~ .input-border {
          width: 100%;
        }
        .error-message {
          color: #ff6b6b;
        }
        .upload-section {
          background: #f7fcfd;
          border: 1px solid #e0f7fa;
        }
        .upload-title {
          color: #00b5d7;
        }
        .upload-description {
          color: #00b5d7;
        }
        .upload-area {
          border: 2px dashed #b2ebf2;
          background: #f7fcfd;
        }
        .upload-area:hover,
        .upload-area.drag-active {
          border-color: #0dcaf0;
          background: #e0f7fa;
        }
        .upload-icon-large {
          color: #0dcaf0;
        }
        .upload-text {
          color: #00b5d7;
        }
        .upload-hint {
          color: #90a4ae;
        }
        .upload-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7) !important;
          color: #fff !important;
        }
        .upload-button:hover {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0) !important;
        }
        .temp-files-title {
          color: #00b5d7;
        }
        .file-name {
          color: #222;
        }
        .file-size {
          color: #90a4ae;
        }
       
        .submit-section {
          background: none;
        }
        .submit-button {
          background: linear-gradient(135deg, #0dcaf0, #00b5d7);
          color: #fff;
          box-shadow: 0 2px 8px rgba(13,202,240,0.10);
        }
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00b5d7, #0dcaf0);
        }
        .submit-button:disabled {
          opacity: 0.7;
        }
        .button-icon {
          color: #0dcaf0;
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
        
        @media (max-width: 768px) {
          .standard-form {
            padding: 1.5rem;
          }
        }
        ` : ''}
      `}</style>
    </div>
  );
}

Standard.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onStepSubmit: PropTypes.func,
};

Standard.defaultProps = {
  value: '',
  onChange: () => {},
  onStepSubmit: () => {}
};

export default Standard;