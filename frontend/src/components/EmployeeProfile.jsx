import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import debounce from 'lodash/debounce';

const EmployeeProfile = () => {
  const navigate = useNavigate();
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
      <div className="text-center p-4" style={{ background: '#121212', minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert" style={{ background: '#1e1e1e', border: '1px solid #dc3545', color: '#ff6b6b' }}>
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning m-4" role="alert" style={{ background: '#1e1e1e', border: '1px solid #ffc107', color: '#ffd54f' }}>
        کاربر یافت نشد
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', background: '#121212', minHeight: '100vh' }} className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#ffffff' }}>مدیریت مراکز آموزشی</h1>
      
      {/* Statistics Cards */}
      <div className="row mb-6">
        <div className="col-md-3 mb-3">
          <div className="card text-center" style={{ background: '#1e1e1e', border: '1px solid #333', color: '#ffffff' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#007bff' }}>{stageCounts.total}</h5>
              <p className="card-text" style={{ color: '#cccccc' }}>کل مراکز</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center" style={{ background: '#1e1e1e', border: '1px solid #333', color: '#ffffff' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#28a745' }}>{stageCounts.stage3}</h5>
              <p className="card-text" style={{ color: '#cccccc' }}>تایید شده</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center" style={{ background: '#1e1e1e', border: '1px solid #333', color: '#ffffff' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#ffc107' }}>{stageCounts.stage2}</h5>
              <p className="card-text" style={{ color: '#cccccc' }}>در حال بررسی</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center" style={{ background: '#1e1e1e', border: '1px solid #333', color: '#ffffff' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#17a2b8' }}>{stageCounts.stage1}</h5>
              <p className="card-text" style={{ color: '#cccccc' }}>در انتظار</p>
            </div>
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
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ background: '#1e1e1e', border: '1px solid #dc3545', color: '#ff6b6b' }}>
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