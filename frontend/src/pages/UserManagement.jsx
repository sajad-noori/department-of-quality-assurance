import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Logs component for viewing user activity
const UserLogs = ({ userId, userName, onClose }) => {
  // PropTypes validation
  UserLogs.propTypes = {
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  };
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/logs/user/${userId}?page=${currentPage}&limit=10&action=${actionFilter}`,
        { withCredentials: true }
      );
      setLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت فعالیت های کاربر');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [userId, currentPage, actionFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fa-IR');
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

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return roleBadgeAdminStyle;
      case 'institute':
        return roleBadgeInstituteStyle;
      case 'employee':
        return roleBadgeEmployeeStyle;
      default:
        return roleBadgeUserStyle;
    }
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    border: '1px solid #333333',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>✕</button>
        
        <h2 style={{ color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>
          فعالیت های کاربر: {userName}
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">همه عملیات</option>
            <option value="login">ورود</option>
            <option value="comment">نظر</option>
            <option value="download">دانلود</option>
            <option value="visit">بازدید</option>
            <option value="question">سوال</option>
            <option value="admin_action">عملیات مدیریتی</option>
          </select>
        </div>

        {loading ? (
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <span>در حال بارگذاری...</span>
          </div>
        ) : error ? (
          <div style={errorMessageStyle}>
            <span>❌ {error}</span>
          </div>
        ) : logs.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📝</div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
              هیچ فعالیتی یافت نشد
            </h4>
            <p style={{ color: '#999999' }}>
              این کاربر هنوز هیچ فعالیتی نداشته است
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
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
                      <span style={getRoleBadgeStyle(log.action)}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{log.details || '-'}</td>
                    <td style={tableCellStyle}>{log.ip_address || '-'}</td>
                    <td style={tableCellStyle}>{formatDate(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={paginationStyle}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={currentPage === 1 ? disabledPageButtonStyle : pageButtonStyle}
            >
              قبلی
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={currentPage === index + 1 ? activePageButtonStyle : pageButtonStyle}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={currentPage === totalPages ? disabledPageButtonStyle : pageButtonStyle}
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// All Logs component for viewing all user activity
const AllLogsModal = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [instituteFilter, setInstituteFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Unique list of institutes from logs
  const instituteOptions = Array.from(
    new Set(logs.map(log => log.institute_name).filter(Boolean))
  );

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/logs?page=${currentPage}&limit=10&action=${actionFilter}&search=${search}`,
        { withCredentials: true }
      );
      setLogs(response.data.data.logs || response.data.data || response.data.logs || []);
      setTotalPages(response.data.data?.pagination?.totalPages || response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت فعالیت ها');
      console.error('Error fetching all logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [currentPage, actionFilter, search]);

  // Filtering and sorting
  let filteredLogs = logs;
  if (instituteFilter) {
    filteredLogs = filteredLogs.filter(log => log.institute_name === instituteFilter);
  }
  if (dateFrom) {
    filteredLogs = filteredLogs.filter(log => log.created_at && log.created_at.slice(0, 10) >= dateFrom);
  }
  if (dateTo) {
    filteredLogs = filteredLogs.filter(log => log.created_at && log.created_at.slice(0, 10) <= dateTo);
  }
  // Sorting
  if (sortField) {
    filteredLogs = [...filteredLogs].sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      if (sortField === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('fa-IR');

  const getActionLabel = (action) => {
    const actionLabels = {
      'login': 'ورود به سیستم',
      'comment': 'نظر',
      'download': 'دانلود',
      'visit': 'بازدید',
      'question': 'سوال',
      'admin_action': 'عملیات مدیریتی',
      'system_cleanup': 'پاکسازی سیستم'
    };
    return actionLabels[action] || action;
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '2rem', maxWidth: '1000px', width: '95%', maxHeight: '85vh', overflow: 'auto', border: '1px solid #333', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }} onClick={onClose}>✕</button>
        <h2 style={{ color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>فعالیت های کلی سیستم</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={selectStyle}>
            <option value="">همه عملیات</option>
            <option value="login">ورود</option>
            <option value="comment">نظر</option>
            <option value="download">دانلود</option>
            <option value="visit">بازدید</option>
            <option value="question">سوال</option>
            <option value="admin_action">عملیات مدیریتی</option>
            <option value="system_cleanup">پاکسازی سیستم</option>
          </select>
          <input
            type="text"
            placeholder="جستجو نام/ایمیل کاربر..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ ...searchInputStyle, minWidth: 200 }}
          />
          <select value={instituteFilter} onChange={e => setInstituteFilter(e.target.value)} style={selectStyle}>
            <option value="">همه مراکز آموزشی</option>
            {instituteOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: 2 }}>از تاریخ</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ ...searchInputStyle, minWidth: 140 }}
            />
            <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>
              {new Date(dateFrom || new Date().toISOString().slice(0, 10)).toLocaleDateString('fa-IR')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: 2 }}>تا تاریخ</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ ...searchInputStyle, minWidth: 140 }}
            />
            <span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>
              {new Date(dateTo || new Date().toISOString().slice(0, 10)).toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
        {loading ? (
          <div style={loadingStyle}>
            <div style={spinnerStyle}></div>
            <span>در حال بارگذاری...</span>
          </div>
        ) : error ? (
          <div style={errorMessageStyle}>
            <span>❌ {error}</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📝</div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>هیچ فعالیتی یافت نشد</h4>
            <p style={{ color: '#999' }}>هنوز هیچ فعالیتی ثبت نشده است</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableHeaderCellStyle}>نام کاربر</th>
                  <th style={tableHeaderCellStyle}>ایمیل</th>
                  <th style={tableHeaderCellStyle}>عملیات</th>
                  <th style={tableHeaderCellStyle}>جزئیات</th>
                  <th style={tableHeaderCellStyle}>IP</th>
                  <th
                    style={{ ...tableHeaderCellStyle, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('created_at') }
                  >
                    تاریخ {sortField === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    style={{ ...tableHeaderCellStyle, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('institute_name') }
                  >
                    نام مرکز آموزشی {sortField === 'institute_name' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={tableCellStyle}>{log.user_name || '-'}</td>
                    <td style={tableCellStyle}>{log.user_email || '-'}</td>
                    <td style={tableCellStyle}>{getActionLabel(log.action)}</td>
                    <td style={tableCellStyle}>{log.details || '-'}</td>
                    <td style={tableCellStyle}>{log.ip_address || '-'}</td>
                    <td style={tableCellStyle}>{formatDate(log.created_at)}</td>
                    <td style={tableCellStyle}>{log.institute_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div style={paginationStyle}>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={currentPage === 1 ? disabledPageButtonStyle : pageButtonStyle}>قبلی</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)} style={currentPage === idx + 1 ? activePageButtonStyle : pageButtonStyle}>{idx + 1}</button>
            ))}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={currentPage === totalPages ? disabledPageButtonStyle : pageButtonStyle}>بعدی</button>
          </div>
        )}
      </div>
    </div>
  );
};

AllLogsModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

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
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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

const searchContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap',
};

const searchInputStyle = {
  flex: 1,
  minWidth: '250px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '6px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const searchInputFocusStyle = {
  borderColor: '#00d4ff',
  boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.1)',
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

const tableRowHoverStyle = {
  backgroundColor: '#2a2a2a',
};

const selectStyle = {
  padding: '0.5rem',
  fontSize: '0.875rem',
  border: '1px solid #333333',
  borderRadius: '4px',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const selectFocusStyle = {
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

const buttonSuccessStyle = {
  ...buttonStyle,
  backgroundColor: '#28a745',
  color: '#ffffff',
};

const buttonSuccessHoverStyle = {
  backgroundColor: '#218838',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
};

const roleBadgeStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const roleBadgeAdminStyle = {
  ...roleBadgeStyle,
  backgroundColor: 'rgba(220, 53, 69, 0.2)',
  color: '#dc3545',
};

const roleBadgeInstituteStyle = {
  ...roleBadgeStyle,
  backgroundColor: 'rgba(40, 167, 69, 0.2)',
  color: '#28a745',
};

const roleBadgeUserStyle = {
  ...roleBadgeStyle,
  backgroundColor: 'rgba(0, 212, 255, 0.2)',
  color: '#00d4ff',
};

const roleBadgeEmployeeStyle = {
  ...roleBadgeStyle,
  backgroundColor: 'rgba(255, 193, 7, 0.2)',
  color: '#ffc107',
};

const messageStyle = {
  padding: '1rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const successMessageStyle = {
  ...messageStyle,
  backgroundColor: 'rgba(40, 167, 69, 0.2)',
  color: '#28a745',
  border: '1px solid rgba(40, 167, 69, 0.3)',
};

const errorMessageStyle = {
  ...messageStyle,
  backgroundColor: 'rgba(220, 53, 69, 0.2)',
  color: '#dc3545',
  border: '1px solid rgba(220, 53, 69, 0.3)',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  fontSize: '1.2rem',
  cursor: 'pointer',
  marginRight: 'auto',
  padding: '0',
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 15;

  const roles = [
    { value: 'user', label: 'کاربر عادی' },
    { value: 'institute', label: 'مرکز آموزشی' },
    { value: 'admin', label: 'مدیر' },
    { value: 'employee', label: "کارمند"}
  ];

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return roleBadgeAdminStyle;
      case 'institute':
        return roleBadgeInstituteStyle;
      case 'employee':
        return roleBadgeEmployeeStyle;
      default:
        return roleBadgeUserStyle;
    }
  };

  const fetchUsers = async (retryCount = 0) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`${API_BASE_URL}/api/users?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`, {
        withCredentials: true
      });
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / usersPerPage));
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (retryCount < 3) {
        setTimeout(() => {
          fetchUsers(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setError('خطا در دریافت اطلاعات کاربران. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce(() => {
      fetchUsers();
    }, 500),
    [currentPage, searchQuery]
  );

  useEffect(() => {
    debouncedFetchUsers();
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRoleChange = (userId, newRole) => {
    setEditingUser({ id: userId, role: newRole });
  };

  const handleUpdateRole = async (userId) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(null);
      
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${userId}/role`,
        { role: editingUser.role },
        { withCredentials: true }
      );

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: editingUser.role } : user
      ));

      setUpdateSuccess('نقش کاربر با موفقیت بروزرسانی شد');
      setEditingUser(null);

      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'خطا در بروزرسانی نقش کاربر');
      console.error('Error updating user role:', err);
    }
  };

  const handleButtonHover = (e, type = 'primary') => {
    let style;
    switch (type) {
      case 'secondary':
        style = buttonSecondaryHoverStyle;
        break;
      case 'success':
        style = buttonSuccessHoverStyle;
        break;
      default:
        style = buttonHoverStyle;
    }
    Object.assign(e.currentTarget.style, style);
  };

  const handleButtonLeave = (e, type = 'primary') => {
    let style;
    switch (type) {
      case 'secondary':
        style = buttonSecondaryStyle;
        break;
      case 'success':
        style = buttonSuccessStyle;
        break;
      default:
        style = buttonStyle;
    }
    Object.assign(e.currentTarget.style, style);
  };

  const handleViewLogs = (user) => {
    setSelectedUser(user);
    setShowLogs(true);
  };

  const handleCloseLogs = () => {
    setShowLogs(false);
    setSelectedUser(null);
  };

  const stats = {
    total: users.length,
    admins: users.filter(user => user.role === 'admin').length,
    institutes: users.filter(user => user.role === 'institute').length,
    employees: users.filter(user => user.role === 'employee').length,
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
            onClick={() => fetchUsers()}
            style={buttonStyle}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e)}
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
        <h1 style={titleStyle}>مدیریت کاربران</h1>
        <p style={subtitleStyle}>کنترل و مدیریت کاربران سیستم</p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <button
            style={buttonStyle}
            onMouseEnter={e => handleButtonHover(e)}
            onMouseLeave={e => handleButtonLeave(e)}
            onClick={() => setShowAllLogs(true)}
          >
            <span>📋</span>
            <span>مشاهده همه فعالیت ها</span>
          </button>
        </div>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.total}</div>
            <div style={statLabelStyle}>کل کاربران</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.admins}</div>
            <div style={statLabelStyle}>مدیران</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.institutes}</div>
            <div style={statLabelStyle}>مراکز آموزشی</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{stats.employees}</div>
            <div style={statLabelStyle}>کارمندان</div>
          </div>
        </div>
      </div>

      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="جستجو در کاربران..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            ...searchInputStyle,
            ...(searchFocused ? searchInputFocusStyle : {})
          }}
        />
        
        {isSearching && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00d4ff' }}>
            <div style={spinnerStyle}></div>
            <span style={{ fontSize: '0.875rem' }}>در حال جستجو...</span>
          </div>
        )}
      </div>

      {updateSuccess && (
        <div style={successMessageStyle}>
          <button
            onClick={() => setUpdateSuccess(null)}
            style={closeButtonStyle}
          >
            ✕
          </button>
          <span>✅ {updateSuccess}</span>
        </div>
      )}
      
      {updateError && (
        <div style={errorMessageStyle}>
          <button
            onClick={() => setUpdateError(null)}
            style={closeButtonStyle}
          >
            ✕
          </button>
          <span>❌ {updateError}</span>
        </div>
      )}

      <div style={tableContainerStyle}>
        <h3 style={{ marginBottom: '1.5rem', color: '#ffffff' }}>لیست کاربران</h3>
        
        {users.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>👥</div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
              {searchQuery ? 'هیچ کاربری یافت نشد' : 'هیچ کاربری وجود ندارد'}
            </h4>
            <p style={{ color: '#999999' }}>
              {searchQuery 
                ? `هیچ کاربری با عبارت "${searchQuery}" یافت نشد`
                : 'هنوز هیچ کاربری در سیستم ثبت نشده است'
              }
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead style={tableHeaderStyle}>
                <tr>
                  <th style={tableHeaderCellStyle}>نام کاربر</th>
                  <th style={tableHeaderCellStyle}>ایمیل</th>
                  <th style={tableHeaderCellStyle}>نقش</th>
                  <th style={tableHeaderCellStyle}>عملیات</th>
                  <th style={tableHeaderCellStyle}>فعالیت ها</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id}
                    style={{ transition: 'background-color 0.2s ease' }}
                  >
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.email}</td>
                    <td style={tableCellStyle}>
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={selectStyle}
                          onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, selectStyle)}
                        >
                          {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={getRoleBadgeStyle(user.role)}>
                          {roles.find(r => r.value === user.role)?.label || user.role}
                        </span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {editingUser?.id === user.id ? (
                        <div style={buttonGroupStyle}>
                          <button
                            style={buttonSuccessStyle}
                            onMouseEnter={(e) => handleButtonHover(e, 'success')}
                            onMouseLeave={(e) => handleButtonLeave(e, 'success')}
                            onClick={() => handleUpdateRole(user.id)}
                          >
                            <span>✅</span>
                            <span>ذخیره</span>
                          </button>
                          <button
                            style={buttonSecondaryStyle}
                            onMouseEnter={(e) => handleButtonHover(e, 'secondary')}
                            onMouseLeave={(e) => handleButtonLeave(e, 'secondary')}
                            onClick={() => setEditingUser(null)}
                          >
                            <span>❌</span>
                            <span>انصراف</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          style={buttonStyle}
                          onMouseEnter={(e) => handleButtonHover(e)}
                          onMouseLeave={(e) => handleButtonLeave(e)}
                          onClick={() => setEditingUser({ id: user.id, role: user.role })}
                        >
                          <span>✏️</span>
                          <span>ویرایش نقش</span>
                        </button>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        style={buttonStyle}
                        onMouseEnter={(e) => handleButtonHover(e)}
                        onMouseLeave={(e) => handleButtonLeave(e)}
                        onClick={() => handleViewLogs(user)}
                      >
                        <span>📊</span>
                        <span>مشاهده فعالیت</span>
                      </button>
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

      {showLogs && selectedUser && (
        <UserLogs
          userId={selectedUser.id}
          userName={selectedUser.name}
          onClose={handleCloseLogs}
        />
      )}
      {showAllLogs && (
        <AllLogsModal onClose={() => setShowAllLogs(false)} />
      )}
    </div>
  );
};

export default UserManagement; 