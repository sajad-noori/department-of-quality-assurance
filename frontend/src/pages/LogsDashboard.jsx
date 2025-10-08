import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const containerStyle = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '1rem',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  direction: 'rtl',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  border: '1px solid #333333',
};

const titleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '2rem',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center',
};

const subtitleStyle = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#cccccc',
  textAlign: 'center',
};

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const statItemStyle = {
  textAlign: 'center',
  padding: '0.75rem',
  borderRadius: '8px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
};

const statValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#00d4ff',
  marginBottom: '0.25rem',
};

const statLabelStyle = {
  fontSize: '0.75rem',
  color: '#999999',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const filtersContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const filterInputStyle = {
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const filterInputFocusStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#00d4ff',
  border: 'none',
  color: '#000000',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
};

const buttonHoverStyle = {
  backgroundColor: '#00b8e6',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
};

const buttonSecondaryStyle = {
  ...buttonStyle,
  backgroundColor: '#666666',
  color: '#ffffff',
};

const buttonSecondaryHoverStyle = {
  backgroundColor: '#555555',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(102, 102, 102, 0.3)',
};

const tableContainerStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '1.5rem',
  border: '1px solid #333333',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  color: '#ffffff',
};

const tableHeaderStyle = {
  backgroundColor: '#2d2d2d',
  borderBottom: '2px solid #333333',
};

const tableHeaderCellStyle = {
  padding: '1rem 0.75rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#ffffff',
  borderBottom: '1px solid #333333',
};

const tableCellStyle = {
  padding: '0.75rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: '#cccccc',
  borderBottom: '1px solid #333333',
};

const actionBadgeStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const actionBadgeLoginStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(40, 167, 69, 0.2)',
  color: '#28a745',
};

const actionBadgeCommentStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(0, 212, 255, 0.2)',
  color: '#00d4ff',
};

const actionBadgeDownloadStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(255, 193, 7, 0.2)',
  color: '#ffc107',
};

const actionBadgeVisitStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(108, 117, 125, 0.2)',
  color: '#6c757d',
};

const actionBadgeQuestionStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(220, 53, 69, 0.2)',
  color: '#dc3545',
};

const actionBadgeAdminStyle = {
  ...actionBadgeStyle,
  backgroundColor: 'rgba(111, 66, 193, 0.2)',
  color: '#6f42c1',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem',
  color: '#999999',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid #333333',
  borderTop: '3px solid #00d4ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginRight: '1rem',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem 1rem',
  color: '#999999',
};

const emptyStateIconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
  opacity: 0.5,
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '1.5rem',
  padding: '1rem',
};

const pageButtonStyle = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #333333',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};

const activePageButtonStyle = {
  ...pageButtonStyle,
  backgroundColor: '#00d4ff',
  color: '#000000',
  borderColor: '#00d4ff',
};

const disabledPageButtonStyle = {
  ...pageButtonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
};

const LogsDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    userId: '',
    action: '',
    date: ''
  });
  const [availableActions, setAvailableActions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchLogs = async (retryCount = 0) => {
    try {
      setIsSearching(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...filters
      });

      const response = await axios.get(`${API_BASE_URL}/api/logs?${params}`, {
        withCredentials: true
      });

      setLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching logs:', err);
      if (retryCount < 3) {
        setTimeout(() => {
          fetchLogs(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setError('خطا در دریافت لاگ‌ها. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/logs/statistics`, {
        withCredentials: true
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchAvailableActions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/logs/actions`, {
        withCredentials: true
      });
      setAvailableActions(response.data.data);
    } catch (err) {
      console.error('Error fetching actions:', err);
    }
  };

  const debouncedFetchLogs = useCallback(
    debounce(() => {
      fetchLogs();
    }, 500),
    [currentPage, filters]
  );

  useEffect(() => {
    fetchStats();
    fetchAvailableActions();
  }, []);

  useEffect(() => {
    debouncedFetchLogs();
    return () => {
      debouncedFetchLogs.cancel();
    };
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        ...filters
      });

      const response = await axios.get(`${API_BASE_URL}/api/logs/export?${params}`, {
        withCredentials: true,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting logs:', err);
      alert('خطا در صادرات لاگ‌ها');
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید لاگ‌های قدیمی را حذف کنید؟')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/logs/cleanup`, {
        withCredentials: true,
        data: { daysOld: 90 }
      });
      
      alert('لاگ‌های قدیمی با موفقیت حذف شدند');
      fetchLogs();
      fetchStats();
    } catch (err) {
      console.error('Error cleaning up logs:', err);
      alert('خطا در پاکسازی لاگ‌ها');
    }
  };

  const getActionBadgeStyle = (action) => {
    switch (action) {
      case 'login':
        return actionBadgeLoginStyle;
      case 'comment':
        return actionBadgeCommentStyle;
      case 'download':
        return actionBadgeDownloadStyle;
      case 'visit':
        return actionBadgeVisitStyle;
      case 'question':
        return actionBadgeQuestionStyle;
      case 'admin_action':
        return actionBadgeAdminStyle;
      default:
        return actionBadgeStyle;
    }
  };

  const getActionLabel = (action) => {
    const actionLabels = {
      'login': 'ورود به سیستم',
      'comment': 'نظر',
      'download': 'دانلود',
      'visit': 'بازدید',
      'question': 'سوال',
      'admin_action': 'عملیات مدیریتی'
    };
    return actionLabels[action] || action;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fa-IR');
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <span>در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <div style={emptyStateIconStyle}>⚠️</div>
          <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>خطا</h3>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => fetchLogs()}
            style={buttonStyle}
          >
            <span>🔄</span>
            <span>تلاش مجدد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>داشبورد لاگ‌ها</h1>
        <p style={subtitleStyle}>مشاهده و مدیریت فعالیت‌های کاربران</p>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.totalLogs || 0}</div>
            <div style={statLabelStyle}>کل لاگ‌ها</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.topActions?.[0]?.count || 0}</div>
            <div style={statLabelStyle}>محبوب‌ترین عملیات</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{Object.keys(stats.dailyActivity || {}).length}</div>
            <div style={statLabelStyle}>روزهای فعال</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{Object.keys(stats.actionBreakdown || {}).length}</div>
            <div style={statLabelStyle}>انواع عملیات</div>
          </div>
        </div>
      </div>

      <div style={filtersContainerStyle}>
        <input
          type="text"
          placeholder="جستجو در لاگ‌ها..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          style={filterInputStyle}
        />
        
        <input
          type="text"
          placeholder="شناسه کاربر"
          value={filters.userId}
          onChange={(e) => handleFilterChange('userId', e.target.value)}
          style={filterInputStyle}
        />
        
        <select
          value={filters.action}
          onChange={(e) => handleFilterChange('action', e.target.value)}
          style={filterInputStyle}
        >
          <option value="">همه عملیات</option>
          {availableActions.map(action => (
            <option key={action} value={action}>
              {getActionLabel(action)}
            </option>
          ))}
        </select>
        
        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          style={filterInputStyle}
        />
        
        <button
          onClick={handleExport}
          style={buttonStyle}
        >
          <span>📊</span>
          <span>صادرات CSV</span>
        </button>
        
        <button
          onClick={handleCleanup}
          style={buttonSecondaryStyle}
        >
          <span>🗑️</span>
          <span>پاکسازی</span>
        </button>
      </div>

      <div style={tableContainerStyle}>
        <h3 style={{ marginBottom: '1.5rem', color: '#ffffff' }}>لاگ‌های سیستم</h3>
        
        {logs.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📝</div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
              هیچ لاگی یافت نشد
            </h4>
            <p style={{ color: '#999999' }}>
              {filters.search || filters.userId || filters.action || filters.date 
                ? 'هیچ لاگی با فیلترهای انتخاب شده یافت نشد'
                : 'هنوز هیچ لاگی در سیستم ثبت نشده است'
              }
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableHeaderCellStyle}>کاربر</th>
                  <th style={tableHeaderCellStyle}>نقش</th>
                  <th style={tableHeaderCellStyle}>عملیات</th>
                  <th style={tableHeaderCellStyle}>جزئیات</th>
                  <th style={tableHeaderCellStyle}>IP</th>
                  <th style={tableHeaderCellStyle}>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={tableCellStyle}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#ffffff' }}>
                          {log.user_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#999999' }}>
                          {log.user_email}
                        </div>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={getActionBadgeStyle(log.user_role)}>
                        {log.user_role}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={getActionBadgeStyle(log.action)}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                        {log.details || '-'}
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '0.75rem' }}>
                        {log.ip_address || '-'}
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '0.75rem' }}>
                        {formatDate(log.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={currentPage === 1 ? disabledPageButtonStyle : pageButtonStyle}
          >
            قبلی
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={currentPage === index + 1 ? activePageButtonStyle : pageButtonStyle}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={currentPage === totalPages ? disabledPageButtonStyle : pageButtonStyle}
          >
            بعدی
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LogsDashboard; 