import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import debounce from 'lodash/debounce';
import { useTheme } from "../contexts/ThemeContext";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [educationalCenters, setEducationalCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(false);
  const [centersError, setCentersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCenters, setTotalCenters] = useState(0);
  const [stageCounts, setStageCounts] = useState({ stage1: 0, stage2: 0, stage3: 0, total: 0 });
  const [unansweredQuestionsCount, setUnansweredQuestionsCount] = useState(0);
  const [updatingStage, setUpdatingStage] = useState(null);
  const usersPerPage = 15;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('خطا در دریافت اطلاعات کاربر');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchEducationalCenters = async (retryCount = 0) => {
    try {
      setIsSearching(true);
      const response = await axios.get(
        `http://localhost:5000/api/educational-centers?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`,
        {
          withCredentials: true,
        }
      );
      
      setEducationalCenters(response.data.centers);
      setTotalPages(response.data.totalPages);
      setTotalCenters(response.data.total);
      setCentersError(null);
    } catch (err) {
      console.error('Error fetching educational centers:', err);
      if (retryCount < 3) {
        setTimeout(() => {
          fetchEducationalCenters(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setCentersError('خطا در دریافت اطلاعات مراکز آموزشی. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setCentersLoading(false);
      setIsSearching(false);
    }
  };

  const fetchStageCounts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/educational-centers/stats/stages',
        {
          withCredentials: true,
        }
      );
      setStageCounts(response.data);
    } catch (err) {
      console.error('Error fetching stage counts:', err);
    }
  };

  const fetchUnansweredQuestionsCount = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/questions/admin/unanswered-count',
        {
          withCredentials: true,
        }
      );
      setUnansweredQuestionsCount(response.data.count || 0);
    } catch (err) {
      console.error('Error fetching unanswered questions count:', err);
      setUnansweredQuestionsCount(0);
    }
  };

  // Debounced search function
  const debouncedFetchEducationalCenters = useCallback(
    debounce(() => {
      fetchEducationalCenters();
    }, 500),
    [currentPage, searchQuery]
  );

  useEffect(() => {
    debouncedFetchEducationalCenters();
    fetchStageCounts();
    fetchUnansweredQuestionsCount();
    return () => {
      debouncedFetchEducationalCenters.cancel();
    };
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStageChange = async (centerId, stage, checked) => {
    try {
      setUpdatingStage(centerId);
      
      // Find the current center data
      const center = educationalCenters.find(c => c.id === centerId);
      if (!center) return;

      // Prepare stage data
      const stageData = {
        stage1: center.stage1 === 1,
        stage2: center.stage2 === 1,
        stage3: center.stage3 === 1
      };

      // Update the specific stage
      stageData[stage] = checked;

      await axios.put(
        `http://localhost:5000/api/educational-centers/${centerId}/stage`,
        stageData,
        {
          withCredentials: true,
        }
      );

      // Update local state
      setEducationalCenters(prev => 
        prev.map(c => 
          c.id === centerId 
            ? { ...c, [stage]: checked ? 1 : 0 }
            : c
        )
      );

      // Refresh stage counts
      fetchStageCounts();
    } catch (err) {
      console.error('Error updating stage:', err);
      alert('خطا در بروزرسانی مرحله');
    } finally {
      setUpdatingStage(null);
    }
  };

  const handleViewCenter = (userId) => {
    navigate(`/institute/${userId}`);
  };

  if (loading) {
    return (
      <div className={theme === 'light' ? 'light-container' : 'dark-container'}>
        <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={theme === 'light' ? 'light-container' : 'dark-container'}>
        <div className="alert alert-danger m-4" role="alert">
        {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={theme === 'light' ? 'light-container' : 'dark-container'}>
        <div className="alert alert-warning m-4" role="alert">
        کاربر یافت نشد
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === 'light' ? 'light-container' : 'dark-container'} px-4 py-8`} style={{ width: '100%', maxWidth: '100%', minHeight: '100vh' }}>
      <style>{`
        .dark-container {
          background: #121212;
          color: #ffffff;
        }
        .light-container {
          background: #fff;
          color: #23283a;
        }
        .light-container .card {
          background: #f8fafd !important;
          border: 1px solid #b6eaff !important;
          color: #23283a !important;
        }
        .dark-container .card {
          background: #1e1e1e !important;
          border: 1px solid #333 !important;
          color: #ffffff !important;
        }
        .light-container .card-title {
          color: #0dcaf0 !important;
        }
        .dark-container .card-title {
          color: #007bff !important;
        }
        .light-container .card-text {
          color: #20c997 !important;
        }
        .dark-container .card-text {
          color: #cccccc !important;
        }
        .light-container .alert-danger {
          background: #fff0f0 !important;
          border: 1px solid #ff6b6b !important;
          color: #ff6b6b !important;
        }
        .dark-container .alert-danger {
          background: #1e1e1e !important;
          border: 1px solid #dc3545 !important;
          color: #ff6b6b !important;
        }
        .light-container .alert-warning {
          background: #fffbe6 !important;
          border: 1px solid #ffd54f !important;
          color: #ffc107 !important;
        }
        .dark-container .alert-warning {
          background: #1e1e1e !important;
          border: 1px solid #ffc107 !important;
          color: #ffd54f !important;
        }
        /* --- TABLE LIGHT MODE --- */
        .light-container .table {
          background: #fff !important;
          color: #23283a !important;
        }
        .light-container thead {
          background: #e0f7fa !important;
        }
        .light-container th, .light-container td {
          background: #fff !important;
          color: #23283a !important;
          border-color: #b6eaff !important;
        }
        .light-container tr {
          background: #fff !important;
        }
        .light-container tr:nth-child(even) {
          background: #f8fafd !important;
        }
        /* --- END TABLE LIGHT MODE --- */
        .dark-container .table {
          background: #121212 !important;
          color: #ffffff !important;
        }
        .dark-container thead {
          background: #1e1e1e !important;
        }
        .dark-container th, .dark-container td {
          border-color: #333 !important;
        }
        .dark-container tr {
          background: #121212 !important;
        }
        .dark-container tr:nth-child(even) {
          background: #1a1a1a !important;
        }
        .light-container .form-check-label {
          color: #20c997 !important;
        }
        .dark-container .form-check-label {
          color: #ffffff !important;
        }
        .light-container .form-check-input:checked {
          background-color: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
        }
        .dark-container .form-check-input:checked {
          background-color: #007bff !important;
          border-color: #007bff !important;
        }
        .light-container .form-check-input {
          background-color: #fff !important;
          border-color: #b6eaff !important;
        }
        .dark-container .form-check-input {
          background-color: #1e1e1e !important;
          border-color: #333 !important;
        }
        .light-container .page-link {
          background: #fff !important;
          border-color: #0dcaf0 !important;
          color: #0dcaf0 !important;
        }
        .dark-container .page-link {
          background: #1e1e1e !important;
          border-color: #333 !important;
          color: #ffffff !important;
        }
        .light-container .page-item.active .page-link {
          background: #0dcaf0 !important;
          color: #fff !important;
          border-color: #20c997 !important;
        }
        .dark-container .page-item.active .page-link {
          background: #007bff !important;
          color: #fff !important;
          border-color: #007bff !important;
        }
        .light-container .rounded-lg {
          background: #fff !important;
          color: #23283a !important;
          border: 1px solid #b6eaff !important;
        }
        .dark-container .rounded-lg {
          background: #1e1e1e !important;
          color: #ffffff !important;
          border: 1px solid #333 !important;
        }
        .light-container .fw-bold {
          color: #23283a !important;
        }
        .dark-container .fw-bold {
          color: #ffffff !important;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          70% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
          }
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-6 text-center">مدیریت مراکز آموزشی</h1>
      
      {/* Statistics Cards */}
      <div className="row mb-6 d-flex justify-content-center">
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.total}</h5>
              <p className="card-text">کل مراکز</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.stage3}</h5>
              <p className="card-text">تایید شده</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{stageCounts.stage2}</h5>
              <p className="card-text">در حال بررسی</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <div className="card text-center position-relative" 
               style={{ cursor: 'pointer' }}
               onClick={() => navigate('/checking-questionnaires')}
               onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
               onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div className="card-body">
              <h5 className="card-title">پرسش نامه ها</h5>
              <p className="card-text">تحلیل پرسش نامه ها</p>
            </div>
            {unansweredQuestionsCount > 0 && (
              <div 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000,
                  animation: 'pulse 2s infinite'
                }}
              >
                {unansweredQuestionsCount}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-2 mb-2">
          <div className="card text-center position-relative" 
               style={{ cursor: 'pointer' }}
               onClick={() => navigate('/answer-to-questions')}
               onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
               onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div className="card-body">
              <h5 className="card-title">سوالات </h5>
              <p className="card-text">مدیریت سوالات</p>
            </div>
            {unansweredQuestionsCount > 0 && (
              <div 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000,
                  animation: 'pulse 2s infinite'
                }}
              >
                {unansweredQuestionsCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ width: '100%', maxWidth: '100%' }} className="mb-6">
        <div className="position-relative">
          <input
            type="text"
            placeholder="جستجو در مراکز آموزشی..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ 
              width: '100%', 
              background: '#1e1e1e', 
              border: '1px solid #333', 
              color: '#ffffff',
              padding: '8px 12px'
            }}
            className="rounded-lg text-right"
          />
          {isSearching && (
            <div className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">در حال جستجو...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {centersError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {centersError}
          <button type="button" className="btn-close" onClick={() => setCentersError(null)} style={{ filter: 'invert(1)' }}></button>
        </div>
      )}

      {/* Educational Centers Table */}
      <div style={{ width: '100%', maxWidth: '100%' }} className="overflow-x-auto">
        <table style={{ width: '100%', background: '#121212' }} className="table">
          <thead style={{ background: '#1e1e1e' }}>
            <tr>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>نام مرکز</th>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>نام شخص رابط</th>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>شماره تماس</th>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>ایمیل</th>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>مرحله</th>
              <th style={{ color: '#ffffff', borderColor: '#333', background: '#1e1e1e' }}>مشاهده</th>
            </tr>
          </thead>
          <tbody style={{ background: '#121212' }}>
            {educationalCenters.map((center, index) => (
              <tr key={center.id} style={{ 
                borderColor: '#333', 
                background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
              }}>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold" style={{ color: '#ffffff' }}>{center.centerName || 'نامشخص'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>{center.contactName || 'نامشخص'}</td>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>{center.phoneNumber || 'نامشخص'}</td>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>{center.email}</td>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>
                  <div className="d-flex flex-column gap-1">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage1 === 1}
                        onChange={(e) => handleStageChange(center.id, 'stage1', e.target.checked)}
                        disabled={updatingStage === center.id}
                        style={{ 
                          backgroundColor: center.stage1 === 1 ? '#007bff' : '#1e1e1e',
                          borderColor: '#333'
                        }}
                      />
                      <label className="form-check-label" style={{ color: '#ffffff', fontSize: '12px' }}>
                        مرحله اول
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage2 === 1}
                        onChange={(e) => handleStageChange(center.id, 'stage2', e.target.checked)}
                        disabled={updatingStage === center.id}
                        style={{ 
                          backgroundColor: center.stage2 === 1 ? '#007bff' : '#1e1e1e',
                          borderColor: '#333'
                        }}
                      />
                      <label className="form-check-label" style={{ color: '#ffffff', fontSize: '12px' }}>
                        مرحله دوم
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={center.stage3 === 1}
                        onChange={(e) => handleStageChange(center.id, 'stage3', e.target.checked)}
                        disabled={updatingStage === center.id}
                        style={{ 
                          backgroundColor: center.stage3 === 1 ? '#007bff' : '#1e1e1e',
                          borderColor: '#333'
                        }}
                      />
                      <label className="form-check-label" style={{ color: '#ffffff', fontSize: '12px' }}>
                        مرحله سوم
                      </label>
                    </div>
                  </div>
                </td>
                <td style={{ 
                  color: '#ffffff', 
                  borderColor: '#333', 
                  background: index % 2 === 0 ? '#121212' : '#1a1a1a' 
                }}>
                  <button 
                    className="btn btn-outline-primary btn-sm" 
                    style={{ borderColor: '#007bff'}}
                    onClick={() => handleViewCenter(center.user_id)}
                  >
                   بررسی
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {educationalCenters.length === 0 && !centersLoading && !centersError && (
        <div className="text-center py-5">
          <div style={{ color: '#888888' }}>
            {searchQuery ? 'هیچ مرکز آموزشی با این جستجو یافت نشد' : 'هیچ مرکز آموزشی ثبت نشده است'}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ 
                  background: '#1e1e1e', 
                  borderColor: '#333', 
                  color: '#ffffff' 
                }}
              >
                قبلی
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                  style={{ 
                    background: currentPage === index + 1 ? '#007bff' : '#1e1e1e', 
                    borderColor: '#333', 
                    color: currentPage === index + 1 ? '#ffffff' : '#ffffff' 
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ 
                  background: '#1e1e1e', 
                  borderColor: '#333', 
                  color: '#ffffff' 
                }}
              >
                بعدی
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default EmployeeProfile; 