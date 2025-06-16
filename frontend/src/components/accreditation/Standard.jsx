import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

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
  padding: '8px',
  margin: '4px 0',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});

function Standard({ value, onChange }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setError('Error fetching standards');
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      return !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType);
    });

    if (invalidFiles.length > 0) {
      setError('Only PDF and Word documents are allowed');
      return;
    }

    // Validate file size (10MB limit)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Files must be less than 10MB');
      return;
    }

    setTempFiles((prev) => [...prev, ...files]);
    setError(null);
    setSuccess('Files selected successfully');
  };

  const removeTempFile = (index) => {
    setTempFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!user || user.role !== 'institute') {
      setError('Only institute users can add standards');
      return;
    }

    if (!value.trim()) {
      setError('Please enter a standard description');
      return;
    }

    if (tempFiles.length === 0) {
      setError('Please select at least one file');
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
      setSuccess('Standards added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== 'institute') {
      setError('Only institute users can delete standards');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this standard?')) {
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
      setSuccess('Standard deleted successfully');
    } catch (err) {
      setError('Error deleting standard');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning text-center p-4" role="alert">
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  if (user.role !== 'institute') {
    return (
      <div className="alert alert-warning text-center p-4" role="alert">
        <h4 className="alert-heading mb-3">دسترسی محدود</h4>
        <p className="mb-3">فقط کاربران مرکز آموزشی می‌توانند به این بخش دسترسی داشته باشند.</p>
      </div>
    );
  }

  return (
    <>
      <label htmlFor="description" className="form-label small d-block mb-2">
        در این بخش مرکز آموزشی باید مطابقت ساختار های موجود در مرکز آموزشی را با ستندرد ها و معیارات ریاست تضمین کیفیت و اعتبار دهی بصورت مشرح طبق روال ذیل بیان نماید:
      </label>
      <div className="p-3 border rounded shadow-sm">
        {/* Description Section */}
        <div className="mb-4">
          <textarea
            id="description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`ستندرد اول :(عنوان ستندرد)
تشریح ساختار های موجود در مطابقت با نیازمندی های تعریف شده ستندرد را در اینجا بنوسید.`}
            className="form-control white-placeholder"
            rows={10}
            style={{ resize: "none", backgroundColor: "transparent", color: "white" }}
          />
        </div>

        {/* File Upload Section */}
        <div className="mb-4 p-3 border rounded">
          <p className="small mb-2">مدارک اثباته برای هر ستندرد جداگانه در این قسمت اضافه کنید:</p>
          <div className="text-center mb-3">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
            >
              آپلود فایل
              <VisuallyHiddenInput 
                type="file" 
                onChange={handleFileChange} 
                multiple 
                accept=".pdf,.doc,.docx"
              />
            </Button>
          </div>
          {tempFiles.length > 0 && (
            <div className="mt-3">
              <p className="small mb-2">Selected files:</p>
              {tempFiles.map((file, index) => (
                <FilePreview key={index}>
                  <span className="flex-grow-1">{file.name}</span>
                  <Button
                    size="small"
                    onClick={() => removeTempFile(index)}
                    disabled={loading}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </FilePreview>
              ))}
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <ErrorIcon className="me-2" />
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <CheckCircleIcon className="me-2" />
            <div>{success}</div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="button" 
          onClick={handleAdd} 
          className="btn btn-primary w-100"
          disabled={loading || tempFiles.length === 0 || !value.trim()}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" className="me-2" />
              در حال آپلود...
            </>
          ) : 'افزودن'}
        </button>
      </div>

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h6 className="mb-3">ستندرد های اپلود شده</h6>
          <div className="table-responsive">
            <table className="table table-bordered table-sm table-striped text-center">
              <thead className="table-light">
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
    </>
  );
}

export default Standard;