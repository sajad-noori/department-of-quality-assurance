import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import PropTypes from 'prop-types';

const categoryColors = {
  'آموزشی': 'info',
  'ارزیابی': 'success',
  'نیازسنجی': 'warning',
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (ext === 'doc' || ext === 'docx') return '📝';
  return '📎';
}

const LoadingSkeleton = ({ theme }) => (
  <div className="row g-3 justify-content-center">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div className={`card h-100 ${theme === 'light' ? 'light-card' : 'dark-card'} skeleton-card`}>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className="skeleton-icon me-3"></div>
              <div className="flex-grow-1">
                <div className="skeleton-title mb-2"></div>
                <div className="skeleton-badge"></div>
              </div>
            </div>
            <div className="skeleton-text mb-3"></div>
            <div className="skeleton-text-short mb-3"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

LoadingSkeleton.propTypes = {
  theme: PropTypes.string.isRequired,
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Questionnaires() {
  const { theme } = useTheme();
  const query = useQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState(query.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionnaires, setQuestionnaires] = useState([]);
  const fileInputs = useRef({});
  const [uploading, setUploading] = useState({});
  const [uploadMessage, setUploadMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [uploaded, setUploaded] = useState({});

  // Fetch questionnaires from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/questionnaires', { credentials: 'include' })
      .then(res => res.json())
      .then(async data => {
        if (data.success) {
          setQuestionnaires(data.data || []);
          // Fetch filled questionnaires for this user
          try {
            const filledRes = await fetch('/api/questionnaires/filled/user', { credentials: 'include' });
            const filledData = await filledRes.json();
            if (filledData.success && Array.isArray(filledData.data)) {
              // Build uploaded state: { [questionnaire_id]: true }
              const uploadedMap = {};
              filledData.data.forEach(fq => { uploadedMap[fq.questionnaire_id] = true; });
              setUploaded(uploadedMap);
            }
          } catch (err) {
            // Ignore error, just don't set uploaded
          }
        } else {
          setError(data.message || 'خطا در دریافت پرسشنامه‌ها');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('خطا در ارتباط با سرور');
        setLoading(false);
      });
  }, []);

  // Keep URL in sync with search
  useEffect(() => {
    if (search) {
      navigate(`?search=${encodeURIComponent(search)}`, { replace: true });
    } else {
      navigate('', { replace: true });
    }
  }, [search, navigate]);

  const filtered = questionnaires.filter(q =>
    (q.title && q.title.includes(search)) ||
    (q.description && q.description.includes(search))
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestionnaires = filtered.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Auto-clear success message after 10 seconds
  useEffect(() => {
    if (uploadMessage && uploadMessage.includes('موفقیت')) {
      const timer = setTimeout(() => {
        setUploadMessage('');
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [uploadMessage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Download link uses backend file_url
  const getFileUrl = (file_url) => file_url ? `http://localhost:5000/uploads/${file_url}` : '#';

  const handleUploadClick = (id) => {
    if (fileInputs.current[id]) {
      fileInputs.current[id].click();
    }
  };

  const handleFileChange = async (e, q) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadMessage('');
    // Only allow PDF, DOC, DOCX
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadMessage('فقط فایل PDF یا Word مجاز است.');
      e.target.value = '';
      return;
    }
    setUploading(prev => ({ ...prev, [q.id]: true }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionnaire_id', q.id);
    try {
      const res = await fetch('/api/questionnaires/filled', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadMessage('پرسشنامه با موفقیت ارسال شد.');
        setUploaded(prev => ({ ...prev, [q.id]: true }));
      } else {
        setUploadMessage(data.message || 'خطا در ارسال پرسشنامه');
      }
    } catch (err) {
      setUploadMessage('خطا در ارتباط با سرور');
    }
    setUploading(prev => ({ ...prev, [q.id]: false }));
    e.target.value = '';
  };

  return (
    <div className={theme === 'light' ? 'light-container' : 'dark-container'} dir="rtl">
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        {/* Header Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center mb-4">
              <h2 className={`mb-2 responsive-title ${theme === 'light' ? 'light-text' : 'dark-text'}`}> 
                <i className="fas fa-list-alt me-2 text-info"></i>
                پرسشنامه‌ها
              </h2>
              <p className={`mb-0 responsive-subtitle ${theme === 'light' ? 'light-text' : 'text-light'}`}>
                {filtered.length} پرسشنامه یافت شد
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div className={`card ${theme === 'light' ? 'light-card' : 'dark-card'}`}>
              <div className="card-body">
                <div className="input-group">
                  <span className={`input-group-text ${theme === 'light' ? 'light-input-group' : 'dark-input-group'}`}>
                    <i className={`fas fa-search ${theme === 'light' ? 'text-dark' : 'text-light'}`}></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${theme === 'light' ? 'light-input' : 'dark-input'}`}
                    placeholder={"جستجو براساس عنوان، توضیحات یا دسته‌بندی..."}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="btn btn-outline-light"
                      onClick={() => setSearch('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show upload message */}
        {uploadMessage && (
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-lg-8">
              <div className={`alert ${uploadMessage.includes('موفقیت') ? 'alert-success' : 'alert-danger'} d-flex align-items-center text-center ${theme === 'light' ? 'light-alert' : 'dark-alert'}`} role="alert">
                <i className={`fas ${uploadMessage.includes('موفقیت') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                <div className="responsive-text">{uploadMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="row justify-content-center">
            <div className="col-12">
              <LoadingSkeleton theme={theme} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className={`alert alert-danger d-flex align-items-center text-center ${theme === 'light' ? 'light-alert' : 'dark-alert'}`} role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div className="responsive-text">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center py-5">
              <i className={`fas fa-search fa-2x fa-md-3x mb-3 ${theme === 'light' ? 'text-secondary' : 'text-muted'}`}></i>
              <h4 className={`responsive-title ${theme === 'light' ? 'light-text' : 'text-light'}`}>هیچ پرسشنامه‌ای یافت نشد</h4>
              <p className={`responsive-text ${theme === 'light' ? 'text-secondary' : 'text-muted'}`}>
                {search ? "لطفاً کلمات کلیدی دیگری را امتحان کنید." : "در حال حاضر هیچ پرسشنامه‌ای موجود نیست."}
              </p>
            </div>
          </div>
        )}

        {/* Questionnaires Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="row g-3">
            {paginatedQuestionnaires.map((q) => (
              <div key={q.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className={`card h-100 hover-shadow ${theme === 'light' ? 'light-card' : 'dark-card'}`}> 
                  <div className="card-body d-flex flex-column text-center">
                    <div className="d-flex align-items-start mb-3">
                      <div className="me-3 fs-2 flex-shrink-0">
                        <span style={{ fontSize: '2rem' }}>{getFileIcon(q.file_name || '')}</span>
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <h6 className={`card-title mb-1 text-truncate document-title ${theme === 'light' ? 'light-text' : 'dark-text'}`} title={q.title}>
                          {q.title}
                        </h6>
                      </div>
                    </div>
                    {q.description && (
                      <p className={`card-text small mb-3 flex-grow-1 ${theme === 'light' ? 'text-secondary' : 'text-muted'}`} style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {q.description}
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-top-0 mt-auto">
                    <a
                      href={getFileUrl(q.file_url)}
                      className="btn btn-info btn-sm w-100 touch-target mb-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!q.file_url}
                      title="پرسش نامه را دانلود نموده بعد از تکمیل نمودن آنرا با استفاده از کلید اپلود، اپلود نمایید."
                    >
                      <i className="fas fa-eye me-1"></i>
                      دانلود
                    </a>
                    <button
                      className={`btn ${uploading[q.id] || uploaded[q.id] ? 'btn-secondary' : 'btn-outline-info'} btn-sm w-100 touch-target`}
                      type="button"
                      onClick={() => handleUploadClick(q.id)}
                      disabled={uploading[q.id] || uploaded[q.id]}
                      title={uploaded[q.id] ? 'شما قبلاً برای این پرسشنامه فایل ارسال کرده‌اید.' : 'پرسش نامه خانه پری شده را با استفاده از این قسمت اضافه نمایید.'}
                    >
                      {uploading[q.id] ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          در حال ارسال...
                        </>
                      ) : uploaded[q.id] ? (
                        <>
                          <i className="fas fa-check-circle me-2 text-success"></i>
                          ارسال شد
                        </>
                      ) : (
                        <>
                          <span role="img" aria-label="upload" style={{ marginLeft: 4 }}>📤</span>
                          اپلود پرسش نامه شما
                        </>
                      )}
                    </button>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      ref={el => (fileInputs.current[q.id] = el)}
                      onChange={e => handleFileChange(e, q)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-8">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      title="صفحه قبلی"
                    >
                      قبلی
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(i + 1)}
                        title={`صفحه ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      title="صفحه بعدی"
                    >
                      بعدی
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
      {/* CSS for dark and light theme, responsive design and skeleton loading (copied from DocumentsPage.jsx) */}
      <style>{`
        .dark-container {
          background: #121212;
          min-height: 100vh;
          padding: 1rem 0;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .light-container {
          background: #ffffff;
          min-height: 100vh;
          padding: 1rem 0;
          color: #333333;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dark-card {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          color: #ffffff;
          height: 100%;
        }
        .light-card {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          backdrop-filter: blur(2px);
          color: #333333;
          height: 100%;
        }
        .dark-text {
          color: #ffffff !important;
        }
        .light-text {
          color: #0dcaf0 !important;
        }
        .dark-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
        }
        .light-input {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
          color: #333333 !important;
        }
        .dark-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #17a2b8 !important;
          box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25) !important;
          color: #ffffff !important;
        }
        .light-input:focus {
          background: rgba(0, 0, 0, 0.06) !important;
          border-color: #0dcaf0 !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.15) !important;
          color: #333333 !important;
        }
        .dark-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .light-input::placeholder {
          color: rgba(0, 0, 0, 0.4) !important;
        }
        .dark-input-group {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-right: none !important;
        }
        .light-input-group {
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid #0dcaf0 !important;
          border-right: none !important;
        }
        .dark-alert {
          background: rgba(220, 53, 69, 0.2) !important;
          border: 1px solid rgba(220, 53, 69, 0.3) !important;
          color: #ff6b6b !important;
        }
        .light-alert {
          background: rgba(13, 202, 240, 0.08) !important;
          border: 1px solid #0dcaf0 !important;
          color: #0dcaf0 !important;
        }
        .alert-success {
          background: rgba(25, 135, 84, 0.1) !important;
          border: 1px solid #198754 !important;
          color: #198754 !important;
        }
        .dark-alert.alert-success {
          background: rgba(25, 135, 84, 0.2) !important;
          border: 1px solid #20c997 !important;
          color: #20c997 !important;
        }
        .btn-outline-light {
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .btn-outline-light:hover,
        .btn-outline-light.active {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          color: #ffffff !important;
        }
        .skeleton-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }
        .skeleton-title {
          height: 16px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-badge {
          width: 60px;
          height: 20px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 10px;
        }
        .skeleton-text {
          height: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-text-short {
          width: 70%;
          height: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-button {
          height: 32px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease;
        }
        .card {
          transition: all 0.3s ease;
        }
        .text-muted {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .text-secondary {
          color: #0dcaf0 !important;
        }
        .btn-info {
          background: linear-gradient(45deg, #17a2b8, #20c997) !important;
          border: none !important;
          color: #ffffff !important;
        }
        .btn-info:hover {
          background: linear-gradient(45deg, #138496, #1ea085) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
        }
        .btn-outline-info {
          border: 1px solid #0dcaf0 !important;
          color: #0dcaf0 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        .btn-outline-info:hover {
          background: #0dcaf0 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 202, 240, 0.3);
        }
        .btn-outline-info:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .btn-secondary {
          background: #6c757d !important;
          border-color: #6c757d !important;
          color: #ffffff !important;
        }
        .btn-secondary:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
        /* Pagination Styles */
        .pagination {
          margin-bottom: 0;
        }
        .page-link {
          color: #0dcaf0 !important;
          background-color: transparent !important;
          border: 1px solid #0dcaf0 !important;
          margin: 0 2px;
          border-radius: 6px !important;
          transition: all 0.3s ease;
        }
        .page-link:hover {
          background-color: #0dcaf0 !important;
          color: #ffffff !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(13, 202, 240, 0.3);
        }
        .page-item.active .page-link {
          background-color: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
          color: #ffffff !important;
        }
        .page-item.disabled .page-link {
          color: #6c757d !important;
          border-color: #6c757d !important;
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-item.disabled .page-link:hover {
          background-color: transparent !important;
          color: #6c757d !important;
          transform: none;
          box-shadow: none;
        }
        /* Dark theme pagination */
        .dark-container .page-link {
          color: #20c997 !important;
          border-color: #20c997 !important;
        }
        .dark-container .page-link:hover {
          background-color: #20c997 !important;
          color: #ffffff !important;
        }
        .dark-container .page-item.active .page-link {
          background-color: #20c997 !important;
          border-color: #20c997 !important;
        }
        .dark-container .page-item.disabled .page-link {
          color: rgba(255, 255, 255, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        /* Responsive Design */
        .responsive-title {
          font-size: 1.5rem;
        }
        .responsive-subtitle {
          font-size: 0.9rem;
        }
        .responsive-text {
          font-size: 0.875rem;
        }
        .min-width-0 {
          min-width: 0;
        }
        .touch-target {
          min-height: 44px;
          padding: 0.5rem 1rem;
        }
        /* Mobile Optimizations */
        @media (max-width: 575.98px) {
          .dark-container, .light-container {
            padding: 0.5rem 0;
          }
          .responsive-title {
            font-size: 1.25rem;
          }
          .responsive-subtitle {
            font-size: 0.8rem;
          }
          .card-body {
            padding: 1rem;
          }
          .btn-group {
            width: 100%;
          }
          .btn-group .btn {
            flex: 1;
          }
          .document-title {
            font-size: 0.95rem;
          }
        }
        /* Tablet Optimizations */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .responsive-title {
            font-size: 1.35rem;
          }
        }
        /* Desktop Optimizations */
        @media (min-width: 992px) {
          .responsive-title {
            font-size: 1.75rem;
          }
          .responsive-subtitle {
            font-size: 1rem;
          }
          .responsive-text {
            font-size: 0.9rem;
          }
          .document-title {
            font-size: 1.05rem;
          }
        }
        /* Large Desktop Optimizations */
        @media (min-width: 1200px) {
          .responsive-title {
            font-size: 2rem;
          }
        }
        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .hover-shadow:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
          }
          .btn-info:hover {
            transform: none;
          }
          .card {
            cursor: pointer;
          }
        }
        /* High DPI Display Optimizations */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dark-card, .light-card {
            border-width: 0.5px;
          }
        }
        /* Add this for document title size and style */
        .document-title {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

export default Questionnaires;
